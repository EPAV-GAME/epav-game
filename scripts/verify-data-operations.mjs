import {isDeepStrictEqual} from 'node:util';

export async function verifyDataOperations(db, normalize){
  await db.query('SAVEPOINT relational_probe');
  const {rows:[sample]}=await db.query(`SELECT id,revision FROM epav_data.produtos_swift ORDER BY id LIMIT 1`);
  const {rows:[row]}=await db.query('SELECT epav_data.document_data($1,$2) AS data',['produtos_swift',sample.id]);
  const edited={...row.data,nome:'EPAV relational probe'};
  const {rows:[saved]}=await db.query(`SELECT epav_data.save_document('produtos_swift',$1,$2,$3::jsonb) AS revision`,[sample.id,sample.revision,JSON.stringify(edited)]);
  const {rows:[check]}=await db.query('SELECT nome FROM epav_data.produtos_swift WHERE id=$1',[sample.id]);
  if(check.nome!==edited.nome)throw Error('Escrita direta não atualizou o produto');
  const auditId='epav-relational-probe-audit';
  const audit={produtoId:sample.id,autorUid:'probe',autorEmail:'probe@example.invalid',criadoEm:new Date().toISOString(),antes:row.data,depois:edited};
  await db.query("SELECT epav_data.save_document('auditoria_catalogo',$1,'',$2::jsonb)",[auditId,JSON.stringify(audit)]);
  if(!isDeepStrictEqual(normalize((await db.query("SELECT epav_data.document_data('auditoria_catalogo',$1) AS data",[auditId])).rows[0].data),normalize(audit)))throw Error('Auditoria divergente');
  await db.query('SAVEPOINT conflict_probe');
  let conflict=false;
  try{await db.query("SELECT epav_data.save_document('produtos_swift',$1,$2,$3::jsonb)",[sample.id,sample.revision,JSON.stringify(edited)]);}catch(error){conflict=error.code==='40001';}
  await db.query('ROLLBACK TO SAVEPOINT conflict_probe');
  if(!conflict)throw Error('A revisão antiga foi aceita');
  const archiveId='epav-relational-probe-archive';
  const archive={produtoId:sample.id,motivo:'not_found_in_swift',versaoOriginal:saved.revision,duplicadoDe:null,arquivadoEm:new Date().toISOString(),dados:edited};
  await db.query("SELECT epav_data.save_document('arquivo_produtos_swift',$1,'',$2::jsonb)",[archiveId,JSON.stringify(archive)]);
  await db.query('SELECT epav_data.remove_product($1,$2)',[sample.id,saved.revision]);
  if((await db.query('SELECT 1 FROM epav_data.produtos_swift WHERE id=$1',[sample.id])).rowCount)throw Error('Arquivamento falhou');
  await db.query("SELECT epav_data.save_document('produtos_swift',$1,'',$2::jsonb)",[sample.id,JSON.stringify(edited)]);
  if((await db.query('SELECT count(*)::int AS n FROM epav_data.produtos_swift_imagens WHERE produto_id=$1',[sample.id])).rows[0].n!==(edited.imagemSwift?1:0))throw Error('Restauração da foto falhou');
  await db.query('ROLLBACK TO SAVEPOINT relational_probe');
}
