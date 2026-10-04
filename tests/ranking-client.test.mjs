import test from 'node:test';
import assert from 'node:assert/strict';
import { readRanking } from '../js/ranking-client.mjs';

test('ranking uses the cache API and does not send player identity or credentials', async () => {
  const data = [{ nome: 'Jogador', pontos: 120 }];
  const result = await readRanking({ fetcher: async (url, options) => {
    assert.equal(url, 'https://epav-product-evaluator.kevinernandes2012.workers.dev/v1/ranking');
    assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers, undefined);
    return { ok: true, json: async () => ({ resultados: data }) };
  } });
  assert.deepEqual(result, data);
});

test('quota errors and invalid responses do not become an empty leaderboard', async () => {
  await assert.rejects(readRanking({ fetcher: async () => ({ ok: false,
    json: async () => ({ detail: 'CATALOG_QUOTA_EXCEEDED' }) }) }), /CATALOG_QUOTA_EXCEEDED/);
  await assert.rejects(readRanking({ fetcher: async () => ({ ok: true,
    json: async () => ({ resultados: [null] }) }) }), /SERVICE/);
});
