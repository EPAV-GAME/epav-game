import {readFile} from 'node:fs/promises';
import {flatten, verifyFields} from './typed-fields.mjs';

const columns = [
  'document_row_id','node_no','parent_no','field_name','array_index','kind',
  'string_value','integer_value','double_value','boolean_value','timestamp_value',
  'reference_value','latitude','longitude','members_present',
];

export async function storeFields(client, rows) {
  if (!rows.length) return 0;
  const fields = rows.flatMap(row => flatten(row.firestore_fields).map(f=>({...f,document_row_id:row.row_id})));
  if (fields.length) {
    await client.query(`
      INSERT INTO epav_migration.document_fields (${columns.join(',')},bytes_value)
      SELECT ${columns.join(',')}, decode(bytes_base64,'base64') FROM jsonb_to_recordset($1::jsonb) AS f(
        document_row_id bigint,node_no integer,parent_no integer,field_name varchar,array_index integer,
        kind epav_migration.firestore_kind,string_value varchar,integer_value bigint,double_value double precision,
        boolean_value boolean,timestamp_value timestamptz,reference_value varchar,
        latitude double precision,longitude double precision,members_present boolean,bytes_base64 varchar)`,
      [JSON.stringify(fields.map(({bytes_value,...rest})=>({...rest,bytes_base64:bytes_value})))]);
  }
  const {rows: restored} = await client.query(`
    SELECT document_row_id,node_no,parent_no,field_name,array_index,kind,string_value,integer_value,
      CASE WHEN double_value IN ('NaN'::float8,'Infinity'::float8,'-Infinity'::float8)
        THEN double_value::varchar END AS special_double,
      double_value,boolean_value,
      to_char(timestamp_value AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS timestamp_value,
      replace(encode(bytes_value,'base64'),chr(10),'') AS bytes_value,
      reference_value,latitude,longitude,members_present
    FROM epav_migration.document_fields WHERE document_row_id=ANY($1::bigint[])
    ORDER BY document_row_id,node_no`,[rows.map(row=>row.row_id)]);
  if (restored.length !== fields.length) throw new Error('A contagem de campos divergiu da origem.');
  const groups = new Map();
  for (const field of restored) {
    if (field.special_double) field.double_value = field.special_double;
    if (!groups.has(field.document_row_id)) groups.set(field.document_row_id,[]);
    groups.get(field.document_row_id).push(field);
  }
  for (const row of rows) verifyFields(row.firestore_fields,groups.get(row.row_id)??[]);
  return fields.length;
}

export async function assertTyped(client) {
  const {rows:[{ count }]} = await client.query(`
    SELECT count(*)::int AS count FROM information_schema.columns
    WHERE table_schema='epav_migration' AND udt_name IN ('text','json','jsonb','_text','_json','_jsonb')`);
  if (count) throw new Error('Ainda existem colunas com tipos não permitidos no esquema.');
}

export async function migrateTypes(client) {
  await client.query('SELECT pg_advisory_xact_lock(17112026)');
  const {rows:[state]} = await client.query(`
    SELECT to_regclass('epav_migration.document_fields') IS NOT NULL AS typed,
      EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='epav_migration'
        AND table_name='documents' AND column_name='firestore_fields') AS legacy`);
  if (state.typed) {
    await assertTyped(client);
    return null;
  }
  await client.query(await readFile(new URL('../migrations/001-firestore-snapshots.sql',import.meta.url),'utf8'));
  await client.query(await readFile(new URL('../migrations/002-typed-document-fields.sql',import.meta.url),'utf8'));
  let cursor='0',documents=0,fields=0;
  if (state.legacy) {
    while (true) {
      const { rows } = await client.query(`
        SELECT row_id,firestore_fields FROM epav_migration.documents
        WHERE row_id>$1 ORDER BY row_id LIMIT 100`,[cursor]);
      if (!rows.length) break;
      fields += await storeFields(client,rows);
      documents += rows.length;
      cursor=rows.at(-1).row_id;
      if (documents%1000===0) console.log(`${documents} documentos reconstruídos e conferidos.`);
    }
    const {rows:[counts]} = await client.query(`
      SELECT (SELECT count(*)::int FROM epav_migration.documents) AS documents,
        (SELECT count(*)::int FROM epav_migration.document_fields) AS fields`);
    if (counts.documents!==documents || counts.fields!==fields) throw new Error('A conferência final divergiu da origem.');
    await client.query('ALTER TABLE epav_migration.documents DROP COLUMN firestore_fields');
  }
  await assertTyped(client);
  return {documents,fields};
}
