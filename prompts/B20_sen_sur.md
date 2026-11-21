# B20 — "Sen Sür": Fizikli Sürüş Modu

## Hedef
Görev bölgelerinde ziyaretçinin "Kontrolü al" deyip rover'ı gerçek fizikle (Rapier) sürebilmesi. Süspansiyon eklemleri fizik motorunda gerçekten çalışır. Eğlenceli ama gerçekçi; oyun değil, simülasyon.

## Önkoşullar
B15 bitti (B18 bölgeleri tercihen).

## Çıktılar
- Paket: `@react-three/rapier` 2.x (yalnız bu modda dinamik import)
- `src/scene/drive/DriveMode.tsx`, `DriveRover.tsx` (rijit cisimler + eklemler), `TerrainCollider.tsx` (heightfield collider, `height_lo`), `DriveControls.ts` (klavye + gamepad + dokunmatik joystick), `DriveCamera.ts` (yumuşak takip, çarpışmalı), `DriveHud.tsx` (sade HUD + "Simülasyon" notu + çıkış)
- `tests/e2e/drive.spec.ts`

## Fizik ayrıntıları
1. **Gövde:** Dinamik rijit cisim; kütle `rover_params.yaml` hedef kütlesi (15 kg) dağılımına göre (ağırlık merkezi alçak, `body_com_offset`).
2. **Rocker'lar:** Gövdeye **revolute** eklem (eksen yan), limitler `joints.rocker_limit`.
3. **Bogie'ler:** Rocker'lara revolute eklem, limitler `joints.bogie_limit`.
4. **Diferansiyel:** Rapier'de doğrudan dişli kısıtı yok; iki rocker ekleminde motor kullanarak sol açı = −sağ açı kısıtını yumuşak uygula (her adımda hedef = karşı açının negatifi; sertlik/sönüm kütleye göre ayarlı; dijital ikizdeki bulgu: 15 kg için k≈5000, c≈60 civarı başlangıç — kendi ortamında yeniden ayarla ve ölç). Alternatif: gövdeye bağlı ara "diff" cismi ve iki eklem; daha kararlı olanı seç, belgele.
5. **Tekerlekler:** Silindir collider (tırtıl yok, sürtünme ile), revolute eklem + hız motoru (skid-steer: sol/sağ hız). Tork sınırı `drive.wheel_max_torque`, hız sınırı `drive.wheel_max_speed` (arayüzde "SİM"); sürtünme zemine göre (kum 0.6, kaya 0.9, kar 0.35; maske örneklemesiyle tekerlek başına).
6. **Adım:** Sabit 60 Hz, alt adımlar gerekirse; render enterpolasyonu. Uyuyan cisimler.
7. **Devrilme kurtarma:** Roll veya pitch > 70° iki saniye → yumuşak kaldırma ve düzeltme (animasyonlu, ışınlama değil).
8. **Sınırlar:** Bölge kenarında görünmez duvar yerine yumuşak geri itme + HUD uyarısı.

## Kontroller
- Klavye: W/S ileri-geri, A/D dönüş, Shift hassas, Space fren, R sıfırla, C kamera değiştir, Esc çık.
- Gamepad (varsa): sol çubuk.
- Mobil: sol yarıda sanal joystick, sağda fren ve çıkış düğmeleri.
- Giriş: "Kontrolü al" düğmesi; sinematik moddan fizik moduna geçişte rover pozu birebir devralınır (sıçrama yok). Çıkışta rover yumuşakça sinematik rotadaki en yakın noktaya geri döner.

## Kabul testleri
- `drive.spec.ts`: Kontrolü al → W 3 sn → konum değişti → Esc → sinematik moda dönüş; mobil joystick olayları çalışıyor.
- 2 dakikalık otomatik sürüş testi (betikli girdi, eğimli arazi): devrilme yok veya kurtarma çalışıyor; eklem limitleri aşılmıyor; diferansiyel kısıt hatası ortalama < 1°.
- Fizik modu açıkken FPS ultra ≥ 55, mobil ≥ 28.
- Rapier ana pakete girmiyor (budget).

## Eleştiri listesi
- Sürüş "buz üstünde araba" veya "jöle" gibi mi? Sürtünme ve sönümü gerçekçi hâle getir.
- Süspansiyonun fizikte de çalıştığı açıkça görülüyor mu? (Kamera ön/yan seçenekleri bunu göstermeli.)
- Ziyaretçi 30 saniye sonra sıkılıyor mu? Küçük hedefler (ör. bölgedeki numune noktasına git) ekle; ama oyunlaştırmayı abartma.

## Bitiş raporu
Sürüş kaydı, kısıt hatası ölçümleri, FPS.
