import assert from 'node:assert/strict';
import test from 'node:test';
import { firestoreReader, scanFirestore } from '../scripts/firestore-snapshot.mjs';

test('follows pages and subcollections under missing parents, keeping paths and Firestore types', async () => {
  const root = 'projects/epav-game/databases/(default)/documents';
  const readTime = '2026-11-17T12:00:00.123456Z';
  const makeDocument = (path, fields) => ({
    name: `${root}/${path}`, createTime: readTime, updateTime: readTime, fields,
  });
  const fields = {
    int: { integerValue: '9223372036854775807' },
    moment: { timestampValue: readTime },
    ref: { referenceValue: `${root}/produtos_swift/p1` },
  };
  const calls = [];
  const reader = firestoreReader({ project: 'epav-game', readTime, request: async (url, opts) => {
    const path = url.split(root)[1];
    assert.equal(opts.readTime, readTime);
    calls.push([path, opts.pageToken]);
    if (path === ':listCollectionIds') {
      return opts.pageToken ? { collectionIds: ['produtos_swift'] } :
        { collectionIds: ['ranking'], nextPageToken: 'two' };
    }
    if (path === '/ranking') {
      assert.equal(opts.showMissing, true);
      return opts.pageToken ? { documents: [makeDocument('ranking/u2', {})] } :
        { documents: [{ name: `${root}/ranking/u1` }], nextPageToken: 'next-ranking' };
    }
    if (path === '/ranking/u1:listCollectionIds') return { collectionIds: ['historico'] };
    if (path === '/ranking/u1/historico') return { documents: [makeDocument('ranking/u1/historico/h1', fields)] };
    if (path === '/produtos_swift') return { documents: [makeDocument('produtos_swift/p1', {})] };
    assert.match(path, /:listCollectionIds$/);
    return {};
  } });
  const documents = [];
  const counts = await scanFirestore(reader, doc => documents.push(doc));
  assert.deepEqual(Object.fromEntries(counts), { ranking: 1, 'ranking/u1/historico': 1, produtos_swift: 1 });
  assert.deepEqual(documents.map(doc => doc.path), ['ranking/u2', 'ranking/u1/historico/h1', 'produtos_swift/p1']);
  assert.deepEqual(documents[1].firestore_fields, fields);
  assert.ok(calls.some(([path, token]) => path === '/ranking' && token === 'next-ranking'));
});

test('a malformed document or repeated page token aborts the scan instead of reporting a complete copy', async () => {
  for (const request of [
    async (url) => url.endsWith(':listCollectionIds') ? { collectionIds: ['ranking'] } :
      { documents: [{ name: 'projects/other/databases/(default)/documents/ranking/u1' }] },
    async () => ({ collectionIds: [], nextPageToken: 'same' }),
  ]) {
    const reader = firestoreReader({ project: 'epav-game', request, readTime: '2026-11-17T12:00:00Z' });
    await assert.rejects(scanFirestore(reader, () => {}), /Caminho inesperado|Paginação Firestore repetida/);
  }
});
