# B21 — Ses Tasarımı ve Mikro Etkileşimler

## Hedef
Ödüllü sitelerle sıradan siteleri ayıran son %10: her dokunuşun, her geçişin bir karşılığı olması. Ses varsayılan kapalı ama açıldığında deneyimi iki katına çıkaran, yorucu olmayan bir ses dünyası; imleçten sayaçlara kadar özenli mikro etkileşimler.

## Önkoşullar
B17 bitti.

## Çıktılar
- Paket: `howler`
- `src/audio/AudioEngine.ts` (katmanlar, karıştırma, sönümleme, sekme gizliyken kısma), `src/audio/soundmap.ts`
- `public/audio/*.ogg` + `*.mp3` (toplam ≤ 1.5 MB, tembel)
- `tools/audio/synth.mjs` (isteğe bağlı: Web Audio/OfflineAudioContext ile prosedürel ses üretimi: arayüz tıkları, whoosh, servo vızıltısı)
- `src/components/Cursor.tsx`, `Magnetic.tsx`, `SplitReveal.tsx` (GSAP SplitText), `Counter.tsx` (görünürken sayan), `Marquee.tsx` (isteğe bağlı başarı şeridi), `ShortcutsDialog.tsx` (`?` tuşu)
- `docs/VARLIKLAR.md` ses satırları

## Ses
1. **Kaynak:** Freesound'da yalnızca **CC0** filtreli sesler (her biri URL ve lisansla belgelenir) veya kendi sentezin. Takımın gerçek motor/servo kaydı gelirse öncelikli (kullanıcıya sor, şimdilik sentez/CC0).
2. **Katmanlar:**
   - Ortam: hangar uğultusu (çok alçak), yörünge (neredeyse sessiz, ince ton), bölgelere göre rüzgâr (Drumheller kuru, Alpler soğuk ve uğuldayan, Utah sıcak ve sakin, Mars boğuk ve alçak), MRC gecesi (cırcır böceği hafifçe).
   - Rover: motor uğultusu (hıza bağlı `rate` 0.8–1.3 ve ses), servo vızıltısı (kol olaylarında), sondaj sesi.
   - Arayüz: hover tık (çok kısa ve yumuşak), düğme onayı, HUD ✓ sinyali, acil durdurma alarmı (B19, kısa).
   - Geçiş: whoosh (dalış), alçak "boom" (Hangar → Yörünge, abartısız).
3. **Karıştırma:** Ana ses düzeyi −14 LUFS civarı hedef; katmanlar arası çapraz sönüm 600–1200 ms; aynı anda en fazla 4 katman.
4. **Kullanıcı kontrolü:** Varsayılan kapalı; ilk etkileşimden sonra sağ altta bir kez "Sesi aç" ipucu (3 sn, kapanır). `M` kısayolu. Tercih `localStorage`'da. reduced-motion sesi etkilemez ama ses de varsayılan kapalı kalır.

## Mikro etkileşimler
1. **İmleç (masaüstü, fare):** İnce halka + nokta; linklerde büyür ve `--accent` olur; 3D üzerinde "SÜRÜKLE" etiketi; HUD üzerinde artı işareti. Dokunmatik ve reduced-motion'da kapalı. Performans: transform-only, rAF.
2. **Mıknatıslı düğmeler:** Birincil düğmeler imlece 6–10 px çekilir; bırakınca yaylanarak döner.
3. **SplitText:** Başlıklarda satır/harf maskeli giriş (yukarı kayma + opaklık), 40 ms stagger; her başlık bir kez oynar.
4. **Sayaçlar:** Görünür olunca 0'dan hedefe (ease-out, 1.2 sn); `kind` notu sayaç bitince belirir; ondalıklar doğru.
5. **Link altı çizgi:** Soldan sağa çizilen ince çizgi.
6. **Bölüm ilerleme göstergesi:** Aktif nokta yumuşak geçiş; hover'da bölüm adı.
7. **Kısayollar diyaloğu:** `?` ile; `M` ses, `L` dil, `C` temiz mod, `Esc` çıkış, `Boşluk` (istasyonda acil durdur).
8. **Odak durumları:** Her etkileşimli öğede görünür ve tasarım diliyle uyumlu.

## Kabul testleri
- Ses varsayılan kapalı (E2E); açınca `AudioContext` çalışıyor; sekme gizlenince ses kısılıyor.
- Ses dosyaları toplam ≤ 1.5 MB; ilk yükte inmiyor (ağ testi).
- İmleç dokunmatikte yok; reduced-motion'da SplitText/sayaç animasyonsuz (doğrudan son değer).
- Mikro etkileşimler INP ≤ 200 ms (Lighthouse/Web Vitals ölçümü).

## Eleştiri listesi
- Ses 5 dakika açık kalınca yorucu mu? Ortam katmanlarını kıs.
- Mikro etkileşimler içeriğin önüne geçiyor mu? Her biri bir işlev görüyor mu?
- İmleç gecikmeli/yapışkan hissettiriyor mu?

## Bitiş raporu
Ses listesi (kaynak, lisans), kısa demo videosu (sesli), ölçümler.
