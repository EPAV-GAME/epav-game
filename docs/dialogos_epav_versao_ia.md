# Diálogos do EPAV — versão com avaliação por IA

**Base:** site Fechando Negócio – Missão EPAV, repositório EPAV-GAME/epav-game (8 de outubro de 2026).

Este roteiro é uma proposta nova de conteúdo, não uma transcrição do site. Preserva 5 clientes, 40 etapas e os cinco pop-ups nas últimas etapas de cada cliente.

**Funcionamento:** 8 alternativas possíveis por etapa; o aluno vê apenas 4 respostas A–D embaralhadas. O pop-up de produtos não usa A–D: mostra opções do catálogo e a avaliação é feita separadamente pela IA.

**Restrições definidas para a simulação:** Marina não consome carne bovina por preferência. Camila evita frituras por preferência. Não confundir essas preferências com alergias; consultar os rótulos e as condições de preparo.

**Nota de integração:** os novos IDs de alternativas precisam ser reconhecidos pelo serviço de avaliação, que reconstrói o histórico oficial. Não substitua o arquivo do site sem sincronizar a API.

---
## Lucas — 6 etapas

**Perfil:** Churrasco para seis pessoas; valoriza praticidade e evitar sobras.
**Restrições:** Nenhuma restrição alimentar informada.

### d1 — Abordagem respeitosa e descoberta gradual

**VENDEDOR inicia:** Oi, Lucas, tudo bem? Vi que está terminando uma tarefa. Posso falar rapidinho quando você acabar?

**LUCAS:** Pode. Estou planejando um churrasco para umas seis pessoas no sábado, mas ainda não organizei tudo.

**Ficha de escuta:** Churrasco para seis pessoas

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d1-o1 · +10 pontos:** Legal! Você já definiu o que pretende servir?
  - **Cliente:** Não defini tudo ainda. Por enquanto sei só o número de convidados.
  - **Feedback:** A pergunta abre espaço para conhecer a ocasião antes de sugerir itens.
- **d1-o2 · +8 pontos:** É um churrasco mais simples ou uma ocasião especial?
  - **Cliente:** Não defini tudo ainda. Por enquanto sei só o número de convidados.
  - **Feedback:** A pergunta abre espaço para conhecer a ocasião antes de sugerir itens.
- **d1-o3 · +6 pontos:** Quer que eu te ajude a planejar sem exagerar na quantidade?
  - **Cliente:** É algo simples com a família. Eu queria resolver sem perder a tarde.
  - **Feedback:** A conversa anda, mas ainda faltam informações sobre quantidade e preferências.
- **d1-o4 · +4 pontos:** Se eu fizer duas perguntas rápidas, consigo entender melhor o que falta.
  - **Cliente:** É algo simples com a família. Eu queria resolver sem perder a tarde.
  - **Feedback:** A conversa anda, mas ainda faltam informações sobre quantidade e preferências.
- **d1-o5 · +0 pontos:** Tenho algumas opções interessantes para churrasco.
  - **Cliente:** É algo simples com a família. Eu queria resolver sem perder a tarde.
  - **Feedback:** A conversa anda, mas ainda faltam informações sobre quantidade e preferências.
- **d1-o6 · -2 pontos:** Se quiser, posso te mostrar o catálogo e você me diz o que gosta.
  - **Cliente:** Espera. Eu só falei do churrasco; não quero decidir nada correndo.
  - **Feedback:** Tentar vender antes de escutar pode afastar o cliente.
- **d1-o7 · -6 pontos:** Posso montar uma cesta completa agora, antes de saber o que já comprou?
  - **Cliente:** Espera. Eu só falei do churrasco; não quero decidir nada correndo.
  - **Feedback:** Tentar vender antes de escutar pode afastar o cliente.
- **d1-o8 · -10 pontos:** Vou te passar os produtos mais caros; para churrasco vale a pena.
  - **Cliente:** Espera. Eu só falei do churrasco; não quero decidir nada correndo.
  - **Feedback:** Tentar vender antes de escutar pode afastar o cliente.

### d2 — Conhecer preparo e ocasião

**LUCAS:** Eu não tenho muito tempo para preparar tudo. Queria adiantar o que desse, sem ficar na cozinha o dia inteiro.

**Ficha de escuta:** Pouco tempo para preparar

**Pop-up:** Pop-up de entrada: sugerir algo fácil de servir, sem inventar necessidades

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d2-o1 · +10 pontos:** O que costuma dar mais trabalho para você no churrasco?
  - **Cliente:** O que me toma tempo é preparar os acompanhamentos.
  - **Feedback:** Você investigou que tipo de praticidade o cliente realmente procura.
- **d2-o2 · +8 pontos:** Você prefere itens que já venham prontos para ir à churrasqueira?
  - **Cliente:** O que me toma tempo é preparar os acompanhamentos.
  - **Feedback:** Você investigou que tipo de praticidade o cliente realmente procura.
- **d2-o3 · +6 pontos:** Além da carne, o que você normalmente coloca na mesa?
  - **Cliente:** Se vier pronto ou quase pronto, ajuda bastante.
  - **Feedback:** Você percebeu a questão do tempo, porém não detalhou a situação.
- **d2-o4 · +4 pontos:** Então vamos pensar em opções práticas sem aumentar o trabalho.
  - **Cliente:** Se vier pronto ou quase pronto, ajuda bastante.
  - **Feedback:** Você percebeu a questão do tempo, porém não detalhou a situação.
- **d2-o5 · +0 pontos:** Talvez um acompanhamento já pronto possa ajudar.
  - **Cliente:** Se vier pronto ou quase pronto, ajuda bastante.
  - **Feedback:** Você percebeu a questão do tempo, porém não detalhou a situação.
- **d2-o6 · -2 pontos:** Posso começar pelos itens mais fáceis de preparar.
  - **Cliente:** Praticidade importa, mas não quero comprar algo só por comprar.
  - **Feedback:** A sugestão ignora o esforço de preparo citado pelo cliente.
- **d2-o7 · -6 pontos:** Vou colocar bastante variedade, mesmo que leve mais tempo.
  - **Cliente:** Praticidade importa, mas não quero comprar algo só por comprar.
  - **Feedback:** A sugestão ignora o esforço de preparo citado pelo cliente.
- **d2-o8 · -10 pontos:** Se está sem tempo, qualquer produto serve.
  - **Cliente:** Praticidade importa, mas não quero comprar algo só por comprar.
  - **Feedback:** A sugestão ignora o esforço de preparo citado pelo cliente.

### d3 — Quantidade, prevenção de desperdício

**LUCAS:** Outro problema: na última vez comprei demais e sobrou muita coisa. Quero evitar isso com seis pessoas.

**Ficha de escuta:** Evitar sobras

**Pop-up:** Pop-up de prato principal: escolher corte com porção adequada

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d3-o1 · +10 pontos:** Você lembra mais ou menos o que sobrou da última vez?
  - **Cliente:** Sobrou mais carne do que acompanhamento.
  - **Feedback:** Investigar as sobras permite dimensionar melhor o pedido.
- **d3-o2 · +8 pontos:** A gente pode calcular porções para seis, sem exagerar.
  - **Cliente:** Sobrou mais carne do que acompanhamento.
  - **Feedback:** Investigar as sobras permite dimensionar melhor o pedido.
- **d3-o3 · +6 pontos:** Vai ter criança ou são seis adultos?
  - **Cliente:** São quase todos adultos. Faz sentido planejar as quantidades.
  - **Feedback:** Você identificou o risco, mas ainda precisa conferir consumo e porções.
- **d3-o4 · +4 pontos:** Você já comprou algum corte ou acompanhamento?
  - **Cliente:** São quase todos adultos. Faz sentido planejar as quantidades.
  - **Feedback:** Você identificou o risco, mas ainda precisa conferir consumo e porções.
- **d3-o5 · +0 pontos:** Vamos ajustar a quantidade antes de pensar nas marcas.
  - **Cliente:** São quase todos adultos. Faz sentido planejar as quantidades.
  - **Feedback:** Você identificou o risco, mas ainda precisa conferir consumo e porções.
- **d3-o6 · -2 pontos:** Podemos considerar embalagens que sejam fáceis de guardar.
  - **Cliente:** Isso, não quero repetir a compra exagerada.
  - **Feedback:** Ignorar a quantidade contraria a necessidade principal.
- **d3-o7 · -6 pontos:** Melhor aumentar bastante a carne; sobra é normal.
  - **Cliente:** Isso, não quero repetir a compra exagerada.
  - **Feedback:** Ignorar a quantidade contraria a necessidade principal.
- **d3-o8 · -10 pontos:** Se sobrou antes, desta vez você deveria comprar bem menos, sem calcular.
  - **Cliente:** Isso, não quero repetir a compra exagerada.
  - **Feedback:** Ignorar a quantidade contraria a necessidade principal.

### d4 — Tratamento de objeção: orçamento

**LUCAS:** Gostei da ideia, mas estamos no fim do mês. Se a cesta ficar cara demais, não vai dar.

**Ficha de escuta:** Está controlando os gastos

**Pop-up:** Pop-up de acompanhamento: complementar o principal sem pesar na cesta

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d4-o1 · +10 pontos:** Qual parte da cesta você considera indispensável?
  - **Cliente:** Quero gastar só no que vai ser usado.
  - **Feedback:** Você tratou o orçamento como critério real de compra.
- **d4-o2 · +8 pontos:** Podemos comparar preço por porção antes de decidir?
  - **Cliente:** Quero gastar só no que vai ser usado.
  - **Feedback:** Você tratou o orçamento como critério real de compra.
- **d4-o3 · +6 pontos:** Você tem uma faixa de gasto em mente para o churrasco?
  - **Cliente:** Tenho um limite aproximado. Prefiro ajustar do que desistir.
  - **Feedback:** A alternativa ajuda, mas ainda precisa confirmar prioridades.
- **d4-o4 · +4 pontos:** Posso ajustar acompanhamentos e quantidades, mantendo o principal.
  - **Cliente:** Tenho um limite aproximado. Prefiro ajustar do que desistir.
  - **Feedback:** A alternativa ajuda, mas ainda precisa confirmar prioridades.
- **d4-o5 · +0 pontos:** Vamos priorizar o que realmente será consumido.
  - **Cliente:** Tenho um limite aproximado. Prefiro ajustar do que desistir.
  - **Feedback:** A alternativa ajuda, mas ainda precisa confirmar prioridades.
- **d4-o6 · -2 pontos:** Posso mostrar uma alternativa mais econômica, se precisar.
  - **Cliente:** É justamente isso que me preocupa: não quero exageros.
  - **Feedback:** Insistir em gastar mais desconsidera o momento financeiro.
- **d4-o7 · -6 pontos:** Vale aumentar o pedido agora e compensar no mês que vem.
  - **Cliente:** É justamente isso que me preocupa: não quero exageros.
  - **Feedback:** Insistir em gastar mais desconsidera o momento financeiro.
- **d4-o8 · -10 pontos:** Não tem como ter um churrasco bom economizando.
  - **Cliente:** É justamente isso que me preocupa: não quero exageros.
  - **Feedback:** Insistir em gastar mais desconsidera o momento financeiro.

### d5 — Objeção: preferência pela loja física

**LUCAS:** Eu costumo comprar na loja física porque gosto de olhar os produtos. Pela internet fico com um pé atrás.

**Ficha de escuta:** Prefere ver produtos na loja

**Pop-up:** Pop-up de bebida: lembrar quantas pessoas irão participar

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d5-o1 · +10 pontos:** O que você gosta de conferir pessoalmente na loja?
  - **Cliente:** Gosto de ver tamanho e embalagem.
  - **Feedback:** Você investigou a preferência de canal sem desrespeitá-la.
- **d5-o2 · +8 pontos:** Entendi. Posso explicar como você consulta a ficha e decide com calma.
  - **Cliente:** Gosto de ver tamanho e embalagem.
  - **Feedback:** Você investigou a preferência de canal sem desrespeitá-la.
