import { SectionHeader } from '@/components/SectionHeader';
import { Picture } from '@/components/Picture';
import { PART_IDS } from '@/content/schema';
import { useT } from '@/lib/i18n';
import s from './Inspect.module.css';

export function Inspect() {
  const t = useT();
  const sec = t.inspect;
  return (
    <section id="rover" className="section" aria-labelledby="rover-title">
      <div className="container grid">
        <div className={`span-5 ${s.mediaCol}`}>
          {/* B10: 3B patlatılmış görünüm bu alana yerleşir. */}
          <figure className={s.figure} data-3d-slot="inspect">
            <Picture name="gece-ahtapot" alt={sec.imageAlt} sizes="(min-width: 1024px) 40vw, 100vw" />
            <figcaption className={`t-label ${s.caption}`}>
              <span>MRC 2026</span>
              <span>{t.missions.regions.mrc2026.steps[2]}</span>
            </figcaption>
          </figure>
        </div>

        <div className={`span-7 ${s.content}`}>
          <SectionHeader
            id="rover-title"
            index={sec.index}
            kicker={sec.kicker}
            title={sec.title}
            lead={sec.lead}
          />
          <ol className={s.parts}>
            {PART_IDS.map((id, i) => (
              <li key={id} className={s.part}>
                <span className={`t-label ${s.partIndex}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.partName}>{sec.parts[id].name}</span>
                <span className={`t-small ${s.partSpec}`}>{sec.parts[id].spec}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
