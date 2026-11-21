# B13 — Rover Arazide: Canlı Süspansiyon, İz, Toz, Kol

## Hedef
Sitenin imza anı: rover gerçek arazide ilerlerken rocker ve bogie'lerin her taşta ve yokuşta gerçekten eğildiğinin, tekerleklerin zemine bastığının, arkasında iz ve toz kaldığının görülmesi. Bir makine mühendisi yakın çekime bakıp "mekanizma doğru çalışıyor" demeli.

## Önkoşullar
B06, B07, B12 bitti.

## Çıktılar
- `src/scene/rover/RoverRig.tsx`: B06 pozunu modele uygulayan bağlayıcı (gövde, rocker, bogie, tekerlek dönüşleri, diferansiyel dişlisi)
- `src/scene/terrain/Trails.tsx`: iz render target'ı (1024², arazi UV'sinde), damgalama, solma
- `src/scene/terrain/Dust.tsx`: GPU parçacıkları (instanced, yumuşak), yayıcılar tekerleklerde
- `src/scene/terrain/Pebbles.tsx`: rover çevresinde instanced çakıllar, temas tepkisi (görsel)
- `src/scene/rover/armIK.ts` + `ArmRig.tsx`: analitik IK, uç araç animasyonları (sondaj dönüşü, tutucu kapanması)
- `src/scene/rover/Lights.tsx`: farlar (spot + volumetrik koni), durum LED'leri
- `src/scene/rover/missionEvents.ts`: görev olaylarını (rota ilerlemesine bağlı) kol ve ışık animasyonlarına çeviren saf fonksiyonlar
- `tests/unit/armIK.test.ts`
- `docs/ilerleme/B13/`: yakın çekim videoları (basamak tırmanışı, yokuş, yan eğim)

## Adımlar
1. **Poz bağlama:** Worker'dan gelen poz izini (B06) rota ilerlemesi `s` ile örnekle → düğüm dönüşlerini ayarla. Eksen dönüşümü yalnız `frames.ts`. Her karede tahsis yok (önceden ayrılmış Vector3/Quaternion).
2. **Temas doğrulama (debug):** `?debug=1` ile tekerlek temas noktaları ve normaller çizilir; temas boşluğu (tekerlek alt noktası − arazi) ölçülüp panelde gösterilir. Hedef: < 1 cm, gömülme < 0.5 cm.
3. **İz:** Her tekerlek temasta iken iz render target'ına tekerlek genişliğinde, tırtıl desenli bir damga çizilir (chevron deseni dokudan; SummerTech'te zikzak). Arazi shader'ı izi normal bozulması + hafif koyulaşma + pürüzlülük artışı olarak uygular. İz zamanla değil **rota ilerlemesine** bağlı solar (geri sarmada iz de geri gider: iz maskesi, rota ilerlemesinin fonksiyonu olarak yeniden üretilebilir olmalı; uygulama: iz damgaları `s` değerleriyle saklanır ve render target her önemli `s` değişiminde yeniden çizilir veya kademeli güncellenir; seçimi performansa göre yap ve belgele).
4. **Toz:** Yayılma oranı tekerlek hızı × zemin tipi (maskeden) × rüzgâr. Parçacıklar ömür boyunca büyür ve solar, rüzgârla sürüklenir, yumuşak parçacık (derinlik kesişimi yumuşatma). Renk bölgeden. Scroll'a bağlı determinizm: parçacık sistemi tohumlu ve `s`'nin fonksiyonu (zaman tabanlı türbülans yalnız görsel çeşnide, konumlar `s`'den türetilir). Mobilde %40 yoğunluk.
5. **Çakıl:** Rover etrafında 8 m yarıçapta instanced çakıllar (konumları tohumlu, arazi yüksekliğine oturmuş); tekerlek çakıla yaklaşınca çakıl hafif yuvarlanır/zıplar (görsel, `s`'ye bağlı).
6. **Kol IK:** Taban dönüşü + iki bağlantılı düzlemsel çözüm + bilek açısı; hedefe ease-in-out eğriyle uzanma; ulaşılamaz hedefte en yakın nokta ve uyarı. Uç araçlar: sondaj (dönme + aşağı itme + toz), tutucu (parmak kapanması), ArUco kamerası (kameranın hedefe dik hizalanması).
7. **Farlar:** Gece bölgelerinde spot ışıkları (gölgesiz veya ultra'da gölgeli) + volumetrik koni mesh'i + yere düşen ışık lekesi.
8. **Gövde mikro hareketleri:** Motor titreşimi çok hafif (yakın çekimde fark edilir, uzakta değil), ivmede ±1.5° görsel yaylanma (B06 yumuşatmasından).
9. **Kamera takibi (geçici):** B15'te sinematik kamera gelene kadar takip kamerası (yan profil + arka 3/4) ve serbest kamera (dev).

## Kabul testleri
- Yakın çekim kayıtlarında rocker/bogie açıları araziyle uyumlu; tekerlek gömülmesi veya havada kalma (limit dışında) yok (debug ölçümleri ile).
- İz ve toz ileri ve geri scroll'da tutarlı (görsel regresyon, eşik toz için %3).
- `armIK.test.ts` yeşil.
- FPS bütçesi korunuyor (B12 değerleri ± %10).

## Eleştiri listesi
- Gerçek rover videolarındaki (ör. kendi saha videolarınız) süspansiyon hareketine benziyor mu? Fazla yumuşak/robotik mi?
- Toz "bulut efekti" gibi abartılı mı? Gerçek toz ince ve yere yakındır.
- İz deseni tekerlek tırtılıyla eşleşiyor mu?
- Tek bir kare ekran görüntüsü olarak paylaşıldığında etkileyici mi?

## Bitiş raporu
Videolar, temas ölçümleri, FPS.
