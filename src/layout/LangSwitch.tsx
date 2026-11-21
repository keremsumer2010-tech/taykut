import { setLang, useLang, useT } from '@/lib/i18n';
import s from './layout.module.css';

/** TR | EN anahtarı. Etkin dil vurgulu; düğme diğer dile geçer. */
export function LangSwitch() {
  const lang = useLang();
  const t = useT();
  const next = lang === 'tr' ? 'en' : 'tr';
  return (
    <button
      type="button"
      className={`t-label ${s.lang}`}
      onClick={() => setLang(next)}
      aria-label={`${t.a11y.language}: ${t.a11y.switchTo}`}
    >
      <span aria-hidden="true" className={lang === 'tr' ? s.langOn : undefined}>
        TR
      </span>
      <span aria-hidden="true" className={s.langSep}>
        /
      </span>
      <span aria-hidden="true" lang="en" className={lang === 'en' ? s.langOn : undefined}>
        EN
      </span>
    </button>
  );
}
