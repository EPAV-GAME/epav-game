-- Retire metadata used only by the old catalog import.
-- Application audit and recoverable archives continue to serve current operations.
CREATE OR REPLACE FUNCTION epav_data.product_document(pid varchar,vid bigint DEFAULT NULL) RETURNS jsonb
LANGUAGE sql STABLE SET search_path=pg_catalog,epav_data AS $$
  SELECT jsonb_strip_nulls(jsonb_build_object('codigo',CASE WHEN p.codigo ~ '^-?[0-9]+$' THEN to_jsonb(p.codigo::bigint) ELSE to_jsonb(p.codigo) END,'nome',p.nome,'disponivelNoJogo',p.disponivel_no_jogo,'tiposProduto',p.tipos_produto,'ocasioes',p.ocasioes,'atualizadoEm',to_char(p.atualizado_em AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'atualizadoPor',p.atualizado_por,'ultimaAlteracaoId',p.ultima_alteracao_id)) || jsonb_build_object('id',p.source_id,'dadosOriginais',jsonb_strip_nulls(jsonb_build_object('Cod Produto',CASE WHEN d.codigo_produto ~ '^-?[0-9]+$' THEN to_jsonb(d.codigo_produto::bigint) ELSE to_jsonb(d.codigo_produto) END,'Descricao Produto',d.descricao_produto,'Unidade Medida',d.unidade_medida,'Volume (KG)',d.volume_kg,'Volume (UN)',d.volume_un,'Preço Médio S/ Desconto',coalesce(to_jsonb(d.preco_medio_sem_desconto),to_jsonb(d.preco_sem_desconto_observacao)),'Preço Médio C/ Desconto',coalesce(to_jsonb(d.preco_medio_com_desconto),to_jsonb(d.preco_com_desconto_observacao)),'Margem de Contribuição',coalesce(to_jsonb(d.margem_contribuicao),to_jsonb(d.margem_observacao)),'Status Produto',d.status_produto,'Familia',d.familia,'Marca',d.marca,'Familia Analitica 1',d.familia_analitica_1,'Familia Analitica 2',d.familia_analitica_2,'Nome Fornecedor',d.nome_fornecedor,'Ocasiao',d.ocasiao,'Formato',d.formato,'PRODUTOR',d.produtor,'CATEGORIA',d.categoria,'VALOR AGREGADO',d.valor_agregado,'Tipo Produto',d.tipo_produto_original,'Disponível no jogo',d.disponivel_original,'Ocasiões',d.ocasioes_original,'Carnes',d.carnes,'Aves',d.aves,'Pescados',d.pescados,'Acompanhamentos',d.acompanhamentos,'Sobremesas',d.sobremesas,'Despensa',d.despensa,'Praticidade',d.praticidade,'Dia a dia',d.dia_a_dia,'Churrasco',d.churrasco,'Lanches',d.lanches,'Receitas',d.receitas,'Família',d.familia_ocasiao,'Ocasiões especiais',d.ocasioes_especiais,'Leve',d.leve)))
    || CASE WHEN i.present IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('imagemSwift',jsonb_strip_nulls(jsonb_build_object('bucket',i.bucket,'key',i.object_key,'url',i.url,'format',i.formato,'width',i.largura,'height',i.altura,'bytes',i.bytes,'sha256',i.sha256,'pixelHash',i.pixel_hash,'sourceName',i.nome_origem,'sourcePage',i.pagina_origem,'sourceSku',i.sku_origem,'sourceUrl',i.url_origem,'matchMethod',i.metodo_correspondencia,'matchVersion',i.versao_correspondencia,'transformVersion',i.versao_transformacao,'manual',i.manual,'source',i.origem,'updatedAt',to_char(i.atualizado_em AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')))) END
  FROM (
    SELECT p.id AS source_id,p.codigo,p.nome,p.disponivel_no_jogo,p.tipos_produto,p.ocasioes,p.atualizado_em,p.atualizado_por,p.ultima_alteracao_id FROM epav_data.produtos_swift p WHERE vid IS NULL AND p.id=pid
    UNION ALL
    SELECT v.produto_origem_id,v.codigo,v.nome,v.disponivel_no_jogo,v.tipos_produto,v.ocasioes,v.atualizado_em,v.atualizado_por,v.ultima_alteracao_id FROM epav_data.produtos_swift_versoes v WHERE vid IS NOT NULL AND v.id=vid
  ) p
  LEFT JOIN LATERAL (
    SELECT d.codigo_produto,d.descricao_produto,d.unidade_medida,d.volume_kg,d.volume_un,d.preco_medio_sem_desconto,d.preco_sem_desconto_observacao,d.preco_medio_com_desconto,d.preco_com_desconto_observacao,d.margem_contribuicao,d.margem_observacao,d.status_produto,d.familia,d.marca,d.familia_analitica_1,d.familia_analitica_2,d.nome_fornecedor,d.ocasiao,d.formato,d.produtor,d.categoria,d.valor_agregado,d.tipo_produto_original,d.disponivel_original,d.ocasioes_original,d.carnes,d.aves,d.pescados,d.acompanhamentos,d.sobremesas,d.despensa,d.praticidade,d.dia_a_dia,d.churrasco,d.lanches,d.receitas,d.familia_ocasiao,d.ocasioes_especiais,d.leve FROM epav_data.produtos_swift_dados_originais d WHERE vid IS NULL AND d.produto_id=pid
    UNION ALL
    SELECT d.codigo_produto,d.descricao_produto,d.unidade_medida,d.volume_kg,d.volume_un,d.preco_medio_sem_desconto,d.preco_sem_desconto_observacao,d.preco_medio_com_desconto,d.preco_com_desconto_observacao,d.margem_contribuicao,d.margem_observacao,d.status_produto,d.familia,d.marca,d.familia_analitica_1,d.familia_analitica_2,d.nome_fornecedor,d.ocasiao,d.formato,d.produtor,d.categoria,d.valor_agregado,d.tipo_produto_original,d.disponivel_original,d.ocasioes_original,d.carnes,d.aves,d.pescados,d.acompanhamentos,d.sobremesas,d.despensa,d.praticidade,d.dia_a_dia,d.churrasco,d.lanches,d.receitas,d.familia_ocasiao,d.ocasioes_especiais,d.leve FROM epav_data.versoes_produtos_dados_originais d WHERE vid IS NOT NULL AND d.versao_id=vid
  ) d ON true
  LEFT JOIN LATERAL (
    SELECT true AS present,i.bucket,i.object_key,i.url,i.formato,i.largura,i.altura,i.bytes,i.sha256,i.pixel_hash,i.nome_origem,i.pagina_origem,i.sku_origem,i.url_origem,i.metodo_correspondencia,i.versao_correspondencia,i.versao_transformacao,i.manual,i.origem,i.atualizado_em FROM epav_data.produtos_swift_imagens i WHERE vid IS NULL AND i.produto_id=pid
    UNION ALL
    SELECT true,i.bucket,i.object_key,i.url,i.formato,i.largura,i.altura,i.bytes,i.sha256,i.pixel_hash,i.nome_origem,i.pagina_origem,i.sku_origem,i.url_origem,i.metodo_correspondencia,i.versao_correspondencia,i.versao_transformacao,i.manual,i.origem,i.atualizado_em FROM epav_data.versoes_produtos_imagens i WHERE vid IS NOT NULL AND i.versao_id=vid
  ) i ON true
$$;

CREATE OR REPLACE FUNCTION epav_data.document_data(c varchar,identifier varchar) RETURNS jsonb
LANGUAGE plpgsql STABLE SET search_path=pg_catalog,epav_data AS $$
DECLARE data jsonb;
BEGIN
  IF c='produtos_swift' THEN RETURN epav_data.product_document(identifier); END IF;
  IF c='arquivo_produtos_swift' THEN
    SELECT jsonb_strip_nulls(jsonb_build_object('produtoId',p.produto_origem_id,'motivo',p.motivo,'versaoOriginal',p.versao_original,'duplicadoDe',p.duplicado_de,'arquivadoEm',to_char(p.arquivado_em AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'))) || jsonb_build_object('duplicadoDe',p.duplicado_de,'dados',epav_data.product_document(NULL,p.dados_versao_id))
      INTO data FROM epav_data.arquivo_produtos_swift p WHERE id=identifier;
  ELSIF c='auditoria_catalogo' THEN
    SELECT jsonb_strip_nulls(jsonb_build_object('produtoId',p.produto_origem_id,'autorUid',p.autor_uid,'autorEmail',p.autor_email,'criadoEm',to_char(p.criado_em AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'))) || jsonb_build_object('antes',epav_data.product_document(NULL,p.antes_versao_id),
      'depois',epav_data.product_document(NULL,p.depois_versao_id)) INTO data FROM epav_data.auditoria_catalogo p WHERE id=identifier;
  ELSIF c='sincronizacao_imagens_swift' THEN
    SELECT jsonb_strip_nulls(jsonb_build_object('checkedAt',to_char(p.verificado_em AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'etag',p.etag,'lastModified',p.last_modified,'pixelHash',p.pixel_hash,'sourceUrl',p.url_origem,'status',p.status)) INTO data FROM epav_data.sincronizacao_imagens_swift p WHERE id=identifier;
  ELSE RAISE EXCEPTION 'Unknown collection' USING ERRCODE='22023';
  END IF;
  RETURN data;
END $$;

CREATE OR REPLACE FUNCTION epav_data.list_documents(c varchar,cursor_id varchar,page_limit integer,identifier varchar,recent boolean)
RETURNS SETOF jsonb LANGUAGE plpgsql STABLE SET search_path=pg_catalog,epav_data AS $$
BEGIN
  IF c NOT IN ('produtos_swift','arquivo_produtos_swift','auditoria_catalogo','sincronizacao_imagens_swift') OR page_limit NOT BETWEEN 1 AND 301
    THEN RAISE EXCEPTION 'Invalid query' USING ERRCODE='22023'; END IF;
  RETURN QUERY EXECUTE format(
    'SELECT jsonb_build_object(''id'',p.id,''revision'',p.revision,''updatedAt'',p.updated_at,
      ''data'',epav_data.document_data($1,p.id)) FROM epav_data.%I p
      WHERE ($4 IS NULL OR p.id=$4) AND
        CASE WHEN $5 THEN ($2='''' OR (p.created_at,p.id)<(SELECT created_at,id FROM epav_data.%I WHERE id=$2)) ELSE p.id>$2 END
      ORDER BY CASE WHEN $5 THEN p.created_at END DESC,CASE WHEN $5 THEN p.id END DESC,p.id LIMIT $3',c,c)
    USING c,cursor_id,page_limit,identifier,recent;
END $$;

CREATE OR REPLACE FUNCTION epav_data.write_product_version(identifier varchar,version_position varchar,data jsonb) RETURNS bigint
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE vid bigint;
BEGIN
  INSERT INTO epav_data.produtos_swift_versoes(owner_id,posicao,codigo,nome,disponivel_no_jogo,tipos_produto,ocasioes,atualizado_em,atualizado_por,ultima_alteracao_id,produto_origem_id) VALUES(identifier,version_position,(data->>'codigo')::varchar(128),(data->>'nome')::varchar(240),(data->>'disponivelNoJogo')::boolean,ARRAY(SELECT jsonb_array_elements_text(coalesce(data->'tiposProduto','[]'::jsonb)))::varchar(240)[],ARRAY(SELECT jsonb_array_elements_text(coalesce(data->'ocasioes','[]'::jsonb)))::varchar(240)[],(data->>'atualizadoEm')::timestamptz,(data->>'atualizadoPor')::varchar(128),(data->>'ultimaAlteracaoId')::varchar(128),data->>'id')
    ON CONFLICT(owner_id,posicao) DO UPDATE SET codigo=excluded.codigo,nome=excluded.nome,disponivel_no_jogo=excluded.disponivel_no_jogo,tipos_produto=excluded.tipos_produto,ocasioes=excluded.ocasioes,atualizado_em=excluded.atualizado_em,atualizado_por=excluded.atualizado_por,ultima_alteracao_id=excluded.ultima_alteracao_id,produto_origem_id=excluded.produto_origem_id
    RETURNING id INTO vid;
  PERFORM epav_data.write_product_children(NULL,vid,data);
  RETURN vid;
END $$;

CREATE OR REPLACE FUNCTION epav_data.save_document(c varchar,identifier varchar,expected varchar,data jsonb) RETURNS uuid
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE current_revision uuid; new_revision uuid:=gen_random_uuid(); saved_before bigint; saved_after bigint; saved_data bigint;
BEGIN
  IF c NOT IN ('produtos_swift','arquivo_produtos_swift','auditoria_catalogo','sincronizacao_imagens_swift')
    THEN RAISE EXCEPTION 'Invalid collection' USING ERRCODE='22023'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(c||'/'||identifier,17112026));
  EXECUTE format('SELECT revision FROM epav_data.%I WHERE id=$1 FOR UPDATE',c) INTO current_revision USING identifier;
  IF expected='' AND current_revision IS NOT NULL THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  IF expected IS NOT NULL AND expected<>'' AND (current_revision IS NULL OR current_revision::varchar<>expected)
    THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  IF c='produtos_swift' THEN
    INSERT INTO epav_data.produtos_swift(id,codigo,nome,disponivel_no_jogo,tipos_produto,ocasioes,atualizado_em,atualizado_por,ultima_alteracao_id,revision,updated_at) VALUES(identifier,(data->>'codigo')::varchar(128),(data->>'nome')::varchar(240),(data->>'disponivelNoJogo')::boolean,ARRAY(SELECT jsonb_array_elements_text(coalesce(data->'tiposProduto','[]'::jsonb)))::varchar(240)[],ARRAY(SELECT jsonb_array_elements_text(coalesce(data->'ocasioes','[]'::jsonb)))::varchar(240)[],(data->>'atualizadoEm')::timestamptz,(data->>'atualizadoPor')::varchar(128),(data->>'ultimaAlteracaoId')::varchar(128),new_revision,clock_timestamp())
    ON CONFLICT(id) DO UPDATE SET codigo=excluded.codigo,nome=excluded.nome,disponivel_no_jogo=excluded.disponivel_no_jogo,tipos_produto=excluded.tipos_produto,ocasioes=excluded.ocasioes,atualizado_em=excluded.atualizado_em,atualizado_por=excluded.atualizado_por,ultima_alteracao_id=excluded.ultima_alteracao_id,revision=excluded.revision,updated_at=excluded.updated_at;
    PERFORM epav_data.write_product_children(identifier,NULL,data);
    UPDATE epav_data.sincronizacao_imagens_swift SET produto_atual_id=identifier WHERE produto_origem_id=identifier AND produto_atual_id IS NULL;
    UPDATE epav_data.auditoria_catalogo SET produto_atual_id=identifier WHERE produto_origem_id=identifier AND produto_atual_id IS NULL;
  ELSIF c='arquivo_produtos_swift' THEN
    saved_data:=epav_data.write_product_version(identifier,'dados',data->'dados');
    INSERT INTO epav_data.arquivo_produtos_swift(id,produto_origem_id,motivo,versao_original,duplicado_de,arquivado_em,dados_versao_id,revision,updated_at) VALUES(identifier,(data->>'produtoId')::varchar(1500),(data->>'motivo')::varchar(80),(data->>'versaoOriginal')::varchar(128),(data->>'duplicadoDe')::varchar(1500),(data->>'arquivadoEm')::timestamptz,saved_data,new_revision,clock_timestamp())
    ON CONFLICT(id) DO UPDATE SET produto_origem_id=excluded.produto_origem_id,motivo=excluded.motivo,versao_original=excluded.versao_original,duplicado_de=excluded.duplicado_de,arquivado_em=excluded.arquivado_em,dados_versao_id=excluded.dados_versao_id,revision=excluded.revision,updated_at=excluded.updated_at;
  ELSIF c='auditoria_catalogo' THEN
    saved_before:=epav_data.write_product_version(identifier,'antes',data->'antes');
    saved_after:=epav_data.write_product_version(identifier,'depois',data->'depois');
    INSERT INTO epav_data.auditoria_catalogo(id,produto_origem_id,autor_uid,autor_email,criado_em,produto_atual_id,antes_versao_id,depois_versao_id,revision,updated_at) VALUES(identifier,(data->>'produtoId')::varchar(1500),(data->>'autorUid')::varchar(128),(data->>'autorEmail')::varchar(320),(data->>'criadoEm')::timestamptz,(SELECT id FROM epav_data.produtos_swift WHERE id=data->>'produtoId'),saved_before,saved_after,new_revision,clock_timestamp())
    ON CONFLICT(id) DO UPDATE SET produto_origem_id=excluded.produto_origem_id,autor_uid=excluded.autor_uid,autor_email=excluded.autor_email,criado_em=excluded.criado_em,produto_atual_id=excluded.produto_atual_id,antes_versao_id=excluded.antes_versao_id,depois_versao_id=excluded.depois_versao_id,revision=excluded.revision,updated_at=excluded.updated_at;
  ELSIF c='sincronizacao_imagens_swift' THEN
    INSERT INTO epav_data.sincronizacao_imagens_swift(id,verificado_em,etag,last_modified,pixel_hash,url_origem,status,produto_origem_id,produto_atual_id,revision,updated_at) VALUES(identifier,(data->>'checkedAt')::timestamptz,(data->>'etag')::varchar(1024),(data->>'lastModified')::varchar(128),(data->>'pixelHash')::varchar(64),(data->>'sourceUrl')::varchar(4096),(data->>'status')::varchar(80),identifier,(SELECT id FROM epav_data.produtos_swift WHERE id=identifier),new_revision,clock_timestamp())
    ON CONFLICT(id) DO UPDATE SET verificado_em=excluded.verificado_em,etag=excluded.etag,last_modified=excluded.last_modified,pixel_hash=excluded.pixel_hash,url_origem=excluded.url_origem,status=excluded.status,produto_origem_id=excluded.produto_origem_id,produto_atual_id=excluded.produto_atual_id,revision=excluded.revision,updated_at=excluded.updated_at;
  END IF;
  RETURN new_revision;
END $$;

ALTER TABLE epav_data.produtos_swift DROP COLUMN importacao_id, DROP COLUMN linha_origem;
ALTER TABLE epav_data.produtos_swift_versoes DROP COLUMN importacao_id, DROP COLUMN linha_origem;
DROP TABLE epav_data.importacoes_catalogo;
