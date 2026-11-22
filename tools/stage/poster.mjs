// Ana sayfa sahnesinin poster karesi (GPU'suz cihazlarda ve sahne yüklenirken görünür).
// Sahnenin kendisinden alınır: ?t=0.40 (yandan takip çekimi), yazı ve panel gizli.
// Önce: npm run dev   Sonra: node tools/stage/poster.mjs   (çıktı public/media/stage-poster*.webp)
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:5174/taykut/';
const SHOTS = [
  { name: 'stage-poster', viewport: { width: 1600, height: 956 }, scale: 1 },
  { name: 'stage-poster-mobile', viewport: { width: 390, height: 844 }, scale: 2 },
];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu'],
});
for (const s of SHOTS) {
  const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.scale });
  await page.goto(`${BASE}?t=0.40&force3d=1`);
  await page.waitForSelector('section[data-state="ready"]', { timeout: 120_000 });
  await page.waitForTimeout(2500); // kanvas solma geçişi bitsin
  await page.addStyleTag({
    content:
      'header, nav, a[href="#main"] { display: none !important; } ' +
      'section[data-state] > :not(picture):not([class*="canvas"]) { display: none !important; } ' +
      'section[data-state] picture { display: none !important; }',
  });
  const png = `tools/.cache/${s.name}.png`;
  await page.locator('section[data-state]').screenshot({ path: png });
  execFileSync('python', [
    '-c',
    `from PIL import Image; Image.open(r'${png}').convert('RGB').save(r'public/media/${s.name}.webp', quality=78, method=6)`,
  ]);
  console.log(`✓ public/media/${s.name}.webp`);
  await page.close();
}
await browser.close();
