import { Button } from '@/components/Button';
import { Picture } from '@/components/Picture';
import { Icon } from '@/components/Icon';
import { useLang, useT } from '@/lib/i18n';
import { formatLatLon } from '@/lib/geofmt';
import { pageHref, sectionHref } from '@/lib/links';
import s from './Hero.module.css';

export function Hero() {
  const t = useT();
  const lang = useLang();
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      {/* 3B sahne bu alana yerleşecek (B10). Şimdilik saha fotoğrafı. */}
      <div className={s.media} data-3d-slot="hero">
        {/* Mobilde görsel koyu karartmanın altında arka plan: 55vw çözünürlük yeterli, LCP için küçük dosya (B05). */}
        <Picture name="hero-regolit" alt={t.hero.imageAlt} sizes="(min-width: 1024px) 58vw, 55vw" priority />
      </div>

      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <p className={`t-label ${s.kicker}`}>
            <span className={s.dot} aria-hidden="true" />
            {t.hero.kicker}
          </p>
          <h1 id="hero-title" className={`t-hero ${s.title}`}>
            {t.hero.title}
          </h1>
          <p className={s.tagline}>
            {t.hero.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className={`t-lead ${s.lead}`}>{t.hero.lead}</p>
          <div className="cluster">
            <Button href={pageHref('sponsor')} icon="arrow-right">
              {t.hero.primary.label}
            </Button>
            <Button href={sectionHref('missions')} variant="secondary">
              {t.hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Alt telemetri şeridi: HUD dili, gerçek bilgiler */}
      <div className={`container ${s.strip}`} aria-hidden="true">
        <span className="t-label t-mono">{formatLatLon(39.93, 32.86, lang)} · ANKARA</span>
        <span className={`t-label ${s.stripMid}`}>{t.hero.strip}</span>
        <a href="#rover" className={`t-label ${s.scroll}`} tabIndex={-1}>
          {t.a11y.scrollDown}
          <Icon name="arrow-down" size={16} />
        </a>
      </div>
    </section>
  );
}
