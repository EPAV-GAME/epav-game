import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import pg from 'pg';

const production=process.argv.includes('--production');
const env=parseEnv(await readFile(process.argv[2],'utf8'));
if(env.NEON_BRANCH_ID!==(production?'br-little-thunder-za0v0lnz':'br-lucky-star-za2fy0sm')) throw Error('Branch inesperada');
const url=new URL(env.DATABASE_URL_UNPOOLED);
if(!url.hostname.endsWith('.neon.tech') || url.hostname.includes('-pooler.')) throw Error('Conexão direta obrigatória');
url.searchParams.set('sslmode','verify-full');
const db=new pg.Client({connectionString:url.href,enableChannelBinding:true});
await db.connect();
try{
  await db.query('BEGIN');
  if(!(await db.query("SELECT to_regclass('epav_data.records') AS name")).rows[0].name){
    await db.query(await readFile(new URL('../migrations/003-application-data.sql',import.meta.url),'utf8'));
    await db.query(`INSERT INTO epav_data.records(collection_path,document_id,created_at,updated_at)
      SELECT collection_path,document_id,coalesce(created_at,now()),coalesce(updated_at,now())
      FROM epav_migration.current_documents`);
    const columns=(await db.query(`SELECT column_name FROM information_schema.columns
      WHERE table_schema='epav_migration' AND table_name='document_fields' ORDER BY ordinal_position`)).rows.map(r=>r.column_name);
    await db.query(`INSERT INTO epav_data.record_fields(${columns.join(',')})
      SELECT r.row_id,${columns.slice(1).map(c=>'f.'+c).join(',')} FROM epav_migration.current_documents d
      JOIN epav_data.records r USING(collection_path,document_id)
      JOIN epav_migration.document_fields f ON f.document_row_id=d.row_id`);
    // The source ranking may be empty, but existing entries must also migrate.
    const {rows}=await db.query(`SELECT d.document_id,jsonb_object_agg(f.field_name,coalesce(to_jsonb(f.string_value),to_jsonb(f.integer_value))) AS data
      FROM epav_migration.current_documents d JOIN epav_migration.document_fields f ON f.document_row_id=d.row_id
      WHERE d.collection_path='ranking' AND f.parent_no IS NULL GROUP BY d.document_id`);
    for(const {document_id,data:p} of rows) await db.query(`INSERT INTO epav_data.ranking
      (uid,nome,pontos,qualidade_quartos,satisfacao,classificacao,tempo_jogado_ms)
      VALUES($1,$2,$3,$4,$5,$6,$7)`,[document_id,p.nome,p.pontos,p.qualidadeQuartos,p.satisfacao,p.classificacao,p.tempoJogadoMs]);
  }
  const {rows:[counts]}=await db.query(`SELECT
    (SELECT count(*)::int FROM epav_data.records) AS records,
    (SELECT count(*)::int FROM epav_data.record_fields) AS fields,
    (SELECT count(*)::int FROM epav_data.products) AS products,
    (SELECT count(*)::int FROM information_schema.columns WHERE table_schema IN ('epav_data','epav_migration')
      AND udt_name IN ('text','json','jsonb','_text','_json','_jsonb')) AS forbidden`);
  if(counts.forbidden) throw Error('Tipo de coluna proibido');
  // All original nodes must exist unchanged in the operational copy on activation.
  const {rows:[parity]}=await db.query(`SELECT count(*)::int AS differences FROM (
    (SELECT d.collection_path,d.document_id,to_jsonb(f)-'document_row_id' AS node
      FROM epav_migration.current_documents d JOIN epav_migration.document_fields f ON f.document_row_id=d.row_id
     EXCEPT SELECT r.collection_path,r.document_id,to_jsonb(f)-'document_row_id'
      FROM epav_data.records r JOIN epav_data.record_fields f ON f.document_row_id=r.row_id)
    UNION ALL
    (SELECT r.collection_path,r.document_id,to_jsonb(f)-'document_row_id'
      FROM epav_data.records r JOIN epav_data.record_fields f ON f.document_row_id=r.row_id
     EXCEPT SELECT d.collection_path,d.document_id,to_jsonb(f)-'document_row_id'
      FROM epav_migration.current_documents d JOIN epav_migration.document_fields f ON f.document_row_id=d.row_id)
    ) x`);
  if(parity.differences) throw Error('A cópia operacional divergiu do snapshot');
  await db.query('COMMIT');
  console.log(JSON.stringify({...counts,parity_differences:parity.differences,branch:production?'production':'staging'}));
}catch(e){await db.query('ROLLBACK');console.error('Ativação falhou:',e.code??e.message);process.exitCode=1;}
finally{await db.end();}
