import {readFile} from 'node:fs/promises';
import {parseEnv,isDeepStrictEqual} from 'node:util';
import pg from 'pg';
import {rebuild} from './typed-fields.mjs';
import {verifyDataOperations} from './verify-data-operations.mjs';

const production=process.argv.includes('--production');
const phase=process.argv[3];
if(!['prepare','finalize'].includes(phase))throw Error('Use prepare ou finalize');
const env=parseEnv(await readFile(process.argv[2],'utf8'));
if(env.NEON_BRANCH_ID!==(production?'br-little-thunder-za0v0lnz':'br-lucky-star-za2fy0sm'))throw Error('Branch inesperada');
const url=new URL(env.DATABASE_URL_UNPOOLED);
if(!url.hostname.endsWith('.neon.tech')||url.hostname.includes('-pooler.'))throw Error('Conexão direta obrigatória');
url.searchParams.set('sslmode','verify-full');
const db=new pg.Client({connectionString:url.href,enableChannelBinding:true});
await db.connect();

function decode(fields) {
  function value(wrapped) {
    if('mapValue' in wrapped)return decode(wrapped.mapValue.fields??{});
    if('arrayValue' in wrapped)return (wrapped.arrayValue.values??[]).map(value);
    if('integerValue' in wrapped)return Number(wrapped.integerValue);
    return Object.values(wrapped)[0];
  }
  return Object.fromEntries(Object.entries(fields).map(([key,wrapped])=>[key,value(wrapped)]));
}
function normalized(data,key='') {
  if(typeof data==='string' && /^(?:\d{4}-\d\d-\d\dT)/.test(data) && Number.isFinite(Date.parse(data)))return new Date(data).toISOString();
  if((key==='codigo'||key==='Cod Produto') && /^-?\d+$/.test(String(data)))return Number(data);
  if(Array.isArray(data))return data.map(v=>normalized(v));
  if(data&&typeof data==='object')return Object.fromEntries(Object.entries(data).filter(([k])=>k!=='_updatedAt').map(([k,v])=>[k,normalized(v,k)]));
  return data;
}
const roots=['produtos_swift','arquivo_produtos_swift','auditoria_catalogo','importacoes_catalogo','sincronizacao_imagens_swift'];
async function compareDocuments(){
  let total=0;
  for(const collection of roots){
    const {rows:documents}=await db.query('SELECT row_id,document_id FROM epav_internal.records WHERE collection_path=$1 ORDER BY document_id',[collection]);
    for(let start=0;start<documents.length;start+=100){
      const batch=documents.slice(start,start+100);
      const {rows:fields}=await db.query(`SELECT document_row_id,node_no,parent_no,field_name,array_index,kind,string_value,integer_value,double_value,boolean_value,
        to_char(timestamp_value AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS timestamp_value,
        replace(encode(bytes_value,'base64'),chr(10),'') AS bytes_value,reference_value,latitude,longitude,members_present
        FROM epav_internal.record_fields WHERE document_row_id=ANY($1::bigint[]) ORDER BY document_row_id,node_no`,[batch.map(d=>d.row_id)]);
      const {rows:relational}=await db.query('SELECT id,epav_data.document_data($1,id) AS data FROM unnest($2::varchar[]) AS id',[collection,batch.map(d=>d.document_id)]);
      const grouped=new Map();
      for(const field of fields){if(!grouped.has(field.document_row_id))grouped.set(field.document_row_id,[]);grouped.get(field.document_row_id).push(field);}
      for(let i=0;i<batch.length;i++){
        const expected=normalized(decode(rebuild(grouped.get(batch[i].row_id)??[])));
        const actual=normalized(relational[i].data);
        if(!isDeepStrictEqual(expected,actual)){
          // Log field paths only, without values or record identifiers.
          function differences(a,b,prefix=''){
            if(isDeepStrictEqual(a,b))return [];
            if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b))
              return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(key=>differences(a[key],b[key],prefix?prefix+'.'+key:key));
            return [prefix];
          }
          throw Error('Conferência divergente em '+collection+': '+differences(expected,actual).join(', '));
        }
        total++;
      }
    }
  }
  return total;
}


try{
  await db.query('BEGIN');
  await db.query("SET LOCAL lock_timeout='15s'");
  if(phase==='prepare'){
    await db.query(await readFile(new URL('../migrations/008-direct-relational-storage.sql',import.meta.url),'utf8'));
    const verified=await compareDocuments();
    await verifyDataOperations(db, normalized);
    // Retire old writes before deploying the direct API, preventing stale internal data overwrites.
    await db.query(`CREATE OR REPLACE FUNCTION epav_data.put_record(c varchar,i varchar,expected varchar,nodes jsonb)
      RETURNS uuid LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Relational API upgrade in progress' USING ERRCODE='55000'; END $$`);
    await db.query('COMMIT');
    console.log(JSON.stringify({phase,branch:production?'production':'staging',verified_documents:verified,direct_writes_audit_archive_restore_conflicts:'passed'}));
  }else{
    await verifyDataOperations(db, normalized);
    await db.query(await readFile(new URL('../migrations/009-remove-compatibility-storage.sql',import.meta.url),'utf8'));
    await verifyDataOperations(db, normalized);
    const {rows:tables}=await db.query(`SELECT schemaname,tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2`);
    if(tables.length!==11||tables.some(t=>t.schemaname!=='epav_data'))throw Error('Tabelas inesperadas após a limpeza');
    await db.query('COMMIT');
    console.log(JSON.stringify({phase,branch:production?'production':'staging',tables:tables.map(t=>t.tablename),direct_writes_audit_archive_restore_conflicts:'passed'}));
  }
}catch(error){await db.query('ROLLBACK');console.error('Conversão cancelada:',error.code??error.message,error.routine??'',error.position??'',['42601','42804','42702'].includes(error.code)?error.message:'');process.exitCode=1;}
finally{await db.end();}
