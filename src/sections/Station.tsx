import { useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { Icon } from '@/components/Icon';
import { useT } from '@/lib/i18n';
import posterImg from '@/assets/photos/yer-istasyonu.webp';
import s from './sections.module.css';

const VIDEO = `${import.meta.env.BASE_URL}media/yer-istasyonu.mp4`;

export function Station() {
  const t = useT();
  const sec = t.station;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hareket azaltma tercihinde video otomatik oynamaz; poster görünür.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) v.removeAttribute('autoplay');
    else void v.play().catch(() => undefined);
  }, []);

  return (
    <section id="station" className={`section ${s.band}`} aria-labelledby="station-title">
      <div className="container grid">
        <div className={`span-5 ${s.stationCopy}`}>
          <SectionHeader
            id="station-title"
            index={sec.index}
            kicker={sec.kicker}
            title={sec.title}
            lead={sec.lead}
          />
          <ul className={s.features}>
            {sec.features.map((f) => (
              <li key={f}>
                <Icon name="check" size={18} />
                {f}
              </li>
            ))}
          </ul>
          <p className={`t-small ${s.honesty}`}>{sec.honesty}</p>
        </div>
        <figure className={`${s.stationMedia}`}>
          <video
            ref={videoRef}
            src={VIDEO}
            poster={posterImg}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-label={sec.videoAlt}
            width={1280}
            height={898}
          />
        </figure>
      </div>
    </section>
  );
}
