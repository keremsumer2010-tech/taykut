// Site içi bağlantılar. Alt sayfalardan ana sayfa bölümlerine giderken base yolu eklenir.
export const BASE = import.meta.env.BASE_URL; // "/taykut/"

/** Ana sayfada kalan (sinematik akış) bölümler. */
export const SECTION_IDS = ['rover', 'missions', 'numbers', 'sponsor-cta'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Menüden açılan ayrı sayfalar (klasör adları). */
export type PageId = 'rover' | 'muhendislik' | 'istasyon' | 'takim' | 'sponsor' | 'basin';

const langQuery = () => {
  if (typeof window === 'undefined') return '';
  const lang = new URLSearchParams(location.search).get('lang');
  return lang ? `?lang=${lang}` : '';
};

const isHome = () => {
  const p = location.pathname;
  return p === BASE || p === BASE.replace(/\/$/, '') || p === `${BASE}index.html`;
};

/** Ana sayfadaysa `#id`, alt sayfadaysa `/taykut/?lang=..#id`. Dil parametresi korunur. */
export function sectionHref(id: SectionId | 'top'): string {
  const hash = id === 'top' ? '' : `#${id}`;
  if (typeof window !== 'undefined' && isHome()) return hash || '#top';
  return `${BASE}${langQuery()}${hash}`;
}

export function pageHref(page: PageId): string {
  return `${BASE}${page}/${langQuery()}`;
}

/** Şu an açık olan sayfa (menüde aria-current için). */
export function currentPage(): PageId | 'home' {
  if (typeof window === 'undefined') return 'home';
  const seg = location.pathname.slice(BASE.length).split('/')[0];
  const pages: PageId[] = ['rover', 'muhendislik', 'istasyon', 'takim', 'sponsor', 'basin'];
  return (pages as string[]).includes(seg ?? '') ? (seg as PageId) : 'home';
}
