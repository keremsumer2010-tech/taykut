import { SectionHeader } from '@/components/SectionHeader';
import { useT } from '@/lib/i18n';
import s from './sections.module.css';

// "Şimdi" işareti: zaman çizelgesinde şu anki dönem (2026–27 yeni ekip) — dizinin 3. öğesi.
const NOW_INDEX = 3;

export function Journey() {
  const t = useT();
  const sec = t.journey;
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container grid">
        <div className="span-5">
          <SectionHeader id="journey-title" index={sec.index} kicker={sec.kicker} title={sec.title} />
        </div>
        <ol className={s.timeline}>
          {sec.items.map((item, i) => (
            <li
              key={item.date}
              className={`${s.event} ${i === NOW_INDEX ? s.eventNow : ''} ${i > NOW_INDEX ? s.eventFuture : ''}`}
            >
              <span className={`t-label t-mono ${s.eventDate}`}>{item.date}</span>
              <div className={s.eventBody}>
                <h3 className="t-h3">
                  {item.title}
                  {i === NOW_INDEX && <span className={`t-label ${s.nowTag}`}>{sec.now}</span>}
                </h3>
                <p className="t-small">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
