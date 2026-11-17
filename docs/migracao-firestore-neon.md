# Dados EPAV no PostgreSQL

Projeto Neon `small-meadow-02162774`, organização `org-super-voice-51320341`. A aplicação usa a branch `production` (`br-little-thunder-za0v0lnz`).

## Estrutura atual

O banco de produção possui somente o esquema funcional `epav_data`, com 10 tabelas.

| Tabela | Uso no sistema |
|---|---|
| produtos_swift | Catálogo ativo, classificação, disponibilidade e revisão |
| produtos_swift_dados_originais | Dados comerciais e classificações da planilha |
| produtos_swift_imagens | Foto R2, dimensões, tamanho, hashes e origem |
| produtos_swift_versoes | Estados históricos de produtos editados ou arquivados |
| versoes_produtos_dados_originais | Dados da planilha em cada versão histórica |
| versoes_produtos_imagens | Foto correspondente a cada versão histórica |
| arquivo_produtos_swift | Motivo de remoção e referência à versão recuperável |
| auditoria_catalogo | Administrador, data e versões antes/depois de uma edição |
| sincronizacao_imagens_swift | Última verificação, ETag, hash e URL consultada pelo robô |
| ranking | Resultados publicados pelos jogadores |

A view `products` entrega apenas os campos públicos do catálogo. Não há colunas TEXT, JSON ou JSONB. As respostas e parâmetros HTTP usam JSON transitório. Revisões, datas e dados da aplicação ficam nas próprias tabelas relacionais.

A API de dados versão 3 lê e grava diretamente essas tabelas. Edição e auditoria são atômicas. Arquivamentos verificam as revisões do produto e do registro canônico. Restauração recusa substituir um produto existente. Fotos administrativas continuam protegidas contra alterações do robô.

## Firebase e armazenamento de fotos

Os 5.646 documentos antigos do Firestore foram excluídos em 17/11/2026 a pedido do responsável. A consulta de coleções confirmou o banco vazio. As regras recusam leitura e gravação pelos clientes. O Firebase Authentication atende contas, tokens, permissões administrativas e recuperação de senha.

As fotos ficam no Cloudflare R2. Redis mantém catálogo e ranking em cache. As credenciais ficam nos segredos dos serviços e fora dos arquivos publicados pelo site.

## Migrações e conferência

As migrações `001` a `007` documentam as etapas históricas de cópia e compatibilidade. Seus objetos temporários foram removidos da produção. As migrações `008` e `009` encerram o suporte genérico e implementam o acesso relacional direto. Os esquemas `epav_internal` e `epav_migration` não existem na produção.

O script `direct-storage.mjs` aplica `prepare` em uma branch isolada, compara os 5.646 documentos com a reconstrução pelas tabelas relacionais e testa gravação, revisão desatualizada, auditoria, arquivamento e restauração com rollback. Códigos numéricos e datas são normalizados na comparação. Os testes foram repetidos em produção.

Após `prepare`, publicar a API com `versao_dados=3` e verificar seus endpoints. Depois executar `finalize` para excluir suporte, gatilhos e rotinas antigas. Não executar novamente os importadores históricos na produção concluída.

O exportador `export-schema.mjs` verifica todas as tabelas do banco e recusa publicar se encontrar estruturas fora do modelo funcional. O site recebe apenas colunas, chaves, índices e contagens. A branch de testes e a branch de backup `epav-before-schema-cleanup-20261117` são cópias isoladas e não são usadas pela aplicação.

## Remoção dos metadados da importação

A migração `010` exclui `importacoes_catalogo`, `importacao_id` e `linha_origem` dos produtos ativos e das versões históricas. A API deixa de disponibilizar a coleção de importações e o painel deixa de mostrar essa aba e as referências à linha da planilha. Auditoria de edições e arquivamento recuperável continuam em uso nas operações atuais.

O script `remove-import-history.mjs` compara os documentos funcionais antes e depois da mudança, descontando apenas os campos explicitamente removidos. Confere o catálogo público e testa escrita, conflitos, auditoria, arquivamento e restauração na mesma transação, revertendo os dados de teste. O inventário recusa tabelas e campos de importação fora do modelo atual.
