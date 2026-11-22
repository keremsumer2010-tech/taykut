// Krater sahnesinden referans video (Higgsfield Genjutsu hareket kaynağı). Önce: npm run dev
// node tools/stage/record.mjs → tools/.cache/video/kaynak.mp4 (1280×720, 24 kare/sn)
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:5174/taykut/';
const FPS = 24;
const SECONDS = 14;
const T0 = 0.18;
const T1 = 0.62;
const DIR = 'tools/.cache/video/frames';
rmSync(DIR, { recursive: true, force: true });
mkdirSync(DIR, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`${BASE}?t=${T0}&force3d=1&capture=1`);
await page.waitForSelector('section[data-state="ready"]', { timeout: 120_000 });
await page.waitForTimeout(2500);
await page.addStyleTag({
  content:
    'header, nav, a[href="#main"] { display: none !important; } ' +
    'section[data-state] > :not([class*="canvas"]) { display: none !important; } ' +
    '[class*="canvas"] { transition: none !important; opacity: 1 !important; }',
});
const n = FPS * SECONDS;
const stage = page.locator('section[data-state]');
for (let i = 0; i < n; i++) {
  const u = i / (n - 1);
  const e = u * u * (3 - 2 * u) * 0.25 + u * 0.75; // hafif yumuşak başlangıç/bitiş
  await page.evaluate((t) => globalThis.__craterAt(t), T0 + (T1 - T0) * e);
  await stage.screenshot({ path: `${DIR}/f${String(i).padStart(4, '0')}.png` });
  if (i % 48 === 0) console.log(`kare ${i}/${n}`);
}
await browser.close();
execFileSync(
  'uv',
  [
    'run',
    '--no-project',
    '--with',
    'opencv-python-headless',
    '--with',
    'numpy',
    'python',
    '-c',
    `import cv2,glob
fs=sorted(glob.glob('${DIR}/f*.png'))
im=cv2.imread(fs[0]); h,w=im.shape[:2]
v=cv2.VideoWriter('tools/.cache/video/kaynak.mp4',cv2.VideoWriter_fourcc(*'mp4v'),${FPS},(w,h))
[v.write(cv2.imread(f)) for f in fs]
v.release(); print('video', len(fs), 'kare', w, 'x', h)`,
  ],
  { stdio: 'inherit' },
);
