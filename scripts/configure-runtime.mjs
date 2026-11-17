// Run after activation; never prints passwords, URLs or subprocess diagnostics.
import {readFile,writeFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {randomBytes} from 'node:crypto';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import pg from 'pg';
const env=parseEnv(await readFile(process.argv[2],'utf8'));
if(env.NEON_BRANCH_ID!=='br-little-thunder-za0v0lnz') throw Error('Production required');
const direct=new URL(env.DATABASE_URL_UNPOOLED);direct.searchParams.set('sslmode','verify-full');
const db=new pg.Client({connectionString:direct.href,enableChannelBinding:true});await db.connect();
const role='epav_runtime_20261117';
const file=resolve(process.argv[3]);
let runtime;
try{
  try{runtime=parseEnv(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  await db.query('BEGIN');
  if(!runtime){
    const exists=(await db.query('SELECT 1 FROM pg_roles WHERE rolname=$1',[role])).rowCount;
    if(exists)throw Error('Role exists without local secret; do not reset automatically');
    const password=randomBytes(32).toString('base64url');
    await db.query(`CREATE ROLE ${role} LOGIN PASSWORD '${password}'`);
    const url=new URL(env.DATABASE_URL);url.username=role;url.password=password;
    runtime={DATABASE_URL:url.href,DATA_SYNC_TOKEN:randomBytes(48).toString('base64url')};
  }
  await db.query(`GRANT USAGE ON SCHEMA epav_data TO ${role}`);
  await db.query(`GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA epav_data TO ${role}`);
  await db.query(`GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA epav_data TO ${role}`);
  await db.query(`GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA epav_data TO ${role}`);
  await db.query('COMMIT');
  await writeFile(file,Object.entries(runtime).map(([k,v])=>k+'='+JSON.stringify(v)).join('\n')+'\n',{mode:0o600});
  function run(command,args,input,cwd){
    const result=spawnSync(command,args,{input,encoding:'utf8',cwd});
    if(result.status!==0)throw Error('Failed configuring '+args[0]+'; diagnostics omitted to protect secrets');
  }
  const api=resolve(process.argv[4]);
  run(process.execPath,['node_modules/wrangler/bin/wrangler.js','secret','bulk','--profile','epav'],JSON.stringify(runtime),api);
  run('gh',['secret','set','DATA_SYNC_TOKEN','--repo','EPAV-GAME/epav-swift-images'],runtime.DATA_SYNC_TOKEN);
  console.log('Application role and Cloudflare/GitHub runtime secrets configured. The role uses only the application tables.');
}catch(e){await db.query('ROLLBACK').catch(()=>{});console.error('Configuration failed:',e.code??e.message);process.exitCode=1;}
finally{await db.end();}
