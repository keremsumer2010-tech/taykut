import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { SectionHeader } from '@/components/SectionHeader';
import { useT } from '@/lib/i18n';
import { pageHref, type PageId } from '@/lib/links';
import s from './sections.module.css';

/** Ana sayfanın kapanışı: sponsor çağrısı + menüdeki ayrı sayfalara keşif kartları. */
export function SponsorCta() {
  const t = useT();
  const sec = t.sponsor;
  const cards: { page: PageId; title: string; body: string }[] = [
    { page: 'muhendislik', title: t.nav.engineering, body: t.engineering.lead ?? '' },
    { page: 'istasyon', title: t.nav.station, body: t.station.lead ?? '' },
    { page: 'takim', title: t.nav.team, body: t.team.lead ?? '' },
  ];
  return (
    <section id="sponsor-cta" className={`section ${s.sponsor}`} aria-labelledby="sponsor-cta-title">
      <div className="container">
        <div className="grid">
          <div className="span-7">
            <SectionHeader
              id="sponsor-cta-title"
              index="04"
              kicker={sec.kicker}
              title={sec.title}
              lead={sec.lead}
            />
          </div>
          <div className={`span-5 ${s.ctaActions}`}>
            <Button href={pageHref('sponsor')} icon="arrow-right">
              {t.nav.sponsor}
            </Button>
          </div>
        </div>

        <ul className={s.explore}>
          {cards.map((c) => (
            <li key={c.page}>
              <a href={pageHref(c.page)} className={s.exploreCard}>
                <span className={s.exploreTitle}>
                  {c.title}
                  <Icon name="arrow-up-right" size={20} />
                </span>
                <span className="t-small">{c.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