- **d5-o3 · +6 pontos:** Você já experimentou comprar produtos congelados por encomenda?
  - **Cliente:** Se eu conseguir comparar as informações, já ajuda.
  - **Feedback:** Você apresentou uma alternativa, mas precisa esclarecer a insegurança.
- **d5-o4 · +4 pontos:** Se preferir a loja, posso te ajudar a organizar uma lista útil.
  - **Cliente:** Se eu conseguir comparar as informações, já ajuda.
  - **Feedback:** Você apresentou uma alternativa, mas precisa esclarecer a insegurança.
- **d5-o5 · +0 pontos:** Podemos conferir os detalhes antes de decidir o canal de compra.
  - **Cliente:** Se eu conseguir comparar as informações, já ajuda.
  - **Feedback:** Você apresentou uma alternativa, mas precisa esclarecer a insegurança.
- **d5-o6 · -2 pontos:** Sua preocupação é mais com a qualidade ou com a escolha do corte?
  - **Cliente:** Não quero ser convencido à força a mudar como compro.
  - **Feedback:** Desqualificar o hábito de compra prejudica a confiança.
- **d5-o7 · -6 pontos:** No aplicativo é melhor, então não vale a pena ir à loja.
  - **Cliente:** Não quero ser convencido à força a mudar como compro.
  - **Feedback:** Desqualificar o hábito de compra prejudica a confiança.
- **d5-o8 · -10 pontos:** Isso é desconfiança sem motivo; o produto é igual.
  - **Cliente:** Não quero ser convencido à força a mudar como compro.
  - **Feedback:** Desqualificar o hábito de compra prejudica a confiança.

### d6 — Fechamento respeitoso e oportunidade futura

**LUCAS:** Agora faz mais sentido. Não vou prometer comprar tudo hoje, mas quero sair daqui com uma ideia organizada.

**Pop-up:** Pop-up de sobremesa: complemento opcional, sem forçar gasto

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d6-o1 · +10 pontos:** Claro. Posso resumir os itens e as quantidades para você decidir depois?
  - **Cliente:** Boa, assim consigo avaliar sem pressa.
  - **Feedback:** Você encaminhou um próximo passo sem transformar interesse em obrigação.
- **d6-o2 · +8 pontos:** Vou deixar a sugestão organizada, sem obrigação de compra.
  - **Cliente:** Boa, assim consigo avaliar sem pressa.
  - **Feedback:** Você encaminhou um próximo passo sem transformar interesse em obrigação.
- **d6-o3 · +6 pontos:** O que falta confirmar antes de fechar o pedido?
  - **Cliente:** Ótimo. Vou olhar com calma e decidir o que falta comprar.
  - **Feedback:** O atendimento termina de forma cordial, embora ainda falte um resumo.
- **d6-o4 · +4 pontos:** Se preferir, a gente encerra com uma lista para o sábado.
  - **Cliente:** Ótimo. Vou olhar com calma e decidir o que falta comprar.
  - **Feedback:** O atendimento termina de forma cordial, embora ainda falte um resumo.
- **d6-o5 · +0 pontos:** Posso destacar quais itens são prioridade para seis pessoas.
  - **Cliente:** Ótimo. Vou olhar com calma e decidir o que falta comprar.
  - **Feedback:** O atendimento termina de forma cordial, embora ainda falte um resumo.
- **d6-o6 · -2 pontos:** Vamos deixar uma opção simples para você rever mais perto do dia.
  - **Cliente:** Quando eu decidir, entro em contato. Obrigado pela atenção.
  - **Feedback:** Pressionar a compra no final pode desfazer a confiança construída.
- **d6-o7 · -6 pontos:** Se gostou, é melhor fechar tudo agora para não esquecer.
  - **Cliente:** Quando eu decidir, entro em contato. Obrigado pela atenção.
  - **Feedback:** Pressionar a compra no final pode desfazer a confiança construída.
- **d6-o8 · -10 pontos:** Depois de tanto tempo conversando, pelo menos um pedido você precisa fazer.
  - **Cliente:** Quando eu decidir, entro em contato. Obrigado pela atenção.
  - **Feedback:** Pressionar a compra no final pode desfazer a confiança construída.

---
## Marina — 7 etapas

**Perfil:** Mora sozinha, procura refeições práticas e evita carne bovina por escolha pessoal.
**Restrições:** Não consome carne bovina por escolha pessoal; não pressupor alergia.

### d1 — Ouvir restrição alimentar sem presumir alergia

**VENDEDOR inicia:** Oi, Marina, tudo bem? Vi que estava ao telefone. Agora é um bom momento para conversar?

**MARINA:** Agora sim. Estou pensando em algo para jantar. Só uma coisa: eu não como carne bovina, por preferência mesmo.

**Ficha de escuta:** Não consome carne bovina

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d1-o1 · +10 pontos:** Entendi. O que você costuma jantar nos dias de semana?
  - **Cliente:** Normalmente é algo simples, porque chego tarde.
  - **Feedback:** Você considerou a preferência antes de recomendar produtos.
- **d1-o2 · +8 pontos:** Você gosta mais de frango, peixe ou opções sem carne?
  - **Cliente:** Normalmente é algo simples, porque chego tarde.
  - **Feedback:** Você considerou a preferência antes de recomendar produtos.
- **d1-o3 · +6 pontos:** Você procura algo para hoje ou para deixar para outros dias?
  - **Cliente:** Frango costuma funcionar para mim. Só não quero carne bovina.
  - **Feedback:** A sugestão é possível, mas falta entender a rotina da cliente.
- **d1-o4 · +4 pontos:** Obrigada por avisar. Posso fazer umas perguntas rápidas?
  - **Cliente:** Frango costuma funcionar para mim. Só não quero carne bovina.
  - **Feedback:** A sugestão é possível, mas falta entender a rotina da cliente.
- **d1-o5 · +0 pontos:** Posso te mostrar algumas opções sem carne bovina.
  - **Cliente:** Frango costuma funcionar para mim. Só não quero carne bovina.
  - **Feedback:** A sugestão é possível, mas falta entender a rotina da cliente.
- **d1-o6 · -2 pontos:** Quer conhecer o que temos de mais prático?
  - **Cliente:** Essa preferência é importante; preciso que você leve em conta.
  - **Feedback:** Desrespeitar uma restrição declarada é um erro grave.
- **d1-o7 · -6 pontos:** Tem gente que não gosta de carne bovina, mas vale tentar um corte especial.
  - **Cliente:** Essa preferência é importante; preciso que você leve em conta.
  - **Feedback:** Desrespeitar uma restrição declarada é um erro grave.
- **d1-o8 · -10 pontos:** Acho que você nem vai perceber se tiver um pouco de carne bovina.
  - **Cliente:** Essa preferência é importante; preciso que você leve em conta.
  - **Feedback:** Desrespeitar uma restrição declarada é um erro grave.

### d2 — Descobrir tempo de preparo, equipamentos e porções

**MARINA:** Eu moro sozinha e chego cansada. Se precisar cozinhar por muito tempo, acabo desistindo.

**Ficha de escuta:** Janta sozinha e chega cansada

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d2-o1 · +10 pontos:** Quantos minutos você costuma ter para preparar o jantar?
  - **Cliente:** Tenho uns quinze ou vinte minutos, no máximo.
  - **Feedback:** A pergunta detalha a rotina para orientar o preparo.
- **d2-o2 · +8 pontos:** Você tem forno, fogão ou air fryer para usar em casa?
  - **Cliente:** Tenho uns quinze ou vinte minutos, no máximo.
  - **Feedback:** A pergunta detalha a rotina para orientar o preparo.
- **d2-o3 · +6 pontos:** Prefere deixar porções prontas ou preparar tudo na hora?
  - **Cliente:** Uso air fryer às vezes, mas gosto de opções simples.
  - **Feedback:** Você percebeu a praticidade, mas ainda pode investigar equipamentos e porções.
- **d2-o4 · +4 pontos:** Você se importa se sobrar comida para outro dia?
  - **Cliente:** Uso air fryer às vezes, mas gosto de opções simples.
  - **Feedback:** Você percebeu a praticidade, mas ainda pode investigar equipamentos e porções.
- **d2-o5 · +0 pontos:** Vamos pensar em algo rápido para uma pessoa.
  - **Cliente:** Uso air fryer às vezes, mas gosto de opções simples.
  - **Feedback:** Você percebeu a praticidade, mas ainda pode investigar equipamentos e porções.
- **d2-o6 · -2 pontos:** Uma refeição fácil parece fazer mais sentido.
  - **Cliente:** Quero algo que eu realmente consiga preparar depois do trabalho.
  - **Feedback:** A proposta generaliza a rotina e pode gerar desperdício.
- **d2-o7 · -6 pontos:** Se mora sozinha, compre uma embalagem grande e use a semana toda.
  - **Cliente:** Quero algo que eu realmente consiga preparar depois do trabalho.
  - **Feedback:** A proposta generaliza a rotina e pode gerar desperdício.
- **d2-o8 · -10 pontos:** Se está cansada, então é melhor nunca cozinhar.
  - **Cliente:** Quero algo que eu realmente consiga preparar depois do trabalho.
  - **Feedback:** A proposta generaliza a rotina e pode gerar desperdício.

### d3 — Objeção: já comprou

**MARINA:** Eu já fiz compra no fim de semana, então não preciso de muita coisa. Talvez só algo para variar.

**Ficha de escuta:** Já comprou alguns alimentos no fim de semana

**Pop-up:** Pop-up de entrada: opcional, porção pequena e sem carne bovina

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d3-o1 · +10 pontos:** O que você já tem em casa para não repetir?
  - **Cliente:** Tenho arroz, legumes e algumas coisas congeladas.
  - **Feedback:** Você evitou repetir itens e procurou uma necessidade real.
- **d3-o2 · +8 pontos:** Que tipo de refeição você sente falta durante a semana?
  - **Cliente:** Tenho arroz, legumes e algumas coisas congeladas.
  - **Feedback:** Você evitou repetir itens e procurou uma necessidade real.
- **d3-o3 · +6 pontos:** Você costuma variar entradas ou prefere ir direto ao prato?
  - **Cliente:** Às vezes quero só uma entrada diferente para variar.
  - **Feedback:** A abordagem preserva o relacionamento, mesmo que a compra seja pequena.
- **d3-o4 · +4 pontos:** Podemos pensar em um complemento pequeno, sem obrigação.
  - **Cliente:** Às vezes quero só uma entrada diferente para variar.
  - **Feedback:** A abordagem preserva o relacionamento, mesmo que a compra seja pequena.
- **d3-o5 · +0 pontos:** Se já comprou, faz sentido oferecer só o que está faltando.
  - **Cliente:** Às vezes quero só uma entrada diferente para variar.
  - **Feedback:** A abordagem preserva o relacionamento, mesmo que a compra seja pequena.
- **d3-o6 · -2 pontos:** Quer conhecer uma opção para uma ocasião diferente?
  - **Cliente:** Isso, não estou procurando fazer outra compra grande.
  - **Feedback:** Ignorar o estoque da cliente prejudica a recomendação.
- **d3-o7 · -6 pontos:** Se comprou no fim de semana, ainda dá para levar bastante coisa.
  - **Cliente:** Isso, não estou procurando fazer outra compra grande.
  - **Feedback:** Ignorar o estoque da cliente prejudica a recomendação.
- **d3-o8 · -10 pontos:** Não faz diferença o que você já tem; sempre é bom reforçar o estoque.
  - **Cliente:** Isso, não estou procurando fazer outra compra grande.
  - **Feedback:** Ignorar o estoque da cliente prejudica a recomendação.

### d4 — Quantidade e desperdício

**MARINA:** Outra coisa: não tenho muito espaço no freezer e não quero ficar acumulando embalagens.

**Ficha de escuta:** Evita grandes embalagens

**Pop-up:** Pop-up de principal: sem bovinos e porção proporcional

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d4-o1 · +10 pontos:** Qual é o tamanho de porção que costuma funcionar para você?
  - **Cliente:** Uma porção pequena costuma dar certo.
  - **Feedback:** Você relacionou quantidade ao espaço e ao consumo de uma pessoa.
