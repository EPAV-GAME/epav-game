(() => {
  // Mantém as imagens carregadas e decodificadas disponíveis durante a partida.
  const cache = new Map();

  function url(caminho) {
    const nome = caminho.replace(/^assets\/images\//, '');
    return window.EPAV_IMAGE_ASSETS?.[nome] || caminho;
  }

  function carregar(caminho, { prioridade = 'low' } = {}) {
    caminho = url(caminho);
    if (cache.has(caminho)) {
      if (prioridade === 'high') cache.get(caminho).imagem.fetchPriority = 'high';
      return cache.get(caminho).pronta;
    }

    const imagem = new Image();
    imagem.decoding = 'async';
    imagem.fetchPriority = prioridade;
    const pronta = new Promise(resolve => {
      imagem.onload = async () => {
        try {
          if (typeof imagem.decode === 'function') await imagem.decode();
        } catch {
          // O navegador ainda pode exibir a imagem se a decodificação antecipada falhar.
        }
        imagem.onload = null;
        imagem.onerror = null;
        resolve(true);
      };
      imagem.onerror = () => {
        // Permite uma nova tentativa ao entrar no atendimento, sem interromper a fila.
        cache.delete(caminho);
        imagem.onload = null;
        imagem.onerror = null;
        resolve(false);
      };
    });
    cache.set(caminho, { imagem, pronta });
    imagem.src = caminho;
    return pronta;
  }

  const arquivos = [
    'tela-principal-v2.png', 'escritorio-geral.png', 'escritorio-dialogo-v2.png',
    'img2.jpg', 'img3.jpg', 'epav-logo.png',
    'vendedor-parado.png', 'vendedora-parada.png',
    ...clientes.flatMap(cliente => [
      cliente.imagem || `${cliente.id}.png`,
      ...Object.values(cliente.reacoes || {})
    ]),
    ...['vendedor', 'vendedora'].flatMap(prefixo => {
      const expressoes = prefixo === 'vendedor'
        ? ['parado', 'feliz', 'falando', 'frustrado', 'pensando', 'surpreso', 'comemorando']
        : ['parada', 'feliz', 'falando', 'frustrada', 'pensando', 'surpresa', 'comemorando'];
      return [
        ...expressoes.map(expressao => `${prefixo}-${expressao}.png`),
        ...[1, 2, 3, 4].map(numero => `${prefixo}-andando-${numero}.png`)
      ];
    })
  ];
  const fila = [...new Set(arquivos)].map(arquivo => `assets/images/${arquivo}`);

  async function processarFila() {
    while (fila.length) await carregar(fila.shift());
  }

  const fundos = {
    'tela-menu': 'tela-principal-v2.png',
    'tela-personalizacao': 'tela-principal-v2.png',
    'tela-tutorial': 'escritorio-geral.png',
    'tela-escritorio': 'escritorio-geral.png',
    'tela-dialogo': 'escritorio-dialogo-v2.png',
    'tela-cutscene': 'escritorio-geral.png',
    'tela-resultado': 'img2.jpg',
    'tela-final': 'img3.jpg'
  };
  function priorizarTela(id) {
    if (fundos[id]) carregar(`assets/images/${fundos[id]}`, { prioridade: 'high' });
    document.getElementById(id)?.querySelectorAll('img[src]').forEach(imagem => {
      carregar(imagem.getAttribute('src'), { prioridade: 'high' });
    });
  }

  // O cenário inicial chega primeiro. Só depois duas filas de baixa prioridade
  // aquecem as próximas telas, sem disputar quatro downloads com a abertura.
  const prontas = carregar('assets/images/tela-principal-v2.png', { prioridade: 'high' })
    .then(() => new Promise(resolve => {
      const iniciar = () => resolve(Promise.all(Array.from({ length: 2 }, () => processarFila())));
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(iniciar, { timeout: 1500 });
      else setTimeout(iniciar, 0);
    }));
  window.EpavImagens = { carregar, prontas, url, priorizarTela };
})();
