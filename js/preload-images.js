(() => {
  // Mantém as imagens carregadas e decodificadas disponíveis durante a partida.
  const cache = new Map();

  function carregar(caminho) {
    if (cache.has(caminho)) return cache.get(caminho).pronta;

    const imagem = new Image();
    imagem.decoding = 'async';
    imagem.fetchPriority = 'low';
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
    'img2.jpg', 'img3.jpg', 'epav-logo.png', 'epav-icone.png',
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

  // Começa no menu, sem bloquear a navegação ou disparar todos os downloads de uma vez.
  const prontas = Promise.all(Array.from({ length: 4 }, () => processarFila()));
  window.EpavImagens = { carregar, prontas };
})();
