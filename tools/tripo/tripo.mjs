// Tripo3D API v3 istemcisi (yalnız varlık üretimi; site çalışırken Tripo'ya istek atılmaz).
// Anahtar: .env.local içinde TRIPO_API_KEY (depoya girmez).
//
//   node tools/tripo/tripo.mjs balance
//   node tools/tripo/tripo.mjs multiview <çıktı.glb> front=a.png left=b.png back=c.png right=d.png
//   node tools/tripo/tripo.mjs image <çıktı.glb> <foto.png>
//   node tools/tripo/tripo.mjs text <çıktı.glb> "<tarif>"
//
// Ham çıktı tools/.cache/tripo/ altına yazılır; siteye girmeden önce ölçek/eksen hizalama ve
// meshopt optimizasyonundan geçer. Her görevin girdisi ve kredi harcaması yanına .json olarak kaydedilir.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { basename, dirname } from 'node:path';

const BASE = 'https://openapi.tripo3d.ai/v3';
const MODEL = 'v3.1-20260211';
const KEY =
  process.env.TRIPO_API_KEY ??
  (existsSync('.env.local')
    ? readFileSync('.env.local', 'utf8')
        .match(/^TRIPO_API_KEY=(.+)$/m)?.[1]
        ?.trim()
    : undefined);
if (!KEY) {
  console.error('✗ TRIPO_API_KEY yok (.env.local).');
  process.exit(1);
}
const auth = { Authorization: `Bearer ${KEY}` };

async function api(path, init = {}) {
  const res = await fetch(BASE + path, { ...init, headers: { ...auth, ...init.headers } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.code !== 0) {
    throw new Error(`Tripo ${path}: HTTP ${res.status} ${JSON.stringify(body)}`);
  }
  return body.data;
}
const post = (path, json) =>
  api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json),
  });

async function upload(file) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(file)]), basename(file));
  const { file_token } = await api('/files', { method: 'POST', body: form });
  console.log(`  ↑ ${file} → ${file_token}`);
  return file_token;
}

async function waitTask(id) {
  for (;;) {
    const t = await api(`/tasks/${id}`);
    process.stdout.write(`\r  ${t.status} %${t.progress ?? 0}   `);
    if (t.status === 'success') {
      process.stdout.write('\n');
      return t;
    }
    if (['failed', 'cancelled', 'banned', 'expired'].includes(t.status)) {
      throw new Error(`görev ${t.status}: ${t.error_code} ${t.error_message ?? ''}`);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
}

async function run(out, body) {
  const { balance } = await api('/account/balance');
  console.log(`Bakiye: ${balance} kredi`);
  const { task_id } = await post(body.endpoint, body.json);
  console.log(`Görev ${task_id}`);
  const t = await waitTask(task_id);
  // model_url 5 dk içinde geçersizleşir: hemen indir
  const url = t.output?.pbr_model_url ?? t.output?.model_url;
  if (!url) throw new Error(`çıktıda model yok: ${JSON.stringify(t.output)}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
  if (t.output.rendered_image_url) {
    const img = await fetch(t.output.rendered_image_url);
    writeFileSync(out.replace(/\.glb$/, '.preview.webp'), Buffer.from(await img.arrayBuffer()));
  }
  writeFileSync(
    out.replace(/\.glb$/, '.task.json'),
    JSON.stringify({ request: body.json, task: { ...t, output: Object.keys(t.output) } }, null, 2),
  );
  console.log(`✓ ${out} (${t.credits_consumed ?? '?'} kredi)`);
}

const OPTS = {
  model: MODEL,
  texture: true,
  pbr: true,
  texture_quality: 'detailed',
  geometry_quality: 'detailed',
};
const [cmd, out, ...rest] = process.argv.slice(2);
if (cmd === 'balance') {
  console.log(await api('/account/balance'));
} else if (cmd === 'multiview') {
  const inputs = [];
  for (const a of rest) {
    const [view, file] = a.split('=');
    inputs.push({ [view]: await upload(file) });
  }
  await run(out, { endpoint: '/generation/multiview-to-model', json: { inputs, ...OPTS } });
} else if (cmd === 'image') {
  await run(out, { endpoint: '/generation/image-to-model', json: { input: await upload(rest[0]), ...OPTS } });
} else if (cmd === 'text') {
  await run(out, { endpoint: '/generation/text-to-model', json: { prompt: rest.join(' '), ...OPTS } });
} else {
  console.error('Kullanım: balance | multiview | image | text (dosya başındaki açıklamaya bakın)');
  process.exit(1);
}
