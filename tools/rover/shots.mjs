// Model denetim sahnesinin ekran görüntüleri (docs/ilerleme/B07). Önce: npm run dev
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:5174/taykut/tools/rover/viewer.html';
const SHOTS = [
  ['01-duz', 'düz zemin', [1.9, 1.05, 2.1]],
  ['02-basamak-45cm', 'sol 45 cm basamak', [0.6, 0.7, -2.6]],
  ['03-yan-egim', '12° yan eğim + 30° yön', [1.9, 1.05, 2.1]],
  ['04-kaya', 'sağ orta teker altında kaya', [0.2, 0.55, 2.4]],
  ['05-engebeli', 'engebeli', [2.2, 1.3, 1.6]],
];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
let failed = false;
for (const [file, s, cam] of SHOTS) {
  await page.goto(`${BASE}?s=${encodeURIComponent(s)}&cam=${cam.join(',')}`);
  await page.waitForSelector('body[data-ready="1"]');
  await page.waitForTimeout(400);
  const worst = Number(await page.getAttribute('body', 'data-worst-mm'));
  if (!(worst <= 1)) failed = true;
  await page.screenshot({ path: `docs/ilerleme/B07/${file}.jpg`, type: 'jpeg', quality: 72 });
  console.log(`${worst <= 1 ? '✓' : '✗'} ${file}: en büyük fark ${worst} mm`);
}
await browser.close();
if (failed) process.exit(1);
