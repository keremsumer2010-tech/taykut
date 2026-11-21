# B08 — SummerTech Rover (MRC 2026) 3D Modeli

## Hedef
Takımın gerçekten yarışan ve MRC 2026'da genel 4. olan rover'ının fotoğraflara sadık, temsili 3D modeli. MRC bölgesinde (B18) ve "gerçek başarımız" anlatısında kullanılacak. Fusion 360 dosyası gelirse bu modelin yerini alır (açık soru 4).

## Önkoşullar
B07 bitti (aynı varlık hattı, aynı düğüm adlandırma kuralları).

## Referans fotoğraflar ve gözlemler
- `kaynak/foto/summertech-gunduz-regolit.jpg`, `kaynak/foto/summertech-gece-ahtapot-tutucu.jpg`, `taykut-site/public/media/rover-day.webp`, `rover-night.webp`, `rover-aruco.webp`.
- Gözlemler (fotoğraflardan; her ölçü **oransal tahmin**):
  - 4 tekerlek, sarı TPU, dalgalı/zikzak tırtıl, yanlarda beyaz göbek kapağı ve ortada mavi nokta (rulman/kapak), Ø10 cm.
  - Her tarafta tek **diferansiyelli rocker**: gövde yan yüzündeki gri 3D baskı göbekten (ortasında görünür rulman/cıvata) aşağı doğru açılan iki alüminyum kare profil, **ters V** biçimi; profil uçlarında tekerlek motor yuvaları (beyaz/gri baskı).
  - Gövde: alüminyum sac kutu, yan yüzde beyaz/yarı saydam panel ve birkaç cıvata/anahtar; üst tablada kırmızı kart ve kablolar.
  - Üstte beyaz, 3 bölmeli numune kutusu; arkada siyah çubuk anten.
  - Önde-solda beyaz/fildişi baskı kol: dikey omuz gövdesi, kırmızı servolar; gündüz fotoğrafında kol ucunda yatay, gri/siyah boru biçimli sondaj (auger) ünitesi.
  - Gece fotoğrafında kol ucunda sarı "ahtapot tutucu" (çok parmaklı kıskaç) ve öne doğru aydınlatma (araba farı esinli LED).
  - Gövdenin her yerinde açıkta renkli kablolar (beyaz, kırmızı, sarı, turuncu). Bu prototip gerçekliği modelde **korunmalı** (abartısız birkaç demet).
- Ölçek: tüm rover 45×45 cm zarfa sığar (katlı hâlde). Tekerlek çapını (10 cm) cetvel alarak oranları fotoğraflardan çıkar; `summertech.ts`'deki tahmini geometriyle tutarlı olmalı (B06).

## Çıktılar
- `tools/rover/build_summertech.py` (Blender, sıfırdan prosedürel modelleme; boyutlar parametrik, `summertech.ts` ile aynı değerler)
- `public/models/summertech.lod0.glb` (≤ 3 MB), `lod1.glb` (≤ 800 KB)
- Kol için iki uç araç varyantı: `arm_tool_auger` ve `arm_tool_octopus` (görünürlükle değişir)
- `docs/ilerleme/B08/`: her referans fotoğrafla aynı açıdan render, yan yana karşılaştırma

## Adımlar
1. **Fotoğraf eşleme:** Her referans fotoğraf için yaklaşık kamera konumu ve odak uzaklığını tahmin et (Blender'da fotoğrafı arka plan yap, kamera eşle). Bu eşleşmeler hem modelleme hem doğrulama için kullanılır.
2. **Blok modelleme:** Gövde kutusu, rocker profilleri, tekerlekler, kol, numune kutusu, anten. Oranları fotoğraf kaplamasıyla kontrol et.
3. **Ayrıntı:** Tekerlek tırtılı (zikzak, fotoğraftaki dalga sayısını say), göbek kapakları, rocker göbeğindeki rulman, profil uç kapakları, servo gövdeleri, sondaj borusu, ahtapot tutucu parmakları (eklemli, kapanıp açılabilir), kablo demetleri, cıvatalar.
4. **Malzemeler:** Sarı TPU (fotoğraftan ölçülen renk), alüminyum sac (hafif çizikli), beyaz baskı (katman çizgileri), gri baskı göbek, siyah boru, kırmızı servo, beyaz numune kutusu (hafif yarı saydam: `transmission` düşük veya subsurface benzeri).
5. **Hiyerarşi:** `rover_root > body > rocker_L > (wheel_FL, wheel_RL)`, sağ simetrik; `diff` (gövde içi, görünmeyebilir); `arm_*` zinciri; `anchors/*`.
6. **Optimize ve doğrula:** B07 hattıyla aynı (`validate.mjs` SummerTech profiliyle).
7. **Karşılaştırma:** Eşleşmiş kameralardan render al, fotoğrafla yan yana koy. Oran farkı göze batıyorsa düzelt (2 tur minimum).

## Kabul testleri
- Yan yana karşılaştırmalarda rover hemen tanınıyor (dürüst değerlendirme; kullanıcıya göstermek için görselleri hazırla).
- Boyut sınırları, doğrulama yeşil.
- Kol uç aracı değişimi ve tutucu parmak animasyonu test sahnesinde çalışıyor.

## Eleştiri listesi
- Takım üyeleri bu modeli görünce "bu bizim rover" der mi?
- Fazla mı temiz? Prototipin el yapımı karakteri (kablolar, bantlar) korunmuş mu?
- Fotoğrafta olmayan bir parça uyduruldu mu?

## Yapma
- Fotoğraflarda görünmeyen ayrıntıları "daha havalı" olsun diye eklemek.

## Bitiş raporu
Karşılaştırma görselleri, boyutlar, tahmini ölçüler tablosu.
