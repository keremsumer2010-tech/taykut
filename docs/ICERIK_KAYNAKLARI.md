# İçerik Kaynakları

Sitedeki her sayı ve iddianın kaynağı. Kaynağı olmayan iddia sitede yer alamaz.
İçerik dosyalarındaki (`src/content/*.ts`) her `source` anahtarı bu tablodaki bir satıra karşılık gelir; `tests/unit/content.test.ts` eşleşmeyen anahtar olursa başarısız olur.

**Tür (`kind`):** `result` yarışma sonucu · `measured` ölçüldü/belgelendi · `calculated` hesaplandı · `estimate` tahmin · `design-target` tasarım hedefi · `assumption` varsayım · `simulated` simülasyon sonucu

**Kaynak kısaltmaları:**
- **[GB]** `TaykutGitBook.zip` — takımın SummerTech Rover teknik dokümanı (README, mekanik, elektronik, yazılım, görevler, yol haritası sayfaları).
- **[YH]** `Rover_Dijital_Ikiz/docs/YOL_HARITASI.md` — dijital ikiz ve yer istasyonu günlüğü.
- **[RP]** `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/config/rover_params.yaml` — 2027 rover ölçüleri.
- **[KB]** Kullanıcı beyanı (Kerem Sümer, sohbet; tarih yanında).

| Anahtar | İddia | Kaynak | Tür | Tarih | Not |
|---|---|---|---|---|---|
| `mrc2026-video` | MRC 2026 başvuru videosu değerlendirmesinde 1. | [KB] + video https://youtu.be/8WRZX9VwTyw | result | 2026-11-08 | Takım hafıza kaydı |
| `mrc2026-final` | MRC 2026 finali (29 Tem–1 Ağu 2026) genel 4.; üç görev sahada tamamlandı | [KB] | result | 2026-11-08 | "Micro Rover Challenge", ana ARC değil. Final yeri doğrulanmadı, sitede yazılmaz |
| `circ2027` | CIRC 2027 (6–9 Ağu 2027, Drumheller) ilgi beyanı gönderildi, davet bekleniyor; CIRC Central = Badlands Community Facility (51.46714, −112.70603) | [KB] 2026-11-04 + [YH] A1.1 | result | 2026-11-10 | Sitede "hedef" dili |
| `team-2027` | Takım adı TAYKUT; 7 üye ve sıraları | [KB] | measured | 2026-11-21 | İsim yazımları teyit bekliyor: "Revaha/Reveha", "Erdoğmuş/Erdeoğmuş" ([GB] ekip sayfası farklı yazıyor) |
| `team-founded` | Takım Kasım 2025'te kuruldu; 2027 için ASELSAN MTAL'de yeni üyelerle yeniden kuruldu | [KB] | measured | 2026-11-09 | Eski okul adı yazılmaz (kullanıcı isteği) |
| `school-advisor` | Okul ASELSAN MTAL Ankara; danışman Mustafa Seyhan; kaptan Kerem Sümer | [KB] | measured | 2026-11-09 | |
| `st-envelope` | SummerTech Rover 45×45 cm hacim sınırına sığar | [GB] README "Bir bakışta" | measured | — | MRC kuralı |
| `st-drive` | 4WD, 4× Namiki 22CL-3501PG, 80:1 planet dişli, skid-steer | [GB] mekanik/tekerlek-govde, suspansiyon | measured | — | |
| `st-wheel` | 95A TPU, zikzak profil, petek iç yapı, Ø10 cm, kendi 3D baskısı | [GB] mekanik/tekerlek-govde | measured | — | |
| `st-suspension` | 4 tekerlekli diferansiyelli rocker (bogie yok), merkezde diferansiyel denge çubuğu, yay/amortisör yok | [GB] mekanik/suspansiyon | measured | — | |
| `st-speed` | ≈ 0.58 m/s (11.1 V, yüksüz) | [GB] mekanik/tekerlek-govde | estimate | — | 12 V'ta 120 RPM → 0.63 m/s; ölçülmedi |
| `st-energy` | 3S Li-ion 5600 mAh; ortalama 8.05 A; ~35 dk; menzil ~1200 m (11.1 V) | [GB] elektronik/guc-sistemi | calculated | — | %80 güvenli deşarj varsayımıyla; menzil teorik üst sınır, ölçülmedi |
| `st-brains` | Pixhawk 2.4.8 (ArduRover), Raspberry Pi 4B (OpenCV), Arduino Mega 2560 (PID, servo, load cell) | [GB] elektronik/README | measured | — | |
| `st-arm` | 3 eksenli ASA kol, değiştirilebilir uç (tutucu ↔ sondaj), PCA9685, ahtapot tutucu | [GB] mekanik/robot-kol-sondaj | measured | — | "35 kg" servolar 7.4 V'ta; 6 V'ta ~32 kg·cm |
| `st-science` | 5 kg load cell + HX711, helezonik sondaj, 3 bağımsız numune haznesi | [GB] mekanik/robot-kol-sondaj | measured | — | |
| `st-missions` | MRC görevleri: Tam Otonom ArUco, Sondaj, Gece Görevi ve Enerji | [GB] gorevler | measured | — | |
| `twin-diff` | Dijital ikizde gerçek Drumheller arazi verisinde sol rocker −18.01°, sağ +18.08°, fark 0.065° (< 0.5° eşik) | [YH] günlük, A2.2 dinamik doğrulama | simulated | 2026-11-11 | DART fizik motoru; iki koşu aynı sonuç |
| `twin-terrain` | Arazi: NRCan HRDEM lidar 1 m (AB-Drumheller-1m, 2018), OGL-Canada-2.0 | [YH] A1.2 | measured | 2026-11-10 | |
| `twin-stack` | ROS 2 Jazzy + Gazebo Harmonic dijital ikiz; sıfırdan web yer istasyonu (kamera, harita, e-stop, otonomi işlemleri, PID/Ayar) | [YH] sabit kararlar, A3.1–A3.2 | measured | 2026-11-12 | |
| `rover2027-params` | 2027 rover: 6 tekerlek rocker-bogie + konik dişli diferansiyel, hedef 15 kg, DJI M3508 doğrudan tahrik, azami ~6.1 m/s, ölçüler | [RP] | design-target / assumption | 2026-11-13 | Tekerlek sayısı kesin değil ([RP] açık soru: malzeme listesi 4 diyor) |
| `region-ankara` | Ankara koordinatı 39.93° K, 32.86° D | Genel coğrafi bilgi | measured | — | Şehir merkezi |
| `region-alps` | İsviçre Alpleri temsili konum (Davos civarı 46.80° K, 9.83° D) | Genel coğrafi bilgi | measured | — | Alpine/Swiss Rover Challenge hedef; yarışma sahası doğrulanmadı, "temsili" |
| `region-utah` | Mars Desert Research Station, Hanksville, Utah (38.4064° K, 110.7919° B) | Genel coğrafi bilgi | measured | — | URC bir üniversite yarışmasıdır; sitede "bir gün" dili |
| `region-mars` | Jezero Krateri, Mars (Perseverance iniş bölgesi civarı 18.44° K, 77.45° D) | Genel bilgi (NASA) | measured | — | NASA onayı/ilişkisi ima edilmez |
