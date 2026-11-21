# B19 — Yer Kontrol İstasyonu Deneyimi

## Hedef
Takımın sıfırdan yazdığı web yer istasyonunun, sitede **ziyaretçinin bizzat kullanabildiği**, simülasyonla çalışan sadık bir sürümü. Ziyaretçi haritaya waypoint ekler, "Görevi başlat"a basar ve rover'ın arazide otonom olarak gittiğini canlı kamera, 2B/3B harita ve telemetri grafikleriyle izler. Acil durdurmaya basabilir, PID ayarlarını değiştirip rover'ın tepkisinin değiştiğini görebilir. Bu bölüm "bu takım yazılım da yazıyor" mesajının kanıtıdır.

## Önkoşullar
B06, B12, B13, B14 bitti (B15 tercihen).

## Gerçek istasyon (referans, kopyalanmaz, yeniden tasarlanır)
- Kaynak: `Rover_Dijital_Ikiz/ros2_ws/src/taykut_gs/web/istasyon/` (`index.html`, `js/`, `stil.css`, `veri/`) ve `Rover_Dijital_Ikiz/docs/YOL_HARITASI.md`.
- Paneller: **Kamera** (canlı görüntü, ArUco tespiti), **Harita** (3B sahne / 2B harita, Üstten / Takip görünümü, İzi sil), **Acil Durdur** + **Kilidi aç**, yön tuşları (▲ ◀ ▶ ▼), **İşlem paneli** sekmeleri: *Otonomi işlemleri* (iptal: Esc), *Görev* (Nokta ekle, Temizle, Görevi başlat), *PID / Ayar* (Varsayılana dön), **Grafikler** (telemetri).
- Önce bu dosyaları oku; işlevleri ve terimleri birebir anla. Arayüzü sitenin tasarım sistemiyle **yeniden** kur (kod kopyalama yok; ama etiketler ve işlevler gerçek istasyonla aynı adları taşısın ki "bu gerçek yazılımın demosu" iddiası doğru olsun).

