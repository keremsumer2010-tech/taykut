import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { sectionHref } from '@/lib/links';
import s from './pages.module.css';

/** Alt sayfa başlığı: ana sayfaya dönüş + büyük başlık + giriş metni. */
export function PageHeader({ kicker, title, lead }: { kicker: string; title: string; lead: ReactNode }) {
  return (
    <header className={`container ${s.header}`}>
      <a href={sectionHref('top')} className={`t-label ${s.back}`}>
        <Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }} />
        TAYKUT
      </a>
      <p className={`t-label ${s.kicker}`}>{kicker}</p>
      <h1 className="t-display">{title}</h1>
      <p className="t-lead">{lead}</p>
    </header>
  );
}
