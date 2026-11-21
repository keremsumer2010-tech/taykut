# B02 — İçerik: Metinler, Veriler, Kaynaklar

## Hedef
Sitenin söylediği her şeyin tek yerde, iki dilde, tip güvenli ve kaynaklı durması. Bu bölümden sonra hiçbir bileşen içine metin gömülmeyecek; her sayı `ICERIK_KAYNAKLARI.md`'de bir kaynağa bağlanacak.

## Önkoşullar
B01 bitti.

## Girdiler
- Anayasa: `team_facts`, `copywriting`, `open_questions`.
- `taykut-site/src/i18n.js` (eski metinler; içerik kaynağı, kod değil).
- `TaykutGitBook.zip` (aç, ilgili teknik bölümleri oku; **alıntı değil özet**).
- `Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/config/rover_params.yaml`.
- `Rover_Dijital_Ikiz/docs/YOL_HARITASI.md` (dijital ikiz ve yer istasyonu gerçekleri).
- Fotoğraflar (`kaynak/foto/`, `taykut-site/public/media/`): görsel açıklamalar için.

## Çıktılar
- `src/content/schema.ts`: tüm içerik tipi (bölümler, takım, görevler, istatistikler, sponsor, altbilgi, meta, HUD metinleri, hata/yedek metinleri)
- `src/content/tr.ts`, `src/content/en.ts`: `satisfies Content` ile tip denetimli
- `src/content/team.ts`: 7 üye + danışman (isim, rol: `null`, sıra, illüstrasyon anahtarı)
- `src/content/contact.ts`: `email: 'TODO_EMAIL'`, `instagram: 'teamtaykut'`
- `src/content/summertech.ts`: MRC rover gerçekleri (her alanın yanında `source` anahtarı ve `kind: 'measured' | 'calculated' | 'estimate' | 'design-target'`)
- `tools/rover/extract_params.mjs` → `src/content/rover2027.generated.json` (YAML'dan; `# VARSAYIM` yorumları `kind: 'assumption'` olarak işaretlenir)
- `src/lib/i18n.ts`: dil seçimi (`?lang`, `localStorage`, tarayıcı dili), `useT()` kancası, `<html lang>` güncelleme
- `docs/ICERIK_KAYNAKLARI.md`: her iddia → kaynak (URL, dosya yolu, kullanıcı beyanı + tarih)
- `tests/unit/content.test.ts`: TR/EN anahtar eşitliği, boş metin yok, `TODO_` yer tutucularının listesi (test bunları **raporlar**, başarısız saymaz; B23'te sıfır olmalı)

## Adımlar
1. **Şema tasarımı:** Bölüm sırasına göre (Boot, Hero, Inspect, Globe, Missions, Stats, Engineering, GroundStation, Journey, Team, Sponsor, Footer, alt sayfalar, 404, fallback, HUD, kısayollar, atıflar). Metin alanları `string`, zengin metin gerekiyorsa küçük bir `Rich` tipi (sadece vurgu ve link). Görev bölgesi metinleri B15/B18'de `missions/` dosyalarında; burada ortak etiketler.
2. **Metin yazımı (TR önce, sonra doğal EN):** `copywriting` kurallarına uy. Her bölüm için başlık (≤ 6 kelime), kicker, 1–3 cümlelik paragraf, eylem çağrısı. En az iki başlık alternatifi üret, en iyisini seç, diğerini yorum olarak bırakma (seçmediğini sil).
3. **Fotoğraf açıklamaları ve alt metinleri:** Yeni fotoğraflar:
   - `summertech-gunduz-regolit.jpg`: SummerTech rover açık gri çakıllı regolit parkurunda; sarı TPU tekerlekler, ters V alüminyum rocker kolları, öne uzanan sondaj tüplü kol, üstte beyaz numune kutusu ve anten.
   - `summertech-gece-ahtapot-tutucu.jpg`: Gece görevi: kol ucundaki sarı ahtapot tutucu siyah silindirik bataryaları kavrıyor; solda yeşil LED'li güç paneli istasyonu, arkada jeodezik kubbe.
   Bunları doğal ve kısa yaz; tahmin içeren yorum yapma (ör. yer adı bilinmiyorsa yazma).
4. **Sayılar:** Her istatistiğin `kind` etiketi arayüzde küçük not olarak görünür ("hesaplanan", "tahmin", "tasarım hedefi"). MRC sonucu "ölçülen/gerçek sonuç" sınıfındadır.
5. **2027 rover:** `extract_params.mjs` YAML'ı okur, birimleri korur, `wheel_count`, boyutlar, kütle hedefi, hız hedefi, tekerlek çapı vb. alanları çıkarır. Sitede bu değerler "Tasarım hedefi — değişebilir" etiketiyle gösterilir.
6. **Takım:** İsimler anayasadaki yazımla (Türkçe karakterler). Kaptan rolü dışında rol `null`. Arayüz rol yoksa satırı gizler.
7. **Yer istasyonu metinleri:** Gerçek istasyonun özellikleri (canlı kamera, 2B/3B harita, üstten/takip görünümü, iz, acil durdurma ve kilit, yön tuşları, otonomi işlemleri, waypoint görevleri, PID/ayar sekmesi, telemetri grafikleri). Kaynak: `Rover_Dijital_Ikiz/ros2_ws/src/taykut_gs/web/istasyon/index.html` ve `YOL_HARITASI.md`.
8. **Sponsor metinleri:** Değer önerisi, 4 kademe adı ve kapsamı (tutar yok), "İlk sponsorumuz siz olun" kartı, iletişim çağrısı.
9. **Atıf metinleri:** Veri sağlayıcıların istediği tam atıf cümleleri (`VARLIKLAR.md` ile aynı kaynaktan üretilecek; burada sadece başlık ve giriş metni).
10. **Kaynak belgesi:** `ICERIK_KAYNAKLARI.md` tablosu: `anahtar | iddia | kaynak | tür | tarih | not`.
11. **Dil altyapısı:** Dil değişince sayfa yenilenmez; metinler anında değişir; `document.title` ve meta açıklama güncellenir.

## Kabul testleri
- `npm run typecheck`: TR ve EN şemaya tam uyuyor.
- `content.test.ts` geçiyor; `TODO_` listesi raporda.
- `extract_params.mjs` çıktısı YAML ile birebir (test: birkaç alanı karşılaştır).
- `ICERIK_KAYNAKLARI.md`'de kaynaksız sayı yok (betik: içerikteki tüm sayıları bul, belgedeki anahtarlarla eşleştir).

## Eleştiri listesi
- Bir sponsor ilk 3 cümlede "neden bu takımı desteklemeliyim" sorusunun cevabını alıyor mu?
- Abartı veya kanıtsız iddia kaldı mı? ("NASA", "en iyi", "ilk" kelimelerini ara.)
- İngilizce metin anadili İngilizce olan biri tarafından yazılmış gibi mi?
- Lise takımı olmak güç olarak mı sunuluyor, özür gibi mi?
- Metinler kısa mı? Her paragrafı %20 kısaltmayı dene.

## Yapma
- Uydurma görev adı, sponsor, rol veya sonuç.
- Telefon numarası veya kişisel e-posta yazmak.
- GitBook'tan uzun alıntı.

## Bitiş raporu
Bölüm bölüm metin özeti, `TODO_` listesi, kaynak tablosu özeti.
