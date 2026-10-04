(() => {
const MENU_CATEGORIES = [
  {id:'entrada', label:'Entrada'}, {id:'principal', label:'Prato principal'},
  {id:'acompanhamento', label:'Acompanhamento'}, {id:'bebida', label:'Bebidas'},
  {id:'sobremesa', label:'Sobremesa'}
];
function menuStage(client, node) {
  const index = Object.keys(client.dialogo).slice(-5).indexOf(node);
  return index < 0 ? null : MENU_CATEGORIES[index];
}
function menuRecords(record) { return record?.versao === 2 && Array.isArray(record.escolhas) ? record.escolhas : []; }
function saveMenuRecord(menu, record) {
  return {versao:2, escolhas:[...menuRecords(menu).filter(item=>item.categoria!==record.categoria),record]
    .sort((a,b)=>MENU_CATEGORIES.findIndex(c=>c.id===a.categoria)-MENU_CATEGORIES.findIndex(c=>c.id===b.categoria))};
}
function previousMenuChoices(menu, category) {
  const index = MENU_CATEGORIES.findIndex(c=>c.id===category);
  return menuRecords(menu).filter(item=>item.status==='avaliado' && item.concluido &&
    MENU_CATEGORIES.findIndex(c=>c.id===item.categoria)<index)
    .map(item=>({categoria:item.categoria, produto_id:item.produtoId, quantidade:item.quantidade}));
}
function menuSummary(menu) {
  if (menu?.versao !== 2) return menu?.status==='avaliado' ? `Produto indicado: ${menu.nome} · adequação ${menu.avaliacao.score}/1000` : '';
  const chosen=menuRecords(menu).filter(item=>item.status==='avaliado');
  return chosen.map(item=>`${MENU_CATEGORIES.find(c=>c.id===item.categoria)?.label || item.categoria}: ${item.nome} (${item.avaliacao.score}/1000)`).join(' · ');
}

globalThis.EpavMenu={MENU_CATEGORIES,menuStage,menuRecords,saveMenuRecord,previousMenuChoices,menuSummary};
})();
