(() => {
  'use strict';
  const element = id => document.getElementById(id);
  let widget, challenge = '', loading, busy = false, generation = 0;
  const client = import('./email-client.mjs');
  function status(text, error = false) {
    element('recuperacao-status').textContent = text;
    element('recuperacao-status').className = 'conta-status' + (error ? ' erro' : '');
  }
  function reset() {
    challenge = ''; element('recuperacao-enviar').disabled = true;
    if (widget !== undefined) window.turnstile.reset(widget);
  }
  function fechar() {
    generation++; element('conta-recuperacao').hidden = true;
    element('conta-formulario').hidden = !element('conta-logada').hidden;
    if (widget !== undefined) reset();
  }
  async function abrir(email) {
    const current = ++generation;
    element('conta-recuperacao').hidden = false;
    element('conta-formulario').hidden = true;
    element('conta-status').textContent = '';
    element('recuperacao-email').value = email;
    element('recuperacao-email').focus();
    status('Conclua a verificação para solicitar a recuperação.');
    try {
      const { serviceUrl } = await client;
      const config = window.EPAV_EMAIL_CONFIG;
      if (!serviceUrl(config) || !config.turnstileSiteKey) throw new Error('SERVICE_CONFIG');
      if (widget !== undefined) { reset(); return; }
      if (!loading) loading = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.onload = resolve; script.onerror = () => { script.remove(); loading = null; reject(new Error('CHALLENGE_LOAD')); };
        document.head.append(script);
      });
      await loading;
      if (current !== generation) return;
      widget = window.turnstile.render('#recuperacao-verificacao', {
        // Compact also fits the account dialog after a phone rotates.
        sitekey: config.turnstileSiteKey, action: 'password-reset', size: 'compact',
        callback: token => { challenge = token; element('recuperacao-enviar').disabled = busy; },
        'expired-callback': () => { challenge = ''; element('recuperacao-enviar').disabled = true; },
        'error-callback': () => { challenge = ''; element('recuperacao-enviar').disabled = true; status('Não foi possível verificar. Volte ao acesso e tente novamente.', true); },
      });
    } catch (error) {
      if (current !== generation) return;
      element('recuperacao-enviar').disabled = true;
      status(error.message === 'SERVICE_CONFIG' ? 'O serviço de recuperação ainda não foi configurado.' : 'Não foi possível carregar a verificação. Confira sua conexão e tente novamente.', true);
    }
  }
  element('recuperacao-voltar').onclick = fechar;
  element('recuperacao-formulario').addEventListener('submit', async event => {
    event.preventDefault(); if (!challenge || busy) return;
    const current = generation; busy = true; element('recuperacao-enviar').disabled = true;
    status('Solicitando a recuperação…');
    try {
      const { requestRecovery } = await client;
      const result = await requestRecovery({ config: window.EPAV_EMAIL_CONFIG, email: element('recuperacao-email').value.trim(), challenge });
      if (current === generation) status(result);
    } catch (error) {
      const { recoveryError } = await client;
      if (current === generation) status(recoveryError(error), true);
    } finally { busy = false; if (current === generation) reset(); }
  });
  window.EpavRecovery = { abrir, fechar };
})();
