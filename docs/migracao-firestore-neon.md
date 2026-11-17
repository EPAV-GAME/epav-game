# Migração Firestore → PostgreSQL (Neon)

Projeto Neon: `small-meadow-02162774`, organização `org-super-voice-51320341`.
Branch de produção: `br-little-thunder-za0v0lnz`.
Branch de testes: `br-lucky-star-za2fy0sm` (`epav-firestore-migration`).

## Destino dos dados

- `epav_migration`: snapshots completos, documentos e campos tipados para conferir e preservar a origem.
- `epav_data.records` e `record_fields`: registros operacionais do catálogo, importações, auditoria, arquivos recuperáveis e sincronização de fotos.
- `epav_data.ranking`: colunas próprias para resultados dos jogadores.
- `epav_data.products`: view com os campos públicos necessários ao jogo.

Não há colunas TEXT, JSON ou JSONB. Números, datas, bytes, referências, mapas, listas e valores nulos conservam seus tipos. JSON só aparece no transporte de parâmetros e nas respostas HTTP.

Firebase Authentication continua responsável por contas, tokens, recuperação de senha e permissão `admin`. As fotos permanecem no Cloudflare R2. Redis mantém o catálogo público comprimido por 900 segundos e o ranking por 30 segundos. Publicar pontuação não invalida o catálogo de produtos.

## Aplicações

A API `epav-product-evaluator` acessa o Neon com uma conta limitada ao esquema operacional. A API sem IA reutiliza esse catálogo pelo binding existente. Os jogos publicam resultados pela API. O painel usa rotas administrativas paginadas com verificação do token e da permissão em cada operação. O robô usa um segredo próprio, sem chave privada Firebase.

Edições de produto e auditoria são atômicas e exigem a revisão que o painel leu. Arquivamentos do robô guardam a cópia e removem o produto na mesma transação, verificando também a revisão do registro canônico. Fotos manuais são preservadas.

## Procedimento reproduzível

1. Testar `001`, `002` e `003` na branch de testes e conferir os tipos e a reconstrução dos campos.
2. Pausar a sincronização, impedir gravações dos clientes no Firestore e fazer a leitura final consistente.
3. Importar e conferir a cópia: `node scripts/migrate-firestore-to-neon.mjs apply --production`. O arquivo indicado por `EPAV_MIGRATION_ENV_FILE` precisa conter a branch de produção e suas conexões; a credencial de leitura Google fica fora do Git.
4. Ativar a cópia operacional: `node scripts/activate-data.mjs <arquivo-local-de-conexao> --production`. O script compara todos os campos antes de confirmar a transação e não sobrescreve uma base operacional existente.
5. Configurar o usuário limitado e os segredos pelo script `configure-runtime.mjs` deste repositório. O arquivo de saída de conexões deve ser ignorado pelo Git e nunca publicado com o site.
6. Publicar a API, os dois jogos e o painel; publicar o robô atualizado e retomar seu agendamento.
7. Exportar apenas a estrutura e os totais: `node scripts/export-schema.mjs <arquivo-local-de-conexao> --production`. Nenhum registro individual vai para o site de modelagem.

Os arquivos locais de conexão e tokens não são versionados. Não remover o Firestore antigo nem os snapshots após o corte: permanecem como backup. As regras do Firestore negam acessos dos clientes; contas de serviço antigas devem ser retiradas dos serviços que não precisam mais delas.
