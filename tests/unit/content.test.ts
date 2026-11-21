import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tr } from '@/content/tr';
import { en } from '@/content/en';
import { MRC2026, STATS, SUMMERTECH, TWIN_PROOF, type Fact } from '@/content/facts';
import { REGIONS } from '@/content/regions';
import { MEMBERS } from '@/content/team';
import { CONTACT } from '@/content/contact';
import rover2027 from '@/content/rover2027.generated.json';
import { formatFact, ordinal } from '@/lib/i18n';

type Tree = string | number | boolean | null | Tree[] | { [k: string]: Tree };

/** İki ağacın anahtar yapısını ve dizi uzunluklarını karşılaştırır, farkları yol olarak döner. */
function shapeDiff(a: Tree, b: Tree, path = ''): string[] {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return [`${path}: dizi uzunluğu ${a.length} ≠ ${b.length}`];
    return a.flatMap((x, i) => shapeDiff(x, b[i] as Tree, `${path}[${i}]`));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].flatMap((k) =>
      k in a && k in b
        ? shapeDiff(
            (a as Record<string, Tree>)[k] as Tree,
            (b as Record<string, Tree>)[k] as Tree,
            `${path}.${k}`,
          )
        : [`${path}.${k}: yalnız ${k in a ? 'tr' : 'en'} içinde`],
    );
  }
  return typeof a === typeof b ? [] : [`${path}: tür farklı`];
}

function strings(t: Tree, path = ''): [string, string][] {
  if (typeof t === 'string') return [[path, t]];
  if (Array.isArray(t)) return t.flatMap((x, i) => strings(x, `${path}[${i}]`));
  if (t && typeof t === 'object') return Object.entries(t).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe('içerik', () => {
  it('Türkçe ve İngilizce aynı yapıda (dizi uzunlukları dahil)', () => {
    expect(shapeDiff(tr as unknown as Tree, en as unknown as Tree)).toEqual([]);
  });

  it('boş metin yok', () => {
    for (const dict of [tr, en]) {
      const empty = strings(dict as unknown as Tree).filter(([, s]) => s.trim() === '');
      expect(empty).toEqual([]);
    }
  });

  it('yasak/abartılı ifadeler yok', () => {
    const banned = [
      /dünyanın en iyi/i,
      /devrim/i,
      /eşsiz/i,
      /NASA ile birlikte/i,
      /NASA onayl/i,
      /world'?s best/i,
      /revolutionary/i,
      /NASA[- ]approved/i,
    ];
    for (const dict of [tr, en]) {
      const hits = strings(dict as unknown as Tree).filter(([, s]) => banned.some((r) => r.test(s)));
      expect(hits).toEqual([]);
    }
  });

  it('takım: 7 üye, kaptan ilk sırada, Türkçe karakterler korunmuş', () => {
    expect(MEMBERS).toHaveLength(7);
    expect(MEMBERS[0]).toMatchObject({ name: 'Kerem Sümer', role: 'captain' });
    expect(MEMBERS.map((m) => m.name)).toContain('İbrahim Enes Yeşil');
  });

  it('her kaynak anahtarı ICERIK_KAYNAKLARI.md içinde var', () => {
    const doc = readFileSync('docs/ICERIK_KAYNAKLARI.md', 'utf8');
    const facts: Fact[] = [
      ...Object.values(STATS),
      ...Object.values(SUMMERTECH),
      ...Object.values(TWIN_PROOF),
    ];
    const keys = new Set([
      ...facts.map((f) => f.source),
      ...REGIONS.map((r) => r.source),
      rover2027.wheelCount.source,
    ]);
    const missing = [...keys].filter((k) => !doc.includes(`\`${k}\``));
    expect(missing).toEqual([]);
  });

  it('bölgeler: 6 tane, sıra benzersiz, MRC 2026 konumu uydurulmamış', () => {
    expect(REGIONS).toHaveLength(6);
    expect(new Set(REGIONS.map((r) => r.order)).size).toBe(6);
    expect(REGIONS.find((r) => r.id === 'mrc2026')?.geo).toBeNull();
  });

  it('yer tutucular raporlanır (B23 öncesi sıfırlanmalı)', () => {
    const placeholders = [CONTACT.email].filter((v) => v.startsWith('TODO_'));
    // Başarısız saymaz; listeyi görünür kılar.
    console.info('Açık yer tutucular:', placeholders);
    expect(Array.isArray(placeholders)).toBe(true);
  });

  it('MRC video bağlantısı geçerli bir YouTube adresi', () => {
    expect(MRC2026.videoUrl).toMatch(/^https:\/\/(youtu\.be|www\.youtube\.com)\//);
  });
});

describe('biçimleme', () => {
  it('sıra sayıları', () => {
    expect(ordinal(4, 'tr')).toBe('4.');
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map((n) => ordinal(n, 'en'))).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '101st',
    ]);
  });

  it('Türkçede ondalık virgül, birim çevirisi', () => {
    expect(formatFact(STATS.speed, 'tr')).toEqual({ value: '0,58', unit: 'm/s' });
    expect(formatFact(STATS.speed, 'en')).toEqual({ value: '0.58', unit: 'm/s' });
    expect(formatFact(STATS.runtime, 'tr')).toEqual({ value: '~35', unit: 'dk' });
    expect(formatFact(STATS.runtime, 'en')).toEqual({ value: '~35', unit: 'min' });
    expect(formatFact(STATS.finalRank, 'en')).toEqual({ value: '4th' });
  });
});
