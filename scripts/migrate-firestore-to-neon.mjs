import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import pg from 'pg';
import { firestoreReader, scanFirestore } from './firestore-snapshot.mjs';
import { assertTyped, migrateTypes, storeFields } from './typed-storage.mjs';

const args = new Set(process.argv.slice(2));
const command = [...args][0];
const commands = ['inventory', 'check-production', 'prepare', 'apply', 'verify', 'migrate-types'];
const productionTarget = args.has('--production');
const allowDescendants = !args.has('--top-level');
const project = 'epav-game';
const database = '(default)';
const stagingBranch = 'br-lucky-star-za2fy0sm';
const productionBranch = 'br-little-thunder-za0v0lnz';
const validateArgs = commands.includes(command) && [...args].every(arg => arg === command ||
  (['apply','prepare','verify'].includes(command) && arg === '--production') || (command === 'inventory' && arg === '--top-level') || (command === 'migrate-types' && arg === '--dry-run'));

async function connect(staging, direct) {
  if (productionTarget) staging = false;
  // Never inherit a DATABASE_URL from an unrelated app in the shell.
  const file = staging ? '../.env.neon-migration' : '../.env.local';
  const env = parseEnv(await readFile(process.env.EPAV_MIGRATION_ENV_FILE || new URL(file, import.meta.url), 'utf8'));
  if (env.NEON_BRANCH_ID !== (staging ? stagingBranch : productionBranch)) {
    throw new Error('O arquivo local não corresponde à branch esperada.');
  }
  const name = direct ? 'DATABASE_URL_UNPOOLED' : 'DATABASE_URL';
  const url = new URL(env[name] ?? '');
  if (!['postgresql:', 'postgres:'].includes(url.protocol) ||
      !url.hostname.endsWith('.neon.tech') ||
      url.hostname.split('.')[0].endsWith('-pooler') === direct ||
      (staging && !url.hostname.startsWith('ep-jolly-glade-zat3ho4b.'))) {
    throw new Error('Configure uma URL Neon válida para o tipo de conexão esperado.');
  }
  url.searchParams.set('sslmode', 'verify-full');
  const client = new pg.Client({
    connectionString: url.toString(), enableChannelBinding: true, connectionTimeoutMillis: 15000,
  });
  await client.connect();
  return client;
}

