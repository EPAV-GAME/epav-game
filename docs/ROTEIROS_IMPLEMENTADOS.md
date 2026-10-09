# Roteiros revisados — 9 de outubro de 2026

O conteúdo de `pacote_dialogos_epav_versao_ia.zip` foi integrado ao jogo e ao roteiro oficial da API.

- Cinco clientes, 40 cenas, oito respostas cadastradas por cena; quatro aparecem em A–D.
- O vendedor faz a abertura na própria caixa de fala, antes da resposta do cliente.
- O sorteio cobre faixas de qualidade e fica salvo para a retomada da partida.
- Produtos continuam em cinco categorias, com até dez opções reais com foto por categoria.
- A API recebe `roteiro: "ia-v2"` e reconstrói os IDs novos sem aceitar falas futuras.
- Diálogo e adequação dos produtos aparecem separadamente no resultado.
- Preferência por evitar carne bovina ou fritura não é tratada como alergia.

As partidas antigas ficam em sua chave original de armazenamento. A nova versão usa uma chave própria, pois as falas e a avaliação mudaram.

`PROMPT_IA_CLIENTE_FUTURO.md` documenta uma proposta futura. Atualmente, as falas são roteirizadas; a IA avalia a escolha do produto.

Veja o [banco de diálogos](dialogos_epav_versao_ia.md).
