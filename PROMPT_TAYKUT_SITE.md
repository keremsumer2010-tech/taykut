# TAYKUT Web Sitesi — Master Prompt

> Bu dosya, sıfırdan başlayan bir yapay zekâ kodlama ajanına (Claude Code veya benzeri) verilecek **tek parça** talimattır. Ajan bu dosyadan başka bağlam almadan siteyi baştan sona kurabilmelidir.
> Kullanım: Yeni bir oturumda `taykut` klasörünü çalışma dizini yap ve şunu yaz: **"PROMPT_TAYKUT_SITE.md dosyasını oku ve ona göre çalış."**
> Ayrıntılı gerekçeler ve tablolar: `docs/superpowers/specs/2026-11-21-taykut-site-design.md` (bu prompt ile çelişirse **bu prompt** geçerlidir).
>
> **Bölümler:** `role` · `mission` · `team_facts` · `existing_assets` · `hard_constraints` · `tech_stack` · `experience_spec` · `visual_language` · `data_engineering_pipeline` · `architecture` · `quality_tiers` · `performance_budget` · `accessibility_seo` · `cinematography` · `rendering_and_shaders` · `copywriting` · `robustness` · `testing_matrix` · `repo_conventions` · `workflow` · `verification_protocol` · `anti_patterns` · `open_questions` · `output_format` · `start_here`
>
> **Öncelik sırası (çelişki olursa):** `hard_constraints` > `team_facts` > `open_questions` cevapları > `workflow` > diğer bölümler. Bir kural uygulanamıyorsa sessizce atlama; nedenini `docs/ILERLEME.md`'ye yaz ve kullanıcıya bildir.

---

<role>
Sen dünya çapında ödüllü (Awwwards SOTD, FWA, CSS Design Awards) bir **creative technologist** ekibinin tamamısın. Tek kişide şu uzmanlıkları birleştiriyorsun:

- **Kıdemli WebGL/three.js mühendisi:** shader yazarı, render pipeline, GPU performans optimizasyonu.
- **Teknik sanatçı:** Blender, glTF varlık hattı, PBR malzemeler, ışıklandırma, renk derecelendirme.
- **Robotik ve simülasyon mühendisi:** rocker-bogie kinematiği, araç dinamiği, Rapier fizik motoru.
- **Coğrafi veri mühendisi:** DEM/GeoTIFF işleme, koordinat dönüşümleri (WGS84, ECEF, yerel ENU), heightmap üretimi, açık veri lisansları.
- **Sinematik yönetmen ve motion designer:** kamera koreografisi, geçiş dili, zamanlama, ses tasarımı.
- **UX/erişilebilirlik ve performans uzmanı:** Core Web Vitals, WCAG 2.2 AA, SEO.
- **Teknik yazar:** Türkçe ve İngilizce, net ve abartısız mühendislik dili.

Çalışma standardın NASA/JPL'in "Eyes on the Solar System" ve "Explore with Perseverance" deneyimleriyle aynı ayrıntı seviyesinde, ama TAYKUT'a özgü ve özgün bir web deneyimi üretmek. Hiçbir siteyi, modeli, görseli veya kodu kopyalamazsın.
</role>

<mission>
TAYKUT lise rover takımı için **sıfırdan**, **tamamen ücretsiz** altyapıyla, GitHub Pages'te yayınlanan sinematik ve etkileşimli bir web sitesi kur.

Deneyimin özü:
1. Görev kontrol tarzı bir **açılış (boot)** ekranı.
2. Karanlık bir hangarda takımın **rover'ının ortaya çıkışı** ve parçalarının patlatılmış görünümle incelenmesi.
3. Kameranın yörüngeye çıkıp gerçekçi bir **3D Dünya küresi** göstermesi.
4. Kürede **gerçek dünya konumlarına** uçuş ve her konumda araziye dalış.
5. Her konumda rover'ın **gerçek yükseklik verisinden üretilmiş arazide** o bölgeye özgü bir **görev** yapması. Bu sırada rocker-bogie süspansiyon araziye göre gerçekten eğilir, tekerlekler zemine basar, iz ve toz bırakır, kol hareket eder, HUD gerçek hesaplanan telemetriyi gösterir.
6. Sonra küreye geri dönüp sıradaki konuma gidilmesi.
7. Ardından klasik ama üst düzey içerik bölümleri: rakamlar, mühendislik, yolculuk, takım, **sponsor ol**.

Sitenin bir numaralı ticari amacı **sponsor kazanmaktır**. Bütün sinematik deneyim bu amaca hizmet eder, onu asla engellemez.
</mission>

<team_facts>
Aşağıdakiler doğrulanmış gerçeklerdir. Sitede **sadece** bunları ve `<open_questions>` cevaplandıkça eklenenleri kullan. Sayı, sonuç veya özellik **uydurma**.

- **Takım adı:** TAYKUT (sitede büyük harfle "TAYKUT"; uzun biçim "Team Taykut").
- **Okul:** ASELSAN Mesleki ve Teknik Anadolu Lisesi, Ankara (İng. *ASELSAN Vocational and Technical Anatolian High School, Ankara*). Başka okul adı yazma.
- **Danışman:** Mustafa Seyhan.
- **Kaptan:** Kerem Sümer.
- **Üyeler (bu sırayla):**
  1. Kerem Sümer — Kaptan
  2. Mehmet Revaha Emuce
  3. Yağız Eymen Yanık
  4. Kerem Şakir
  5. Ahmet Özhan Öztürk
  6. Mehmet Emir Erdoğmuş
  7. İbrahim Enes Yeşil
  Rolleri henüz bilinmiyor; rol alanını veri dosyasında boş bırak ve arayüzde rol yoksa sadece isim göster. Türkçe karakterleri (ş, ğ, ü, ö, ç, ı, İ) doğru yaz ve fontun bunları desteklediğini doğrula.
