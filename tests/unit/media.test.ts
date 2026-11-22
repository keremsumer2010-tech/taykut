import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '@/content/media.generated.json';

const DIR = 'public/media';
const files = readdirSync(DIR).filter((f) => /\.(avif|webp|jpg)$/.test(f));

describe('medya hattı çıktıları', () => {
  it('yayınlanan görsellerde EXIF/GPS meta verisi yok (gizlilik)', () => {
    const withExif = [...files, '../og-tr.jpg', '../og-en.jpg'].filter((f) => {
      const buf = readFileSync(join(DIR, f));
      return buf.includes('Exif') || buf.includes('GPSLatitude');
    });
    expect(withExif).toEqual([]);
  });

  it('manifestteki her genişlik için AVIF ve WebP dosyası var', () => {
    const missing: string[] = [];
    for (const [name, m] of Object.entries(manifest)) {
      if (name === '$comment' || typeof m === 'string') continue;
      for (const w of m.widths)
        for (const ext of ['avif', 'webp'])
          if (!files.includes(`${name}-${w}.${ext}`)) missing.push(`${name}-${w}.${ext}`);
    }
    expect(missing).toEqual([]);
  });

  it('mobil boyutlu görseller küçük (480 px AVIF ≤ 40 KB, 1200 px AVIF ≤ 160 KB)', () => {
    const big = files
      .filter((f) => f.endsWith('.avif'))
      .map((f) => ({ f, kb: statSync(join(DIR, f)).size / 1024, w: Number(f.match(/-(\d+)\.avif$/)?.[1]) }))
      .filter(({ w, kb }) => (w <= 480 && kb > 40) || (w <= 1200 && kb > 160));
    expect(big).toEqual([]);
  });
});

describe('LCP önyüklemesi', () => {
  it('HTML’deki hero preload srcset’i medya manifestiyle aynı', () => {
    const m = manifest['hero-regolit'];
    const expected = m.widths.map((w) => `/taykut/media/hero-regolit-${w}.avif ${w}w`).join(', ');
    for (const f of ['rover/index.html']) {
      expect(readFileSync(f, 'utf8')).toContain(`imagesrcset="${expected}"`);
    }
  });
});
