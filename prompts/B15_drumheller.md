# B15 — İlk Tam Görev Bölgesi: Drumheller (CIRC)

## Hedef
Bir görev bölgesinin uçtan uca, son hâlinde çalışan ilk örneği: araziye dalıştan sonra kuruluş çekimi, süspansiyonu gösteren sürüş, görev eylemleri, HUD ve araziden çıkış. Diğer bütün bölgeler (B18) bu şablonu kopyalayacağı için bu bölüm **referans kalitede** olmalı.

## Önkoşullar
B11–B14 bitti.

## Çıktılar
- `src/missions/schema.ts` (anayasadaki `Mission` arayüzü, genişletilmiş), `src/missions/drumheller.ts`
- `src/scene/terrain/TerrainScene.tsx`: bölge verisinden sahne kurulumu (arazi, gökyüzü, ışık, rover, olaylar, kamera)
- `src/scene/terrain/MissionCamera.ts`: çekim listesine göre kamera (Theatre sheet `mission-drumheller` veya JSON kamera yolları; B17'de Theatre altyapısı kesinleşir, burada arayüzü kur)
- `src/sections/MissionSection.tsx` 3D'ye bağlandı (sticky, uzun scroll alanı)
- `public/terrain/drumheller/route.json`, `events.json`
- `docs/ilerleme/B15/`: uçtan uca kayıt

## Görev senaryosu (CIRC 2027 kural kitabına göre)
1. CIRC'nin resmi sitesinden **2027 (yoksa en son) kural kitabını** bul; görev adlarını ve özlerini (ör. bilim/numune, ekipman bakımı, teslimat, otonom navigasyon) oradan al. Kaynağı `ICERIK_KAYNAKLARI.md`'ye yaz. Bulamazsan genel adlar kullan ve "temsili görev" de.
2. Durum `target`: dil "hedefimiz / hazırlanıyoruz". Katılmışız gibi yazma.
3. Olay akışı (rota ilerlemesi `s` 0..1):
   - 0.00 başlangıç (üs/başlangıç işareti)
   - 0.10–0.35 kil tepeleri arasında sürüş (yokuş + yan eğim; süspansiyon vitrini)
   - 0.35–0.45 **bilim**: dur, kol numune noktasına uzanır, sondaj, numune kutusuna aktarım (HUD ✓)
   - 0.45–0.65 kayalık geçiş (basamaklar; bogie tırmanışı yakın çekimi)
   - 0.65–0.75 **ekipman bakımı**: panel önünde dur, kol anahtarı çevirir/düğmeye basar (temsili panel modeli)
   - 0.75–0.90 otonom bölüm: HUD'da "OTONOM" modu, rota üzerinde waypoint işaretleri tek tek ✓
   - 0.90–1.00 hedefe varış, durma, drone yükselişi
4. Ortam: Badlands katmanlı kil tepeleri, öğleden sonra sıcak ışık (güneş yüksekliği ~30°), ince rüzgâr tozu, seyrek kuru ot tutamları (instanced, CC0 veya prosedürel).

## Kamera (anayasa `cinematography` çekim listesi)
Kuruluş → yan profil takip → tekerlek makro (basamakta) → arka 3/4 → görev eylemi yakın çekimi → drone yükselişi. Her çekim scroll aralığına bağlı, geçişler yumuşak; kamera arazi çarpışma kuralı (`h + 0.6 m`) ve görüş engeli kontrolü uygulanır.

## HTML katmanı
Sticky metin blokları: bölge kartı (CIRC, Drumheller, Alberta, Kanada, koordinat), 3 kısa anlatı paragrafı (süspansiyon, bilim, otonomi), görev durumu rozeti. Metin blokları kameranın kompozisyonuna göre sol/sağ yerleşir (rover diğer yarıda).

## Kabul testleri
- Uçtan uca kayıt: dalış hariç (B17) bölge girişinden çıkışa kesintisiz; kare süresi > 50 ms olan kare yok (ultra).
- Görev olayları ve HUD ✓'leri doğru `s` aralıklarında (E2E: belirli scroll noktalarında HUD durumu).
- Bölge varlıkları ≤ 8 MB (budget).
- Geri scroll: belirli noktalarda görsel regresyon geçiyor.
- Mobil: 30 fps, HUD sade, metinler okunuyor.

## Eleştiri listesi
- Bu bölüm tek başına bir Awwwards SOTD vitrini olabilir mi? Olamıyorsa en zayıf çekimi bul ve yeniden kurgula.
- Süspansiyon hareketi en az bir çekimde **çok net** görülüyor mu?
- Anlatı metni görüntüyle aynı anda aynı şeyi mi anlatıyor?
- Görev eylemleri gerçek CIRC görevlerini yansıtıyor mu, yoksa uydurma mı?

## Bitiş raporu
Kayıt, ölçümler, kaynaklar, şablonun diğer bölgelere nasıl uygulanacağına dair notlar.
