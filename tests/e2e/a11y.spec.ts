import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Her sayfa, iki dilde: ciddi ve kritik erişilebilirlik ihlali olmamalı (WCAG 2.2 A/AA kuralları).
const PATHS = [
  '',
  'rover/',
  'gorevler/',
  'muhendislik/',
  'istasyon/',
  'takim/',
  'sponsor/',
  'basin/',
  '404.html',
];

for (const lang of ['', 'en/']) {
  for (const p of PATHS) {
    test(`axe: /${lang}${p || ''}`, async ({ page }) => {
      await page.goto(`./${lang}${p}`);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        serious.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(' '))
              .slice(0, 3)
              .join(' | ')}`,
        ),
      ).toEqual([]);
    });
  }
}

test('menü açıkken de ihlal yok', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Menüyü aç' }).click();
  const results = await new AxeBuilder({ page }).include('#site-menu').analyze();
  expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});

test('hareket azaltma: video otomatik oynamaz, smooth scroll kapalı', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('./istasyon/');
  const state = await page.evaluate(() => {
    const v = document.querySelector('video');
    return {
      autoplay: v?.hasAttribute('autoplay') ?? false,
      paused: v?.paused ?? true,
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  expect(state.autoplay).toBe(false);
  expect(state.paused).toBe(true);
  expect(state.scroll).toBe('auto');
  await ctx.close();
});

test('klavye: "İçeriğe atla" ilk Tab ile görünür ve ana içeriğe götürür', async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(isMobile, 'dokunmatik cihazda klavye yok');
  // Safari/WebKit varsayılan olarak Tab ile bağlantılara odaklanmaz (Option+Tab gerekir); site hatası değil.
  test.skip(browserName === 'webkit', 'WebKit: Tab bağlantıları atlar (tarayıcı varsayılanı)');
  await page.goto('./');
  await page.waitForLoadState('networkidle'); // hydrate bitsin
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'İçeriğe atla' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
