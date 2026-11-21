import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Bileşenlerde kullanılan her `span-N` ızgara sınıfı grid.css'te tanımlı olmalı.
// (Tanımsız sınıf mobilde sütunu 1/12 genişliğe düşürüyordu: B03 mükemmellik turu bulgusu.)
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('ızgara sınıfları', () => {
  it('kullanılan tüm span-N sınıfları grid.css içinde tanımlı', () => {
    const css = readFileSync('src/styles/grid.css', 'utf8');
    const used = new Set(
      walk('src')
        .filter((f) => f.endsWith('.tsx'))
        .flatMap((f) => readFileSync(f, 'utf8').match(/\bspan-\d+\b/g) ?? []),
    );
    const missing = [...used].filter((c) => !new RegExp(`\\.${c}\\b`).test(css));
    expect(missing).toEqual([]);
  });
});