- **d4-o2 · +8 pontos:** Você teria espaço para uma embalagem pequena?
  - **Cliente:** Uma porção pequena costuma dar certo.
  - **Feedback:** Você relacionou quantidade ao espaço e ao consumo de uma pessoa.
- **d4-o3 · +6 pontos:** Costuma consumir o produto inteiro em uma refeição?
  - **Cliente:** É, embalagem gigante não faz sentido para mim.
  - **Feedback:** Você reconheceu o ponto, mas ainda falta conferir tamanho real da embalagem.
- **d4-o4 · +4 pontos:** Podemos escolher algo que você consiga porcionar com segurança.
  - **Cliente:** É, embalagem gigante não faz sentido para mim.
  - **Feedback:** Você reconheceu o ponto, mas ainda falta conferir tamanho real da embalagem.
- **d4-o5 · +0 pontos:** O tamanho da embalagem vai pesar na escolha.
  - **Cliente:** É, embalagem gigante não faz sentido para mim.
  - **Feedback:** Você reconheceu o ponto, mas ainda falta conferir tamanho real da embalagem.
- **d4-o6 · -2 pontos:** Se já tem comida, talvez seja melhor indicar pouco.
  - **Cliente:** Estou tentando evitar justamente esse acúmulo.
  - **Feedback:** Recomendar volume exagerado ignora a necessidade explícita.
- **d4-o7 · -6 pontos:** Se não couber no freezer, você pode deixar para resolver depois.
  - **Cliente:** Estou tentando evitar justamente esse acúmulo.
  - **Feedback:** Recomendar volume exagerado ignora a necessidade explícita.
- **d4-o8 · -10 pontos:** Leve bastante porque produto congelado sempre se aproveita.
  - **Cliente:** Estou tentando evitar justamente esse acúmulo.
  - **Feedback:** Recomendar volume exagerado ignora a necessidade explícita.

### d5 — Conferir composição antes da oferta

**MARINA:** Eu preciso conferir os ingredientes com cuidado. Não quero comprar nada com carne bovina escondida na composição.

**Ficha de escuta:** Quer conferir ingredientes

**Pop-up:** Pop-up de acompanhamento: evitar afirmar composição sem rótulo

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d5-o1 · +10 pontos:** Vamos olhar o rótulo e a lista de ingredientes antes de indicar.
  - **Cliente:** Isso. Quero saber exatamente o que estou comprando.
  - **Feedback:** Você tratou composição como algo a verificar, não a adivinhar.
- **d5-o2 · +8 pontos:** Se a composição não estiver clara, melhor não afirmar que serve.
  - **Cliente:** Isso. Quero saber exatamente o que estou comprando.
  - **Feedback:** Você tratou composição como algo a verificar, não a adivinhar.
- **d5-o3 · +6 pontos:** Podemos priorizar opções com informações completas do fabricante.
  - **Cliente:** Boa, não gosto de adivinhar pela embalagem.
  - **Feedback:** A intenção é boa, mas ainda depende de informação de rótulo.
- **d5-o4 · +4 pontos:** Você também evita caldos ou extratos de carne bovina?
  - **Cliente:** Boa, não gosto de adivinhar pela embalagem.
  - **Feedback:** A intenção é boa, mas ainda depende de informação de rótulo.
- **d5-o5 · +0 pontos:** É importante conferir os ingredientes, não só o nome do produto.
  - **Cliente:** Boa, não gosto de adivinhar pela embalagem.
  - **Feedback:** A intenção é boa, mas ainda depende de informação de rótulo.
- **d5-o6 · -2 pontos:** Se não tiver rótulo disponível, podemos deixar esse item de lado.
  - **Cliente:** Eu já falei que não consumo. Não quero correr esse risco.
  - **Feedback:** Garantir ingredientes sem evidência ignora a escolha alimentar da cliente.
- **d5-o7 · -6 pontos:** Pelo nome deve ser sem carne bovina, então pode levar.
  - **Cliente:** Eu já falei que não consumo. Não quero correr esse risco.
  - **Feedback:** Garantir ingredientes sem evidência ignora a escolha alimentar da cliente.
- **d5-o8 · -10 pontos:** Se for só um ingrediente pequeno, acho que não tem problema.
  - **Cliente:** Eu já falei que não consumo. Não quero correr esse risco.
  - **Feedback:** Garantir ingredientes sem evidência ignora a escolha alimentar da cliente.

### d6 — Comparar valor percebido e canal

**MARINA:** Eu costumo comprar em outro mercado. Para uma compra tão pequena, nem sei se compensa mudar.

**Pop-up:** Pop-up de bebida: não aumentar o pedido só para completar cinco itens

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d6-o1 · +10 pontos:** O que costuma pesar mais na sua escolha: preço ou praticidade?
  - **Cliente:** Preço e praticidade pesam bastante para mim.
  - **Feedback:** Você investigou o critério de comparação sem atacar a concorrência.
- **d6-o2 · +8 pontos:** Faz sentido. Podemos comparar somente o que você precisa hoje.
  - **Cliente:** Preço e praticidade pesam bastante para mim.
  - **Feedback:** Você investigou o critério de comparação sem atacar a concorrência.
- **d6-o3 · +6 pontos:** Se não compensar, não precisa levar nada agora.
  - **Cliente:** Eu toparia olhar uma opção, desde que faça sentido.
  - **Feedback:** A relação continua aberta, mas o diferencial ainda precisa ficar claro.
- **d6-o4 · +4 pontos:** Você já conhece algum produto nosso que poderia complementar sua rotina?
  - **Cliente:** Eu toparia olhar uma opção, desde que faça sentido.
  - **Feedback:** A relação continua aberta, mas o diferencial ainda precisa ficar claro.
- **d6-o5 · +0 pontos:** Posso te mostrar uma opção pequena para avaliar, sem pressionar.
  - **Cliente:** Eu toparia olhar uma opção, desde que faça sentido.
  - **Feedback:** A relação continua aberta, mas o diferencial ainda precisa ficar claro.
- **d6-o6 · -2 pontos:** O importante é que a compra realmente tenha utilidade para você.
  - **Cliente:** Não preciso de competição entre lojas; só de uma boa solução.
  - **Feedback:** Falar mal de outro mercado não gera confiança.
- **d6-o7 · -6 pontos:** Se continuar comprando em outro lugar, nunca vai conhecer a Swift.
  - **Cliente:** Não preciso de competição entre lojas; só de uma boa solução.
  - **Feedback:** Falar mal de outro mercado não gera confiança.
- **d6-o8 · -10 pontos:** O outro mercado deve ser pior; aqui compensa sempre.
  - **Cliente:** Não preciso de competição entre lojas; só de uma boa solução.
  - **Feedback:** Falar mal de outro mercado não gera confiança.

### d7 — Fechamento parcial sem pressão

**MARINA:** Achei interessante, mas hoje eu só queria entender as opções. Se comprar, vai ser pouca coisa.

**Pop-up:** Pop-up de sobremesa: sobremesa é opcional e deve respeitar preferência alimentar

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d7-o1 · +10 pontos:** Sem problema. Posso deixar anotadas as opções menores que fazem sentido?
  - **Cliente:** Boa, uma lista curta me ajuda.
  - **Feedback:** Você respeitou a decisão e ofereceu uma continuação útil.
- **d7-o2 · +8 pontos:** Você prefere que eu resuma o que combinou com sua rotina?
  - **Cliente:** Boa, uma lista curta me ajuda.
  - **Feedback:** Você respeitou a decisão e ofereceu uma continuação útil.
- **d7-o3 · +6 pontos:** Se uma delas for útil hoje, a gente vê a quantidade.
  - **Cliente:** Obrigada. Vou escolher só o que fizer sentido.
  - **Feedback:** O encerramento é cordial, mas pode faltar um resumo prático.
- **d7-o4 · +4 pontos:** O que você gostaria de confirmar antes de decidir?
  - **Cliente:** Obrigada. Vou escolher só o que fizer sentido.
  - **Feedback:** O encerramento é cordial, mas pode faltar um resumo prático.
- **d7-o5 · +0 pontos:** Você pode escolher só o item de que realmente precisa.
  - **Cliente:** Obrigada. Vou escolher só o que fizer sentido.
  - **Feedback:** O encerramento é cordial, mas pode faltar um resumo prático.
- **d7-o6 · -2 pontos:** Obrigado por conversar. Prefere encerrar por aqui?
  - **Cliente:** Não quero ser obrigada a fechar uma cesta inteira.
  - **Feedback:** Forçar itens extras contradiz o pedido de uma compra pequena.
- **d7-o7 · -6 pontos:** Como conversamos bastante, seria bom fechar a refeição completa.
  - **Cliente:** Não quero ser obrigada a fechar uma cesta inteira.
  - **Feedback:** Forçar itens extras contradiz o pedido de uma compra pequena.
- **d7-o8 · -10 pontos:** Então vou incluir sobremesa também, mesmo que não tenha pedido.
  - **Cliente:** Não quero ser obrigada a fechar uma cesta inteira.
  - **Feedback:** Forçar itens extras contradiz o pedido de uma compra pequena.

---
## Rafael — 8 etapas

**Perfil:** Compra para a semana, compara preços e tem preferência por outra loja.
**Restrições:** Nenhuma restrição alimentar informada.

### d1 — Abordagem a cliente fiel à concorrência

**VENDEDOR inicia:** Oi, Rafael, tudo bem? Posso te perguntar como costuma organizar suas compras da semana?

**RAFAEL:** Pode. Mas já adianto que normalmente compro em outra loja. Estou só comparando algumas coisas.

**Ficha de escuta:** Costuma comprar em outra loja

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d1-o1 · +10 pontos:** Claro, comparar é normal. Quais produtos você costuma comprar?
  - **Cliente:** Compro para a semana, principalmente carnes do dia a dia.
  - **Feedback:** Você acolheu a comparação e abriu espaço para entender critérios.
- **d1-o2 · +8 pontos:** O que faz você voltar à loja onde costuma comprar?
  - **Cliente:** Compro para a semana, principalmente carnes do dia a dia.
  - **Feedback:** Você acolheu a comparação e abriu espaço para entender critérios.
- **d1-o3 · +6 pontos:** Você compara mais preço, qualidade ou praticidade?
  - **Cliente:** Preço importa bastante, mas também quero praticidade.
  - **Feedback:** A conversa avançou, mas ainda não esclareceu o que ele valoriza.
- **d1-o4 · +4 pontos:** Quer que eu entenda sua rotina antes de sugerir algo?
  - **Cliente:** Preço importa bastante, mas também quero praticidade.
  - **Feedback:** A conversa avançou, mas ainda não esclareceu o que ele valoriza.
- **d1-o5 · +0 pontos:** Posso mostrar opções para você avaliar sem compromisso.
  - **Cliente:** Preço importa bastante, mas também quero praticidade.
  - **Feedback:** A conversa avançou, mas ainda não esclareceu o que ele valoriza.
- **d1-o6 · -2 pontos:** Se quiser, começamos pelo tipo de carne que usa mais.
  - **Cliente:** Não quero discussão sobre lojas, só comparar opções.
  - **Feedback:** Atacar a concorrência ou dispensar o cliente prejudica a relação.
- **d1-o7 · -6 pontos:** Quando você conhecer a Swift vai parar de comprar no outro lugar.
  - **Cliente:** Não quero discussão sobre lojas, só comparar opções.
  - **Feedback:** Atacar a concorrência ou dispensar o cliente prejudica a relação.
- **d1-o8 · -10 pontos:** Se está só comparando, não vale a pena conversar agora.
  - **Cliente:** Não quero discussão sobre lojas, só comparar opções.
  - **Feedback:** Atacar a concorrência ou dispensar o cliente prejudica a relação.

### d2 — Comparação responsável de custo-benefício

**RAFAEL:** Eu olho o preço por quilo. Às vezes um pacote parece barato, mas vem menos do que eu esperava.

**Ficha de escuta:** Compara preços entre estabelecimentos

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d2-o1 · +10 pontos:** Você compara pelo peso líquido ou pelo tamanho da embalagem?
  - **Cliente:** Olho o peso e tento calcular o que realmente rende.
  - **Feedback:** Você ensinou uma comparação justa de custo e quantidade.
