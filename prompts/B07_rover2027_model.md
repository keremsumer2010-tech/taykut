# B07 — TAYKUT 2027 Rover 3D Modeli

## Hedef
Hangar yakın çekimlerine dayanacak kalitede, eklemleri doğru eksenlerde dönen, LOD'lu ve küçük boyutlu bir glTF rover. Sitenin kahraman nesnesi. Plastik oyuncak görünümü kesinlikle olmayacak; gerçek bir mühendislik prototipi gibi duracak.

## Önkoşullar
B06 bitti (geometri ve dönüşümler testli).

## Girdiler
- `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/meshes/*.glb` (base_link, rocker_L/R, bogie_L/R, diff_bar, wheel_L/R)
- `scripts/blender_rover.py` (ayrıntılı görsel model betiği: tırtıl, karkas, gövde parçaları)
- `config/rover_params.yaml`, `urdf/taykut.urdf.xacro`
- Malzeme dili ipuçları: SummerTech fotoğrafları (alüminyum profil, gri baskı göbekler, sarı TPU tekerlek, açıkta kablolar). 2027 rover'ı aynı takımın ürünü olduğu için tasarım dili benzer olabilir; ancak **gerçekte olmayan parça ekleme**. Belirsiz parçalar "tasarım konsepti" olarak açıkça belirtilir.

## Çıktılar
- `tools/rover/build_rover.py` (Blender, `-b -P`), `tools/rover/materials.py`, `tools/rover/bake.py`
- `tools/rover/optimize.mjs` (gltf-transform)
- `tools/rover/validate.mjs`
- `public/models/taykut2027.lod0.glb` (≤ 4 MB), `lod1.glb` (≤ 1.2 MB), `lod2.glb` (≤ 300 KB)
- `src/scene/rover/nodes.ts`: düğüm adları sabitleri
- `docs/ilerleme/B07/` render'ları (Blender Eevee/Cycles önizleme + three test sahnesi ekran görüntüleri)
- `npm run assets:rover`

## Düğüm hiyerarşisi (adlar sabit)
```
rover_root
└─ body
   ├─ diff_gear            (diferansiyel ara dişlisi, görsel)
   ├─ rocker_L  (pivot = rocker_pivot, eksen = yan)
   │  ├─ wheel_FL (pivot = aks)
   │  └─ bogie_L (pivot = bogie_pivot)
   │     ├─ wheel_ML
   │     └─ wheel_RL
   ├─ rocker_R … (simetrik)
   ├─ mast / camera_head   (varsa)
   ├─ arm_base → arm_link1 → arm_link2 → arm_wrist → arm_tool   (kol tasarımı belirsizse sade ve "konsept" etiketli)
   ├─ antenna
   ├─ lights_front (boş düğüm: spot ışık konumları)
   └─ anchors/*  (etiket çapa noktaları: wheel, rocker, diff, arm, camera, battery, computer...)
```
`wheel_count: 4` olursa bogie düğümleri olmadan aynı adlandırma (wheel_FL, wheel_RL...).

