import { defineConfig, devices } from '@playwright/test';

// BASE_URL verilirse (ör. canlı adres) yerel sunucu açılmaz.
const external = process.env.BASE_URL;
const baseURL = external ?? 'http://localhost:4173/taykut/';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Yerel Windows'ta Akıllı Uygulama Denetimi imzasız Playwright Firefox'unu engelliyor;
    // Firefox testleri CI'da (Linux) çalışır.
    ...(process.env.CI ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }] : []),
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  ...(external
    ? {}
    : {
        webServer: {
          command: 'npm run preview',
          url: 'http://localhost:4173/taykut/',
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }),
});
