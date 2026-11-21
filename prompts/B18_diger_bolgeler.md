# B18 — Diğer Görev Bölgeleri: MRC 2026, Alpler, Utah, Mars, Ankara

## Hedef
B15 şablonunu beş bölgeye uygulamak, ama her birine **kendi kimliğini** vermek. Hiçbir bölge diğerinin renk değiştirilmiş kopyası gibi durmamalı. Her bölge ayrı bir alt adımdır ve kendi mükemmellik döngüsünden geçer.

## Önkoşullar
B15 ve B17 bitti. B08 (SummerTech modeli) MRC için gerekli.

## Genel kurallar
- Her bölge: `src/missions/<id>.ts`, `public/terrain/<id>/` (B11), rota + olaylar, atmosfer parametreleri, LUT, kamera sheet'leri, HTML metinleri (TR/EN), kaynaklar.
- Durum diline uy: `competed` (geçmiş zaman, gerçek sonuç), `target` (hedef), `dream` (bir gün).
- Gerçek yarışma görevleri resmi kural kitabından; kaynak `ICERIK_KAYNAKLARI.md`'de.
- Bütçe: bölge başına ≤ 8 MB.
- Sıra: mrc2026 → alps → utah → mars → ankara (en kritikten başla).

## B18.1 — MRC 2026 (competed, SummerTech)
- **Anlatı:** Takımın gerçek başarısı. Başvuru videosu 1., finalde genel 4. Üç gerçek görev: (1) Tam Otonom ArUco, (2) Sondaj, (3) Gece ve Enerji.
- **Sahne:** Gece. Fotoğraf referansı `summertech-gece-ahtapot-tutucu.jpg`: açık gri çakıllı parkur, çevrede koyu toprak ve bitki, arkada **jeodezik kubbe çadır** (içi sıcak ışıklı), yeşil LED şeritli **güç paneli istasyonu**, uzakta sokak lambası. Gündüz referansı `summertech-gunduz-regolit.jpg`: açık gri regolit, yer yer pembe-kırmızımsı lekeler, küçük taşlar. Önerilen kurgu: ilk iki görev alacakaranlıkta, üçüncü görev tam gecede.
- **Arazi:** Prosedürel regolit parkuru (gürültü + kraterler + çakıl yığınları + ArUco kart standları). Gerçek konum bilinmiyor; yer adı yazma (açık soru 3).
- **Görevler:**
  1. ArUco: üsten otonom çıkış, waypoint'ler, kol kamerası ArUco kartına dik hizalanır, kart "okunur" (HUD'da işaretçi kimliği), üsse dönüş.
  2. Sondaj: load cell değeri HUD'da (temsili, "SİM"), helezonik sondaj dikey kazar, numune 3 bölmeli kutuya.
  3. Gece ve Enerji: farlar yanar, ahtapot tutucu yedek bataryayı (siyah silindir) kavrar, yeşil LED'li panele hizalar, panel ışıkları değişir.
- **Rover:** SummerTech (B08), 4 tekerlek diferansiyelli rocker (B06 4 tekerlek varyantı), hız ~0.58 m/s ("tahmin").
- **Ekstra:** Bölüm sonunda "MRC 2026 · GENEL 4." büyük tipografik an + başvuru videosu linki.

## B18.2 — İsviçre Alpleri (target)
- **Anlatı:** Alpine/Swiss Rover Challenge hedefi (resmi adı ve tarihlerini kural sayfasından doğrula; lise uygunluğu belirsizse "araştırıyoruz" dili).
- **Sahne:** Soğuk mavi sabah ışığı, kar lekeleri, kaya ve çakıl yamaç, alçak bulut/sis katmanı, uzakta zirveler (etek arazi + siluet), ince kar tozu parçacıkları.
- **Görev:** Kayalık yamaç tırmanışı (süspansiyonun en dramatik vitrini: büyük pitch ve rocker açıları), kar/çakıl geçişinde tekerlek izleri belirgin, bakım/teslimat eylemi (kural kitabına göre).
- **Teknik:** swissALTI3D; kar maskesi yükseklik + eğim + yön (kuzey yamaçlarda daha çok); kar shader'ı (subsurface hissi, parlak kristal noktalar ultra'da).

## B18.3 — Utah, MDRS / Hanksville (dream)
- **Anlatı:** Dünyanın en bilinen Mars benzeri rover sahası; "bir gün". URC'nin üniversite yarışması olduğunu belirt (lise takımı olarak hayal).
- **Sahne:** Kızıl-mor kumtaşı katmanları, sert öğle güneşi, ısı dalgalanması (ekran uzayı hafif bozulma, sadece uzak planda, ultra/high), kırmızı toz.
- **Görev:** Uzun mesafe otonom geçiş; HUD'da otonom mod ve waypoint zinciri; tek eylem: kaya numunesi fotoğraflama (kamera hizalama).
- **Teknik:** USGS 3DEP; katman bantları yükseklikten.

## B18.4 — Mars, Jezero Krateri (dream, final)
- **Anlatı:** Kapanış. "Bir gün oraya." Perseverance'ın çalıştığı krater (NASA verisi, kamu malı; NASA logosu ve onay izlenimi yok).
- **Sahne:** Somon gökyüzü, düşük kontrastlı ışık, Mars güneşi küçük ve soluk; mavi gün batımı alternatifi (Mars'ta gün batımı mavimsidir) kapanış çekimi için; uzakta toz şeytanı (instanced dönen parçacık sütunu).
- **Görev:** Kısa sürüş, durma, kameranın gökyüzünde soluk bir nokta olarak Dünya'ya dönmesi (astronomik doğruluk iddiası yok, sinematik), "TAYKUT" kapanış tipografisi ve Sponsor Ol çağrısı.
- **Teknik:** HiRISE DTM; Mars yerçekimi yok (kinematik aynı), HUD konumu Mars koordinatıyla ve "MARS" etiketiyle.

## B18.5 — Ankara, Ev Üssü (competed/ev)
- **Anlatı:** Takımın evi; atölyeden sahaya. (Akışta ilk bölge olabilir; sıra `missions/index.ts`'te.)
- **Sahne:** Bozkır, gün batımı, kuru ot, uzakta şehir silueti ışıkları (sade, temsili).
- **Görev:** Kısa test sürüşü, ArUco kalibrasyon kartı, "sisteme hazır" ✓.
- **Teknik:** Copernicus GLO-30 + prosedürel detay (B11'de belgelendi).

## Her bölge için kabul testleri
- Bölge girişten çıkışa kesintisiz; FPS bütçesi; varlık bütçesi; görsel regresyon noktaları; HUD değerleri makul; atıflar altbilgide.
- Bölge kimlik testi: 6 bölgenin birer ekran görüntüsü yan yana konduğunda her biri ilk bakışta ayırt ediliyor.

## Eleştiri listesi
- Bu bölge diğerlerinden neyle ayrılıyor? Tek cümleyle söyleyemiyorsan kimliği güçlendir.
- Gerçek yarışma bilgileri doğru ve kaynaklı mı?
- "dream" bölgelerinde dil abartılı veya yanıltıcı mı?

## Bitiş raporu
Bölge başına: kayıt, ölçümler, kaynaklar; altılı kimlik karşılaştırma görseli.
