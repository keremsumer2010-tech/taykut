import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';
import type { SectionId } from '@/lib/links';
import s from './layout.module.css';

/** Sağ kenarda bölüm göstergesi (≥ 1280 px). Etkin bölüm IntersectionObserver ile bulunur. */
export function ProgressRail() {
  const t = useT();
  const items: { id: SectionId; label: string }[] = [
    { id: 'rover', label: t.inspect.kicker },
    { id: 'missions', label: t.missions.kicker },
    { id: 'numbers', label: t.stats.kicker },
    { id: 'engineering', label: t.engineering.kicker },
    { id: 'station', label: t.station.kicker },
    { id: 'journey', label: t.journey.kicker },
    { id: 'team', label: t.team.kicker },
    { id: 'sponsor', label: t.sponsor.kicker },
  ];
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // Ekranın ortasından geçen bölüm etkindir.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // Bölüm kimlikleri sabit; dil değişince yeniden gözlemlemeye gerek yok.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className={s.rail} aria-label="Bölümler">
      {items.map((i, n) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className={`${s.railItem} ${active === i.id ? s.railActive : ''}`}
          aria-current={active === i.id ? 'true' : undefined}
        >
          <span className={`t-label ${s.railLabel}`}>
            {String(n + 1).padStart(2, '0')} {i.label}
          </span>
          <span className={s.railTick} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
