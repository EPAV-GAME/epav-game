// Apenas o SDK público do Firebase. Permissões são conferidas nas regras do banco.
import { selecionarResultados, resumirResultados, gerarCsv, formatarTempo } from './admin-data.mjs';

const el = id => document.getElementById(id);
let servicos;
let registros = [];
let cursor = null;
let mais = false;
let carregando = false;
let sessao = 0;
const tamanhoPagina = 100;

function status(texto, erro = false) {
  el('admin-status').textContent = texto;
  el('admin-status').classList.toggle('erro', erro);
}

function erroUsuario(erro) {
  const mensagens = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'Confira o endereço de e-mail.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed': 'Não foi possível conectar. Confira sua internet.',
    'auth/operation-not-allowed': 'O acesso por e-mail e senha está indisponível.',
    'permission-denied': 'O acesso aos resultados foi recusado. Confira a permissão de administrador e as regras do banco.',
    'unavailable': 'Os resultados estão indisponíveis. Tente atualizar novamente.',
    'CONFIG_AUSENTE': 'A conexão não foi configurada. Gere a configuração do Firebase antes de abrir o painel.',
    'SEM_PERMISSAO': 'Esta conta não tem permissão de administrador. Entre com uma conta autorizada.'
  };
  return mensagens[erro.code || erro.message] || 'Não foi possível concluir a operação. Tente novamente.';
}

function controles() {
  el('admin-atualizar').disabled = carregando;
  el('admin-mais').disabled = carregando;
  el('admin-mais').hidden = !mais;
  el('admin-exportar').disabled = carregando || !visiveis().length;
}

function visiveis() { return selecionarResultados(registros, el('admin-busca').value, el('admin-ordem').value); }

function renderizar() {
  const resumo = resumirResultados(registros);
  el('admin-total').textContent = resumo.total;
  el('admin-media').textContent = resumo.total ? resumo.media.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '—';
  el('admin-melhor').textContent = resumo.total ? resumo.melhor : '—';
  el('admin-satisfacao').textContent = resumo.total ? `${Math.round(resumo.satisfacao)}%` : '—';
  const selecionados = visiveis();
  const fragmento = document.createDocumentFragment();
  for (const r of selecionados) {
    const linha = document.createElement('tr');
    const valores = [r.nome || 'Sem nome', r.pontos ?? '—', Number.isFinite(r.qualidadeQuartos) ? (r.qualidadeQuartos / 4).toLocaleString('pt-BR') : '—', Number.isFinite(r.satisfacao) ? `${r.satisfacao}%` : '—', formatarTempo(r.tempoJogadoMs), r.classificacao || '—', r.publicadoMs ? new Date(r.publicadoMs).toLocaleString('pt-BR') : '—'];
    for (const valor of valores) {
      const celula = document.createElement('td');
      celula.textContent = String(valor);
      linha.append(celula);
    }
    fragmento.append(linha);
  }
  el('admin-linhas').replaceChildren(fragmento);
  el('admin-contagem').textContent = `${selecionados.length} resultado(s) exibido(s) de ${registros.length} carregado(s)${mais ? ' · há mais resultados para carregar' : ''}.`;
  el('admin-vazio').hidden = selecionados.length > 0;
  el('admin-vazio').textContent = registros.length ? 'Nenhum jogador corresponde à busca.' : 'Ainda não há resultados publicados. Eles aparecerão quando os jogadores confirmarem a publicação no ranking.';
  controles();
}

function limpar() {
  sessao++;
  registros = [];
  cursor = null;
  mais = false;
  carregando = false;
  el('admin-painel').hidden = true;
  el('admin-acesso').hidden = false;
  el('admin-identidade').textContent = '';
  renderizar();
}

