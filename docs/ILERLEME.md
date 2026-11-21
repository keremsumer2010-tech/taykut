# İlerleme Günlüğü

En yeni bölüm en üstte. Her bölüm: plan, yapılanlar, ölçümler, sapmalar, doğrulanmayanlar.

---

## B00 — Temel (2026-11-21)

**Plan:** Vite + React + TypeScript strict iskeleti, ESLint/Prettier, Vitest, Playwright, bütçe ve dosya boyutu denetimi, CI + GitHub Pages yayını. Doğrulama: yerel komutlar + CI yeşil + canlı adres 200.

### Seçilen sürümler (2026-11-21, `npm view` ile doğrulandı)
| Paket | Sürüm | Not |
|---|---|---|
| react / react-dom | 19.3.1 | `@react-three/fiber` 9 peer: `react >=19 <19.4` |
| vite | 8.3.8 | |
| @vitejs/plugin-react | 6.3.0 | peer `vite ^8` |
| typescript | **6.0.3** | En güncel 7.0.2 ama `typescript-eslint` 8.73 peer `>=4.8.4 <6.1.0` istiyor |
| eslint / @eslint/js | **9.39.5** | En güncel 10.x ama `eslint-plugin-jsx-a11y` 6.10.2 peer en fazla `^9` |
| typescript-eslint | 8.73.0 | |
| eslint-plugin-react-hooks | 7.1.1 | |
| vitest / jsdom | 5.1.1 / 31.0.1 | |
| @playwright/test | 1.65.1 | |
| Node | 26 (`.nvmrc`) | Kasım 2026 itibarıyla LTS |
| GitHub Actions | checkout v7, setup-node v7, cache v6, upload-artifact v7, upload-pages-artifact v5, deploy-pages v5 | `gh api .../releases/latest` ile doğrulandı |

### Sapmalar (prompttan farklı kararlar ve nedenleri)
- **Tek iş akışı:** Prompt `ci.yml` + `deploy.yml` diyordu. Bunun yerine `ci.yml` içinde `deploy` işi `needs: check` ile bağlandı. Kırmızı testin yayına çıkmasını yapısal olarak imkânsız kılıyor ve ayrı `workflow_run` tetiklemesinden daha basit.
- **Firefox yerelde yok:** Bu bilgisayarda Windows Akıllı Uygulama Denetimi imzasız Playwright Firefox'unu engelliyor (`spawn UNKNOWN`). Güvenlik ayarına dokunulmadı. Firefox projesi yalnız CI'da (`process.env.CI`) çalışır.
- **`baseUrl` kaldırıldı:** TypeScript 6'da kullanımdan kalktı; `paths` tek başına kullanılıyor.

### Ölçümler (yerel)
- typecheck ✓ · lint ✓ · birim test 1/1 ✓ · e2e 6/6 ✓ (chromium, webkit, mobil)
- İlk yük (gzip): 67.0 KB / sınır 250 KB · dist toplam 1.21 MB (kaynak haritaları dahil)

### Doğrulanmayanlar
- (CI ve canlı adres sonuçları yayından sonra eklenecek.)
