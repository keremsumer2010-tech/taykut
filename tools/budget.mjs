// Derleme çıktısının boyut bütçesini denetler (anayasa: performance_budget).
// "İlk yük" = dist/index.html'in doğrudan yüklediği JS/CSS + modulepreload'lar + HTML'in kendisi.
// Kullanım: npm run build && npm run budget
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BASE = '/taykut/';
const config = JSON.parse(readFileSync('budget.config.json', 'utf8'));

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html yok. Önce `npm run build` çalıştır.');
  process.exit(1);
}

const kb = (n) => n / 1024;
const gz = (buf) => gzipSync(buf, { level: 9 }).length;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// index.html'in ilk yüklediği varlıklar
const html = readFileSync(join(DIST, 'index.html'));
const refs = [...html.toString().matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const initialFiles = [...new Set(refs)]
  .filter((r) => r.startsWith(BASE))
  .map((r) => join(DIST, r.slice(BASE.length)));

let initialGzip = gz(html);
const rows = [['index.html', kb(html.length), kb(gz(html))]];
for (const f of initialFiles) {
  const buf = readFileSync(f);
  const g = gz(buf);
  initialGzip += g;
  rows.push([relative(DIST, f), kb(buf.length), kb(g)]);
}

console.log('\nİlk yük (index.html ve doğrudan bağlı JS/CSS):');
console.table(rows.map(([f, raw, g]) => ({ dosya: f, 'ham KB': raw.toFixed(1), 'gzip KB': g.toFixed(1) })));
console.log(`Toplam ilk yük (gzip): ${kb(initialGzip).toFixed(1)} KB / sınır ${config.initialGzipKB} KB`);

let failed = false;
if (kb(initialGzip) > config.initialGzipKB) {
  console.error(`✗ İlk yük bütçesi aşıldı.`);
  failed = true;
}

// Font yükü (woff2 dosyalarının toplamı; zaten sıkıştırılmış, gzip uygulanmaz)
const fonts = walk(DIST).filter((f) => f.endsWith('.woff2'));
const fontKB = kb(fonts.reduce((sum, f) => sum + statSync(f).size, 0));
console.log(`Fontlar: ${fonts.length} dosya, ${fontKB.toFixed(1)} KB / sınır ${config.fontsKB} KB`);
if (fontKB > config.fontsKB) {
  console.error('✗ Font bütçesi aşıldı.');
  failed = true;
}

// Tek dosya boyutu
const big = walk(DIST).filter((f) => kb(statSync(f).size) > config.maxSingleFileKB);
for (const f of big) {
  console.error(`✗ Çok büyük dosya: ${relative(DIST, f)} (${(kb(statSync(f).size) / 1024).toFixed(1)} MB)`);
  failed = true;
}

const total = walk(DIST).reduce((s, f) => s + statSync(f).size, 0);
console.log(`dist toplam: ${(kb(total) / 1024).toFixed(2)} MB`);

if (failed) process.exit(1);
console.log('✓ Bütçe içinde.');
