import { expect, test, type Page } from '@playwright/test';

const SECTIONS = ['rover', 'missions', 'numbers', 'engineering', 'station', 'journey', 'team', 'sponsor'];

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

test.describe('ana sayfa', () => {
  test('tüm bölümler var, tek h1, konsol temiz', async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto('./?lang=tr');
    for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('TAYKUT');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('"Sponsor Ol" tek tıkla sponsor bölümüne götürür', async ({ page, isMobile }) => {
    await page.goto('./?lang=tr');
    // Hero'daki birincil düğme her ekran boyutunda görünür.
    await page.getByRole('link', { name: 'Sponsor Ol' }).first().click();
    await expect(page).toHaveURL(/#sponsor$/);
    await expect(page.locator('#sponsor')).toBeInViewport();
    if (!isMobile) await expect(page.locator('header nav').first()).toBeVisible();
  });

  test('6 görev bölgesi; harita pini (masaüstü) veya bölge listesi (mobil) bölgeye götürür', async ({
    page,
    isMobile,
  }) => {
    await page.goto('./?lang=tr');
    await expect(page.locator('li[id^="mission-"]')).toHaveCount(6);
    const link = isMobile
      ? page.locator('ol a[href="#mission-drumheller"]').filter({ hasText: 'CIRC' })
      : page.locator('a[href="#mission-drumheller"]').first();
    await link.click();
    await expect(page.locator('#mission-drumheller')).toBeInViewport();
  });

  test('takım: 7 üye ve danışman, Türkçe karakterler', async ({ page }) => {
    await page.goto('./?lang=tr');
    const team = page.locator('#team');
    await expect(team.locator('li')).toHaveCount(8);
    await expect(team).toContainText('İbrahim Enes Yeşil');
    await expect(team).toContainText('Mustafa Seyhan');
  });

  test('e-posta yer tutucusu iken e-posta düğmesi gizli', async ({ page }) => {
    await page.goto('./?lang=tr');
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('#sponsor a[href*="instagram.com"]')).toHaveCount(1);
  });

  test('İngilizce sürüm', async ({ page }) => {
    await page.goto('./?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Become a Sponsor' }).first()).toBeVisible();
    await expect(page.locator('#numbers')).toContainText('4th');
  });

  test('yatay taşma yok (cihazın gerçek ekran genişliğine göre)', async ({ page }) => {
    await page.goto('./?lang=tr');
    // Mobil tarayıcılar taşan sayfayı uzaklaştırıp innerWidth'i büyütür; bu yüzden
    // karşılaştırma Playwright'ın verdiği gerçek ekran genişliğine (viewportSize) göre yapılır.
    const vw = page.viewportSize()?.width ?? 0;
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(vw);
  });
});

test.describe('mobil menü', () => {
  test.skip(({ isMobile }) => !isMobile, 'yalnız mobil');

  test('açılır, Esc ile kapanır, odak düğmeye döner', async ({ page }) => {
    await page.goto('./?lang=tr');
    const toggle = page.getByRole('button', { name: 'Menüyü aç' });
    await toggle.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menüyü aç' })).toBeFocused();
  });

  test('menü bağlantısı bölüme götürür ve menüyü kapatır', async ({ page }) => {
    await page.goto('./?lang=tr');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await page.getByRole('dialog').getByRole('link', { name: /Takım/ }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL(/#team$/);
  });
});

test.describe('alt sayfalar', () => {
  for (const [path, title] of [
    ['sponsor/', /Sponsorluk — TAYKUT/],
    ['rover/', /Rover’larımız — TAYKUT/],
    ['basin/', /Basın kiti — TAYKUT/],
  ] as const) {
    test(`${path} açılır`, async ({ page }) => {
      const errors = await collectErrors(page);
      const res = await page.goto(`./${path}?lang=tr`);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.locator('h1')).toHaveCount(1);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });
  }

  test('rover sayfasında her tasarım değeri türüyle etiketli', async ({ page }) => {
    await page.goto('./rover/?lang=tr');
    const tables = page.locator('table');
    await expect(tables).toHaveCount(2);
    // 2027 rover tablosundaki her satırda bir tür notu var (ölçüm değil).
    const rows = tables.nth(1).locator('tr');
    const n = await rows.count();
    for (let i = 0; i < n; i++) await expect(rows.nth(i)).toContainText(/tasarım hedefi|varsayım/);
  });

  test('404 sayfası', async ({ page }) => {
    await page.goto('./404.html?lang=tr');
    await expect(page.locator('h1')).toHaveText('Rover rotadan çıktı.');
    await page.getByRole('link', { name: 'Üsse dön' }).click();
    await expect(page.locator('h1')).toHaveText('TAYKUT');
  });
});
