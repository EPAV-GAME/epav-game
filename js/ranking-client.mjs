import { productServiceUrl } from './product-client.mjs?v=20261008-editions';

export async function readRanking({ config, signal, fetcher = fetch } = {}) {
  const response = await fetcher(productServiceUrl(config) + '/v1/ranking', {
    method: 'GET', redirect: 'error', signal,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(typeof result.detail === 'string' ? result.detail : 'SERVICE');
  if (!Array.isArray(result.resultados) || result.resultados.length > 20 ||
      result.resultados.some(row => !row || typeof row !== 'object')) throw new Error('SERVICE');
  return result.resultados;
}
