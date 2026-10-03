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
  if (path === '/v1/recomendacoes' && (!Array.isArray(result.produtos) || result.produtos.length !== 3 || new Set(result.produtos.map(p => p.id)).size !== 3)) throw new Error('SERVICE');
  if (path === '/v1/avaliacoes' && (!Number.isInteger(result.score) || result.score < 0 || result.score > 1000 || result.produto_id !== data.produto_id)) throw new Error('SERVICE');
  return result;
}
