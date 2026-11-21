// Git'e eklenen (izlenen veya eklenmek üzere olan) dosyalarda 15 MB üstünü yakalar.
// GitHub Pages ve depo sağlığı için. Kullanım: npm run check:size
import { execSync } from 'node:child_process';
import { statSync, existsSync } from 'node:fs';

const LIMIT_MB = 15;
const files = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => existsSync(f));

const big = files.map((f) => ({ f, mb: statSync(f).size / 1024 / 1024 })).filter(({ mb }) => mb > LIMIT_MB);

if (big.length) {
  for (const { f, mb } of big) console.error(`✗ ${f}: ${mb.toFixed(1)} MB (sınır ${LIMIT_MB} MB)`);
  process.exit(1);
}
console.log(`✓ ${files.length} dosya kontrol edildi, hepsi ${LIMIT_MB} MB altında.`);
