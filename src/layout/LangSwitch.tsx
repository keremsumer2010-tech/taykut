import { setLang, useLang, useT } from '@/lib/i18n';
import s from './layout.module.css';

/**
 * TR / EN anahtarı. Etkin dil vurgulu; düğme diğer dilin aynı sayfasına gider.
 * Erişilebilir ad görünen metni içerir ("TR / EN, Dil: English"): sesli komutla "EN" diyen kullanıcı
 * düğmeyi bulabilsin (WCAG 2.5.3 Label in Name).
 */
export function LangSwitch() {
  const lang = useLang();
  const t = useT();
  const next = lang === 'tr' ? 'en' : 'tr';
  return (
    <button type="button" className={`t-label ${s.lang}`} onClick={() => setLang(next)}>
      <span className={lang === 'tr' ? s.langOn : undefined}>TR</span>
      <span aria-hidden="true" className={s.langSep}>
        /
      </span>
      <span lang="en" className={lang === 'en' ? s.langOn : undefined}>
        EN
      </span>
      <span className="sr-only">
        , {t.a11y.language}: {t.a11y.switchTo}
      </span>
    </button>
  );
}
