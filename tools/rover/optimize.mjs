// Rover GLB'lerini web için küçültür: dedup → prune → weld → quantize → meshopt sıkıştırma.
// three.js tarafında MeshoptDecoder gerekir (src/scene/assets.ts, B09).
// Kullanım: node tools/rover/optimize.mjs   (girdi tools/.cache/rover/*.raw.glb, çıktı public/models/)
import { mkdirSync, statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, quantize, weld } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const IN = 'tools/.cache/rover';
const OUT = 'public/models';
const NAME = process.argv[2] ?? 'taykut2027';
const LIMITS_KB = { lod0: 4096, lod1: 1228, lod2: 307 }; // anayasa / B07 sınırları

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

mkdirSync(OUT, { recursive: true });
let failed = false;
for (const lod of ['lod0', 'lod1', 'lod2']) {
  const src = `${IN}/${NAME}.${lod}.raw.glb`;
  const dst = `${OUT}/${NAME}.${lod}.glb`;
  const doc = await io.read(src);
  await doc.transform(
    dedup(),
    prune({ keepLeaves: true }), // boş eklem/çapa düğümleri korunur (hiyerarşi şart)
    weld(),
    quantize({ quantizePosition: 14, quantizeNormal: 10 }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  doc.createExtension(EXTMeshoptCompression).setRequired(true);
  await io.write(dst, doc);
  const kb = statSync(dst).size / 1024;
  const rawKb = statSync(src).size / 1024;
  const ok = kb <= LIMITS_KB[lod];
  if (!ok) failed = true;
  console.log(
    `${ok ? '✓' : '✗'} ${dst}: ${rawKb.toFixed(0)} KB → ${kb.toFixed(0)} KB (sınır ${LIMITS_KB[lod]} KB)`,
  );
}
if (failed) process.exit(1);
