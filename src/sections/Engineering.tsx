import { HudFrame } from '@/components/HudFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { KindNote } from '@/components/bits';
import { TWIN_PROOF } from '@/content/facts';
import { SYSTEM_IDS } from '@/content/schema';
import { formatFact, useLang, useT } from '@/lib/i18n';
import twinImg from '@/assets/photos/dijital-ikiz.webp';
import s from './sections.module.css';

export function Engineering() {
  const t = useT();
  const lang = useLang();
  const sec = t.engineering;
  const left = formatFact(TWIN_PROOF.rockerLeftDeg, lang);
  const right = formatFact(TWIN_PROOF.rockerRightDeg, lang);
  const diff = formatFact(TWIN_PROOF.mismatchDeg, lang);
  return (
    <section id="engineering" className="section" aria-labelledby="engineering-title">
      <div className="container">
        <SectionHeader
          id="engineering-title"
          index={sec.index}
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        <ol className={s.systems}>
          {SYSTEM_IDS.map((id, i) => {
            const sys = sec.systems[id];
            return (
              <li key={id} className={s.system}>
                <span className={`t-label ${s.systemIndex}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{sys.name}</h3>
                <p className="t-small">{sys.body}</p>
                <ul className={s.points}>
                  {sys.points.map((p) => (
                    <li key={p} className="t-small">
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <div className={`grid ${s.twin}`}>
          <figure className={`span-6 ${s.twinFigure}`}>
            <img src={twinImg} alt="" width={1480} height={920} loading="lazy" decoding="async" />
          </figure>
          <div className={`span-6 ${s.twinCopy}`}>
            <h3 className="t-h2">{sec.twin.title}</h3>
            <p className="t-body">{sec.twin.body}</p>
            <HudFrame accent title="DIFF · DRUMHELLER" meta={<KindNote>{t.kinds.simulated}</KindNote>}>
              <div className={s.proofGrid}>
                <div>
                  <p className="t-label">ROCKER L</p>
                  <p className="t-data">
                    {left.value}
                    <span className="t-unit">{left.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="t-label">ROCKER R</p>
                  <p className="t-data">
                    {right.value}
                    <span className="t-unit">{right.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="t-label">Δ</p>
                  <p className="t-data">
                    {diff.value}
                    <span className="t-unit">{diff.unit}</span>
                  </p>
                </div>
              </div>
              <p className={`t-small ${s.proofText}`}>{sec.twin.proof}</p>
            </HudFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
