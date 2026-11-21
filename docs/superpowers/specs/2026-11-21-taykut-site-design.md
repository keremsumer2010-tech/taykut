# TAYKUT Web Sitesi — Tasarım Belgesi

- **Tarih:** 2026-11-21
- **Depo:** `keremsumer2010-tech/taykut`
- **Yayın adresi (hedef):** https://keremsumer2010-tech.github.io/taykut/
- **Durum:** Taslak, Kerem'in onayını bekliyor. Onaydan sonra bu belgeden adım adım uygulama planı (`docs/superpowers/plans/`) çıkarılacak.

Etiketler: **[Kerem]** = kullanıcının verdiği karar. **[Claude]** = benim verdiğim karar; itiraz edilirse değişir. **[AÇIK]** = cevap bekleyen soru.

---

## 1. Amaç ve neden

TAYKUT, Ankara ASELSAN Mesleki ve Teknik Anadolu Lisesi'nden bir lise rover takımı. MRC 2026 başvuru videosunda 1., finalde genel 4. oldu ve 2027'de CIRC (Drumheller, Kanada) ile diğer uluslararası yarışmaları hedefliyor.

Site üç işi görecek, önem sırasıyla:

1. **Sponsor kazanmak.** Sponsor siteye girdiği ilk 10 saniyede "bu çocuklar ciddi mühendislik yapıyor" demeli ve sponsor sayfasına kadar gitmeli.
2. **Yarışma jürisine ve organizasyonlara güven vermek.** Başvuru belgelerinde link olarak verilecek. Teknik derinlik gerçek ve doğrulanabilir olmalı.
3. **Takımın kimliği ve gururu.** Yeni üye çekmek, okul ve basın için vitrin olmak.

Deneyim hedefi **[Kerem]:** NASA/JPL sitelerinin ayrıntı seviyesi ve Awwwards "Site of the Day" kalitesi. Açılışta rover görünecek, ardından Dünya haritasında farklı yerlere gidip her yerde gerçek araziye uygun görevler yapacak. Bu sırada süspansiyon ve sürüş gerçekçi şekilde çalışacak.

## 2. Hedefler, hedef olmayanlar, anti-hedefler

### Hedefler
- Sinematik açılış → rover tanıtımı → 3D Dünya → görev bölgeleri → takım ve sponsor akışı.
- Rocker süspansiyonun araziye göre gerçekten eğildiği, tekerleklerin zemine bastığı, iz ve toz bıraktığı sürüş.
- Gerçek yükseklik verisinden üretilmiş arazi parçaları (Drumheller zaten elimizde).
- 3D olmadan da bütün içeriğin okunabildiği bir site (yedek mod, erişilebilirlik, SEO).
- Türkçe ve İngilizce.
- **Tamamen ücretsiz** **[Kerem]:** hosting, kütüphane, veri, font, ses, analitik ve form dahil hiçbir şey para gerektirmeyecek. Kredi kartı isteyen servis de kullanılmayacak.

