# B06 — Rover Parametreleri ve Süspansiyon Çözücüsü

## Hedef
Sitenin "gerçek mühendislik" iddiasının kalbi: rocker-bogie (6 tekerlek) ve diferansiyelli rocker (4 tekerlek) süspansiyonunu araziye göre **analitik, deterministik ve testli** çözen saf TypeScript modülü. Henüz 3D yok. Bu modül sinematik sürüşü (B13), HUD'u (B14) ve yer istasyonunu (B19) besleyecek.

## Önkoşullar
B02 bitti (`rover2027.generated.json` ve `summertech.ts` var).

## Girdiler
- `rover_params.yaml` (`geometry`, `wheel`, `joints`, `rover.wheel_count`); `taykut.urdf.xacro` (eklem tipleri ve eksenleri).
- SummerTech geometrisi: Ø10 cm tekerlek, 45×45 cm zarf. Dingil mesafesi, iz genişliği ve rocker pivot yüksekliği bilinmiyor; fotoğraflardan **oran tahmini** yap (gündüz fotoğrafında tekerlek çapını cetvel kabul et), değerleri `summertech.ts`'e `kind: 'estimate-from-photo'` olarak yaz.

## Çıktılar
- `src/lib/frames.ts`: ROS (x ileri, y sol, z yukarı) ↔ three (y yukarı) dönüşümü
- `src/lib/heightfield.ts`: `Heightfield` sınıfı (Float32Array/Uint16Array kaynak, boyut metre, bilinear `sample(x,z)`, `normal(x,z)`, `slope(x,z)`, sınır davranışı: kenara kenetleme)
- `src/scene/rover/geometry.ts`: `RoverGeometry` tipi + `fromParams(json)`, `summertechGeometry`
- `src/scene/rover/kinematics.ts`: `solvePose(geom, hf, x, z, yaw): RoverPose`
- `src/scene/rover/route.ts`: rota (Catmull-Rom, yay uzunluğuna göre yeniden örneklenmiş), `sampleRoute(s)`
- `src/workers/routeSolver.worker.ts`: rota boyunca 2048 poz ön hesaplama → aktarılabilir `Float32Array`
- `src/scene/rover/poseTrack.ts`: ön hesaplanmış pozlar arasında enterpolasyon (açılar için kısa yol), görsel yumuşatma (rota boyunca filtre; zamana bağlı değil)
- `tests/unit/heightfield.test.ts`, `kinematics.test.ts`, `route.test.ts`, `frames.test.ts`
- `tools/kinematics/plot.mjs`: test senaryolarının SVG grafiklerini üretir (`docs/ilerleme/B06/`)
- `docs/KINEMATIK.md`: denklemler, şekiller (SVG), varsayımlar

## Poz tipi
```ts
interface RoverPose {
  body: { position: Vec3; pitch: number; roll: number; yaw: number }; // gövde merkezi, dünya
  rocker: { left: number; right: number };   // gövdeye göre, rad
  bogie?: { left: number; right: number };   // rocker'a göre, rad (6 tekerlekte)
  diff: number;                              // diferansiyel dişli açısı (görsel), rad
  wheels: Array<{ id: WheelId; center: Vec3; contact: Vec3; normal: Vec3; inContact: boolean; spin: number }>;
  limits: { rockerClamped: boolean; bogieClamped: boolean };
}
```

## Adımlar
1. **Matematiği yaz (`KINEMATIK.md`):** Yan görünüşte rocker-bogie bir düzlemsel mekanizmadır. Her taraf için: ön tekerlek merkezi F, orta M, arka R; bogie pivotu B (M ve R arasında, `bogie_pivot_z` yüksekliğinde), rocker pivotu P (gövdede). Tekerlek merkezleri temas yüzeyinin `r` kadar üstünde ve yüzey normaline dik. Diferansiyel kısıtı: θ_sol = −θ_sağ (gövdeye göre), dolayısıyla gövde pitch'i iki tarafın dünya rocker açılarının ortalaması.
2. **Çözüm stratejisi (sabit nokta yinelemesi, deterministik):**
   a. Başlangıç: gövde pitch = roll = 0, yükseklik = tekerlek temas ortalaması + nominal.
   b. Her taraf için bogie'yi M ve R temaslarına oturt (iki noktalı doğru, tekerlek profili örneklemesiyle).
   c. Rocker'ı F teması ve B'ye oturt.
   d. İki tarafın rocker açılarından gövde pitch'ini, pivot yüksekliklerinden roll'ü ve gövde yüksekliğini hesapla.
   e. Gövde yönelimi değişti → tekerleklerin dünya x/z konumları değişir → yeniden örnekle. 3–5 yinelemede yakınsar (yakınsama ölçütü 1e-5 rad); en fazla 8 yineleme, sabit sayı (determinizm için erken çıkış sabit kurallı).
