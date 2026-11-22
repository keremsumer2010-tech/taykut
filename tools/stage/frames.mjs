// Krater sahnesinden yazısız kareler (video üretimi için referans paketi).
// Önce: npm run dev   Sonra: node tools/stage/frames.mjs  → tools/.cache/video/ref/scene-*.png
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:5174/taykut/';
const TIMES = [0.05, 0.12, 0.22, 0.3, 0.36, 0.42, 0.47, 0.53, 0.58, 0.62, 0.68, 0.75, 0.8, 0.95];
const OUT = 'tools/.cache/video/ref';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu'],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
for (const t of TIMES) {
  await page.goto(`${BASE}?t=${t}&force3d=1`);
  await page.waitForSelector('section[data-state="ready"]', { timeout: 120_000 });
  await page.waitForTimeout(2200);
  await page.addStyleTag({
    content:
      'header, nav, a[href="#main"] { display: none !important; } ' +
      'section[data-state] > :not([class*="canvas"]) { display: none !important; }',
  });
  await page
    .locator('section[data-state]')
    .screenshot({ path: `${OUT}/scene-${String(t).replace('.', '')}.png` });
  console.log('✓', t);
}
await browser.close();
