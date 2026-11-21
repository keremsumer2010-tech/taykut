# B22 — Performans, Kalite Kademeleri ve Son Cila

## Hedef
Bütün deneyimi anayasadaki performans bütçesinin içine sokmak, her cihazda en iyi görünümü vermek ve ödül jürisinin fark edeceği son ayrıntıları tamamlamak.

## Önkoşullar
B00–B21 bitti.

## Çıktılar
- `docs/PERFORMANS.md`: ölçüm tabloları (önce/sonra), kademe ayarları, cihaz profilleri
- `tools/posters/capture.mjs`: her sahne/bölge için poster görselleri (masaüstü/mobil, AVIF/WebP) → yedek mod, OG, yükleme anı
- `tools/perf/fps.mjs`: Playwright ile sahne başına FPS örneklemesi (ortalama, 1%-low), kare süresi histogramı
- Bölge LUT'larının son ayarı (`public/luts/*.cube`)
- OG görselleri (her alt sayfa + iki dil)

## Adımlar
1. **Ölç:** Lighthouse (mobil/masaüstü), Web Vitals (LCP, CLS, INP), paket boyutları, varlık boyutları, sahne başına FPS ve draw call, GPU bellek. Hepsini tabloya yaz.
2. **Paketler:** Kod bölmeyi denetle (`rollup-plugin-visualizer` ile rapor, depoya rapor görseli); kullanılmayan drei parçaları, büyük bağımlılıklar; three'nin ağaç sallamasını doğrula.
3. **Varlıklar:** KTX2 kalite/boyut dengesini sahne sahne gözden geçir; mobil için ayrı daha küçük doku setleri; tekrar kullanılan dokular.
4. **Render:** Shader karmaşıklığı (özellikle arazi fragment'i: dal ve doku okuma sayısı), gölge haritası çözünürlükleri, son işlem maliyetleri; mobilde pahalı geçişleri sadeleştir. `frameloop="demand"` durumlarını denetle.
5. **Kademeler:** Her kademede her sahnenin ekran görüntüsünü al; kademeler arası görsel kaliteyi dürüstçe karşılaştır. Mobil kademe "ucuz" değil "sade ve güzel" görünmeli.
6. **Yükleme sırası:** Kritik yol: HTML/CSS → fontlar → hero görseli → (boşta) 3D çekirdek → rover LOD1 → LOD0 (gerekirse) → ortam → sıradaki sahne ön yüklemesi. `modulepreload` ve `preload` ipuçları.
7. **Posterler:** `capture.mjs` ile deterministik kamera konumlarından üret; yedek modda ve 3D yüklenene kadar kullan.
8. **Cila listesi (her biri kontrol edilip işaretlenir):** favicon seti (SVG + PNG + maskable), sekme başlığı bölüme göre değişmiyor (sabit, sade), metin seçme rengi, kaydırma çubuğu stili (ince), yazdırma stili (sponsor sayfası yazdırılabilir), 404 sayfası, dil değişiminde odak kaybı yok, tüm dış linklerde `rel="noopener"`, görsellerde boyut, videolarda poster, konsolda uyarı yok, `TODO_` kalmadı (veya kullanıcıya listelendi).
9. **Görsel tutarlılık denetimi:** Tüm ekran görüntülerini tek bir sayfada (contact sheet) yan yana koy; renk, tipografi, boşluk tutarlılığını kontrol et.

## Kabul testleri (anayasa `performance_budget`)
- İlk JS ≤ 250 KB gzip; 3D çekirdek ≤ 450 KB; Boot→Hangar ≤ 6 MB; bölge ≤ 8 MB; küre ultra ≤ 10 MB / mobil ≤ 3 MB.
- LCP ≤ 2.5 sn (mobil 4G), CLS ≤ 0.05, INP ≤ 200 ms.
- FPS: ultra 60 (1%-low ≥ 45), mobil ≥ 30.
- Draw call: hangar ≤ 150, arazi ≤ 250.
- Lighthouse mobil: Performans ≥ 80, Erişilebilirlik ≥ 95, En İyi Uygulamalar ≥ 95, SEO 100.
- Hepsi `PERFORMANS.md`'de tablo olarak, CI'da otomatik.

## Eleştiri listesi
- Orta segment bir Android telefonda (Playwright cihaz emülasyonu + CPU yavaşlatma ×4) deneyim akıcı mı?
- Bir ödül jürisi hangi ayrıntıyı "yarım kalmış" bulur? Contact sheet'te ara ve düzelt.
- Bir sponsor, sitenin herhangi bir anında sponsor bilgisine bir tıkla ulaşabiliyor mu?

## Bitiş raporu
Önce/sonra ölçüm tabloları, contact sheet, kademe karşılaştırma görselleri.
