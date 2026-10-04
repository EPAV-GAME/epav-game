import test from 'node:test';
import assert from 'node:assert/strict';
import { productRequest, productImageUrl, productServiceUrl, createRecommendationLoader } from '../js/product-client.mjs';

const catalog = () => ({ produtos: ['a', 'b', 'c'].map(id => ({ id,
  imagem_url: 'https://epav-swift-images.kevinernandes2012.workers.dev/images/swift/' + id.repeat(64) + '.webp' })) });
test('tokens go only to the evaluator, never an arbitrary host or redirect', async () => {
  assert.throws(() => productServiceUrl({ productServiceUrl: 'https://example.com' }));
  let request;
  await productRequest('/v1/recomendacoes', {}, { token: 'session', fetcher: async (url, options) => {
    request = { url, options }; return { ok: true, json: async () => catalog() };
  } });
  assert.equal(request.options.redirect, 'error');
  assert.equal(request.options.headers.Authorization, 'Bearer session');
  assert.equal(request.url, 'https://epav-product-evaluator.kevinernandes2012.workers.dev/v1/recomendacoes');
  assert.equal(productImageUrl('https://example.com/private.png'), null);
});

test('recommendations never render products without a valid bucket photo', async () => {
  for (const image of [null, '', 'https://example.com/photo.webp']) {
    const result = catalog(); result.produtos[1].imagem_url = image;
    await assert.rejects(productRequest('/v1/recomendacoes', {}, { token: 'session',
      fetcher: async () => ({ ok: true, json: async () => result }) }), /INSUFFICIENT_PRODUCTS/);
  }
});

test('preparation and opening share one request; history, account and expiry invalidate it', async () => {
  let calls = 0, images = 0, clock = 0, token = 'one';
  const loader = createRecommendationLoader({ tokenProvider: async () => token, getConfig: () => ({}),
    now: () => clock, onProducts: products => { images += products.length; },
    fetcher: async url => { assert.ok(url.endsWith('/v1/recomendacoes')); calls++;
      return { ok: true, json: async () => catalog() }; } });
  const context = { cliente_id: 'cliente1', no_atual: 'd3', historico: [] };
  const [prepared, visible] = await Promise.all([loader.load(context), loader.load(context)]);
  assert.equal(calls, 1); assert.equal(images, 3); assert.equal(prepared, visible);
  await loader.load(context); assert.equal(calls, 1);
  await loader.load({ ...context, historico: ['changed'] }); assert.equal(calls, 2);
  token = 'two'; await loader.load(context); assert.equal(calls, 3);
  clock = 30001; await loader.load(context); assert.equal(calls, 4);
});

test('failed preparation is retried when opening rather than retaining a rejected promise', async () => {
  let calls = 0;
  const loader = createRecommendationLoader({ tokenProvider: async () => 'session', getConfig: () => ({}),
    fetcher: async () => { if (++calls === 1) throw new Error('offline');
      return { ok: true, json: async () => catalog() }; } });
  await assert.rejects(loader.load({}), /offline/);
  assert.equal((await loader.load({})).produtos.length, 3);
  assert.equal(calls, 2);
});
test('invalid catalog responses and scores cannot advance the game', async () => {
  const options = data => ({ token: 'session', fetcher: async () => ({ ok: true, json: async () => data }) });
  await assert.rejects(productRequest('/v1/recomendacoes', {}, options({ produtos:[{id:'a'},{id:'a'},{id:'b'}] })));
  await assert.rejects(productRequest('/v1/avaliacoes', { produto_id:'p' }, options({ score:1001, produto_id:'p' })));
  await assert.rejects(productRequest('/v1/avaliacoes', { produto_id:'p' }, options({ score:900, produto_id:'other' })));
});
