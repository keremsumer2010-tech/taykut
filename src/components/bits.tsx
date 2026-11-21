// Küçük, durumsuz yapı taşları: rozet, etiket, istatistik, ayırıcı.
import type { ReactNode } from 'react';
import s from './bits.module.css';

export type StatusKind = 'competed' | 'target' | 'dream' | 'ok' | 'warn' | 'danger' | 'neutral';

/** Durum rozeti: bilgi yalnız renkle verilmez, her zaman metin içerir. */
export function StatusBadge({ kind, children }: { kind: StatusKind; children: ReactNode }) {
  return (
    <span className={`t-label ${s.badge} ${s[`badge_${kind}`] ?? ''}`}>
      <span className={s.badgeDot} aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * Teknoloji/özellik etiketi (ör. "OpenCV"). Etiketler büyük harfe çevrilir; Türkçe sayfada
 * "Pixhawk" → "PİXHAWK" olmaması için teknik adlar varsayılan olarak `lang="en"` taşır.
 * Türkçe bir etiket için `lang="tr"` ver.
 */
export function Tag({ children, lang = 'en' }: { children: ReactNode; lang?: string }) {
  return (
    <span lang={lang} className={`t-label ${s.tag}`}>
      {children}
    </span>
  );
}

/** Veri türü notu: "hesaplanan", "tahmin", "tasarım hedefi". Dürüstlük ilkesi için her sayının yanında. */
export function KindNote({ children }: { children: ReactNode }) {
  return <span className={`t-label ${s.kindNote}`}>{children}</span>;
}

interface StatProps {
  value: string;
  unit?: string;
  label: string;
  note?: string;
}

/** Statik istatistik (sayaç animasyonu B21'de eklenir). */
export function Stat({ value, unit, label, note }: StatProps) {
  return (
    <div className={s.stat}>
      <p className="t-data">
        {value}
        {unit && <span className="t-unit">{unit}</span>}
      </p>
      <p className={`t-small ${s.statLabel}`}>{label}</p>
      {note && <KindNote>{note}</KindNote>}
    </div>
  );
}

/** Köşe işaretli yatay ayırıcı. */
export function Divider() {
  return <hr className={s.divider} />;
}
