# B00 — Temel: İskelet, Araçlar, CI/CD, GitHub Pages

## Hedef
Sonraki 23 bölümün üzerine kurulacağı, hiç sallanmayan bir temel. Bu bölüm bittiğinde `https://keremsumer2010-tech.github.io/taykut/` adresinde TAYKUT adını gösteren sade bir sayfa canlı olacak. Her push'ta tip kontrolü, test, derleme ve bütçe denetimi otomatik çalışacak; kırmızı derleme yayına çıkmayacak.

## Önkoşullar
- `PROMPT_TAYKUT_SITE.md` okundu.
- Depo: `keremsumer2010-tech/taykut`, dal `main`, yerel `Kerem Sumer CV\taykut`. Git kimliği depo içinde noreply adresle ayarlı (değiştirme).
- Node kurulu (v26). `gh` oturumu açık.

## Girdiler
- Anayasadaki `tech_stack`, `architecture`, `repo_conventions`, `performance_budget`.

## Çıktılar (dosya düzeyinde)
- `package.json`, `package-lock.json`, `.nvmrc`, `tsconfig.json` (+ `tsconfig.node.json`), `vite.config.ts`, `eslint.config.js`, `.prettierrc`, `.editorconfig`, `.gitattributes` (`* text=auto eol=lf`, ikili dosyalar `binary`)
- `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/base.css` (geçici minimum)
- `vitest.config.ts`, `tests/unit/smoke.test.ts`
- `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
- `tools/budget.mjs`, `tools/check-filesize.mjs`, `budget.config.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- `.claude/launch.json` (`taykut-dev` 5173, `taykut-preview` 4173)
- `docs/ILERLEME.md`, `docs/VARLIKLAR.md` (başlık + tablo şablonu), `docs/ICERIK_KAYNAKLARI.md` (şablon), `docs/MIMARI.md` (iskelet)
- `public/favicon.svg` (geçici: TAYKUT baş harfi, logo gelene kadar), `public/robots.txt`

## Adımlar
1. **Sürüm keşfi:** `npm view` ile react, react-dom, three, @react-three/fiber, @react-three/drei, vite, typescript, vitest, @playwright/test sürümlerini ve peer bağımlılıklarını oku. Uyumlu en güncel kararlı seti seç (fiber 9 → React 19). Seçimi ve nedenini `docs/ILERLEME.md`'ye yaz. Bu bölümde sadece temel paketleri kur; 3D paketleri B09'da kurulur.
2. **Vite + React + TS strict:** `vite.config.ts` içinde `base: '/taykut/'`, `build.target: 'es2022'`, `build.sourcemap: true`, çok sayfalı giriş için hazır yapı (`rollupOptions.input`: şimdilik sadece `index.html`). Yol takma adı `@/` → `src/`.
3. **TypeScript:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`. `any` yasak (eslint kuralı).
4. **ESLint + Prettier:** typescript-eslint, react-hooks, jsx-a11y kuralları. `npm run lint` hatasız.
5. **Vitest:** jsdom ortamı, `tests/unit/` altında örnek test.
6. **Playwright:** Chromium, WebKit, Firefox projeleri; `webServer` olarak `vite preview` (base yolu dahil). `smoke.spec.ts`: sayfa açılır, başlık "TAYKUT" içerir, konsol hatası 0, 404 isteği 0.
7. **Bütçe betiği:** `tools/budget.mjs` derleme çıktısını tarar, gzip boyutlarını hesaplar, `budget.config.json` sınırlarıyla karşılaştırır (ilk JS ≤ 250 KB gzip vb.), tablo basar, aşılırsa `exit 1`. `tools/check-filesize.mjs`: depoda 15 MB'tan büyük dosya varsa hata.
8. **npm betikleri:** `dev`, `build` (`tsc -b && vite build`), `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `budget`, `check:size`. Henüz yazılmayan varlık betikleri için yer tutucu ekleme; ilgili bölümde eklenir.
9. **CI (`ci.yml`):** push ve PR'da: checkout → setup-node (`.nvmrc`, npm önbelleği) → `npm ci` → typecheck → lint → test → build → budget → check:size → Playwright (tarayıcılar önbellekli) → başarısız testte rapor artifact olarak yüklenir.
10. **Deploy (`deploy.yml`):** sadece `main` push'unda ve CI başarılıysa (`workflow_run` veya aynı iş akışında `needs`). `actions/configure-pages`, `actions/upload-pages-artifact` (`dist`), `actions/deploy-pages`. `permissions: pages: write, id-token: write`. `concurrency: pages`.
11. **Pages'i aç:** `gh api -X POST repos/keremsumer2010-tech/taykut/pages -f build_type=workflow` (zaten açıksa `PUT` ile `build_type=workflow`). Canlı adresi doğrula.
12. **Geçici sayfa:** Siyah zemin, ortada "TAYKUT" ve "Yakında" yazısı, sistem fontu. Tasarım B01'de gelir; burada sadece hattı kanıtlıyoruz.
13. **SPA değil, çok sayfa:** 404 için `public/404.html` geçici sürümü.
14. **README:** kurulum, betikler, CI ve yayın akışı.

## Kabul testleri
- `npm ci && npm run typecheck && npm run lint && npm run test && npm run build && npm run budget && npm run check:size` yerelde hatasız (çıktıyı rapora ekle).
- `npm run test:e2e` üç tarayıcıda yeşil.
- GitHub Actions: CI ve Deploy yeşil (`gh run list` çıktısı).
- `curl -sI https://keremsumer2010-tech.github.io/taykut/` → 200. Sayfada "TAYKUT" görünüyor (Playwright ile canlı adrese karşı tek test).
- Dev sunucusu `.claude/launch.json` ile açılıyor, konsol temiz.

## Eleştiri listesi
- Yeni bir öğrenci README'yi okuyup 10 dakikada projeyi çalıştırabilir mi?
- CI süresi makul mü (< 6 dk)? Önbellekler çalışıyor mu?
- Kırmızı test yayına sızabilir mi? (Deneyerek kanıtla: geçici olarak bozuk test commit'le, deploy'un çalışmadığını gör, sonra geri al. Bu denemeyi ayrı bir dalda yap.)
- `base` yolu yüzünden kırılan bir varlık yolu var mı?
- Satır sonları (CRLF/LF) karışıklığı kalmadı mı?

## Yapma
- 3D, tasarım veya içerik işine girme.
- Gereksiz paket kurma (ör. Tailwind, UI kütüphanesi).
- Uyumsuz peer bağımlılığını `--legacy-peer-deps` ile zorlama.

## Bitiş raporu
Seçilen paket sürümleri tablosu, CI süreleri, canlı adres, kabul testi çıktıları.
