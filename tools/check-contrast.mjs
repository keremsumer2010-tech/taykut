// tokens.css + palette.css içindeki anlamsal renk çiftlerinin WCAG 2.2 kontrastını denetler.
// Kullanım: npm run check:contrast
import { readFileSync } from 'node:fs';
import { contrast } from './design/color.mjs';

const css = readFileSync('src/styles/palette.css', 'utf8') + readFileSync('src/styles/tokens.css', 'utf8');
const vars = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

function resolve(name, depth = 0) {
  const v = vars[name];
  if (!v) throw new Error(`Belirteç yok: --${name}`);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  if (ref) return resolve(ref[1], depth + 1);
  if (!/^#[0-9a-f]{6}$/i.test(v)) throw new Error(`--${name} düz hex değil: ${v}`);
  return v;
}

// [ön plan, arka plan, en az oran, açıklama]
const TEXT = 4.5; // gövde metni
const LARGE = 3; // büyük metin (≥ 24 px veya ≥ 18.66 px kalın) ve arayüz bileşenleri
const pairs = [
  ['text', 'bg', TEXT, 'Gövde metni'],
  ['text', 'surface-1', TEXT, 'Kart metni'],
  ['text', 'surface-2', TEXT, 'Panel metni'],
  ['text', 'surface-3', TEXT, 'Seçili alan metni'],
  ['text-2', 'bg', TEXT, 'İkincil metin'],
  ['text-2', 'surface-1', TEXT, 'İkincil metin (kart)'],
  ['text-2', 'surface-2', TEXT, 'İkincil metin (panel)'],
  ['text-3', 'bg', LARGE, 'Üçüncül metin (birim, not; yalnız büyük/süsleme)'],
  ['text-3', 'surface-1', LARGE, 'Üçüncül metin (kart)'],
  ['accent', 'bg', TEXT, 'Turuncu metin/link'],
  ['accent', 'surface-1', TEXT, 'Turuncu metin (kart)'],
  ['accent-contrast', 'accent', TEXT, 'Birincil düğme metni'],
  ['accent-contrast', 'accent-hover', TEXT, 'Birincil düğme metni (hover)'],
  ['signal', 'bg', TEXT, 'HUD değeri / veri vurgusu'],
  ['signal', 'surface-1', TEXT, 'HUD değeri (panel)'],
  ['ok', 'bg', TEXT, 'Durum: başarılı'],
  ['warn', 'bg', TEXT, 'Durum: uyarı'],
  ['danger', 'bg', TEXT, 'Durum: hata'],
  ['line-strong', 'bg', LARGE, 'Vurgulu çizgi / köşe işareti (arayüz)'],
  ['focus-ring', 'bg', LARGE, 'Odak halkası'],
  ['focus-ring', 'surface-2', LARGE, 'Odak halkası (panel)'],
];

let failed = 0;
const rows = pairs.map(([fg, bg, min, label]) => {
  const ratio = contrast(resolve(fg), resolve(bg));
  const ok = ratio >= min;
  if (!ok) failed++;
  return {
    çift: `${fg} / ${bg}`,
    oran: ratio.toFixed(2),
    'en az': min,
    durum: ok ? '✓' : '✗',
    açıklama: label,
  };
});
console.table(rows);
if (failed) {
  console.error(`✗ ${failed} çift kontrast şartını karşılamıyor.`);
  process.exit(1);
}
console.log(`✓ ${pairs.length} çiftin tamamı geçti.`);
