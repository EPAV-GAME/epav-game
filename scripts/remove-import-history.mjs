import {readFile} from 'node:fs/promises';
import {parseEnv, isDeepStrictEqual} from 'node:util';
import pg from 'pg';
import {verifyDataOperations} from './verify-data-operations.mjs';

const production = process.argv.includes('--production');
const env = parseEnv(await readFile(process.argv[2], 'utf8'));
const expectedBranch = production ? 'br-little-thunder-za0v0lnz' : 'br-lucky-star-za2fy0sm';
if (env.NEON_BRANCH_ID !== expectedBranch) throw new Error('Branch inesperada');
const url = new URL(env.DATABASE_URL_UNPOOLED);
if (!url.hostname.endsWith('.neon.tech') || url.hostname.includes('-pooler.')) throw new Error('Conexão direta obrigatória');
url.searchParams.set('sslmode', 'verify-full');
const db = new pg.Client({connectionString:url.href, enableChannelBinding:true});
await db.connect();

function normalize(value) {
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) && Number.isFinite(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !['importacaoId', 'linhaOrigem'].includes(key))
      .map(([key, child]) => [key, normalize(child)]));
  }
  return value;
}

async function readFunctionalData() {
  const result = {};
  for (const collection of ['produtos_swift', 'arquivo_produtos_swift', 'auditoria_catalogo', 'sincronizacao_imagens_swift']) {
    const documents = [];
    let cursor = '';
    while (true) {
      const {rows} = await db.query('SELECT * FROM epav_data.list_documents($1,$2,301,NULL,false)', [collection,cursor]);
      const page = rows.map(row => normalize(Object.values(row)[0]));
      documents.push(...page);
      if (page.length < 301) break;
      cursor = page.at(-1).id;
    }
    result[collection] = documents;
  }
  return result;
}

try {
  await db.query('BEGIN');
  await db.query("SET LOCAL lock_timeout='15s'");
  await db.query('LOCK TABLE epav_data.produtos_swift, epav_data.produtos_swift_versoes, epav_data.importacoes_catalogo IN SHARE ROW EXCLUSIVE MODE');
  const before = await readFunctionalData();
  const catalog = (await db.query('SELECT * FROM epav_data.products ORDER BY id')).rows;
  await db.query(await readFile(new URL('../migrations/010-remove-import-history.sql', import.meta.url), 'utf8'));
  if (!isDeepStrictEqual(before, await readFunctionalData())) throw new Error('Os dados funcionais divergiram');
  if (!isDeepStrictEqual(catalog, (await db.query('SELECT * FROM epav_data.products ORDER BY id')).rows)) throw new Error('O catálogo público divergiu');
  await verifyDataOperations(db, normalize);
  const {rows:tables} = await db.query(`SELECT schemaname,tablename FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname,tablename`);
  if (tables.length !== 10 || tables.some(row => row.schemaname !== 'epav_data')) throw new Error('Tabelas inesperadas');
  const {rows:[legacy]} = await db.query(`SELECT count(*)::int AS count FROM information_schema.columns
    WHERE table_schema='epav_data' AND (column_name IN ('importacao_id','linha_origem','projeto_firebase_origem')
      OR udt_name IN ('text','json','jsonb','_text','_json','_jsonb'))`);
  if (legacy.count) throw new Error('Restaram campos de importação ou tipos proibidos');
  await db.query('COMMIT');
  console.log(JSON.stringify({branch:production?'production':'staging',tables:tables.map(row=>row.tablename),
    verified_documents:Object.values(before).reduce((total,docs)=>total+docs.length,0),
    catalog_preserved:true,audit_archive_restore_and_conflicts:'passed'}));
} catch (error) {
  await db.query('ROLLBACK');
  console.error('Limpeza cancelada:', error.code ?? error.message, error.routine ?? '');
  process.exitCode = 1;
} finally {
  await db.end();
}
