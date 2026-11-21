# B09 — 3D Çekirdek: Canvas, Sahne Yönetimi, Kalite Kademeleri, Yedek Mod

## Hedef
Bütün 3D deneyimin üzerinde çalışacağı sağlam motor. Tek bir sabit Canvas, sahneler arası geçiş altyapısı, cihaza göre otomatik kalite, hata dayanıklılığı ve geliştirici paneli. İçerik sitesi (B03) bu katman hiç yüklenmese de eksiksiz çalışmaya devam eder.

## Önkoşullar
B05, B06, B07 bitti.

## Çıktılar
- Paketler: `three`, `@react-three/fiber` 9, `@react-three/drei` 10, `postprocessing`, `@react-three/postprocessing`, `zustand`, `detect-gpu` (peer kontrolü yapılarak)
- `src/scene/Experience.tsx`: tembel yüklenen (`React.lazy`) tek Canvas; `position: fixed; inset: 0; z-index` içerik altında; `aria-hidden`
- `src/scene/SceneManager.tsx`: aktif sahne (`studio | globe | terrain`), önceki/sonraki ön yükleme, `dispose` yaşam döngüsü
- `src/scene/assets.ts`: tek yükleyici (GLTFLoader + Meshopt + KTX2 + yerel basis transcoder), ilerleme olayları, önbellek, iptal
- `src/lib/quality.ts`: kademe tespiti (`ultra | high | mobile | fallback`), FPS izleyici, düşürme kuralı, elle seçim
- `src/scene/post/PostStack.tsx`: kademeye bağlı efekt zinciri
- `src/store/useStore.ts`: `section`, `sectionProgress`, `scene`, `missionId`, `quality`, `lang`, `audioOn`, `driveMode`, `hudVisible`, `loading`
- `src/scene/ScrollBridge.ts`: HTML bölüm ilerlemesi (IntersectionObserver + scroll konumu) → store
- `src/scene/debug/DebugPanel.tsx` (`?debug=1`, dinamik import): FPS, kare süresi grafiği, draw call, üçgen, doku/geometri sayısı, GPU bellek tahmini, kademe, sahne
- `src/scene/Fallback.tsx`: 3D yoksa poster/fotoğraf
- `tests/e2e/3d-core.spec.ts`

## Adımlar
1. **Yükleme stratejisi:** Ana paket 3D içermez. İçerik boyandıktan sonra (`requestIdleCallback` veya ilk etkileşim/scroll, en geç 1.5 sn) `Experience` dinamik import edilir. Bu süre boyunca hero fotoğrafı görünür; 3D hazır olunca fotoğraf ile 3D arasında 600 ms çapraz geçiş.
2. **Renderer ayarları:** `antialias: false` (SMAA/FXAA son işlemde), `powerPreference: 'high-performance'`, `outputColorSpace = SRGB`, `toneMapping = ACESFilmic`, fiziksel ışık; DPR kademeye göre (`dpr={[1, cap]}`); `frameloop="demand"` ile boşta sahnelerde gereksiz render yok, animasyon varken `always`.
3. **Kalite tespiti:** `detect-gpu` tier + ekran boyutu + `deviceMemory` + `saveData` → başlangıç kademesi. İlk 3 sn ve her sahne değişiminde FPS örnekle; hedefin (ultra/high 55, mobile 28) altında kalınırsa bir kademe düşür ve **kalıcı** yap (sessionStorage). Otomatik yükseltme yok. Altbilgide "Görsel kalite: Otomatik / Yüksek / Dengeli / Hafif / 3D kapalı" seçici.
4. **Yedek mod tetikleyicileri:** WebGL2 yok, `prefers-reduced-motion`, `?lite=1`, kullanıcı seçimi, 3D yükleme hatası, context lost kurtarılamazsa.
5. **Hata dayanıklılığı:** React Error Boundary; `webglcontextlost` → poster + yeniden deneme; sekme gizliyken render durur; bellek temizliği (`dispose` yardımcıları: geometri, malzeme, doku, render target).
6. **Sahne yöneticisi:** Sahne değişimi = eski sahneyi sakla (1 sahne geride tut) + yeniyi ön derle (`gl.compile(scene, camera)`) + geçiş (B17). Her sahne `onEnter/onExit/onProgress(p)` arayüzü uygular.
7. **ScrollBridge:** Her HTML bölümü `data-scene` ve `data-scene-range` taşır. Bölüm ilerlemesi 0..1 hassas hesaplanır (sticky bölümlerde uzunluk/konum). Bu değer saf fonksiyonla kamera ve sahne parametrelerine dönüşür (determinizm).
8. **Post stack:** ultra: SMAA + bloom + DOF + LUT + vinyet + grain; high: SMAA + bloom + LUT + vinyet; mobile: FXAA + LUT. LUT dosyaları `public/luts/*.cube` (kendi ürettiğin; B12'de bölgeye göre). Bu bölümde nötr LUT.
9. **Debug paneli:** Sadece `?debug=1`; üretim paketine girmez (bütçe betiğiyle doğrula).
10. **Test sahnesi:** Bu bölümde sahne olarak geçici stüdyo + B07 rover'ı LOD seçimiyle göster (B10 bunu gerçek hangarla değiştirir).

## Kabul testleri
- Ana paket bütçesi korunuyor (3D ayrı parça; budget çıktısı).
- `3d-core.spec.ts`: Canvas yükleniyor; `?lite=1` ve reduced-motion'da Canvas yok; WebGL devre dışı bırakılmış tarayıcı bağlamında (Playwright `--disable-gpu`/`--disable-webgl` bayrakları) fallback görünüyor; konsol hatası 0.
- Context lost simülasyonu (`WEBGL_lose_context` uzantısı) → poster → geri yükleme çalışıyor.
- Debug paneli üretim derlemesinde yok.
- Kademe düşürme: yapay yük (debug parametresi) ile FPS düşürülünce kademe iniyor.

## Eleştiri listesi
- 3D yüklenirken içerik takılıyor mu (uzun görev > 50 ms)? Performance profili al.
- Yavaş 4G'de ilk ekran hâlâ 2.5 sn altında mı?
- Fotoğraftan 3D'ye geçiş göze batıyor mu?
- Mobilde pil ve ısı: boşta render duruyor mu?

## Bitiş raporu
Paket boyutları, kademe tespit tablosu (test cihaz profilleri), hata senaryosu sonuçları.
