import {writeFile} from 'node:fs/promises';
import {original, image, product} from './product-columns.mjs';

const quote = value => "'" + value.replaceAll("'", "''") + "'";
const metadata = ['revision','created_at','updated_at'];
const roots = ['importacoes_catalogo','produtos_swift','arquivo_produtos_swift','auditoria_catalogo','sincronizacao_imagens_swift'];
const timestamp = column => `to_char(${column} AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`;

function mappedObject(spec, alias) {
  const fields = new Map();
  for (const [column, type, key] of spec) {
    let expression = `${alias}.${column}`;
    if (type === 'timestamptz') expression = timestamp(expression);
    if (type === 'varchar(128)' && ['codigo','codigo_produto'].includes(column)) {
      expression = `CASE WHEN ${expression} ~ '^-?[0-9]+$' THEN to_jsonb(${expression}::bigint) ELSE to_jsonb(${expression}) END`;
    }
    if (!fields.has(key)) fields.set(key, []);
    fields.get(key).push(expression);
  }
  return 'jsonb_strip_nulls(jsonb_build_object(' + [...fields].map(([key, expressions]) =>
    `${quote(key)},${expressions.length > 1 ? 'coalesce('+expressions.map(expression=>'to_jsonb('+expression+')').join(',')+')' : expressions[0]}`).join(',') + '))';
}

function values(spec, variable) {
  return spec.map(([,type,key,kind]) => {
    const field = `${variable}->${quote(key)}`;
    if (kind === 'strings') return `ARRAY(SELECT jsonb_array_elements_text(coalesce(${field},'[]'::jsonb)))::${type}`;
    if (kind === 'number') return `CASE WHEN jsonb_typeof(${field})='number' THEN (${variable}->>${quote(key)})::${type} END`;
    if (kind === 'string') return `CASE WHEN jsonb_typeof(${field})='string' THEN (${variable}->>${quote(key)})::${type} END`;
    return `(${variable}->>${quote(key)})::${type}`;
  });
}

function upsert(table, keys, spec, variable, extras = []) {
  const columns = [...keys.map(([column])=>column), ...spec.map(([column])=>column), ...extras.map(([column])=>column)];
  const expressions = [...keys.map(([,value])=>value), ...values(spec,variable), ...extras.map(([,value])=>value)];
  const updated = columns.filter(column=>!keys.some(([key])=>key===column));
  return `INSERT INTO epav_data.${table}(${columns.join(',')}) VALUES(${expressions.join(',')})
    ON CONFLICT(${keys.map(([column])=>column).join(',')}) DO UPDATE SET ${updated.map(column=>column+'=excluded.'+column).join(',')}`;
}

const archive = [['produto_origem_id','varchar(1500)','produtoId'],['motivo','varchar(80)','motivo'],
  ['versao_original','varchar(128)','versaoOriginal'],['duplicado_de','varchar(1500)','duplicadoDe'],['arquivado_em','timestamptz','arquivadoEm']];
const audit = [['produto_origem_id','varchar(1500)','produtoId'],['autor_uid','varchar(128)','autorUid'],
  ['autor_email','varchar(320)','autorEmail'],['criado_em','timestamptz','criadoEm']];
const sync = [['verificado_em','timestamptz','checkedAt'],['etag','varchar(1024)','etag'],
  ['last_modified','varchar(128)','lastModified'],['pixel_hash','varchar(64)','pixelHash'],
  ['url_origem','varchar(4096)','sourceUrl'],['status','varchar(80)','status']];
const imports = [['arquivo_origem','varchar(512)','arquivoOrigem'],['aba_origem','varchar(120)','abaOrigem'],
  ['colecao_origem','varchar(120)','colecao'],['projeto_firebase_origem','varchar(128)','projetoFirebase'],
  ['importacao_origem_id','varchar(1500)','importacaoId'],['schema_version','integer','schemaVersion'],
  ['sha256_origem','varchar(64)','sha256Origem'],['status','varchar(80)','status'],
  ['total_disponiveis','integer','totalDisponiveis'],['total_registros','integer','totalRegistros'],
  ['verificado_em','timestamptz','verificadoEm'],['campos_originais','varchar(240)[]','camposOriginais','strings']];

