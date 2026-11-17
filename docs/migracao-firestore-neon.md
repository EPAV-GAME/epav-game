# Migração Firestore → PostgreSQL (Neon)

Projeto Neon: `small-meadow-02162774`, organização `org-super-voice-51320341`.
Branch de produção: `br-little-thunder-za0v0lnz`.
Branch de testes: `br-lucky-star-za2fy0sm` (`epav-firestore-migration`).

## Destino dos dados

- `epav_migration`: snapshots completos, documentos e campos tipados para conferir e preservar a origem.
- `epav_data.produtos_swift`, `arquivo_produtos_swift`, `auditoria_catalogo`, `importacoes_catalogo`, `sincronizacao_imagens_swift` e `ranking`: tabelas próprias para cada coleção.
- Fotos, dados originais da planilha e versões históricas ficam em tabelas relacionadas por chaves estrangeiras.
- `epav_data.records` e `record_fields`: compatibilidade tipada com os valores exatos da origem. Um gatilho adiado sincroniza as tabelas de negócio na mesma transação das gravações da API.
- `epav_data.products`: view pública, agora atendida pelas tabelas de produtos, fotos e dados originais.

Não há colunas TEXT, JSON ou JSONB. Números, datas, bytes, referências, mapas, listas e valores nulos conservam seus tipos. JSON só aparece no transporte de parâmetros e nas respostas HTTP.

Firebase Authentication continua responsável por contas, tokens, recuperação de senha e permissão `admin`. As fotos permanecem no Cloudflare R2. Redis mantém o catálogo público comprimido por 900 segundos e o ranking por 30 segundos. Publicar pontuação não invalida o catálogo de produtos.

## Aplicações

A API `epav-product-evaluator` acessa o Neon com uma conta limitada ao esquema operacional. A API sem IA reutiliza esse catálogo pelo binding existente. Os jogos publicam resultados pela API. O painel usa rotas administrativas paginadas com verificação do token e da permissão em cada operação. O robô usa um segredo próprio, sem chave privada Firebase.

Edições de produto e auditoria são atômicas e exigem a revisão que o painel leu. Arquivamentos do robô guardam a cópia e removem o produto na mesma transação, verificando também a revisão do registro canônico. Fotos manuais são preservadas.

## Procedimento reproduzível

1. Testar as migrações `001` a `005` na branch de testes e conferir os tipos e a reconstrução dos campos.
2. Pausar a sincronização, impedir gravações dos clientes no Firestore e fazer a leitura final consistente.
3. Importar e conferir a cópia: `node scripts/migrate-firestore-to-neon.mjs apply --production`. O arquivo indicado por `EPAV_MIGRATION_ENV_FILE` precisa conter a branch de produção e suas conexões; a credencial de leitura Google fica fora do Git.
4. Ativar a cópia operacional: `node scripts/activate-data.mjs <arquivo-local-de-conexao> --production`. O script compara todos os campos antes de confirmar a transação e não sobrescreve uma base operacional existente.
5. Aplicar as tabelas por coleção: `node scripts/apply-collection-model.mjs <arquivo-local-de-conexao> --production`. O script confere as cinco coleções com os registros tipados e o ranking, compara o catálogo público e testa a atualização atômica com rollback.
6. Configurar o usuário limitado e os segredos pelo script `configure-runtime.mjs` deste repositório. O arquivo de saída de conexões deve ser ignorado pelo Git e nunca publicado com o site.
7. Publicar a API, os dois jogos e o painel; publicar o robô atualizado e retomar seu agendamento.
8. Exportar apenas a estrutura e os totais: `node scripts/export-schema.mjs <arquivo-local-de-conexao> --production`. Nenhum registro individual vai para o site de modelagem.

Os arquivos locais de conexão e tokens não são versionados. Não remover o Firestore antigo nem os snapshots após o corte: permanecem como backup. As regras do Firestore negam acessos dos clientes; contas de serviço antigas devem ser retiradas dos serviços que não precisam mais delas.

A tabela `sincronizacao_imagens_swift` mantém o identificador de origem mesmo se o produto foi arquivado. Sua referência opcional ao produto ativo fica nula após a remoção. A auditoria segue a mesma regra; suas versões históricas permanecem preservadas. UIDs do Firebase são identidades externas e não exigem uma tabela de senhas ou usuários no Postgres.
