import type { HTMLAttributes, ReactNode } from 'react';
import s from './HudFrame.module.css';

interface HudFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Üst şerit başlığı (mono, büyük harf). */
  title?: ReactNode;
  /** Üst şeridin sağ tarafı (ör. durum, saat). */
  meta?: ReactNode;
  /** Yarı saydam zemin (3D üstünde HUD için). */
  translucent?: boolean;
  /** Köşe işaretleri sinyal sarısı. */
  accent?: boolean;
  /** İç boşluğu kaldır (içerik kendi düzenini kurar). */
  flush?: boolean;
}

export function HudFrame({
  title,
  meta,
  translucent,
  accent,
  flush,
  className,
  children,
  ...rest
}: HudFrameProps) {
  const cls = [s.frame, translucent ? s.translucent : '', accent ? s.accent : '', className ?? '']
    .join(' ')
    .trim();
  return (
    <div className={cls} {...rest}>
      {(title || meta) && (
        <div className={s.header}>
          <span className="t-label">{title}</span>
          {meta && <span className="t-label t-mono">{meta}</span>}
        </div>
      )}
      {flush ? children : <div className={s.body}>{children}</div>}
    </div>
  );
}
