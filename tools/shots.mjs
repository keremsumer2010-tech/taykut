// Belirli sayfaların masaüstü/tablet/mobil ekran görüntülerini alır (ilerleme kanıtı için).
// Kullanım: node tools/shots.mjs <çıktı-klasörü> <url> [url...]
//   örn.  node tools/shots.mjs docs/ilerleme/B01 http://localhost:5174/taykut/vitrin/
// Seçenekler (ortam değişkeni): FULL=1 tam sayfa, ONLY=desktop|tablet|mobile
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const [outDir, ...urls] = process.argv.slice(2);
if (!outDir || urls.length === 0) {
  console.error('Kullanım: node tools/shots.mjs <çıktı-klasörü> <url> [url...]');
  process.exit(1);
}

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};
const only = process.env.ONLY;
const full = process.env.FULL === '1';

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const url of urls) {
  const slug =
    new URL(url).pathname
      .replace(/^\/taykut\/?/, '')
      .replace(/\/$/, '')
      .replace(/[^\w-]+/g, '-') || 'ana';
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    if (only && only !== name) continue;
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => globalThis.document.fonts.ready);
    const file = join(outDir, `${slug}-${name}.png`);
    await page.screenshot({ path: file, fullPage: full });
    console.log(`✓ ${file}`);
    await page.close();
  }
}
await browser.close();
