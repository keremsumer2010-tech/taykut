# B04 — Medya Hattı: Fotoğraf ve Video

## Hedef
Gerçek saha fotoğraflarının ("Render değil, gerçek toz") en iyi biçimde, en küçük boyutta ve sitenin renk diline uyumlu sunulması. Tekrarlanabilir hat: ham dosya → tek komut → optimize setler.

## Önkoşullar
B03 bitti.

## Girdiler
- `kaynak/foto/summertech-gunduz-regolit.jpg` (1200×1600, dikey)
- `kaynak/foto/summertech-gece-ahtapot-tutucu.jpg` (1600×1200, yatay)
- `taykut-site/public/media/`: `rover-day.webp`, `rover-night.webp`, `rover-aruco.webp`, `digital-twin.webp`, `ground-station.mp4`, `ground-station-poster.webp`, `og.jpg`, `summertech-logo.png` → **kopyala** `kaynak/` altına (orijinale dokunma).
- Kullanıcı ileride yeni fotoğraf ekleyecek: hat `kaynak/foto/` klasörüne atılan her dosyayı otomatik işlemeli.

## Çıktılar
- `tools/media/build_media.mjs` (`sharp` + `ffmpeg`)
- `tools/media/media.config.json`: her görsel için odak noktası (`focus: [x, y]` 0..1), kırpma oranları, renk derecelendirme seviyesi, alt metin anahtarı
- `public/media/<ad>-<genişlik>.avif|webp` (640, 960, 1280, 1920; kaynak boyutunu aşmadan)
- `public/media/<ad>-lqip.txt` (base64 20 px bulanık önizleme) veya CSS içinde gömülü
- `src/components/Picture.tsx`: `<picture>` + `srcset` + `sizes` + LQIP + `loading="lazy"` (hero hariç) + `decoding="async"` + doğru `width/height` (CLS 0)
- `public/media/ground-station-{720,1080}.mp4` + poster
- `npm run assets:media`

## Adımlar
1. **Envanter:** Tüm kaynakları listele (boyut, oran, renk profili). Tekrarlayanları (aynı kare farklı biçim) bul, en iyi kaynağı seç.
2. **Renk yönetimi:** Hepsini sRGB'ye çevir, EXIF yönünü uygula, EXIF/GPS meta verisini **sil** (gizlilik).
3. **Renk derecelendirme:** Hafif ve tutarlı: gölgelerde çok hafif soğuk ton, vurgularda koruma, doygunluk −5…−10, kontrast +5. Sarı tekerleklerin rengi bozulmamalı (imza renk). Ayarları `media.config.json`'da tut; abartma. Önce/sonra karşılaştırmasını `docs/ilerleme/B04/` altına kaydet.
4. **Akıllı kırpma:** Her görsel için odak noktası (rover'ın merkezi). Hero için 16:9 ve 4:5 kırpımlar; kartlar için 4:3. Dikey gündüz fotoğrafından yatay kırpımda rover kadrajda kalmalı.
5. **Kodlama:** AVIF (kalite ~50, efor 6), WebP (kalite ~78). Boyut hedefi: 1280 px AVIF ≤ 140 KB.
6. **Video:** H.264 High, CRF 24–26, `-movflags +faststart`, sessiz (ses izi kaldır), 720p ve 1080p. Poster karesi videonun en anlamlı anından. Kısa döngü için başlangıç ve bitiş karesi uyumlu.
7. **`Picture` bileşeni:** `sizes` değerleri düzene göre gerçekçi (ör. hero `100vw`, kart `(min-width: 1024px) 33vw, 100vw`). Hero görseli `fetchpriority="high"` + preload.
8. **Uygulama:** B03'teki tüm `<img>` kullanımlarını `Picture` ile değiştir. Gece fotoğrafını Hero'da değil "Gece ve Enerji" görev bölümünde ve Inspect'te kullan; gündüz fotoğrafı Hero ve MRC bölümünde.
9. **OG görseli:** 1200×630, rover + TAYKUT yazısı + küçük logo; `tools/media/og.mjs` ile üretilir (sharp + SVG kaplama). TR ve EN sürümleri.

## Kabul testleri
- `npm run assets:media` temiz bir klasörde baştan sona çalışıyor, ikinci çalışmada değişmeyen dosyaları atlıyor (önbellek hash'i).
- Çıktılarda EXIF/GPS yok (`exiftool` veya sharp metadata kontrolü testi).
- Lighthouse: "Properly size images" ve "Next-gen formats" uyarısı yok; CLS ≤ 0.02.
- Toplam medya yükü ilk ekranda ≤ 350 KB.

## Eleştiri listesi
- Derecelendirilmiş fotoğraflar gerçekliğini koruyor mu, yoksa "filtreli" mi görünüyor?
- Rover her kırpımda okunaklı mı? Kafasını kesen kırpım var mı?
- Mobilde gereksiz büyük görsel iniyor mu? (Ağ panelinden ölç.)
- Sarı tekerlek rengi tüm görsellerde tutarlı mı?

## Yapma
- Görsellere yapay zekâ ile öğe eklemek veya değiştirmek (gerçeklik ilkesi).
- Kaynak dosyaları silmek.

## Bitiş raporu
Görsel başına boyut tablosu (önce/sonra), önce/sonra karşılaştırma görselleri.