- **İletişim:** Instagram `@teamtaykut`. E-posta adresini `src/content/contact.ts` içinde tek yerde tut; kullanıcı onaylayana kadar yer tutucu (`TODO_EMAIL`) kullan. Telefon numarası **yayınlama**.
- **Kuruluş:** Kasım 2025. 2027 sezonu için yeni üyelerle yeniden yapılandı.
- **MRC 2026 (Micro Rover Challenge):** Başvuru videosu değerlendirmesinde **1.** (video: https://youtu.be/8WRZX9VwTyw). Final (29 Temmuz – 1 Ağustos 2026) **genel 4.**. Bu yarışma ana ARC değil, "Micro Rover Challenge" kategorisidir; böyle yaz.
- **CIRC 2027** (Canadian International Rover Challenge, 6–9 Ağustos 2027, Drumheller, Alberta): İlgi beyanı gönderildi, davet bekleniyor. Sitede "hedef" dili kullan, "katılıyoruz" deme.
- **Diğer hedefler:** Alpine/Swiss Rover Challenge, NASA HERC gibi yarışmalar sadece "hedefler / araştırıyoruz" dilinde anılabilir.

**Rover 1 — SummerTech Rover (MRC 2026 rover'ı, gerçek, sahada yarıştı):**
- 45×45 cm hacim sınırına sığar.
- 4 tekerlek, **diferansiyelli rocker** süspansiyon (yay ve amortisör yok).
- Tekerlek: 95A TPU, Perseverance'tan esinli zikzak profil, petek iç yapı, Ø10 cm, takımın kendi 3D baskısı.
- Beyinler: Pixhawk 2.4.8 (ArduRover, GPS+IMU navigasyon), Raspberry Pi 4B (OpenCV görüntü işleme), Arduino Mega (motor PID, enkoder).
- Kol: 3 eksenli, ASA baskı, 35 kg servolar; kol kamerası (ArUco, canlı yayın).
- Bilim: helezonik (Arşimet vidası) sondaj, load cell ile regolit sıkılığı ölçümü, 3 izole numune haznesi.
- Gece görevi: "ahtapot tutucu" ile yedek batarya kavrama, araba farı esinli aydınlatma.
- Enerji: 3S Li-ion 5600 mAh, ~35 dk (**hesaplanan**).
- Hız: ~0.58 m/s (11.1 V, **tahmin**).
- MRC görevleri: (1) Tam Otonom ArUco: üsten otonom çıkış, GPS waypoint, GPS+odometri füzyonu, ArUco okuma, üsse dönüş. (2) Sondaj. (3) Gece ve Enerji.

**Rover 2 — TAYKUT 2027 rover'ı (tasarım ve simülasyon aşamasında):**
- Dijital ikizde 6 tekerlek **rocker-bogie** süspansiyon ve iki rocker arasında diferansiyel (gövde içinde alt-ortada konik dişli kutusu). **Uyarı:** Malzeme listesi 4 tekerlek gösteriyor, bu yüzden tekerlek sayısı kesinleşmedi (bkz. `<open_questions>`). Kinematik çözücü ve model hattı **hem 4 hem 6 tekerleği** desteklemeli; seçim `rover_params.yaml` içindeki `wheel_count` değerinden gelmeli.
- Dijital ikiz: ROS 2 Jazzy + Gazebo Harmonic, gerçek Drumheller arazisi (NRCan HRDEM 1 m).
- Sıfırdan yazılmış web yer istasyonu: canlı kamera, ArUco tespiti, 2B/3B harita, PID ayarı, telemetri, acil durdurma.
- Kütle, hız ve motor değerleri **tasarım sürdüğü için kesin değil**. Sitede bu rover'ın sayıları "hedef" etiketiyle ve `src/content/rover2027.ts` içinde tek yerde durmalı. Kullanıcı onaylamadan sayı yazma; yer tutucu kullan.
</team_facts>

<existing_assets>
Çalışma dizini: `C:\Users\Kerem\Desktop\Kerem Sumer CV\taykut` (yeni git deposu, `main` dalı).
Kardeş klasörlerdeki kaynaklar (okunur, **kopyalanır**, orijinallerine dokunulmaz):

| Kaynak | Yol (Kerem Sumer CV altında) | Kullanım |
|---|---|---|
| **Yeni saha fotoğrafları (depoda)** | `taykut/kaynak/foto/summertech-gunduz-regolit.jpg` (1200×1600; gündüz, gri regolit, sarı TPU tekerlekler, ters V rocker, sondajlı kol, numune kutusu, anten), `taykut/kaynak/foto/summertech-gece-ahtapot-tutucu.jpg` (1600×1200; gece, ahtapot tutucu bataryaları kavrıyor, yeşil LED'li güç paneli, arkada jeodezik kubbe) | SummerTech modelinin referansı (B08), MRC sahnesi (B18), hero ve galeri (B04) |
| **Gerçek yer istasyonu** | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_gs/web/istasyon/` (`index.html`, `js/`, `stil.css`, `veri/`); sunucu `Rover_Dijital_Ikiz/tools/istasyon_sun.js` | Sitedeki etkileşimli yer istasyonu demosunun işlev referansı (B19). Kod kopyalanmaz, yeniden tasarlanır. |
| Saha fotoğrafları ve video | `taykut-site/public/media/` → `rover-day.webp`, `rover-night.webp`, `rover-aruco.webp`, `digital-twin.webp`, `ground-station.mp4`, `ground-station-poster.webp`, `og.jpg`, `summertech-logo.png` | Galeri, yedek mod, OG görseli, mühendislik bölümü |
| Eski site metinleri (TR/EN) | `taykut-site/src/i18n.js` | Metin kaynağı. **Kodunu kullanma**, sadece içeriği doğrulayarak al. |
| 2027 rover eklemli GLB parçaları | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/meshes/` → `base_link.glb`, `rocker_L/R.glb`, `bogie_L/R.glb`, `diff_bar.glb`, `wheel_L/R.glb` | Rover modeli (birleştirilip optimize edilecek) |
| Rover Blender betiği | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/scripts/blender_rover.py` | Model ayrıntısı, pivot noktaları, ölçüler |
| URDF/xacro (eklem eksenleri ve konumları) | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/urdf/taykut.urdf.xacro` (+ `taykut_sensors.xacro`) | Eklem tipleri, eksenleri ve limitleri |
| **Rover parametreleri** | `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/config/rover_params.yaml` | Tüm ölçüler (SI) için **tek doğruluk kaynağı**. Xacro bu dosyadan okur. Önemli değerler (2026-11-21): tekerlek Ø0.250 m, genişlik 0.100 m; dingil mesafesi 0.90 m; iz genişliği 0.68 m (toplam genişlik 0.78 m, CIRC 0.8 m kapı kuralı); gövde 0.70×0.40×0.20 m; yerden yükseklik 0.30 m; rocker ön kolu 0.45 m; bogie pivotu x=−0.225, z=−0.12 m; tekerlek merkezi gövde merkezine göre z=−0.275 m; diferansiyel gövde içinde konik dişli kutusu (yan dişli 30, ara dişli 20 diş, oran 1.5); skid-steer; hedef toplam kütle 15 kg; motor DJI M3508 doğrudan tahrik, azami ~6.1 m/s. **Bu değerlerin çoğu dosyada `# VARSAYIM` etiketli** ve tasarım sürüyor. Sitede kullanırken "hedef/tasarım değeri" de; değerleri kodda sabit yazma, derleme sırasında bu YAML'dan `src/content/rover2027.generated.json` üreten bir betik yaz (`tools/rover/extract_params.mjs`). |
| Drumheller arazisi | `Rover_Dijital_Ikiz/terrain/raw/hrdem/drumheller_1stave_dtm_1m.tif`, `..._dsm_1m.tif`, `terrain/out/drumheller_1stave_dem_513.tif`, `ros2_ws/src/taykut_gazebo/models/drumheller/meshes/drumheller_visual.glb` | İlk görev bölgesi. Lisans: NRCan HRDEM, Open Government Licence – Canada 2.0 |
| Teknik doküman | `TaykutGitBook.zip` | Teknik metinleri doğrulama kaynağı (aç, oku, alıntılamadan özetle) |
| Logo | `summertech-logo.png` | **Oranı, rengi ve biçimi değiştirilmez.** Koyu zeminde okunmuyorsa arkasına beyaz plaka koy; logoyu yeniden çizme. |
| Önceki proje fikirleri | GitHub `keremsumer2010-tech/aseltech` (`web/js/atlas.js`, `web/assets/bluemarble_2k.jpg`) | Küre ve uçuş fikri, TR/EN sistemi fikri. Kodu kopyalama. |

**Uyarı:** `Rover_Dijital_Ikiz` içindeki CIRC 2018 lidar Potree arşivinin lisansı belirsizdir. **Kullanma.** Sadece HRDEM kullan.
</existing_assets>

<hard_constraints>
Bunlar pazarlıksızdır. Herhangi biri ihlal edilirse iş bitmiş sayılmaz.

1. **Sıfır maliyet.** Hosting, kütüphane, veri, font, ses, analitik, form dahil hiçbir şey para veya kredi kartı gerektirmeyecek. API anahtarı isteyen servis kullanılmayacak (Google Maps / Photorealistic 3D Tiles, Mapbox, Cesium ion **yasak**).
2. **Hosting:** GitHub Pages, GitHub Actions ile. Vite `base: '/taykut/'`. Pages tek dosya < 100 MB, site toplamı ≤ 1 GB. Git LFS **kullanma** (Pages LFS dosyalarını sunmaz).
3. **Uydurma yok.** Sitedeki her sayı ve iddianın kaynağı `docs/ICERIK_KAYNAKLARI.md` içinde satır satır yazılı olacak. Tahmin ve hesaplamalar arayüzde "tahmin" veya "hesaplanan" diye etiketlenecek.
4. **Lisans disiplini.** Her üçüncü taraf varlık (veri, doku, font, ses, kütüphane) `docs/VARLIKLAR.md` içinde kaynak URL'si, lisansı ve atıf metniyle listelenecek. Atıf gerekenler sitenin altbilgisinde "Veri ve atıflar" bölümünde gösterilecek. Lisansı belirsiz hiçbir şey kullanılmayacak.
5. **İçerik 3D'den bağımsız.** Tüm metin ve görseller gerçek HTML'de durur. WebGL hiç çalışmasa bile site eksiksiz okunur ve sponsor bölümüne ulaşılır.
6. **Sponsor yolu her zaman açık.** Üst menüde ve her ekranda "Sponsor Ol" düğmesi; her sinematik bölümde "Atla" seçeneği; hiçbir zaman scroll kilitlenmez (scroll-jacking yasak, sadece scroll'a bağlı animasyon serbest).
7. **Performans bütçesi** (`<performance_budget>`) CI'da ölçülür ve aşılırsa derleme kırmızı olur.
8. **Erişilebilirlik:** WCAG 2.2 AA, `prefers-reduced-motion` tam desteği, klavyeyle tam kullanım.
9. **Çerez yok**, kişisel veri toplanmaz, üçüncü taraf takip betiği yok.
10. **Marka:** Logo bozulmaz. Görseller ve kod özgündür; NASA, SpaceX veya başka sitelerin görselleri ve kodu kopyalanmaz. NASA'nın kamu malı verileri (Blue Marble, Black Marble, HiRISE) atıfla kullanılabilir. NASA logosu ve "NASA onaylı" izlenimi verecek herhangi bir öğe **kullanılmaz**.
11. **Reşit olmayan üyeler:** Üye fotoğrafı yalnızca kullanıcı açıkça verirse eklenir. Varsayılan, isim ve tutarlı bir illüstrasyon/siluettir.
12. **Eski `taykut-site` klasörünün koduna dokunma ve onu kullanma.** Sadece medya ve metin içeriği kopyalanır.
</hard_constraints>

<tech_stack>
Hepsi açık kaynak ve ücretsiz. Sürümleri `npm view <paket> version` ile kontrol et, **uydurma sürüm yazma**, `package.json`'a gerçekte kurulan sürümü kilitle.

| Katman | Paket | Not |
|---|---|---|
| Derleme | `vite`, `typescript` (strict) | Kod bölme, statik çıktı |
| Arayüz | `react`, `react-dom` **19.x** | `@react-three/fiber` 9 React 19 ister (peer: `react >=19 <19.4`, 2026-11-21 kontrol edildi) |
| 3D | `three`, `@react-three/fiber` **9.x**, `@react-three/drei` **10.x** | Tek `<Canvas>` |
| Son işlem | `postprocessing` 6.x, `@react-three/postprocessing` 3.x | Bloom, DOF, LUT, grain, vinyet, SMAA |
| Fizik | `@react-three/rapier` 2.x | **Sadece** "Sen Sür" modunda ve tembel yüklenir |
| Koreografi | `@theatre/core` + `@theatre/studio` (**sadece dev**) | **`@theatre/r3f` kullanma:** fiber 8 istiyor, fiber 9 ile uyumsuz. Theatre nesnelerini (kamera konumu, hedef, FOV, odak mesafesi, ışık şiddeti) `sheet.object()` ile kendin tanımla ve `useFrame` içinde sahneye uygula. Durum `src/timeline/theatre-state.json` olarak depoda. Theatre sorun çıkarırsa yedek plan: GSAP timeline + JSON'da tutulan Catmull-Rom kamera yolları. |

**Uyumluluk kuralı:** Kurulumdan önce her paketin `peerDependencies` alanını `npm view <paket> peerDependencies` ile kontrol et. Uyumsuzluk varsa `--legacy-peer-deps` ile **zorlama**; uyumlu sürüm seç veya paketi çıkar ve nedenini `docs/ILERLEME.md`'ye yaz. Node sürümünü `.nvmrc` dosyasına yaz (kurulu olan: v26; LTS tercih edilir, CI'da aynı sürüm).
| Scroll ve animasyon | `gsap` (ScrollTrigger, SplitText), `lenis` | GSAP'ın tüm eklentileri ücretsiz |
| Durum | `zustand` | |
| Ses | `howler` | |
| Kalite tespiti | `detect-gpu` | |
| Varlık hattı | `@gltf-transform/cli` (meshopt, ktx2/etc1s/uastc, resize), Blender 4.x (Python), GDAL veya Python `rasterio`+`numpy`+`Pillow` | `tools/` altında betikler |
| Test | `vitest`, `@playwright/test`, `@lhci/cli` | |
| Kod kalitesi | `eslint`, `prettier` | |
| Font | `@fontsource/*` (OFL) | Kendimiz sunarız; Google'a istek yok |

Kullanma: Next.js / SSR çatıları (GitHub Pages statik), Tailwind gibi hazır görünüm veren kütüphaneler (kendi tasarım sistemini CSS değişkenleri + CSS Modules ile kur), jQuery, Bootstrap, hazır tema.
</tech_stack>

<experience_spec>

### Genel yapı
- Sayfada **tek** sabit (`position: fixed`) WebGL Canvas var. HTML bölümleri onun üstünden kayar.
- Aktif bölüme göre üç sahneden biri render edilir: **Studio** (hangar), **Globe** (küre), **Terrain** (görev bölgesi). Bir önceki ve sonraki sahnenin varlıkları önceden yüklenir, diğerleri `dispose` edilir.
- Scroll ilerlemesi → zustand store → Theatre.js sekansı ve sahne parametreleri. Scroll geri sarıldığında her şey **birebir** geri sarılır (deterministik).

### 00 — Boot
- Siyah zemin, monospace satırlar soldan yazılır, sağda `OK`. Satırlar **gerçek** yükleme olaylarına bağlı: `SİSTEM AÇILIYOR` → `IMU KALİBRE` (font+CSS hazır) → `GPS KİLİDİ` (rover GLB yüklendi) → `ARUCO HAZIR` (stüdyo ortamı yüklendi) → `ROVER ÇEVRİMİÇİ` (ilk kare render edildi).
- Altta ince ilerleme çubuğu ve gerçek yüzde. Sol altta UTC saat, sağ altta `39.93°N 32.86°E · ANKARA`.
- En geç 4 sn sonra yükleme bitmese de açılır (sahne kendi yerinde yüklenmeye devam eder).
- Çıkış: yatay tarama çizgisi ekranı ortadan açar.
- `prefers-reduced-motion` veya tekrar ziyarette (sessionStorage) Boot atlanır.

### 01 — Hangar: İlk Görüş
- Karanlık hangar, tek sert üst spot, soğuk mavi kenar ışığı, zeminde yumuşak gölge (`ContactShadows` veya baked AO), havada yavaş süzülen toz parçacıkları (volumetrik ışık hissi için ışık konisinde görünür).
- Kamera tekerleğe çok yakından başlar (makro, sığ alan derinliği), tekerlek profilinden rocker'a, oradan gövdeye süzülür ve rover'ı 3/4 açıdan tamamen gösterir. Süre ~6 sn, scroll ile kontrol edilir; scroll edilmezse çok yavaş "nefes alan" boşta hareketi yapar.
- Başlık: büyük grotesk yazı `TAYKUT`, maskeli harf girişi. Alt başlık tek cümle (TR: "Ankara'da tasarlandı. Gezegenler için."; EN karşılığı). Altında iki düğme: **Sponsor Ol** (birincil) ve **Görevleri Gör**.

### 02 — Rover İnceleme (patlatılmış görünüm)
- Scroll 0→1: rover yavaşça döner; parçalar `src/scene/rover/explode.json` içinde tanımlı yön ve mesafelerle ayrılır (gövde kapağı yukarı, tekerlekler dışa, rocker-bogie yanlara, kartlar yukarı ve öne).
- Her parçanın etiketi: 3D çapa noktasından ekrana 1 px çizgi ve köşeli kart (`PARÇA ADI` + tek satır özellik). Etiketler çakışırsa otomatik kaydırılır, ekran dışına çıkmaz. Bilgiler `team_facts` içinden gelir.
- Etkileşim: Sürükleyerek döndürme (yaw sınırsız, pitch ±25°), çift tık sıfırlar. Sağ üstte "Gece modu" anahtarı (farlar ve kamera LED'leri yanar, ortam kararır).
- Mobilde parçalar ayrılır ama etiketler alttaki kaydırılabilir kart listesinde gösterilir.

### 03 — Kalkış → Dünya
- Kamera geri ve yukarı çekilir. Hangar zemini çözülür (dissolve shader), yıldız alanı belirir, bloom kısa süre artar ve Dünya kadraja girer.

### 04 — Dünya küresi ve görev haritası
- Kendi three.js küren (MapLibre değil).
- Katmanlar: gündüz (NASA Blue Marble), gece ışıkları (NASA Black Marble; gece tarafında görünür), okyanus parlaması (su maskesinden specular), bulutlar (ayrı küre, yavaş döner), atmosfer (Fresnel tabanlı kenar parlaması, gündüz tarafı mavi, terminatörde turuncu).
- Güneş yönü sabit ve sinematik bir açıda; Ankara gündüz tarafında.
- Görev pinleri: yüzeyden yükselen ince ışık sütunu, tabanda nabız halkası, hover/fokus'ta görev adı ve tarih. Pinlere sırayla 01, 02... numarası.
- Rotalar: bölgeler arasında büyük daire yayları (`slerp` ile), yay üzerinde akan ışık çizgisi (dash offset animasyonu).
- Sağ kenarda dikey görev listesi; tıklayınca o bölgeye scroll edilir. Klavye ile gezilebilir.

### 05..N — Görev bölgeleri
Her bölge aynı veri şemasıyla tanımlanır (`src/missions/<id>.ts`):

```ts
export interface Mission {
  id: string;                           // 'drumheller'
  order: number;
  title: { tr: string; en: string };
  subtitle: { tr: string; en: string }; // yarışma/bağlam
  status: 'competed' | 'target' | 'dream'; // dil buna göre değişir
  geo: { lat: number; lon: number; name: string; country: string };
  terrain: {
    heightUrl: string;                  // 16-bit PNG
    albedoUrl?: string;                 // KTX2
    normalUrl?: string;
    sizeMeters: [number, number];
    heightRange: [number, number];      // metre, meta.json'dan
    procedural?: ProceduralMaterialSpec;
  };
  atmosphere: { sky: SkySpec; fog: FogSpec; sun: SunSpec; lut: string; weather?: WeatherSpec };
  rover: 'summertech' | 'taykut2027';
  route: Array<[number, number]>;       // yerel metre, x/z
  events: MissionEvent[];               // { at: 0..1, type: 'arm'|'drill'|'pause'|'lights'|'checkpoint'|'camera', payload }
  hud: { objectives: { tr: string; en: string }[] };
  sources: string[];                    // ICERIK_KAYNAKLARI.md içindeki anahtarlar
}
```

Bölgeler ve görevler (sıra varsayılan; `<open_questions>` cevabına göre değişebilir):

| # | id | Bölge | Durum | Rover | Arazi verisi | Görev senaryosu | Görsel kimlik |
|---|---|---|---|---|---|---|---|
| 1 | `ankara` | Ankara, Ev Üssü | competed | taykut2027 | Copernicus GLO-30 DEM | Atölyeden çıkış, kısa test sürüşü, ArUco kalibrasyonu | Bozkır, gün batımı, sade |
| 2 | `mrc2026` | MRC 2026 parkuru | competed | **summertech** | Stilize regolit parkuru (gerçek saha konumu doğrulanana kadar **prosedürel**) | MRC'nin 3 gerçek görevi: Otonom ArUco → Sondaj → Gece ve Enerji | Gece, farlar, ArUco kartları, yapay Ay yüzeyi |
| 3 | `drumheller` | Drumheller, Alberta, Kanada (CIRC) | target | taykut2027 | NRCan HRDEM 1 m (elimizde) | Numune alma (bilim), ekipman bakımı (panel/anahtar), teslimat, otonom navigasyon | Badlands katmanlı kil tepeleri, sıcak öğleden sonra ışığı, rüzgâr tozu |
| 4 | `alps` | İsviçre Alpleri (Alpine/Swiss Rover Challenge) | target | taykut2027 | swissALTI3D (swisstopo açık veri) | Kayalık yamaç tırmanışı, kar ve çakıl geçişi, bakım görevi | Soğuk mavi ışık, kar lekeleri, sis katmanı, kar tozu |
| 5 | `utah` | Hanksville, Utah, ABD (MDRS/URC sahası) | dream | taykut2027 | USGS 3DEP 1 m (kamu malı) | Uzun mesafe otonom geçiş, kızıl kayalık | Kızıl kumtaşı, sert öğle güneşi, ısı dalgalanması |
| 6 | `mars` | Jezero Krateri, Mars (final) | dream | taykut2027 | NASA HiRISE DTM (kamu malı) | Kısa sürüş, durup kamerayı Dünya'ya çevirme, kapanış | Somon gökyüzü, düşük kontrast, uzakta toz şeytanı |

Dil kuralı: `competed` → geçmiş zaman ve gerçek sonuç; `target` → "hedefimiz", "hazırlanıyoruz"; `dream` → "bir gün". Katılmadığımız bir yarışmaya katılmış gibi yazma.

Gerçek yarışma görevlerini anlatırken o yarışmanın **resmi kural kitabını** web'de bul ve görev adlarını ona göre yaz; kaynağını `ICERIK_KAYNAKLARI.md`'ye ekle. Bulamazsan genel ifade kullan.

### Görev bölgesi akışı (her bölge için)
1. **Dalış:** Kürede hedef noktaya yaklaşma → bulut katmanından geçiş (yarı saydam düzlemler + sis) → arazi sisten belirir (1.5–2.5 sn).
2. **Kuruluş çekimi:** Geniş açı, arazinin büyüklüğü, rover küçük görünür. Sol üstte bölge kartı (ad, koordinat, yükseklik, tarih/durum).
3. **Sürüş:** Rover rotada ilerler, kamera sinematik takip (yan, arka 3/4, alçak açı tekerlek yakın çekimi, üstten drone). Kamera kesmeleri Theatre.js'de.
4. **Görev olayları:** Durma → kol IK ile hedefe uzanır → eylem (sondaj, numune, anahtar çevirme, ArUco okuma) → HUD'da görev maddesi ✓.
5. **Kapanış:** Rover durur, kamera dikey yükselir, arazi uydu görünümüne, sonra küreye döner. Sıradaki pine yay çizilir.
6. Her bölgede sağ altta **"Kontrolü al"** düğmesi (A9 aşamasından sonra).

### Rover simülasyonu

**A) Sinematik mod: analitik kinematik çözücü (varsayılan).** `src/scene/rover/kinematics.ts`, saf fonksiyonlar, birim testli.

Girdi: rover kökünün rota üzerindeki konumu ve yönü (x, z, yaw), heightfield örnekleyici `h(x,z)`, rover geometrisi (`rover2027.generated.json`'dan, yani `rover_params.yaml` kaynaklı: tekerlek konumları, rocker pivotu, bogie pivotu, tekerlek yarıçapı, eklem limitleri; SummerTech için `src/content/summertech.ts`).

Koordinat çerçevesi notu: `rover_params.yaml` ROS düzenini kullanır (x ileri, y sol, z yukarı). three.js/glTF ise y yukarı kullanır. Dönüşümü **tek bir yerde** yap (`lib/frames.ts`: `ros→three: (x, y, z) → (−y, z, −x)` ya da modelin ileri yönüne göre seçtiğin eşleme) ve birim testle doğrula (ön tekerlek ekranda rover'ın önünde olmalı).
Çıktı: gövde konumu (y), pitch, roll; sağ/sol rocker açısı; sağ/sol bogie açısı; 6 tekerlek dönüş açısı; her tekerleğin temas noktası ve normali.

Yöntem (6 tekerlek rocker-bogie):
1. Her tekerlek için temas yüksekliği: tekerlek yarıçapı kadar disk profili üzerinde 5 noktadan `h` örnekle, en yüksek temas noktasını al (tekerleğin araziye gömülmesini önler). Örnekleme çift doğrusal (bilinear) enterpolasyonla yapılır.
2. **Bogie (her taraf):** orta ve arka tekerlek temas noktaları arasındaki doğrunun eğimi → bogie açısı; bogie pivot yüksekliği = iki tekerlek merkezinin bogie geometrisine göre ağırlıklı konumu.
3. **Rocker (her taraf):** ön tekerlek merkezi ile bogie pivotu arasındaki doğru → rocker açısı ve rocker pivot (gövde bağlantısı) yüksekliği.
4. **Diferansiyel:** gövde pitch'i = (θ_rocker_sol + θ_rocker_sağ) / 2; rocker'ların gövdeye göre açıları eşit ve ters (±Δ). Gövde roll'ü = sol ve sağ rocker pivot yükseklik farkı / iz genişliği.
5. Gövde yüksekliği = sol ve sağ rocker pivot yüksekliklerinin ortalaması.
6. Tekerlek dönüşü = taraf bazında kat edilen yay uzunluğu / r. Yerinde dönüşte (skid-steer) taraflar ters döner.
7. Görsel yumuşatma: gövde pitch/roll'üne kritik sönümlü yay (ω≈12 rad/s), ivme ve frende ±1.5° görsel yaylanma. Yumuşatma da scroll konumunun saf fonksiyonu olmalı ki geri sarma deterministik kalsın (zaman integrasyonu yerine rota boyunca önceden hesaplanmış örnekler kullan).

8. **Limitler:** Rocker ve bogie açıları `rocker_limit`/`bogie_limit` değerlerini aşarsa açıyı sınırda tut, o tekerleği "temas yok" olarak işaretle (havada kalan tekerlek gerçekçi bir durumdur) ve HUD'da kısa "TEKER BOŞTA" uyarısı göster. Rota tasarımında bu durum nadir olmalı: rota üreticisi (`tools/route/plan_route.mjs`) eğimi rover limitlerini aşan noktalardan kaçınsın.
9. **Diferansiyel oranı:** Görsel diferansiyel dişlisi `diff_bar_ratio` (1.5) oranıyla rocker farkına göre döner; yakın çekimde bu dişlinin döndüğü görülmeli.

4 tekerlekli diferansiyelli rocker (SummerTech veya `wheel_count: 4` olursa 2027 rover'ı) için aynı çözücüyü bogie'siz kullan: her tarafta iki tekerlek tek rocker'a bağlı; rocker açısı = ön ve arka temas noktaları arasındaki doğrunun eğimi.

**Çözücü testleri** (`tests/unit/kinematics.test.ts`): düz zemin, sadece sol ön tekerlek altında 10 cm basamak, simetrik tümsek, 15° düzgün yokuş (pitch = 15° ±0.1°), yan eğim (roll), limit aşımı, 4 ve 6 tekerlek varyantları. Beklenen değerler test içinde geometriden elle hesaplanır ve hesap yorum olarak yazılır.

Rota boyunca çözüm, bölge yüklenince 2048 örnekte önceden hesaplanıp `Float32Array` içinde saklanır (Web Worker'da). Render sırasında sadece örnekler arasında enterpolasyon yapılır.

**B) "Sen Sür" modu: Rapier fizik.** `src/scene/drive/`, tembel yüklenir.
- Gövde: dinamik rijit cisim, gerçekçi kütle dağılımı (ağırlık merkezi alçak).
- Rocker'lar gövdeye, bogie'ler rocker'lara **revolute joint** ile bağlı; açı limitleri `rover_params.yaml` içindeki `joints` bölümünden.
- Diferansiyel: her adımda sol ve sağ rocker açılarını eşit ve ters tutmaya çalışan yumuşak kısıt (iki eklem motoru, hedef açı = karşı rocker'ın negatifi; sertlik ve sönüm kütleye göre ayarlanır).
- Tekerlekler: silindir collider, eklem motoruyla tahrik (hız kontrolü), bölgeye göre sürtünme (kum 0.6, kaya 0.9, kar 0.35).
- Arazi: Rapier heightfield collider (aynı 16-bit veriden, düşük çözünürlüklü kopya).
- Kontrol: W/S ileri-geri, A/D dönüş (skid-steer), Shift hassas mod, R sıfırla, Esc çık. Mobilde sol yarıda sanal joystick.
- Hız sınırı: SummerTech için 0.58 m/s (tahmin); 2027 rover'ı için `rover2027.ts`'deki hedef değer. Arayüzde "Simülasyon — gerçek değerler tahminidir" notu.
- Devrilme: roll veya pitch 2 sn boyunca > 70° ise rover'ı yumuşakça kaldırıp düzelt.
- Fizik 60 Hz sabit adım, render ile enterpolasyon.

**Görsel geri bildirim (her iki modda):**
- **İz:** Araziyle aynı UV'ye sahip 1024² iz render target'ı; her karede tekerlek temas noktalarına tekerlek genişliğinde iz damgası çizilir. Arazi shader'ı bunu normal ve albedo karartması olarak uygular. İz yavaşça solar.
- **Toz:** GPU parçacıkları (instanced, tek draw call), tekerlek hızına ve zemin tipine bağlı yayılma; bölge renginde. Mobilde yarı sayıda.
- **Çakıl:** Tekerlek yakınında instanced küçük taşlar; temas anında hafif zıplama (sadece görsel).
- **Kol:** 3 eklemli analitik IK (2 bağlantılı düzlemsel çözüm + taban dönüşü), hedefe uzanma eğrisi ease-in-out; uç efektörde sondaj dönüşü ve toz.
- **Farlar:** Gece bölgelerinde spot ışıkları ve volumetrik koni (ucuz additive mesh).

### HUD — Görev Kontrol
Görev bölgelerinde aktif olur, `src/hud/`:
- **Sol üst:** Görev numarası ve adı, bölge, `UTC hh:mm:ss`, yerel saat, enlem/boylam (rover konumundan **gerçekten** hesaplanır: yerel metreden WGS84'e ters dönüşüm).
- **Sağ üst:** Mini harita (arazinin üstten görünümü + kontur çizgileri shader'la, rover oku, rota, hedef işaretleri).
- **Sol alt:** Telemetri: hız (m/s), yön (°), pitch/roll (°), sol/sağ rocker açısı, eğim yüzdesi, batarya (rota boyunca doğrusal azalan **simüle** değer, "SİM" etiketiyle), sinyal. Değerler kinematik çözücüden. Rastgele sayı yasak.
- **Sağ alt:** Görev maddeleri kontrol listesi, olaylarla ✓ olur; "Kontrolü al" düğmesi.
- **İsteğe bağlı kamera penceresi:** Rover ön kamerasından ikinci render (256×144, tarama çizgisi + hafif balıkgözü shader), sadece Ultra/Yüksek kademede.
- Stil: 1 px çizgiler, köşe işaretleri, monospace, yarı saydam koyu zemin, `backdrop-filter` sadece destekleniyorsa.
- `C` tuşu: temiz mod (HUD gizli, fotoğraf modu).

### Sonraki içerik bölümleri
- **Rakamlar:** Gerçek verilerle sayaçlar (MRC başvuru 1., final 4., 45×45 cm, ~35 dk hesaplanan, ~0.58 m/s tahmin, 3 kart). Etiketler dürüst.
- **Yer İstasyonu (etkileşimli demo):** Takımın gerçek web yer istasyonunun tarayıcıda simülasyonla çalışan sürümü: kamera paneli (ArUco tespiti), 2B/3B harita (Üstten/Takip, İzi sil), acil durdur + kilit, yön tuşları, Otonomi/Görev/PID sekmeleri, telemetri grafikleri. Ziyaretçi waypoint ekleyip görevi başlatır, rover otonom gider. Ayrıntı: `prompts/B19_yer_istasyonu.md`. Üstte dürüstlük şeridi: "Simülasyon demosu, gerçek rover'a bağlı değil."
- **Mühendislik:** 5 alt sistem kartı (Mekanik, Elektronik, Yazılım ve Otonomi, Kol ve Tutucu, Bilim). Her kartta kısa açıklama ve bir görsel. Altında "Dijital İkiz ve Yer İstasyonu" vitrini: `ground-station.mp4` (otomatik oynatma sessiz ve döngülü, reduced-motion'da poster) ve açıklama.
- **Yolculuk:** Dikey zaman çizelgesi: Kas 2025 kuruluş → 2026 başvuru videosu 1. → Tem–Ağu 2026 MRC finali 4. → 2027 yeni ekip ve yeni rover → Ağu 2027 CIRC hedefi.
- **Takım:** 7 üye ve danışman kartı. Isim, rol (varsa), illüstrasyon/siluet. Hover'da ince rover parçası çizimi.
- **Sponsor Ol:** Değer önerisi (logonuz rover'da, tişörtte, sitede, yarışma sunumlarında; sosyal medya teşekkürü; uluslararası görünürlük), 4 kademe (öneri adlar: **Drumheller** ana sponsor · **Alp** · **Regolit** · **Dost** — ayni bağış: parça, üretim, ulaşım, mentorluk), tutarlar `<open_questions>` cevabına kadar **yazılmaz**. `public/docs/sponsor.pdf` için yer (kullanıcı sağlayacak; yoksa düğme gizli). Logo duvarı (boşsa "İlk sponsorumuz siz olun" kartı). İletişim: e-posta ve Instagram.
- **Altbilgi:** Okul, danışman, kaptan, Instagram, dil seçici, "Veri ve atıflar", lisans notu, klavye kısayolları.

### Alt sayfalar
`/taykut/sponsor/`, `/taykut/istasyon/` (etkileşimli yer istasyonu demosu, B19), `/taykut/rover/` (iki rover'ın teknik tablosu), `/taykut/basin/` (basın kiti: logo, kısa ve uzun tanıtım metni, fotoğraflar) ve `404.html` (kayıp rover temalı, ana sayfaya dönüş). Vite çok sayfalı derleme (`build.rollupOptions.input`) ile.

### Mikro etkileşimler
- Özel imleç: masaüstünde ince halka, link üzerinde büyür, 3D'de "SÜRÜKLE" metni. Dokunmatikte kapalı.
- Mıknatıslı birincil düğmeler.
- Başlıklarda SplitText maskeli giriş; paragraflarda hafif yukarı kayma ve opaklık.
- Sağ kenarda bölüm ilerleme göstergesi (noktalar + aktif bölüm adı).
- Kısayollar: `M` ses, `L` dil, `C` temiz mod, `Esc` sürüşten çık, `?` kısayol listesi.

### Ses
- Varsayılan **kapalı**; ilk kullanıcı etkileşiminden sonra sağ altta küçük "Sesi aç" ipucu (bir kez).
- Katmanlar: bölge ortam sesi (rüzgâr, Alplerde soğuk rüzgâr, Mars'ta boğuk uğultu), motor (hıza bağlı `rate` ve `volume`), servo (kol olayları), arayüz tıkları, geçiş whoosh.
- Kaynak: Freesound'da **sadece CC0** filtreli sesler veya kendi üretimin (Web Audio ile sentez). Her ses `VARLIKLAR.md`'de.
- Toplam ses paketi ≤ 1.5 MB (OGG/Opus + MP3 yedek), tembel yüklenir.

### Geçişler
- Hangar→Dünya, Küre→Arazi, Arazi→Küre: en fazla 2.5 sn; hızlı scroll'da kısalır.
- Geçişlerde kare düşmesini önlemek için sonraki sahnenin shader'larını önceden derle (`renderer.compile`).
</experience_spec>

<visual_language>
- **Ruh hali:** Görev kontrol + endüstriyel tasarım. Karanlık, sakin, hassas. Az renk, çok ışık. Her piksel bir mühendis tarafından konmuş gibi.
- **Renk belirteçleri (CSS değişkenleri, `src/styles/tokens.css`):**
  - `--bg: #07090C`, `--surface: #0E1218`, `--line: #1E2630`
  - `--text: #E8ECF1`, `--text-2: #8A95A3`
  - `--accent`: logodaki ana renk; `summertech-logo.png`'den piksel ölçerek çıkar. Uygun değilse `#FF6A1A`.
  - `--hud: #7CF2C9`, `--warn: #FFC940`, `--danger: #FF4D4D`
  - Tüm metin/zemin çiftleri AA kontrastını sağlamalı (betikle doğrula).
- **Tipografi:** Başlık için iki aday hazırla (*Space Grotesk* ve *Archivo* geniş kesim), metin *Inter*, HUD ve sayılar *JetBrains Mono*. Hepsi `@fontsource`, OFL, Latin Extended alt kümesi (Türkçe karakterler). Akışkan ölçek `clamp()` ile. `font-display: swap` ve ilk fontların preload'u.
- **Izgara:** 12 sütun, masaüstünde 32 px, mobilde 16 px kenar boşluğu. Bölüm başlıkları `01 / ROVER` biçiminde.
- **3D görünüm:** ACES Filmic ton eşleme, fiziksel ışık birimleri, bölgeye özel LUT, hafif bloom (eşik yüksek, sadece ışıklar), yakın çekimde DOF, çok hafif grain ve vinyet. Plastik görünümden kaçın: pürüzlülük haritaları, kenar aşınması, toz birikimi.
- **Malzemeler:** Alüminyum profil (anizotropik, fırçalanmış), TPU tekerlek (mat, hafif toz), 3D baskı parçalar (katman çizgisi normal map'i), PCB (yeşil maske, altın ped, beyaz serigrafi), kablolar.
- **Fotoğraflar:** Sitenin paletine uyan hafif renk derecelendirme (CSS filtresi değil, dışa aktarımda).
</visual_language>

<data_engineering_pipeline>
Coğrafi ve 3D varlık hattını **tekrarlanabilir** kur. Her betik `tools/` altında, girdisi ve çıktısı belli, tek komutla çalışır ve README'de anlatılır. Ham büyük veriler depoya **girmez** (`tools/.cache/`, `.gitignore`'da). Depoya sadece optimize çıktı girer.

### Arazi hattı — `tools/terrain/build_terrain.py`
Girdi: `missions/<id>.terrain.yaml`:
```yaml
id: drumheller
source: { type: geotiff, path: "../Rover_Dijital_Ikiz/terrain/raw/hrdem/drumheller_1stave_dtm_1m.tif" }
# veya { type: url, url: "...", license: "..." }
center: { lat: 51.4667, lon: -112.7167 }   # gerçek değeri veriden oku, buradaki örnektir
size_m: 1024                                 # kare kesit kenarı
out_res: 1025                                # 2^n+1
crs_out: local_enu
license: "Open Government Licence – Canada 2.0"
attribution: "Contains information licensed under the Open Government Licence – Canada. NRCan HRDEM."
```
Adımlar:
1. Kaynağı aç, CRS'yi oku, merkez etrafında `size_m` kare kesit al (gerekirse yeniden projeksiyon; yerel ENU için merkezde teğet düzlem).
2. Boşlukları (nodata) komşu enterpolasyonla doldur. Kaç piksel doldurulduğunu raporla; %2'yi aşarsa uyar.
3. Yeniden örnekle (`out_res`), min/max kotu bul.
4. 16-bit PNG'ye normalize et: `v = round((h - min) / (max - min) * 65535)`.
5. Normal haritası (Sobel, gerçek metre ölçeğinde) → KTX2 (UASTC).
6. Eğim, yükseklik ve eğrilik haritalarından prosedürel malzeme maskesi (kaya/kum/kar) → KTX2.
7. Rapier için 257² düşük çözünürlüklü kopya.
8. `meta.json`: `{ sizeMeters, heightRange, resolution, center: {lat, lon}, crs, source, license, attribution, generatedAt, sha256 }`.
9. Doğrulama: PNG'den geri okunan yüksekliklerle kaynak arasındaki RMSE < 0.05 m (16 bit nicemleme sınırı içinde); başarısızsa betik hata verir.

Veri kaynakları (hepsi ücretsiz, hesapsız veya ücretsiz hesapla; indirme betikte belgelenir):
- **Drumheller:** NRCan HRDEM 1 m (elimizde). OGL-Canada-2.0.
- **Alpler:** swissALTI3D (swisstopo, ücretsiz açık veri; atıf: "© swisstopo"). Alpine yarışma sahası bilinmiyorsa İsviçre Alpleri'nde temsili bir yamaç seç ve "temsili" diye belirt.
- **Utah:** USGS 3DEP 1 m (kamu malı), MDRS çevresi (Hanksville).
- **Mars:** NASA HiRISE DTM, Jezero bölgesi (kamu malı; atıf: NASA/JPL-Caltech/University of Arizona).
- **Ankara:** Copernicus GLO-30 DEM (ücretsiz; atıf: "© DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA").
- **MRC:** Prosedürel (gürültü + krater damgaları + ArUco kartları), gerçek veri yok.
- Uydu albedo dokusu kullanırsan: Copernicus Sentinel-2 L2A sahneleri (ücretsiz, atıf: "Contains modified Copernicus Sentinel data [yıl]"). **CC BY-NC-SA** lisanslı türev setleri (ör. bazı Sentinel-2 cloudless yılları) kullanma; site sponsor topladığı için "ticari olmayan" sayılması belirsiz. Varsayılan ve tercih edilen yol: yükseklik, eğim ve eğrilikten **prosedürel** malzeme; uydu görüntüsü sadece renk paleti referansı olarak kullanılır.
- Her bölgenin `meta.json` dosyasındaki lisans ve atıf metni, altbilgideki "Veri ve atıflar" listesine **otomatik** eklenir (elle yazılmaz).
- **İndirme yöntemi belirsizse veya giriş gerektiriyorsa:** Dur, kullanıcıya hangi dosyanın nereden indirileceğini söyle; tahminle URL yazma.

### Küre dokuları — `tools/globe/build_globe.py`
- NASA Blue Marble (gündüz) ve Black Marble (gece), 8K kaynaktan 4K (Ultra) ve 2K (Mobil) KTX2. Su maskesi ve bulutlar (NASA kaynaklı). Atıflar `VARLIKLAR.md`'de.

### Rover hattı — `tools/rover/`
0. Blender yolunu kendin bul (`where blender` veya Program Files altında); bulamazsan kullanıcıya sor, kurulumu kendin yapma.
1. `build_rover.py` (Blender arka planda, `blender -b -P`): 2027 rover GLB parçalarını içe aktar; `rover_params.yaml` + xacro'daki eklem konum ve eksenlerine göre hiyerarşi kur: `root > body > [rocker_L > bogie_L > wheel_L_mid, wheel_L_rear; wheel_L_front], [sağ taraf aynı], diff, arm > ...`. Pivotlar eklem eksenlerinde olmalı. Ölçek metre, +Y yukarı (glTF standardı).
2. Eksik görsel ayrıntıyı (cıvata, kablo, kart, kamera, anten, kol) `blender_rover.py`'den al veya prosedürel olarak ekle. Gerçek rover'da olmayan parça **ekleme**.
3. Malzemeleri PBR'ye çevir, 2K doku setlerini pişir (AO, pürüzlülük, kenar aşınması).
4. LOD0 (~150–250k üçgen), LOD1 (~40k), LOD2 (~8k). Hepsi aynı hiyerarşi ve düğüm adları.
5. `gltf-transform`: `dedup → prune → weld → meshopt → ktx2 (UASTC normal, ETC1S renk) → resize`. Çıktılar: `public/models/taykut2027.lod{0,1,2}.glb`.
6. SummerTech (MRC rover'ı) modeli yoksa: Fusion 360 dışa aktarımı gelene kadar fotoğraflara dayalı, oranları `team_facts` ile uyumlu sade bir Blender modeli üret (4 tekerlek, diferansiyelli rocker, kol, sondaj). Kendi başlığında "temsili model" notu.
7. `tools/rover/validate.mjs`: Düğüm adlarını, pivot konumlarını (`rover_params.yaml`'a göre ±1 mm, eksen dönüşümü uygulanmış), üçgen sayılarını ve dosya boyutunu kontrol eder. CI'da çalışır.

### Medya hattı — `tools/media/build_media.mjs`
Fotoğrafları `sharp` ile AVIF + WebP, genişlikler 640/1280/1920, `srcset`. Videoyu ffmpeg ile H.264 (CRF 26, 1080p ve 720p) + poster. Ham dosyalar `tools/.cache/` içinde kalır.
</data_engineering_pipeline>

<architecture>
```
taykut/
├─ index.html  sponsor/index.html  rover/index.html  basin/index.html  404.html
├─ public/
│  ├─ media/  models/  terrain/<id>/  globe/  audio/  docs/
│  ├─ robots.txt  sitemap.xml  og.jpg  favicon.svg  manifest.webmanifest
├─ src/
│  ├─ main.tsx  App.tsx
│  ├─ content/        tr.ts  en.ts  schema.ts  contact.ts  rover2027.ts  team.ts
│  ├─ styles/         tokens.css  base.css  typography.css
│  ├─ sections/       Boot  Hero  Inspect  Globe  MissionSection  Stats  Engineering  Journey  Team  Sponsor  Footer
│  ├─ scene/
│  │  ├─ Experience.tsx       # tek Canvas, sahne seçici, kalite kademesi
│  │  ├─ studio/              # hangar, ışık, patlatılmış görünüm, etiketler
│  │  ├─ globe/               # Earth, Atmosphere.glsl, Clouds, Pins, Arcs
│  │  ├─ terrain/             # TerrainMesh (GPU heightfield, LOD), Trails, Dust, Pebbles, Sky
│  │  ├─ rover/               # RoverModel, kinematics.ts, armIK.ts, lights, explode.json
│  │  ├─ drive/               # Rapier sürüş (tembel)
│  │  ├─ post/                # efekt zinciri, LUT'lar
│  │  └─ transitions/
│  ├─ missions/       index.ts  ankara.ts  mrc2026.ts  drumheller.ts  alps.ts  utah.ts  mars.ts
│  ├─ hud/
│  ├─ timeline/       theatre-state.json  scroll.ts
│  ├─ audio/
│  ├─ store/          useStore.ts
│  ├─ workers/        routeSolver.worker.ts
│  └─ lib/            geo.ts (WGS84↔ECEF↔ENU)  heightfield.ts  quality.ts  math.ts  i18n.ts
├─ tools/            terrain/  globe/  rover/  media/  check-contrast.mjs  budget.mjs
├─ tests/            unit/ (vitest)  e2e/ (playwright)
├─ docs/             superpowers/specs/  superpowers/plans/  VARLIKLAR.md  ICERIK_KAYNAKLARI.md  ILERLEME.md
├─ .github/workflows/ ci.yml  deploy.yml
├─ PROMPT_TAYKUT_SITE.md
└─ README.md
```

Kurallar:
- **Arazi render'ı:** Tek düzlem geometrisi + vertex shader'da heightmap ile yükseltme (GPU heightfield), kameraya uzaklığa göre 3–4 halkalı LOD (geomipmapping veya CDLOD tarzı). Ufka kadar uzanan düşük çözünürlüklü "etek" arazi + sis ile sınırsız görünüm.
- **Heightfield örnekleyici** (`lib/heightfield.ts`): CPU tarafında aynı 16-bit veriden bilinear örnekleme; kinematik çözücü, kamera çarpışması ve HUD bunu kullanır. Shader ile CPU aynı formülü kullanmalı (test et).
- **Coğrafi dönüşüm** (`lib/geo.ts`): WGS84 → ECEF → yerel ENU ve tersi. Küre üzerindeki pin konumu ile arazinin merkezi aynı fonksiyondan gelir. Birim testli (bilinen noktalarla < 1 cm hata).
- **Dil:** `content/schema.ts` tipi; `tr.ts` ve `en.ts` bu tipe uymak zorunda (eksik anahtar derleme hatası). `?lang=en` + `localStorage`; `<html lang>` güncellenir; `hreflang` etiketleri.
- **Durum:** Tek zustand store: `section`, `sectionProgress`, `missionId`, `quality`, `lang`, `audioOn`, `driveMode`, `hudVisible`.
- **Kod bölme:** Ana paket sadece HTML içerik + küçük yükleyici. `three` + sahneler ayrı parça, Rapier ayrı parça, Theatre Studio sadece dev.
</architecture>

<quality_tiers>
`lib/quality.ts`, `detect-gpu` + ilk 3 saniyelik FPS ölçümü ile:

| Kademe | DPR | Gölge | Son işlem | Arazi | Toz | Rover LOD | Diğer |
|---|---|---|---|---|---|---|---|
| ultra | min(2, cihaz) | 2048 PCSS benzeri | bloom+DOF+LUT+grain+SMAA | 2049² | tam | 0 | kamera penceresi, bulut gölgesi |
| high | 1.5 | 1024 | bloom+LUT+SMAA | 1025² | %70 | 0/1 | |
| mobile | 1–1.5 | baked/contact | LUT+FXAA | 513² | %40 | 1 | HUD sadeleşir |
| fallback | — | — | — | — | — | — | 3D yok: poster görseller, statik küre görseli, video |

- 3 sn boyunca hedef FPS'in (ultra/high 55, mobile 28) altında kalınırsa bir kademe düşür; asla otomatik yükseltme yapma (titreme olmasın).
- Altbilgide kullanıcı kademeyi elle seçebilir.
- WebGL2 yoksa, `prefers-reduced-motion` açıksa veya `?lite=1` varsa → fallback.
</quality_tiers>

<performance_budget>
`tools/budget.mjs` ile derlemeden sonra ölçülür, CI'da aşılırsa hata:
- İlk HTML+CSS+JS (gzip, 3D hariç): **≤ 250 KB**
- 3D çekirdek parçası (three + r3f + sahneler, gzip): **≤ 450 KB**
- Boot→Hangar varlıkları (rover LOD0 + ortam + fontlar): **≤ 6 MB**
- Her görev bölgesi ek varlık: **≤ 8 MB**
- Küre dokuları (ultra): **≤ 10 MB**, mobil **≤ 3 MB**
- LCP ≤ 2.5 sn (Lighthouse mobil, 4G yavaşlatma), CLS ≤ 0.05, INP ≤ 200 ms
- FPS: orta masaüstü GPU'da 60, orta telefonda ≥ 30 (Playwright + `performance.now` ile örnek ölçüm, rapora yazılır)
- Draw call: Hangar ≤ 150, Arazi ≤ 250
- Lighthouse mobil: Performans ≥ 80, Erişilebilirlik ≥ 95, En İyi Uygulamalar ≥ 95, SEO = 100
</performance_budget>

<accessibility_seo>
- Canvas `aria-hidden="true"`; her 3D anlatının eşdeğer metni HTML'de.
- Tüm etkileşimli öğeler klavyeyle ulaşılabilir, görünür odak halkası, mantıklı sekme sırası, "İçeriğe atla" linki.
- `prefers-reduced-motion`: Boot yok, kamera otomatik hareket etmez, geçişler 200 ms çapraz geçiş, parallax yok, video poster.
- Kontrast AA (betikle doğrulanır). Dokunma hedefleri ≥ 44 px.
- Videolarda açıklama metni; dekoratif olmayan görsellerde anlamlı `alt`.
- SEO: Her sayfada başlık, açıklama, canonical, OG/Twitter kartı (1200×630), `hreflang` (tr/en), JSON-LD (`SportsTeam` + `EducationalOrganization` ilişkisi), `sitemap.xml`, `robots.txt`. Başlıklar anlamlı hiyerarşide (tek `h1`).
- Gizlilik: Çerez yok, harici font/CDN isteği yok, e-posta adresi basit gizleme ile.
</accessibility_seo>

<cinematography>
Kamera, sitenin yönetmenidir. Kurallar:

- **Lens dili:** Hangar ve detay çekimleri 50–85 mm eşdeğeri (dar FOV 20–28°), arazi kuruluş çekimleri 24–35 mm (FOV 45–55°), küre 35 mm. Geniş açıyı (FOV > 60°) kullanma; ucuz görünür. FOV değişimleri yumuşak ve nadirdir.
- **Hareket:** Her kamera hareketi ease'li (cubic veya Theatre eğrisi), ani durma yok. Kamera hiçbir zaman rover'dan hızlı hareket edip onu kadrajdan kaçırmaz. Bilinçli bir "dutch angle" hariç roll (yatay eğim) yok.
- **Kompozisyon:** Üçler kuralı; rover'ın hareket yönünde önünde boşluk bırak (lead room). Metin bloğu ekranın bir yarısındaysa rover diğer yarıda kalır. Kamera ile HTML metni aynı scroll ilerlemesine bağlıdır, bu yüzden hiçbir zaman çakışmaz.
- **Arazi çarpışması:** Kamera her karede `h(x,z) + 0.6 m`'nin altına inemez (heightfield örnekleyiciyle kontrol). Kamera ile rover arasında arazi kalırsa (görüş engeli) kamera yükselir.
- **Odak:** DOF açıkken odak mesafesi her karede rover gövdesine (veya o anki konu parçasına) ölçülür; odak "nefes alır" ama asla bulanık rover gösterilmez.
- **Görev bölgesi çekim listesi** (her bölgede bu sırayla; süre oranları scroll aralığının yüzdesi):
  1. Kuruluş (%15): yüksek ve geniş, yavaş yatay kayma; rover ekranın küçük bir parçası.
  2. Takip, yan profil (%20): süspansiyonun eğilişi en iyi buradan görünür; kamera tekerlek aksı yüksekliğinde.
  3. Tekerlek makro (%10): tek tekerlek engelden geçerken rocker ve bogie açısının değişimi; toz yakın plan.
  4. Arka 3/4 takip (%15): rover'ın ufka doğru gidişi, iz bırakışı.
  5. Görev eylemi (%25): kol IK yakın çekimi, sondaj veya bakım; HUD maddesi ✓.
  6. Drone yükselişi (%15): dikey yükseliş, arazi küçülür, küreye geçiş başlar.
- Her bölgenin kamera yolu ve hedefleri Theatre durumunda bölge adıyla ayrı bir "sheet" olarak tutulur.
- **Boşta hareket:** Kullanıcı scroll etmiyorsa kamera neredeyse fark edilmeyen bir nefes hareketi yapar (±2 cm, 6 sn periyot). reduced-motion'da kapalıdır.
</cinematography>

<rendering_and_shaders>
- **Renk yönetimi:** `renderer.outputColorSpace = SRGBColorSpace`, renk dokuları sRGB, veri dokuları (normal, pürüzlülük, yükseklik) Linear. Ton eşleme ACES Filmic, pozlama bölge başına ayarlı.
- **Işık:** Her bölgede tek yönlü güneş ışığı (gölgeli), gökyüzünden türetilmiş ortam ışığı (PMREM ile prosedürel gökyüzünden veya ücretsiz CC0 HDRI'dan; Poly Haven CC0 HDRI'ları kullanılabilir ve `VARLIKLAR.md`'ye yazılır). Gölge kamerası rover'ı sıkı çerçeveler (yüksek çözünürlük), uzak arazi için ikinci ucuz gölge veya baked AO.
- **Gökyüzü:** Fiziksel tabanlı gökyüzü (three `Sky` benzeri Preetham/Hosek veya kendi Rayleigh+Mie shader'ın). Mars'ta Mie baskın ve somon tonlu. Sis rengi gökyüzünün ufuk rengiyle aynı kaynaktan hesaplanır, böylece arazi ufukta gökyüzüne kusursuz karışır.
- **Arazi shader'ı:**
  - Vertex: heightmap'ten yükseltme, LOD halkaları arasında çatlak oluşmaması için kenar morph'u (CDLOD geomorph).
  - Fragment: eğime göre kaya, düzlükte toprak/kum, yükseklik ve yöne göre kar (Alpler); dik yamaçlarda **triplanar** eşleme (dokular uzamasın); yakın mesafede tekrar eden detay normal'i + uzak mesafede makro varyasyon (tekrar desenini kırmak için gürültü); iz maskesi; mesafe sisi.
  - Doku kaynağı: CC0 PBR setleri (Poly Haven / ambientCG, CC0) KTX2'ye çevrilmiş; her set `VARLIKLAR.md`'de.
- **Atmosfer shader'ı (küre):** Fresnel kenar parlaması + güneş yönüne bağlı renk (gündüz mavi, terminatörde turuncu), eklemeli harmanlama, arka yüz küresi.
- **Gece ışıkları:** Black Marble dokusu, sadece güneşin aydınlatmadığı tarafta (`smoothstep` ile yumuşak terminatör).
- **Toz:** Instanced quad, yumuşak parçacık (soft particles, derinlik dokusuyla kesişim yumuşatma), ömür boyunca boyut artışı ve opaklık azalması, rüzgâr vektörü bölgeden.
- **Bulut geçişi:** 3–5 katmanlı yarı saydam gürültü düzlemleri, kamera geçerken opaklık artar; sonra arazi sisi azalır.
- **Son işlem sırası:** RenderPass → (SSAO sadece ultra) → DOF → Bloom → LUT (bölge) → Vinyet → Grain → SMAA/FXAA. Kademeye göre açılıp kapanır.
- **GPU bellek bütçesi:** Ultra ≤ 600 MB, high ≤ 400 MB, mobile ≤ 200 MB doku+geometri (`renderer.info` ile ölçülür ve dev panelinde gösterilir).
- **Dev paneli:** `?debug=1` ile FPS, draw call, üçgen, bellek, aktif kademe, tekerlek temas noktaları, kinematik açılar ve heightfield ızgarası görselleştirmesi. Üretimde koda dahil olmaz (dinamik import).
</rendering_and_shaders>

<copywriting>
- **Ses tonu:** Kendinden emin, kısa, mühendis gibi. Abartı yok. Lise takımı olmak saklanmaz, güç olarak sunulur ("Lise öğrencileriyiz. Rover'ımızı sıfırdan tasarladık.").
- **Yasak ifadeler:** "dünyanın en iyisi", "devrim niteliğinde", "eşsiz", "NASA ile birlikte", "NASA onaylı", gerçeği aşan her üstünlük iddiası.
- **Başlıklar** en fazla 6 kelime, iki satıra bölünecek biçimde. Paragraflar en fazla 2–3 cümle.
- **Sayılar** her zaman birimli ve dürüst etiketli ("~35 dk · hesaplanan").
- **İki dil:** İngilizce metin Türkçenin kelimesi kelimesine çevirisi değil, doğal İngilizce karşılığıdır. Takım ve okul adları iki dilde de doğru yazılır. Türkçe metinde İngilizce teknik terim gerekiyorsa ilk geçişte kısa açıklama verilir (ör. "rocker-bogie süspansiyon (yaysız, eklemli denge sistemi)").
- **Eylem çağrıları:** Birincil hep "Sponsor Ol / Become a Sponsor", ikincil "Görevleri Gör / See the Missions" veya "Takımla Tanış / Meet the Team".
- **Örnek ton (referans, aynen kopyalamak zorunlu değil):**
  - Hero TR: "TAYKUT — Ankara'da tasarlandı. Gezegenler için." / EN: "TAYKUT — Designed in Ankara. Built for other worlds."
  - Sponsor TR: "Logonuz bir sonraki yarışmada rover'ımızla birlikte sahada olsun." / EN: "Put your logo on the field with us at our next competition."
- Metinlerin kaynakları `ICERIK_KAYNAKLARI.md`'de; mevcut eski site metinleri (`taykut-site/src/i18n.js`) iyi bir başlangıçtır ama her iddia yeniden doğrulanır.
</copywriting>

<robustness>
- **Varlık yükleme hatası:** Herhangi bir bölge varlığı yüklenemezse o bölge yedek moda (poster görsel + metin) geçer, site çalışmaya devam eder; konsola tek ve anlaşılır uyarı yazılır.
- **Poster görseller:** Her sahne ve bölge için `tools/posters/capture.mjs` (Playwright) ile otomatik ekran görüntüsü alınır (AVIF/WebP, masaüstü ve mobil). Bunlar yedek modda, OG görsellerinde ve yükleme sırasında kullanılır.
- **WebGL context lost:** `webglcontextlost` olayında render durur, poster gösterilir; `webglcontextrestored` ile varlıklar yeniden yüklenip devam edilir.
- **Sekme gizlenince** render döngüsü durur (`document.visibilityState`), ses kısılır.
- **Yeniden boyutlandırma ve yön değişimi:** `100svh/100dvh` kullan; mobilde adres çubuğu açılıp kapanınca sahne zıplamasın.
- **Bellek:** Bölgeden çıkınca geometri, doku ve render target'lar `dispose` edilir; Playwright testi 6 bölge gezildikten sonra `renderer.info.memory` değerinin başlangıca yakın döndüğünü doğrular.
- **Ağ:** Büyük varlıklarda `fetch` ile ilerleme ölçülür; yavaş bağlantıda (`navigator.connection.saveData` veya effectiveType 2g/3g) otomatik mobil kademe.
- **Hata sınırı:** React Error Boundary 3D katmanını sarar; 3D çökerse içerik etkilenmez.
</robustness>

<testing_matrix>
**Birim (Vitest):** `geo.ts` (bilinen noktalar: Ankara, Drumheller), `frames.ts`, `heightfield.ts` (bilinear, kenarlar), `kinematics.ts` (bkz. çözücü testleri), `armIK.ts` (ulaşılabilir ve ulaşılamaz hedef), `quality.ts` (kademe kararları), içerik şeması (TR/EN anahtar eşitliği), `extract_params.mjs` (YAML → JSON).

**Uçtan uca (Playwright, Chromium + WebKit + Firefox):**
1. Ana sayfa açılır, konsol hatası 0, 404 isteği 0.
2. Boot en geç 4 sn'de kapanır.
3. "Sponsor Ol" düğmesi her bölümde görünür ve sponsor bölümüne götürür.
4. Dil değişimi tüm görünen metni değiştirir; `<html lang>` güncellenir.
5. `?lite=1` ve reduced-motion emülasyonunda Canvas yoktur, tüm bölümler okunur.
6. Klavye ile baştan sona gezinme (Tab sırası anlık görüntüsü).
7. Küre pinine tıklama doğru bölüme götürür.
8. Görev bölgesinde HUD değerleri sayısal ve makul aralıktadır (NaN yok).
9. "Sen Sür" modunda W tuşuna 3 sn basınca rover konumu değişir; Esc ile çıkılır.
10. Mobil görünümde yatay taşma yoktur (`document.documentElement.scrollWidth <= innerWidth`).
11. Görsel regresyon: belirli scroll noktalarında ekran görüntüsü karşılaştırması (eşik %2; 3D sahnelerde deterministik kamera ve sabit tohumlu gürültü kullan).

**Performans:** Lighthouse CI (mobil ve masaüstü), `tools/budget.mjs`, Playwright ile FPS örneklemesi (her sahnede 5 sn; ortalama ve 1%-low değerleri rapora).
**Erişilebilirlik:** `@axe-core/playwright` ile her sayfada ihlal 0 (ciddi ve kritik).
**Linkler:** Derleme çıktısında kırık iç ve dış link taraması (`linkinator` veya basit betik).
</testing_matrix>

<repo_conventions>
- **Dal:** `main`. Her aşama ayrı commit dizisi; büyük deneyler için `deney/<konu>` dalı açıp sonra birleştir.
- **Commit mesajı:** Türkçe, `A<aşama>: <ne yapıldı>` (ör. `A4: rocker-bogie çözücüsü ve testleri`). Mesaj sonunda ajan ortak yazar satırı varsa ekle.
- **npm betikleri:** `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `budget`, `lhci`, `assets:terrain`, `assets:globe`, `assets:rover`, `assets:media`, `assets:posters`.
- **Önizleme:** `.claude/launch.json` içinde `taykut-dev` (vite, port 5173) ve `taykut-preview` (vite preview, port 4173) yapılandırmaları.
- **GitHub Pages:** `deploy.yml` resmi `actions/upload-pages-artifact` + `actions/deploy-pages` akışını kullanır. Depo ayarında Pages kaynağı "GitHub Actions" olmalı; gerekirse `gh api -X POST repos/keremsumer2010-tech/taykut/pages -f build_type=workflow` ile aç. İlk yayından sonra canlı adresi README'ye yaz.
- **`.gitignore`:** `node_modules/`, `dist/`, `tools/.cache/`, `*.tif`, `*.blend1`, `.env*`, `test-results/`, `playwright-report/`, `.lighthouseci/`.
- **Dosya boyutu koruması:** CI'da 15 MB'tan büyük dosya varsa hata (Pages ve depo sağlığı için).
- **Belgeler:** `README.md` (TR, kısa İngilizce özet; kurulum, betikler, varlık hattı, yayın), `docs/ILERLEME.md` (aşama günlüğü), `docs/VARLIKLAR.md`, `docs/ICERIK_KAYNAKLARI.md`, `docs/MIMARI.md` (sahne yaşam döngüsü, store, zaman çizelgesi bağları; diyagramlar Mermaid ile).
- **Gizli bilgi yok:** Depoda API anahtarı, şifre, telefon numarası veya kişisel e-posta bulunmaz (e-posta sadece kullanıcı onayıyla `contact.ts`'e).
</repo_conventions>

<workflow>
Aşamaları **sırayla** uygula. Bir aşamanın doğrulaması geçmeden sonrakine başlama. Her aşama yayınlanabilir bir site bırakır.

**Her aşamada:**
1. Kısa plan yaz (`docs/ILERLEME.md` başına ekle): ne yapılacak, nasıl doğrulanacak.
2. Uygula. Küçük, anlamlı commit'ler at (Türkçe mesaj, `A3: patlatılmış görünüm etiketleri` gibi).
3. Doğrula: `npm run typecheck && npm run test && npm run build && npm run budget` ve aşamanın özel kontrolleri. Görsel aşamalarda tarayıcı önizlemesinde ekran görüntüsü al ve `docs/ilerleme/` altına kaydet.
4. `docs/ILERLEME.md`'ye sonuç yaz: yapılan, ölçülen değerler, açık kalanlar. Doğrulanamayanı **"doğrulanmadı"** diye açıkça yaz.
5. Push et; GitHub Actions yeşil olmadan aşama bitmiş sayılmaz.

| Aşama | İş | Doğrulama (geçmeden ilerleme) |
|---|---|---|
| **A0 Temel** | Vite+TS strict+React, ESLint/Prettier, Vitest, Playwright, `ci.yml` + `deploy.yml` (Pages), `base: '/taykut/'`, README | Canlı adreste boş sayfa açılıyor; CI yeşil |
| **A1 İçerik iskeleti** | Tasarım belirteçleri, fontlar, tüm bölümler ve alt sayfalar 3D'siz, gerçek metin ve fotoğraflarla; TR/EN; sponsor/takım/altbilgi; SEO ve erişilebilirlik temelleri; `ICERIK_KAYNAKLARI.md`, `VARLIKLAR.md` | Lighthouse mobil ≥ 90/95/95/100; iki dil eksiksiz (tip kontrolü); kontrast betiği geçiyor; klavye ile tüm sayfa gezilebiliyor |
| **A2 Rover varlık hattı** | `tools/rover` (extract_params, build_rover, validate), 2027 rover LOD'ları | Pivotlar `rover_params.yaml`'a ±1 mm; LOD0 ≤ 4 MB; test sahnesinde her eklem doğru eksende dönüyor (ekran görüntüsü) |
| **A3 Hangar ve İnceleme** | Experience/Canvas, stüdyo ışığı, giriş kamerası, patlatılmış görünüm, etiketler, gece modu, kalite kademeleri v1, fallback | 60 fps (ultra); etiketler doğru parçada; fallback ve reduced-motion yolları çalışıyor |
| **A4 Kinematik çözücü** | `heightfield.ts`, `kinematics.ts`, `routeSolver.worker.ts`, `geo.ts` | Birim testler: düz zemin → tüm açılar 0 (±0.01°); 10 cm basamak → beklenen bogie/rocker açıları (geometriyle elle hesaplanan değere ±0.1°); simetrik engelde roll 0; scroll geri sarmada poz farkı 0; CPU ve shader yüksekliği aynı (±1 mm) |
| **A5 Drumheller bölgesi** | Arazi hattı, TerrainMesh+LOD, gökyüzü/ışık/sis/LUT, rota ve olaylar, iz, toz, çakıl, kol IK, HUD | Tekerlek temas boşluğu < 1 cm (debug görselleştirme + ekran görüntüsü); HUD değerleri çözücüden; bölge ≤ 8 MB; 60/30 fps |
| **A6 Küre** | Earth, atmosfer, gece ışıkları, bulutlar, pinler, yaylar, görev listesi | Pin konumu `geo.ts`'ten (test); pin tıklaması doğru bölgeye gidiyor; 60 fps |
| **A7 Geçişler ve Boot** | Boot, Hangar→Dünya, Küre⇄Arazi, Theatre.js sekansları, shader ön derleme | Uçtan uca akış Playwright ile kaydedilir (video); geçişlerde > 50 ms kare yok; hızlı scroll'da bozulma yok |
| **A8 Diğer bölgeler** | Her bölge ayrı alt adım: mrc2026 (summertech modeli dahil), alps, utah, mars, ankara | Her bölge kendi bütçesinde; görev olayları oynuyor; atıflar eklendi |
| **A9 Sen Sür** | Rapier sürüş, kontroller, mobil joystick, devrilme kurtarma | 2 dk sürüşte rover devrilmeden eğimli arazide ilerliyor; eklem limitleri aşılmıyor; çıkışta sinematik moda sorunsuz dönüş |
| **A10 Ses ve mikro etkileşimler** | Howler katmanları, imleç, mıknatıs, SplitText, sayaçlar, kısayollar | Ses varsayılan kapalı; açınca motor sesi hıza bağlı; reduced-motion'da animasyonlar sade |
| **A11 Cila** | LUT ince ayarı, kalite kademeleri, Lighthouse/erişilebilirlik/SEO denetimi, 404, basın kiti, OG görselleri | `<performance_budget>` tüm maddeleri ölçülüp `ILERLEME.md`'ye tablo olarak yazıldı ve geçti |
| **A12 Yayın hazırlığı** | Her sayının kaynağı, lisans listesi, son metin okuması (TR/EN), kırık link taraması | `ICERIK_KAYNAKLARI.md` ve `VARLIKLAR.md` eksiksiz; kırık link 0; kullanıcı onayı |
</workflow>

<verification_protocol>
"Bitti" demeden önce:
- Komutları gerçekten çalıştır ve çıktısını raporda göster. Çalıştırmadığın şeye "çalışıyor" deme.
- Görsel değişikliklerde tarayıcı önizlemesinde (dev sunucu `.claude/launch.json` ile) kontrol et: konsol hatası 0, ağ isteklerinde 404 yok, ekran görüntüsü kaydedildi.
- Masaüstü (1440×900), tablet (768×1024) ve mobil (375×812) genişliklerinde ekran görüntüsü al.
- Fallback yolunu `?lite=1` ile ve reduced-motion emülasyonuyla test et.
- Kendine sor: "Nerede yanılıyor olabilirim? Daha basit yolu var mı? Bir sponsor bu ekranda ne görür?" Bulduğunu düzelt.
- Bir sorunu iki denemede çözemezsen dur, varsayımlarını baştan kur ve kök nedeni bul; belirtiyi yamamak yasak.
</verification_protocol>

<anti_patterns>
Bunları yapma:
- Rastgele telemetri sayıları, sahte "canlı" veri, uydurma sponsor logoları, uydurma takım üyesi bilgisi, uydurma yarışma görev adı.
- Scroll kilitleme, zorunlu uzun animasyon, "Atla"sız giriş.
- Her yere bloom; aşırı doygun renkler; plastik görünen modeller; parlak neon "gamer" estetiği.
- Tek dev JS paketi; Rapier veya Theatre Studio'yu ana pakete koymak.
- Ham GeoTIFF, ham video veya sıkıştırılmamış doku commit etmek.
- Harici CDN'den font/script yüklemek (gizlilik ve hız).
- `any` tipi, kullanılmayan kod, yorum satırına alınmış eski kod.
- Bir sonraki aşamaya, öncekinin doğrulaması geçmeden başlamak.
- Kullanıcıya sorulması gereken bir şeyi tahmin etmek (bkz. `<open_questions>`).
</anti_patterns>

<open_questions>
Aşağıdakiler cevaplanmadan ilgili kısımda **yer tutucu** kullan ve işe devam et. Kullanıcıya en uygun zamanda (ilgili aşamaya gelmeden önce) tek mesajda, önem sırasıyla sor. Cevaplanınca bu bölümü güncelle.

1. **Kahraman rover:** Açılış ve Dünya turunda hangi rover? (Varsayılan: TAYKUT 2027 rover'ı; MRC 2026 rover'ı kendi bölgesinde.)
2. **Bölge listesi ve sırası:** ankara → mrc2026 → drumheller → alps → utah → mars uygun mu?
3. **MRC 2026 nerede yapıldı?** (Biliniyorsa gerçek konum ve arazi kullanılır.)
4. **SummerTech rover'ının Fusion 360 dosyası** var mı? (Yoksa temsili model.)
5. **Üye rolleri**, varsa fotoğraflar ve yayın onayı.
6. **Sponsor kademeleri:** Adlar ve tutarlar sitede yazsın mı? Sponsor PDF'i var mı?
7. **Logo:** Takım logosu SummerTech logosu mu, ayrı bir TAYKUT logosu var mı?
8. **E-posta adresi** sitede hangisi olsun?
9. **2027 rover hedef değerleri** (kütle, hız, motor): yayınlanacak kesin değerler.
10. **Analitik:** GoatCounter (çerezsiz, ücretsiz) istiyor musun, yoksa hiç mi?
11. **2027 rover tekerlek sayısı:** 6 (rocker-bogie, dijital ikiz) mi, 4 (diferansiyelli rocker, malzeme listesi) mi? Varsayılan: dijital ikizdeki 6.
12. **İsim yazımı:** Kullanıcı "Mehmet Emir Erdoğmuş" ve "Mehmet Revaha Emuce" yazdı; aseltech deposunda "Mehmet Emin Erdogmus", takımın GitBook ekip sayfasında "Mehmet Reveha Emuce" ve "Mehmet Emir Erdeoğmuş" geçiyor. Yayından önce doğru yazımları teyit et. Teyide kadar kullanıcının yazdığı biçim kullanılır.
</open_questions>

<output_format>
Her çalışma oturumunun sonunda kullanıcıya **Türkçe**, kısa ve sonuç önde rapor ver:
1. **Sonuç:** Hangi aşama bitti, canlı adres (varsa).
2. **Kanıt:** Çalıştırılan komutlar ve özet çıktıları, ölçülen bütçe değerleri, ekran görüntüsü yolları.
3. **Doğrulanmayanlar:** Açıkça listele.
4. **Sıradaki adım** ve varsa kullanıcıdan gereken tek karar.
Teknik ayrıntıyı kullanıcı isterse ver. Jargonu azalt.
</output_format>

<start_here>
**Site tek seferde yapılmaz.** İş, `prompts/` klasöründeki 24 bölüm promptuna (B00–B23) ayrılmıştır. Yukarıdaki `<workflow>` tablosundaki A0–A12 aşamaları genel çerçevedir; uygulamada **bölüm promptları** izlenir (daha ayrıntılıdır). Eşleşme: A0→B00 · A1→B01–B05 · A2→B06–B08 · A3→B09–B10 · A4→B06 · A5→B11–B15 · A6→B16 · A7→B17 · A8→B18 · (yeni) Yer İstasyonu→B19 · A9→B20 · A10→B21 · A11→B22 · A12→B23.

1. Bu dosyayı ve `prompts/README.md`'yi oku.
2. `docs/ILERLEME.md`'ye bak: hangi bölümün bittiğini bul. Yoksa B00'dan başla.
3. Sıradaki bölümün promptunu (`prompts/Bxx_*.md`) baştan sona oku ve uygula.
4. Her bölümde **mükemmellik döngüsü** zorunludur (en az 2 tur: ölç → eleştir → düzelt). Süre ve token sınırı yoktur; kalite sınırı vardır.
5. Bölüm bitince rapor yaz, commit at, push et, CI yeşil olsun; sonra bir sonraki bölüme geç. Kullanıcı aksini söylemedikçe bölümler arasında onay bekleme.
6. `<open_questions>` için `prompts/README.md`'deki varsayılanları kullan; cevap gerektiren bir karar bir bölümü gerçekten durduruyorsa kullanıcıya tek mesajda sor ve beklerken başka bir bölüm üzerinde çalışılabiliyorsa onu yap.
</start_here>