let sql = `-- Direct relational storage. No document/EAV tables are used by the new API.
-- JSON values are transient function parameters and responses, never stored columns.
LOCK TABLE epav_internal.records IN SHARE ROW EXCLUSIVE MODE;
`;
for (const table of roots) {
  sql += `ALTER TABLE epav_data.${table}
  ADD COLUMN revision uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT clock_timestamp();
UPDATE epav_data.${table} p SET revision=r.revision,created_at=r.created_at,updated_at=r.updated_at
  FROM epav_internal.records r WHERE p.registro_id=r.row_id;
ALTER TABLE epav_data.${table} ALTER COLUMN registro_id DROP NOT NULL;
`;
}
sql += `ALTER TABLE epav_data.produtos_swift_versoes ALTER COLUMN registro_id DROP NOT NULL;
ALTER TABLE epav_data.produtos_swift_versoes ADD COLUMN owner_id varchar(1500);
UPDATE epav_data.produtos_swift_versoes v SET owner_id=r.document_id FROM epav_internal.records r WHERE r.row_id=v.registro_id;
ALTER TABLE epav_data.produtos_swift_versoes ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE epav_data.produtos_swift_versoes ADD UNIQUE(owner_id,posicao);

CREATE FUNCTION epav_data.product_document(pid varchar,vid bigint DEFAULT NULL) RETURNS jsonb
LANGUAGE sql STABLE SET search_path=pg_catalog,epav_data AS $$
  SELECT ${mappedObject(product,'p')} || jsonb_build_object('id',p.source_id,'dadosOriginais',${mappedObject(original,'d')})
    || CASE WHEN i.present IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('imagemSwift',${mappedObject(image,'i')}) END
  FROM (
    SELECT p.id AS source_id,${product.map(([c])=>'p.'+c).join(',')} FROM epav_data.produtos_swift p WHERE vid IS NULL AND p.id=pid
    UNION ALL
    SELECT v.produto_origem_id,${product.map(([c])=>'v.'+c).join(',')} FROM epav_data.produtos_swift_versoes v WHERE vid IS NOT NULL AND v.id=vid
  ) p
  LEFT JOIN LATERAL (
    SELECT ${original.map(([c])=>'d.'+c).join(',')} FROM epav_data.produtos_swift_dados_originais d WHERE vid IS NULL AND d.produto_id=pid
    UNION ALL
    SELECT ${original.map(([c])=>'d.'+c).join(',')} FROM epav_data.versoes_produtos_dados_originais d WHERE vid IS NOT NULL AND d.versao_id=vid
  ) d ON true
  LEFT JOIN LATERAL (
    SELECT true AS present,${image.map(([c])=>'i.'+c).join(',')} FROM epav_data.produtos_swift_imagens i WHERE vid IS NULL AND i.produto_id=pid
    UNION ALL
    SELECT true,${image.map(([c])=>'i.'+c).join(',')} FROM epav_data.versoes_produtos_imagens i WHERE vid IS NOT NULL AND i.versao_id=vid
  ) i ON true
$$;

CREATE FUNCTION epav_data.document_data(c varchar,identifier varchar) RETURNS jsonb
LANGUAGE plpgsql STABLE SET search_path=pg_catalog,epav_data AS $$
DECLARE data jsonb;
BEGIN
  IF c='produtos_swift' THEN RETURN epav_data.product_document(identifier); END IF;
  IF c='arquivo_produtos_swift' THEN
    SELECT ${mappedObject(archive,'p')} || jsonb_build_object('duplicadoDe',p.duplicado_de,'dados',epav_data.product_document(NULL,p.dados_versao_id))
      INTO data FROM epav_data.arquivo_produtos_swift p WHERE id=identifier;
  ELSIF c='auditoria_catalogo' THEN
    SELECT ${mappedObject(audit,'p')} || jsonb_build_object('antes',epav_data.product_document(NULL,p.antes_versao_id),
      'depois',epav_data.product_document(NULL,p.depois_versao_id)) INTO data FROM epav_data.auditoria_catalogo p WHERE id=identifier;
  ELSIF c='importacoes_catalogo' THEN
    SELECT ${mappedObject(imports,'p')} INTO data FROM epav_data.importacoes_catalogo p WHERE id=identifier;
  ELSIF c='sincronizacao_imagens_swift' THEN
    SELECT ${mappedObject(sync,'p')} INTO data FROM epav_data.sincronizacao_imagens_swift p WHERE id=identifier;
  ELSE RAISE EXCEPTION 'Unknown collection' USING ERRCODE='22023';
  END IF;
  RETURN data;
END $$;

CREATE FUNCTION epav_data.list_documents(c varchar,cursor_id varchar,page_limit integer,identifier varchar,recent boolean)
RETURNS SETOF jsonb LANGUAGE plpgsql STABLE SET search_path=pg_catalog,epav_data AS $$
BEGIN
  IF c NOT IN (${roots.map(quote).join(',')}) OR page_limit NOT BETWEEN 1 AND 301
    THEN RAISE EXCEPTION 'Invalid query' USING ERRCODE='22023'; END IF;
  RETURN QUERY EXECUTE format(
    'SELECT jsonb_build_object(''id'',p.id,''revision'',p.revision,''updatedAt'',p.updated_at,
      ''data'',epav_data.document_data($1,p.id)) FROM epav_data.%I p
      WHERE ($4 IS NULL OR p.id=$4) AND
        CASE WHEN $5 THEN ($2='''' OR (p.created_at,p.id)<(SELECT created_at,id FROM epav_data.%I WHERE id=$2)) ELSE p.id>$2 END
      ORDER BY CASE WHEN $5 THEN p.created_at END DESC,CASE WHEN $5 THEN p.id END DESC,p.id LIMIT $3',c,c)
    USING c,cursor_id,page_limit,identifier,recent;
END $$;

CREATE FUNCTION epav_data.write_product_children(pid varchar,vid bigint,data jsonb) RETURNS void
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE source jsonb:=data->'dadosOriginais'; photo jsonb:=data->'imagemSwift';
BEGIN
  IF vid IS NULL THEN
    ${upsert('produtos_swift_dados_originais',[['produto_id','pid']],original,'source')};
    IF photo IS NULL OR photo='null'::jsonb THEN DELETE FROM epav_data.produtos_swift_imagens WHERE produto_id=pid;
    ELSE ${upsert('produtos_swift_imagens',[['produto_id','pid']],image,'photo')}; END IF;
  ELSE
    ${upsert('versoes_produtos_dados_originais',[['versao_id','vid']],original,'source')};
    IF photo IS NULL OR photo='null'::jsonb THEN DELETE FROM epav_data.versoes_produtos_imagens WHERE versao_id=vid;
    ELSE ${upsert('versoes_produtos_imagens',[['versao_id','vid']],image,'photo')}; END IF;
  END IF;
END $$;

CREATE FUNCTION epav_data.write_product_version(identifier varchar,version_position varchar,data jsonb) RETURNS bigint
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE vid bigint;
BEGIN
  ${upsert('produtos_swift_versoes',[['owner_id','identifier'],['posicao','version_position']],product,'data',[['produto_origem_id',"data->>'id'"]])}
    RETURNING id INTO vid;
  PERFORM epav_data.write_product_children(NULL,vid,data);
  RETURN vid;
END $$;

CREATE FUNCTION epav_data.save_document(c varchar,identifier varchar,expected varchar,data jsonb) RETURNS uuid
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE current_revision uuid; new_revision uuid:=gen_random_uuid(); saved_before bigint; saved_after bigint; saved_data bigint;
BEGIN
  IF c NOT IN (${roots.filter(t=>t!=='importacoes_catalogo').map(quote).join(',')})
    THEN RAISE EXCEPTION 'Invalid collection' USING ERRCODE='22023'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(c||'/'||identifier,17112026));
  EXECUTE format('SELECT revision FROM epav_data.%I WHERE id=$1 FOR UPDATE',c) INTO current_revision USING identifier;
  IF expected='' AND current_revision IS NOT NULL THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  IF expected IS NOT NULL AND expected<>'' AND (current_revision IS NULL OR current_revision::varchar<>expected)
    THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  IF c='produtos_swift' THEN
    ${upsert('produtos_swift',[['id','identifier']],product,'data',[['revision','new_revision'],['updated_at','clock_timestamp()']])};
    PERFORM epav_data.write_product_children(identifier,NULL,data);
    UPDATE epav_data.sincronizacao_imagens_swift SET produto_atual_id=identifier WHERE produto_origem_id=identifier AND produto_atual_id IS NULL;
    UPDATE epav_data.auditoria_catalogo SET produto_atual_id=identifier WHERE produto_origem_id=identifier AND produto_atual_id IS NULL;
  ELSIF c='arquivo_produtos_swift' THEN
    saved_data:=epav_data.write_product_version(identifier,'dados',data->'dados');
    ${upsert('arquivo_produtos_swift',[['id','identifier']],archive,'data',[['dados_versao_id','saved_data'],['revision','new_revision'],['updated_at','clock_timestamp()']])};
  ELSIF c='auditoria_catalogo' THEN
    saved_before:=epav_data.write_product_version(identifier,'antes',data->'antes');
    saved_after:=epav_data.write_product_version(identifier,'depois',data->'depois');
    ${upsert('auditoria_catalogo',[['id','identifier']],audit,'data',[['produto_atual_id',"(SELECT id FROM epav_data.produtos_swift WHERE id=data->>'produtoId')"],['antes_versao_id','saved_before'],['depois_versao_id','saved_after'],['revision','new_revision'],['updated_at','clock_timestamp()']])};
  ELSIF c='sincronizacao_imagens_swift' THEN
    ${upsert('sincronizacao_imagens_swift',[['id','identifier']],sync,'data',[['produto_origem_id','identifier'],['produto_atual_id','(SELECT id FROM epav_data.produtos_swift WHERE id=identifier)'],['revision','new_revision'],['updated_at','clock_timestamp()']])};
  END IF;
  RETURN new_revision;
END $$;

CREATE FUNCTION epav_data.verify_document_revision(c varchar,identifier varchar,expected varchar) RETURNS boolean
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE actual uuid;
BEGIN
  IF c<>'produtos_swift' THEN RAISE EXCEPTION 'Invalid collection' USING ERRCODE='22023'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(c||'/'||identifier,17112026));
  SELECT revision INTO actual FROM epav_data.produtos_swift WHERE id=identifier FOR UPDATE;
  IF expected IS NULL OR actual IS NULL OR actual::varchar<>expected THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  RETURN true;
END $$;
CREATE FUNCTION epav_data.remove_product(identifier varchar,expected varchar) RETURNS boolean
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
BEGIN
  PERFORM epav_data.verify_document_revision('produtos_swift',identifier,expected);
  DELETE FROM epav_data.produtos_swift WHERE id=identifier;
  RETURN true;
END $$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA epav_data FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='epav_runtime_20261117') THEN
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA epav_data TO epav_runtime_20261117;
  END IF;
END $$;
`;
await writeFile(new URL('../migrations/008-direct-relational-storage.sql',import.meta.url),sql);
console.log('Generated migration 008 for direct relational API reads and writes.');