- **d2-o2 · +8 pontos:** Quer conferir peso e porções antes de comparar preço?
  - **Cliente:** Olho o peso e tento calcular o que realmente rende.
  - **Feedback:** Você ensinou uma comparação justa de custo e quantidade.
- **d2-o3 · +6 pontos:** Além do preço por quilo, o rendimento no preparo pesa para você?
  - **Cliente:** O rendimento também faz diferença, principalmente na semana.
  - **Feedback:** A ideia ajuda, mas faltou esclarecer a referência de comparação.
- **d2-o4 · +4 pontos:** Que quantidade costuma consumir por semana?
  - **Cliente:** O rendimento também faz diferença, principalmente na semana.
  - **Feedback:** A ideia ajuda, mas faltou esclarecer a referência de comparação.
- **d2-o5 · +0 pontos:** Podemos comparar produtos da mesma categoria e peso.
  - **Cliente:** O rendimento também faz diferença, principalmente na semana.
  - **Feedback:** A ideia ajuda, mas faltou esclarecer a referência de comparação.
- **d2-o6 · -2 pontos:** É importante ver a ficha, e não só o preço na etiqueta.
  - **Cliente:** Isso, quero comparar coisas equivalentes, não só números soltos.
  - **Feedback:** Uma resposta superficial pode levar a uma conclusão enganosa.
- **d2-o7 · -6 pontos:** Se a embalagem parece grande, não precisa conferir o peso.
  - **Cliente:** Isso, quero comparar coisas equivalentes, não só números soltos.
  - **Feedback:** Uma resposta superficial pode levar a uma conclusão enganosa.
- **d2-o8 · -10 pontos:** Preço menor sempre significa uma compra melhor.
  - **Cliente:** Isso, quero comparar coisas equivalentes, não só números soltos.
  - **Feedback:** Uma resposta superficial pode levar a uma conclusão enganosa.

### d3 — Identificar ocasiões de consumo diferentes

**RAFAEL:** Em casa eu preparo carne moída, frango e alguma coisa diferente no fim de semana. Não quero tudo igual.

**Ficha de escuta:** Compra carnes para a semana

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d3-o1 · +10 pontos:** Então você busca variedade entre refeições simples e especiais?
  - **Cliente:** É isso, algo para a semana e uma opção diferente depois.
  - **Feedback:** Você transformou hábitos reais em critérios para uma cesta equilibrada.
- **d3-o2 · +8 pontos:** Quantas pessoas costumam comer com você?
  - **Cliente:** É isso, algo para a semana e uma opção diferente depois.
  - **Feedback:** Você transformou hábitos reais em critérios para uma cesta equilibrada.
- **d3-o3 · +6 pontos:** Você congela porções ou prepara tudo de uma vez?
  - **Cliente:** Costumo deixar uma parte separada para usar em outro dia.
  - **Feedback:** Você percebeu a variedade, mas ainda falta dimensionar o consumo.
- **d3-o4 · +4 pontos:** Vale separar opções de rotina e de fim de semana?
  - **Cliente:** Costumo deixar uma parte separada para usar em outro dia.
  - **Feedback:** Você percebeu a variedade, mas ainda falta dimensionar o consumo.
- **d3-o5 · +0 pontos:** Qual preparo costuma exigir mais tempo?
  - **Cliente:** Costumo deixar uma parte separada para usar em outro dia.
  - **Feedback:** Você percebeu a variedade, mas ainda falta dimensionar o consumo.
- **d3-o6 · -2 pontos:** Podemos pensar numa sugestão que dê para variar.
  - **Cliente:** Variedade é boa, mas sem exagero de quantidade.
  - **Feedback:** Acrescentar produtos sem calcular consumo aumenta o risco de desperdício.
- **d3-o7 · -6 pontos:** Já que gosta de variedade, vou incluir todos os cortes premium.
  - **Cliente:** Variedade é boa, mas sem exagero de quantidade.
  - **Feedback:** Acrescentar produtos sem calcular consumo aumenta o risco de desperdício.
- **d3-o8 · -10 pontos:** Se você gosta de três tipos, precisa comprar três embalagens grandes.
  - **Cliente:** Variedade é boa, mas sem exagero de quantidade.
  - **Feedback:** Acrescentar produtos sem calcular consumo aumenta o risco de desperdício.

### d4 — Prevenção de desperdício

**RAFAEL:** Já aconteceu de eu comprar demais e perder alimento. Agora prefiro começar com o que sei que vou usar.

**Ficha de escuta:** Quer evitar perdas

**Pop-up:** Pop-up de entrada: algo que complemente a rotina sem exagero

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d4-o1 · +10 pontos:** Que item costuma sobrar mais na sua casa?
  - **Cliente:** Sobra mais quando compro só por causa da promoção.
  - **Feedback:** Você ligou a sugestão à experiência real de desperdício.
- **d4-o2 · +8 pontos:** Podemos começar pela porção que você realmente consome?
  - **Cliente:** Sobra mais quando compro só por causa da promoção.
  - **Feedback:** Você ligou a sugestão à experiência real de desperdício.
- **d4-o3 · +6 pontos:** Você já tem entrada ou acompanhamento para a semana?
  - **Cliente:** Embalagem menor costuma dar mais certo para mim.
  - **Feedback:** A ideia pode funcionar, mas ainda depende de conferir o estoque.
- **d4-o4 · +4 pontos:** Tem preferência por embalagens menores?
  - **Cliente:** Embalagem menor costuma dar mais certo para mim.
  - **Feedback:** A ideia pode funcionar, mas ainda depende de conferir o estoque.
- **d4-o5 · +0 pontos:** Vale completar apenas o que está faltando.
  - **Cliente:** Embalagem menor costuma dar mais certo para mim.
  - **Feedback:** A ideia pode funcionar, mas ainda depende de conferir o estoque.
- **d4-o6 · -2 pontos:** A gente pode deixar itens extras como opcionais.
  - **Cliente:** Não quero correr o risco de perder comida de novo.
  - **Feedback:** Volume sem necessidade ignora uma preocupação declarada.
- **d4-o7 · -6 pontos:** Se o pacote for promocional, compensa levar mesmo sem precisar.
  - **Cliente:** Não quero correr o risco de perder comida de novo.
  - **Feedback:** Volume sem necessidade ignora uma preocupação declarada.
- **d4-o8 · -10 pontos:** Para aproveitar o preço, sempre vale comprar em volume.
  - **Cliente:** Não quero correr o risco de perder comida de novo.
  - **Feedback:** Volume sem necessidade ignora uma preocupação declarada.

### d5 — Tratar objeção sobre congelados

**RAFAEL:** Eu gosto de ver carne fresca na hora. Tenho um pouco de resistência com produto congelado.

**Ficha de escuta:** Tem preferência por cortes frescos

**Pop-up:** Pop-up de principal: evitar prometer equivalência sem evidência

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d5-o1 · +10 pontos:** O que mais te preocupa nos congelados: sabor, textura ou armazenamento?
  - **Cliente:** Já comprei um que ficou ruim depois do preparo.
  - **Feedback:** Você investigou a causa da resistência sem prometer resultados impossíveis.
- **d5-o2 · +8 pontos:** Entendo. Posso apresentar as informações do produto sem te pressionar?
  - **Cliente:** Já comprei um que ficou ruim depois do preparo.
  - **Feedback:** Você investigou a causa da resistência sem prometer resultados impossíveis.
- **d5-o3 · +6 pontos:** Você já teve alguma experiência ruim com congelados?
  - **Cliente:** Minha preocupação é textura e qualidade, principalmente.
  - **Feedback:** Você ofereceu informação, mas pode ouvir mais o motivo da dúvida.
- **d5-o4 · +4 pontos:** Podemos olhar embalagem e orientações antes de decidir.
  - **Cliente:** Minha preocupação é textura e qualidade, principalmente.
  - **Feedback:** Você ofereceu informação, mas pode ouvir mais o motivo da dúvida.
- **d5-o5 · +0 pontos:** Se preferir fresco, sua escolha deve ser respeitada.
  - **Cliente:** Minha preocupação é textura e qualidade, principalmente.
  - **Feedback:** Você ofereceu informação, mas pode ouvir mais o motivo da dúvida.
- **d5-o6 · -2 pontos:** Quer comparar uma opção de preparo prático com o que já costuma comprar?
  - **Cliente:** Quero entender, mas não gosto quando tentam desmerecer meu hábito.
  - **Feedback:** Desqualificar a experiência do cliente enfraquece a credibilidade.
- **d5-o7 · -6 pontos:** Congelado é sempre superior ao fresco, pode confiar.
  - **Cliente:** Quero entender, mas não gosto quando tentam desmerecer meu hábito.
  - **Feedback:** Desqualificar a experiência do cliente enfraquece a credibilidade.
- **d5-o8 · -10 pontos:** Isso é só preconceito com produto congelado.
  - **Cliente:** Quero entender, mas não gosto quando tentam desmerecer meu hábito.
  - **Feedback:** Desqualificar a experiência do cliente enfraquece a credibilidade.

### d6 — Objeção de preço comparativo

**RAFAEL:** Vi um acompanhamento parecido mais barato em outro mercado. Como sei se vale trocar?

**Pop-up:** Pop-up de acompanhamento: avaliar custo por porção e utilidade

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d6-o1 · +10 pontos:** Podemos comparar peso, ingredientes e modo de preparo?
  - **Cliente:** Boa, quero comparar produtos equivalentes.
  - **Feedback:** Você conectou preço a atributos verificáveis e ao uso real.
- **d6-o2 · +8 pontos:** Qual produto você encontrou para compararmos de forma justa?
  - **Cliente:** Boa, quero comparar produtos equivalentes.
  - **Feedback:** Você conectou preço a atributos verificáveis e ao uso real.
- **d6-o3 · +6 pontos:** Para você, o que faria valer pagar um pouco mais?
  - **Cliente:** Se render e der menos trabalho, vale considerar.
  - **Feedback:** Existe argumento de valor, mas ele precisa de comparação concreta.
- **d6-o4 · +4 pontos:** Se os dois forem parecidos, podemos conferir o rendimento.
  - **Cliente:** Se render e der menos trabalho, vale considerar.
  - **Feedback:** Existe argumento de valor, mas ele precisa de comparação concreta.
- **d6-o5 · +0 pontos:** Pode ser útil olhar a quantidade que será consumida.
  - **Cliente:** Se render e der menos trabalho, vale considerar.
  - **Feedback:** Existe argumento de valor, mas ele precisa de comparação concreta.
- **d6-o6 · -2 pontos:** Talvez a praticidade compense, mas precisamos conferir.
  - **Cliente:** Só marca não me convence; eu quero entender o benefício.
  - **Feedback:** Afirmar superioridade sem evidência não é uma boa abordagem.
- **d6-o7 · -6 pontos:** Nossa marca é melhor, então o preço maior já está justificado.
  - **Cliente:** Só marca não me convence; eu quero entender o benefício.
  - **Feedback:** Afirmar superioridade sem evidência não é uma boa abordagem.
- **d6-o8 · -10 pontos:** Não precisa comparar; aqui os produtos são de qualidade.
  - **Cliente:** Só marca não me convence; eu quero entender o benefício.
  - **Feedback:** Afirmar superioridade sem evidência não é uma boa abordagem.

### d7 — Objeção: não precisa comprar agora

**RAFAEL:** Para falar a verdade, já tenho quase tudo em casa. Hoje talvez nem precise levar mais nada.

**Pop-up:** Pop-up de bebida: não prometer promoção ou disponibilidade não confirmada

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d7-o1 · +10 pontos:** O que ainda poderia faltar durante a semana?
  - **Cliente:** É verdade, talvez falte só uma coisa pequena.
  - **Feedback:** Você respeitou o estoque e identificou uma oportunidade legítima.
- **d7-o2 · +8 pontos:** Se já está abastecido, podemos deixar a recomendação para depois.
  - **Cliente:** É verdade, talvez falte só uma coisa pequena.
  - **Feedback:** Você respeitou o estoque e identificou uma oportunidade legítima.