async function carregar(reiniciar = false) {
  if (carregando || !servicos.auth.currentUser || el('admin-painel').hidden) return;
  const atual = sessao;
  carregando = true;
  controles();
  status('Carregando resultados…');
  try {
    const token = await servicos.authSdk.getIdTokenResult(servicos.auth.currentUser, true);
    if (atual !== sessao) return;
    if (token.claims.admin !== true) throw new Error('SEM_PERMISSAO');
    const f = servicos.firestoreSdk;
    const filtros = [f.orderBy(f.documentId()), f.limit(tamanhoPagina)];
    if (!reiniciar && cursor) filtros.push(f.startAfter(cursor));
    const resposta = await f.getDocsFromServer(f.query(f.collection(servicos.db, 'ranking'), ...filtros));
    if (atual !== sessao) return;
    const novos = resposta.docs.map(doc => ({ ...doc.data(), id: doc.id, publicadoMs: doc.data().publicadoEm?.toMillis?.() || 0 }));
    const acumulados = new Map((reiniciar ? [] : registros).map(r => [r.id, r]));
    novos.forEach(r => acumulados.set(r.id, r));
    registros = [...acumulados.values()];
    cursor = resposta.docs.at(-1) || null;
    mais = resposta.size === tamanhoPagina;
    renderizar();
    status(`Consulta atualizada às ${new Date().toLocaleTimeString('pt-BR')}.`);
  } catch (erro) {
    if (atual !== sessao) return;
    if (erro.message === 'SEM_PERMISSAO' || erro.code === 'permission-denied') {
      limpar();
      await servicos.authSdk.signOut(servicos.auth).catch(() => {});
    }
    status(erroUsuario(erro), true);
  } finally {
    if (atual === sessao) { carregando = false; controles(); }
  }
}

el('admin-form').addEventListener('submit', async evento => {
  evento.preventDefault();
  el('admin-entrar').disabled = true;
  status('Conferindo acesso…');
  try {
    await servicos.authSdk.signInWithEmailAndPassword(servicos.auth, el('admin-email').value.trim(), el('admin-senha').value);
  } catch (erro) { status(erroUsuario(erro), true); }
  finally { el('admin-senha').value = ''; el('admin-entrar').disabled = false; }
});
el('admin-sair').addEventListener('click', async () => {
  el('admin-sair').disabled = true;
  try { await servicos.authSdk.signOut(servicos.auth); status('Você saiu da conta.'); }
  catch (erro) { status(erroUsuario(erro), true); }
  finally { el('admin-sair').disabled = false; }
});
el('admin-atualizar').addEventListener('click', () => carregar(true));
el('admin-mais').addEventListener('click', () => carregar());
el('admin-busca').addEventListener('input', renderizar);
el('admin-ordem').addEventListener('change', renderizar);
el('admin-exportar').addEventListener('click', () => {
  if (el('admin-painel').hidden) return;
  const url = URL.createObjectURL(new Blob(['\ufeff', gerarCsv(visiveis())], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `epav-resultados-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

async function iniciar() {
  try {
    const config = window.EPAV_FIREBASE_CONFIG;
    if (!config?.apiKey || !config.projectId || !config.appId) throw new Error('CONFIG_AUSENTE');
    const base = 'https://www.gstatic.com/firebasejs/12.18.0';
    const [appSdk, authSdk, firestoreSdk] = await Promise.all([import(`${base}/firebase-app.js`), import(`${base}/firebase-auth.js`), import(`${base}/firebase-firestore.js`)]);
    const app = appSdk.initializeApp(config);
    const auth = authSdk.getAuth(app);
    auth.languageCode = 'pt';
    await authSdk.setPersistence(auth, authSdk.browserSessionPersistence);
    servicos = { auth, authSdk, firestoreSdk, db: firestoreSdk.getFirestore(app) };
    // A renovação forçada é feita antes de cada consulta. Observar apenas a sessão
    // evita um ciclo de renovação de token durante o carregamento.
    authSdk.onAuthStateChanged(auth, async usuario => {
      limpar();
      const atual = sessao;
      if (!usuario) { status('Entre com sua conta de administrador.'); return; }
      try {
        const token = await authSdk.getIdTokenResult(usuario, true);
        if (atual !== sessao) return;
        if (token.claims.admin !== true) {
          await authSdk.signOut(auth);
          status(erroUsuario(new Error('SEM_PERMISSAO')), true);
          return;
        }
        el('admin-acesso').hidden = true;
        el('admin-painel').hidden = false;
        el('admin-identidade').textContent = usuario.email || 'Administrador';
        el('painel-titulo').focus();
        await carregar(true);
      } catch (erro) { if (atual === sessao) status(erroUsuario(erro), true); }
    });
    el('admin-entrar').disabled = false;
  } catch (erro) { status(erroUsuario(erro), true); }
}
iniciar();
