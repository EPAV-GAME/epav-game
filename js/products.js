/* Catálogo e avaliação: credenciais de serviço e chaves de IA ficam no servidor. */
(() => {
  const $ = id => document.getElementById(id);
  const modal = $('modal-produtos');
  let session = null, busy = false, controller = null, clientPromise, loaderPromise;
  const client = () => clientPromise ||= import('./product-client.mjs?v=20261004-menu');
  const menuApi = Promise.resolve(window.EpavMenu);
  const labels = {entrada:'Entrada',principal:'Prato principal',acompanhamento:'Acompanhamento',bebida:'Bebidas',sobremesa:'Sobremesa'};
  const categoryIds = Object.keys(labels);
  const loader = () => loaderPromise ||= client().then(api => api.createRecommendationLoader({
    tokenProvider: () => window.EpavRanking.tokenProdutos(), getConfig: () => window.EPAV_GAME_CONFIG,
    onProducts: products => products.forEach(product => window.EpavImagens.carregar(product.imagem_url))
  }));
  function prepare(context) {
    loader().then(cache => cache.load(context)).catch(() => {});
  }
  function status(text) { $('produtos-status').textContent = text; }
  function button(text, action, secondary = false) {
    const element = document.createElement('button'); element.type = 'button';
    element.className = 'botao ' + (secondary ? 'secundario' : 'primario'); element.textContent = text; element.onclick = action;
    return element;
  }
  function close({ preservarPreparacao = false } = {}) {
    controller?.abort(); controller = null; session = null; busy = false;
    if (!preservarPreparacao) loaderPromise?.then(cache => cache.clear());
    modal.hidden = true; modal.inert = false;
    if (!jogoPausado) $('jogo').inert = false;
  }
  function finish(record) {
    const callback = session?.aoConcluir;
    const completed = {...record,categoria:session.contexto.categoria};
    close(); callback?.(completed);
  }
  async function request(path, data) {
    const token = await window.EpavRanking.tokenProdutos();
    const api = await client();
    return api.productRequest(path, data, { config: window.EPAV_GAME_CONFIG, token, signal: controller.signal });
  }
  function failure(error, retry) {
    const login = error.message === 'LOGIN';
    if (login) session.repetirDepoisLogin = retry;
    status(login ? 'Entre ou crie uma conta para consultar os produtos e receber a avaliação.'
      : error.message === 'CATALOG_QUOTA_EXCEEDED'
        ? 'O banco de produtos atingiu o limite de consultas. Tente novamente quando ele estiver disponível ou continue sem avaliação.'
      : error.message === 'INSUFFICIENT_PRODUCTS'
        ? 'Ainda não há produtos desta categoria com foto para este atendimento. Tente novamente mais tarde ou continue sem avaliação.'
      : error.message === 'RATE_LIMITED' || error.message === 'GROQ_TEMPORARILY_UNAVAILABLE'
        ? 'O serviço está ocupado. Aguarde um pouco e tente novamente.'
        : 'Não foi possível consultar o serviço agora. Você pode tentar novamente ou continuar sem esta avaliação.');
    $('produtos-acoes').replaceChildren(
      button(login ? 'Entrar ou criar conta' : 'Tentar novamente', login ? () => { modal.inert = true; window.EpavRanking.abrirConta({ finalidade: 'produtos' }); } : retry),
      button('Continuar sem avaliação', () => finish({ noId: session.contexto.no_atual, status: 'indisponivel' }), true));
  }
  function photo(product, api) {
    const box = document.createElement('div'); box.className = 'produto-foto';
    const placeholder = document.createElement('span'); placeholder.textContent = 'Carregando foto…'; box.append(placeholder);
    const url = api.productImageUrl(product.imagem_url);
    if (url) {
      const image = document.createElement('img'); image.width = 512; image.height = 512;
      image.alt = 'Foto de ' + product.nome; image.decoding = 'async'; image.referrerPolicy = 'no-referrer';
      image.loading = 'lazy'; image.fetchPriority = 'low';
      image.style.opacity = '0';
      image.onload = () => { placeholder.hidden = true; image.style.opacity = '1'; };
      image.onerror = () => { image.remove(); placeholder.textContent = 'Não foi possível carregar a foto.'; placeholder.hidden = false; };
      image.src = url; box.append(image);
    }
    return box;
  }
  function cards(products, api) {
    const fragment = document.createDocumentFragment();
    const start=(session.pagina || 0)*5;
    for (const [offset, product] of products.slice(start,start+5).entries()) {
      const index=start+offset;
      const card = document.createElement('article'); card.className = 'produto-cartao';
      const label = document.createElement('label'); label.className = 'produto-selecao';
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'produto'; radio.value = product.id;
      radio.checked=session.escolhido===product.id;
      radio.onchange=()=>{session.escolhido=product.id;$('produto-selecionado').textContent='Selecionado: '+product.nome;};
      const title = document.createElement('strong'); title.textContent = `${index + 1}. ${product.nome}`;
      label.append(radio, title); card.append(photo(product, api), label);
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = 'Ver ficha do produto';
      const fields = document.createElement('dl');
      for (const [name, value] of [['Código', product.codigo], ['Marca', product.marca], ['Tipo', product.tiposProduto.join(', ')], ['Ocasiões', product.ocasioes.join(', ')], ['Formato', product.formato], ['Unidade', product.unidade_medida], ['Peso da embalagem (kg)', product.peso_embalagem_kg]]) {
        const term = document.createElement('dt'); term.textContent = name;
        const detail = document.createElement('dd'); detail.textContent = value || 'Não informado'; fields.append(term, detail);
      }
      const note = document.createElement('p'); note.className = 'produto-nota'; note.textContent = 'Composição, alergênicos e modo de preparo: confirme no rótulo. As categorias não comprovam essas informações.';
      details.append(summary, fields, note); card.append(details); fragment.append(card);
    }
    $('produtos-lista').replaceChildren(fragment);
    const page=session.pagina || 0, pages=Math.ceil(products.length/5);
    const caption=document.createElement('span'); caption.textContent=`Opções ${start+1}–${Math.min(start+5,products.length)} de ${products.length}`;
    const previous=button('← Anteriores',()=>{session.pagina--;cards(products,api);},true);
    const next=button('Mais opções →',()=>{session.pagina++;cards(products,api);},true);
    previous.disabled=page===0;next.disabled=page+1>=pages;
    $('produtos-paginacao').replaceChildren(previous,caption,next);
  }
  async function load() {
    if (!session || busy) return;
    busy = true; const active = session;
    $('produtos-acoes').replaceChildren(); $('produtos-form').hidden = true;
    status('Buscando 10 opções de '+labels[active.contexto.categoria].toLowerCase()+'…');
    try {
      const result = await (await loader()).load(active.contexto);
      if (session !== active) return;
      active.produtos = result.produtos;
      active.pagina=0;active.escolhido=null;
      $('produto-selecionado').textContent='';
      $('produtos-contexto').textContent = `${active.cliente.perfil} ${result.ficha_escuta.join(' · ')}`;
      if (!result.produtos.length) {
        status('Não há '+labels[active.contexto.categoria].toLowerCase()+' com foto no catálogo disponível. Você pode continuar e completar as outras categorias.');
        $('produtos-acoes').replaceChildren(button('Continuar conversa',()=>finish({noId:active.contexto.no_atual,status:'sem_catalogo'})));
        return;
      }
      cards(result.produtos, await client());
      $('produtos-form').reset(); $('produtos-form').hidden = false;
      status((result.produtos.length<10 ? `Esta categoria tem ${result.produtos.length} opção(ões) com foto no catálogo. ` : '10 opções disponíveis. ')+'Consulte as fichas e recomende um produto para esta parte da refeição.');
      $('produtos-acoes').replaceChildren(button('Não sugerir esta categoria',()=>finish({noId:active.contexto.no_atual,status:'nao_indicado'}),true));
    } catch (error) { if (session === active && error.name !== 'AbortError') failure(error, load); }
    finally { if (session === active) busy = false; }
  }
  async function evaluate(event) {
    event?.preventDefault();
    if (!session || busy || !$('produtos-form').reportValidity()) return;
    const active = session;
    const selected = active.produtos.find(p => p.id === active.escolhido);
    if (!selected) {status('Selecione um produto antes de recomendar.');return;}
    const quantidade = { unidades: Number($('produto-unidades').value) };
    if ($('produto-peso').value) quantidade.peso_total_kg = Number($('produto-peso').value);
    busy = true; $('produto-confirmar').disabled = true; $('produtos-acoes').replaceChildren();
    status('Avaliando o produto com a conversa e a ficha do cliente…');
    try {
      const api=await menuApi;
      const result = await request('/v1/avaliacoes', { ...active.contexto, produto_id: selected.id, quantidade,
        escolhas_anteriores:api.previousMenuChoices(active.cardapio,active.contexto.categoria) });
      if (session !== active) return;
      active.registro = { noId: active.contexto.no_atual,categoria:active.contexto.categoria,produtoId: selected.id, nome: selected.nome, quantidade, status: 'avaliado', avaliacao: result };
      // Save before continuing so refresh restores the feedback without another AI request.
      active.aoAvaliar(active.registro);
      showResult(active.registro);
    } catch (error) { if (session === active && error.name !== 'AbortError') failure(error, () => evaluate()); }
    finally { if (session === active) { busy = false; $('produto-confirmar').disabled = false; } }
  }
  function showResult(record) {
    $('produtos-form').hidden = true; $('produtos-resultado').hidden = false;
    $('produto-score').textContent = `${record.avaliacao.score}/1000`;
    $('produto-resumo').textContent = `${record.nome}: ${record.avaliacao.resumo}`;
    $('produto-sugestao').textContent = record.avaliacao.sugestao;
    const criteria = document.createDocumentFragment();
    const labels = { necessidade: 'Necessidade', ocasiao: 'Ocasião', praticidade: 'Praticidade', restricoes: 'Restrições', quantidade: 'Quantidade' };
    for (const [key, value] of Object.entries(record.avaliacao.criterios)) {
      const paragraph = document.createElement('p'); paragraph.textContent = `${labels[key] || key}: ${value.nota}/100 — ${value.justificativa}`; criteria.append(paragraph);
    }
    $('produto-criterios').replaceChildren(criteria);
    $('produto-faltantes').textContent = record.avaliacao.informacoes_faltantes.length ? 'Ainda é preciso confirmar: ' + record.avaliacao.informacoes_faltantes.join('; ') + '.' : '';
    status('Avaliação de adequação do produto ao cliente.');
    $('produtos-acoes').replaceChildren(button('Continuar conversa', () => finish(record)));
  }
  function open(options) {
    close({ preservarPreparacao: true }); session = options; controller = new AbortController();
    const category=options.contexto.categoria;
    $('produtos-titulo').textContent = `${labels[category]} para ${options.cliente.nome}`;
    const records=options.cardapio?.versao===2 ? options.cardapio.escolhas : [];
    const steps=document.createDocumentFragment();
    for (const id of categoryIds) {
      const li=document.createElement('li'),done=records.find(item=>item.categoria===id && item.concluido);
      li.textContent=(done ? '✓ ' : '')+labels[id];
      if(id===category) li.setAttribute('aria-current','step');
      li.classList.toggle('concluida',!!done);steps.append(li);
    }
    $('cardapio-etapas').replaceChildren(steps);
    const chosen=records.filter(item=>item.status==='avaliado');
    $('cardapio-escolhas').textContent=chosen.length ? 'Já indicado: '+chosen.map(item=>labels[item.categoria]+': '+item.nome).join(' · ') : 'Monte a refeição aos poucos, considerando o que o cliente contou.';
    $('produtos-contexto').textContent = options.cliente.perfil;
    $('produtos-resultado').hidden = true; $('produtos-form').hidden = true;
    $('produtos-lista').replaceChildren(); $('produtos-acoes').replaceChildren();
    modal.hidden = false; $('jogo').inert = true;
    sincronizarCronometro(); $('produtos-titulo').focus();
    if (options.registro?.status === 'avaliado') showResult(options.registro); else load();
  }
  $('produtos-form').addEventListener('submit', evaluate);
  window.addEventListener('epav-conta-fechada', () => {
    modal.inert = jogoPausado;
    if (!session || busy) return;
    const retry = session.repetirDepoisLogin;
    delete session.repetirDepoisLogin;
    if (retry) retry(); else if (!session.produtos) load();
  });
  document.addEventListener('keydown', event => {
    if (modal.hidden || jogoPausado || !$('modal-conta').hidden || event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not(:disabled), input, summary, [tabindex="0"]')].filter(e => !e.closest('[hidden]'));
    const index = focusable.indexOf(document.activeElement);
    if ((event.shiftKey && index <= 0) || (!event.shiftKey && (index < 0 || index === focusable.length - 1))) {
      event.preventDefault(); focusable[event.shiftKey ? focusable.length - 1 : 0]?.focus();
    }
  });
  window.EpavProdutos = { abrir: open, fechar: close, preparar: prepare };
})();
