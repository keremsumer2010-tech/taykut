// TAYKUT renk ölçeklerini OKLCH'de algısal olarak eşit adımlarla üretir ve
// src/styles/palette.css dosyasını yazar. Kaynak renkler ölçüldü (bkz. docs/TASARIM.md):
//   logo laciverti #01234A, logo turuncusu #D15B09, TPU tekerlek sarısı #E7AD01.
// Kullanım: node tools/design/palette.mjs
import { writeFileSync } from 'node:fs';
import { hexToRgb, oklchToRgb, rgbToHex, rgbToOklch } from './color.mjs';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
// Açıklık (L) eğrisi: koyu temada kullanılacak geniş aralık.
const LIGHTNESS = [0.975, 0.94, 0.87, 0.78, 0.69, 0.6, 0.5, 0.41, 0.31, 0.22, 0.155];

const SOURCES = {
  // Nötr: lacivert tonunda çok düşük kroma -> "soğuk siyah" gri ailesi.
  neutral: { hex: '#01234A', chroma: 0.012, pin: false },
  navy: { hex: '#01234A', pin: true },
  orange: { hex: '#D15B09', pin: true },
  yellow: { hex: '#E7AD01', pin: true },
  // Durum renkleri (yalnız durum bildirimi için).
  green: { hex: '#2FBF71', pin: true },
  red: { hex: '#E5484D', pin: true },
};

function scale({ hex, chroma, pin }) {
  const [L0, C0, H] = rgbToOklch(hexToRgb(hex));
  // Kaynak rengi, açıklığı en yakın adıma birebir sabitle (marka rengi bozulmaz).
  const pinIndex = pin
    ? LIGHTNESS.reduce((best, L, i) => (Math.abs(L - L0) < Math.abs(LIGHTNESS[best] - L0) ? i : best), 0)
    : -1;
  return STEPS.map((step, i) => {
    if (i === pinIndex) return [step, hex.toUpperCase()];
    const L = LIGHTNESS[i];
    // Kroma ortada en yüksek, uçlarda azalır.
    const C = chroma ?? C0 * Math.max(0.25, 1 - Math.abs(L - L0) * 1.6);
    return [step, rgbToHex(oklchToRgb([L, C, H]))];
  });
}

const out = {};
let css = '/* OTOMATİK ÜRETİLDİ: node tools/design/palette.mjs — elle düzenleme. */\n:root {\n';
for (const [name, src] of Object.entries(SOURCES)) {
  out[name] = Object.fromEntries(scale(src));
  for (const [step, hex] of Object.entries(out[name])) css += `  --${name}-${step}: ${hex};\n`;
  css += '\n';
}
css = css.trimEnd() + '\n}\n';

writeFileSync('src/styles/palette.css', css);
writeFileSync('tools/design/palette.json', JSON.stringify(out, null, 2) + '\n');
console.log('✓ src/styles/palette.css ve tools/design/palette.json yazıldı.');
for (const [name, s] of Object.entries(out)) console.log(name.padEnd(8), Object.values(s).join(' '));
