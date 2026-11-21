# TAYKUT — Rover Takımı Web Sitesi

TAYKUT, Ankara ASELSAN Mesleki ve Teknik Anadolu Lisesi'nden bir lise rover takımı. Bu depo takımın sinematik ve etkileşimli web sitesini içerecek: açılışta rover, ardından 3D Dünya küresi üzerinde gerçek arazilere uçuş ve her bölgede rocker-bogie süspansiyonla görev sürüşü.

> **Durum:** Yapım aşamasında. Biten bölümler için [`docs/ILERLEME.md`](docs/ILERLEME.md).
> **Canlı adres:** https://keremsumer2010-tech.github.io/taykut/

## Geliştirme
Gerekenler: Node 26 (`.nvmrc`), npm.

```bash
npm ci                 # bağımlılıkları kur
npm run dev            # geliştirme sunucusu: http://localhost:5173/taykut/
npm run build          # üretim derlemesi (dist/)
npm run preview        # derlemeyi önizle: http://localhost:4173/taykut/
```

| Betik | Ne yapar |
|---|---|
| `typecheck` | TypeScript tip denetimi (strict) |
| `lint` / `format` | ESLint / Prettier |
| `test` | Birim testleri (Vitest) |
| `test:e2e` | Uçtan uca testler (Playwright; önce `npx playwright install`) |
| `budget` | Derleme boyut bütçesi (`budget.config.json`) |
| `check:size` | Depoda 15 MB üstü dosya var mı |

**Yayın:** `main` dalına her push'ta GitHub Actions denetimleri çalıştırır; hepsi yeşilse site GitHub Pages'e otomatik yayınlanır. Kırmızı test yayına çıkmaz.

## Belgeler
| Dosya | Ne |
|---|---|
| [`PROMPT_TAYKUT_SITE.md`](PROMPT_TAYKUT_SITE.md) | Anayasa: değişmez kurallar, gerçekler, teknik çerçeve |
| [`prompts/`](prompts/README.md) | 24 ayrıntılı bölüm promptu (B00–B23), sırayla uygulanır |
| [`kaynak/foto/`](kaynak/foto) | Ham saha fotoğrafları |
| [`docs/superpowers/specs/2026-11-21-taykut-site-design.md`](docs/superpowers/specs/2026-11-21-taykut-site-design.md) | Tasarım belgesi: kararlar, gerekçeler, yol haritası |

## Nasıl başlanır
Yeni bir Claude Code oturumunda bu klasörü çalışma dizini yapın ve şunu yazın:

```
PROMPT_TAYKUT_SITE.md dosyasını oku ve ona göre çalış.
```

## İlkeler
- Tamamen ücretsiz altyapı (GitHub Pages, açık kaynak kütüphaneler, açık lisanslı veri).
- Uydurma veri yok: sitedeki her sayının kaynağı belgelenir.
- İçerik 3D'den bağımsızdır; WebGL olmadan da site eksiksiz okunur.

## Takım
Kerem Sümer (Kaptan), Mehmet Revaha Emuce, Yağız Eymen Yanık, Kerem Şakir, Ahmet Özhan Öztürk, Mehmet Emir Erdoğmuş, İbrahim Enes Yeşil · Danışman: Mustafa Seyhan · Instagram: [@teamtaykut](https://instagram.com/teamtaykut)

---

**English:** Website for TAYKUT, a high-school rover team from Ankara, Türkiye. Planning stage. See `PROMPT_TAYKUT_SITE.md` for the full build specification.

## Lisans
Kod: MIT (bkz. [`LICENSE`](LICENSE)). Fotoğraflar, logo, takım metinleri ve rover tasarımları: © TAYKUT, tüm hakları saklıdır. Üçüncü taraf veri ve varlıkların lisansları `docs/VARLIKLAR.md` dosyasında listelenecektir.
