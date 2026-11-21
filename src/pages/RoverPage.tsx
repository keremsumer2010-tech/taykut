import { KindNote } from '@/components/bits';
import { SUMMERTECH, type Fact } from '@/content/facts';
import type { Kind, SpecId } from '@/content/schema';
import rover2027 from '@/content/rover2027.generated.json';
import { formatFact, kindNote, useLang, useT } from '@/lib/i18n';
import { Page } from '@/layout/Page';
import { PageHeader } from './PageHeader';
import heroImg from '@/assets/photos/hero-regolit.jpg';
import twinImg from '@/assets/photos/dijital-ikiz.webp';
import s from './pages.module.css';

type Row = { id: SpecId; fact: Fact };

const ST_ROWS: Row[] = [
  { id: 'envelope', fact: SUMMERTECH.envelopeCm },
  { id: 'wheels', fact: SUMMERTECH.wheels },
  { id: 'wheelDiameter', fact: SUMMERTECH.wheelDiameterCm },
  { id: 'motors', fact: SUMMERTECH.motors },
  { id: 'speed', fact: SUMMERTECH.speed },
  { id: 'runtime', fact: SUMMERTECH.runtime },
  { id: 'range', fact: SUMMERTECH.range },
  { id: 'battery', fact: SUMMERTECH.battery },
  { id: 'averageCurrent', fact: SUMMERTECH.averageCurrent },
];

type GenField = { value: number | string | number[]; unit?: string; kind: string; source: string };
const asFact = (f: GenField, map?: (v: GenField['value']) => string): Fact => ({
  value: map ? map(f.value) : Array.isArray(f.value) ? f.value.join(' × ') : String(f.value),
  ...(f.unit ? { unit: f.unit } : {}),
  kind: f.kind as Kind,
  source: f.source,
});

export function RoverPage() {
  const t = useT();
  const lang = useLang();
  const p = t.pages.rover;
  const g = rover2027;
  const enumLabel = (v: GenField['value']) => p.enums[String(v)] ?? String(v);
  const maxSpeed = (g.maxWheelSpeedRadS.value * g.geometry.wheelRadius).toFixed(1);
  const rows2027: Row[] = [
    { id: 'wheels', fact: asFact(g.wheelCount) },
    { id: 'suspension', fact: asFact(g.suspension, enumLabel) },
    { id: 'steering', fact: asFact(g.steering, enumLabel) },
    { id: 'mass', fact: asFact(g.totalMassKg) },
    { id: 'wheelDiameter', fact: asFact(g.wheelDiameterM) },
    { id: 'wheelbase', fact: asFact(g.wheelbaseM) },
    { id: 'trackWidth', fact: asFact(g.trackWidthM) },
    { id: 'bodySize', fact: asFact(g.bodySizeM) },
    { id: 'groundClearance', fact: asFact(g.groundClearanceM) },
    { id: 'motor', fact: asFact(g.motor, enumLabel) },
    {
      id: 'maxSpeed',
      fact: { value: `~${maxSpeed}`, unit: 'm/s', kind: 'design-target', source: g.maxWheelSpeedRadS.source },
    },
    { id: 'voltage', fact: asFact(g.batteryVoltageV) },
  ];

  const table = (rows: Row[], caption: string) => (
    <table className={s.specs}>
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {rows.map(({ id, fact }) => {
          const f = formatFact(fact, lang, t);
          const note = kindNote(fact, t);
          return (
            <tr key={id}>
              <th scope="row" className="t-label">
                {p.specs[id]}
              </th>
              <td>
                <span className="t-mono">
                  {f.value}
                  {f.unit && <span className="t-unit">{f.unit}</span>}
                </span>
                {note && <KindNote>{note}</KindNote>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <Page>
      <PageHeader kicker={t.nav.engineering} title={p.title} lead={p.lead} />
      <div className={`container ${s.body}`}>
        <section className={`grid ${s.roverBlock}`} aria-labelledby="st-title">
          <figure className={`span-5 ${s.roverFigure}`}>
            <img src={heroImg} alt={t.hero.imageAlt} width={1200} height={1600} fetchPriority="high" />
          </figure>
          <div className={`span-7 ${s.roverText}`}>
            <h2 id="st-title" className="t-h2">
              {p.summertechTitle}
            </h2>
            <p className="t-body">{p.summertechNote}</p>
            {table(ST_ROWS, p.summertechTitle)}
          </div>
        </section>

        <section className={`grid ${s.roverBlock}`} aria-labelledby="r27-title">
          <figure className={`span-5 ${s.roverFigure}`}>
            <img src={twinImg} alt="" width={1480} height={920} loading="lazy" />
          </figure>
          <div className={`span-7 ${s.roverText}`}>
            <h2 id="r27-title" className="t-h2">
              {p.rover2027Title}
            </h2>
            <p className="t-body">{p.rover2027Note}</p>
            {table(rows2027, p.rover2027Title)}
          </div>
        </section>
      </div>
    </Page>
  );
}
