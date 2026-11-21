// Her HTML girişinin ortak açılışı. Kök önceden üretilmiş HTML içeriyorsa üstüne bağlanır (hydrate),
// boşsa (geliştirme sunucusu) sıfırdan çizer.
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { getT, initLang, pageTitle, setPageTitle } from '@/lib/i18n';
import { getRoute } from '@/lib/route';
import { PAGES } from '@/pages/registry';
import '@/styles/base.css';

/** Geçerli URL'nin sayfasını kayıttan bulup çizer. Tüm HTML girişleri bunu çağırır. */
export function mountRoute() {
  if (initLang()) return; // eski ?lang= bağlantısı yeni yola yönlendiriliyor
  const { lang, page } = getRoute();
  const { Component, title } = PAGES[page];
  setPageTitle(title);
  const t = getT(lang);
  document.documentElement.lang = lang;
  document.title = pageTitle(t);

  const root = document.getElementById('root');
  if (!root) throw new Error('#root bulunamadı');
  const app = (
    <StrictMode>
      <Component />
    </StrictMode>
  );
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
