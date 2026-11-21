# B14 — Görev Kontrol HUD'u

## Hedef
Görev bölgelerinde ekranın kenarlarında beliren, gerçek bir rover yer istasyonunun sakin ve hassas dilini taşıyan, **gerçekten hesaplanmış** telemetri gösteren arayüz. Hiçbir sayı rastgele değildir.

## Önkoşullar
B13 bitti.

## Çıktılar
- `src/hud/Hud.tsx` (kök), `HudMissionCard.tsx` (sol üst), `HudMinimap.tsx` (sağ üst), `HudTelemetry.tsx` (sol alt), `HudObjectives.tsx` (sağ alt), `HudCameraFeed.tsx` (isteğe bağlı ön kamera penceresi), `HudToasts.tsx` ("TEKER BOŞTA", "HEDEFE VARILDI")
- `src/hud/telemetry.ts`: pozdan telemetri türetme (saf fonksiyonlar)
- `src/lib/geo.ts`: WGS84 ↔ ECEF ↔ ENU (testli; HUD koordinatı ve küre pinleri bunu kullanır)
- `tests/unit/telemetry.test.ts`, `geo.test.ts`

## Telemetri tanımları (hepsi pozdan/rotadan türetilir)
| Alan | Hesap | Birim/biçim |
|---|---|---|
| Hız | ds/dt'nin sinematik karşılığı: rotada tanımlı hız profili (görev olaylarında 0) | m/s, 2 ondalık |
| Yön | yaw → pusula derecesi (kuzey referanslı, bölge ENU'sundan) | °, 3 hane |
| Pitch / Roll | gövde pozundan | °, 1 ondalık, işaretli |
| Rocker sol/sağ | gövdeye göre | °, 1 ondalık |
| Bogie sol/sağ (6 tekerlekte) | rocker'a göre | °, 1 ondalık |
| Eğim | arazi eğimi (rover altında) | %, tam sayı |
| Konum | yerel ENU → WGS84 (Mars'ta Mars koordinatı ve "MARS" etiketi) | 4 ondalık derece |
| Yükseklik | heightfield + meta kot | m |
| Kat edilen yol | rota yay uzunluğu | m |
| Batarya | rota boyunca enerji modeli (kütle, eğim ve hızdan basit güç tahmini) → yüzde | %, **"SİM"** etiketli |
| Sinyal | üsse mesafe ve görüş hattına (arazi engeli) göre basit model | çubuk, **"SİM"** etiketli |
| UTC / yerel saat | gerçek saat; bölgenin saat dilimi | hh:mm:ss |

## Tasarım
- HudFrame dili (B01): 1 px çizgiler, köşe işaretleri, monospace tabular rakamlar, büyük harf etiketler, yarı saydam koyu zemin.
- Değerler değişirken titremez: sabit genişlik, rakam kaydırma animasyonu yok (sadece değer değişir), birimler soluk renkte.
- Mini harita: arazinin üstten görünüşü (hillshade önizlemesi) + kontur çizgileri (shader veya önceden üretilmiş SVG), rota çizgisi (geçilen kısım dolu, kalan kesikli), rover oku, hedef işaretleri, ölçek çubuğu, kuzey oku.
- Eğim göstergesi: küçük yapay ufuk (pitch/roll), rocker açılarını gösteren mini yan şema (B06 SVG şekillerinden türetilmiş canlı çizim) — bu, süspansiyonun çalıştığını sayısal olarak da kanıtlar.
- Görev maddeleri: olaylar gerçekleştikçe ✓, şu anki madde vurgulu.
- Kamera penceresi (ultra/high): rover ön kamerasından ikinci render (256×144, düşük kare hızı 15 fps), tarama çizgisi + hafif balıkgözü + zaman damgası.
- `C` tuşu ile temiz mod; mobilde HUD sadeleşir (sadece görev kartı ve 3 telemetri değeri; diğerleri açılır panelde).
- Giriş/çıkış animasyonu: çizgiler köşelerden uzayarak çizilir (200–320 ms), reduced-motion'da anında.

## Kabul testleri
- `telemetry.test.ts`: düz zeminde pitch/roll/rocker 0; bilinen yokuşta pitch ve eğim tutarlı; enerji modeli monoton azalıyor; `geo.ts` bilinen noktalar (Ankara, Drumheller) < 1 cm gidiş-dönüş hatası.
- E2E: HUD değerleri sayısal, NaN/Infinity yok, makul aralıkta.
- Okunabilirlik: HUD metni kontrastı ≥ 4.5:1 (en kötü arka plan karesinde ölç).
- HUD açıkken FPS düşüşü ≤ %5.

## Eleştiri listesi
- Gerçek bir yer istasyonu operatörü bu ekranı görünce ciddiye alır mı?
- Ekranın ortası (rover) hiçbir zaman HUD tarafından kapatılıyor mu?
- Fazla bilgi mi var? Her değer bir şey anlatıyor mu? Anlatmayanı kaldır.
- "SİM" etiketleri dürüstlüğü sağlıyor mu?

## Bitiş raporu
Ekran görüntüleri (masaüstü/mobil), test çıktıları.
