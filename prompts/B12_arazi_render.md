# B12 — Arazi Render: Shader, LOD, Gökyüzü, Sis, Işık

## Hedef
Gerçek yükseklik verisini fotoğraf gibi görünen, ufka kadar uzanan, 60 fps çalışan bir araziye dönüştürmek. Yakında çakıl ve tırtıl izi kadar ayrıntılı, uzakta sise karışan dağlar kadar geniş.

## Önkoşullar
B09 ve B11 bitti (en az drumheller paketi var).

## Çıktılar
- `src/scene/terrain/TerrainMesh.tsx`: GPU heightfield, CDLOD/geomipmap halkaları, geomorph
- `src/scene/terrain/terrain.vert.glsl`, `terrain.frag.glsl` (veya `onBeforeCompile` ile MeshStandardMaterial genişletmesi; seçimi gerekçelendir)
- `src/scene/terrain/Skirt.tsx`: ufuk eteği (düşük çözünürlüklü geniş halka) + uzak siluet
- `src/scene/terrain/Sky.tsx`: fiziksel tabanlı gökyüzü (Rayleigh + Mie), güneş diski, bölge parametreleri
- `src/scene/terrain/Fog.ts`: yükseklik + mesafe sisi, renk gökyüzünün ufuk renginden
- `src/scene/terrain/Lighting.tsx`: güneş (gölgeli, sıkı gölge kamerası rover'ı takip eder), PMREM ortam ışığı (gökyüzünden)
- `src/scene/terrain/materials/`: CC0 PBR doku setleri (ambientCG/Poly Haven) → KTX2: kaya, kum/toprak, çakıl, kar, kil (Drumheller katmanları)
- `public/luts/<bolge>.cube`
- `vitrin/terrain.html` (dev): bölge seçici, serbest kamera, parametre panelleri

## Shader ayrıntıları
1. **Vertex:** Düz ızgara, `height.png` örneklemesi (16-bit: iki kanal veya `RG16`/`R16` doku; WebGL2 `R16UI` veya float'a dönüştürülmüş `R32F`; seçimi bellek ve hassasiyetle gerekçelendir). CPU örnekleyicisiyle (B06) **aynı** bilinear formül; test: shader çıktısını okuma (render target) ile CPU değerini karşılaştır (±1 mm).
2. **LOD:** Kameraya mesafeye göre 4–5 halka, her halka bir öncekinin yarı çözünürlüğü; halka sınırında geomorph ile çatlaksız geçiş. Uzak halka `height_lo` kullanabilir.
3. **Fragment, malzeme karışımı:**
   - Maskeden (B11) ağırlıklar + eğim/yükseklik eşikleri + gürültüyle kırılmış geçişler (keskin sınır yok).
   - Dik yamaçlarda **triplanar** örnekleme (dokular uzamaz), düzlükte tek düzlem (performans).
   - Yakın mesafede detay normali (tekrar eden doku), uzak mesafede makro renk varyasyonu (büyük ölçekli gürültü + B11'deki akış haritası), tekrar desenini kırmak için doku döndürme/ofset ("stochastic tiling" basit sürümü).
   - Drumheller'a özel: yatay kil katmanları (yüksekliğe bağlı bant rengi; kum, gri-kahve, kömür tonları), yamaç yönüne göre hafif farklılık.
   - İz maskesi girişi (B13).
4. **Işık:** Fiziksel güneş yoğunluğu, gökyüzü ortam ışığı, arazi kendi kendini gölgeleme (gölge haritası + uzak arazi için ufuk tabanlı yumuşak gölge: ön hesaplanmış "horizon map" basit sürümü, isteğe bağlı ultra).
5. **Sis ve atmosfer:** Mesafe + yükseklik sisi; ufukta gökyüzüyle birebir renk; hafif hava perspektifi (uzak tepeler mavimsi/soluk).

## Bölge görsel parametreleri (`missions/<id>.ts` içinde `atmosphere`)
- güneş yönü (azimut, yükseklik), renk sıcaklığı, gökyüzü bulanıklığı (turbidity), Mie yoğunluğu, sis yoğunluğu/yüksekliği, LUT, rüzgâr vektörü, pozlama.
- Bu bölümde Drumheller için ayarlanır; diğerleri B18'de.

## Kabul testleri
- Drumheller ultra 60 fps, mobile ≥ 30 (debug panel, 10 sn).
- Arazi sahnesi draw call ≤ 250 (rover dahil).
- LOD geçişlerinde çatlak/pırpır yok (kamerayı arazi üzerinde uçuran kayıt; kare kare inceleme).
- CPU–GPU yükseklik testi geçiyor.
- Dokuların tekrar deseni 50 m mesafeden fark edilmiyor (dürüst değerlendirme + ekran görüntüsü).

## Eleştiri listesi
- Gerçek bir Drumheller fotoğrafıyla yan yana konduğunda (renk ve ışık karakteri açısından) aynı yer gibi duruyor mu? (Telif nedeniyle fotoğrafı depoya koyma; sadece referans olarak bak.)
- Ufuk çizgisi "dünyanın sonu" gibi kesiliyor mu?
- Gece/gündüz geçişinde renkler mantıklı mı?
- Mobil kademede arazi hâlâ güzel mi?

## Bitiş raporu
Bölge parametreleri, FPS ve draw call ölçümleri, önce/sonra ekran görüntüleri.
