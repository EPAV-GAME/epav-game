import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');

function browser() {
  const requests = [], idle = [];
  class Image {
    set src(value) { this.path = value; requests.push(this); }
    async decode() {}
  }
  const window = { requestIdleCallback: action => idle.push(action) };
  const context = vm.createContext({ window, Image, clientes: [], setTimeout,
    document: { getElementById: () => null } });
  vm.runInContext(read('js/image-assets.js'), context);
  vm.runInContext(read('js/preload-images.js'), context);
  return { requests, idle, api: window.EpavImagens };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('menu loads first; background downloads wait and use at most two slots', async () => {
  const { requests, idle, api } = browser();
  assert.equal(requests.length, 1);
  assert.match(requests[0].path, /optimized\/tela-principal-v2-[a-f0-9]{12}\.webp$/);
  assert.equal(requests[0].fetchPriority, 'high');
  await requests[0].onload();
  await tick();
  assert.equal(requests.length, 1);
  assert.equal(idle.length, 1);
  idle[0]();
  await tick();
  assert.equal(requests.length, 3);
  let complete = false;
  api.prontas.then(() => { complete = true; });
  for (let attempt = 0; !complete && attempt < 100; attempt++) {
    const active = requests.filter(image => image.onload);
    assert.ok(active.length <= 2);
    for (const image of active) await image.onload();
    await tick();
  }
  assert.equal(complete, true);
  assert.ok(requests.every(image => image.path.includes('/optimized/')));
});

test('visible image promotes a pending preload; failures allow a new attempt', async () => {
  const { requests, api } = browser();
  const low = api.carregar('assets/images/cliente1-v2.png');
  const high = api.carregar('assets/images/cliente1-v2.png', { prioridade: 'high' });
  assert.equal(low, high);
  assert.equal(requests.length, 2);
  assert.equal(requests[1].fetchPriority, 'high');
  requests[1].onerror();
  assert.equal(await high, false);
  const retry = api.carregar('assets/images/cliente1-v2.png');
  assert.equal(requests.length, 3);
  await requests[2].onload();
  assert.equal(await retry, true);
});

test('generated assets exist, match their versions, and substantially reduce bytes', () => {
  const manifest = JSON.parse(read('assets/image-manifest.json'));
  let originals = 0, optimized = 0;
  for (const [name, path] of Object.entries(manifest)) {
    const data = fs.readFileSync(new URL(path, root));
    originals += fs.statSync(new URL('assets/images/' + name, root)).size;
    optimized += data.length;
    assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)));
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
  }
  assert.ok(optimized < originals * 0.2);
  for (const path of (read('index.html') + read('css/style.css')).matchAll(/assets\/images\/optimized\/[\w-]+\.webp/g)) {
    assert.ok(fs.existsSync(new URL(path[0], root)), path[0]);
  }
});
