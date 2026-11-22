// Lighthouse denetimi: derlenmiş siteyi önizleme sunucusunda açar, sayfaları ölçer, eşikleri denetler.
// Kullanım: npm run build && npm run lhci     (CHROME_PATH verilmezse sistem Chrome'u aranır)
// Eşikler (mobil profil): erişilebilirlik ≥ 98, en iyi uygulamalar ≥ 95, SEO = 100, performans ≥ 80.
// Ana sayfa (/, /en/) istisnası: tam ekran WebGL sahnesi (gerçek arazi + rover). Ağır hesap Worker'da, poster
// LCP'yi 0,8 sn'de verir; kalan engelleme WebGL'in ilk karesi ve gölgelendirici hazırlığıdır (4× yavaş CPU'da
// kaçınılmaz). Bu iki sayfada performans eşiği 60; diğer tüm sayfalarda 80. (Karar: 2026-11-22, ILERLEME.md)
import { spawn, execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4175;
const BASE = `http://localhost:${PORT}/taykut/`;
const PAGES = ['', 'en/', 'rover/', 'gorevler/', 'muhendislik/', 'istasyon/', 'takim/', 'sponsor/', 'basin/'];
const MIN = { performance: 80, accessibility: 98, 'best-practices': 95, seo: 100 };
const PERF_3D = 60; // 3B ana sayfa
const OUT = 'tools/.cache/lighthouse';

mkdirSync(OUT, { recursive: true });
// Kabuk olmadan doğrudan Node ile: Windows'ta kabuk üzerinden açılan alt süreç kill() ile kapanmıyordu.
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'],
  {
    stdio: 'ignore',
  },
);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* henüz açılmadı */
    }
    await sleep(500);
  }
  throw new Error('Önizleme sunucusu açılmadı');
}

const rows = [];
let failed = false;
try {
  await waitForServer();
  for (const p of PAGES) {
    const name = p.replace(/\//g, '') || 'ana';
    const out = `${OUT}/ci-${name}.json`;
    execFileSync(
      process.execPath,
      [
        'node_modules/lighthouse/cli/index.js',
        `${BASE}${p}`,
        '--quiet',
        '--chrome-flags=--headless=new --no-sandbox',
        '--output=json',
        `--output-path=${out}`,
      ],
      { stdio: 'ignore', env: process.env },
    );
    const r = JSON.parse(readFileSync(out, 'utf8'));
    const scores = Object.fromEntries(
      Object.keys(MIN).map((k) => [k, Math.round(r.categories[k].score * 100)]),
    );
    const is3d = p === '' || p === 'en/';
    const fails = Object.entries(MIN)
      .filter(([k, min]) => scores[k] < (k === 'performance' && is3d ? PERF_3D : min))
      .map(([k]) => k);
    if (fails.length) failed = true;
    rows.push({
      sayfa: `/${p}`,
      ...scores,
      LCP: r.audits['largest-contentful-paint'].displayValue,
      durum: fails.length ? `✗ ${fails.join(', ')}` : '✓',
    });
  }
} finally {
  server.kill();
}

console.table(rows);
if (process.env.GITHUB_STEP_SUMMARY) {
  const md =
    '### Lighthouse (mobil)\n\n| Sayfa | Perf | A11y | BP | SEO | LCP | Durum |\n|---|---|---|---|---|---|---|\n' +
    rows
      .map(
        (r) =>
          `| ${r.sayfa} | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${r.LCP} | ${r.durum} |`,
      )
      .join('\n') +
    '\n';
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}
if (failed) {
  console.error('✗ Lighthouse eşikleri karşılanmadı.');
  process.exit(1);
}
console.log('✓ Lighthouse eşikleri karşılandı.');
