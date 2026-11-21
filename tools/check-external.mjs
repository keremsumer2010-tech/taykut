// Derleme çıktısında izin verilmeyen dış adreslere istek var mı? (gizlilik: harici font/CDN/takip yok)
// Bağlantılar (<a href>) serbesttir; denetlenen: src=, srcset, url(), import, fetch ile yüklenen kaynaklar.
// Kullanım: npm run build && npm run check:external
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const walk = (d) =>
  readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const files = walk(DIST).filter((f) => /\.(html|js|css)$/.test(f));

// Yükleme bağlamındaki dış adresler: src="http…", srcset, url(http…), @import, import("http…")
const LOADERS = [
  /\bsrc=["'](https?:\/\/[^"']+)/g,
  /\bsrcset=["'][^"']*(https?:\/\/[^\s"',]+)/g,
  /url\(\s*["']?(https?:\/\/[^)"']+)/g,
  /@import\s+["'](https?:\/\/[^"']+)/g,
  /\bimport\(\s*["'](https?:\/\/[^"']+)/g,
  /\bfetch\(\s*["'](https?:\/\/[^"']+)/g,
];

const bad = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const re of LOADERS) for (const m of text.matchAll(re)) bad.push(`${f}: ${m[1]}`);
}
if (bad.length) {
  console.error('✗ Dış kaynak yüklemesi bulundu:\n' + [...new Set(bad)].join('\n'));
  process.exit(1);
}
console.log(`✓ ${files.length} dosyada dış kaynak yüklemesi yok.`);
