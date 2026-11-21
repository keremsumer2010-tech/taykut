import { expect, test } from '@playwright/test';

test('dil değişimi sayfayı yenilemeden metinleri, <html lang> ve başlığı değiştirir', async ({ page }) => {
  await page.goto('./?lang=tr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.getByText('Ankara’da tasarlandı.', { exact: false })).toBeVisible();

  await page
    .getByRole('button', { name: /English/ })
    .first()
    .click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/High School Rover Team/);
  await expect(page.getByText('Designed in Ankara.', { exact: false })).toBeVisible();
  expect(page.url()).toContain('lang=en');

  // Tercih hatırlanır: parametresiz açılışta İngilizce kalır
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
