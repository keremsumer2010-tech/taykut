# Erişilebilirlik ve SEO Kararları

## Otomatik denetimler (CI'da her push)
| Denetim | Araç | Kapsam | Eşik |
|---|---|---|---|
| WCAG 2.2 A/AA kuralları | `@axe-core/playwright` (`tests/e2e/a11y.spec.ts`) | 8 sayfa × 2 dil + açık menü | ciddi/kritik ihlal 0 |
| Kontrast | `tools/check-contrast.mjs` | 21 belirteç çifti | metin ≥ 4.5:1, arayüz ≥ 3:1 |
| Lighthouse (mobil) | `tools/lighthouse-ci.mjs` | 8 sayfa | a11y ≥ 98, BP ≥ 95, SEO 100, perf ≥ 80 |
| Dış kaynak yüklemesi | `tools/check-external.mjs` | tüm HTML/JS/CSS | 0 |
| Klavye ve hareket | e2e | "İçeriğe atla", menü odak tuzağı, reduced-motion | geçmeli |

## Kararlar
- **Önceden üretilmiş HTML:** Her sayfa ve dil derleme anında gerçek HTML olarak üretilir (`src/entry-server.tsx` + `tools/prerender.mjs`); içerik JavaScript olmadan da okunur, ekran okuyucular ve arama motorları ilk yanıtta içeriği görür.
- **Dil URL'de:** `/taykut/…` Türkçe, `/taykut/en/…` İngilizce; `<html lang>`, `hreflang` eşleri ve kanonik adresler sayfa başına. Eski `?lang=en` bağlantıları yönlendirilir.
- **Görünen metin = erişilebilir ad (WCAG 2.5.3):** Dil düğmesinin adı "TR / EN, Dil: English"; harita pinleri "03 CIRC 2027". axe bu kuralı ilk çalıştırmada yakaladı.
- **Başlık hiyerarşisi:** Her sayfada tek `h1`. Bölümler ayrı sayfa olarak açılınca alt başlıklar bir kademe yükselir (h1 → h2).
- **Dokunma hedefleri ≥ 44 px.** Mobilde üst üste binen harita pinleri bağlantı değil, görsel işarettir; gezinme bölge listesinden.
- **Hareket:** `prefers-reduced-motion` altında CSS geçişleri ve smooth scroll kapalı; video HTML'de `autoplay` taşımaz, yalnız hareket azaltma kapalıysa ve ekrana girince JS ile oynar (önceden üretilen HTML'de tarayıcı videoyu JS gelmeden oynatıyordu — düzeltildi).
- **Türkçe büyük harf:** Sayfa `lang="tr"` iken İngilizce teknik adlar `lang="en"` taşır (aksi hâlde "PİXHAWK").
- **Gizlilik:** Çerez yok, harici font/CDN/takip yok, CSP yalnız kendi kaynaklarımız (`tools/prerender.mjs`), görsellerde EXIF yok.

## Bilinen sınırlar
- WebKit/Safari varsayılan olarak Tab ile bağlantılara odaklanmaz (Option+Tab); "İçeriğe atla" klavye testi WebKit'te atlanır.
- Ekran okuyucuyla (NVDA/VoiceOver) elle test yapılmadı — doğrulanmadı.
- CSP'de `style-src 'unsafe-inline'`: React satır içi stil özellikleri için gerekli.
