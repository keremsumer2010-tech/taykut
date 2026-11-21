# TAYKUT Tasarım Sistemi

**Ruh hali:** Görev kontrol + endüstriyel tasarım. Karanlık, sakin, hassas. Az renk, çok ışık.
**Vitrin:** `npm run dev` → http://localhost:5174/taykut/vitrin/ (yalnız geliştirmede; üretim derlemesine girmez).

## 1. Renk

### Kaynak renkler (ölçüldü, 2026-11-21)
| Rol | Hex | Nereden |
|---|---|---|
| Logo laciverti | `#01234A` | `summertech-logo.png`, lacivert piksellerin ağırlıklı ortalaması |
| Logo turuncusu | `#D15B09` | `summertech-logo.png`, turuncu piksellerin ağırlıklı ortalaması |
| TPU tekerlek sarısı | `#E7AD01` | `kaynak/foto/summertech-gunduz-regolit.jpg`, sarı ton aralığındaki 18.554 pikselin medyanı |

### Ölçekler
`tools/design/palette.mjs` her kaynak rengin 50–950 arası 11 tonluk ölçeğini **OKLCH**'de algısal olarak eşit açıklık adımlarıyla üretir ve `src/styles/palette.css` dosyasını yazar (`npm run tokens`). Marka renkleri en yakın adıma **birebir** sabitlenir: `--orange-500 = #D15B09`, `--yellow-300 = #E7AD01`, `--navy-900 = #01234A`. Nötr ölçek lacivert tonunda, çok düşük kromalı "soğuk siyah" bir gri ailesidir.

### Anlamsal belirteçler (`src/styles/tokens.css`)
Bileşenler yalnız anlamsal belirteçleri kullanır:

| Belirteç | Kullanım |
|---|---|
| `--bg`, `--bg-deep` | Site zemini; uzay/yörünge sahneleri |
| `--surface-1/2/3` | Kart, yükseltilmiş panel, seçili alan |
| `--line`, `--line-strong` | Ayırıcı; vurgulu çerçeve ve köşe işaretleri (≥ 3:1) |
| `--text`, `--text-2`, `--text-3` | Ana, ikincil, üçüncül metin (`--text-3` yalnız birim/not) |
| `--accent` | **Logo turuncusu**: eylem çağrıları ("Sponsor Ol"), marka anları |
| `--signal` | **Tekerlek sarısı**: veri vurgusu, HUD değerleri, bölüm numaraları, odak halkası |
| `--brand-navy` | Logo laciverti (derin vurgular) |
| `--ok`, `--warn`, `--danger` | Yalnız durum bildirimi |

**Kural:** Bir ekranda aynı anda en fazla iki vurgu rengi (turuncu = eylem, sarı = veri). Durum renkleri yalnız durum bildirir.

### Kontrast
`npm run check:contrast` 21 anlamsal çifti WCAG 2.2'ye göre denetler (CI'da çalışır). Gövde metni ≥ 4.5:1, büyük metin ve arayüz bileşenleri ≥ 3:1. İlk çalıştırmada `--line-strong` 2.05:1 ile kaldı ve `--neutral-600`'a çekildi.

## 2. Tipografi

| Rol | Font | Neden |
|---|---|---|
| Başlık | **Archivo**, genişlik ekseni %112, 700–800 | Geniş ve ağır harfler endüstriyel/mühendislik karakteri taşıyor; logodaki geniş, köşeli SUMMERTECH harfleriyle aynı aileden duruyor |
| Gövde | **Inter** (değişken) | Ekranda en okunaklı grotesklerden; Türkçe karakterleri sorunsuz |
| Veri/HUD/etiket | **JetBrains Mono** | Sabit genişlikli rakamlar (`tnum`), eğik sıfır (`zero`): değer değişince titremez |

**Karar süreci:** Archivo (geniş) ve Space Grotesk aynı vitrinde Türkçe test cümlesiyle karşılaştırıldı (`docs/ilerleme/B01/font-karsilastirma.png`). Space Grotesk daha "girişim" havasında kaldı; Archivo seçildi, Space Grotesk projeden çıkarıldı.

