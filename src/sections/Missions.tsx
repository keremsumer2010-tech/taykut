import { SectionHeader } from '@/components/SectionHeader';
import { Picture, type MediaName } from '@/components/Picture';
import { StatusBadge } from '@/components/bits';
import { REGIONS, type Region } from '@/content/regions';
import { useLang, useT } from '@/lib/i18n';
import { formatLatLon, mapPosition } from '@/lib/geofmt';
import { useMediaQuery } from '@/lib/useMediaQuery';
import mapUrl from '@/assets/map/worldmap.svg';
import s from './Missions.module.css';

// Gerçek görseli olan bölgeler; diğerleri 3B sahne gelene kadar çizgili yer tutucu gösterir.
const POSTERS: Partial<Record<Region['id'], MediaName>> = {
  mrc2026: 'aruco-test',
  drumheller: 'dijital-ikiz',
};

export function Missions({ page = false }: { page?: boolean }) {
  const t = useT();
  const lang = useLang();
  const sec = t.missions;
  const earth = REGIONS.filter((r) => r.body === 'earth');
  const mars = REGIONS.find((r) => r.body === 'mars');
  const wide = useMediaQuery('(min-width: 641px)', true);
  const Sub = page ? 'h2' : 'h3';

  return (
    <section id="missions" className={`section ${page ? 'pageTop' : ''}`} aria-labelledby="missions-title">
      <div className="container">
        <SectionHeader
          id="missions-title"
          index={sec.index}
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
          as={page ? 'h1' : 'h2'}
        />

        {/* B16: 3B küre bu alanın yerini alır; harita yedek modda kalır. */}
        <div className={s.mapWrap} data-3d-slot="globe">
          <figure className={s.map}>
            <img src={mapUrl} alt={sec.mapAlt} width={1000} height={378} loading="lazy" />
            {/* Geniş ekranda pinler bağlantıdır; dar ekranda üst üste bindikleri için yalnız
                görsel işarettir ve gezinme aşağıdaki bölge listesinden yapılır. */}
            <ol className={s.pins} aria-hidden={wide ? undefined : true}>
              {earth.map((r) => {
                if (!r.geo) return null;
                const p = mapPosition(r.geo.lat, r.geo.lon);
                const marker = (
                  <>
                    <span className={s.pinDot} data-status={r.status} aria-hidden="true" />
                    <span className={`t-label ${s.pinLabel}`} aria-hidden="true">
                      {String(r.order).padStart(2, '0')}
                    </span>
                  </>
                );
                return (
                  <li key={r.id} className={s.pin} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                    {wide ? (
                      <a
                        href={`#mission-${r.id}`}
                        aria-label={`${String(r.order).padStart(2, '0')} ${sec.regions[r.id].name}`}
                      >
                        {marker}
                      </a>
                    ) : (
                      <span className={s.pinStatic}>{marker}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </figure>
          {mars?.geo && wide && (
            <a
              className={s.mars}
              href="#mission-mars"
              aria-label={`${String(mars.order).padStart(2, '0')} · MARS, ${sec.regions.mars.name}`}
            >
              <span className={s.marsDisc} aria-hidden="true">
                <span className={s.pinDot} data-status="dream" />
              </span>
              <span className="t-label">{String(mars.order).padStart(2, '0')} · MARS</span>
            </a>
          )}
          {!wide && (
            <ol className={s.chips}>
              {REGIONS.map((r) => (
                <li key={r.id}>
                  <a href={`#mission-${r.id}`} className="t-label">
                    <span className={s.pinDot} data-status={r.status} aria-hidden="true" />
                    {String(r.order).padStart(2, '0')} {sec.regions[r.id].name}
                  </a>
                </li>
              ))}
            </ol>
          )}
          <p className={`t-label ${s.legend}`}>
            <span>
              <span className={s.pinDot} data-status="competed" aria-hidden="true" /> {t.statuses.competed}
            </span>
            <span>
              <span className={s.pinDot} data-status="target" aria-hidden="true" /> {t.statuses.target}
            </span>
            <span>
              <span className={s.pinDot} data-status="dream" aria-hidden="true" /> {t.statuses.dream}
            </span>
          </p>
        </div>

        <ol className={s.list}>
          {REGIONS.map((r, i) => {
            const text = sec.regions[r.id];
            const poster = POSTERS[r.id];
            return (
              <li key={r.id} id={`mission-${r.id}`} className={`${s.row} ${i % 2 ? s.rowFlip : ''}`}>
                <div className={s.poster} data-3d-slot={`mission-${r.id}`} data-region={r.id}>
                  {poster ? (
                    <Picture name={poster} alt="" sizes="(min-width: 1024px) 55vw, 100vw" />
                  ) : (
                    <span className={s.topo} aria-hidden="true">
                      <span className={s.topoTarget} />
                      <span className={s.topoName}>{text.place}</span>
                      <span className={`t-label t-mono ${s.posterPlaceholder}`}>
                        {r.geo ? formatLatLon(r.geo.lat, r.geo.lon, lang) : text.place}
                      </span>
                    </span>
                  )}
                </div>
                <article className={s.body} aria-labelledby={`mission-${r.id}-title`}>
                  <div className={s.meta}>
                    <span className={`t-label ${s.order}`}>{String(r.order).padStart(2, '0')}</span>
                    <StatusBadge kind={r.status}>{t.statuses[r.status]}</StatusBadge>
                  </div>
                  <Sub id={`mission-${r.id}-title`} className="t-h3">
                    {text.name}
                  </Sub>
                  <p className={`t-label ${s.place}`}>
                    {text.place}
                    {r.geo && (
                      <span className="t-mono" lang="en">
                        {' · '}
                        {formatLatLon(r.geo.lat, r.geo.lon, lang)}
                      </span>
                    )}
                  </p>
                  <p className="t-body">{text.summary}</p>
                  <ol className={s.steps}>
                    {text.steps.map((step, k) => (
                      <li key={step}>
                        <span className="t-label">{String(k + 1).padStart(2, '0')}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
