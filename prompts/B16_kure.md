# B16 — 3D Dünya Küresi ve Görev Haritası

## Hedef
Yörüngeden görülen, gece ışıkları ve atmosferi olan, NASA görüntü kalitesinde bir Dünya; üzerinde TAYKUT'un görev noktaları ve aralarında akan rotalar. Hikâyenin "dünyaya açılıyoruz" anı.

## Önkoşullar
B09 bitti (B15 ile paralel ilerleyebilir; birleştirme B17'de).

## Çıktılar
- `tools/globe/build_globe.py`: NASA kaynaklarından dokular → KTX2 (4K ultra, 2K mobil): gündüz (Blue Marble), gece (Black Marble), su maskesi/specular, bulutlar, kabartma normali (isteğe bağlı, ETOPO kamu malı)
- `src/scene/globe/GlobeScene.tsx`, `Earth.tsx`, `Atmosphere.tsx` (+ glsl), `Clouds.tsx`, `Stars.tsx`, `Pins.tsx`, `Arcs.tsx`, `GlobeCamera.ts`
- `src/sections/MissionsOverview.tsx` küreye bağlandı (statik SVG harita yedek modda kalır)
- `docs/VARLIKLAR.md` NASA satırları (tam atıf metinleriyle)

## Ayrıntılar
1. **Dokular:** Kaynakları NASA Visible Earth/Earth Observatory'den bul ve gerçek URL'leri betiğe yaz. Black Marble'ı ton eşleyip gece tarafında sıcak sarı ışık olarak kullan. Bulutlar ayrı küre, yavaş döner (scroll'a bağlı + çok yavaş boşta).
2. **Earth shader:** Gündüz/gece karışımı güneş yönüne göre `smoothstep` (terminatör yumuşak, 6–8° geniş); okyanusta güneş parlaması (specular maske + Fresnel); karada hafif kabartma gölgesi; terminatörde turuncu bant.
3. **Atmosfer:** Arka yüz küresi + Fresnel kenar parlaması; gündüz tarafında mavi, terminatörde turuncu-kırmızı, gece tarafında neredeyse görünmez. Additive harmanlama. Kalınlık gerçekçi (abartısız ince mavi hilal).
4. **Yıldızlar:** Gerçek parlaklık dağılımlı nokta bulutu (ücretsiz yıldız kataloğu, ör. HYG kamu malı/CC BY-SA, lisansını kontrol et; emin değilsen prosedürel), hafif renk sıcaklığı farkı. Samanyolu yok (sade).
5. **Güneş yönü:** Sinematik sabit açı (Ankara gündüz, Drumheller şafakta görünür). Gerçek zaman modu yok (sade tutuldu).
6. **Pinler:** `geo.ts` ile bölge merkezleri (missions verisinden). Görsel: yüzeyden yükselen ince ışık sütunu, tabanda nabız halkası, numara (01–06). Hover/odakta isim + durum rozeti (HTML katmanında, 3D'ye bağlı konum). Klavye ile gezinilebilir (HTML listesi ile eşleşik).
7. **Rotalar:** Bölgeler arası büyük daire yayları (slerp + yükseklik profili sin(πt)·h), yay üzerinde akan ışık (dash offset), sıradaki rota daha parlak.
8. **Kamera:** Scroll ile küre döner ve sıradaki bölge kadraja gelir; bölge seçilince yaya paralel uçuş (B17 dalışına bağlanır). FOV 35 mm eşdeğeri.
9. **Sağ kenar görev listesi:** HTML; tıklama → ilgili bölüme scroll.
10. **Mobil:** 2K dokular, bulutsuz veya düşük çözünürlüklü bulut, pin etiketleri liste olarak.

## Kabul testleri
- Pin konumları `geo.ts`'ten; test: Ankara pini Ankara üzerinde (ekran uzayı kontrolü ve birim test).
- Ultra 60 fps, mobil 30 fps; küre dokuları ultra ≤ 10 MB, mobil ≤ 3 MB.
- Pin tıklaması doğru bölüme götürüyor (E2E).
- Atıflar altbilgide görünüyor.

## Eleştiri listesi
- NASA'nın kendi küre görselleriyle yan yana kalitesi tutuyor mu (atmosfer inceliği, gece ışıkları, okyanus parlaması)?
- Pinler ve yaylar "oyun haritası" gibi mi duruyor? Daha ince ve zarif yap.
- Türkiye'nin konumu ve Ankara pini ilk bakışta okunuyor mu?

## Bitiş raporu
Ekran görüntüleri, doku boyutları, kaynak listesi.
