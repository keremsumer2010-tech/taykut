# B17 — Boot, Geçişler ve Sinematik Koreografi

## Hedef
Parçaları tek, kesintisiz bir filme dönüştürmek: Boot → Hangar → yörüngeye çıkış → Küre → dalış → Arazi → yükseliş → Küre → ... Bütün akış scroll'a bağlı, geri sarılabilir, hiç takılmayan ve hiçbir zaman içeriği engellemeyen bir koreografi.

## Önkoşullar
B10, B15, B16 bitti.

## Çıktılar
- `src/sections/Boot.tsx`: görev kontrol açılışı (gerçek yükleme olaylarına bağlı)
- `src/timeline/`: Theatre.js projesi (`theatre-state.json`), sheet'ler: `hero`, `orbit`, `globe`, `dive-<id>`, `mission-<id>`, `ascent-<id>`; `scroll.ts` (Lenis + ScrollTrigger + store köprüsü)
- `src/scene/transitions/`: `HangarToOrbit.tsx` (zemin çözülmesi + yıldız alanı + bloom nabzı), `Dive.tsx` (bulut katmanları + sis), `Ascent.tsx`, `Crossfade.ts`
- Paketler: `@theatre/core`, `@theatre/studio` (yalnız dev), `gsap`, `lenis` (peer kontrolüyle)
- `docs/MIMARI.md`'de koreografi diyagramı (Mermaid)

## Boot ayrıntıları
- Siyah zemin, sol üstte `TAYKUT / MISSION CONTROL`, satırlar soldan daktilo gibi: `SİSTEM AÇILIYOR`, `IMU KALİBRE`, `GPS KİLİDİ`, `ARUCO HAZIR`, `ROVER ÇEVRİMİÇİ`. Her satır gerçek bir olaya bağlı (font+CSS, rover GLB, ortam, ilk kare). Sağda `OK`.
- Gerçek yüzde ilerleme çubuğu, UTC saat, `39.93°N 32.86°E · ANKARA`.
- En geç 4 sn'de açılır; yatay tarama çizgisiyle ekran ortadan ayrılır.
- reduced-motion ve aynı oturumda tekrar ziyaret → atlanır. "Atla" düğmesi (Esc de çalışır).

## Geçişler
1. **Hangar → Yörünge:** Kamera geri ve yukarı; hangar zemini gürültü maskeli çözülme shader'ıyla yıldız alanına dönüşür; bloom kısa nabız; Dünya kadraja girer. ≤ 2.5 sn karşılığı scroll.
2. **Küre → Arazi (dalış):** Kamera bölge pinine yay üzerinden yaklaşır; 3–5 bulut katmanı; arazi sahnesi önceden derlenmiş (shader ön derleme) ve sis yoğunluğu yüksekten normale iner. Sahne değişimi bulutların en yoğun anında (kesme görünmez).
3. **Arazi → Küre (yükseliş):** Drone yükselişi; arazi uydu görünümüne (hillshade önizleme dokusu) sonra küre dokusuna karışır.
4. **Hızlı scroll:** Geçişler sıkışır ama asla atlanmaz ve kare düşmez; kullanıcı beklemez.

## Koreografi kuralları
- Scroll ilerlemesi → store → Theatre sequence konumu (`sheet.sequence.position = f(p)`); Theatre değerleri `useFrame` içinde kamera ve sahne nesnelerine uygulanır (`@theatre/r3f` yok).
- Lenis: yumuşak scroll, ama dokunmatikte yerel scroll hissi korunur; `prefers-reduced-motion`'da Lenis kapalı.
- ScrollTrigger: HTML metin bloklarının giriş/çıkışı; 3D ile aynı ilerleme kaynağı (iki ayrı saat yok).
- Scroll asla kilitlenmez (scroll-jacking yasak); sticky bölümler + uzun scroll alanları kullanılır.
- Theatre Studio: `?studio=1` ve sadece dev derlemesinde; kamera yolları burada ayarlanıp JSON olarak kaydedilir.

## Kabul testleri
- Playwright ile uçtan uca akış kaydı (video) ultra ve mobil profilde.
- Uzun görev ve kare süresi: geçişlerde > 50 ms kare yok (Performance trace özetini rapora).
- Geri scroll'da her geçiş birebir geri oynuyor (belirli noktalarda görsel regresyon).
- "Atla" ve menü linkleri her an çalışıyor; sponsor bölümüne bir tıkla ulaşılıyor.
- reduced-motion: geçişler 200 ms çapraz geçiş, Boot yok.

## Eleştiri listesi
- Akış bir film fragmanı gibi ritimli mi? Ölü anlar veya aceleci kesmeler var mı?
- Geçişler kendini tekrar ediyor mu (her dalış aynı mı)? Bölgeye göre küçük farklar ekle (bulut rengi, ışık).
- Kullanıcı kaybolduğunu hissediyor mu? (Sağdaki ilerleme göstergesi her zaman nerede olduğunu söylüyor mu?)

## Bitiş raporu
Akış videosu, trace özetleri, koreografi diyagramı.