## Çıktılar
- `src/station/StationApp.tsx` (tembel yüklenir; ana sayfadaki GroundStation bölümünden "Canlı demoyu aç" ile tam ekran katman olarak veya `/taykut/istasyon/` alt sayfası olarak; ikisini de destekle, varsayılan alt sayfa)
- `src/station/sim/`: `RoverSim.ts` (kinematik araç modeli: diferansiyel sürüş, hız/ivme sınırları, B06 pozuyla birleşik), `Controller.ts` (PID hız ve yön kontrolü, pure-pursuit yol takibi), `Autonomy.ts` (waypoint görevi, varış toleransı, iptal), `EStop.ts` (kilit mantığı), `Telemetry.ts` (zaman serisi tamponları)
- `src/station/panels/`: `CameraPanel` (rover ön kamerası ikinci render; ArUco kartı görüş alanına girince çerçeve + kimlik), `MapPanel` (3B: B12 arazisi küçük ölçekte; 2B: hillshade + konturlar + rota + waypoint'ler; Üstten/Takip; İzi sil), `ControlPad` (yön tuşları + klavye WASD/ok), `EStopButton`, `OpsPanel` (sekmeler), `PidPanel`, `Charts` (hız, yön hatası, PID çıktısı, batarya; kendi hafif canvas grafik bileşenin, kütüphane gerekiyorsa küçük ve ücretsiz olanı)
- `src/station/scenario/drumheller-demo.ts`: hazır başlangıç (rover konumu, örnek waypoint'ler, ArUco kart konumları)
- `tests/unit/controller.test.ts`, `autonomy.test.ts`; `tests/e2e/station.spec.ts`

## Davranış ayrıntıları
1. **Simülasyon döngüsü:** Sabit 50 Hz adım (gerçek zamanlı, scroll'a bağlı değil — bu bölüm etkileşimli). Render ile enterpolasyon. Sekme gizlenince duraklar.
2. **Araç modeli:** Skid-steer kinematik model; sol/sağ tekerlek hız komutu; hız ve ivme sınırları (2027 rover hedef değerleri, "SİM" etiketli); yokuşta yavaşlama (eğim × kütle basit modeli); arazi üzerinde B06 çözücüsüyle gövde pozu (süspansiyon burada da çalışır).
3. **PID:** Hız döngüsü ve yön (heading) döngüsü; Kp, Ki, Kd, çıkış sınırı, integral sınırlama (anti-windup). Varsayılanlar iyi ayarlı; ziyaretçi değiştirince grafiklerde aşma/salınım görülür. "Varsayılana dön" sıfırlar. Değerler oturumda saklanır.
4. **Otonomi:** Waypoint görevi (haritaya tıkla → nokta ekle; sürükle → taşı; sağ tık/uzun bas → sil), pure-pursuit takip, varış toleransı, sıradaki noktaya geçiş, görev bitince "GÖREV TAMAMLANDI". Engelli/çok dik noktalarda uyarı (eğim limitine göre).
5. **Acil durdur:** Her ekranda görünür, kırmızı; basınca anında durur ve sistem kilitlenir; "Kilidi aç" ile açılır. Klavye: Boşluk.
6. **Manuel sürüş:** Yön tuşları ve klavye; otonomi çalışırken manuel giriş otonomiyi iptal eder (gerçek istasyondaki gibi; davranışı kaynaktan doğrula).
7. **Kamera paneli:** Ön kamera render'ı (düşük çözünürlük, 15 fps), ArUco kartları sahnede; görüş alanında ve yeterince dik ise tespit çerçevesi + kimlik + mesafe.
8. **Grafikler:** Son 30 sn'lik kayan pencere; hız (hedef vs gerçek), yön hatası, PID çıktısı, batarya. Tabular rakamlar, eksen etiketleri.
9. **Mobil:** Panelleri sekmeli düzende; yön tuşları dokunmatik; harita tam genişlik.
10. **Erişilebilirlik:** Tüm kontroller klavyeyle; ekran okuyucuya durum mesajları (`aria-live`: "Görev başladı", "Acil durdurma etkin").
11. **Dürüstlük notu:** Üstte ince şerit: "Bu, TAYKUT yer istasyonu yazılımının tarayıcıda çalışan simülasyon demosudur. Gerçek rover'a bağlı değildir."

## Kabul testleri
- `controller.test.ts`: adım yanıtında aşma ve oturma süresi varsayılan PID ile hedef aralıkta; anti-windup çalışıyor.
- `autonomy.test.ts`: 3 waypoint'lik görev tamamlanıyor; iptal ve acil durdurma durumları doğru.
- `station.spec.ts`: sayfa açılıyor; nokta ekle → görevi başlat → rover hareket ediyor → bitince "GÖREV TAMAMLANDI"; acil durdur → hız 0 ve kilit; kilidi aç → manuel sürüş; PID değişince grafik değişiyor; mobil düzen çalışıyor.
- Performans: istasyon sayfası ultra 60 fps, mobil 30 fps; ilk yük ≤ 3 MB (arazi önbellekten paylaşılır).

## Eleştiri listesi
- Takımın yazılım ekibi bunu görünce "bu bizim istasyonumuz" der mi? Etiketler ve işlevler gerçekle tutarlı mı?
- Bir yarışma jürisi 60 saniyede ne yaptığını anlıyor mu? Gerekirse ilk açılışta 3 adımlık kısa rehber (atlanabilir).
- Grafikler gerçekten bilgi veriyor mu, süs mü?
- Acil durdurma her durumda (her sekmede, her ekran boyutunda) erişilebilir mi?

## Bitiş raporu
Ekran kaydı (waypoint görevi + acil durdurma + PID değişimi), test çıktıları, gerçek istasyonla işlev karşılaştırma tablosu.
