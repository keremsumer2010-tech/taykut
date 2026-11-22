// Geçerli rota (dil + sayfa). Tarayıcıda location'dan okunur; önceden HTML üretiminde (SSR)
// tools/prerender.mjs her sayfa için setRoute() ile ayarlar. Böylece sunucu ve tarayıcı aynı çıktıyı verir.
import type { Lang } from '@/content/schema';

export const BASE = import.meta.env.BASE_URL; // "/taykut/"
export type PageId = 'rover' | 'gorevler' | 'muhendislik' | 'istasyon' | 'takim' | 'sponsor' | 'basin';
export type RouteId = PageId | 'home' | 'notfound';
export const PAGE_IDS: PageId[] = [
  'rover',
  'gorevler',
  'muhendislik',
  'istasyon',
  'takim',
  'sponsor',
  'basin',
];

export interface Route {
  lang: Lang;
  page: RouteId;
}

/** "/taykut/en/sponsor/" → { lang: 'en', page: 'sponsor' } */
export function parsePath(pathname: string): Route {
  let rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  let lang: Lang = 'tr';
  if (rest === 'en' || rest.startsWith('en/')) {
    lang = 'en';
    rest = rest.slice(2).replace(/^\//, '');
  }
  const seg = rest.split('/')[0] ?? '';
  if (seg === '' || seg === 'index.html') return { lang, page: 'home' };
  if (seg === '404.html') return { lang, page: 'notfound' };
  return { lang, page: (PAGE_IDS as string[]).includes(seg) ? (seg as PageId) : 'notfound' };
}

let current: Route =
  typeof window === 'undefined' ? { lang: 'tr', page: 'home' } : parsePath(location.pathname);

export function getRoute(): Route {
  return current;
}

/** Yalnız önceden HTML üretimi (SSR) ve testler için. */
export function setRoute(r: Route) {
  current = r;
}

/** Bir dil + sayfa için yol: ('en', 'sponsor') → "/taykut/en/sponsor/". */
export function pathFor(lang: Lang, page: RouteId): string {
  const prefix = `${BASE}${lang === 'en' ? 'en/' : ''}`;
  if (page === 'home') return prefix;
  if (page === 'notfound') return `${prefix}404.html`;
  return `${prefix}${page}/`;
}
