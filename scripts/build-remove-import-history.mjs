import {readFile, writeFile} from 'node:fs/promises';

const previous = await readFile(new URL('../migrations/008-direct-relational-storage.sql', import.meta.url), 'utf8');
const functions = ['product_document', 'document_data', 'list_documents', 'write_product_version', 'save_document'];
const definitions = [];

for (const name of functions) {
  const start = previous.indexOf(`CREATE FUNCTION epav_data.${name}(`);
  const end = previous.indexOf('END $$;', start);
  const sqlEnd = name === 'product_document' ? previous.indexOf('$$;', start) + 3 : end + 7;
  if (start < 0 || sqlEnd < start) throw new Error('Missing function definition: ' + name);
  let definition = previous.slice(start, sqlEnd).replace('CREATE FUNCTION ', 'CREATE OR REPLACE FUNCTION ');

  // Remove the old source fields from reads and explicit insert/update column lists.
  for (const [column, key, type] of [
    ['importacao_id', 'importacaoId', 'varchar(1500)'],
    ['linha_origem', 'linhaOrigem', 'integer'],
  ]) {
    for (const alias of ['p', 'v']) {
      definition = definition.replaceAll(`,'${key}',${alias}.${column}`, '');
      definition = definition.replaceAll(`,${alias}.${column}`, '');
    }
    definition = definition.replaceAll(`,${column}=excluded.${column}`, '');
    definition = definition.replaceAll(`,${column}`, '');
    definition = definition.replaceAll(`,(data->>'${key}')::${type}`, '');
    definition = definition.replaceAll(`,CASE WHEN jsonb_typeof(data->'${key}')='number' THEN (data->>'${key}')::${type} END`, '');
  }

  if (name === 'document_data') {
    const importStart = definition.indexOf("  ELSIF c='importacoes_catalogo' THEN");
    const importEnd = definition.indexOf("  ELSIF c='sincronizacao_imagens_swift' THEN", importStart);
    if (importStart < 0 || importEnd < 0) throw new Error('Missing legacy import read branch');
    definition = definition.slice(0, importStart) + definition.slice(importEnd);
  }
  definition = definition.replaceAll("'importacoes_catalogo',", '');
  if (/importacoes_catalogo|importacao_id|linha_origem|importacaoId|linhaOrigem/.test(definition)) {
    throw new Error('Legacy import dependency remains in ' + name);
  }
  definitions.push(definition);
}

const sql = `-- Retire metadata used only by the old catalog import.
-- Application audit and recoverable archives continue to serve current operations.
${definitions.join('\n\n')}

ALTER TABLE epav_data.produtos_swift DROP COLUMN importacao_id, DROP COLUMN linha_origem;
ALTER TABLE epav_data.produtos_swift_versoes DROP COLUMN importacao_id, DROP COLUMN linha_origem;
DROP TABLE epav_data.importacoes_catalogo;
`;
await writeFile(new URL('../migrations/010-remove-import-history.sql', import.meta.url), sql);
console.log('Generated migration 010 to remove import history and source-row references.');
