# B01 — Tasarım Sistemi

## Hedef
TAYKUT'a özgü, "görev kontrol + endüstriyel tasarım" ruhunda, tutarlı ve ölçülü bir tasarım sistemi. Bütün site, 3D sahneler dahil, bu sistemin renk, tipografi, boşluk ve hareket belirteçlerini kullanacak. Bir ödül jürisi tek bir ekran görüntüsünden "bu bir sistem" diyebilmeli.

## Önkoşullar
B00 bitti, CI yeşil.

## Girdiler
- Logo: `Kerem Sumer CV\summertech-logo.png` (oranı ve rengi asla değişmez). TAYKUT'a ayrı logo yoksa bu kullanılır (açık soru 7).
- Fotoğraflar: `kaynak/foto/*.jpg`, `taykut-site/public/media/*.webp` (renk paleti referansı).
- Anayasa: `visual_language`, `copywriting`.

## Çıktılar
- `src/styles/tokens.css`: renk, tipografi, boşluk, yarıçap, gölge, z-index, hareket (süre ve ease) belirteçleri
- `src/styles/base.css`, `src/styles/typography.css`, `src/styles/grid.css`
- `src/components/`: `Button` (birincil, ikincil, hayalet; mıknatıs efekti B21'de), `SectionHeader` (`01 / ROVER` biçimi), `Kicker`, `StatCounter` (animasyonsuz sürüm), `Card`, `Tag`, `Divider` (köşe işaretli), `HudFrame` (1 px çizgi + köşe işaretleri), `LangSwitch`, `Nav`, `Footer` iskeleti, `Icon` (kendi SVG seti: ok, dış link, ses, dil, menü, kapat, oynat, Instagram, e-posta, indir)
- `src/pages/_vitrin` → `vitrin/index.html` (sadece geliştirmede derlenir): tüm belirteçler ve bileşenler tek sayfada
- `tools/check-contrast.mjs`: belirteç çiftlerinin WCAG kontrastını hesaplar
- `docs/TASARIM.md`: kullanım kuralları ve örnekler
- Fontlar: `@fontsource` paketleri

## Adımlar
1. **Logo analizi:** `summertech-logo.png`'yi Python/Pillow ile oku, baskın renkleri k-means ile çıkar (3–5 renk), hex değerlerini `docs/TASARIM.md`'ye yaz. Vurgu rengini (`--accent`) buradan seç. Fotoğraflardaki sarı TPU tekerlek rengi (`#E8C21A` civarı, ölçerek bul) ikinci vurgu adayıdır; tekerlek sarısı "imza renk" olarak çok güçlü. Seçimi gerekçesiyle yaz.
2. **Renk sistemi:** Anayasadaki temel paleti başlangıç al. Her rengin 50–950 arası 10 tonluk ölçeğini OKLCH ile üret (eşit algısal adımlar). Anlamsal belirteçler: `--bg`, `--surface-1/2/3`, `--line`, `--line-strong`, `--text`, `--text-2`, `--text-3`, `--accent`, `--accent-contrast`, `--hud`, `--warn`, `--danger`, `--ok`. Sadece koyu tema (site karanlık kimlikli); `color-scheme: dark`.
3. **Kontrast:** `check-contrast.mjs` tüm metin/zemin çiftlerini test etsin: gövde metni ≥ 4.5:1, büyük metin ≥ 3:1, arayüz çizgileri ≥ 3:1. CI'a ekle.
4. **Tipografi:**
   - Başlık fontu için iki adayı (Space Grotesk, Archivo geniş kesim) aynı vitrinde yan yana göster. Türkçe karakter testi cümlesi: "Ağır yükü çeken ışıklı gövde, şişmiş öğütücü İzmir'e." Karar ver, gerekçesini yaz. Seçmediğini kaldır.
   - Gövde: Inter (değişken). HUD/sayı: JetBrains Mono (tabular rakamlar `font-variant-numeric: tabular-nums`).
   - Akışkan tip ölçeği: `clamp()` ile 8 kademe (−1…6), oran masaüstünde 1.25, mobilde 1.2. Satır yükseklikleri başlıkta 0.95–1.05, gövdede 1.55.
   - Harf aralığı: büyük başlıklarda hafif negatif, kicker ve HUD etiketlerinde pozitif ve büyük harf.
   - Sadece Latin + Latin Extended alt kümesi; `font-display: swap`; kritik iki font dosyası preload.
5. **Izgara ve boşluk:** 4 px tabanlı boşluk ölçeği (4…160). 12 sütunlu ızgara; masaüstü kenar boşluğu 32 px, mobil 16 px; maksimum içerik genişliği 1440 px; okunabilir metin sütunu ≤ 68 karakter.
6. **Hareket belirteçleri:** `--ease-out-expo`, `--ease-in-out-quart`, süreler (120, 200, 320, 560, 900 ms). `prefers-reduced-motion` altında tüm süreler 0.01 ms'e iner (genel kural, B05'te denetlenir).
7. **Bileşenler:** Her bileşen erişilebilir (rol, odak halkası, klavye). Odak halkası: 2 px `--accent` dış çizgi + 2 px boşluk. Düğmelerde dokunma alanı ≥ 44 px.
8. **HUD dili:** `HudFrame` bileşeni: 1 px çizgi, 8 px köşe işaretleri, isteğe bağlı başlık şeridi, yarı saydam koyu zemin, `backdrop-filter: blur(8px)` sadece destekleniyorsa. Bu dil sitenin her yerinde (kartlar, etiketler, HUD) tekrar eder.
9. **İkonlar:** 24 px ızgarada, 1.5 px çizgi, köşeler kare uçlu. Hepsi kendi çizimin (SVG). Instagram ikonu marka kurallarına uygun sade biçim.
10. **Logo kullanımı:** `Logo` bileşeni: koyu zeminde okunmuyorsa beyaz plaka içinde, en az boşluk payı logo yüksekliğinin %25'i. Logo yeniden çizilmez, renkleri değiştirilmez.
11. **Vitrin sayfası:** Tüm renk ölçekleri, tip ölçeği, bileşen durumları (normal, hover, odak, devre dışı), HUD çerçeveleri, ikonlar. Üretim derlemesine girmez.

