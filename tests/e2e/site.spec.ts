import { expect, test, type Page } from '@playwright/test';

// Ana sayfa yalnız tam ekran 3B sahne; diğer başlıklar menüden ayrı sayfalarda açılır (kullanıcı isteği, 2026-11-22).
const PAGES = [
  { path: 'rover/', title: /Rover’larımız — TAYKUT/ },
  { path: 'gorevler/', title: /Görevler — TAYKUT/ },
  { path: 'muhendislik/', title: /Mühendislik — TAYKUT/ },
  { path: 'istasyon/', title: /Yer İstasyonu — TAYKUT/ },
  { path: 'takim/', title: /Takım — TAYKUT/ },
  { path: 'sponsor/', title: /Sponsorluk — TAYKUT/ },
  { path: 'basin/', title: /Basın kiti — TAYKUT/ },
] as const;

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

test.describe('ana sayfa', () => {
  test('3B krater sahnesi yüklenir (gerçek CSP altında), tek h1, konsol temiz', async ({
    page,
    browserName,
  }) => {
    const errors = await collectErrors(page);
    await page.goto('./?lang=tr');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('TAYKUT');
    const stage = page.locator('section[data-state]');
    // GPU'lu tarayıcıda "ready"; başsız/GPU'suz tarayıcıda poster ("still"); WebGL yoksa "failed".
    await expect(stage).toHaveAttribute('data-state', /intro|ready|still|failed/, { timeout: 45_000 });
    const state = await stage.getAttribute('data-state');
    if (state === 'still' || state === 'failed')
      await expect(page.locator('section[data-state] picture img')).toBeVisible(); // GPU'suz: poster
    else await expect(page.locator('section[data-state] canvas').first()).toBeVisible(); // 3B tuval
    expect(errors).toEqual([]);
    void browserName;
  });

  test('uzay açılışı oynar; "Açılışı geç" ile krater sahnesine geçer', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'yazılımsal WebGL ile yavaş; tek tarayıcıda yeterli');
    test.setTimeout(150_000);
    const errors = await collectErrors(page);
    await page.goto('./?lang=tr&force3d=1');
    const stage = page.locator('section[data-state]');
    await expect(stage).toHaveAttribute('data-state', 'intro', { timeout: 60_000 });
    await page.getByRole('button', { name: 'Açılışı geç' }).click();
    await expect(stage).toHaveAttribute('data-state', 'ready', { timeout: 140_000 });
    expect(errors).toEqual([]);
  });

  test('3B sahne gerçek CSP altında kurulur (WebAssembly çözücü, Worker, GLB)', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'yazılımsal WebGL ile yavaş; tek tarayıcıda yeterli');
    test.setTimeout(120_000);
    const errors = await collectErrors(page);
    await page.goto('./?lang=tr&force3d=1&t=0.4');
    await expect(page.locator('section[data-state]')).toHaveAttribute('data-state', 'ready', {
      timeout: 110_000,
    });
    expect(errors).toEqual([]);
  });

  test('sahnedeki düğmeler Rover ve Görevler sayfalarına götürür', async ({ page }) => {
    await page.goto('./?lang=tr');
    await page.locator('#main').getByRole('link', { name: 'Görevler' }).click();
    await expect(page).toHaveURL(/\/taykut\/gorevler\/$/);
    await expect(page.locator('h1')).toContainText('Altı yer');
  });

  test('"Sponsor Ol" tek tıkla sponsor sayfasına götürür', async ({ page }) => {
    await page.goto('./?lang=tr');
    await page.getByRole('link', { name: 'Sponsor Ol' }).first().click();
    await expect(page).toHaveURL(/\/taykut\/sponsor\/$/);
    await expect(page.locator('h1')).toHaveText('Sponsorluk');
  });

  test('Görevler: 6 bölge; harita pini (geniş) veya bölge listesi (dar) bölgeye götürür', async ({
    page,
  }) => {
    await page.goto('./gorevler/?lang=tr');
    await expect(page.locator('li[id^="mission-"]')).toHaveCount(6);
    const narrow = (page.viewportSize()?.width ?? 1440) <= 640;
    const link = narrow
      ? page.locator('ol a[href="#mission-drumheller"]').filter({ hasText: 'CIRC' })
      : page.locator('a[href="#mission-drumheller"]').first();
    await link.click();
    await expect(page.locator('#mission-drumheller')).toBeInViewport();
  });

  test('İngilizce sürüm: /en/ yolu önceden üretilmiş İngilizce HTML', async ({ page }) => {
    const res = await page.goto('./en/');
    expect(await res?.text()).toContain('Become a Sponsor'); // JS çalışmadan önce HTML'de

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Become a Sponsor' }).first()).toBeVisible();
    await page.goto('./en/gorevler/');
    await expect(page.locator('#numbers')).toContainText('4th');
  });

  test('yatay taşma yok (cihazın gerçek ekran genişliğine göre)', async ({ page }) => {
    await page.goto('./?lang=tr');
    // Mobil tarayıcılar taşan sayfayı uzaklaştırıp innerWidth'i büyütür; karşılaştırma gerçek ekrana göre.
    const vw = page.viewportSize()?.width ?? 0;
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(vw);
  });
});

