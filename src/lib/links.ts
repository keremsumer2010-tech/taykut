// Site içi bağlantılar. Dil URL yolundadır (/taykut/… Türkçe, /taykut/en/… İngilizce).
import { getRoute, pathFor, type PageId } from './route';

export { BASE, type PageId } from './route';

/** Ana sayfada kalan (sinematik akış) bölümler. */
export const SECTION_IDS = ['rover', 'missions', 'numbers', 'sponsor-cta'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Ana sayfadaysa `#id`, başka sayfadaysa ana sayfanın o bölümü. */
export function sectionHref(id: SectionId | 'top'): string {
  const { lang, page } = getRoute();
  const hash = id === 'top' ? '' : `#${id}`;
  if (page === 'home') return hash || '#top';
  return `${pathFor(lang, 'home')}${hash}`;
}

export function pageHref(page: PageId): string {
  return pathFor(getRoute().lang, page);
}

/** Şu an açık olan sayfa (menüde aria-current için). */
export function currentPage() {
  return getRoute().page;
}
