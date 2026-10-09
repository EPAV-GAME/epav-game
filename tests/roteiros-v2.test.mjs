import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({});
vm.runInContext(readFileSync(new URL('../js/clientsData.js',import.meta.url),'utf8'),context);
vm.runInContext(readFileSync(new URL('../js/roteiros-v2.js',import.meta.url),'utf8'),context);
test('all revised scenes offer four unique choices across quality bands and preserve the draw on resume',()=>{
 const scripts=vm.runInContext('clientes',context),api=context.EpavRoteirosV2;
 assert.equal(scripts.length,5);
 assert.equal(scripts.reduce((n,c)=>n+c.decisoes,0),40);
 for(const client of scripts) {
  assert.ok(client.dialogo.d1.aberturaVendedor);
  for(const [node,no] of Object.entries(client.dialogo)) {
   assert.equal(no.opcoes.length,8);
   const state={clienteAtual:client,noAtual:node,satisfacao:55,historicoAtendimento:[]};
   const options=api.alternativas(no,state,()=>.1);
   assert.equal(new Set(options.map(o=>o.id)).size,4);
   assert.ok(options.filter(o=>o.pontos>0).length>=2);
   const resumed=JSON.parse(JSON.stringify(state));resumed.clienteAtual=client;
   assert.deepEqual([...api.alternativas(no,resumed,()=>.9)].map(o=>o.id),[...options].map(o=>o.id));
  }
 }
});
test('bad choices close only after the confidence limit, without replacing an answer with a recovery shortcut',()=>{
 const client=vm.runInContext('clientes[0]',context);
 const no=client.dialogo.d1;
 const state={clienteAtual:client,noAtual:'d1',satisfacao:12,alternativasRoteiro:{'cliente1:d1':['d1-o1','d1-o2','d1-o7','d1-o8']}};
 const choices=context.EpavRoteirosV2.alternativas(no,state);
 assert.equal(choices.find(o=>o.id==='d1-o7').proximoNo(state),null);
 state.satisfacao=30;
 assert.equal(choices.find(o=>o.id==='d1-o7').proximoNo(state),'d2');
 assert.ok(choices.every(o=>!o.texto.includes('voltar um passo')));
});
