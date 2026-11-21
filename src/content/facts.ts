// Dilden bağımsız, kaynaklı gerçekler. Her değerin `source` anahtarı docs/ICERIK_KAYNAKLARI.md
// içindeki satıra karşılık gelir; `kind` arayüzde sayının yanında not olarak görünür.
import type { Kind, StatId } from './schema';

export interface Fact {
  value: string;
  unit?: string;
  kind: Kind;
  source: string;
}

/** Ana sayfa "Rakamlar" bölümü. Etiket metinleri tr.ts/en.ts → stats.items. */
export const STATS: Record<StatId, Fact> = {
  videoRank: { value: '1', unit: 'ordinal', kind: 'result', source: 'mrc2026-video' },
  finalRank: { value: '4', unit: 'ordinal', kind: 'result', source: 'mrc2026-final' },
  envelope: { value: '45×45', unit: 'cm', kind: 'measured', source: 'st-envelope' },
  runtime: { value: '~35', unit: 'min', kind: 'calculated', source: 'st-energy' },
  speed: { value: '0.58', unit: 'm/s', kind: 'estimate', source: 'st-speed' },
  brains: { value: '3', kind: 'measured', source: 'st-brains' },
};

/** SummerTech (MRC 2026) teknik özellikleri: /rover sayfası ve 3D etiketler. */
export const SUMMERTECH = {
  envelopeCm: { value: '45 × 45', unit: 'cm', kind: 'measured', source: 'st-envelope' },
  wheels: { value: '4', kind: 'measured', source: 'st-drive' },
  wheelDiameterCm: { value: '10', unit: 'cm', kind: 'measured', source: 'st-wheel' },
  motors: { value: '4× Namiki 22CL-3501PG (80:1)', kind: 'measured', source: 'st-drive' },
  speed: { value: '≈ 0.58', unit: 'm/s', kind: 'estimate', source: 'st-speed' },
  runtime: { value: '~35', unit: 'min', kind: 'calculated', source: 'st-energy' },
  range: { value: '~1200', unit: 'm', kind: 'calculated', source: 'st-energy' },
  battery: { value: '3S Li-ion 5600 mAh', kind: 'measured', source: 'st-energy' },
  averageCurrent: { value: '8.05', unit: 'A', kind: 'calculated', source: 'st-energy' },
} satisfies Record<string, Fact>;

/** Dijital ikizden ölçülen kanıt: diferansiyel iki rocker'ı eşit ve ters tutuyor. */
export const TWIN_PROOF = {
  rockerLeftDeg: { value: '−18.01', unit: '°', kind: 'simulated', source: 'twin-diff' },
  rockerRightDeg: { value: '+18.08', unit: '°', kind: 'simulated', source: 'twin-diff' },
  mismatchDeg: { value: '0.065', unit: '°', kind: 'simulated', source: 'twin-diff' },
} satisfies Record<string, Fact>;

export const MRC2026 = {
  videoUrl: 'https://youtu.be/8WRZX9VwTyw',
  finalDates: '29.07–01.08.2026',
};

export const CIRC2027 = {
  dates: '06–09.08.2027',
  place: 'Drumheller, Alberta',
};
