# Integração dos diálogos EPAV V2 (com IA nos produtos)

## Estado encontrado no repositório
- `js/clientsData.js`: 5 clientes, 40 nós e 4 opções fixas.
- `js/game.js`: lê `no.opcoes`, embaralha e mostra **todas**; contém recuperação artificial em `prepararNo`.
- `js/menu-flow.js`: insere o pop-up nos **últimos 5 nós de cada cliente**.
- `js/products.js`: carrega até 10 produtos reais por categoria e consulta IA na avaliação.
- `js/game.js`: registra cada escolha `{no_id, opcao_id}` no histórico enviado ao avaliador.

## Como incorporar o conteúdo (sem modificar o layout)
1. Faça backup de `js/clientsData.js` e `js/game.js`.
2. Copie `roteiros_epav_versao_ia.js` para `js/` e adicione o `<script src="js/roteiros_epav_versao_ia.js"></script>` **depois** de `js/clientsData.js` e **antes** de `js/game.js` em `index.html`.
3. Em `js/game.js`, no início de `prepararNo(no)` e imediatamente após `registrarDescoberta(no.descoberta);`, adicione:

```js
if (no.epavV2 === true) {
  return {
    texto: no.texto,
    opcoes: window.EpavRoteirosV2.alternativas(no, estado)
  };
}
```

Isso suprime a mecânica artificial de "voltar", mostra só 4 alternativas em A–D, mas mantém 8 registradas por etapa.

4. Para que **o vendedor abra a conversa com seu próprio balão**, em `renderizarNo()`, substitua a chamada final:

```js
digitarTexto(document.getElementById('texto-cliente'), noPreparado.texto, () => prepararEscolhaProduto({ ...no, opcoes: noPreparado.opcoes }));
```

por:

```js
const apresentarCliente = () => digitarTexto(
  document.getElementById('texto-cliente'),
  noPreparado.texto,
  () => prepararEscolhaProduto({ ...no, opcoes: noPreparado.opcoes })
);
if (no.aberturaVendedor && estado.noAtual === 'd1') {
  const balaoVendedor = document.getElementById('balao-vendedor');
  balaoVendedor.hidden = false;
  document.getElementById('nome-vendedor-fala').textContent = estado.nomeVendedor.toUpperCase();
  digitarTexto(document.getElementById('texto-vendedor-fala'),
    personalizarTexto(no.aberturaVendedor), () => {
      temporizadorAvancoDialogo = agendarAcao(() => {
        balaoVendedor.hidden = true;
        apresentarCliente();
      }, 400);
    });
} else apresentarCliente();
```

5. **OBRIGATÓRIO: sincronizar o avaliador da API**: o servidor reconstrói o roteiro oficial para validar `historico[].opcao_id`. Novas opções `d1-o5` a `d1-o8` não pertencem à versão antiga; sem atualizar a validação no Worker, o pop-up pode falhar, ignorar contexto ou avaliar com histórico inconsistente. Versione o contrato entre site e backend e atualize os testes de verificação de históricos.
6. Os cinco pop-ups continuam nos últimos cinco nós de cada cliente. A IA **avalia os produtos e quantidades** e deve receber o histórico atualizado. Não confundir esse serviço com geração de falas do cliente em tempo real.
7. As duas preferências alimentares fictícias estão no texto dos diálogos e no perfil. Confira se a API lê essas informações antes de pontuar produtos.
8. Não atribua margem de contribuição ou massa de margem a produtos sem dados financeiros no catálogo/avaliador. A adequação ao cliente continua sendo prioridade; margem pode ser um critério adicional caso seja enviada de forma confiável pela API.

## Pontuação e encerramentos
- Oito notas por etapa: `10, 8, 6, 4, 0, -2, -6, -10`.
- Apenas uma alternativa de 10 pontos em cada etapa, mas **várias respostas aceitáveis**.
- Quatro alternativas aparecem por vez, sorteadas por faixas e embaralhadas.
- Escolhas muito ruins podem encerrar o atendimento se a satisfação ficar abaixo de 15. Isso não é automático em todo erro.
- Se o jogador estiver fechado, o cliente fica resistente sem oferecer a opção "voltar e tentar de novo".

## Limitações importantes
A extensão não ativa IA geradora de diálogos. Ela oferece mais variação **roteirizada**, preservando a IA existente para a avaliação de produtos. Para respostas de NPC geradas por IA, será preciso um endpoint dedicado, validação de estado e custos/limites separados da Groq do catálogo.