- **d7-o3 · +6 pontos:** Você costuma repor bebidas ou só nas compras maiores?
  - **Cliente:** Gostei de ter a comparação para outra semana.
  - **Feedback:** Você não pressionou, mas pode explorar uma necessidade futura.
- **d7-o4 · +4 pontos:** Quer guardar uma referência de preço para outra semana?
  - **Cliente:** Gostei de ter a comparação para outra semana.
  - **Feedback:** Você não pressionou, mas pode explorar uma necessidade futura.
- **d7-o5 · +0 pontos:** O importante é não levar algo repetido.
  - **Cliente:** Gostei de ter a comparação para outra semana.
  - **Feedback:** Você não pressionou, mas pode explorar uma necessidade futura.
- **d7-o6 · -2 pontos:** Podemos encerrar com uma lista curta para sua próxima compra.
  - **Cliente:** Não estou procurando aumentar meu estoque sem necessidade.
  - **Feedback:** Forçar itens desnecessários compromete o atendimento consultivo.
- **d7-o7 · -6 pontos:** Mas aproveite a chance e leve qualquer item para testar.
  - **Cliente:** Não estou procurando aumentar meu estoque sem necessidade.
  - **Feedback:** Forçar itens desnecessários compromete o atendimento consultivo.
- **d7-o8 · -10 pontos:** Mesmo sem precisar, comprar agora evita trabalho depois.
  - **Cliente:** Não estou procurando aumentar meu estoque sem necessidade.
  - **Feedback:** Forçar itens desnecessários compromete o atendimento consultivo.

### d8 — Encerramento com relacionamento

**RAFAEL:** Foi uma conversa útil. Acho que vou testar algum item em outra ocasião antes de mudar minhas compras de vez.

**Pop-up:** Pop-up de sobremesa: opcional, sem impor cesta fechada

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d8-o1 · +10 pontos:** Boa ideia. Quer que eu resuma as opções que combinaram com sua rotina?
  - **Cliente:** Isso, quero começar devagar se decidir testar.
  - **Feedback:** Você preservou uma possível recompra sem exigir decisão imediata.
- **d8-o2 · +8 pontos:** Experimente no seu ritmo. Depois pode me contar o que achou.
  - **Cliente:** Isso, quero começar devagar se decidir testar.
  - **Feedback:** Você preservou uma possível recompra sem exigir decisão imediata.
- **d8-o3 · +6 pontos:** Posso deixar anotadas as informações para uma comparação futura.
  - **Cliente:** Obrigado, gostei de poder comparar sem pressão.
  - **Feedback:** O fechamento foi respeitoso, embora pudesse sugerir um próximo passo.
- **d8-o4 · +4 pontos:** Você prefere começar com um item pequeno?
  - **Cliente:** Obrigado, gostei de poder comparar sem pressão.
  - **Feedback:** O fechamento foi respeitoso, embora pudesse sugerir um próximo passo.
- **d8-o5 · +0 pontos:** Se hoje não faz sentido comprar, tudo bem.
  - **Cliente:** Obrigado, gostei de poder comparar sem pressão.
  - **Feedback:** O fechamento foi respeitoso, embora pudesse sugerir um próximo passo.
- **d8-o6 · -2 pontos:** Obrigado pela conversa e pelas comparações sinceras.
  - **Cliente:** Se me cobrarem uma compra, prefiro continuar na outra loja.
  - **Feedback:** Pressão final pode apagar a confiança construída durante a conversa.
- **d8-o7 · -6 pontos:** Para provar que é melhor, leve a refeição inteira de uma vez.
  - **Cliente:** Se me cobrarem uma compra, prefiro continuar na outra loja.
  - **Feedback:** Pressão final pode apagar a confiança construída durante a conversa.
- **d8-o8 · -10 pontos:** Se não comprar agora, toda essa comparação foi perda de tempo.
  - **Cliente:** Se me cobrarem uma compra, prefiro continuar na outra loja.
  - **Feedback:** Pressão final pode apagar a confiança construída durante a conversa.

---
## Camila — 9 etapas

**Perfil:** Tem reuniões, pouco tempo para cozinhar e orçamento controlado; evita frituras por preferência.
**Restrições:** Evita frituras por preferência, não por alergia; conferir modo de preparo.

### d1 — Abordagem objetiva em momento de pressa

**VENDEDOR inicia:** Oi, Camila, tudo bem? Vi que você está saindo de uma reunião. Tem um minutinho agora ou prefere outro momento?

**CAMILA:** Tenho pouco tempo antes da próxima, mas pode falar se for bem objetivo.

**Ficha de escuta:** Pouco tempo entre reuniões

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d1-o1 · +10 pontos:** Claro. Qual é a principal dificuldade com suas refeições durante a semana?
  - **Cliente:** Durante a semana eu quase não consigo cozinhar.
  - **Feedback:** Você respeitou o tempo e buscou a necessidade principal.
- **d1-o2 · +8 pontos:** Posso fazer uma pergunta rápida para entender o que precisa?
  - **Cliente:** Durante a semana eu quase não consigo cozinhar.
  - **Feedback:** Você respeitou o tempo e buscou a necessidade principal.
- **d1-o3 · +6 pontos:** Se não for um bom momento, posso voltar depois.
  - **Cliente:** Quero objetividade, sem um catálogo enorme.
  - **Feedback:** A fala foi objetiva, mas ainda pode esclarecer melhor a prioridade.
- **d1-o4 · +4 pontos:** Você procura algo para hoje ou para planejar a semana?
  - **Cliente:** Quero objetividade, sem um catálogo enorme.
  - **Feedback:** A fala foi objetiva, mas ainda pode esclarecer melhor a prioridade.
- **d1-o5 · +0 pontos:** Vou focar só no que for útil para sua rotina.
  - **Cliente:** Quero objetividade, sem um catálogo enorme.
  - **Feedback:** A fala foi objetiva, mas ainda pode esclarecer melhor a prioridade.
- **d1-o6 · -2 pontos:** O que seria prioridade numa compra rápida?
  - **Cliente:** Se demorar muito, vou precisar voltar ao trabalho.
  - **Feedback:** Ignorar o limite de tempo prejudica a abertura para o atendimento.
- **d1-o7 · -6 pontos:** Vou te mostrar dez produtos de uma vez para ganhar tempo.
  - **Cliente:** Se demorar muito, vou precisar voltar ao trabalho.
  - **Feedback:** Ignorar o limite de tempo prejudica a abertura para o atendimento.
- **d1-o8 · -10 pontos:** É rapidinho, mas você precisa me ouvir até o final.
  - **Cliente:** Se demorar muito, vou precisar voltar ao trabalho.
  - **Feedback:** Ignorar o limite de tempo prejudica a abertura para o atendimento.

### d2 — Investigar preferências e preparo, sem inventar alergias

**CAMILA:** Eu evito frituras, por preferência. Quando o dia é corrido, quero alguma coisa que dê para assar ou preparar sem fritar.

**Ficha de escuta:** Evita frituras

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d2-o1 · +10 pontos:** Entendi. Você tem forno ou air fryer em casa?
  - **Cliente:** Tenho forno e air fryer, mas prefiro o forno quando dá.
  - **Feedback:** Você respeitou a preferência e investigou o modo de preparo.
- **d2-o2 · +8 pontos:** Quais preparos sem fritura são mais práticos para você?
  - **Cliente:** Tenho forno e air fryer, mas prefiro o forno quando dá.
  - **Feedback:** Você respeitou a preferência e investigou o modo de preparo.
- **d2-o3 · +6 pontos:** Existe algum ingrediente que você também evita?
  - **Cliente:** Só evito frituras mesmo, não tenho alergia.
  - **Feedback:** Você lembrou da restrição, mas ainda falta conferir a ficha do produto.
- **d2-o4 · +4 pontos:** Então vou dar preferência a opções que possam ser assadas.
  - **Cliente:** Só evito frituras mesmo, não tenho alergia.
  - **Feedback:** Você lembrou da restrição, mas ainda falta conferir a ficha do produto.
- **d2-o5 · +0 pontos:** A forma de preparo precisa aparecer na recomendação.
  - **Cliente:** Só evito frituras mesmo, não tenho alergia.
  - **Feedback:** Você lembrou da restrição, mas ainda falta conferir a ficha do produto.
- **d2-o6 · -2 pontos:** Podemos conferir no rótulo como o produto é preparado.
  - **Cliente:** É uma preferência importante para mim, não quero que seja ignorada.
  - **Feedback:** Desconsiderar uma preferência explícita reduz a adequação da oferta.
- **d2-o7 · -6 pontos:** Uma fritura de vez em quando não vai mudar nada.
  - **Cliente:** É uma preferência importante para mim, não quero que seja ignorada.
  - **Feedback:** Desconsiderar uma preferência explícita reduz a adequação da oferta.
- **d2-o8 · -10 pontos:** O importante é ser rápido, mesmo que precise fritar.
  - **Cliente:** É uma preferência importante para mim, não quero que seja ignorada.
  - **Feedback:** Desconsiderar uma preferência explícita reduz a adequação da oferta.

### d3 — Escuta e descoberta de rotina

**CAMILA:** Normalmente chego tarde, e às vezes acabo comendo qualquer coisa porque não deixei nada planejado.

**Ficha de escuta:** Prefere refeições rápidas

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d3-o1 · +10 pontos:** Qual refeição costuma ser mais difícil: almoço ou jantar?
  - **Cliente:** O jantar é o mais complicado.
  - **Feedback:** Você detalhou a rotina para recomendar soluções viáveis.
- **d3-o2 · +8 pontos:** Quanto tempo você consegue separar para preparar a comida?
  - **Cliente:** O jantar é o mais complicado.
  - **Feedback:** Você detalhou a rotina para recomendar soluções viáveis.
- **d3-o3 · +6 pontos:** Você prefere porções prontas ou cozinhar um pouco?
  - **Cliente:** Tenho uns vinte minutos e pouca paciência para cozinhar tarde.
  - **Feedback:** A ideia de praticidade ajuda, mas ainda não define tempo ou consumo.
- **d3-o4 · +4 pontos:** Qual é o maior problema: tempo, organização ou variedade?
  - **Cliente:** Tenho uns vinte minutos e pouca paciência para cozinhar tarde.
  - **Feedback:** A ideia de praticidade ajuda, mas ainda não define tempo ou consumo.
- **d3-o5 · +0 pontos:** Uma opção que exija pouca preparação pode ajudar.
  - **Cliente:** Tenho uns vinte minutos e pouca paciência para cozinhar tarde.
  - **Feedback:** A ideia de praticidade ajuda, mas ainda não define tempo ou consumo.
- **d3-o6 · -2 pontos:** Podemos pensar em refeições simples para os dias corridos.
  - **Cliente:** Preciso de opções realistas, não de outra tarefa complicada.
  - **Feedback:** Acrescentar trabalho contradiz a dificuldade da cliente.
- **d3-o7 · -6 pontos:** Já que chega tarde, compre vários kits completos de uma vez.
  - **Cliente:** Preciso de opções realistas, não de outra tarefa complicada.
  - **Feedback:** Acrescentar trabalho contradiz a dificuldade da cliente.
- **d3-o8 · -10 pontos:** Quando está cansada, dá para deixar a alimentação em segundo plano.
  - **Cliente:** Preciso de opções realistas, não de outra tarefa complicada.
  - **Feedback:** Acrescentar trabalho contradiz a dificuldade da cliente.

### d4 — Tratamento de objeção financeira

**CAMILA:** E estou tentando economizar, porque este mês tive despesas extras.

**Ficha de escuta:** Orçamento limitado

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d4-o1 · +10 pontos:** Você tem uma faixa de gasto para essa compra?
  - **Cliente:** Quero uma cesta pequena e que realmente ajude.
  - **Feedback:** Você acolheu o limite sem abandonar a necessidade de praticidade.
