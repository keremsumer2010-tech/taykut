# İlerleme Günlüğü

En yeni bölüm en üstte. Her bölüm: plan, yapılanlar, ölçümler, sapmalar, doğrulanmayanlar.

---

## B01 — Tasarım Sistemi (2026-11-21)

**Plan:** Renkleri logodan ve fotoğraftan ölç, OKLCH ölçekleri ve anlamsal belirteçler kur, kontrastı betikle denetle; fontları seç ve Türkçe için alt kümele; ızgara/boşluk/hareket belirteçleri; bileşenler ve ikonlar; vitrin sayfası. Doğrulama: kontrast betiği, tip/lint/test, üç ekran boyutunda görüntü, font bütçesi. Ayrıntılar: `docs/TASARIM.md`.

### Yapılanlar
- Ölçülen renkler: logo laciverti `#01234A`, logo turuncusu `#D15B09`, tekerlek sarısı `#E7AD01`. Turuncu = eylem, sarı = veri/HUD.
- `tools/design/palette.mjs` (OKLCH ölçekleri, marka renkleri birebir sabit) + `tools/design/color.mjs` (dönüşüm ve WCAG; birim testli).
- `tools/check-contrast.mjs`: 21 çift, CI adımı eklendi.
- Fontlar: Archivo (geniş) / Inter / JetBrains Mono; `tools/fonts/subset.py` ile Türkçe alt kümeleme ve otomatik `fonts.css`.
- Bileşenler: Button, HudFrame, SectionHeader, StatusBadge, Tag, KindNote, Stat, Divider, Logo, Icon (16 ikon).
- `tools/brand/logo_alpha.py`: logonun yalnız siyah arka planı şeffaf (renkler birebir).
- `tools/shots.mjs`: üç ekran boyutunda ekran görüntüsü aracı.
- Vitrin: `/taykut/vitrin/` (yalnız geliştirme).

### Ölçümler
- Kontrast: 21/21 ✓ (en düşük gövde metni çifti: turuncu metin kart üstünde 4.70:1).
- Font yükü: 6 dosya, 158.4 KB / 180 KB (alt kümeleme öncesi ~330 KB).
- İlk yük (gzip): 69.7 KB / 250 KB; CSS 3.1 KB gzip.
- Birim test 4/4 ✓.

### Mükemmellik turları
1. **Tur 1 bulguları:** (a) `--line-strong` 2.05:1 → `--neutral-600` (3.3:1). (b) Türkçe sayfada büyük harf İngilizce adları bozuyor ("--LİNE") → `Tag` varsayılan `lang="en"`, kural TASARIM.md'ye yazıldı. (c) Font karşılaştırmasında `.t-display` sınıfı adayı eziyordu, karşılaştırma yanıltıcıydı → düzeltilip yeniden bakıldı. (d) Latin-ext font aralığı latin ile çakışıyordu → çakışmasız aralıklar. (e) Vite küçük font parçalarını CSS'e gömüyordu → `assetsInlineLimit` ile kapatıldı.
2. **Tur 2 bulguları (mobil 375 px):** (a) vitrindeki renk ölçeği 13 px yatay taşma yapıyordu → `minmax(0, 1fr)`. (b) `.grid` satır aralığı yoktu, mobilde kartlar birbirine yapışıyordu → `row-gap` eklendi. (c) İkon kutuları eşit yükseklikte değildi → düzeltildi.
3. **Tur 3:** Masaüstü/tablet/mobil yeniden çekildi; düzeltilecek yeni kusur bulunmadı.

### Eleştiri listesi cevapları
- *Başka bir rover takımına da uyar mı?* İmza öğeleri TAYKUT'a özgü: logodan gelen turuncu, kendi tekerleklerinden gelen sarı, köşe işaretli HUD dili, `01 /` numaralandırma, geniş Archivo başlıklar. Gerçek kompozisyonla (B03) yeniden değerlendirilecek.
- *Üçten fazla vurgu?* Hayır: turuncu (eylem) + sarı (veri); durum renkleri yalnız durumda.
- *HUD dili oyun arayüzü gibi mi?* Neon/parlama yok, 1 px çizgi ve mono etiketler; mühendislik çizimi tonunda.

### Doğrulanmayanlar
- Kritik font preload'u henüz yok (gerçek sayfa düzeni B03'te kurulunca eklenecek).
- Vitrin yalnız Chromium'da gözle kontrol edildi.

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

### CI ve yayın
- GitHub Actions çalıştırması `44932029434`: `check` ✓ (Firefox dahil 8/8 e2e) → `deploy` ✓. Toplam 1 dk 43 sn (hedef < 6 dk).
- `https://keremsumer2010-tech.github.io/taykut/` → HTTP 200; smoke testleri canlı adrese karşı (chromium + mobil) 4/4 ✓.

### Mükemmellik turu
- **Kırmızı test yayına sızabilir mi?** Hayır: `deploy` işi `needs: check` ile bağlı, `check` içindeki herhangi bir adım kırılırsa `deploy` hiç başlamaz. Bu yapısal bir garanti olduğu için ayrı dalda bozuk test denemesi yapılmadı (dal push'ları zaten yayınlamaz, deneme bir şey kanıtlamazdı).
- **`base` yolu:** favicon, 404 dönüş linki ve derlenen varlıklar `/taykut/` önekiyle çalışıyor (canlı testte 400+ yanıt yok).
- **Satır sonları:** `.gitattributes` `eol=lf`; B01 commit'inde `git add --renormalize` ile eski dosyalar da düzeltilecek.

### Doğrulanmayanlar
- Firefox yerelde çalıştırılamıyor (Akıllı Uygulama Denetimi); yalnız CI'da doğrulandı.