## Adımlar
1. **Blender'ı bul** (yol araması; bulunamazsa kullanıcıya sor, kurma).
2. **İçe aktar ve hizala:** Parçaları içe aktar; `rover_params.yaml`'dan pivot konumlarını hesapla; her parçanın origin'ini kendi eklem pivotuna taşı; ROS→glTF eksen dönüşümünü uygula (+Y yukarı, rover −Z yönüne bakar; seçimi `nodes.ts`'te belgeleyip three tarafında tutarlı kullan).
3. **Ayrıntı:** `blender_rover.py`'deki görsel ayrıntıyı (22 chevron tırtıl, karkas, profil kesitleri) kullan. Eksikleri sade ama inandırıcı ekle: cıvata başları (instanced), profil uç kapakları, rulman yüzleri, kablo demetleri (eğri + kalınlık, birkaç tane, abartısız), elektronik kutusu kapağı, anten. Her ekleme gerçekçi ve işlevsel olmalı.
4. **Malzemeler (PBR):**
   - Alüminyum profil: metalik 1, pürüzlülük 0.35–0.45, fırçalanmış yön (anizotropi glTF eklentisi `KHR_materials_anisotropy` destekleniyorsa; yoksa pürüzlülük dokusunda yönlü çizgi).
   - TPU tekerlek: sarı (`--tire` belirteci, fotoğraftan ölçülen ton), pürüzlülük 0.7, hafif toz birikimi dokusu (tırtıl diplerinde).
   - 3D baskı parçalar: katman çizgisi normal haritası (0.2 mm adım, ince), pürüzlülük 0.6.
   - Elektronik: PCB yeşili/kırmızısı, bakır/altın pedler; kablo kılıfları.
   - Kenar aşınması: eğrilik haritasından metal kenarlarda parlama, plastikte hafif beyazlama.
5. **Pişirme (bake):** LOD0 için 2K atlas setleri: base color, ORM (AO-roughness-metalness), normal. Yakın çekim için tekerlek ve göbeklere ayrı 1K detay seti. AO'yu montajlı hâlde pişir (parçalar arası gölgeler).
6. **LOD:** LOD1 (~40k üçgen) ve LOD2 (~8k) decimate + normal pişirme; hiyerarşi ve adlar aynı.
7. **Optimize:** `gltf-transform`: dedup, prune, weld, `meshopt` sıkıştırma, dokular KTX2 (renk ETC1S kalite yüksek, normal UASTC + zstd), boyut sınırları. three tarafında `MeshoptDecoder` + `KTX2Loader` (basis transcoder `public/basis/` altında yerel, CDN yok).
8. **Doğrulama (`validate.mjs`):** Düğüm adları ve hiyerarşi; pivot konumları `rover_params.yaml`'a ±1 mm (dönüşüm sonrası); tekerlek yarıçapı ±1 mm; üçgen sayıları; dosya boyutları; tüm malzemelerde gerekli dokular. CI'da çalışır.
9. **Test sahnesi:** `vitrin/rover.html` (sadece dev): rover + slider'larla her eklemi döndürme + B06 çözücüsüyle basamak senaryosu canlı. Eklemler doğru eksende dönmeli, tekerlekler gövdeye girmemeli.
10. **Etiket çapaları:** `anchors/*` boş düğümleri B10'daki etiketler için.

## Kabul testleri
- `npm run assets:rover` temiz klasörde çalışıyor; `validate.mjs` yeşil.
- Test sahnesinde her eklem ±limit aralığında döndürülürken çakışma/kopma yok (ekran görüntüsü dizisi).
- LOD0 ≤ 4 MB, LOD1 ≤ 1.2 MB, LOD2 ≤ 300 KB.
- Yakın çekim render'ı (tekerlek + rocker göbeği, 85 mm eşdeğeri) plastik görünmüyor (ekran görüntüsünü dürüstçe değerlendir).

## Eleştiri listesi
- Bu model bir mühendislik fuarındaki gerçek prototip fotoğrafının yanında inandırıcı duruyor mu?
- Ölçek doğru mu? (Tekerlek Ø250 mm, iz 0.68 m; insan figürüyle karşılaştırma render'ı yap.)
- Fazla "temiz" mi? Gerçek prototiplerdeki küçük kusurlar (vida, kablo bağı, etiket) eksik mi?
- Gerçekte olmayan bir şey eklendi mi? Varsa kaldır veya "konsept" etiketi koy.

## Yapma
- Hazır mağaza modeli veya başka bir rover'ın modelini kullanmak.
- Logoyu modele deforme ederek koymak (çıkartma uygulanacaksa oranı korunmuş ayrı doku).

## Bitiş raporu
Boyut ve üçgen tablosu, doğrulama çıktısı, render'lar.
