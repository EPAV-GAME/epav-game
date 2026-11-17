// Read-only Firestore scan. Keep Firestore's type wrappers and 64-bit integers.
const API = 'https://firestore.googleapis.com/v1';

export function firestoreReader({ project, database = '(default)', request, readTime }) {
  if (!/^[a-z][a-z0-9-]+$/.test(project) || !/^(?:\(default\)|[a-zA-Z0-9-]+)$/.test(database)) {
    throw new Error('Projeto ou nome do banco Firestore inválido.');
  }
  const source = `projects/${project}/databases/${database}`;
  const documentRoot = `${source}/documents`;
  const encodePath = path => path.split('/').map(encodeURIComponent).join('/');

  async function* pages(url, options, field) {
    let pageToken;
    const seen = new Set();
    do {
      const data = await request(url, pageToken ? { ...options, pageToken } : options);
      const list = data[field] ?? [];
      if (!Array.isArray(list)) throw new Error('Página Firestore inválida.');
      yield* list;
      pageToken = data.nextPageToken;
      if (pageToken && seen.has(pageToken)) throw new Error('Paginação Firestore repetida.');
      if (pageToken) seen.add(pageToken);
    } while (pageToken);
  }

  function collections(parent = '') {
    const path = parent ? `/${encodePath(parent)}` : '';
    return pages(`${API}/${documentRoot}${path}:listCollectionIds`,
      { method: 'POST', pageSize: 100, readTime }, 'collectionIds');
  }

  async function* documents(collection, descendants = true) {
    const children = [];
    for await (const doc of pages(`${API}/${documentRoot}/${encodePath(collection)}`,
      { method: 'GET', pageSize: 250, showMissing: true, readTime }, 'documents')) {
      const prefix = `${documentRoot}/${collection}/`;
      const id = doc.name?.startsWith(prefix) ? doc.name.slice(prefix.length) : '';
      if (!id || id.includes('/')) throw new Error('Caminho inesperado na resposta do Firestore.');
      if (doc.createTime && doc.updateTime) {
        yield {
          path: `${collection}/${id}`, collection_path: collection, document_id: id,
          created_at: doc.createTime, updated_at: doc.updateTime, firestore_fields: doc.fields ?? {},
        };
      } else if (doc.fields || doc.createTime || doc.updateTime) {
        throw new Error('Documento retornado sem metadados completos.');
      }
      if (descendants) children.push(`${collection}/${id}`);
    }
    // Bound concurrent requests when locating subcollections, including under missing parents.
    for (let index = 0; index < children.length; index += 12) {
      const found = await Promise.all(children.slice(index, index + 12).map(async parent => {
        const paths = [];
        for await (const name of collections(parent)) paths.push(`${parent}/${name}`);
        return paths;
      }));
      for (const child of found.flat()) yield* documents(child, true);
    }
  }

  return { source, collections, documents };
}

export async function scanFirestore(reader, visit, { descendants = true } = {}) {
  const counts = new Map();
  for await (const name of reader.collections()) {
    counts.set(name, 0);
    for await (const row of reader.documents(name, descendants)) {
      await visit(row);
      counts.set(row.collection_path, (counts.get(row.collection_path) ?? 0) + 1);
    }
  }
  return counts;
}
