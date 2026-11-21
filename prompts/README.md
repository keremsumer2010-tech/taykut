# TAYKUT — Bölüm Promptları

Site **tek seferde yapılmaz.** 24 bölüme ayrıldı (B00–B23). Her bölüm kendi başına ayrıntılı bir prompttur ve **kusursuz olana kadar** üzerinde çalışılır. Süre ve token sınırı yoktur; bir bölüm günler sürebilir.

**Anayasa:** [`../PROMPT_TAYKUT_SITE.md`](../PROMPT_TAYKUT_SITE.md). Her bölüm promptu onun üstüne kurulur. Çelişki olursa anayasanın `hard_constraints` ve `team_facts` bölümleri kazanır. Diğer konularda bölüm promptu daha ayrıntılı olduğu için önceliklidir.

## Nasıl çalışılır
1. Sıradaki bölümün dosyasını baştan sona oku (`Bxx_*.md`).
2. "Önkoşullar" bölümünü kontrol et. Eksik varsa önceki bölüme dön.
3. Adımları uygula.
4. **Mükemmellik döngüsü** (her bölümde zorunlu, en az 2 tur):
   - Kabul testlerini çalıştır ve çıktıları kaydet.
   - Ekran görüntüsü/video al (görsel bölümlerde masaüstü + mobil).
   - Bölümün "Eleştiri listesi"ndeki her soruyu dürüstçe cevapla. Ödül jürisi, sponsor ve NASA mühendisi gözüyle bak.
   - Bulduğun her kusuru düzelt ve tekrar ölç.
   - Bir turda düzeltilecek bir şey çıkmazsa ve bütün kabul testleri geçiyorsa bölüm biter.
5. `docs/ILERLEME.md`'ye bölüm raporu yaz: yapılanlar, ölçümler, ekran görüntüsü yolları, bilinen sınırlar, "doğrulanmadı" listesi.
6. Commit at (`Bxx: ...`), push et, CI yeşil olsun. Bir sonraki bölüme geç.

## Bölüm listesi

| # | Dosya | Konu | Çıktı |
|---|---|---|---|
| B00 | [B00_temel.md](B00_temel.md) | Proje iskeleti, araçlar, CI/CD, Pages | Canlı boş site, yeşil CI |
| B01 | [B01_tasarim_sistemi.md](B01_tasarim_sistemi.md) | Renk, font, ızgara, bileşenler | Tasarım sistemi + vitrin sayfası |
| B02 | [B02_icerik.md](B02_icerik.md) | TR/EN metinler, kaynak belgesi | Doğrulanmış içerik dosyaları |
| B03 | [B03_html_site.md](B03_html_site.md) | 3D'siz eksiksiz site, alt sayfalar | Yayınlanabilir site |
| B04 | [B04_medya.md](B04_medya.md) | Fotoğraf ve video hattı | AVIF/WebP/MP4 setleri |
| B05 | [B05_seo_erisilebilirlik.md](B05_seo_erisilebilirlik.md) | SEO, erişilebilirlik, Lighthouse | 100 SEO, ≥95 a11y |
| B06 | [B06_kinematik.md](B06_kinematik.md) | Rover parametreleri + süspansiyon çözücüsü | Testli saf TS modülü |
| B07 | [B07_rover2027_model.md](B07_rover2027_model.md) | 2027 rover 3D modeli | LOD'lu, doğrulanmış GLB |
| B08 | [B08_summertech_model.md](B08_summertech_model.md) | MRC 2026 rover modeli (fotoğraflardan) | Temsili ama sadık GLB |
| B09 | [B09_3d_cekirdek.md](B09_3d_cekirdek.md) | Canvas, kalite kademeleri, fallback, debug | 3D altyapı |
| B10 | [B10_hangar.md](B10_hangar.md) | Hangar, ilk görüş, patlatılmış görünüm | Sinematik açılış sahnesi |
| B11 | [B11_arazi_hatti.md](B11_arazi_hatti.md) | DEM → heightmap veri hattı | Bölge arazi paketleri |
| B12 | [B12_arazi_render.md](B12_arazi_render.md) | Arazi shader'ı, LOD, gökyüzü, sis | Gerçekçi arazi |
| B13 | [B13_rover_arazide.md](B13_rover_arazide.md) | Rover + arazi: süspansiyon, iz, toz, kol | Canlı süspansiyon |
| B14 | [B14_hud.md](B14_hud.md) | Görev kontrol HUD'u | Gerçek telemetrili HUD |
| B15 | [B15_drumheller.md](B15_drumheller.md) | İlk tam görev bölgesi | Uçtan uca bölge |
| B16 | [B16_kure.md](B16_kure.md) | 3D Dünya küresi | Atmosferli küre, pinler |
| B17 | [B17_gecisler_boot.md](B17_gecisler_boot.md) | Boot, geçişler, koreografi | Kesintisiz akış |
| B18 | [B18_diger_bolgeler.md](B18_diger_bolgeler.md) | MRC, Alpler, Utah, Mars, Ankara | 5 bölge |
| B19 | [B19_yer_istasyonu.md](B19_yer_istasyonu.md) | Yer kontrol istasyonu deneyimi (simülasyonlu) | Ziyaretçinin kullandığı istasyon |
| B20 | [B20_sen_sur.md](B20_sen_sur.md) | Rapier fizikli sürüş | Sürülebilir rover |
| B21 | [B21_ses_mikro.md](B21_ses_mikro.md) | Ses ve mikro etkileşimler | Cilalı his |
| B22 | [B22_performans_cila.md](B22_performans_cila.md) | Performans, kademeler, cila | Bütçe içinde |
| B23 | [B23_yayin.md](B23_yayin.md) | Son denetim ve yayın | Lansman |

## Varsayılanlar (açık sorular cevaplanana kadar)
- Kahraman rover: TAYKUT 2027 (6 tekerlek, `rover_params.yaml`). SummerTech kendi bölgesinde (MRC).
- Bölge sırası: ankara → mrc2026 → drumheller → alps → utah → mars.
- E-posta: `TODO_EMAIL` yer tutucusu, telefon yok.
- Sponsor tutarları yazılmaz.
- Analitik yok.
- Üye fotoğrafı yok, tutarlı illüstrasyon var.
