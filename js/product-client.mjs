const SERVICE = 'https://epav-product-evaluator.kevinernandes2012.workers.dev';
export function productServiceUrl(config) {
  const url = new URL(config?.productServiceUrl || SERVICE);
  if (url.origin !== SERVICE || url.pathname !== '/' || url.username || url.password || url.search || url.hash) throw new Error('CONFIG');
  return url.origin;
}
export function productImageUrl(value) {
  return typeof value === 'string' && /^https:\/\/epav-swift-images\.kevinernandes2012\.workers\.dev\/images\/swift\/[a-f0-9]{64}\.webp$/.test(value) ? value : null;
}
export async function productRequest(path, data, { config, token, signal, fetcher = fetch }) {
  const origin = productServiceUrl(config);
  if (!['/v1/recomendacoes', '/v1/avaliacoes'].includes(path)) throw new Error('CONFIG');
  if (!token) throw new Error('LOGIN');
  const response = await fetcher(origin + path, { method: 'POST', redirect: 'error', signal,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(response.status === 401 ? 'LOGIN' : typeof result.detail === 'string' ? result.detail : 'SERVICE');
  if (path === '/v1/recomendacoes') {
    const count=result.produtos?.length;
    if (!Array.isArray(result.produtos) || new Set(result.produtos.map(p=>p.id)).size !== count) throw new Error('SERVICE');
    if (data.categoria) {
      if (result.categoria !== data.categoria || result.quantidade_solicitada !== 10 || count > 10 ||
          !Number.isInteger(result.total_disponiveis) || result.total_disponiveis < count ||
          count !== Math.min(10,result.total_disponiveis)) throw new Error('SERVICE');
    } else if (count !== 3) throw new Error('SERVICE');
  }
  if (path === '/v1/recomendacoes' && result.produtos.some(p => !productImageUrl(p.imagem_url))) throw new Error('INSUFFICIENT_PRODUCTS');
  if (path === '/v1/avaliacoes' && (!Number.isInteger(result.score) || result.score < 0 || result.score > 1000 || result.produto_id !== data.produto_id)) throw new Error('SERVICE');
  return result;
}

// One pending/result entry per browser, shared by preparation and the visible modal.
// Account changes, different histories and expiration always start a fresh request.
export function createRecommendationLoader({ tokenProvider, getConfig, fetcher = fetch,
  onProducts = () => {}, now = Date.now, ttl = 30000 }) {
  let entry;
  async function load(context) {
    const token = await tokenProvider();
    const payload = JSON.stringify(context);
    const key = token + ':' + payload;
    if (entry?.key === key && now() < entry.expires) return entry.promise;
    entry?.controller.abort();
    const active = { key, expires: now() + ttl, controller: new AbortController() };
    entry = active;
    active.promise = productRequest('/v1/recomendacoes', JSON.parse(payload), {
      config: getConfig(), token, fetcher, signal: active.controller.signal
    }).then(result => {
      if (entry === active) onProducts(result.produtos);
      return result;
    }).catch(error => {
      if (entry === active) entry = undefined;
      throw error;
    });
    return active.promise;
  }
  function clear() { entry?.controller.abort(); entry = undefined; }
  return { load, clear };
}
