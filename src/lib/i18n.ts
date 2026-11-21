// Dil altyapısı. Dil URL yolundan gelir (/taykut/… TR, /taykut/en/… EN): her dilin önceden üretilmiş
// gerçek HTML sayfası vardır (SEO, paylaşım önizlemesi, JS'siz okuma). Dil değişimi diğer dilin
// aynı sayfasına gider. Eski `?lang=en` bağlantıları initLang() içinde yeni yola yönlendirilir.
import type { Content, Lang } from '@/content/schema';
import type { Fact } from '@/content/facts';
import { tr } from '@/content/tr';
import { en } from '@/content/en';
import { getRoute, parsePath, pathFor } from './route';

const DICTS: Record<Lang, Content> = { tr, en };

/** Alt sayfalar kendi başlığını verir (ör. "Sponsorluk — TAYKUT"). */
let titleFn: ((t: Content) => string) | null = null;
export function setPageTitle(fn: ((t: Content) => string) | null) {
  titleFn = fn;
}

export function pageTitle(t: Content): string {
  return titleFn ? titleFn(t) : t.meta.title;
}

/** Tarayıcıda açılışta: eski ?lang= bağlantısını yeni yola çevirir. Yönlendirme yaptıysa true döner. */
export function initLang(): boolean {
  if (typeof window === 'undefined') return false;
  const q = new URLSearchParams(location.search).get('lang');
  const route = parsePath(location.pathname);
  if ((q === 'en' || q === 'tr') && q !== route.lang) {
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    location.replace(`${pathFor(q, route.page)}${url.search}${url.hash}`);
    return true;
  }
  return false;
}

/** Diğer dilin aynı sayfasına gider (gerçek, önceden üretilmiş sayfa). */
export function setLang(lang: Lang) {
  const { page, lang: now } = getRoute();
  if (lang === now) return;
  location.assign(`${pathFor(lang, page)}${location.hash}`);
}

export function useLang(): Lang {
  return getRoute().lang;
}

/** Aktif dilin metinleri. */
export function useT(): Content {
  return DICTS[useLang()];
}

export function getT(lang: Lang): Content {
  return DICTS[lang];
}

/** İngilizce sıra sayısı eki: 1st, 2nd, 3rd, 4th, 11th, 21st… */
export function ordinal(n: number, lang: Lang): string {
  if (lang === 'tr') return `${n}.`;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

/** Bir Fact değerini ve birimini dile göre biçimler. Ondalık ayırıcı Türkçede virgül. */
export function formatFact(
  fact: Fact,
  lang: Lang,
  t: Content = DICTS[lang],
): { value: string; unit?: string } {
  if (fact.unit === 'ordinal') return { value: ordinal(Number(fact.value), lang) };
  const value = lang === 'tr' ? fact.value.replace(/(\d)\.(\d)/g, '$1,$2') : fact.value;
  const unit = fact.unit === 'min' ? t.units.min : fact.unit;
  return unit === undefined ? { value } : { value, unit };
}

/** Sayının yanında gösterilecek doğruluk notu; gerçek sonuç ve ölçümde not gösterilmez. */
export function kindNote(fact: Fact, t: Content): string | undefined {
  return fact.kind === 'result' || fact.kind === 'measured' ? undefined : t.kinds[fact.kind];
}