### Hedef olmayanlar
- Blog için CMS veya yönetim paneli (ilk sürümde içerik kodda veya JSON'da duracak).
- Online bağış ve ödeme alma.
- Gerçek zamanlı rover telemetrisi (yer istasyonu ayrı bir proje).
- Mobilde masaüstüyle aynı görsel kalite (mobil kendi kalite kademesinde çalışacak).

### Anti-hedefler (teknik olarak çalışsa bile başarısızlık sayılır)
- **Efekt içeriği örterse.** Sponsor 3D'ye takılıp sponsor bölümünü bulamıyorsa site başarısızdır. Her bölümde atlama ve menü her zaman erişilebilir olacak.
- **Uydurma veri.** Yarışma sonucu, ölçü, hız, kütle gibi her sayı kaynağa dayanacak. Tahminler "tahmin" diye etiketlenecek.
- **Yavaş açılış.** İlk anlamlı görüntü 2.5 saniyeyi geçerse ziyaretçi kaçar. Ağır 3D içerik sonradan yüklenecek.
- **Hazır şablon görüntüsü.** Bootstrap veya hazır tema hissi olmayacak; tipografi, ızgara ve hareket dili TAYKUT'a özel olacak.
- **Başka sitenin kopyası.** NASA, SpaceX veya ödüllü sitelerden fikir alınabilir ama görsel, model ve kod kopyalanmayacak.
- **Logo ve marka bozulması.** SummerTech/TAYKUT logosu oranı ve rengi değiştirilmeden kullanılacak.

## 3. Kısıtlar

| Kısıt | Ayrıntı |
|---|---|
| Bütçe | 0 TL **[Kerem]** |
| Hosting | GitHub Pages, GitHub Actions ile otomatik yayın. Depo herkese açık. |
| Depo boyutu | GitHub Pages sitesi ≤ 1 GB, tek dosya < 100 MB. Ağır varlıklar sıkıştırılacak. Git LFS kullanılmayacak (Pages LFS dosyalarını sunmuyor). |
| Ekip | Kodu ağırlıklı olarak Claude yazacak, Kerem yönlendirecek. Bakım lise öğrencilerinin anlayacağı sadelikte olmalı. |
| Lisans | Kod MIT. Fotoğraf, logo ve metinler "tüm hakları TAYKUT'ta". Üçüncü taraf veri ve varlıkların lisansları `docs/VARLIKLAR.md` dosyasında tek tek listelenecek. |
| Cihaz | Masaüstü Chrome, Edge, Firefox ve Safari'nin son iki sürümü; iOS Safari 16+ ve Android Chrome. WebGL2 yoksa yedek mod. |

## 4. Teknoloji yığını [Claude]

Hepsi açık kaynak ve ücretsiz:

| Katman | Seçim | Neden |
|---|---|---|
| Derleme | **Vite** + **TypeScript** | Hızlı geliştirme, kod bölme, GitHub Pages'e statik çıktı |
| Arayüz | **React 19** | Bölümler, dil, durum yönetimi. `@react-three/fiber` 9 React 19 istiyor (2026-11-21 kontrol edildi). |
| 3D | **three.js** + **@react-three/fiber 9** + **@react-three/drei 10** | Endüstri standardı, geniş ekosistem |
| Son işlem | **postprocessing** (pmndrs) | Bloom, alan derinliği, renk derecelendirme (LUT), film grain, vinyet |
| Fizik (sadece "Sen Sür" modu) | **@react-three/rapier** | WASM ile hızlı, eklem (joint) desteği var |
| Kamera koreografisi | **Theatre.js** (`@theatre/core` Apache-2.0; Studio sadece geliştirmede). `@theatre/r3f` fiber 8 istediği için **kullanılmaz**; Theatre nesneleri elle bağlanır. | Sinematik kamera ve nesne hareketlerini zaman çizelgesinde düzenleme |
| Scroll ve animasyon | **GSAP** (ScrollTrigger, SplitText; 2025'ten beri tüm eklentiler ücretsiz) + **Lenis** | Yumuşak scroll ve scroll'a bağlı anlatı |
| Durum | **Zustand** | Sahne, görev ve dil durumu için küçük ve basit |
| Ses | **Howler.js** | Ortam sesi, efektler, ses açma/kapama |
| Varlık hattı | **gltf-transform** (Meshopt + KTX2/Basis), **Blender** (Python betikleri) | Küçük dosya, hızlı yükleme |
| Kalite kademesi | **detect-gpu** | Cihaza göre otomatik kalite seçimi |
| Test | **Vitest** (mantık), **Playwright** (duman testi + ekran görüntüsü), **Lighthouse CI** | Kanıtla bitirme |
| Font | Google Fonts / Fontsource (OFL lisanslı) | Ücretsiz, kendimiz sunarız |
| Analitik | **GoatCounter** (ücretsiz, çerezsiz) veya hiç | Çerez banner'ı gerekmez **[AÇIK: istiyor musun?]** |
| İletişim | `mailto:` + Instagram (@teamtaykut) | Form servisi yok, hesap yok, ücret yok |

Bilinçli olarak kullanılmayacaklar:
- **Google Photorealistic 3D Tiles:** API anahtarı ve faturalandırma hesabı istiyor, kullanım şartları kısıtlayıcı. Ücretsizlik kuralına aykırı.
- **Cesium ion:** Ücretsiz katmanı var ama hesap ve token gerektiriyor. Kendi arazi parçalarımız yeterli.
- **Ücretli 3D model mağazaları:** Rover, kendi CAD ve Blender modelimizden gelecek.
- **Mevcut `taykut-site` klasörü:** Sıfırdan yeni depo kararı alındı **[Kerem]**. O klasördeki fotoğraf ve video dosyaları ve metin içeriği kaynak olarak taşınacak, kodu kullanılmayacak.

## 5. Bilgi mimarisi

Tek sayfalık sinematik ana akış ve birkaç sade alt sayfa olacak.

### 5.1 Ana sayfa akışı (`/`)

| # | Bölüm | Ne olur | 3D sahne |
|---|---|---|---|
| 00 | **Boot** | Görev kontrol tarzı açılış ekranı: "SİSTEM AÇILIYOR → IMU → GPS → ROVER ÇEVRİMİÇİ". Gerçek yükleme yüzdesine bağlı, en fazla 4 sn sürer. | Arka planda varlıklar yüklenir |
| 01 | **Hangar / İlk Görüş** | Karanlıkta tek spot ışığı. Rover yavaşça görünür, kamera tekerlekten gövdeye süzülür. TAYKUT yazısı ve tek cümlelik slogan çıkar. | Stüdyo sahnesi |
| 02 | **Rover İnceleme** | Scroll ile rover dönüyor, parçalar patlatılmış görünümde ayrılıyor. Etiket çizgileri her parçayı gösteriyor (tekerlek, rocker, diferansiyel, kol, kamera, kartlar, batarya). Ziyaretçi sürükleyerek döndürebiliyor. | Stüdyo sahnesi |
| 03 | **Kalkış → Dünya** | Kamera geri çekilir, stüdyo kararır, yörüngeden Dünya görünür. Atmosfer parlaması, gece-gündüz çizgisi ve şehir ışıkları. | Küre sahnesi |
| 04 | **Görev Haritası** | Kürede görev noktaları ve aralarında yay çizen uçuş rotaları. Scroll veya tıklama ile sıradaki göreve gidilir. | Küre sahnesi |
| 05..N | **Görev Bölgeleri** (her biri ayrı bölüm) | Küreden araziye dalış. Rover o bölgenin görevini yapar: sürüş, süspansiyon, kol hareketi. HUD telemetri akar. Görev bitince araziden küreye çıkılır. | Arazi sahnesi |
| — | **Sen Sür** (isteğe bağlı) | Görev bölgesinde "Kontrolü al" düğmesi. Klavye veya dokunmatik ile rover sürülür. | Arazi sahnesi + fizik |
| N+1 | **Rakamlar** | Sayaçlarla gerçek veriler (yarışma sıralaması, ölçüler, çalışma süresi). | 3D yok veya hafif |
| N+2 | **Mühendislik** | Alt sistem kartları: Mekanik, Elektronik, Yazılım/Otonomi, Kol, Bilim. Dijital ikiz ve yer istasyonu vitrini (video). | Hafif |
| N+3 | **Yolculuk** | Zaman çizelgesi: Kas 2025 kuruluş → MRC 2026 → 2027 hedefleri. | Yok |
| N+4 | **Takım** | 7 üye kartı ve danışman. | Yok |
| N+5 | **Sponsor Ol** | Kademeler, sponsor dosyası (PDF), logo duvarı, iletişim. | Yok |
| N+6 | **Altbilgi** | Okul, danışman, sosyal medya, dil, lisans notları. | Yok |

### 5.2 Alt sayfalar
- `/sponsor` — Ayrıntılı sponsorluk paketi ve indirilebilir PDF (sponsor sunumlarında doğrudan link verilecek).
- `/rover` — Teknik özellik tablosu, model sürümleri (MRC 2026 rover ve 2027 rover), tasarım raporlarına linkler.
- `/basin` — Basın kiti: logo dosyaları, takım fotoğrafı, kısa tanıtım metni.
- `/en/...` — İngilizce karşılıkları (veya dil düğmesi + `?lang=en`, bkz. 9.3).

## 6. Sinematik deneyim — ayrıntılar

### 6.1 Boot (00)
- Siyah ekranda ince monospace satırlar ve sağda "OK" onayları. Satırlar gerçek yükleme olaylarına bağlı (model geldi, arazi geldi, ses hazır).
- Alt köşede UTC saati ve Ankara koordinatı: `39.93°N 32.86°E`.
- Bitiş: yatay bir tarama çizgisi ekranı açar ve Hangar sahnesine geçilir.
- `prefers-reduced-motion` açıksa Boot atlanır.

### 6.2 Hangar ve Rover İnceleme (01–02)
- Işık: tek sert üst spot ve hafif mavi kenar ışığı (rim light); zeminde yumuşak gölge (ContactShadows veya baked AO).
- Malzemeler: alüminyum profil (anizotropik metal), TPU tekerlek (mat, hafif subsurface), 3D baskı parçalar (katman çizgisi normal map), PCB (yeşil maske ve altın ped).
- Patlatılmış görünüm: Her parçanın montaj yönü elle tanımlanır (`explode.json`). Scroll 0→1 arasında parçalar kendi yönünde ayrılır ve etiketler belirir.
- Etiket sistemi: 3D noktadan ekrana çekilen ince çizgi ve kartta parça adıyla tek satır özellik. Ekran dışına taşarsa otomatik yer değiştirir.
- Etkileşim: Sürükleyerek döndürme (sınırlı açı), çift tık ile sıfırlama, "Gece modu" ile farlar ve ArUco kamerası ışıkları.

### 6.3 Dünya küresi (03–04)
- Kendi three.js küremiz olacak (MapLibre değil), çünkü kamera ve ışık tamamen kontrolümüzde olmalı.
- Dokular: NASA Blue Marble (gündüz), NASA Black Marble (gece ışıkları), su maskesi ile okyanus parlaması (specular) ve bulut katmanı. Hepsi NASA kaynaklı, kamu malı.
- Atmosfer: Rayleigh benzeri kenar parlaması için özel shader.
- Gece-gündüz çizgisi gerçek tarihe göre hesaplanabilir, ya da sabit güzel bir açı seçilir **[Claude: sabit açı; gerçek zaman isteğe bağlı]**.
- Görev pinleri: Yere saplanmış ince ışık sütunu, nabız halkası ve hover'da görev adı.
- Uçuş: Bir noktadan diğerine büyük daire yayı. Kamera yayı takip eder, rover ikonu yay üzerinde ilerler.
- Dalış: Kamera noktaya yaklaşırken küre dokusundan arazi sahnesine çapraz geçiş (bulut katmanından geçme efekti ile).

### 6.4 Görev bölgeleri (05..N)

Her bölge aynı şablonu kullanır: `arazi + gökyüzü/ışık + hava efekti + rover rotası + görev olayları + HUD metinleri`. Bölge eklemek bir veri dosyası eklemek kadar kolay olmalı (`src/missions/<bolge>.ts`).

Önerilen bölgeler **[Claude, AÇIK: sıralamayı ve listeyi onayla]**:

| Sıra | Bölge | Neden orası | Arazi verisi (ücretsiz) | Görev senaryosu |
|---|---|---|---|---|
| 1 | **Ankara — Ev Üssü** | Takımın evi; hikâyenin başlangıcı | Copernicus GLO-30 DEM | Kısa test sürüşü, ArUco ile kalibrasyon |
| 2 | **MRC 2026 parkuru** | Gerçek başarımız (4.lük) | Gerçek saha bilinmiyor, stilize regolit parkuru **[AÇIK: MRC 2026 nerede yapıldı?]** | MRC'deki 3 gerçek görev: Otonom ArUco, Sondaj, Gece ve Enerji |
| 3 | **Drumheller, Kanada — CIRC** | 2027 ana hedefi; dijital ikiz arazisi elimizde | NRCan HRDEM 1 m (OGL-Canada-2.0) — `Rover_Dijital_Ikiz/terrain` | Bilim (numune), ekipman bakımı, teslimat, otonom navigasyon |
| 4 | **İsviçre Alpleri — Alpine/Swiss Rover Challenge** | Kerem'in örneği; dağlık arazi süspansiyonu en iyi gösterir | swissALTI3D (swisstopo, açık veri) | Kayalık yamaç tırmanışı, kar ve kaya geçişi, bakım görevi |
| 5 | **Utah, MDRS — URC** | Dünyanın en bilinen üniversite rover sahası; Mars benzeri | USGS 3DEP 1 m (kamu malı) | Kırmızı arazide uzun mesafe otonom geçiş |
| 6 | **Final: Mars, Jezero Krateri** | "Bir gün oraya" hayali; NASA bağlantısı | NASA HiRISE DTM (kamu malı) | Perseverance izinde kısa sürüş, Dünya'ya selam. Kapanış sahnesi. |

Kural: Gerçek yarışmalarda yapılan görevler gerçek kural kitaplarına göre anlatılacak. Katılmadığımız yarışmalarda "hedef" veya "hazırlanıyoruz" dili kullanılacak, katılmış gibi yazılmayacak.

Her bölgenin görsel kimliği:
- **Drumheller:** Badlands katmanlı kil tepeleri, öğleden sonra sıcak ışığı, rüzgârla taşınan ince toz.
- **Alpler:** Soğuk mavi ışık, kar lekeleri, kaya ve çakıl, uzakta sis, nefes buharı gibi ince sis parçacıkları.
- **Utah:** Kızıl kumtaşı, sert öğle güneşi, ısı dalgalanması (heat shimmer) efekti.
- **Mars:** Somon renkli gökyüzü, düşük kontrast, ince toz şeytanı (dust devil).
- **MRC:** Gece sahnesi, rover farları, ArUco kartı ışıkları.

### 6.5 Rover simülasyonu — süspansiyon ve sürüş

İki mod olacak **[Claude]**:

**A) Sinematik mod (varsayılan, scroll'a bağlı): kinematik çözücü.**
- Rover, rota eğrisi üzerinde ilerler (Catmull-Rom spline ve görev olayları).
- Her tekerlek için aşağı doğru ışın atılır ve arazi yüksekliği okunur (heightfield'dan çift doğrusal örnekleme).
- **Rocker-bogie çözümü (6 tekerlek):** Bogie açısı orta ve arka tekerlek yüksekliklerinden bulunur. Rocker açısı ön tekerlek ile bogie pivotundan bulunur. Sağ ve sol rocker açılarının ortalaması **diferansiyel** ile gövde eğimini (pitch) verir. Gövde yuvarlanması (roll) sağ-sol farkından gelir. Bunu analitik ve deterministik çözmek, her scroll pozisyonunda aynı ve titremesiz sonuç verir.
- **Diferansiyelli rocker (4 tekerlek, MRC 2026 rover'ı):** Aynı çözücünün bogie'siz hali.
- Tekerlek dönüşü kat edilen yoldan hesaplanır (yarıçap × açı). Kayma olmaz. Yerinde dönüşte (skid-steer) iki taraf ters döner.
- Gövde, ivmelenme ve frenlemede hafif yaylanır (ikinci dereceden sönümlü yay, sadece görsel).
- Bu yöntem fizik motorundan daha güvenilir: scroll geri sarılınca da birebir aynı sonuç verir.

**B) "Sen Sür" modu: Rapier fizik.**
- Gövde rijit cisim, rocker ve bogie menteşe eklemleri (revolute joint), diferansiyel ise iki rocker arasında açıyı eşit ve ters tutan yumuşak kısıt.
- Arazi Rapier heightfield çarpışması. Tekerlek sürtünmesi bölgeye göre değişir (kum, kaya, kar).
- Hız sınırları gerçek rover değerlerinden gelir (MRC rover'ı için ~0.58 m/s tahmin; 2027 rover'ı için yol haritasındaki son değer). Sitede "simülasyon" diye etiketlenir.
- Kontrol: WASD/ok tuşları, mobilde sanal joystick, R ile sıfırlama, Esc ile çıkış.
- Rover devrilirse 2 saniye sonra otomatik düzeltilir.

**Görsel geri bildirim (iki modda da):**
- Tekerlek izleri: Araziye yansıtılan iz dokusu (render target'a çizilen iz maskesi, zamanla solar).
- Toz: Tekerlek hızına bağlı GPU parçacıkları; bölgeye göre renk (Drumheller bej, Utah kızıl, Mars somon, Alpler'de kar tozu).
- Küçük taşlar: Tekerlek yakınındaki çakıllar hafifçe zıplar (sadece görsel).
- Kol animasyonları: Ters kinematik (IK) ile hedefe uzanma, numune alma, panel kurcalama.

### 6.6 Rover modelleri

| Model | Kaynak | Kullanım |
|---|---|---|
| **SummerTech Rover (MRC 2026)**, 4 tekerlek, diferansiyelli rocker | Mevcut fotoğraflar; 3D model yok → Fusion 360'tan dışa aktarım veya Blender'da yeniden modelleme **[AÇIK: Fusion dosyası var mı?]** | MRC bölgesi, "Rakamlar", gerçek başarı vurgusu |
| **TAYKUT 2027 rover**, dijital ikizde 6 tekerlek rocker-bogie (malzeme listesi 4 tekerlek diyor, kesinleşmedi) | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/meshes/*.glb` (eklemli parçalar hazır), ölçüler `config/rover_params.yaml` (çoğu VARSAYIM etiketli), `scripts/blender_rover.py` | Hangar, Dünya turu, CIRC/Alpler/Utah/Mars bölgeleri |

**Kahraman model [AÇIK]:** Açılışta hangi rover görünecek? Önerim: 2027 rover'ı (6 tekerlek rocker-bogie süspansiyon daha etkileyici, dijital ikizde parçaları hazır). MRC 2026 rover'ı ise "gerçek başarımız" bölümünde ve kendi görevinde gösterilir.

Model kalite hedefi: Hangar yakın çekimi için ~150–250k üçgen (LOD0), arazide ~40k (LOD1), uzakta ~8k (LOD2). Dokular 2K, KTX2 sıkıştırılmış.

### 6.7 HUD — Görev Kontrol Arayüzü
Görev bölgelerinde ekranın kenarlarında ince, yarı saydam bir katman olacak:
- **Sol üst:** Görev adı, bölge, UTC ve yerel saat, koordinat.
- **Sağ üst:** Mini harita (arazinin üstten görünüşü, rover konumu, rota, hedefler).
- **Sol alt:** Telemetri: hız, yön, eğim (pitch/roll), sağ ve sol rocker açıları, batarya, sinyal gücü. Değerler kinematik çözücüden **gerçekten** hesaplanır; rastgele sayı yazılmaz.
- **Sağ alt:** Görev adımları kontrol listesi (✓ ile ilerler) ve "Kontrolü al" düğmesi.
- **Kamera penceresi:** İsteğe bağlı küçük pencere, rover'ın ön kamerasından ikinci bir render (düşük çözünürlük, tarama çizgili).
- Tipografi monospace, renkler HUD paletinden (bkz. 7). Her şey 1 piksel ince çizgi ve köşe işaretleriyle.

### 6.8 Geçişler
- **Hangar → Dünya:** Kamera geri çekilirken stüdyo zemini yıldız alanına dönüşür (sahne çapraz geçişi ve bloom patlaması).
- **Küre → Arazi:** Hedef noktaya dalış, bulut katmanından geçiş, arazi sisten belirir.
- **Arazi → Küre:** Rover görev sonunda durur, kamera dikey yükselir, arazi uydu görüntüsüne ve sonra küreye dönüşür.
- Geçişler en fazla 1.5–2.5 sn sürer. Scroll hızlı kaydırılırsa geçiş kısalır, kullanıcı bekletilmez.

### 6.9 Ses tasarımı
- Varsayılan **kapalı**; ilk etkileşimde küçük "ses aç" ipucu gösterilir. Tarayıcılar zaten otomatik sesi engelliyor.
- Katmanlar: ortam sesi (rüzgâr, bölgeye göre), motor uğultusu (hıza bağlı perde ve ses seviyesi), servo sesleri (kol), arayüz tıkları, geçiş "whoosh" sesi.
- Kaynak: CC0 sesler (Freesound CC0 filtresi) veya takımın kendi kaydettiği gerçek rover motor sesi **[Claude: gerçek kayıt öncelikli]**.

### 6.10 Mikro etkileşimler
- Özel imleç (ince halka, 3D üzerinde "sürükle" ipucu), mıknatıslı düğmeler, link altı çizgi animasyonu.
- Başlıklar harf ve satır bazında maskeli giriş animasyonu (SplitText).
- Sayaçlar görünür olunca sayar.
- Navigasyon: Üstte ince çubuk. Sağda bölüm ilerleme göstergesi (görev noktaları) ve her yerde "Sponsor Ol" düğmesi.
- Klavye kısayolları: `M` ses, `L` dil, `C` temiz mod (HUD gizli, fotoğraf modu), `Esc` sürüşten çıkış.

## 7. Görsel dil [Claude, Kerem onaylayacak]

- **Ruh hali:** "Görev kontrol + endüstriyel tasarım". Karanlık, sakin, hassas. Renk az, ışık çok.
- **Renkler (öneri):**
  - Zemin: `#07090C` (neredeyse siyah, hafif mavi)
  - Yüzey: `#0E1218`, çizgi: `#1E2630`
  - Metin: `#E8ECF1`, ikincil metin: `#8A95A3`
  - Vurgu: TAYKUT/SummerTech logosundaki ana renk (logodan ölçülecek). Yedek: sinyal turuncusu `#FF6A1A`.
  - HUD: soluk cam yeşili `#7CF2C9`, uyarı sarısı `#FFC940`, hata `#FF4D4D`
- **Tipografi:** Başlıklarda geniş ve güçlü bir grotesk (ör. *Space Grotesk* veya *Archivo Expanded*), metinde *Inter*, HUD ve sayılarda *JetBrains Mono* veya *IBM Plex Mono*. Hepsi OFL lisanslı.
- **Izgara:** 12 sütun, geniş kenar boşlukları, büyük boşluk. Bölüm numaraları (`01 / ROVER`) NASA dokümanı hissi verir.
- **Son işlem:** Hafif bloom (sadece ışıklarda), yakın çekimlerde sinematik alan derinliği, bölgeye özel renk derecelendirme (LUT), çok hafif film grain ve vinyet. Abartı yok.
- **Fotoğraf dili:** Gerçek saha fotoğrafları renk derecelendirmeyle sitenin paletine uydurulur. "Render değil, gerçek toz" vurgusu korunur.

## 8. İçerik

### 8.1 Takım [Kerem]
1. Kerem Sümer — Kaptan
2. Mehmet Revaha Emuce
3. Yağız Eymen Yanık
4. Kerem Şakir
5. Ahmet Özhan Öztürk
6. Mehmet Emir Erdoğmuş
7. İbrahim Enes Yeşil

Danışman: Mustafa Seyhan. Okul: ASELSAN Mesleki ve Teknik Anadolu Lisesi, Ankara.

**[AÇIK]** Her üyenin rolü (mekanik, elektronik, yazılım, kol, tasarım, sponsorluk...), fotoğrafı ve isteğe bağlı LinkedIn/GitHub linki. Fotoğraf yoksa tutarlı bir stilde siluet veya rover parçası illüstrasyonu kullanılır. Üyeler reşit olmadığı için fotoğraflar okul ve aile onayıyla yayınlanmalı.

### 8.2 Doğrulanmış veriler (mevcut kaynaklardan)
- MRC 2026: başvuru videosu 1. (https://youtu.be/8WRZX9VwTyw), finalde genel 4. (29 Tem–1 Ağu 2026). Micro Rover Challenge, ana ARC değil.
- Takım Kasım 2025'te kuruldu; 2027 için yeni üyelerle yeniden yapılandı.
- CIRC 2027 (6–9 Ağu 2027, Drumheller) ilgi beyanı gönderildi; davet bekleniyor.
- MRC rover'ı: 45×45 cm hacim, 95A TPU tekerlek (Ø10 cm), diferansiyelli rocker, Pixhawk 2.4.8 + Raspberry Pi 4B + Arduino Mega, 3S Li-ion 5600 mAh (~35 dk hesaplanan), ~0.58 m/s (tahmin).
- 2027 rover'ı: 6 tekerlek rocker-bogie, dijital ikiz (ROS 2 Jazzy + Gazebo Harmonic, gerçek Drumheller arazisi), sıfırdan yazılmış web yer istasyonu. **[AÇIK]** Kütle, hız ve motor değerleri tasarım sürdüğü için sitede "hedef" olarak yazılacak; son değerler yayından önce Kerem'e sorulacak.

### 8.3 Sponsor kademeleri [Claude, AÇIK]
Rover takımlarında yaygın olan kademeli yapı (ör. Missouri S&T'nin Perseverance/Opportunity/Sojourner kademeleri), TAYKUT'a özgü adlarla:
- **Drumheller** (ana sponsor) · **Alp** · **Regolit** · **Dost** (parça, üretim veya hizmet bağışı)
- Her kademede: logo yeri (rover, tişört, site, sunum), sosyal medya teşekkürü, yarışma raporlarında anma.
- Kademe tutarları Kerem ve danışman tarafından belirlenecek. Sitede tutar yazılıp yazılmayacağı **[AÇIK]**.

### 8.4 Mevcut varlıklar
- `taykut-site/public/media/`: rover-day, rover-night, rover-aruco, digital-twin, ground-station.mp4 (+poster), og.jpg, summertech-logo.png
- `Rover_Dijital_Ikiz`: eklemli rover GLB'leri, Drumheller DEM/DSM (1 m) ve görsel mesh
- `TaykutGitBook.zip`: tam teknik doküman (teknik metinler buradan doğrulanarak alınacak)
- `aseltech` deposu: Blue Marble dokusu, küre ve uçuş deneyimi, Türkçe/İngilizce sistemi fikri

## 9. Teknik mimari

### 9.1 Klasör yapısı
```
taykut/
├─ index.html
├─ public/
│  ├─ media/            # fotoğraf, video, poster (webp/avif/mp4)
│  ├─ models/           # rover .glb (meshopt + ktx2)
│  ├─ terrain/<bolge>/  # height.png (16-bit), albedo.ktx2, normal.ktx2, meta.json
│  ├─ globe/            # day/night/clouds/specular dokular
│  ├─ audio/
│  └─ docs/sponsor.pdf
├─ src/
│  ├─ main.tsx, App.tsx
│  ├─ content/          # tr.ts, en.ts — tüm metinler burada
│  ├─ sections/         # Boot, Hangar, Inspect, Globe, Mission, Stats, Engineering, Journey, Team, Sponsor, Footer
│  ├─ scene/
│  │  ├─ Experience.tsx # tek Canvas; aktif sahneyi seçer
│  │  ├─ studio/        # hangar ışıkları, patlatılmış görünüm
│  │  ├─ globe/         # küre, atmosfer shader, pinler, yaylar
│  │  ├─ terrain/       # heightfield mesh, LOD, iz ve toz
│  │  ├─ rover/         # model, kinematik çözücü, IK kol, farlar
│  │  ├─ drive/         # Rapier "Sen Sür" modu
│  │  └─ post/          # son işlem zinciri, kalite kademeleri
│  ├─ missions/         # drumheller.ts, alps.ts, utah.ts, mars.ts, mrc.ts, ankara.ts
│  ├─ hud/              # HUD bileşenleri
│  ├─ timeline/         # Theatre.js durumları, ScrollTrigger bağları
│  ├─ audio/
│  ├─ store/            # zustand
│  └─ lib/              # matematik, coğrafi dönüşüm, kalite tespiti
├─ tools/               # varlık hattı betikleri (DEM→heightmap, gltf optimize, Blender)
├─ tests/               # vitest + playwright
├─ docs/
│  ├─ superpowers/specs, plans
│  ├─ VARLIKLAR.md      # her üçüncü taraf verinin kaynağı ve lisansı
│  └─ ICERIK_KAYNAKLARI.md  # sitedeki her sayının kaynağı
└─ .github/workflows/   # build + test + Pages deploy
```

### 9.2 Tek Canvas, çok sahne
- Sayfada tek bir sabit WebGL Canvas olacak, HTML bölümleri onun üstünden kayacak. Aktif bölüme göre sahne değişir (Studio / Globe / Terrain).
- Sahneler tembel yüklenir: Globe dokuları Hangar'dayken, ilk arazi Globe'dayken arka planda iner.
- Görünmeyen sahne GPU belleğinden çıkarılır (dispose), sadece bir önceki ve bir sonraki tutulur.

### 9.3 Dil
- `content/tr.ts` ve `content/en.ts` aynı şemayı paylaşır; TypeScript eksik çeviriyi derlemede yakalar.
- Varsayılan dil tarayıcıdan, seçim `localStorage`'da saklanır. URL'de `?lang=en`.
- **[Claude]** İlk sürümde ayrı `/en/` sayfaları yerine bu yöntem kullanılacak; SEO için `hreflang` ve iki dilde prerender edilmiş meta etiketleri olacak.

### 9.4 Varlık hattı (`tools/`)
- **DEM → heightmap:** GeoTIFF'ten bölge kesme, metreye ölçekleme, 16-bit PNG (1025² veya 2049²) ve `meta.json` (gerçek boyut, min/max kot, kaynak, lisans). GDAL (ücretsiz) veya Python rasterio ile.
- **Arazi dokusu:** Varsayılan prosedürel shader (eğime göre kaya, düzlükte kum, yükseklikte kar) ve CC0 PBR dokular. Uydu görüntüsü sadece Copernicus Sentinel-2 (atıflı); CC BY-NC-SA türev setler kullanılmaz.
- **Rover:** Blender betiği parçaları tek GLB'de hiyerarşik toplar (pivotlar eklem eksenlerinde), LOD üretir, sonra gltf-transform ile Meshopt + KTX2.
- **Medya:** Fotoğraflar AVIF + WebP, birkaç genişlikte (`srcset`). Video H.264 MP4 + poster.

### 9.5 Kalite kademeleri
| Kademe | Kim | Ayarlar |
|---|---|---|
| **Ultra** | Güçlü masaüstü GPU | DPR 2, gölgeler 2048, DOF, tam toz, 2049² arazi |
| **Yüksek** | Orta masaüstü / iyi dizüstü | DPR 1.5, gölgeler 1024, DOF yok, 1025² arazi |
| **Mobil** | Telefonlar | DPR 1–1.5, gölgeler baked, son işlem minimum, toz azaltılmış, LOD1 rover |
| **Yedek** | WebGL2 yok, çok zayıf cihaz veya reduced-motion | 3D yok; fotoğraf, video ve statik harita görselleri; bütün içerik aynı |

FPS izleyici, 3 saniye boyunca hedefin altında kalınırsa kademeyi bir düşürür.

### 9.6 Performans bütçesi (kabul kriteri)
- İlk yükleme JS (gzip) **≤ 250 KB**, 3D kodu ayrı parça.
- Boot'tan Hangar'a ilk varlık paketi **≤ 6 MB**; her görev bölgesi ek **≤ 8 MB**.
- LCP **≤ 2.5 sn** (4G simülasyonu), CLS **≤ 0.05**.
- Masaüstü orta GPU'da **60 fps**, orta seviye telefonda **≥ 30 fps**.
- Lighthouse (mobil): Performans ≥ 80, Erişilebilirlik ≥ 95, En iyi uygulamalar ≥ 95, SEO 100.

### 9.7 Erişilebilirlik
- Bütün metin içeriği gerçek HTML'de; 3D Canvas dekoratif (`aria-hidden`) ve her 3D anlatımın metin karşılığı var.
- `prefers-reduced-motion`: Boot yok, geçişler sade çapraz geçiş, otomatik kamera hareketi yok.
- Klavye ile tüm bölümler, menü ve "Sen Sür" modu kullanılabilir; görünür odak halkası.
- Kontrast WCAG AA. Videolarda altyazı veya açıklama.
- Ses varsayılan kapalı.

### 9.8 SEO ve paylaşım
- Statik `index.html` içinde başlık, açıklama, Open Graph ve Twitter kartı (rover görseli 1200×630), `hreflang`.
- JSON-LD: `SportsTeam` / `Organization` (okul, danışman, sosyal medya).
- `sitemap.xml`, `robots.txt`, 404 sayfası (kayıp rover temalı).

### 9.9 Gizlilik
- Çerez yok. Analitik seçilirse GoatCounter (çerezsiz, kişisel veri toplamaz).
- Üye fotoğrafı ve tam adlar için okul/aile onayı **[AÇIK]**.
- E-posta adresi spam botlarına karşı basit gizleme ile yazılır.

### 9.10 CI/CD
- Her `push`ta GitHub Actions: kurulum → tip kontrolü → Vitest → derleme → Playwright duman testi → Pages'e yayın.
- PR'larda ekran görüntüsü karşılaştırması (Playwright) ve Lighthouse CI raporu.
- Vite `base: '/taykut/'` (ileride özel alan adı alınırsa `/`).

## 10. Yol haritası (aşamalar)

Her aşama kendi başına yayınlanabilir bir site bırakır. Sıra bilinçli: önce içerik ve sponsor yolu çalışır, sonra gösteriş gelir.

| Aşama | Ne | Bitti sayılması için (doğrulama) |
|---|---|---|
| **A0 — Temel** | Vite+TS+React iskeleti, lint, Vitest, Playwright, Actions → Pages yayını, `base` ayarı | Boş sayfa canlı adreste açılıyor; CI yeşil |
| **A1 — İçerik iskeleti** | Tüm bölümler 3D'siz, gerçek metin ve fotoğraflarla; TR/EN; tasarım sistemi (renk, font, ızgara); sponsor ve takım bölümleri | Site 3D olmadan da eksiksiz; Lighthouse ≥ 90/95/95/100; iki dil tam |
| **A2 — Rover varlık hattı** | 2027 rover GLB'sinin birleştirilmesi, pivotlar, LOD, KTX2; malzemeler | Rover tarayıcıda tek dosya ≤ 4 MB; eklemler doğru eksende dönüyor (test sahnesi) |
| **A3 — Hangar ve İnceleme** | Stüdyo ışığı, giriş kamerası, patlatılmış görünüm, etiketler, sürükleme | 60 fps (masaüstü); etiketler parçayla eşleşiyor; reduced-motion yolu çalışıyor |
| **A4 — Kinematik çözücü** | Heightfield örnekleme, rocker-bogie + diferansiyel çözümü, tekerlek dönüşü | Birim testler: düz zeminde tüm açılar 0; bilinen basamakta beklenen rocker/bogie açıları; scroll geri sarınca aynı poz |
| **A5 — İlk bölge: Drumheller** | HRDEM'den arazi, gökyüzü, ışık, rota, görev olayları, iz ve toz, HUD | Rover arazide sürülüyor, tekerlekler zemine basıyor (ekran görüntüsü kanıtı), HUD değerleri çözücüden geliyor |
| **A6 — Dünya küresi** | Küre, atmosfer, gece ışıkları, pinler, uçuş yayları | Küre 60 fps; pin tıklama doğru bölgeye uçuyor |
| **A7 — Geçişler ve Boot** | Hangar→Dünya, Küre⇄Arazi geçişleri, Boot ekranı, Theatre.js koreografisi | Uçtan uca akış kesintisiz; hızlı scroll'da takılma yok |
| **A8 — Diğer bölgeler** | MRC, Alpler, Utah, Mars, Ankara (her biri ayrı alt adım) | Her bölge kendi bütçesinde (≤ 8 MB) ve kendi görevini oynatıyor |
| **A9 — Sen Sür** | Rapier fizik, kontroller (klavye/dokunmatik), sıfırlama | Rover devrilmeden sürülebiliyor; mobil joystick çalışıyor |
| **A10 — Ses ve mikro etkileşim** | Howler katmanları, imleç, SplitText, sayaçlar | Ses varsayılan kapalı; açınca hıza bağlı motor sesi |
| **A11 — Cila** | Kalite kademeleri, LUT'lar, performans ve erişilebilirlik denetimi, SEO, 404, basın kiti | Bütçe tablosundaki tüm hedefler ölçülmüş ve rapora yazılmış |
| **A12 — Yayın** | Son içerik kontrolü (her sayının kaynağı), lisans listesi, duyuru görselleri | `ICERIK_KAYNAKLARI.md` ve `VARLIKLAR.md` eksiksiz; Kerem son onayı verdi |

## 11. Riskler ve önlemler

| Risk | Önlem |
|---|---|
| 3D ağır gelir, site yavaşlar | Bütçeler CI'da ölçülür; kalite kademeleri; içerik 3D'den bağımsız |
| Rocker-bogie fizik titrer | Sinematik mod analitik ve deterministik; fizik sadece isteğe bağlı sürüşte |
| Arazi verisi lisans sorunu | Sadece açık lisanslı veri (NRCan OGL, swisstopo açık veri, USGS/NASA kamu malı, Copernicus); hepsi `VARLIKLAR.md`'de. CIRC'nin lisansı belirsiz lidar arşivi **kullanılmaz**. |
| 2027 rover tasarımı değişir | Model ve özellikler veri dosyalarında; tasarım değişince sadece GLB ve sayılar güncellenir |
| GitHub Pages boyut ve bant genişliği sınırları | Sıkıştırma; büyük videolar YouTube'a gömülür (ücretsiz) |
| Proje çok büyür, hiç bitmez | Aşama sırası: A1 sonunda bile yayınlanabilir bir site var |
| Safari/iOS WebGL farklılıkları | Playwright WebKit testi; iOS'ta Mobil kademe |

## 12. Kurucuya bırakılanlar [Claude]
- Bileşen iç yapısı, shader ayrıntıları, isimlendirme.
- Kesin kamera açıları ve zamanlamalar (Theatre.js'de ayarlanıp Kerem'e video ile gösterilecek).
- Font çiftinin son seçimi (iki seçenek ekran görüntüsüyle sunulacak).

## 13. Açık sorular (önem sırasıyla)
1. **Kahraman rover:** Açılışta 2027 rover'ı mı (öneri), MRC 2026 rover'ı mı?
2. **Bölgeler:** Ankara, MRC, Drumheller, Alpler, Utah, Mars listesi ve sırası uygun mu? Eklemek veya çıkarmak istediğin yer var mı?
3. **MRC 2026 nerede yapıldı?** Gerçek konum biliniyorsa o arazi kullanılır.
4. **MRC rover'ının Fusion dosyası** var mı? (3D modeli için)
5. **Üye rolleri ve fotoğrafları** (ve yayın için okul/aile onayı).
6. **Sponsor kademeleri ve tutarları** sitede yazsın mı?
7. **Logo:** Takım logosu SummerTech logosu mu, yoksa ayrı bir TAYKUT logosu var mı?
8. **Analitik** (GoatCounter) istiyor musun?
9. **2027 rover tekerlek sayısı:** 6 (dijital ikiz) mi, 4 (malzeme listesi) mi?
10. **İsim yazımı:** "Mehmet Emir Erdoğmuş" mu, "Mehmet Emin Erdoğmuş" mu? (aseltech deposunda "Emin" geçiyor)
