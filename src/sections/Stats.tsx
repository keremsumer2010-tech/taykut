import { SectionHeader } from '@/components/SectionHeader';
import { Stat } from '@/components/bits';
import { STATS } from '@/content/facts';
import { STAT_IDS } from '@/content/schema';
import { formatFact, kindNote, useLang, useT } from '@/lib/i18n';
import s from './sections.module.css';

export function Stats() {
  const t = useT();
  const lang = useLang();
  const sec = t.stats;
  return (
    <section id="numbers" className={`section ${s.band}`} aria-labelledby="numbers-title">
      <div className="container">
        <SectionHeader id="numbers-title" index={sec.index} kicker={sec.kicker} title={sec.title} />
        <div className={`grid ${s.stats}`}>
          {STAT_IDS.map((id) => {
            const fact = STATS[id];
            const f = formatFact(fact, lang, t);
            const note = kindNote(fact, t);
            return (
              <div key={id} className="span-4">
                <Stat
                  value={f.value}
                  {...(f.unit ? { unit: f.unit } : {})}
                  label={sec.items[id]}
                  {...(note ? { note } : {})}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
