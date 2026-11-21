# B11 — Arazi Veri Hattı (DEM → Heightmap Paketleri)

## Hedef
Gerçek dünyadan, açık lisanslı yükseklik verisinden, tekrarlanabilir ve doğrulanmış arazi paketleri üretmek. Bu bölüm tamamen veri mühendisliğidir: kaynak bulma, lisans, CRS, kesme, temizleme, nicemleme, doğrulama, belgeleme.

## Önkoşullar
B06 bitti (heightfield formatı tanımlı).

## Çıktılar
- `tools/terrain/requirements.txt` (rasterio, numpy, pyproj, Pillow, scipy, pyyaml) ve kurulum notu (Python sanal ortamı, `tools/.venv`, `.gitignore`'da)
- `tools/terrain/build_terrain.py`, `tools/terrain/fetch_sources.py`, `tools/terrain/validate_terrain.py`
- `tools/terrain/regions/<id>.yaml` (6 bölge)
- `public/terrain/<id>/`: `height.png` (16-bit gri), `height_lo.png` (257², fizik), `normal.ktx2`, `mask.ktx2` (malzeme maskeleri: R kaya, G toprak/kum, B kar, A ıslaklık/koyuluk), `meta.json`, `preview.webp` (gölgelendirilmiş önizleme)
- `docs/VARLIKLAR.md` bölge satırları; `docs/ARAZI.md` (hat belgesi)
- `npm run assets:terrain`

## Bölge kaynakları
| id | Kaynak | Çözünürlük | Lisans/atıf | Not |
|---|---|---|---|---|
| drumheller | NRCan HRDEM DTM 1 m (`Rover_Dijital_Ikiz/terrain/raw/hrdem/drumheller_1stave_dtm_1m.tif`, yerelde var) | 1 m | OGL-Canada 2.0 | CIRC lidar arşivini **kullanma** |
| alps | swissALTI3D (swisstopo, açık veri) | 0.5–2 m | © swisstopo | Yarışma sahası bilinmiyorsa temsili Alp yamacı; "temsili" diye belgelenir |
| utah | USGS 3DEP 1 m (Hanksville / MDRS çevresi) | 1 m | Kamu malı (USGS) | |
| mars | NASA HiRISE DTM (Jezero) | ~1 m | Kamu malı, atıf: NASA/JPL-Caltech/University of Arizona | Mars yarıçapı ve yerel metre ölçeği dikkat |
| ankara | Copernicus GLO-30 | 30 m | Copernicus atıf metni | Düşük çözünürlük: yakın detayı prosedürel gürültüyle zenginleştir ve bunu belgele |
| mrc2026 | Prosedürel (gürültü + krater damgaları + çakıl alanları) | — | Kendi üretimimiz | Gerçek saha konumu gelirse değişir |

## Adımlar
1. **Kaynak edinme (`fetch_sources.py`):** Her bölge için resmi indirme yolunu araştır ve **gerçek, çalışan** URL'yi betiğe yaz (uydurma URL yasak). STAC/API varsa kullan (ör. swisstopo STAC, USGS TNM API, Copernicus AWS açık veri kovası). Giriş/hesap gerektiren kaynakta dur ve kullanıcıya hangi dosyanın nereden indirileceğini söyle. İndirilen ham dosyalar `tools/.cache/terrain/` altında; SHA-256 kaydı.
2. **Bölge tanımı (`regions/<id>.yaml`):** merkez (enlem/boylam), kesit boyutu (varsayılan 1024 m; Ankara 4096 m), çıktı çözünürlüğü (1025 veya 2049), dikey abartma (varsayılan 1.0; değiştirilirse belgeleyip arayüzde belirt), lisans ve atıf.
3. **Kesme ve projeksiyon:** Kaynak CRS'yi oku; merkez etrafında yerel ENU (teğet düzlem) ızgarasına yeniden örnekle (bilinear; DTM için cubic seçeneği). Mars için Mars elipsoidi/küresi ile ayrı yol.
4. **Temizlik:** nodata doldurma (ters mesafe ağırlıklı veya laplace), doldurulan piksel oranını raporla (> %2 ise uyarı, > %10 ise hata). Bina/ağaç gibi nesneler DSM'de varsa DTM tercih et.
5. **Nicemleme:** min/max → 16-bit; geri okunan yükseklik ile kaynak arasındaki RMSE < 0.05 m (bölgenin yükseklik aralığına göre teorik sınırı da hesapla ve raporla).
6. **Türev haritalar:** Normal (Sobel, gerçek metre ölçeğinde, 2049² için), eğim, eğrilik, akış birikimi (basit D8; dere yataklarında koyu/ıslak doku için), yükseklik. Bunlardan malzeme maskesi.
7. **Detay sentezi:** Kaynak çözünürlüğü düşükse (Ankara 30 m) yüksek frekanslı detayı fraktal gürültüyle ekle; eklenen detayın genliği ve frekansı `meta.json`'a yazılır.
8. **Rota planlama desteği (`tools/route/plan_route.mjs`):** Bölge için görev noktaları (yaml) arasında eğim maliyetli A* ile, rover limitlerini (B06) aşmayan rota; çıktı `public/terrain/<id>/route.json`. Rota sonradan elle ayarlanabilir.
9. **Önizleme:** Gölgelendirilmiş kabartma (hillshade) + kontur PNG/WebP; `docs/ilerleme/B11/`.
10. **Doğrulama (`validate_terrain.py`):** Boyutlar, 2^n+1 çözünürlük, RMSE, nodata oranı, meta alanları, lisans alanı dolu, atıf metni dolu, dosya boyutları (bölge ≤ 8 MB).
11. **Belgeleme:** `ARAZI.md`: her adımın neden yapıldığı, nasıl yeniden üretileceği.

## Kabul testleri
- `npm run assets:terrain` en az drumheller için temiz bir ortamda baştan sona çalışıyor; diğer bölgeler kaynak erişimi varsa çalışıyor, yoksa açık hata ve talimat veriyor.
- `validate_terrain.py` tüm üretilen bölgelerde yeşil.
- Drumheller önizlemesi, bilinen Badlands kabartmasıyla tutarlı (göz kontrolü + Dijital ikiz projesindeki `A1.2_hillshade.png` ile karşılaştırma).
- `VARLIKLAR.md` her bölge için kaynak URL, lisans ve atıf içeriyor.

## Eleştiri listesi
- Bir GIS uzmanı CRS ve yeniden örnekleme seçimlerini onaylar mı?
- Dikey abartma kullanıldıysa sitede dürüstçe belirtiliyor mu?
- Ham veri yanlışlıkla depoya girdi mi? (`git status` + boyut kontrolü)

## Bitiş raporu
Bölge tablosu (kaynak, boyut, RMSE, nodata oranı, dosya boyutları), önizlemeler.
