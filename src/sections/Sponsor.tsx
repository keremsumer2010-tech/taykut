import { Button } from '@/components/Button';
import { HudFrame } from '@/components/HudFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { CONTACT, hasEmail } from '@/content/contact';
import { TIER_IDS } from '@/content/schema';
import { useT } from '@/lib/i18n';
import { pageHref } from '@/lib/links';
import s from './sections.module.css';

export function Sponsor() {
  const t = useT();
  const sec = t.sponsor;
  return (
    <section id="sponsor" className={`section ${s.sponsor}`} aria-labelledby="sponsor-title">
      <div className="container">
        <div className="grid">
          <div className="span-6">
            <SectionHeader
              id="sponsor-title"
              index={sec.index}
              kicker={sec.kicker}
              title={sec.title}
              lead={sec.lead}
            />
          </div>
          <ul className={`span-6 ${s.why}`}>
            {sec.why.map((w) => (
              <li key={w.title}>
                <h3 className="t-label">{w.title}</h3>
                <p className="t-body">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <ol className={s.tiers}>
          {TIER_IDS.map((id, i) => {
            const tier = sec.tiers[id];
            return (
              <li key={id}>
                <HudFrame accent={i === 0} className={s.tier}>
                  <p className={`t-label ${s.tierIndex}`}>{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="t-h3">{tier.name}</h3>
                  <p className="t-small">{tier.body}</p>
                  <ul className={s.points}>
                    {tier.perks.map((p) => (
                      <li key={p} className="t-small">
                        {p}
                      </li>
                    ))}
                  </ul>
                </HudFrame>
              </li>
            );
          })}
        </ol>

        <div className={s.wall} aria-label={sec.emptyWall}>
          <span className={`t-label ${s.wallSlot}`}>{sec.emptyWall}</span>
          <span className={s.wallSlot} aria-hidden="true" />
          <span className={s.wallSlot} aria-hidden="true" />
          <span className={s.wallSlot} aria-hidden="true" />
        </div>

        <div className={s.contact}>
          <h3 className="t-h2">{sec.contactTitle}</h3>
          <div className="cluster">
            {hasEmail() && (
              <Button href={`mailto:${CONTACT.email}`} icon="mail">
                {sec.emailCta}
              </Button>
            )}
            <Button
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant={hasEmail() ? 'secondary' : 'primary'}
              icon="instagram"
            >
              {sec.instagramCta}
            </Button>
            <Button href={pageHref('sponsor')} variant="ghost" icon="arrow-right">
              {t.pages.sponsor.title}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