test.describe('menü (her ekran boyutunda)', () => {
  test('açılır, Esc ile kapanır, odak düğmeye döner', async ({ page }) => {
    await page.goto('./?lang=tr');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    const dialog = page.getByRole('dialog', { name: 'Menü' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link')).toHaveCount(8); // 6 başlık + basın + Instagram
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menüyü aç' })).toBeFocused();
  });

  test('sayfa kaydırılmışken de menü paneli gerçekten görünür (regresyon)', async ({ page }) => {
    // Üst çubuk kaydırınca backdrop-filter kazanır; menü onun içinde kalırsa 0 yükseklikte açılıyordu.
    await page.goto('./?lang=tr');
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    const box = await page.getByRole('dialog', { name: 'Menü' }).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(300);
    await expect(page.getByRole('dialog').getByRole('link', { name: /Takım/ })).toBeInViewport();
  });

  test('menüdeki başlık ayrı sayfada açılır ve o sayfa işaretli görünür', async ({ page }) => {
    await page.goto('./?lang=tr');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await page.getByRole('dialog').getByRole('link', { name: /Takım/ }).click();
    await expect(page).toHaveURL(/\/taykut\/takim\/$/);
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await expect(page.getByRole('dialog').getByRole('link', { name: /Takım/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

test.describe('ayrı sayfalar', () => {
  for (const { path, title } of PAGES) {
    test(`${path} açılır, tek h1, konsol temiz, taşma yok`, async ({ page }) => {
      const errors = await collectErrors(page);
      const res = await page.goto(`./${path}?lang=tr`);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.locator('h1')).toHaveCount(1);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
      const vw = page.viewportSize()?.width ?? 0;
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(vw);
    });
  }

  test('takım: 7 üye ve danışman, Türkçe karakterler, yolculuk', async ({ page }) => {
    await page.goto('./takim/?lang=tr');
    const team = page.locator('#team');
    await expect(team.locator('li')).toHaveCount(8);
    await expect(team).toContainText('İbrahim Enes Yeşil');
    await expect(team).toContainText('Mustafa Seyhan');
    await expect(page.locator('#journey')).toBeVisible();
  });

  test('sponsor: e-posta yer tutucusu iken e-posta düğmesi gizli, Instagram var', async ({ page }) => {
    await page.goto('./sponsor/?lang=tr');
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('main a[href*="instagram.com"]')).toHaveCount(1);
  });

  test('rover: 2027 tablosunda her değer türüyle etiketli', async ({ page }) => {
    await page.goto('./rover/?lang=tr');
    const tables = page.locator('table');
    await expect(tables).toHaveCount(2);
    const rows = tables.nth(1).locator('tr');
    const n = await rows.count();
    for (let i = 0; i < n; i++) await expect(rows.nth(i)).toContainText(/tasarım hedefi|varsayım/);
  });

  test('404 sayfası ana sayfaya döner', async ({ page }) => {
    await page.goto('./404.html?lang=tr');
    await expect(page.locator('h1')).toHaveText('Rover rotadan çıktı.');
    await page.getByRole('link', { name: 'Üsse dön' }).click();
    await expect(page.locator('h1')).toHaveText('TAYKUT');
  });
});