**Alt kümeleme (`npm run fonts`, `tools/fonts/subset.py`):** @fontsource paketleri Türkçe karakterleri iki dosyaya böler (ı Latin'de; ş, ğ, İ Latin Extended'da) ve Türkçe bir sayfa her fontta iki tam dosya indirir. Betik her parçayı yalnız Türkçe + İngilizce + tipografik işaretlerle alt kümeler ve çakışmayan `unicode-range` ile `src/styles/fonts.css` dosyasını otomatik yazar. Sonuç: toplam font yükü 158 KB (önce ~330 KB), bütçe 180 KB. Vite'ın küçük dosyaları CSS'e gömmesi fontlar için kapatıldı (`assetsInlineLimit`).

**Ölçek:** `--step--2 … --step-7`, `clamp()` ile 360–1440 px arasında akışkan; oran mobilde ~1.2, masaüstünde ~1.25. Hero `TAYKUT` = `--step-7`.

**Türkçe büyük harf kuralı:** Sayfa `lang="tr"` olduğu için `text-transform: uppercase` "i" harfini "İ" yapar (Türkçe için doğru). İngilizce teknik adlar ("Pixhawk") bu yüzden `lang="en"` taşımalıdır; `Tag` bileşeni bunu varsayılan yapar.

## 3. Izgara, boşluk, biçim
- 12 sütun; kenar boşluğu mobil 16 px → masaüstü 32 px (`--gutter`); en fazla içerik genişliği 1440 px; okunabilir satır ≤ 68 karakter.
- 4 px tabanlı boşluk ölçeği `--space-1 … --space-11`; bölüm arası `--section-gap` (6–11 rem).
- Köşeler neredeyse keskin (`--radius-1: 2px`); yuvarlak, "yumuşak" arayüz yok.
- `?grid=1` ile ızgara kaplaması (B03'te bağlanacak).

## 4. İmza: HUD çerçeve dili
`HudFrame`: 1 px çizgi + 8 px köşe işaretleri, isteğe bağlı başlık şeridi (mono, büyük harf), yarı saydam zemin seçeneği. Kartlar, 3D etiketleri ve görev HUD'u aynı dili konuşur. Bölüm başlıkları `01 / ROVER` biçimindedir (numara sinyal sarısı).

## 5. Hareket
Süre belirteçleri `--dur-1 … --dur-5` (120–900 ms), ease'ler `--ease-out-expo`, `--ease-in-out-quart`, `--ease-out-quart`. `prefers-reduced-motion` altında tüm süreler 0.01 ms'e iner ve CSS animasyonları kapanır.

## 6. Bileşenler (`src/components/`)
`Button` (birincil/ikincil/hayalet, bağlantı veya düğme), `HudFrame`, `SectionHeader`, `StatusBadge` (yarıştık/hedef/bir gün/durum; her zaman metinli), `Tag`, `KindNote` (hesaplanan/tahmin/tasarım hedefi), `Stat`, `Divider`, `Logo`, `Icon` (16 ikonluk kendi setimiz: 24 px ızgara, 1.5 px çizgi, kare uçlar).

## 7. Logo
- Kaynak `summertech-logo.png` siyah zeminlidir; lacivert yazı koyu sitede okunmaz.
- **Logonun rengi, oranı ve biçimi değiştirilmez.** `tools/brand/logo_alpha.py` yalnız siyah arka planı şeffaflaştırır: her piksel ölçülen iki marka rengiyle siyahın karışımı olarak çözülür, piksel o marka renginin kendisi + alfa olarak yazılır (renkler birebir, kenar yumuşatması korunur).
- Koyu zeminde her zaman **beyaz plaka** içinde gösterilir (`Logo` bileşeni; dikey pay yüksekliğin %25'i).
- Açık soru: Takımın ayrı bir TAYKUT logosu var mı? Varsa bu bölüm güncellenecek.
