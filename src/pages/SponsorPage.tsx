import { Button } from '@/components/Button';
import { HudFrame } from '@/components/HudFrame';
import { CONTACT, hasEmail } from '@/content/contact';
import { TIER_IDS } from '@/content/schema';
import { useT } from '@/lib/i18n';
import { Page } from '@/layout/Page';
import { PageHeader } from './PageHeader';
import s from './pages.module.css';

export function SponsorPage() {
  const t = useT();
  const p = t.pages.sponsor;
  const sec = t.sponsor;
  return (
    <Page>
      <PageHeader kicker={sec.kicker} title={p.title} lead={p.lead} />
      <div className={`container ${s.body}`}>
        <section aria-labelledby="why-title" className={s.block}>
          <h2 id="why-title" className="sr-only">
            {sec.title.join(' ')}
          </h2>
          <ul className={s.cards3}>
            {sec.why.map((w) => (
              <li key={w.title}>
                <HudFrame title={w.title}>
                  <p className="t-body">{w.body}</p>
                </HudFrame>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tiers-title" className={s.block}>
          <h2 id="tiers-title" className="t-h2">
            {sec.title.join(' ')}
          </h2>
          <ol className={s.cards4}>
            {TIER_IDS.map((id, i) => {
              const tier = sec.tiers[id];
              return (
                <li key={id}>
                  <HudFrame accent={i === 0} title={String(i + 1).padStart(2, '0')}>
                    <h3 className="t-h3">{tier.name}</h3>
                    <p className="t-small">{tier.body}</p>
                    <ul className={s.dashList}>
                      {tier.perks.map((perk) => (
                        <li key={perk} className="t-small">
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </HudFrame>
                </li>
              );
            })}
          </ol>
        </section>

        <div className={s.wall} aria-label={sec.emptyWall}>
          <span className={`t-label ${s.wallSlot}`}>{sec.emptyWall}</span>
          <span className={s.wallSlot} aria-hidden="true" />
          <span className={s.wallSlot} aria-hidden="true" />
          <span className={s.wallSlot} aria-hidden="true" />
        </div>

        <section aria-labelledby="place-title" className={`grid ${s.block}`}>
          <h2 id="place-title" className="span-5 t-h2">
            {p.placementTitle}
          </h2>
          <ol className={`span-7 ${s.numbered}`}>
            {p.placements.map((pl, i) => (
              <li key={pl}>
                <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
                {pl}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-title" className={`grid ${s.block}`}>
          <h2 id="faq-title" className="span-5 t-h2">
            {p.faqTitle}
          </h2>
          <div className={`span-7 ${s.faq}`}>
            {p.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="t-body">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-title" className={s.block}>
          <h2 id="contact-title" className="t-h2">
            {sec.contactTitle}
          </h2>
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
          </div>
        </section>
      </div>
    </Page>
  );
}