async function sourceReader() {
  let client;
  const accessToken = process.env.EPAV_FIRESTORE_ACCESS_TOKEN;
  if (accessToken) {
    client = new OAuth2Client();
    client.setCredentials({ access_token: accessToken });
  } else {
    try {
      client = await new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/datastore'] }).getClient();
    } catch {
      throw new Error('Credencial de leitura indisponível. Configure GOOGLE_APPLICATION_CREDENTIALS ou as credenciais padrão do Google.');
    }
  }
  const request = async (url, { method, ...options }) => {
    try {
      const { data } = await client.request({
        url, method, ...(method === 'POST' ? { data: options } : { params: options }), timeout: 30000,
        retry: true, retryConfig: { retry: 3, httpMethodsToRetry: ['GET', 'POST'] },
      });
      return data;
    } catch (err) {
      // The HTTP error object can include an authorization header or a document payload.
      const code = err.response?.status;
      if (code === 401 || code === 403) throw new Error(`O Firestore recusou a leitura (${code}). Verifique a permissão IAM da credencial.`);
      throw new Error(`Falha ao consultar o Firestore${code ? ` (HTTP ${code})` : ''}.`);
    }
  };
  // Ask Firestore for a consistent timestamp; don't rely on the local clock.
  const response = await request(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents:runQuery`,
    { method: 'POST', structuredQuery: { from: [{ collectionId: 'ranking' }], limit: 1 } },
  );
  const marker = Array.isArray(response) ? response.at(-1)?.readTime : undefined;
  if (!marker) throw new Error('O Firestore não retornou o horário da leitura.');
  return { marker, reader: firestoreReader({ project, database, request, readTime: marker }) };
}

const rowset = `jsonb_to_recordset($2::jsonb) AS x(
  path varchar, collection_path varchar, document_id varchar,
  created_at timestamptz, updated_at timestamptz)`;

async function writeAndVerify(client, id, rows) {
  if (!rows.length) return;
  const original = new Map(rows.map(row=>[row.path,row.firestore_fields]));
  const params = [id, JSON.stringify(rows.map(({firestore_fields,...metadata})=>metadata))];
  await client.query(
    `INSERT INTO epav_migration.documents
     (snapshot_id, path, collection_path, document_id, created_at, updated_at)
     SELECT $1, x.* FROM ${rowset}`, params,
  );
  const { rows: inserted } = await client.query(
    `SELECT d.row_id, d.path
     FROM ${rowset}
     JOIN epav_migration.documents d ON d.snapshot_id = $1 AND d.path = x.path
       AND (d.collection_path, d.document_id, d.created_at, d.updated_at)
       = (x.collection_path, x.document_id, x.created_at, x.updated_at)`, params,
  );
  if (inserted.length !== rows.length) throw new Error('A conferência do lote encontrou divergências.');
  await storeFields(client, inserted.map(row=>({...row,firestore_fields:original.get(row.path)})));
}

async function checkProduction() {
  for (const direct of [false, true]) {
    const client = await connect(false, direct);
    try {
      await client.query('SELECT 1');
      console.log(direct ? 'Conexão direta de production verificada.' : 'Conexão com pool de production verificada.');
    } finally { await client.end(); }
  }
}

async function prepare(dryRun = false) {
  const client = await connect(true, true);
  try {
    await client.query('BEGIN');
    const migration = await migrateTypes(client);
    await client.query('SAVEPOINT smoke_test');
    const id = randomUUID();
    await client.query(
      `INSERT INTO epav_migration.snapshots (id, source_database, source_read_time, document_count)
       VALUES ($1, 'smoke-test', now(), 1)`, [id],
    );
    await writeAndVerify(client, id, [{
      path: 'test/doc', collection_path: 'test', document_id: 'doc',
      created_at: '2026-01-01T12:00:00.123456Z', updated_at: '2026-01-02T12:00:00.654321Z',
      firestore_fields: {
        int64: { integerValue: '9223372036854775807' },
        list: { arrayValue: {values: [{mapValue: {}},{nullValue:null},{doubleValue:'Infinity'},{booleanValue:false}]} },
        instant: { timestampValue:'2026-01-01T12:00:00.123456Z' },
        bytes: {bytesValue:'AAE='}, location: {geoPointValue:{latitude:-23,longitude:-46}},
        reference: {referenceValue:'projects/epav-game/databases/(default)/documents/test/doc'},
      },
    }]);
    await client.query('ROLLBACK TO SAVEPOINT smoke_test');
    const { rows: [row] } = await client.query('SELECT count(*)::int AS count FROM epav_migration.snapshots WHERE id = $1', [id]);
    if (row.count !== 0) throw new Error('O teste deixou dados na branch.');
    await client.query(dryRun?'ROLLBACK':'COMMIT');
    if (migration) console.log(`${migration.documents} documentos e ${migration.fields} campos conferidos; ${dryRun?'simulação revertida':'esquema tipado confirmado'}.`);
    else console.log('Esquema tipado já aplicado. Teste de escrita concluído sem guardar dados de teste.');
  } finally { await client.end(); }
}

function summary(counts) {
  const totals = new Map();
  for (const [path, count] of counts) {
    const collection = path.split('/')[0];
    totals.set(collection, (totals.get(collection) ?? 0) + count);
  }
  // Report root collection names and totals, never identifiers or contents.
  console.log(JSON.stringify(Object.fromEntries([...totals].sort()), null, 2));
}

async function verify() {
  const client = await connect(true, true);
  try {
    await assertTyped(client);
    const { rows: [snapshot] } = await client.query(
      `SELECT id, source_read_time, document_count
       FROM epav_migration.snapshots WHERE source_database = $1
       ORDER BY source_read_time DESC LIMIT 1`,
      [`projects/${project}/databases/${database}`],
    );
    if (!snapshot) throw new Error('A branch de testes ainda não tem uma cópia do Firestore EPAV.');
    const { rows } = await client.query(
      `SELECT collection_path, count(*)::int AS count
       FROM epav_migration.current_documents WHERE snapshot_id = $1 GROUP BY collection_path`, [snapshot.id],
    );
    const count = rows.reduce((acc, row) => acc + row.count, 0);
    if (count !== Number(snapshot.document_count)) throw new Error('A contagem da cópia confirmada diverge do manifesto.');
    console.log(`Cópia confirmada: ${count} documentos (${snapshot.source_read_time.toISOString()}).`);
    summary(new Map(rows.map(row => [row.collection_path, row.count])));
    const {rows:[fieldCount]} = await client.query(`
      SELECT count(*)::int AS count FROM epav_migration.document_fields f
      JOIN epav_migration.documents d ON d.row_id = f.document_row_id WHERE d.snapshot_id = $1`,[snapshot.id]);
    console.log(`${fieldCount.count} campos tipados na cópia; nenhuma coluna TEXT, JSON ou JSONB no esquema.`);
  } finally { await client.end(); }
}

async function apply(reader, marker) {
  const client = await connect(true, true);
  try {
    await client.query('BEGIN');
    await migrateTypes(client);
    const id = randomUUID();
    await client.query(
      `INSERT INTO epav_migration.snapshots (id, source_database, source_read_time, document_count)
       VALUES ($1, $2, $3, 0)`, [id, reader.source, marker],
    );
    let batch = [];
    let verified = 0;
    const counts = await scanFirestore(reader, async row => {
      batch.push(row);
      if (batch.length >= 100) {
        await writeAndVerify(client, id, batch);
        verified += batch.length;
        if (verified % 500 === 0) console.log(`${verified} documentos conferidos; transação ainda aberta.`);
        batch = [];
      }
    });
    await writeAndVerify(client, id, batch);
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
    if (!total) throw new Error('A origem retornou zero documentos; nenhuma cópia vazia será publicada.');
    const { rows: [actual] } = await client.query(
      'SELECT count(*)::int AS count FROM epav_migration.documents WHERE snapshot_id = $1', [id],
    );
    if (actual.count !== total) throw new Error('A contagem total da cópia não confere.');
    await client.query('UPDATE epav_migration.snapshots SET document_count = $2 WHERE id = $1', [id, total]);
    await client.query('COMMIT');
    console.log(`Cópia verificada de ${total} documentos na branch ${productionTarget ? 'production' : 'de testes'} (${marker}).`);
    summary(counts);
  } finally { await client.end(); } // Closing rolls back an unfinished transaction.
}

try {
  if (!validateArgs) throw new Error('Uso: node scripts/migrate-firestore-to-neon.mjs inventory [--top-level] | check-production | prepare | apply | verify | migrate-types [--dry-run]');
  if (command === 'check-production') await checkProduction();
  else if (command === 'prepare') await prepare();
  else if (command === 'migrate-types') await prepare(args.has('--dry-run'));
  else if (command === 'verify') await verify();
  else {
    const { marker, reader } = await sourceReader();
    if (command === 'inventory') summary(await scanFirestore(reader, () => {}, { descendants: allowDescendants }));
    else await apply(reader, marker);
  }
} catch (err) {
  // Driver errors may have connection strings, query inputs, or data values.
  console.error(err.code ? `Falha na operação (${err.code}).` : err.message);
  process.exitCode = 1;
}
