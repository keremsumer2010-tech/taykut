// Duyarlı görsel: AVIF → WebP yedeği, srcset + sizes, doğru en/boy (CLS 0), LQIP bulanık önizleme.
// Veriler tools/media/build_media.py çıktısı src/content/media.generated.json'dan gelir.
import type { CSSProperties } from 'react';
import manifest from '@/content/media.generated.json';

export type MediaName = Exclude<keyof typeof manifest, '$comment'>;

interface PictureProps {
  name: MediaName;
  alt: string;
  /** Düzene göre gerçekçi `sizes` (ör. "(min-width: 1024px) 50vw, 100vw"). */
  sizes: string;
  /** Ekranın ilk görünen alanındaki ana görsel: öncelikli ve tembel olmayan yükleme. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

const BASE = `${import.meta.env.BASE_URL}media/`;

export function mediaInfo(name: MediaName) {
  return manifest[name];
}

export function Picture({ name, alt, sizes, priority = false, className, style }: PictureProps) {
  const m = manifest[name];
  const set = (ext: 'avif' | 'webp') => m.widths.map((w) => `${BASE}${name}-${w}.${ext} ${w}w`).join(', ');
  const fallbackW = m.widths.find((w) => w >= 800) ?? m.widths[m.widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${BASE}${name}-${fallbackW}.webp`}
        alt={alt}
        width={m.width}
        height={m.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={className}
        style={{
          backgroundImage: `url("${m.lqip}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style,
        }}
      />
    </picture>
  );
}
