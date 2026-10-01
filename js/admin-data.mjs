const numero = valor => Number.isFinite(valor) ? valor : 0;
const normalizar = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

export function selecionarResultados(registros, busca = '', ordem = 'pontos') {
  const termo = normalizar(busca).trim();
  return registros.filter(r => normalizar(r.nome).includes(termo)).sort((a, b) => {
    if (ordem === 'nome') return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
    if (ordem === 'recentes') return numero(b.publicadoMs) - numero(a.publicadoMs);
    return numero(b.pontos) - numero(a.pontos) || (Number.isFinite(a.tempoJogadoMs) ? a.tempoJogadoMs : Infinity) - (Number.isFinite(b.tempoJogadoMs) ? b.tempoJogadoMs : Infinity);
  });
}

export function resumirResultados(registros) {
  return {
    total: registros.length,
    media: registros.length ? registros.reduce((s, r) => s + numero(r.pontos), 0) / registros.length : 0,
    melhor: registros.length ? Math.max(...registros.map(r => numero(r.pontos))) : 0,
    satisfacao: registros.length ? registros.reduce((s, r) => s + numero(r.satisfacao), 0) / registros.length : 0
  };
}

export function formatarTempo(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const segundos = Math.floor(ms / 1000);
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
}

export function gerarCsv(registros) {
  // Neutraliza fórmulas de planilha mesmo em nomes recebidos do banco.
  const celula = valor => {
    const texto = String(valor ?? '');
    const seguro = /^[\s\u0000-\u001f]*[=+@-]/.test(texto) ? `'${texto}` : texto;
    return `"${seguro.replace(/"/g, '""')}"`;
  };
  const linhas = [['Jogador', 'Pontos', 'Qualidade /40', 'Satisfação (%)', 'Tempo', 'Classificação', 'Publicação']];
  for (const r of registros) linhas.push([r.nome, r.pontos, Number.isFinite(r.qualidadeQuartos) ? r.qualidadeQuartos / 4 : '', r.satisfacao, formatarTempo(r.tempoJogadoMs), r.classificacao, r.publicadoMs ? new Date(r.publicadoMs).toISOString() : '']);
  return linhas.map(linha => linha.map(celula).join(';')).join('\r\n');
}
