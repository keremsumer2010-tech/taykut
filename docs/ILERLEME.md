# İlerleme Günlüğü

En yeni bölüm en üstte. Her bölüm: plan, yapılanlar, ölçümler, sapmalar, doğrulanmayanlar.

---

## B07 — TAYKUT 2027 Rover 3B Modeli (2026-11-22)

**Plan:** Dijital ikizin URDF link parçalarından, `rover_params.yaml` ölçüleriyle birebir eklemli web modeli; 3 LOD; meshopt sıkıştırma; parametrelere karşı otomatik doğrulama; kinematik çözücüyle uyum denetimi.

### Yapılanlar
- `tools/rover/build_rover.py` (Blender 5.2 başsız): parçaları içe aktarır, ikizin Z-yukarı kayıt hatasını düzeltir (X etrafında −90°), hiyerarşiyi kurar: `rover_root > body > rocker_L/R > (wheel_F*, bogie_* > wheel_M*, wheel_R*)`, `diff_gear`, `anchors/anchor_*` (3B etiket çapaları). Kenar yumuşatma + ağırlıklı normaller, web PBR malzemeleri (`TK_*`). LOD0/1/2 dışa aktarımı, isteğe bağlı önizleme render'ı.
- `tools/rover/optimize.mjs`: dedup → prune (boş eklem düğümleri korunur) → weld → quantize → meshopt (EXT_meshopt_compression zorunlu).
- `tools/rover/validate.mjs` (`npm run check:rover`, CI'da): düğüm adları, ebeveynler, eklem konumları params'a göre **±1 mm**, tekerlek yarıçapı **±2 mm**, üç LOD için.
- `tools/rover/build.mjs` (`npm run assets:rover [-- --render]`): Blender → optimize → doğrulama tek komut.
- `tools/rover/viewer.html` + `viewer.ts` (yalnız geliştirme, yayına girmez): modeli `solvePose` çıktısıyla sürer, her tekerlek düğümünün dünya konumunu çözücünün tekerlek merkeziyle karşılaştırır. `tools/rover/shots.mjs` kanıt görüntülerini alır.
- three 0.187.0 eklendi (B09 sahnesi de bunu kullanacak).

### Ölçümler
| LOD | Üçgen | Ham | Sıkıştırılmış | Sınır |
|---|---|---|---|---|
| LOD0 | 98.635 | 3.471 KB | **515 KB** | 4.096 KB |
| LOD1 | 25.448 | 1.266 KB | **260 KB** | 1.228 KB |
| LOD2 | 5.084 | 287 KB | **93 KB** | 307 KB |

- Model ↔ kinematik uyumu: 7 senaryo × LOD0/LOD2, 6 tekerlek, en büyük fark **0,00 mm** (düz, 10 cm ve 45 cm basamak, 15° yokuş, 12° yan eğim + 30° yön, kaya, engebeli).
- Negatif test: sol rocker işareti bilerek ters çevrildi → denetim **349,6 mm** fark gösterdi. Yani 0,00 sonucu denetimin kör olmasından değil, eşlemenin doğruluğundan.
- Eşleme (belgelendi, `viewer.ts applyPose`): gövde Euler `YZX` = (roll, yaw, pitch); rocker/bogie three +Z ekseni etrafında. Tekerlek dönüşü (−s/r, three +Z) B09'da bağlanacak; henüz denenmedi.
- Birim test 45/45 ✓, typecheck/lint ✓, build ✓, bütçe 106,9 KB ilk yük (model ilk yüke girmiyor).

### Mükemmellik turları
1. Yan önizleme kamerası tekerleri kesiyordu → kadraj ve hedef düzeltildi; karanlık ortamda alüminyum koyu griye düşüyordu → ortam ışığı artırıldı.
2. Yeniden render'da tekerler sekizgen çıktı: önizleme LOD döngüsünden sonra alındığı için sahne LOD2'de (%9) kalmıştı. GLB'ler etkilenmemişti (doğrulama geçiyordu) → render öncesi LOD0'a dönüş + üçgen sayısı `assert` ile korunuyor.
3. Çıktı klasörü göreli yolda Blender render'ları kayboluyordu → mutlak yol.

### Kanıt
`docs/ilerleme/B07/`: `render-34/yan/teker.jpg` (Blender), `01-duz … 05-engebeli.jpg` (three.js denetim sahnesi, panelde mm farkları).

### Sapmalar ve doğrulanmayanlar
- KTX2 doku sıkıştırma yok: modelde doku yok, yalnız düz PBR malzemeler (gerek kalmadı).
- İkizdeki motor gövdesi eski karar (CRL-4001B) biçiminde; güncel karar DJI M3508. Model "tasarım konsepti" olarak etiketlenecek.
- Tekerlek sarısı (#E7AD01) SummerTech TPU tekerleğinden; 2027 aracının gerçek rengi değil, tasarım kararı.
- Malzeme görünümü (alüminyum parlaklığı, TPU dokusu) son ışıkla B09/B10'da değerlendirilecek; Blender önizleme ışığı sahnenin son hali değil.
- Gövde–arazi çarpışması hâlâ hesaplanmıyor (B06'dan devreden sınır).

---

## B06 — Süspansiyon Kinematiği (2026-11-22)

**Plan:** Rocker-bogie + diferansiyel ve 4 tekerlekli diferansiyelli rocker için analitik, deterministik, testli çözücü; rota, poz izi, worker; SVG şekiller ve belge. Ayrıntı: `docs/KINEMATIK.md`.

### Yapılanlar
- `src/lib/heightfield.ts` (bilinear, normal, eğim), `src/lib/frames.ts` (ENU ↔ three, gövde → dünya), `src/scene/rover/geometry.ts` (2027: `rover_params.yaml`'dan; SummerTech: fotoğraftan tahmin; 4/6 tekerlek).
- `src/scene/rover/kinematics.ts`: 6 bilinmeyen / 6 temas, ileri kinematikle tutarlı Gauss–Newton; güven bölgesi; aktif küme ile eklem limitleri (havadaki teker, gömülme yok).
- `route.ts` (centripetal Catmull-Rom, eşit yay aralığı, yaw sürekliliği), `poseTrack.ts` (Float32Array paket, enterpolasyon, taraf başına tekerlek dönüşü), `src/workers/routeSolver*.ts` + `solveRouteAsync.ts`.
- `tests/plots/kinematics.plot.ts` (`npm run plots`): 6 senaryonun yan görünüş SVG'si (`docs/kinematik/`).

### Ölçümler
- Birim test **45/45** ✓ (kinematik 14: düz, 3 yönde 15° yokuş, 10° yan eğim, basamak, simetrik tümsek, 45/60/80 cm basamak, determinizm, 300 rastgele poz, 4 tekerlek ×3; çekirdek 9: heightfield, çerçeveler, rota, tekerlek dönüşü, geri sarma, worker determinizmi).
- 2048 poz: **83 ms**, en kötü temas artığı 0,18 mm.

### Mükemmellik turları
1. "Her taraf ayrı" yan görünüş yöntemi roll'de ~1,5 cm hata veriyordu → ileri kinematikle tutarlı 6×6 sayısal çözüm.
2. Limit testi beklenmedik biçimde geçmedi: 45 cm basamak limit içinde aşılıyor (fiziksel olarak doğru) → test 60 cm'ye taşındı; denemede iki kusur çıktı: 60 cm'de bir teker 34 mm gömülüyordu, 80 cm'de çözüm ıraksıyordu (roll 552°) → güven bölgesi + aktif küme; iki ayrı regresyon testi.
3. Performans 1358 → 146 → 83 ms (sıcak başlangıç, chord Jacobian, pozlar arası Jacobian).
4. SVG şekillerinde gövdenin 60 cm basamağa girdiği görüldü → gövde–arazi çarpışması belgeye sınır olarak yazıldı; rota planlayıcı engelleri 45 cm altında tutacak (B11).

### Doğrulanmayanlar
- Worker'ın tarayıcıda çalışması henüz bir sahnede denenmedi (B13'te bağlanacak); çekirdek Node'da testli.
- SummerTech ölçüleri fotoğraftan tahmin.

---

## B05 — Önceden HTML Üretimi, SEO, Erişilebilirlik, Gizlilik (2026-11-22)

**Plan:** B04'te bulunan kök nedeni (içerik JS çalışınca çiziliyor) önceden HTML üretimiyle çöz; meta/OG/hreflang/JSON-LD/sitemap; axe testleri; CSP; dış istek denetimi; Lighthouse CI.

### Yapılanlar
- **Önceden üretim:** `src/entry-server.tsx` (SSR) + `tools/prerender.mjs`: 2 dil × 8 sayfa gerçek HTML; tarayıcı `hydrateRoot` ile bağlanır. Tüm sayfalar tek kayıttan (`src/pages/registry.tsx`) gelir; HTML girişleri tek `src/main.tsx`.
- **Dil URL tabanlı:** `/taykut/en/…` (yeni `src/lib/route.ts`). Dil düğmesi diğer dilin aynı sayfasına gider; `?lang=` eski bağlantıları yönlendirilir.
- **Hydrate tutarlılığı:** `useMediaQuery` ilk çizimde sabit değer (HTML ile aynı), sonra gerçek değer; aktif sayfa sunucuda da bilinir (`setRoute`). Konsol hatası denetleyen testler 0 uyuşmazlık gösteriyor.
- **SEO:** sayfa başına başlık/açıklama, kanonik, `hreflang` (tr, en, x-default), Open Graph + Twitter kartı (OG görseli dile göre), JSON-LD (`SportsTeam` → `EducationalOrganization`), `sitemap.xml` (14 adres), `robots.txt`; 404 `noindex`.
- **Erişilebilirlik:** axe testleri (8 sayfa × 2 dil + menü), reduced-motion ve klavye testleri. `docs/ERISILEBILIRLIK.md`.
- **Gizlilik/güvenlik:** CSP (yalnız kendi kaynaklarımız), `referrer` politikası, `tools/check-external.mjs` (CI).
- **CI:** `check:external` ve `lhci` (Lighthouse eşik denetimi, adım özeti tablosu) eklendi.

### Bulunan ve düzeltilen hatalar
1. **Görünen metin ≠ erişilebilir ad** (axe, WCAG 2.5.3): dil düğmesi "TR / EN" görünüp "Dil: English" diye okunuyordu; harita pinleri "01" görünüp "1. Ev Üssü" → adlar görünen metni içeriyor.
2. **Hareket azaltma tercihinde video oynuyordu:** önceden üretilen HTML'deki `autoplay` yüzünden tarayıcı JS'den önce oynatıyordu (yük altında ara sıra kırılan test sayesinde bulundu) → `autoplay` kaldırıldı, oynatma görünürlüğe bağlı ve yalnız JS ile.
3. Lighthouse betiği Windows'ta önizleme sunucusunu kapatamıyordu (kabuk alt süreci) → kabuksuz doğrudan Node.

### Ölçümler
- e2e **127/127** ✓ (yerel; 2 bilinçli atlama: WebKit Tab, mobil klavye) · birim 21/21 ✓ · dış kaynak 0.
- Lighthouse mobil (yerel, `npm run lhci`): ana 94, en 95, rover 91, istasyon 94, mühendislik/takım/sponsor/basın 99–100; **erişilebilirlik, en iyi uygulamalar, SEO 8 sayfada 100**. FCP 0,8–0,9 sn (içerik JS'siz görünüyor). Masaüstü ana sayfa 100 (LCP 0,7 sn).

### Açık kalanlar
- Mobil LCP ~3 sn: kalan süre yavaş ağ simülasyonunda fontlarla bant genişliği yarışı; B22 performans cilasında (font önceliği, kritik alt küme) ele alınacak.
- Ekran okuyucuyla elle deneme yapılmadı (doğrulanmadı).

---

## Ara düzenleme — Menü ve sayfa yapısı (2026-11-22, kullanıcı isteği)

**İstek:** "Siteyle ilgili başlıklar ana sayfadan ziyade yandaki 3 çizgiden yeni yerde açılsın."

### Yapılanlar
- Menü (3 çizgi + "MENÜ" yazısı) artık **her ekran boyutunda**; masaüstü bağlantı satırı kaldırıldı. Tam ekran menü: büyük numaralı başlıklar (Rover, Görevler, Mühendislik, Yer İstasyonu, Takım, Sponsor Ol), yanda kısa tanıtım + Basın kiti + Instagram + koordinat. Açık olan sayfa `aria-current` ile vurgulu.
- Başlıklar **ayrı sayfalarda** açılıyor: `/rover/`, `/muhendislik/`, `/istasyon/`, `/takim/` (takım + yolculuk), `/sponsor/` (logo duvarı buraya taşındı), `/basin/`. "Görevler" ana sayfanın sinematik Dünya turunun parçası olduğu için ana sayfa bölümüne gidiyor.
- Ana sayfa sinematik akışa indi: Hero → Rover → Görevler → Rakamlar → Sponsor çağrısı + 3 keşif kartı (ayrı sayfalara). Kullanılmayan ana sayfa Sponsor bölümü kaldırıldı.
- Bölüm bileşenleri `page` modunda: başlık `h1`, alt başlıklar `h2`, üst çubuğun altından başlar.

### Bulunan ve düzeltilen hatalar
- **Menü görünmüyordu:** üst çubuk kaydırınca `backdrop-filter` kazanıyor; bu, içindeki `position: fixed` menüyü 60 px'lik çubuğa hapsediyordu (panel 0 yükseklik). İlk test menüyü sayfa en üstteyken açtığı için yakalayamadı → menü çubuğun dışına taşındı + **regresyon testi** (kaydırdıktan sonra panel yüksekliği > 300 px).
- Menü açıkken yarı saydam çubuğun arkasından sayfa metni görünüyordu → menü açıkken çubuk opak.
- Ayrı sayfalarda başlık sırası atlıyordu (h1 → h3; Lighthouse a11y 98) → sayfa modunda alt başlıklar h2 (100).

### Ölçümler
- e2e 66/66 ✓ (6 ayrı sayfa için açılış/tek h1/konsol/taşma; menü açma-kapama, odak, sayfa işareti, kaydırılmış menü).
- Lighthouse mobil: ana sayfa 92/100/100/100, mühendislik 100/100/100/100, takım 100/100/100/100, istasyon 96/100/100/100.
- Ekran görüntüleri: `docs/ilerleme/B04/menu-chromium.jpg`, `menu-mobile.jpg`.

---

## B04 — Medya Hattı (2026-11-22)

**Plan:** Kaynak fotoğraflardan tek komutla duyarlı AVIF/WebP setleri, kırpma ve hafif renk derecelendirme, EXIF temizliği, LQIP; `Picture` bileşeni; OG görselleri. Doğrulama: boyut testleri, EXIF testi, Lighthouse.

### Yapılanlar
- `tools/media/build_media.py` (+ `media.config.json`, `npm run assets:media`): kırpma, kontrast 1.04 / doygunluk 0.96 (ekran görüntülerinde kapalı), 480/800/1200/1600 px AVIF (q40) + WebP (q72), 20 px LQIP, hash önbelleği (ikinci çalıştırmada 5/5 "önbellekte"), meta veri yazılmaz. **Neden Python:** Akıllı Uygulama Denetimi sharp/libvips ve ffmpeg ikililerini engelliyor; Pillow 13 AVIF destekliyor.
- Kaynak seçimi: eski klasördeki `rover-day`/`rover-night` kullanıcının fotoğraflarının kopyası çıktı (piksel farkı ortalama 2–3); gündüz için kullanıcının JPG'si, gece için daha büyük 1800 px sürüm seçildi. Dijital ikiz kırpması yapılandırmaya işlendi.
- `src/components/Picture.tsx`: `<picture>` AVIF → WebP, `srcset` + gerçekçi `sizes`, en/boy (CLS), LQIP arka planı, `priority`. Tüm sayfalar geçirildi; `src/assets/photos` kaldırıldı.
- `tools/media/og.py` (`npm run assets:og`): `public/og-tr.jpg`, `og-en.jpg` (1200×630; fotoğraf + TAYKUT + slogan + sonuç + logo plakası; Türkçe harfler latin-ext font parçasından).
- Hero için HTML'de `<link rel="preload" as="image">` (srcset'in manifestle aynı olduğunu test denetliyor).

### Ölçümler
- Hero AVIF: 480 px 29 KB, 800 px 76 KB, 1200 px 155 KB (önce tek dosya 480 KB JPEG).
- Lighthouse mobil: rover 78 → **94** (LCP 5,9 → 3,1 sn), ana sayfa **90** (LCP 3,5 sn), basın 100; masaüstü ana sayfa **100** (LCP 0,8 sn).
- Birim test 21/21 ✓ (EXIF yok, tüm genişlikler mevcut, boyut sınırları, preload eşleşmesi) · e2e 47/47 ✓.

### Mükemmellik turları
1. AVIF q52'de hero 1200 px 251 KB → q40'a inildi (155 KB), görsel fark gözle seçilmiyor (regolit dokusu korunuyor).
2. Ana sayfa mobil puanı görseller iyileşince 100'den 90'a **düştü**: önceden LCP öğesi metindi; şimdi doğru öğe (hero görseli) ölçülüyor. LCP dökümü: görsel yükleme gecikmesi 36 ms, ama **çizim gecikmesi** baskın → kök neden istemci tarafı çizim (görsel React çalışınca DOM'a giriyor). Preload tek başına yetmiyor.

### Açık kalanlar
- **Önceden HTML üretimi (prerender + hydrate)** B05'in ilk adımı: LCP'yi ve JS'siz okunabilirliği kökten çözer.
- Video yeniden kodlanmadı (ffmpeg engelli); mevcut 1,6 MB MP4 `preload="none"` ile yalnız görünürken iner. Blender ile yeniden kodlama B22'de değerlendirilecek.

---

## B03 — 3D'siz Eksiksiz Site (2026-11-21)

**Plan:** Tüm bölümleri ve alt sayfaları gerçek içerik ve fotoğraflarla, 3D olmadan yayınlanabilir kalitede kur; 3D sahnelerin geleceği alanları (`data-3d-slot`) ayır. Doğrulama: e2e testleri (bölümler, gezinme, mobil menü, alt sayfalar, taşma), Lighthouse, üç ekran boyutunda görüntü.

### Yapılanlar
- Düzen: `Nav` (masaüstü bağlantılar + TR/EN + her zaman görünür "Sponsor Ol"; mobilde odak tuzaklı, Esc ile kapanan tam ekran menü), `ProgressRail` (≥ 1280 px), `Footer` (atıflar `attributions.ts`'ten), `Page`, "İçeriğe atla".
- Bölümler: Hero (gerçek saha fotoğrafı, telemetri şeridi), Rover (12 parça), Görevler (kendi SVG dünya haritası + 6 görev satırı; 3D gelene kadar topoğrafik kart), Rakamlar (tür notlarıyla), Mühendislik (5 alt sistem + dijital ikiz kanıt paneli), Yer İstasyonu (gerçek istasyon videosu, dürüstlük notu), Yolculuk, Takım (7 üye + danışman, kendi çizdiğimiz amblemler), Sponsor.
- Alt sayfalar: `/sponsor/` (kademeler, logo yerleşimi, SSS), `/rover/` (iki rover'ın tür etiketli teknik tablosu; 2027 değerleri dijital ikizden otomatik), `/basin/` (kısa/uzun tanıtım, logo indirme, fotoğraflar), `404.html`.
- `tools/map/build_worldmap.mjs`: Natural Earth (kamu malı) verisinden 47 KB SVG harita (JS paketine girmez).
- Dijital ikiz görseli Gazebo arayüzünden temizlendi (pencere çubuğu, ikonlar, oynatma düğmeleri kırpıldı; kırpma B04'te medya yapılandırmasına işlenecek).
- Sayfa başına başlık (`setPageTitle`), çok sayfalı Vite derlemesi.

### Ölçümler
- Birim 17/17 ✓ · e2e 47/47 ✓ (yerel; Firefox CI'da).
- Lighthouse (mobil, yerel önizleme): ana sayfa **100 / 100 / 100 / 100** (LCP 0,9 sn, CLS 0,016); sponsor 100/100/100/100; basın 100/100/100/100; rover **78**/100/100/100 (LCP 5,9 sn → B04). Masaüstü ana sayfa 96/100/100/100 (LCP 1,4 sn).
- İlk yük (gzip) 98,6 KB / 250 KB; fontlar 158 KB / 180 KB.

### Mükemmellik turları
1. **Masaüstü görüntüler:** bölüm boşlukları ~350 px'ti → `--section-gap` küçültüldü; 3D'siz bölge kutuları sönüktü → topoğrafik kart (eş yükselti çizgileri + hedef işareti + bölge adı); tembel görseller tam sayfa çekimde boş çıkıyordu → `tools/shots.mjs` sayfayı kaydırıp çekiyor (anlık kaydırma ile).
2. **Mobil görüntüler:** `span-7`/`span-3` ızgara sınıfları tanımsızdı, Rover metni 1/12 sütuna sıkışıyordu → tanımlandı + **regresyon testi** (`grid.test.ts`); boş logo duvarı mobilde 4 kutu → 1 kutu.
3. **Testlerin bulduğu gerçek hatalar:** (a) mobilde Drumheller ve Utah pinleri üst üste biniyordu, dokunulamıyordu → mobilde pinler görsel işaret, gezinme bölge listesinden; (b) bu listenin `nowrap` metni sayfayı 412 → 639 px'e itiyordu ve mobil tarayıcı sayfayı uzaklaştırıyordu; eski taşma testi bunu **yakalayamıyordu** (`innerWidth` de büyüyor) → test gerçek ekran genişliğine (`viewportSize`) göre yeniden yazıldı, ızgara `minmax(0, 1fr)`.
4. **Lighthouse:** mobil pinler 14 px dokunma hedefi sayılıyordu (a11y 96) → mobilde bağlantı değil, `aria-hidden` görsel → 100. Rover sayfasında üstteki görsel `loading="lazy"` idi → öncelikli yapıldı; asıl sorun 480 KB tek boyutlu JPEG (B04).
5. Hero'daki "MRC 2026 · 4. GENEL" Türkçede ters sıralıydı ve koordinatlar İngilizce yazılıyordu → içerikten "Genel 4.", koordinat dile göre (K/D).

### Eleştiri listesi cevapları
- *3D olmadan ilk ekran etkileyici mi?* Evet: gerçek rover fotoğrafı, dev geniş başlık, telemetri şeridi (ekran görüntüleri `docs/ilerleme/B03/`, Lighthouse özeti `lighthouse.md`).
- *Sponsor bilgisine kaç tıkla?* 1 (üst çubuk ve hero düğmesi; e2e testli).
- *Mobilde başparmakla ulaşılabilir mi?* Dokunma hedefleri ≥ 44 px; mobil menü ve bölge listesi.

### Doğrulanmayanlar / açık kalanlar
- Rover sayfası mobil LCP 5,9 sn: B04'te duyarlı görsellerle çözülecek.
- Lighthouse Windows'ta Playwright Chromium'u başlatamıyor (Akıllı Uygulama Denetimi); ölçümler yüklü Chrome ile alındı. CI'da Lighthouse B05'te kurulacak.
- `?grid=1` ızgara kaplaması henüz bağlanmadı.

---

## B02 — İçerik (2026-11-21)

**Plan:** Tüm metinleri tip güvenli tek yerde topla (TR/EN), dilden bağımsız gerçekleri kaynak ve tür etiketleriyle ayır, kaynak belgesini doldur, dil altyapısını kur, 2027 rover değerlerini dijital ikizden otomatik çıkar. Doğrulama: tip denetimi (TR/EN şema eşitliği), içerik testleri, kaynak anahtarı testi, dil değişimi e2e.

### Yapılanlar
- `src/content/schema.ts` (tek `Content` tipi + kimlik listeleri), `tr.ts`, `en.ts` (`satisfies Content`).
- Dilden bağımsız veri: `facts.ts` (her değer `kind` + `source`), `team.ts` (7 üye + danışman, roller bilinmiyor → null), `contact.ts` (e-posta `TODO_EMAIL`, telefon yok), `regions.ts` (6 bölge; MRC 2026 konumu `null`, uydurulmadı).
- `tools/rover/extract_params.mjs` → `src/content/rover2027.generated.json` (`npm run content:rover`); `# VARSAYIM` yorumları `assumption`, diğerleri `design-target`.
- `src/lib/i18n.ts`: `?lang` → kayıtlı tercih → tarayıcı dili; yenilemesiz dil değişimi; `<html lang>`, başlık, meta güncellenir; Türkçede ondalık virgül; İngilizce sıra sayıları; `kindNote` (sonuç ve ölçümde not gizli).
- `docs/ICERIK_KAYNAKLARI.md`: 25 kaynak satırı.

### Kaynaklardan öğrenilen ve sitede korunan dürüstlük ayrıntıları
- Hız 0.58 m/s **yüksüz tahmin**, ölçülmedi; menzil ~1200 m **teorik**; ~35 dk **%80 deşarj varsayımlı hesap** ([GB]).
- Dijital ikiz kanıtı **simülasyon** (gerçek arazi verisinde), fiziksel test değil → metin buna göre yazıldı ("Gerçek arazideki testte" yanıltıcı bulunup düzeltildi).
- MRC final yeri bilinmiyor → sitede yer adı yazılmadı.

### Ölçümler
- Birim test 16/16 ✓ (TR/EN yapı eşitliği, boş metin yok, yasak ifade yok, 7 üye, kaynak anahtarlarının tamamı belgede, sıra sayıları, ondalık biçimi, YAML çıkarımı) · e2e 9/9 ✓ (dil değişimi dahil).

### Mükemmellik turları
1. YAML okuyucu `geometry:  # yorum` satırında yorumu değer sanıyordu → düzeltildi, fikstürlü test eklendi.
2. Birimler dile göre değişmiyordu (dk/min, 4./4th) → `units` + `ordinal` biçimleme.
3. Birim testlerdeki Node API'si uygulama tiplerine sızıyordu → ayrı `tsconfig.test.json`.
4. Metin gözden geçirme: abartı ifadesi yok; her bölüm başlığı ≤ 6 kelime; İngilizce metin çeviri değil doğal karşılık.

### Açık kalanlar / doğrulanmayanlar
- **İsim yazımı teyidi:** GitBook ekip sayfasında "Mehmet Reveha Emuce" ve "Mehmet Emir Erdeoğmuş" yazıyor; kullanıcının listesi "Revaha" ve "Erdoğmuş". Kullanıcının yazdığı kullanılıyor; açık sorulara eklendi.
- Üye rolleri, e-posta, sponsor kademe tutarları: açık soru.
- Metin içine gömülü sayılar (ör. "8.05 A") ayrı `Fact` değil; kaynakları belgede anahtarla (`st-energy`, `twin-diff`) duruyor. Otomatik "metindeki her sayıyı bul" denetimi yapılmadı.

---

## B01 — Tasarım Sistemi (2026-11-21)

**Plan:** Renkleri logodan ve fotoğraftan ölç, OKLCH ölçekleri ve anlamsal belirteçler kur, kontrastı betikle denetle; fontları seç ve Türkçe için alt kümele; ızgara/boşluk/hareket belirteçleri; bileşenler ve ikonlar; vitrin sayfası. Doğrulama: kontrast betiği, tip/lint/test, üç ekran boyutunda görüntü, font bütçesi. Ayrıntılar: `docs/TASARIM.md`.

### Yapılanlar
- Ölçülen renkler: logo laciverti `#01234A`, logo turuncusu `#D15B09`, tekerlek sarısı `#E7AD01`. Turuncu = eylem, sarı = veri/HUD.
- `tools/design/palette.mjs` (OKLCH ölçekleri, marka renkleri birebir sabit) + `tools/design/color.mjs` (dönüşüm ve WCAG; birim testli).
- `tools/check-contrast.mjs`: 21 çift, CI adımı eklendi.
- Fontlar: Archivo (geniş) / Inter / JetBrains Mono; `tools/fonts/subset.py` ile Türkçe alt kümeleme ve otomatik `fonts.css`.
- Bileşenler: Button, HudFrame, SectionHeader, StatusBadge, Tag, KindNote, Stat, Divider, Logo, Icon (16 ikon).
- `tools/brand/logo_alpha.py`: logonun yalnız siyah arka planı şeffaf (renkler birebir).
- `tools/shots.mjs`: üç ekran boyutunda ekran görüntüsü aracı.
- Vitrin: `/taykut/vitrin/` (yalnız geliştirme).

### Ölçümler
- Kontrast: 21/21 ✓ (en düşük gövde metni çifti: turuncu metin kart üstünde 4.70:1).
- Font yükü: 6 dosya, 158.4 KB / 180 KB (alt kümeleme öncesi ~330 KB).
- İlk yük (gzip): 69.7 KB / 250 KB; CSS 3.1 KB gzip.
- Birim test 4/4 ✓.

### Mükemmellik turları
1. **Tur 1 bulguları:** (a) `--line-strong` 2.05:1 → `--neutral-600` (3.3:1). (b) Türkçe sayfada büyük harf İngilizce adları bozuyor ("--LİNE") → `Tag` varsayılan `lang="en"`, kural TASARIM.md'ye yazıldı. (c) Font karşılaştırmasında `.t-display` sınıfı adayı eziyordu, karşılaştırma yanıltıcıydı → düzeltilip yeniden bakıldı. (d) Latin-ext font aralığı latin ile çakışıyordu → çakışmasız aralıklar. (e) Vite küçük font parçalarını CSS'e gömüyordu → `assetsInlineLimit` ile kapatıldı.
2. **Tur 2 bulguları (mobil 375 px):** (a) vitrindeki renk ölçeği 13 px yatay taşma yapıyordu → `minmax(0, 1fr)`. (b) `.grid` satır aralığı yoktu, mobilde kartlar birbirine yapışıyordu → `row-gap` eklendi. (c) İkon kutuları eşit yükseklikte değildi → düzeltildi.
3. **Tur 3:** Masaüstü/tablet/mobil yeniden çekildi; düzeltilecek yeni kusur bulunmadı.

### Eleştiri listesi cevapları
- *Başka bir rover takımına da uyar mı?* İmza öğeleri TAYKUT'a özgü: logodan gelen turuncu, kendi tekerleklerinden gelen sarı, köşe işaretli HUD dili, `01 /` numaralandırma, geniş Archivo başlıklar. Gerçek kompozisyonla (B03) yeniden değerlendirilecek.
- *Üçten fazla vurgu?* Hayır: turuncu (eylem) + sarı (veri); durum renkleri yalnız durumda.
- *HUD dili oyun arayüzü gibi mi?* Neon/parlama yok, 1 px çizgi ve mono etiketler; mühendislik çizimi tonunda.

### Doğrulanmayanlar
- Kritik font preload'u henüz yok (gerçek sayfa düzeni B03'te kurulunca eklenecek).
- Vitrin yalnız Chromium'da gözle kontrol edildi.

**Plan:** Vite + React + TypeScript strict iskeleti, ESLint/Prettier, Vitest, Playwright, bütçe ve dosya boyutu denetimi, CI + GitHub Pages yayını. Doğrulama: yerel komutlar + CI yeşil + canlı adres 200.

### Seçilen sürümler (2026-11-21, `npm view` ile doğrulandı)
| Paket | Sürüm | Not |
|---|---|---|
| react / react-dom | 19.3.1 | `@react-three/fiber` 9 peer: `react >=19 <19.4` |
| vite | 8.3.8 | |
| @vitejs/plugin-react | 6.3.0 | peer `vite ^8` |
| typescript | **6.0.3** | En güncel 7.0.2 ama `typescript-eslint` 8.73 peer `>=4.8.4 <6.1.0` istiyor |
| eslint / @eslint/js | **9.39.5** | En güncel 10.x ama `eslint-plugin-jsx-a11y` 6.10.2 peer en fazla `^9` |
| typescript-eslint | 8.73.0 | |
| eslint-plugin-react-hooks | 7.1.1 | |
| vitest / jsdom | 5.1.1 / 31.0.1 | |
| @playwright/test | 1.65.1 | |
| Node | 26 (`.nvmrc`) | Kasım 2026 itibarıyla LTS |
| GitHub Actions | checkout v7, setup-node v7, cache v6, upload-artifact v7, upload-pages-artifact v5, deploy-pages v5 | `gh api .../releases/latest` ile doğrulandı |

### Sapmalar (prompttan farklı kararlar ve nedenleri)
- **Tek iş akışı:** Prompt `ci.yml` + `deploy.yml` diyordu. Bunun yerine `ci.yml` içinde `deploy` işi `needs: check` ile bağlandı. Kırmızı testin yayına çıkmasını yapısal olarak imkânsız kılıyor ve ayrı `workflow_run` tetiklemesinden daha basit.
- **Firefox yerelde yok:** Bu bilgisayarda Windows Akıllı Uygulama Denetimi imzasız Playwright Firefox'unu engelliyor (`spawn UNKNOWN`). Güvenlik ayarına dokunulmadı. Firefox projesi yalnız CI'da (`process.env.CI`) çalışır.
- **`baseUrl` kaldırıldı:** TypeScript 6'da kullanımdan kalktı; `paths` tek başına kullanılıyor.

### Ölçümler (yerel)
- typecheck ✓ · lint ✓ · birim test 1/1 ✓ · e2e 6/6 ✓ (chromium, webkit, mobil)
- İlk yük (gzip): 67.0 KB / sınır 250 KB · dist toplam 1.21 MB (kaynak haritaları dahil)

### CI ve yayın
- GitHub Actions çalıştırması `44932029434`: `check` ✓ (Firefox dahil 8/8 e2e) → `deploy` ✓. Toplam 1 dk 43 sn (hedef < 6 dk).
- `https://keremsumer2010-tech.github.io/taykut/` → HTTP 200; smoke testleri canlı adrese karşı (chromium + mobil) 4/4 ✓.

### Mükemmellik turu
- **Kırmızı test yayına sızabilir mi?** Hayır: `deploy` işi `needs: check` ile bağlı, `check` içindeki herhangi bir adım kırılırsa `deploy` hiç başlamaz. Bu yapısal bir garanti olduğu için ayrı dalda bozuk test denemesi yapılmadı (dal push'ları zaten yayınlamaz, deneme bir şey kanıtlamazdı).
- **`base` yolu:** favicon, 404 dönüş linki ve derlenen varlıklar `/taykut/` önekiyle çalışıyor (canlı testte 400+ yanıt yok).
- **Satır sonları:** `.gitattributes` `eol=lf`; B01 commit'inde `git add --renormalize` ile eski dosyalar da düzeltilecek.

### Doğrulanmayanlar
- Firefox yerelde çalıştırılamıyor (Akıllı Uygulama Denetimi); yalnız CI'da doğrulandı.