- **d4-o2 · +8 pontos:** Quais itens são prioridade se precisarmos reduzir a cesta?
  - **Cliente:** Quero uma cesta pequena e que realmente ajude.
  - **Feedback:** Você acolheu o limite sem abandonar a necessidade de praticidade.
- **d4-o3 · +6 pontos:** Podemos comparar opções simples antes de escolher.
  - **Cliente:** Prefiro economizar sem levar produtos inúteis.
  - **Feedback:** A ideia é razoável, mas ainda falta combinar valor e quantidade.
- **d4-o4 · +4 pontos:** Vou evitar sugerir itens que você não vai usar.
  - **Cliente:** Prefiro economizar sem levar produtos inúteis.
  - **Feedback:** A ideia é razoável, mas ainda falta combinar valor e quantidade.
- **d4-o5 · +0 pontos:** Vale olhar o custo por refeição, não só por embalagem.
  - **Cliente:** Prefiro economizar sem levar produtos inúteis.
  - **Feedback:** A ideia é razoável, mas ainda falta combinar valor e quantidade.
- **d4-o6 · -2 pontos:** Podemos ajustar quantidade para o seu consumo real.
  - **Cliente:** Minha limitação de gasto não é negociável hoje.
  - **Feedback:** Pressionar gastos extras contraria o objetivo da cliente.
- **d4-o7 · -6 pontos:** Mesmo no fim do mês, é melhor levar tudo agora.
  - **Cliente:** Minha limitação de gasto não é negociável hoje.
  - **Feedback:** Pressionar gastos extras contraria o objetivo da cliente.
- **d4-o8 · -10 pontos:** Se quer praticidade, não dá para ficar olhando orçamento.
  - **Cliente:** Minha limitação de gasto não é negociável hoje.
  - **Feedback:** Pressionar gastos extras contraria o objetivo da cliente.

### d5 — Entrada com utilidade real

**CAMILA:** Talvez eu precise só de alguma coisa leve para acompanhar o jantar. Não quero transformar isso numa compra enorme.

**Pop-up:** Pop-up de entrada: evitar frituras e porções exageradas

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d5-o1 · +10 pontos:** O que você já tem em casa para não repetir?
  - **Cliente:** Tenho algumas coisas. Só queria complementar sem exagerar.
  - **Feedback:** Você investigou o estoque e respeitou a preferência por uma compra pequena.
- **d5-o2 · +8 pontos:** Prefere uma entrada pequena ou algo que também sirva de lanche?
  - **Cliente:** Tenho algumas coisas. Só queria complementar sem exagerar.
  - **Feedback:** Você investigou o estoque e respeitou a preferência por uma compra pequena.
- **d5-o3 · +6 pontos:** Pode ser um item fácil de assar, se o rótulo confirmar?
  - **Cliente:** Algo leve e fácil de preparar seria bom.
  - **Feedback:** A sugestão parece possível, mas precisa confirmar preparo e quantidade.
- **d5-o4 · +4 pontos:** Tem alguma opção que gostaria de evitar além da fritura?
  - **Cliente:** Algo leve e fácil de preparar seria bom.
  - **Feedback:** A sugestão parece possível, mas precisa confirmar preparo e quantidade.
- **d5-o5 · +0 pontos:** Podemos manter essa parte da refeição opcional.
  - **Cliente:** Algo leve e fácil de preparar seria bom.
  - **Feedback:** A sugestão parece possível, mas precisa confirmar preparo e quantidade.
- **d5-o6 · -2 pontos:** Se não precisar de entrada, não vamos forçar uma.
  - **Cliente:** Eu já disse que não quero uma cesta muito grande.
  - **Feedback:** Impor volume ignora a limitação de tempo e orçamento.
- **d5-o7 · -6 pontos:** Se a gente montar uma refeição completa, compensa levar tudo.
  - **Cliente:** Eu já disse que não quero uma cesta muito grande.
  - **Feedback:** Impor volume ignora a limitação de tempo e orçamento.
- **d5-o8 · -10 pontos:** Mesmo sem precisar, leve uma entrada grande para garantir.
  - **Cliente:** Eu já disse que não quero uma cesta muito grande.
  - **Feedback:** Impor volume ignora a limitação de tempo e orçamento.

### d6 — Objeção baseada em experiência anterior

**CAMILA:** Eu quase não compro congelados porque tive uma experiência ruim. Um deles levou muito mais tempo para preparar do que dizia.

**Pop-up:** Pop-up de principal: adequação ao preparo sem fritura

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d6-o1 · +10 pontos:** O que aconteceu no preparo daquela vez?
  - **Cliente:** O problema foi tempo e resultado, não o produto ser congelado.
  - **Feedback:** Você investigou uma experiência negativa sem desmerecer a cliente.
- **d6-o2 · +8 pontos:** Vamos verificar as instruções reais antes de recomendar?
  - **Cliente:** O problema foi tempo e resultado, não o produto ser congelado.
  - **Feedback:** Você investigou uma experiência negativa sem desmerecer a cliente.
- **d6-o3 · +6 pontos:** Você prefere um item mais simples, mesmo que tenha menos variedade?
  - **Cliente:** Se a embalagem tiver instruções claras, já ajuda.
  - **Feedback:** A solução é plausível, mas depende de informações verificáveis.
- **d6-o4 · +4 pontos:** Posso comparar tempo de preparo de opções diferentes.
  - **Cliente:** Se a embalagem tiver instruções claras, já ajuda.
  - **Feedback:** A solução é plausível, mas depende de informações verificáveis.
- **d6-o5 · +0 pontos:** Não vou prometer um tempo que não aparece na embalagem.
  - **Cliente:** Se a embalagem tiver instruções claras, já ajuda.
  - **Feedback:** A solução é plausível, mas depende de informações verificáveis.
- **d6-o6 · -2 pontos:** Faz sentido confirmar equipamento e porção antes de escolher.
  - **Cliente:** Quero algo confiável, não uma promessa bonita.
  - **Feedback:** Garantias sem base podem gerar outra frustração.
- **d6-o7 · -6 pontos:** Desta vez pode confiar que qualquer congelado fica pronto rapidinho.
  - **Cliente:** Quero algo confiável, não uma promessa bonita.
  - **Feedback:** Garantias sem base podem gerar outra frustração.
- **d6-o8 · -10 pontos:** Foi só falta de costume sua; congelado sempre é prático.
  - **Cliente:** Quero algo confiável, não uma promessa bonita.
  - **Feedback:** Garantias sem base podem gerar outra frustração.

### d7 — Quantidade e capacidade de armazenamento

**CAMILA:** Também tenho pouco espaço no freezer. Não cabe muita coisa para a semana toda.

**Ficha de escuta:** Pouco espaço no freezer

**Pop-up:** Pop-up de acompanhamento: conferir espaço e porções

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d7-o1 · +10 pontos:** Quanto espaço você consegue reservar para essa compra?
  - **Cliente:** Cabem poucas embalagens pequenas.
  - **Feedback:** Você considerou armazenamento e consumo antes da margem da cesta.
- **d7-o2 · +8 pontos:** Quer priorizar embalagens menores?
  - **Cliente:** Cabem poucas embalagens pequenas.
  - **Feedback:** Você considerou armazenamento e consumo antes da margem da cesta.
- **d7-o3 · +6 pontos:** Você costuma cozinhar uma porção de cada vez?
  - **Cliente:** Não quero lotar o freezer nem gerar desperdício.
  - **Feedback:** O raciocínio vai na direção certa, mas pede conferir medidas reais.
- **d7-o4 · +4 pontos:** Podemos limitar a quantidade ao espaço disponível.
  - **Cliente:** Não quero lotar o freezer nem gerar desperdício.
  - **Feedback:** O raciocínio vai na direção certa, mas pede conferir medidas reais.
- **d7-o5 · +0 pontos:** Faz sentido olhar o tamanho físico das embalagens.
  - **Cliente:** Não quero lotar o freezer nem gerar desperdício.
  - **Feedback:** O raciocínio vai na direção certa, mas pede conferir medidas reais.
- **d7-o6 · -2 pontos:** Talvez um acompanhamento pequeno seja suficiente.
  - **Cliente:** Isso seria exatamente o oposto do que estou procurando.
  - **Feedback:** Ignorar espaço do freezer pode tornar a compra inviável.
- **d7-o7 · -6 pontos:** Se não couber, depois você reorganiza tudo em casa.
  - **Cliente:** Isso seria exatamente o oposto do que estou procurando.
  - **Feedback:** Ignorar espaço do freezer pode tornar a compra inviável.
- **d7-o8 · -10 pontos:** Quanto maior a embalagem, melhor a margem; leve a maior.
  - **Cliente:** Isso seria exatamente o oposto do que estou procurando.
  - **Feedback:** Ignorar espaço do freezer pode tornar a compra inviável.

### d8 — Objeção de valor e preço

**CAMILA:** Mesmo assim, preciso saber se esses produtos realmente compensam o preço.

**Pop-up:** Pop-up de bebida: opcional e alinhado ao orçamento

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d8-o1 · +10 pontos:** Podemos comparar preço por refeição e porção?
  - **Cliente:** Se economizar tempo sem estourar o orçamento, vale olhar.
  - **Feedback:** Você apresentou valor ligado às prioridades da cliente.
- **d8-o2 · +8 pontos:** Qual benefício faria diferença para você: tempo ou economia?
  - **Cliente:** Se economizar tempo sem estourar o orçamento, vale olhar.
  - **Feedback:** Você apresentou valor ligado às prioridades da cliente.
- **d8-o3 · +6 pontos:** Se uma opção exigir mais preparo, ela talvez não compense.
  - **Cliente:** É, quero comparar o custo real com a praticidade.
  - **Feedback:** A comparação começa bem, mas precisa de preço e preparo reais.
- **d8-o4 · +4 pontos:** Podemos deixar de lado itens com pouca utilidade para sua rotina.
  - **Cliente:** É, quero comparar o custo real com a praticidade.
  - **Feedback:** A comparação começa bem, mas precisa de preço e preparo reais.
- **d8-o5 · +0 pontos:** Vale comparar custo e esforço de preparo juntos.
  - **Cliente:** É, quero comparar o custo real com a praticidade.
  - **Feedback:** A comparação começa bem, mas precisa de preço e preparo reais.
- **d8-o6 · -2 pontos:** Vou destacar somente os itens que resolvem um problema real.
  - **Cliente:** Quero entender o que ganho, não ouvir só que é melhor.
  - **Feedback:** Preço sem justificativa não enfrenta a objeção.
- **d8-o7 · -6 pontos:** É mais caro porque é melhor, não precisa fazer conta.
  - **Cliente:** Quero entender o que ganho, não ouvir só que é melhor.
  - **Feedback:** Preço sem justificativa não enfrenta a objeção.
- **d8-o8 · -10 pontos:** Como você tem pressa, não vale perder tempo comparando.
  - **Cliente:** Quero entender o que ganho, não ouvir só que é melhor.
  - **Feedback:** Preço sem justificativa não enfrenta a objeção.

### d9 — Encerramento respeitando agenda

**CAMILA:** Tenho que ir para outra reunião. Gostei de algumas ideias, mas não vou decidir tudo agora.

**Pop-up:** Pop-up de sobremesa: opção de não recomendar deve continuar disponível

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d9-o1 · +10 pontos:** Claro. Posso te deixar um resumo objetivo do que mais combinou?
  - **Cliente:** Um resumo curto seria ótimo.
  - **Feedback:** Você encerrou no tempo da cliente e facilitou a próxima decisão.
- **d9-o2 · +8 pontos:** Prefere levar só a recomendação principal para pensar depois?
  - **Cliente:** Um resumo curto seria ótimo.
  - **Feedback:** Você encerrou no tempo da cliente e facilitou a próxima decisão.
- **d9-o3 · +6 pontos:** Obrigado pelo tempo. A gente pode continuar em outro momento.
  - **Cliente:** Obrigado por respeitar minha agenda; depois eu avalio.
  - **Feedback:** A resposta não pressiona, mas poderia resumir o mais importante.
- **d9-o4 · +4 pontos:** O que falta confirmar antes de qualquer compra?
  - **Cliente:** Obrigado por respeitar minha agenda; depois eu avalio.
  - **Feedback:** A resposta não pressiona, mas poderia resumir o mais importante.
