# Uso em celulares e tablets

As duas edições compartilham `css/responsive.css`, carregado depois dos estilos do jogo. As cores, os personagens e a identidade EPAV são mantidos.

## Comportamento

- Os clientes têm botões de contexto que abrem e fecham por toque ou teclado. O painel permanece aberto após observar e quando a disponibilidade muda.
- Até 1.100 px, a conversa usa indicadores, ficha de escuta, retratos e uma área de leitura separados. Falas e respostas longas rolam dentro da área de leitura, sem sobrepor o cronômetro.
- No celular, as respostas ficam em uma coluna. No tablet, ficam em duas. Em paisagem com altura reduzida, os retratos saem do fluxo para liberar espaço de leitura.
- Os cards de produtos têm foto e nome lado a lado no celular e ficha expansível abaixo. Tablets mostram duas colunas; a paginação da edição com IA continua disponível.
- Menus, tutorial, resultados e modais respeitam a altura disponível e as áreas seguras da tela. O conteúdo longo pode rolar verticalmente; não depende de diminuir o texto para caber.
- Os controles principais têm pelo menos 44 px para toque. Campos de formulário usam fonte de 16 px no celular para evitar o zoom automático do iOS.
- A recuperação de senha usa o Turnstile compacto, que cabe no modal inclusive após mudar a orientação. A verificação no servidor continua obrigatória. [Configuração oficial dos tamanhos](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/).

## Conferência realizada

Em navegador com viewport reduzido: 320 × 568, 390 × 844, 768 × 1.024 e 844 × 390. Foram conferidos o tutorial, a abertura do contexto por toque, o atendimento das duas edições, os cinco cards fixos, uma ficha com nome longo, a escolha com feedback, a retomada e a pausa. As medidas do documento, da área de conversa e do catálogo não apresentaram transbordamento horizontal nos casos verificados.

As fotos do catálogo autenticado não foram carregadas na partida local sem configuração Firebase; as fotos dos personagens carregaram. Os testes de lógica existentes passaram nas duas edições. Essa conferência em navegador não substitui um teste em aparelhos iOS e Android reais.
