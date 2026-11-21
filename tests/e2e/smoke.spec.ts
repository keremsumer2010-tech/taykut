import { expect, test } from '@playwright/test';

test('ana sayfa açılır, konsol ve ağ temiz', async ({ page }) => {
  const consoleErrors: string[] = [];
  const failed: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });

  await page.goto('./');
  await expect(page).toHaveTitle(/TAYKUT/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TAYKUT');
  await page.waitForLoadState('networkidle');

  expect(consoleErrors, 'konsol hataları').toEqual([]);
  expect(failed, '400+ yanıtlar').toEqual([]);
});

test('mobilde yatay taşma yok', async ({ page }) => {
  await page.goto('./');
  const vw = page.viewportSize()?.width ?? 0;
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(vw);
});
