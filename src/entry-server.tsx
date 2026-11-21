// Önceden HTML üretimi (SSR) girişi. tools/prerender.mjs bu modülü (vite build --ssr) her dil ve
// sayfa için çağırır; çıktı ilgili HTML dosyasındaki #root içine yazılır, tarayıcı üstüne bağlanır.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import type { Lang } from '@/content/schema';
import { getT, pageTitle, setPageTitle } from '@/lib/i18n';
import { PAGE_IDS, pathFor, setRoute, type RouteId } from '@/lib/route';
import { PAGES } from '@/pages/registry';

export const ROUTES: RouteId[] = ['home', ...PAGE_IDS, 'notfound'];
export const LANGS: Lang[] = ['tr', 'en'];

export function render(lang: Lang, page: RouteId) {
  setRoute({ lang, page });
  const def = PAGES[page];
  setPageTitle(def.title);
  const t = getT(lang);
  const html = renderToString(
    <StrictMode>
      <def.Component />
    </StrictMode>,
  );
  return {
    html,
    title: pageTitle(t),
    description: def.description(t),
    ogAlt: t.meta.ogAlt,
    path: pathFor(lang, page),
    alternates: LANGS.map((l) => ({ lang: l, path: pathFor(l, page) })),
  };
}
