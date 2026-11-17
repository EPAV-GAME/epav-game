// Explicit column mapping shared by the relational migrations.
export const original =[
  ['codigo_produto','varchar(128)','Cod Produto'],['descricao_produto','varchar(240)','Descricao Produto'],
  ['unidade_medida','varchar(40)','Unidade Medida'],['volume_kg','double precision','Volume (KG)','number'],
  ['volume_un','double precision','Volume (UN)','number'],
  ['preco_medio_sem_desconto','double precision','Preço Médio S/ Desconto','number'],
  ['preco_sem_desconto_observacao','varchar(80)','Preço Médio S/ Desconto','string'],
  ['preco_medio_com_desconto','double precision','Preço Médio C/ Desconto','number'],
  ['preco_com_desconto_observacao','varchar(80)','Preço Médio C/ Desconto','string'],
  ['margem_contribuicao','double precision','Margem de Contribuição','number'],
  ['margem_observacao','varchar(80)','Margem de Contribuição','string'],
  ['status_produto','varchar(80)','Status Produto'],['familia','varchar(120)','Familia'],['marca','varchar(120)','Marca'],
  ['familia_analitica_1','varchar(120)','Familia Analitica 1'],['familia_analitica_2','varchar(120)','Familia Analitica 2'],
  ['nome_fornecedor','varchar(240)','Nome Fornecedor'],['ocasiao','varchar(240)','Ocasiao'],['formato','varchar(80)','Formato'],
  ['produtor','varchar(240)','PRODUTOR'],['categoria','varchar(120)','CATEGORIA'],['valor_agregado','varchar(3)','VALOR AGREGADO'],
  ['tipo_produto_original','varchar(150)','Tipo Produto'],['disponivel_original','varchar(3)','Disponível no jogo'],
  ['ocasioes_original','varchar(200)','Ocasiões'],
  ...[['carnes','Carnes'],['aves','Aves'],['pescados','Pescados'],['acompanhamentos','Acompanhamentos'],
    ['sobremesas','Sobremesas'],['despensa','Despensa'],['praticidade','Praticidade'],['dia_a_dia','Dia a dia'],
    ['churrasco','Churrasco'],['lanches','Lanches'],['receitas','Receitas'],['familia_ocasiao','Família'],
    ['ocasioes_especiais','Ocasiões especiais'],['leve','Leve']].map(([c,k])=>[c,'varchar(3)',k]),
];
export const image =[
  ['bucket','varchar(120)','bucket'],['object_key','varchar(1024)','key'],['url','varchar(4096)','url'],
  ['formato','varchar(20)','format'],['largura','integer','width','number'],['altura','integer','height','number'],
  ['bytes','bigint','bytes','number'],['sha256','varchar(64)','sha256'],['pixel_hash','varchar(64)','pixelHash'],
  ['nome_origem','varchar(240)','sourceName'],['pagina_origem','varchar(4096)','sourcePage'],
  ['sku_origem','varchar(128)','sourceSku'],['url_origem','varchar(4096)','sourceUrl'],
  ['metodo_correspondencia','varchar(80)','matchMethod'],['versao_correspondencia','varchar(80)','matchVersion'],
  ['versao_transformacao','varchar(80)','transformVersion'],['manual','boolean','manual'],['origem','varchar(80)','source'],
  ['atualizado_em','timestamptz','updatedAt'],
];
export const product =[
  ['codigo','varchar(128)','codigo'],['nome','varchar(240)','nome'],['disponivel_no_jogo','boolean','disponivelNoJogo'],
  ['importacao_id','varchar(1500)','importacaoId'],['linha_origem','integer','linhaOrigem','number'],
  ['tipos_produto','varchar(240)[]','tiposProduto','strings'],['ocasioes','varchar(240)[]','ocasioes','strings'],
  ['atualizado_em','timestamptz','atualizadoEm'],['atualizado_por','varchar(128)','atualizadoPor'],
  ['ultima_alteracao_id','varchar(128)','ultimaAlteracaoId'],
];