## Kabul testleri
- `check-contrast.mjs` tüm çiftlerde geçiyor (çıktı tablosu rapora).
- Vitrin sayfası üç tarayıcıda Playwright ekran görüntüsü (masaüstü + mobil).
- Türkçe karakterler tüm fontlarda doğru (ekran görüntüsünde göz kontrolü + glif varlık testi: `document.fonts.check`).
- Bileşenlerin klavye testleri (Tab ile odak görünüyor).
- Font yükü toplam ≤ 180 KB (woff2).

## Eleştiri listesi
- Bu sistem başka bir rover takımının sitesine de uyar mı? Uyuyorsa yeterince özgün değil; TAYKUT imzasını (tekerlek sarısı, köşe işaretleri, `01 /` numaralandırma) güçlendir.
- Ekranda üçten fazla vurgu rengi aynı anda görünüyor mu? Azalt.
- HUD dili "oyun arayüzü" gibi mi duruyor? Daha sakin ve mühendislik çizimi gibi yap.
- Tipografi ölçeği mobilde taşma yapıyor mu?
- Yatay ritim (boşluklar) tutarlı mı?

## Yapma
- Hazır UI kütüphanesi, Tailwind, gradyan bolluğu, neon parlama, cam efekti bolluğu.
- Logoyu yeniden renklendirmek veya kırpmak.

## Bitiş raporu
Seçilen renkler (hex + OKLCH), font kararı ve gerekçesi, kontrast tablosu, vitrin ekran görüntüleri.
