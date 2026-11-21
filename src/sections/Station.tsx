import { useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { Icon } from '@/components/Icon';
import { useT } from '@/lib/i18n';
import s from './sections.module.css';

const VIDEO = `${import.meta.env.BASE_URL}media/yer-istasyonu.mp4`;
const POSTER = `${import.meta.env.BASE_URL}media/yer-istasyonu-1280.webp`;

export function Station({ page = false }: { page?: boolean }) {
  const t = useT();
  const sec = t.station;
  const videoRef = useRef<HTMLVideoElement>(null);

  // HTML'de autoplay YOK: önceden üretilen sayfada tarayıcı JS gelmeden oynatmaya başlıyordu.
  // Oynatma yalnız burada, hareket azaltma kapalıysa ve video ekrana girince başlar.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section id="station" className={`section ${page ? 'pageTop' : s.band}`} aria-labelledby="station-title">
      <div className="container grid">
        <div className={`span-5 ${s.stationCopy}`}>
          <SectionHeader
            as={page ? 'h1' : 'h2'}
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
            poster={POSTER}
            muted
            loop
            playsInline
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
