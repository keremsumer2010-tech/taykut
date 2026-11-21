// Geçici sayfa: yayın hattını, tasarım sistemini ve dil altyapısını kanıtlar. Gerçek düzen B03'te gelir.
import { setLang, useLang, useT } from '@/lib/i18n';
import s from './App.module.css';

export function App() {
  const t = useT();
  const lang = useLang();
  return (
    <main className={s.placeholder}>
      <p className="t-label">{t.hero.kicker}</p>
      <h1 className="t-hero">{t.hero.title}</h1>
      <p className="t-lead">{t.hero.tagline.join(' ')}</p>
      <button
        type="button"
        className={`t-label ${s.lang}`}
        onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
        lang={lang === 'tr' ? 'en' : 'tr'}
        aria-label={`${t.a11y.language}: ${t.a11y.switchTo}`}
      >
        {t.a11y.switchTo}
      </button>
    </main>
  );
}