- **d9-o5 · +0 pontos:** Posso indicar o que é prioridade e o que é opcional.
  - **Cliente:** Obrigado por respeitar minha agenda; depois eu avalio.
  - **Feedback:** A resposta não pressiona, mas poderia resumir o mais importante.
- **d9-o6 · -2 pontos:** Se hoje não é a hora, melhor não prolongar.
  - **Cliente:** Não posso atrasar a reunião por causa de uma venda.
  - **Feedback:** A insistência final desrespeita o horário informado.
- **d9-o7 · -6 pontos:** Só falta sobremesa; preciso que você escolha antes de sair.
  - **Cliente:** Não posso atrasar a reunião por causa de uma venda.
  - **Feedback:** A insistência final desrespeita o horário informado.
- **d9-o8 · -10 pontos:** Agora que conversamos, tem que fechar pelo menos uma coisa.
  - **Cliente:** Não posso atrasar a reunião por causa de uma venda.
  - **Feedback:** A insistência final desrespeita o horário informado.

---
## André — 10 etapas

**Perfil:** Compra para quatro pessoas, tem pressa e divide decisões de compra com a família.
**Restrições:** Nenhuma restrição alimentar individual informada; confirmar preferências da família.

### d1 — Abordagem e escuta de um cliente com família

**VENDEDOR inicia:** Oi, André, tudo certo? Tem um minutinho para falar das compras da semana?

**ANDRÉ:** Pode ser rápido. Compro para quatro pessoas lá em casa e preciso organizar o gasto.

**Ficha de escuta:** Compra para quatro pessoas

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d1-o1 · +10 pontos:** Claro. O que costuma entrar na compra de vocês toda semana?
  - **Cliente:** Usamos bastante frango, carne e acompanhamentos simples.
  - **Feedback:** Você respeitou tempo, família e controle de gastos na abertura.
- **d1-o2 · +8 pontos:** Vocês fazem refeições em casa quantos dias por semana?
  - **Cliente:** Usamos bastante frango, carne e acompanhamentos simples.
  - **Feedback:** Você respeitou tempo, família e controle de gastos na abertura.
- **d1-o3 · +6 pontos:** O que está faltando de verdade nesta compra?
  - **Cliente:** Jantamos juntos quase todos os dias.
  - **Feedback:** A conversa avança, mas ainda falta quantificar o consumo.
- **d1-o4 · +4 pontos:** Se eu entender as prioridades, consigo ser mais objetivo.
  - **Cliente:** Jantamos juntos quase todos os dias.
  - **Feedback:** A conversa avança, mas ainda falta quantificar o consumo.
- **d1-o5 · +0 pontos:** Podemos começar pelos produtos do dia a dia.
  - **Cliente:** Jantamos juntos quase todos os dias.
  - **Feedback:** A conversa avança, mas ainda falta quantificar o consumo.
- **d1-o6 · -2 pontos:** Vou considerar que o orçamento é uma prioridade.
  - **Cliente:** Preciso que seja prático, não uma cesta enorme.
  - **Feedback:** Pressa para vender não substitui o diagnóstico.
- **d1-o7 · -6 pontos:** Para quatro pessoas, recomendo já começar por uma cesta grande.
  - **Cliente:** Preciso que seja prático, não uma cesta enorme.
  - **Feedback:** Pressa para vender não substitui o diagnóstico.
- **d1-o8 · -10 pontos:** Vou montar um pedido completo antes de você me explicar.
  - **Cliente:** Preciso que seja prático, não uma cesta enorme.
  - **Feedback:** Pressa para vender não substitui o diagnóstico.

### d2 — Rotina familiar e frequência de consumo

**ANDRÉ:** A gente cozinha quase todo dia, mas o almoço e o jantar não são sempre iguais.

**Ficha de escuta:** Compras para a semana

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d2-o1 · +10 pontos:** Quantas refeições vocês costumam preparar em casa?
  - **Cliente:** No jantar quase sempre estão os quatro.
  - **Feedback:** Você descobriu hábitos que ajudam a calcular a cesta.
- **d2-o2 · +8 pontos:** As quatro pessoas comem as mesmas coisas?
  - **Cliente:** No jantar quase sempre estão os quatro.
  - **Feedback:** Você descobriu hábitos que ajudam a calcular a cesta.
- **d2-o3 · +6 pontos:** Vocês repetem refeições ou gostam de variar?
  - **Cliente:** As crianças têm gostos diferentes.
  - **Feedback:** Você percebeu a variedade, mas ainda não verificou consumo e preferências.
- **d2-o4 · +4 pontos:** Tem algum dia em que a praticidade é mais importante?
  - **Cliente:** As crianças têm gostos diferentes.
  - **Feedback:** Você percebeu a variedade, mas ainda não verificou consumo e preferências.
- **d2-o5 · +0 pontos:** Uma cesta variada pode fazer sentido se não houver excesso.
  - **Cliente:** As crianças têm gostos diferentes.
  - **Feedback:** Você percebeu a variedade, mas ainda não verificou consumo e preferências.
- **d2-o6 · -2 pontos:** Dá para separar opções de rotina e fim de semana.
  - **Cliente:** A gente gosta de variedade, mas sem desperdício.
  - **Feedback:** Dobrar produtos sem calcular pode desperdiçar dinheiro.
- **d2-o7 · -6 pontos:** Então vocês precisam levar o dobro de produtos.
  - **Cliente:** A gente gosta de variedade, mas sem desperdício.
  - **Feedback:** Dobrar produtos sem calcular pode desperdiçar dinheiro.
- **d2-o8 · -10 pontos:** Quanto mais variedade, maior a chance de todo mundo gostar.
  - **Cliente:** A gente gosta de variedade, mas sem desperdício.
  - **Feedback:** Dobrar produtos sem calcular pode desperdiçar dinheiro.

### d3 — Respeitar tempo e adaptar abordagem

**ANDRÉ:** Estou com pressa porque tenho outra tarefa. Não consigo ficar vendo um catálogo inteiro.

**Ficha de escuta:** Precisa terminar rápido

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d3-o1 · +10 pontos:** Vamos focar nas duas necessidades mais importantes?
  - **Cliente:** Ótimo, quanto mais objetivo melhor.
  - **Feedback:** Você adaptou a abordagem ao tempo real disponível.
- **d3-o2 · +8 pontos:** Posso filtrar só os produtos que combinam com sua família?
  - **Cliente:** Ótimo, quanto mais objetivo melhor.
  - **Feedback:** Você adaptou a abordagem ao tempo real disponível.
- **d3-o3 · +6 pontos:** Você prefere um resumo de opções práticas?
  - **Cliente:** Isso, prefiro poucas opções com sentido.
  - **Feedback:** Você foi objetivo, mas pode combinar limites da conversa.
- **d3-o4 · +4 pontos:** Posso perguntar o orçamento e depois resumir?
  - **Cliente:** Isso, prefiro poucas opções com sentido.
  - **Feedback:** Você foi objetivo, mas pode combinar limites da conversa.
- **d3-o5 · +0 pontos:** Vou priorizar o que tiver utilidade para vocês.
  - **Cliente:** Isso, prefiro poucas opções com sentido.
  - **Feedback:** Você foi objetivo, mas pode combinar limites da conversa.
- **d3-o6 · -2 pontos:** Se não for um bom momento, podemos retomar depois.
  - **Cliente:** Não consigo parar muito tempo hoje.
  - **Feedback:** Exigir mais tempo ignora o contexto do atendimento.
- **d3-o7 · -6 pontos:** Mesmo com pressa, é importante olhar todos os produtos.
  - **Cliente:** Não consigo parar muito tempo hoje.
  - **Feedback:** Exigir mais tempo ignora o contexto do atendimento.
- **d3-o8 · -10 pontos:** Se não tiver uns dez minutos, não consigo ajudar.
  - **Cliente:** Não consigo parar muito tempo hoje.
  - **Feedback:** Exigir mais tempo ignora o contexto do atendimento.

### d4 — Orçamento, desperdício e prioridades

**ANDRÉ:** Este mês está apertado e não quero gastar com coisas que acabam ficando paradas.

**Ficha de escuta:** Controla o orçamento

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d4-o1 · +10 pontos:** Quais itens vocês realmente vão consumir esta semana?
  - **Cliente:** Quero priorizar o que não falta no dia a dia.
  - **Feedback:** Você tratou orçamento e desperdício como restrições concretas.
- **d4-o2 · +8 pontos:** Podemos separar essencial de opcional?
  - **Cliente:** Quero priorizar o que não falta no dia a dia.
  - **Feedback:** Você tratou orçamento e desperdício como restrições concretas.
- **d4-o3 · +6 pontos:** Existe um teto de gasto que não devemos ultrapassar?
  - **Cliente:** Tenho um limite e não quero ultrapassar.
  - **Feedback:** A alternativa pode ajudar, mas depende de confirmar consumo e preço.
- **d4-o4 · +4 pontos:** Se a cesta passar do limite, podemos reduzir sem perder o básico.
  - **Cliente:** Tenho um limite e não quero ultrapassar.
  - **Feedback:** A alternativa pode ajudar, mas depende de confirmar consumo e preço.
- **d4-o5 · +0 pontos:** Vamos avaliar custo por porção, não só por pacote.
  - **Cliente:** Tenho um limite e não quero ultrapassar.
  - **Feedback:** A alternativa pode ajudar, mas depende de confirmar consumo e preço.
- **d4-o6 · -2 pontos:** Podemos comparar itens que resolvam refeições de verdade.
  - **Cliente:** É justamente o excesso que eu quero evitar.
  - **Feedback:** Incentivar gasto extra enfraquece a confiança.
- **d4-o7 · -6 pontos:** Para economizar, é melhor comprar tudo em embalagem maior.
  - **Cliente:** É justamente o excesso que eu quero evitar.
  - **Feedback:** Incentivar gasto extra enfraquece a confiança.
- **d4-o8 · -10 pontos:** Mesmo apertado, vale aproveitar e pagar mais agora.
  - **Cliente:** É justamente o excesso que eu quero evitar.
  - **Feedback:** Incentivar gasto extra enfraquece a confiança.

### d5 — Decisão compartilhada com a família

**ANDRÉ:** Além disso, preciso conversar com minha esposa, porque normalmente decidimos juntos a compra maior.

**Ficha de escuta:** Decide compras com a família

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d5-o1 · +10 pontos:** O que ela costuma considerar antes de escolher os produtos?
  - **Cliente:** Ela olha muito quantidade e preço.
  - **Feedback:** Você respeitou a participação da família na decisão.
- **d5-o2 · +8 pontos:** Quer que eu deixe as informações organizadas para vocês avaliarem?
  - **Cliente:** Ela olha muito quantidade e preço.
  - **Feedback:** Você respeitou a participação da família na decisão.
- **d5-o3 · +6 pontos:** A quantidade precisa funcionar para toda a família, certo?
  - **Cliente:** Um resumo ajuda a conversar sem esquecer nada.
  - **Feedback:** A alternativa mantém a conversa, mas poderia facilitar a próxima etapa.
- **d5-o4 · +4 pontos:** Faz sentido mostrar alternativas sem fechar agora.
  - **Cliente:** Um resumo ajuda a conversar sem esquecer nada.
  - **Feedback:** A alternativa mantém a conversa, mas poderia facilitar a próxima etapa.
- **d5-o5 · +0 pontos:** Podemos anotar preço e porção para facilitar essa conversa.
  - **Cliente:** Um resumo ajuda a conversar sem esquecer nada.
  - **Feedback:** A alternativa mantém a conversa, mas poderia facilitar a próxima etapa.
- **d5-o6 · -2 pontos:** Você prefere confirmar as escolhas com ela depois?
  - **Cliente:** A decisão não é só minha. Não quero ser pressionado.
  - **Feedback:** Pressionar decisão unilateral ignora o funcionamento da família.
