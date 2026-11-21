import type { ReactNode } from 'react';
import s from './bits.module.css';

interface SectionHeaderProps {
  /** Bölüm numarası: "01" */
  index: string;
  /** Kicker: "ROVER" */
  kicker: string;
  /** Başlık (h2). Satır kırılımı için dizi verilebilir. */
  title: string | string[];
  id?: string;
  lead?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
}

/** NASA dokümanı hissi veren bölüm başlığı: `01 / ROVER` + büyük başlık. */
export function SectionHeader({ index, kicker, title, id, lead, as: Tag = 'h2' }: SectionHeaderProps) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <header className={s.sectionHeader}>
      <p className={`t-label ${s.kicker}`}>
        <span className={s.kickerIndex}>{index}</span>
        <span className={s.kickerSlash} aria-hidden="true">
          /
        </span>
        <span>{kicker}</span>
      </p>
      <Tag id={id} className={Tag === 'h1' ? 't-h1' : 't-h2'}>
        {lines.map((line, i) => (
          <span key={i} className={s.titleLine}>
            {line}
          </span>
        ))}
      </Tag>
      {lead && <p className="t-lead">{lead}</p>}
    </header>
  );
}
