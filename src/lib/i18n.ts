// Dil altyapısı: seçim önceliği ?lang= → kayıtlı tercih → tarayıcı dili → Türkçe.
// Dil değişince sayfa yenilenmez; <html lang>, başlık ve meta açıklama güncellenir.
import { useSyncExternalStore } from 'react';
import type { Content, Lang } from '@/content/schema';
import type { Fact } from '@/content/facts';
import { tr } from '@/content/tr';
import { en } from '@/content/en';

const DICTS: Record<Lang, Content> = { tr, en };
const STORAGE_KEY = 'taykut.lang';

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'tr' || v === 'en' ? v : null;
  } catch {
    return null; // gizli pencere veya engellenmiş depolama
  }
}

export function detectLang(
  search = location.search,
  navLangs: readonly string[] = navigator.languages ?? [],
): Lang {
  const q = new URLSearchParams(search).get('lang');
  if (q === 'tr' || q === 'en') return q;
  const stored = readStored();
  if (stored) return stored;
  const first = navLangs[0]?.toLowerCase() ?? 'tr';
  return first.startsWith('tr') ? 'tr' : first.startsWith('en') ? 'en' : 'tr';
}

let current: Lang = typeof window === 'undefined' ? 'tr' : detectLang();
const listeners = new Set<() => void>();

function applyDocument(lang: Lang) {
  const t = DICTS[lang];
  document.documentElement.lang = lang;
  document.title = t.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* depolama yoksa tercih yalnız bu oturumda geçerli */
  }
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(history.state, '', url);
  applyDocument(lang);
  listeners.forEach((l) => l());
}

export function initLang() {
  applyDocument(current);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 'tr',
  );
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
