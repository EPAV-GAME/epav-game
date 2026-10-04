# Fechando Negócio — Missão EPAV

Jogo de atendimento consultivo com progresso e histórico locais. O ranking online é opcional: terminar uma partida **não** a publica automaticamente.

## Rodar localmente

1. Copie `.env.example` para `.env` e preencha os dados do app Web do Firebase `epav-game`. O arquivo `.env` não entra no Git.
2. Execute `node scripts/build-firebase-config.mjs` na raiz do projeto.
3. Sirva a pasta por HTTP, por exemplo com `python -m http.server 8000`, e abra `http://localhost:8000`.

O arquivo gerado `js/firebase-config.js` é ignorado pelo Git. Configuração de app Web do Firebase contém identificadores **públicos**, mesmo quando fornecida via GitHub Secrets; no site publicado ela sempre será visível ao navegador. A proteção real depende de Authentication e das regras do Firestore.

## Preparar o Firebase na conta do responsável

O site publicado utiliza o projeto `epav-game`. Na [console do Firebase](https://console.firebase.google.com/), com a conta que será dona da entrega:

1. Confirme que o projeto e o app Web `epav-game` pertencem a essa conta.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**. Em **Settings → Authorized domains**, inclua o domínio de publicação `epav-game.github.io` e `localhost` para testes locais, se necessário.
3. Em **Firestore Database**, crie o banco **`(default)`**, se ainda não existir. Escolha a região com cuidado; ela não pode ser alterada depois.
4. Publique as regras e o índice de desempate deste repositório: `firebase deploy --only firestore --project epav-game` após autenticar o Firebase CLI na conta proprietária. Aguarde o índice ficar pronto antes de abrir o ranking. Não deixe o banco em modo de teste aberto.

O cadastro e login usam e-mail e senha, sem etapa de verificação por e-mail. As regras permitem listar até 25 resultados e escrever somente na posição do próprio usuário autenticado. Cada conta ocupa uma posição; uma nova publicação substitui a anterior. O e-mail nunca é gravado no ranking.

O tempo é contado enquanto a missão está ativa (escritório, diálogo e resumo de atendimento), pausando no menu, em modais e quando a aba fica em segundo plano. Ele é salvo junto com a partida e continua de onde parou quando ela é retomada. O ranking ordena por **mais pontos** e, em empate, por **menos tempo**. Partidas antigas, que não têm tempo registrado, continuam no histórico local, mas precisam ser jogadas novamente para publicação nesta versão. Registros antigos do Firestore sem o campo de tempo não aparecem na nova consulta até serem substituídos por uma publicação atualizada.

## Publicar com GitHub Actions

O workflow `.github/workflows/deploy-pages.yml` monta o site estático no GitHub Pages. Configure estes seis **Repository secrets** no GitHub com os valores do `.env`:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

O build falha se algum valor faltar, evitando publicar um ranking parcialmente configurado. Não coloque senha de usuário, chave de conta de serviço ou credencial de administrador nesses secrets destinados ao navegador.

## Configurar o tempo de atendimento

No repositório do GitHub, acesse **Settings → Secrets and variables → Actions → Variables → New repository variable** e crie `TEMPO_ATENDIMENTO_SEGUNDOS` com um número inteiro positivo em segundos. Por exemplo, `140` corresponde a **2 minutos e 20 segundos** para cada cliente.

Após mudar o valor, execute novamente o workflow de publicação para atualizar o site. Se a variável não estiver definida, o limite padrão é `140` segundos. Os avisos de demora e a expulsão do atendimento acompanham esse limite.

Para testar localmente, adicione `TEMPO_ATENDIMENTO_SEGUNDOS=140` ao `.env` e execute novamente `node scripts/build-firebase-config.mjs`.

## Limite de segurança do ranking

O site é estático e calcula pontos e tempo no navegador. As regras validam login, dono do registro, formato e faixas numéricas, mas **não conseguem comprovar que o jogador realmente fez aquelas escolhas ou levou aquele tempo**. Portanto, um usuário técnico ainda pode falsificar seu resultado. Para um ranking competitivo ou com premiação, será necessário validar partidas em um servidor confiável ou Cloud Functions antes de aceitar os resultados.

## Recuperação de senha

O botão **Esqueci minha senha** na conta do ranking usa o serviço independente [epav-password-reset](https://github.com/EPAV-GAME/epav-password-reset), hospedado no Cloudflare. O jogador informa o e-mail, conclui a verificação Turnstile e solicita o envio. O link recebido abre a página de nova senha do painel EPAV; a senha é alterada diretamente pelo Firebase Authentication.

Defina as repository variables `PASSWORD_RESET_SERVICE_URL` e `TURNSTILE_SITE_KEY` para publicar essa integração. A chave secreta do Turnstile e a senha de app Gmail ficam somente no Worker. A mensagem de confirmação não revela se o e-mail tem conta e não comprova entrega. Não há envio padrão alternativo pelo Firebase.

## Escolha de produtos durante a conversa

Cada cliente possui uma etapa de recomendação: Lucas d3, Marina d5, Rafael d7, Camila d6 e André d7. Nessa etapa, o jogo consulta a API independente [epav-product-evaluator](https://github.com/EPAV-GAME/epav-product-evaluator) e apresenta três alimentos distintos disponíveis no catálogo Firebase, com foto e ficha. O jogador escolhe um produto, informa a quantidade e recebe a avaliação Groq de 0 a 1000 com justificativas. Essa nota aparece como adequação do produto; a pontuação original das respostas continua sendo calculada na escala de 400 pontos.

É necessário entrar ou criar uma conta Firebase para consultar a API. O cronômetro fica parado durante a comparação, autenticação e avaliação. Se o serviço ficar indisponível, o jogador pode tentar novamente ou continuar sem avaliação; o jogo não inventa uma nota. As escolhas anteriores e a avaliação atual são salvas na retomada. Partidas antigas sem histórico detalhado passam a oferecer produtos a partir do próximo atendimento.

O navegador recebe somente campos permitidos da ficha. A conta de serviço Firebase e as chaves Groq ficam no Worker. A busca de produtos e a avaliação são endpoints separados da API; consultar as três opções não consome a Groq. A API reconstruirá o roteiro oficial para validar o histórico enviado pelo jogo.

Verificações: `node --test tests/*.test.mjs`.

## Painel administrativo

O catálogo de produtos agora possui um painel independente em [EPAV Admin](https://epav-game.github.io/epav-admin/), com código em [EPAV-GAME/epav-admin](https://github.com/EPAV-GAME/epav-admin). O painel permite editar nome, disponibilidade e classificações com histórico obrigatório. Os dois sites compartilham o Firebase `epav-game`; mantenha `firestore.rules` sincronizado entre os repositórios antes de publicar regras do banco.

O jogo principal não contém uma área administrativa. Acesse o painel somente pelo endereço independente acima, com uma conta que tenha a custom claim `admin: true` no Firebase Authentication. Nenhuma senha ou chave de conta de serviço faz parte do site ou deste repositório.

As regras permitem consultas de até 100 registros somente a administradores autenticados. O ranking público continua limitado a 25. A permissão deve ser atribuída por uma ferramenta confiável com Firebase Admin SDK; o navegador nunca recebe a chave privada. Publicar no GitHub Pages não publica as regras do Firestore: use o comando de deploy acima quando elas mudarem.

As verificações e o workflow de publicação do painel ficam no repositório `epav-admin`.

## Cache compartilhado

A consulta pública do ranking usa `GET /v1/ranking` na API `epav-product-evaluator`, com cache Redis de até 30 segundos. Publicar continua gravando no Firebase pelas regras existentes; resultados novos aparecem no ranking após a atualização desse cache. O serviço compartilha também categorias de produtos por 15 minutos e fichas de avaliação por 60 segundos, com invalidação pelo admin e pelo bot. Senhas Redis ficam exclusivamente nos segredos do servidor.
