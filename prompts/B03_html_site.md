# B03 — 3D'siz Eksiksiz Site

## Hedef
WebGL hiç olmasa bile ödül alacak kalitede, eksiksiz ve yayınlanabilir bir site. 3D, sonradan bu sitenin **arkasına** yerleşecek. Bu yüzden düzen, 3D sahnelerin geleceği alanları (ör. hero'nun sağ yarısı, görev bölümlerinde tam ekran arka plan) şimdiden ayırmalı. Şimdilik bu alanlarda fotoğraf veya poster görünecek.

## Önkoşullar
B01 ve B02 bitti.

## Çıktılar
- `src/sections/`: `Hero`, `Inspect` (statik: fotoğraf + parça listesi), `MissionsOverview` (bölge kartları + statik dünya haritası SVG'si), `MissionSection` (her bölge için: başlık, durum rozeti, görev adımları, poster), `Stats`, `Engineering`, `GroundStation` (video + özellik listesi; etkileşimli sürüm B19'da), `Journey`, `Team`, `Sponsor`, `Footer`
- `src/layout/`: `Nav` (masaüstünde yatay, mobilde tam ekran menü), `ProgressRail` (sağ kenar bölüm göstergesi), `SkipLink`
- Alt sayfalar: `sponsor/index.html`, `rover/index.html`, `basin/index.html`, `404.html` (Vite çok sayfa girişi)
- `src/styles/sections/*.module.css`
- `tests/e2e/site.spec.ts`

## Adımlar
1. **Sayfa iskeleti:** Anlamsal HTML: tek `h1` (Hero), bölümler `section` + `aria-labelledby`, `main`, `nav`, `footer`. `SkipLink` → `#main`.
2. **Düzen ilkeleri:** 12 sütun ızgara, cömert boşluk. Bölüm başlıkları `01 / ROVER` biçiminde. Her bölümün masaüstünde en az bir "nefes" boşluğu var. Mobilde tek sütun, metin önce, görsel sonra.
3. **Hero:** `TAYKUT` dev başlık, alt başlık, iki düğme (Sponsor Ol birincil). Sağ/arka alan 3D için ayrılmış (`data-3d-slot="hero"`); şimdilik `summertech-gunduz-regolit` fotoğrafı, sinematik kırpma (`object-position` ile rover kadrajda).
4. **Inspect (statik):** Rover fotoğrafı + parça listesi (tekerlek, rocker, diferansiyel, kol, sondaj, kamera, kartlar, batarya, numune kutusu). Her parça HudFrame kartı. B10'da 3D patlatılmış görünüm bu listenin verisini kullanır (aynı veri kaynağı: `src/content/parts.ts`).
5. **MissionsOverview:** Basit eşdikdörtgen projeksiyonlu dünya haritası SVG'si (Natural Earth kamu malı veri, `VARLIKLAR.md`'ye ekle) ve 6 bölge noktası; tıklayınca ilgili bölüme kayar. B16'da küre bunun yerini alır, harita yedek modda kalır.
6. **MissionSection × 6:** Her bölge için başlık, konum (enlem/boylam monospace), durum rozeti (`Yarıştık` / `Hedef` / `Bir gün`), 3–4 görev adımı, poster alanı (`data-3d-slot="mission-<id>"`). Poster yoksa bölge rengine göre ince çizgili yer tutucu (B22'de gerçek posterler gelir).
7. **Stats:** 6 istatistik, `kind` etiketleriyle.
8. **Engineering:** 5 alt sistem kartı (Mekanik, Elektronik, Yazılım ve Otonomi, Kol ve Tutucu, Bilim), her birinde kısa metin ve fotoğraf/diyagram yeri.
9. **GroundStation (statik):** `ground-station.mp4` (sessiz, döngülü, `playsinline`, reduced-motion'da poster), yanında özellik listesi ve "Canlı demoyu aç" düğmesi (B19'a kadar devre dışı ve gizli).
10. **Journey:** Dikey zaman çizelgesi, tarihler monospace, şu anki noktada "ŞİMDİ" işareti.
11. **Team:** 7 üye + danışman kartı. Varsayılan illüstrasyon: her üyeye rover parçalarından oluşan tutarlı ve sade bir SVG amblemi (tekerlek, dişli, anten...). İsimler Türkçe karakterli.
12. **Sponsor:** Değer önerisi, 4 kademe kartı, logo duvarı (boş → "İlk sponsorumuz siz olun"), iletişim düğmeleri (e-posta yer tutucusu `TODO_EMAIL` ise e-posta düğmesi gizlenir ve sadece Instagram görünür).
13. **Footer:** Okul, danışman, kaptan, Instagram, dil seçici, "Veri ve atıflar" (otomatik liste), lisans, kısayollar.
14. **Alt sayfalar:**
    - `/sponsor/`: genişletilmiş paket, neden destek, sponsor görünürlüğü (rover üstü logo yerleşimi çizimi, tişört, sunum), SSS, iletişim.
    - `/rover/`: iki rover'ın teknik tablosu (`kind` etiketleriyle), fotoğraflar, tasarım sürecinden kısa notlar.
    - `/basin/`: kısa (50 kelime) ve uzun (150 kelime) tanıtım metni TR/EN, logo indirme (izin verilen biçimde), seçilmiş fotoğraflar.
    - `404.html`: "Rover rotadan çıktı" temalı, ana sayfaya dönüş.
15. **Navigasyon:** Üst çubuk scroll'da incelir; "Sponsor Ol" her zaman görünür. Mobil menü odak tuzağı ve Esc ile kapanır. `ProgressRail` aktif bölümü `IntersectionObserver` ile işaretler.
16. **Scroll:** Bu bölümde düz yerel scroll; Lenis B17'de eklenir. Çapa linkleri `scroll-margin-top` ile üst çubuğun altında kalmaz.

## Kabul testleri
- `site.spec.ts`: tüm bölümler görünür; nav linkleri doğru bölüme gidiyor; dil değişince başlıklar değişiyor; mobil menü klavyeyle çalışıyor; 375 px genişlikte yatay taşma yok; alt sayfalar 200 dönüyor; 404 sayfası çalışıyor.
- Lighthouse (mobil) yerelde: Performans ≥ 90, Erişilebilirlik ≥ 95, En İyi Uygulamalar ≥ 95, SEO ≥ 95 (100 hedefi B05'te).
- Masaüstü (1440), tablet (768), mobil (375) ekran görüntüleri `docs/ilerleme/B03/`.
- Canlı adreste yayınlandı.

## Eleştiri listesi
- 3D olmadan bile ilk ekran etkileyici mi? Değilse tipografi ve fotoğraf kadrajını güçlendir.
- Bir sponsor ana sayfadan sponsor bilgisine kaç tıklamada ulaşıyor? (Hedef: 1.)
- Her bölümde tek bir ana fikir var mı?
- Boşluklar ve hizalar ızgaraya oturuyor mu? (Izgara kaplamasıyla ekran görüntüsü al.)
- Mobilde başparmakla ulaşılabilir mi?

## Yapma
- Animasyon bolluğu (hareket B17/B21'de).
- Şablon görünümlü kart ızgaraları (her bölümün kendi kompozisyonu olsun).

## Bitiş raporu
Ekran görüntüleri, Lighthouse skorları, canlı adres.
