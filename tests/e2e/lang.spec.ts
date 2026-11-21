import { expect, test } from '@playwright/test';

test('dil değişimi diğer dilin aynı sayfasına gider; <html lang> ve başlık doğru', async ({ page }) => {
  await page.goto('./sponsor/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await page
    .getByRole('button', { name: /English/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/taykut\/en\/sponsor\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Sponsorship — TAYKUT/);
  await page
    .getByRole('button', { name: /Türkçe/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/taykut\/sponsor\/$/);
});

test('eski ?lang=en bağlantısı yeni /en/ yoluna yönlendirilir', async ({ page }) => {
  await page.goto('./takim/?lang=en');
  await expect(page).toHaveURL(/\/taykut\/en\/takim\/$/);
  await expect(page.locator('h1')).toContainText('Seven people');
});

test('içerik JavaScript olmadan da HTML’de (önceden üretim)', async ({ request }) => {
  const res = await request.get('./');
  const html = await res.text();
  expect(html).toContain('<h1');
  expect(html).toContain('Ankara’da tasarlandı.');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('application/ld+json');
});
