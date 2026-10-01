import test from 'node:test';
import assert from 'node:assert/strict';
import { selecionarResultados, resumirResultados, gerarCsv, formatarTempo } from '../js/admin-data.mjs';

const resultados = [
  { nome: 'Álvaro', pontos: 200, tempoJogadoMs: 90000, satisfacao: 80, publicadoMs: 1000 },
  { nome: 'Marina', pontos: 300, tempoJogadoMs: 100000, satisfacao: 100, publicadoMs: 2000 },
  { nome: 'Kevin', pontos: 300, tempoJogadoMs: 60000, satisfacao: 90, publicadoMs: 3000 }
];

test('busca ignora acentos e caixa e ordenação desempata por menor tempo', () => {
  assert.deepEqual(selecionarResultados(resultados).map(r => r.nome), ['Kevin', 'Marina', 'Álvaro']);
  assert.equal(selecionarResultados(resultados, ' ALVARO ')[0].nome, 'Álvaro');
  assert.deepEqual(selecionarResultados(resultados, '', 'recentes').map(r => r.nome), ['Kevin', 'Marina', 'Álvaro']);
  assert.equal(resultados[0].nome, 'Álvaro');
});

test('resumo e tempo cobrem resultados vazios e registros antigos', () => {
  assert.deepEqual(resumirResultados([]), { total: 0, media: 0, melhor: 0, satisfacao: 0 });
  assert.equal(resumirResultados(resultados).satisfacao, 90);
  assert.equal(formatarTempo(undefined), '—');
  assert.equal(formatarTempo(61999), '1:01');
});

test('CSV escapa aspas, delimitadores e quebras de linha e neutraliza fórmulas', () => {
  const csv = gerarCsv([{ nome: ' =HYPERLINK("x")', classificacao: 'Bom;\nMuito bom' }]);
  assert.ok(csv.includes('"\' =HYPERLINK(""x"")"'));
  assert.ok(csv.includes('"Bom;\nMuito bom"'));
  assert.ok(gerarCsv([{ nome: '@SUM(1)' }]).includes('"\'@SUM(1)"'));
});
