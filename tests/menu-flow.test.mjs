import test from 'node:test';
import assert from 'node:assert/strict';
import '../js/menu-flow.js';
const {MENU_CATEGORIES,menuStage,saveMenuRecord,previousMenuChoices,menuSummary}=globalThis.EpavMenu;
import {productRequest,createRecommendationLoader} from '../js/product-client.mjs';
test('five menu roles are interleaved with existing dialogue turns',()=>{
  for(const count of [6,7,8,9,10]) {
    const client={dialogo:Object.fromEntries(Array.from({length:count},(_,i)=>['d'+(i+1),{}]))};
    assert.equal(menuStage(client,'d1'),null);
    MENU_CATEGORIES.forEach((category,i)=>assert.equal(menuStage(client,'d'+(count-4+i)).id,category.id));
  }
});
test('resume preserves each assessment; only completed earlier foods enter the next context',()=>{
  const entry={categoria:'entrada',noId:'d2',status:'avaliado',concluido:true,produtoId:'a',nome:'Pão',quantidade:{unidades:2},avaliacao:{score:800}};
  let menu=saveMenuRecord(null,entry);
  menu=saveMenuRecord(menu,{...entry,categoria:'principal',produtoId:'b',nome:'Carne',concluido:false});
  assert.deepEqual(previousMenuChoices(menu,'principal'),[{categoria:'entrada',produto_id:'a',quantidade:{unidades:2}}]);
  assert.deepEqual(previousMenuChoices(menu,'entrada'),[]);
  assert.equal(previousMenuChoices(menu,'acompanhamento').length,1);
  menu=saveMenuRecord(menu,{...entry,categoria:'principal',produtoId:'b',nome:'Carne',concluido:true});
  assert.equal(menu.escolhas.length,2);assert.equal(previousMenuChoices(menu,'sobremesa').length,2);
  const restored=JSON.parse(JSON.stringify(menu));assert.deepEqual(restored,menu);
  assert.match(menuSummary(restored),/Entrada: Pão/);assert.match(menuSummary(restored),/Prato principal: Carne/);
});
test('category responses require ten real distinct options or an explicit smaller inventory',async()=>{
  const photo='https://epav-swift-images.kevinernandes2012.workers.dev/images/swift/'+'a'.repeat(64)+'.webp';
  const response=count=>({categoria:'bebida',quantidade_solicitada:10,total_disponiveis:count,produtos:Array.from({length:Math.min(10,count)},(_,i)=>({id:String(i),imagem_url:photo}))});
  const run=data=>productRequest('/v1/recomendacoes',{categoria:'bebida'},{token:'x',fetcher:async()=>({ok:true,json:async()=>data})});
  for(const count of [0,2,10,30]) assert.equal((await run(response(count))).produtos.length,Math.min(count,10));
  await assert.rejects(run({...response(10),categoria:'entrada'}),/SERVICE/);
  await assert.rejects(run({...response(10),total_disponiveis:9}),/SERVICE/);
  await assert.rejects(run({...response(10),produtos:Array(10).fill(response(1).produtos[0])}),/SERVICE/);
});
test('prefetch keys include category and do not reuse a different menu role',async()=>{
  let calls=0;const photo='https://epav-swift-images.kevinernandes2012.workers.dev/images/swift/'+'a'.repeat(64)+'.webp';
  const loader=createRecommendationLoader({tokenProvider:async()=>'x',getConfig:()=>({}),fetcher:async(url,options)=>{
    calls++;const request=JSON.parse(options.body);return {ok:true,json:async()=>({categoria:request.categoria,quantidade_solicitada:10,total_disponiveis:1,produtos:[{id:'a',imagem_url:photo}]})};}});
  await loader.load({categoria:'entrada'});await loader.load({categoria:'entrada'});assert.equal(calls,1);
  await loader.load({categoria:'sobremesa'});assert.equal(calls,2);
});
