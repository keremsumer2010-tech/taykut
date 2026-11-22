import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { formatLatLon } from '@/lib/geofmt';
import { useLang, useT } from '@/lib/i18n';
import { pageHref } from '@/lib/links';
import { BASE } from '@/lib/route';
import type { Telemetry } from '@/scene/crater/CraterScene';
import s from './Stage.module.css';

const CRATER = { lat: 35.0274, lon: -111.0228 };

/** ?t=0.55 → sahneyi döngünün o anında dondurur (inceleme ve görsel testler). */
function fixedT(): number | undefined {
  const v = Number(new URLSearchParams(location.search).get('t'));
  return Number.isFinite(v) && v > 0 && v < 1 ? v : undefined;
}

/** Ana sayfa: tam ekran sinematik sahne. Meteor Krateri (gerçek arazi) kenarında TAYKUT 2027 rover'ı.
 *  three.js ve sahne, sayfa çizildikten sonra dinamik import ile yüklenir; HTML önceden üretilir. */
export function Stage() {
  const t = useT();
  const lang = useLang();
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<{ setPlaying: (p: boolean) => void; dispose: () => void } | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'still' | 'failed'>('idle');
  const [tel, setTel] = useState<Telemetry | null>(null);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    // İlk boyama ve etkileşim önce gelsin; sahne boşta kalınca kurulur.
    const idle = (cb: () => void) =>
      'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 300);
    idle(() => {
      if (cancelled) return;
      const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
      if (!gl) {
        setState('failed');
        return;
      }
      // GPU yoksa (yazılımsal WebGL) sürekli döngü sayfayı kilitler: tek kare çizilir, animasyon oynamaz.
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      // GPU yoksa 3B kurulumu saniyelerce sürer ve sayfayı kilitler: sahnenin önceden alınmış karesi (poster) kalır.
      // ?force3d: poster üretimi ve inceleme için zorla.
      const force = new URLSearchParams(location.search).has('force3d');
      if (software && !force) {
        setState('still');
        return;
      }
      const still = rm;
      setReduced(still);
      setState('loading');
      import('@/scene/crater/CraterScene')
        .then(({ startCraterScene }) =>
          startCraterScene(el, {
            base: BASE,
            reducedMotion: still,
            onTelemetry: setTel,
            fixedT: fixedT(),
          }),
        )
        .then((c) => {
          if (cancelled) c.dispose();
          else {
            ctrl.current = c;
            setState('ready');
          }
        })
        .catch(() => !cancelled && setState('failed'));
    });
    return () => {
      cancelled = true;
      ctrl.current?.dispose();
      ctrl.current = null;
    };
  }, []);

  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    ctrl.current?.setPlaying(next);
  };

  const sc = t.scene;
  const fmt = (v: number, d = 1) =>
    v.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  const shot = tel ? tel.shot : 0;

  return (
    <section className={s.stage} aria-labelledby="stage-title" data-state={state}>
      {/* Poster: sahnenin önceden alınmış karesi. 3B hazır olana kadar ve GPU'suz cihazlarda görünür. */}
      <picture className={s.poster}>
        <source
          media="(max-width: 860px)"
          srcSet={`${BASE}media/stage-poster-mobile.webp`}
          type="image/webp"
        />
        <img src={`${BASE}media/stage-poster.webp`} alt="" width={1600} height={956} fetchPriority="high" />
      </picture>
      <div ref={host} className={s.canvas} />
      <div className={s.shade} aria-hidden="true" />

      <div className={`container ${s.copy}`}>
        <p className={`t-label ${s.kicker}`}>{t.hero.kicker}</p>
        <h1 id="stage-title" className={s.title}>
          {t.hero.title}
        </h1>
        <p className={s.tagline}>
          {t.hero.tagline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div className={s.ctas}>
          <Button href={pageHref('rover')} icon="arrow-right">
            {t.pages.rover.title}
          </Button>
          <Button href={pageHref('gorevler')} variant="secondary">
            {t.nav.missions}
          </Button>
        </div>
      </div>

      <aside className={s.hud} aria-label={`${sc.location}, ${sc.region}`}>
        <div className={s.hudHead}>
          <span className={s.dot} aria-hidden="true" />
          <span className="t-label">{sc.location}</span>
          <span className={`t-mono ${s.muted}`}>{sc.region}</span>
        </div>
        <p className={`t-mono ${s.coords}`}>{formatLatLon(CRATER.lat, CRATER.lon, lang, 4)}</p>
        {state === 'ready' && tel && (
          <>
            <p className={`t-mono ${s.shot}`} aria-hidden="true">
              <span>{String(shot + 1).padStart(2, '0')}</span> / 06 · {sc.shots[shot]}
            </p>
            <dl className={s.tel} aria-hidden="true">
              <div>
                <dt>{sc.telemetry.pitch}</dt>
                <dd>{fmt(tel.pitchDeg)}°</dd>
              </div>
              <div>
                <dt>{sc.telemetry.roll}</dt>
                <dd>{fmt(tel.rollDeg)}°</dd>
              </div>
              <div>
                <dt>{sc.telemetry.rocker}</dt>
                <dd>{fmt(tel.rockerDeg)}°</dd>
              </div>
              <div>
                <dt>{sc.telemetry.bogie}</dt>
                <dd>{fmt(tel.bogieDeg)}°</dd>
              </div>
              <div>
                <dt>{sc.telemetry.speed}</dt>
                <dd>
                  {fmt(tel.speed, 2)} <span className={s.unit}>m/s</span>
                </dd>
              </div>
              <div>
                <dt>{sc.telemetry.dist}</dt>
                <dd>
                  {fmt(tel.dist)} <span className={s.unit}>m</span>
                </dd>
              </div>
            </dl>
          </>
        )}
        {state === 'loading' && <p className={`t-mono ${s.muted}`}>{sc.loading}…</p>}
        {state === 'failed' && <p className={`t-mono ${s.muted}`}>{sc.fallback}</p>}
        <p className={s.note}>{sc.dataNote}</p>
        {state === 'ready' && !reduced && (
          <button type="button" className={s.play} onClick={toggle} aria-pressed={!playing}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
            <span>{playing ? sc.pause : sc.play}</span>
          </button>
        )}
      </aside>
    </section>
  );
}
