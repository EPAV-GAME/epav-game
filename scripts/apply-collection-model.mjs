import {readFile} from 'node:fs/promises';
import {parseEnv,isDeepStrictEqual} from 'node:util';
import pg from 'pg';
const env=parseEnv(await readFile(process.argv[2],'utf8'));
const production=process.argv.includes('--production');
if(env.NEON_BRANCH_ID!==(production?'br-little-thunder-za0v0lnz':'br-lucky-star-za2fy0sm'))throw Error('Branch inesperada');
const url=new URL(env.DATABASE_URL_UNPOOLED);url.searchParams.set('sslmode','verify-full');
if(url.hostname.includes('-pooler.')||!url.hostname.endsWith('.neon.tech'))throw Error('Conexão direta obrigatória');
const db=new pg.Client({connectionString:url.href,enableChannelBinding:true});await db.connect();
const collections=['arquivo_produtos_swift','auditoria_catalogo','importacoes_catalogo','produtos_swift','sincronizacao_imagens_swift'];
try{
  await db.query('BEGIN');
  const original=(await db.query('SELECT * FROM epav_data.products ORDER BY id')).rows;
  if(!(await db.query("SELECT to_regclass('epav_data.produtos_swift') AS name")).rows[0].name){
    await db.query(await readFile(new URL('../migrations/005-collection-tables.sql',import.meta.url),'utf8'));
  }
  if(!isDeepStrictEqual(original,(await db.query('SELECT * FROM epav_data.products ORDER BY id')).rows))throw Error('O catálogo público divergiu');
  const counts={};
  for(const table of collections){
    const {rows:[row]}=await db.query(`SELECT (SELECT count(*)::int FROM epav_data.${table}) AS actual,
      (SELECT count(*)::int FROM epav_data.records WHERE collection_path=$1) AS expected`,[table]);
    if(row.actual!==row.expected)throw Error('Contagem divergente: '+table);
    counts[table]=row.actual;
  }
  counts.ranking=(await db.query('SELECT count(*)::int AS count FROM epav_data.ranking')).rows[0].count;
  const bad=(await db.query(`SELECT count(*)::int AS count FROM information_schema.columns
    WHERE table_schema IN ('epav_data','epav_migration') AND udt_name IN ('text','json','jsonb','_text','_json','_jsonb')`)).rows[0].count;
  if(bad)throw Error('Tipo de coluna não permitido');
  // Exercise the real deferred trigger and ensure it updates the named table.
  await db.query('SAVEPOINT mirror_probe');
  const {rows:[sample]}=await db.query('SELECT registro_id,nome FROM epav_data.produtos_swift ORDER BY id LIMIT 1');
  await db.query(`UPDATE epav_data.record_fields SET string_value=$2
    WHERE document_row_id=$1 AND parent_no IS NULL AND field_name='nome'`,[sample.registro_id,'EPAV migration probe']);
  await db.query('UPDATE epav_data.records SET revision=gen_random_uuid() WHERE row_id=$1',[sample.registro_id]);
  await db.query('SET CONSTRAINTS epav_data.business_record_sync IMMEDIATE');
  const probe=(await db.query('SELECT nome FROM epav_data.produtos_swift WHERE registro_id=$1',[sample.registro_id])).rows[0];
  if(probe.nome!=='EPAV migration probe')throw Error('A atualização atômica não propagou');
  await db.query('ROLLBACK TO SAVEPOINT mirror_probe');
  if((await db.query('SELECT nome FROM epav_data.produtos_swift WHERE registro_id=$1',[sample.registro_id])).rows[0].nome!==sample.nome)throw Error('Falha ao reverter teste');
  // A trigger refreshes all related tables inside the same commit as API writes.
  if(production){
    await db.query('GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA epav_data TO epav_runtime_20261117');
    await db.query('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA epav_data TO epav_runtime_20261117');
    await db.query('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA epav_data TO epav_runtime_20261117');
  }
  await db.query('COMMIT');
  console.log(JSON.stringify({branch:production?'production':'staging',tables:counts,public_catalog_unchanged:true,atomic_mirror_verified:true,forbidden_columns:bad}));
}catch(e){await db.query('ROLLBACK');console.error('Conversão cancelada:',e.code??e.message,e.routine??'');process.exitCode=1;}
finally{await db.end();}
