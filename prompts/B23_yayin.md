# B23 — Son Denetim ve Yayın

## Hedef
Siteyi dünyaya açmadan önce her iddianın, her lisansın, her linkin ve her metnin doğru olduğundan emin olmak; kullanıcının son onayını almak ve lansman materyallerini hazırlamak.

## Önkoşullar
B22 bitti, tüm bütçeler yeşil.

## Çıktılar
- `docs/YAYIN_KONTROL.md`: imzalı kontrol listesi
- `docs/ICERIK_KAYNAKLARI.md` ve `docs/VARLIKLAR.md` eksiksiz
- Lansman paketi `docs/lansman/`: Instagram gönderisi için 1080×1350 ve 1080×1920 görseller (sahnelerden), 15–30 sn tanıtım videosu (Playwright kaydından düzenlenmiş, sessiz veya CC0 müzikli), kısa duyuru metinleri TR/EN
- `README.md` güncel (canlı adres, ekran görüntüsü, yapı, betikler, katkı rehberi)
- Git etiketi `v1.0.0` ve GitHub Release notu

## Kontrol listesi
1. **İçerik doğruluğu:** İçerikteki her sayı ve iddia `ICERIK_KAYNAKLARI.md`'de; `kind` etiketleri doğru; MRC sonucu, tarih ve adlar doğru; katılmadığımız yarışmalarda "hedef/hayal" dili.
2. **Açık sorular:** `open_questions` içindeki her soru ya cevaplandı ya da kullanıcıya bu bölümde tek mesajda listelendi (özellikle: e-posta, üye rolleri, isim yazımı, sponsor tutarları, logo).
3. **Lisanslar:** Her üçüncü taraf varlık (veri, doku, HDRI, font, ses, kütüphane) listede; atıflar altbilgide görünüyor; NC lisanslı varlık yok; NASA logosu yok.
4. **Gizlilik:** Telefon numarası yok; kişisel e-posta sadece onaylanan; EXIF temiz; çerez yok; harici takip yok.
5. **Linkler:** Kırık link 0 (iç ve dış); sosyal linkler doğru hesap.
6. **Dil:** TR ve EN metinler son kez okundu (yazım, Türkçe karakterler, tutarlı terimler); otomatik yazım denetimi + manuel okuma.
7. **Cihaz testi:** Chromium, Firefox, WebKit; masaüstü, tablet, mobil; yedek mod; reduced-motion; yavaş ağ.
8. **Erişilebilirlik ve SEO:** axe 0, Lighthouse eşikleri, sitemap ve robots doğru, canonical'lar doğru.
9. **Performans:** B22 tabloları güncel ve yeşil.
10. **Depo:** Ham veri yok, gizli bilgi yok, 15 MB üstü dosya yok, README güncel, lisans dosyası doğru.
11. **Kullanıcı onayı:** Kullanıcıya canlı adres + 2 dakikalık tur videosu + kontrol listesi özeti gönder; açık kalan kararları sor. Onay gelmeden "yayınlandı" duyurusu yapma.

## Lansman
- Etiket ve sürüm notu.
- Lansman görselleri ve metinleri kullanıcıya teslim (paylaşımı kullanıcı yapar; Claude sosyal medyada paylaşım yapmaz).

## Bitiş raporu
Kontrol listesinin tamamı (✓/✗ ve not), canlı adres, lansman paketi yolları.
