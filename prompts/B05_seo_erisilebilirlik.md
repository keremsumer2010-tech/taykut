# B05 — SEO, Erişilebilirlik, Gizlilik Temeli

## Hedef
3D gelmeden önce sitenin bulunabilir, herkes tarafından kullanılabilir ve gizliliğe saygılı olduğunu kanıtlamak. Bu bölümden sonra her yeni bölüm bu çıtayı korumak zorunda (CI'da denetlenir).

## Önkoşullar
B04 bitti.

## Çıktılar
- Her sayfada `<head>`: başlık, açıklama, canonical, `hreflang` (tr, en, x-default), OG ve Twitter kartı, tema rengi, manifest
- `public/sitemap.xml` (derleme betiğiyle üretilir), `public/robots.txt`, `public/manifest.webmanifest`
- JSON-LD: `SportsTeam` (ad, okul `memberOf` → `EducationalOrganization`, sosyal bağlantılar, logo), `WebSite`
- `tests/e2e/a11y.spec.ts` (`@axe-core/playwright`), `tests/e2e/keyboard.spec.ts`, `tests/e2e/reduced-motion.spec.ts`
- `.lighthouserc.json` + CI adımı (`@lhci/cli`), bütçeler
- `docs/ERISILEBILIRLIK.md`: kararlar ve manuel test listesi

## Adımlar
1. **Meta üretimi:** İçerik dosyalarından (TR/EN) meta etiketleri derleme anında HTML'e yazan küçük bir Vite eklentisi; JS çalışmasa bile etiketler kaynakta bulunur.
2. **Dil SEO'su:** `?lang=en` URL'leri için `hreflang`. İngilizce sürümün meta etiketleri için `/taykut/en/` statik giriş sayfası (aynı uygulama, varsayılan dil EN) üret ve canonical'ları doğru ayarla. (Karar ve gerekçe `ILERLEME.md`'ye.)
3. **Yapılandırılmış veri:** Google Rich Results Test'e benzer yerel doğrulama: JSON-LD şemasını `schema-dts` tipleriyle yaz, test et.
4. **Erişilebilirlik denetimi:**
   - axe: ciddi/kritik ihlal 0.
   - Klavye: Tab sırası mantıklı, her etkileşimli öğe ulaşılabilir, odak halkası görünür, odak hiç kaybolmuyor.
   - Ekran okuyucu: bölüm başlıkları hiyerarşisi (h1 → h2 → h3), landmark'lar, düğme etiketleri, dekoratif görseller `alt=""`, anlamlı görsellerde açıklayıcı alt.
   - Renk: kontrast betiği yeşil; bilgi sadece renkle verilmiyor (durum rozetlerinde metin var).
   - Hareket: `prefers-reduced-motion` CSS kuralı genel; video otomatik oynatma reduced-motion'da kapalı; Playwright `reducedMotion: 'reduce'` testi.
   - Yakınlaştırma: %200'de düzen bozulmuyor; `user-scalable` engellenmiyor.
   - Dokunma hedefleri ≥ 44 px.
5. **Gizlilik:** Harici istek yok (fontlar yerel). `tools/check-external.mjs`: derleme çıktısında harici alan adına giden `src/href` (atıf linkleri ve sosyal linkler hariç) varsa hata. Çerez yok. E-posta adresi gelince basit gizleme (JS ile birleştirme + `noscript` metni).
6. **Lighthouse CI:** Mobil ve masaüstü profillerinde ana sayfa + alt sayfalar. Eşikler: Performans ≥ 90 (3D öncesi), Erişilebilirlik ≥ 98, En İyi Uygulamalar ≥ 95, SEO = 100. Raporlar artifact olarak saklanır.
7. **Güvenlik başlıkları:** GitHub Pages başlık ayarına izin vermez; `<meta http-equiv="Content-Security-Policy">` ile makul bir CSP (inline stil gerekiyorsa hash) ekle; `referrer` politikası `strict-origin-when-cross-origin`.

## Kabul testleri
- axe testleri yeşil (tüm sayfalar, iki dil).
- Lighthouse CI eşikleri geçiyor (rapor özetini ekle).
- `check-external.mjs` yeşil.
- Klavye ile ana sayfanın baştan sonuna ve geri gezinme videosu (Playwright trace).

## Eleştiri listesi
- Ekran okuyucu kullanan biri sponsor bilgisine ulaşabiliyor mu? (NVDA/Narrator ile manuel deneme yapılabiliyorsa yap; yapılamıyorsa "doğrulanmadı" yaz.)
- Google'da "TAYKUT rover" aranınca çıkacak başlık ve açıklama çekici mi?
- Paylaşım kartı WhatsApp/Instagram önizlemesinde iyi görünüyor mu? (OG görselini 1200×630 ve 600×315 ölçeklerinde kontrol et.)

## Bitiş raporu
Lighthouse ve axe sonuçları, meta etiket örnekleri, CSP içeriği.
