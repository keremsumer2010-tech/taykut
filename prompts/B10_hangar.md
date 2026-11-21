# B10 — Hangar: İlk Görüş ve Rover İnceleme

## Hedef
Ziyaretçinin siteyi açtığı anda nefesini tutacağı sahne: karanlık bir hangarda tek spot ışığı altında TAYKUT rover'ının ortaya çıkışı, ardından scroll ile parçalarına ayrılması ve her parçanın mühendislik etiketiyle anlatılması. NASA'nın 3D rover incelemesi kadar ayrıntılı, ama TAYKUT'a özgü sinematik bir dille.

## Önkoşullar
B07 ve B09 bitti.

## Çıktılar
- `src/scene/studio/StudioScene.tsx`: ortam, ışık, zemin, toz parçacıkları
- `src/scene/studio/HeroCamera.ts`: giriş kamera yolu (scroll ilerlemesine bağlı) ve boşta "nefes"
- `src/scene/studio/Explode.tsx` + `src/scene/rover/explode.json`: parça ayrılma yönleri, mesafeleri, sıralama ve gecikmeler
- `src/scene/studio/Labels.tsx`: 3D çapa → ekran etiketleri (çakışma çözümlü)
- `src/scene/studio/NightMode.ts`: farlar, LED'ler, ortam kararması
- `src/scene/rover/RoverModel.tsx`: LOD seçimi, eklem erişimi, malzeme ayarları
- `src/sections/Hero.tsx`, `src/sections/Inspect.tsx` 3D ile bağlandı
- `docs/ilerleme/B10/`: kare dizileri ve kısa video (Playwright kaydı)

## Sahne tasarımı
- **Ortam:** Sonsuz koyu zemin (yarı yansıtıcı, pürüzlülük 0.6), çok uzakta zor seçilen hangar duvar çizgileri (sis içinde), havada yavaş süzülen toz parçacıkları (sadece ışık konisinde görünür, instanced, yumuşak).
- **Işık:** Tepe spot (sert, hafif sıcak 4500K), arkadan soğuk mavi kenar ışığı (rim, 7500K), düşük yoğunluklu ortam (PMREM'li stüdyo HDRI; Poly Haven CC0, `VARLIKLAR.md`). Zemin gölgesi: spot gölgesi (ultra/high) + ContactShadows (hepsinde).
- **Volumetrik koni:** Spot ışığı için ucuz additive koni mesh'i (gürültü dokusuyla), toz parçacıklarıyla birlikte "hacim" hissi.

## Koreografi (scroll ilerlemesi p, Hero + Inspect bölümleri)
1. **p 0.00–0.15 (Hero, ilk ekran):** Kamera tekerleğe 85 mm eşdeğeri makro yakın çekimde; DOF ile tırtıl keskin, arkası bulanık. Boşta: çok yavaş kayma ve nefes. Başlık `TAYKUT` maskeli harf girişiyle (B21'de SplitText; burada CSS ile sade sürüm).
2. **p 0.15–0.40:** Kamera tekerlekten rocker göbeğine süzülür, sonra geri çekilip rover'ı 3/4 açıdan tamamen gösterir. Spot ışığı hafif yoğunlaşır.
3. **p 0.40–0.55 (Inspect girişi):** Rover kendi ekseninde yavaşça döner (yaw 0 → 35°).
4. **p 0.55–0.85:** Patlatılmış görünüm: parçalar `explode.json` sırasıyla, kademeli gecikmeyle (stagger) kendi montaj yönlerinde ayrılır: üst kapak yukarı, elektronik kartlar yukarı-öne, tekerlekler dışa, rocker/bogie yanlara, kol öne. Etiketler parçalar ayrıldıkça belirir.
5. **p 0.85–1.00:** Parçalar yerine döner, rover gece moduna kısa bir an geçip farlarını yakar (B17'deki yörünge geçişine bağlanacak).
Tüm hareketler saf `f(p)` fonksiyonlarıdır (scroll geri sarılınca birebir geri).

## Etiketler
- Veri: `src/content/parts.ts` (B03 ile ortak) — ad, tek satır özellik, `kind` etiketi, çapa düğümü.
- Görünüm: HudFrame dili; 3D çapa noktasından ince çizgi (kırılımlı: önce çapraz, sonra yatay) ve kart. Kart ekran kenarlarına göre sol/sağ yerleşir.
- Çakışma çözümü: ekran uzayında basit itme algoritması (her karede değil, parça hareketi bittikçe; titreme yok).
- Görünürlük: Parça kameraya göre arkada kalınca etiket soluklaşır (kapanma testi ucuz: çapa → kamera ışını, rover sınırlayıcı kutularıyla).
- Erişilebilirlik: Etiketler dekoratif; aynı bilgi HTML parça listesinde (ekran okuyucu ve mobil için).
- Mobil: 3D etiketler yerine alt bölümde yatay kaydırılan parça kartları; parça seçilince kamera o parçaya döner.

## Etkileşim
- Sürükle-döndür (yaw serbest, pitch ±25°), yay sönümlü; bırakınca scroll pozuna yavaşça döner. Çift tık sıfırlar.
- "Gece modu" anahtarı: ortam kararır, farlar (spot + volumetrik koni), kamera LED'i ve durum LED'leri yanar.
- İmleç: 3D üzerinde "SÜRÜKLE" ipucu (B21'de özel imleç; burada CSS).
- Klavye: Inspect odaktayken ← → ile parça etiketleri arasında gezinme.

## Kabul testleri
- Ultra kademede 60 fps (debug panel ölçümü, 10 sn ortalama ve 1%-low), mobil kademede ≥ 30.
- Hangar sahnesi draw call ≤ 150.
- Scroll ileri ve geri: belirli p değerlerinde ekran görüntüleri birebir aynı (görsel regresyon, eşik %1).
- Etiketler doğru parçaya bağlı (her etiket için çapa ↔ parça adı testi).
- reduced-motion: kamera otomatik hareket etmiyor, patlatılmış görünüm yerine statik fotoğraf + liste.

## Eleştiri listesi
- İlk 3 saniyede "vay" dedirtiyor mu? Değilse ışık ve lens dilini yeniden düşün (daha az ışık, daha çok gölge).
- Rover plastik görünüyor mu? Malzeme ve ışıkla düzelt.
- Etiketler okunuyor mu, kalabalık mı? Aynı anda en fazla 5 etiket.
- Patlatılmış görünüm mühendislik çizimi kadar net mi, yoksa rastgele saçılma gibi mi?
- Mobilde de etkileyici mi?

## Bitiş raporu
Kare dizileri, video, FPS ve draw call ölçümleri.
