import test from 'node:test';
import assert from 'node:assert/strict';
import { productRequest, productImageUrl, productServiceUrl } from '../js/product-client.mjs';
test('tokens go only to the evaluator, never an arbitrary host or redirect', async () => {
  assert.throws(() => productServiceUrl({ productServiceUrl: 'https://example.com' }));
  let request;
  await productRequest('/v1/recomendacoes', {}, { token: 'session', fetcher: async (url, options) => {
    request = { url, options }; return { ok: true, json: async () => ({ produtos: [{id:'a'}, {id:'b'}, {id:'c'}] }) };
  } });
  assert.equal(request.options.redirect, 'error');
  assert.equal(request.options.headers.Authorization, 'Bearer session');
  assert.equal(request.url, 'https://epav-product-evaluator.kevinernandes2012.workers.dev/v1/recomendacoes');
  assert.equal(productImageUrl('https://example.com/private.png'), null);
});
test('invalid catalog responses and scores cannot advance the game', async () => {
  const options = data => ({ token: 'session', fetcher: async () => ({ ok: true, json: async () => data }) });
  await assert.rejects(productRequest('/v1/recomendacoes', {}, options({ produtos:[{id:'a'},{id:'a'},{id:'b'}] })));
  await assert.rejects(productRequest('/v1/avaliacoes', { produto_id:'p' }, options({ score:1001, produto_id:'p' })));
  await assert.rejects(productRequest('/v1/avaliacoes', { produto_id:'p' }, options({ score:900, produto_id:'other' })));
});