- **d5-o7 · -6 pontos:** Mas você também pode decidir sozinho e avisar depois.
  - **Cliente:** A decisão não é só minha. Não quero ser pressionado.
  - **Feedback:** Pressionar decisão unilateral ignora o funcionamento da família.
- **d5-o8 · -10 pontos:** Se pedir opinião de mais alguém, vai acabar perdendo a oportunidade.
  - **Cliente:** A decisão não é só minha. Não quero ser pressionado.
  - **Feedback:** Pressionar decisão unilateral ignora o funcionamento da família.

### d6 — Investigar preferências de todos os consumidores

**ANDRÉ:** Em casa cada um gosta de uma coisa. Tem item que eu acho ótimo, mas meus filhos nem experimentam.

**Ficha de escuta:** Existem preferências diferentes em casa

**Pop-up:** Pop-up de entrada: adequar ao gosto familiar

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d6-o1 · +10 pontos:** O que seus filhos costumam gostar de comer?
  - **Cliente:** Eles gostam de coisas simples e conhecidas.
  - **Feedback:** Você incluiu as preferências de quem realmente vai consumir.
- **d6-o2 · +8 pontos:** Quais tipos de entrada vocês já conhecem e aceitam?
  - **Cliente:** Eles gostam de coisas simples e conhecidas.
  - **Feedback:** Você incluiu as preferências de quem realmente vai consumir.
- **d6-o3 · +6 pontos:** Tem algum ingrediente que alguém da família evita?
  - **Cliente:** Isso. Prefiro confirmar as preferências antes.
  - **Feedback:** A sugestão pode funcionar, mas precisa validar gostos e porções.
- **d6-o4 · +4 pontos:** Que opção poderia ser compartilhada sem desperdício?
  - **Cliente:** Isso. Prefiro confirmar as preferências antes.
  - **Feedback:** A sugestão pode funcionar, mas precisa validar gostos e porções.
- **d6-o5 · +0 pontos:** Podemos pensar em um item que complemente, não substitua, a refeição.
  - **Cliente:** Isso. Prefiro confirmar as preferências antes.
  - **Feedback:** A sugestão pode funcionar, mas precisa validar gostos e porções.
- **d6-o6 · -2 pontos:** Vale consultar as preferências antes de escolher.
  - **Cliente:** Não quero comprar algo que ninguém vai comer.
  - **Feedback:** Ignorar os demais consumidores da família aumenta o risco de sobra.
- **d6-o7 · -6 pontos:** Vou colocar a entrada mais cara, porque é a mais especial.
  - **Cliente:** Não quero comprar algo que ninguém vai comer.
  - **Feedback:** Ignorar os demais consumidores da família aumenta o risco de sobra.
- **d6-o8 · -10 pontos:** Se eles não gostarem, você come o restante sozinho.
  - **Cliente:** Não quero comprar algo que ninguém vai comer.
  - **Feedback:** Ignorar os demais consumidores da família aumenta o risco de sobra.

### d7 — Dimensionamento real de porções

**ANDRÉ:** Agora preciso entender a quantidade do prato principal. Quatro pessoas comem em casa, mas nem sempre no mesmo horário.

**Pop-up:** Pop-up de principal: quantidade por refeições e pessoas

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d7-o1 · +10 pontos:** Você costuma preparar tudo de uma vez ou em porções?
  - **Cliente:** Às vezes preparo duas porções em horários diferentes.
  - **Feedback:** Você dimensionou a indicação considerando pessoas e frequência.
- **d7-o2 · +8 pontos:** Quantos dias pretende usar esse produto?
  - **Cliente:** Às vezes preparo duas porções em horários diferentes.
  - **Feedback:** Você dimensionou a indicação considerando pessoas e frequência.
- **d7-o3 · +6 pontos:** O peso da embalagem permite dividir para quatro?
  - **Cliente:** Quero planejar quantos jantares vai render.
  - **Feedback:** A preocupação é válida, mas ainda exige peso e porções reais.
- **d7-o4 · +4 pontos:** Podemos calcular a quantidade conforme as refeições planejadas.
  - **Cliente:** Quero planejar quantos jantares vai render.
  - **Feedback:** A preocupação é válida, mas ainda exige peso e porções reais.
- **d7-o5 · +0 pontos:** Se houver sobras, é importante armazenar corretamente.
  - **Cliente:** Quero planejar quantos jantares vai render.
  - **Feedback:** A preocupação é válida, mas ainda exige peso e porções reais.
- **d7-o6 · -2 pontos:** Vale considerar quem vai comer e quando.
  - **Cliente:** Prefiro calcular, porque já desperdicei antes.
  - **Feedback:** Chutar o volume aumenta o risco financeiro e de desperdício.
- **d7-o7 · -6 pontos:** Quatro pessoas precisam automaticamente de quatro quilos.
  - **Cliente:** Prefiro calcular, porque já desperdicei antes.
  - **Feedback:** Chutar o volume aumenta o risco financeiro e de desperdício.
- **d7-o8 · -10 pontos:** Leve o maior pacote, mesmo sem saber o consumo.
  - **Cliente:** Prefiro calcular, porque já desperdicei antes.
  - **Feedback:** Chutar o volume aumenta o risco financeiro e de desperdício.

### d8 — Tratamento de objeção de experiência anterior

**ANDRÉ:** Já tive uma experiência ruim com um acompanhamento que não ficou bom. Não quero levar por impulso.

**Pop-up:** Pop-up de acompanhamento: conferir preparo e preferência

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d8-o1 · +10 pontos:** O que não deu certo na preparação da outra vez?
  - **Cliente:** Não gostei da textura depois de preparar.
  - **Feedback:** Você buscou entender a causa antes de sugerir substituição.
- **d8-o2 · +8 pontos:** Vamos conferir modo de preparo e ingredientes antes da escolha?
  - **Cliente:** Não gostei da textura depois de preparar.
  - **Feedback:** Você buscou entender a causa antes de sugerir substituição.
- **d8-o3 · +6 pontos:** Você lembra se o produto era parecido com este?
  - **Cliente:** Prefiro algo que funcione no nosso jeito de cozinhar.
  - **Feedback:** A alternativa é útil, mas falta relacionar ao preparo da família.
- **d8-o4 · +4 pontos:** Posso comparar uma alternativa mais familiar para sua casa.
  - **Cliente:** Prefiro algo que funcione no nosso jeito de cozinhar.
  - **Feedback:** A alternativa é útil, mas falta relacionar ao preparo da família.
- **d8-o5 · +0 pontos:** Se o preparo for complicado, talvez não compense.
  - **Cliente:** Prefiro algo que funcione no nosso jeito de cozinhar.
  - **Feedback:** A alternativa é útil, mas falta relacionar ao preparo da família.
- **d8-o6 · -2 pontos:** Melhor optar por um item que vocês já saibam usar.
  - **Cliente:** Se vão desmerecer minha experiência, prefiro deixar.
  - **Feedback:** Culpar o cliente por uma experiência ruim não resolve a objeção.
- **d8-o7 · -6 pontos:** Isso acontece porque você provavelmente preparou errado.
  - **Cliente:** Se vão desmerecer minha experiência, prefiro deixar.
  - **Feedback:** Culpar o cliente por uma experiência ruim não resolve a objeção.
- **d8-o8 · -10 pontos:** O produto é bom, então não precisa se preocupar com a experiência anterior.
  - **Cliente:** Se vão desmerecer minha experiência, prefiro deixar.
  - **Feedback:** Culpar o cliente por uma experiência ruim não resolve a objeção.

### d9 — Complemento de cesta sem venda forçada

**ANDRÉ:** Se eu levar uma bebida, também preciso ver se faz sentido para todos. Não quero pagar por algo que ninguém toma.

**Pop-up:** Pop-up de bebida: consumo e orçamento

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d9-o1 · +10 pontos:** O que vocês costumam beber nas refeições?
  - **Cliente:** A gente costuma beber suco ou água.
  - **Feedback:** Você avaliou consumo real e preferências antes de complementar a cesta.
- **d9-o2 · +8 pontos:** As quatro pessoas consomem a mesma bebida?
  - **Cliente:** A gente costuma beber suco ou água.
  - **Feedback:** Você avaliou consumo real e preferências antes de complementar a cesta.
- **d9-o3 · +6 pontos:** Já têm bebida suficiente em casa?
  - **Cliente:** Nem todo mundo gosta da mesma coisa.
  - **Feedback:** A sugestão pode servir, mas ainda precisa confirmar quantidades.
- **d9-o4 · +4 pontos:** Se houver preferências diferentes, podemos considerar isso.
  - **Cliente:** Nem todo mundo gosta da mesma coisa.
  - **Feedback:** A sugestão pode servir, mas ainda precisa confirmar quantidades.
- **d9-o5 · +0 pontos:** Podemos escolher quantidade para a família, sem exagerar.
  - **Cliente:** Nem todo mundo gosta da mesma coisa.
  - **Feedback:** A sugestão pode servir, mas ainda precisa confirmar quantidades.
- **d9-o6 · -2 pontos:** Se já houver bebida, melhor não repetir.
  - **Cliente:** Isso, não quero bebida só para completar pedido.
  - **Feedback:** Empurrar um produto sem utilidade enfraquece a proposta.
- **d9-o7 · -6 pontos:** Coloque a bebida mais cara para completar a cesta.
  - **Cliente:** Isso, não quero bebida só para completar pedido.
  - **Feedback:** Empurrar um produto sem utilidade enfraquece a proposta.
- **d9-o8 · -10 pontos:** Qualquer bebida serve, porque todo mundo bebe alguma coisa.
  - **Cliente:** Isso, não quero bebida só para completar pedido.
  - **Feedback:** Empurrar um produto sem utilidade enfraquece a proposta.

### d10 — Encerramento completo com decisão compartilhada

**ANDRÉ:** Gostei da conversa, mas ainda preciso ver isso com minha família antes de fechar.

**Pop-up:** Pop-up de sobremesa: item opcional, sem comprometer limite

**Banco de alternativas do vendedor** (o jogador vê 4 delas, em ordem variável):

- **d10-o1 · +10 pontos:** Claro. Quer um resumo de preço, quantidade e preparo para vocês?
  - **Cliente:** Um resumo vai ajudar bastante.
  - **Feedback:** Você encerrou respeitando a decisão compartilhada e facilitou o próximo passo.
- **d10-o2 · +8 pontos:** Podemos deixar as opções anotadas sem compromisso.
  - **Cliente:** Um resumo vai ajudar bastante.
  - **Feedback:** Você encerrou respeitando a decisão compartilhada e facilitou o próximo passo.
- **d10-o3 · +6 pontos:** Você prefere decidir mais tarde, depois de conversar em casa?
  - **Cliente:** Boa. Assim a gente decide junto sem pressa.
  - **Feedback:** O fechamento foi educado, mas pode ser mais útil com um resumo.
- **d10-o4 · +4 pontos:** O mais importante é que a cesta atenda aos quatro sem ultrapassar o limite.
  - **Cliente:** Boa. Assim a gente decide junto sem pressa.
  - **Feedback:** O fechamento foi educado, mas pode ser mais útil com um resumo.
- **d10-o5 · +0 pontos:** Obrigado pelo tempo. Se precisar, retomamos depois.
  - **Cliente:** Boa. Assim a gente decide junto sem pressa.
  - **Feedback:** O fechamento foi educado, mas pode ser mais útil com um resumo.
- **d10-o6 · -2 pontos:** Posso destacar o que é prioridade e o que é opcional.
  - **Cliente:** Eu avisei que não poderia fechar sozinho hoje.
  - **Feedback:** Pressionar a compra contradiz o acordo familiar explicitado.
- **d10-o7 · -6 pontos:** Depois de escolher cinco categorias, a compra já está praticamente fechada.
  - **Cliente:** Eu avisei que não poderia fechar sozinho hoje.
  - **Feedback:** Pressionar a compra contradiz o acordo familiar explicitado.
- **d10-o8 · -10 pontos:** Você não precisa consultar ninguém; pode decidir agora mesmo.
  - **Cliente:** Eu avisei que não poderia fechar sozinho hoje.
  - **Feedback:** Pressionar a compra contradiz o acordo familiar explicitado.
