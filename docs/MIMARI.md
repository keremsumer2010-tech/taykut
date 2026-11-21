# Mimari

Bu belge sitenin teknik yapısını anlatır ve her bölümle birlikte büyür.

## Derleme ve yayın
```mermaid
flowchart LR
  A[git push] --> B[CI: typecheck, lint, birim test]
  B --> C[vite build]
  C --> D[bütçe + dosya boyutu]
  D --> E[Playwright: Chromium, Firefox, WebKit, mobil]
  E -->|main dalı| F[upload-pages-artifact]
  F --> G[deploy-pages]
  G --> H[keremsumer2010-tech.github.io/taykut]
```
- Tek iş akışı (`.github/workflows/ci.yml`): `deploy` işi `check` işine bağlıdır, bu yüzden kırmızı test yayına çıkamaz.
- Vite `base: '/taykut/'`; tüm varlık yolları bu önekle çözülür.

## Klasörler (şimdilik)
- `src/`: uygulama kodu (`@/` takma adı)
- `tests/unit/` (Vitest, jsdom), `tests/e2e/` (Playwright)
- `tools/`: derleme sonrası denetimler ve varlık hattı betikleri
- `prompts/`: bölüm promptları; `PROMPT_TAYKUT_SITE.md`: anayasa

## Sayfalar ve önceden HTML üretimi (B05)
```mermaid
flowchart LR
  R[src/pages/registry.tsx<br/>sayfa → bileşen, başlık, açıklama] --> C[vite build<br/>istemci, HTML şablonları]
  R --> S[vite build --ssr<br/>src/entry-server.tsx]
  C --> P[tools/prerender.mjs]
  S --> P
  P --> D[dist/… ve dist/en/…<br/>gerçek HTML + meta + hreflang + JSON-LD + CSP]
  D --> H[tarayıcı: hydrateRoot]
```
- Rota (`src/lib/route.ts`): `/taykut/<sayfa>/` Türkçe, `/taykut/en/<sayfa>/` İngilizce. Sunucuda `setRoute()` ile ayarlanır, tarayıcıda `location`'dan okunur.
- Tarayıcıda farklı sonuç verebilecek her şey (ekran genişliği, depolama) ilk çizimde sabit değerle başlar, `useEffect`'te güncellenir (hydrate uyuşmazlığı yok).

_(Sahne yaşam döngüsü, store ve zaman çizelgesi bağları ilgili bölümlerde eklenecek.)_