3. **Tekerlek–arazi teması:** Tekerlek profili boyunca 7 nokta (−60°…+60°) örnekle; tekerlek merkezini, profil hiçbir noktada araziye girmeyecek en düşük yüksekliğe yerleştir. Bu, keskin basamaklarda gerçekçi "tırmanma" verir.
4. **Limitler:** `joints.rocker_limit`, `joints.bogie_limit`. Aşılırsa kenetle, o tekerleği `inContact=false` yap.
5. **4 tekerlek varyantı:** Her tarafta rocker = iki tekerlek (ön ve arka); bogie yok. Aynı çözücü, ayrı yol.
6. **Tekerlek dönüşü:** Rota yay uzunluğu ve yaw değişiminden her tarafın kat ettiği yol: `s_sol = s − yaw·(iz/2)`, `s_sağ = s + yaw·(iz/2)`; dönüş = s / r. Yerinde dönüş desteklenir.
7. **Diferansiyel dişli (görsel):** `diff = (θ_sol − θ_sağ)/2 · diff_bar_ratio`.
8. **Rota:** Kontrol noktalarından Catmull-Rom (centripetal), yay uzunluğuna göre eşit aralıklı yeniden örnekleme, yaw = teğet yönü. Ani yön değişimlerinde yaw'ı yumuşat (rota boyunca, zamandan bağımsız).
9. **Worker:** Bölge yüklenince rota + heightfield worker'a gönderilir (transferable), 2048 poz hesaplanır (< 50 ms hedef; ölç). Ana iş parçacığında asla ağır hesap yok.
10. **Yumuşatma:** Gövde pitch/roll için rota boyunca ileri-geri (zero-phase) düşük geçiren filtre; böylece scroll geri sarıldığında birebir aynı sonuç.

## Kabul testleri (`kinematics.test.ts`; beklenen değerler test içinde geometriden hesaplanır ve açıklanır)
1. Düz zemin: tüm açılar 0 ± 1e-6; tüm tekerlekler temasta; gövde yüksekliği = nominal.
2. Sadece sol ön tekerlek altında 10 cm basamak: sol rocker açısı beklenen ± 0.1°; sağ rocker eşit ve ters (gövdeye göre); gövde pitch = ortalama; roll beklenen yönde.
3. Simetrik tümsek (iki ön tekerlek altında): roll = 0, pitch > 0.
4. 15° düzgün yokuş: pitch = 15° ± 0.1°, rocker ve bogie açıları ≈ 0.
5. 10° yan eğim: roll = 10° ± 0.2°.
6. Limit aşımı: kenetleme ve `inContact=false`.
7. 4 tekerlek varyantı: 1–5 senaryoları uygun beklentilerle.
8. Determinizm: aynı girdi → bit düzeyinde aynı çıktı; rota ileri ve geri örneklemede aynı poz.
9. `frames.test.ts`: ön tekerlek three uzayında rover'ın önünde.
10. Performans: 2048 poz < 50 ms (Node'da ölç, rapora yaz).
- `plot.mjs` her senaryo için yan görünüş SVG'si üretir; görsel olarak mekanizmanın doğru oturduğunu göster.

## Eleştiri listesi
- Bir makine mühendisi `KINEMATIK.md`'yi okuyunca "doğru" der mi? Diferansiyelin işaret kuralı açık mı?
- Keskin kenarlarda tekerlek titremesi (iki örnek arasında zıplama) var mı? Profil örneklemesini artır veya kenar yumuşat.
- Yinelemenin yakınsamadığı bir arazi bulabiliyor musun? (Rastgele gürültü arazisinde 10.000 rastgele poz dene.)
- Kodun okunurluğu: bir lise öğrencisi yorumlarla takip edebilir mi?

## Yapma
- Fizik motoru kullanmak (o B20'de, ayrı mod).
- Zamana bağlı integrasyon (scroll determinizmini bozar).

## Bitiş raporu
Test çıktıları, performans ölçümü, SVG şekilleri, bilinen sınırlar.
