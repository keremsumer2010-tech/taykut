// Site içi bağlantılar. Alt sayfalardan ana sayfa bölümlerine giderken base yolu eklenir.
export const BASE = import.meta.env.BASE_URL; // "/taykut/"

export const SECTION_IDS = [
  'rover',
  'missions',
  'numbers',
  'engineering',
  'station',
  'journey',
  'team',
  'sponsor',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

const isHome = () => {
  const p = location.pathname;
  return p === BASE || p === BASE.replace(/\/$/, '') || p === `${BASE}index.html`;
};

/** Ana sayfadaysa `#id`, alt sayfadaysa `/taykut/#id`. Dil parametresi korunur. */
export function sectionHref(id: SectionId | 'top'): string {
  const hash = id === 'top' ? '' : `#${id}`;
  if (typeof window !== 'undefined' && isHome()) return hash || '#top';
  const lang = typeof window !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null;
  return `${BASE}${lang ? `?lang=${lang}` : ''}${hash}`;
}

export function pageHref(page: 'sponsor' | 'rover' | 'basin' | 'istasyon'): string {
  const lang = typeof window !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null;
  return `${BASE}${page}/${lang ? `?lang=${lang}` : ''}`;
}
