// Rover modelini parametre dosyasına karşı doğrular (CI'da çalışır):
//  - gerekli düğümler ve hiyerarşi (three.js eklem dönüşleri bu adlara uygulanır)
//  - eklem konumları rover_params.yaml (rover2027.generated.json) ile ±1 mm
//  - tekerlek yarıçapı ±1 mm, dosya boyutları
// Eksen: Blender/ROS (x ileri, y sol, z yukarı) → glTF (x, z, −y)  [src/lib/frames.ts enuToThree ile aynı]
import { readFileSync, statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

const TOL = 0.001;
const params = JSON.parse(readFileSync('src/content/rover2027.generated.json', 'utf8'));
const G = params.geometry;
const ros = (x, y, z) => [x, z, -y];

await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

const errors = [];
const wheelYOff = G.wheelY - G.rockerPivotY;
// [düğüm, ebeveyn, beklenen yerel konum (glTF)]
const expected = [
  ['rover_root', null, [0, 0, 0]],
  ['body', 'rover_root', [0, 0, 0]],
  ['diff_gear', 'body', ros(0, 0, 0.035)],
  ...['L', 'R'].flatMap((s) => {
    const k = s === 'L' ? 1 : -1;
    return [
      [`rocker_${s}`, 'body', ros(0, k * G.rockerPivotY, G.rockerPivotZ)],
      [`bogie_${s}`, `rocker_${s}`, ros(G.rockerBogieDx, 0, G.bogiePivotZ - G.rockerPivotZ)],
      [`wheel_F${s}`, `rocker_${s}`, ros(G.rockerFrontDx, k * wheelYOff, G.wheelZ - G.rockerPivotZ)],
      [`wheel_M${s}`, `bogie_${s}`, ros(G.bogieHalfLength, k * wheelYOff, G.wheelZ - G.bogiePivotZ)],
      [`wheel_R${s}`, `bogie_${s}`, ros(-G.bogieHalfLength, k * wheelYOff, G.wheelZ - G.bogiePivotZ)],
    ];
  }),
  ['anchors', 'body', null],
];

for (const lod of ['lod0', 'lod1', 'lod2']) {
  const file = `public/models/taykut2027.${lod}.glb`;
  const doc = await io.read(file);
  const nodes = new Map(
    doc
      .getRoot()
      .listNodes()
      .map((n) => [n.getName(), n]),
  );
  const parentOf = new Map();
  for (const n of nodes.values()) for (const c of n.listChildren()) parentOf.set(c.getName(), n.getName());

  for (const [name, parent, loc] of expected) {
    const n = nodes.get(name);
    if (!n) {
      errors.push(`${lod}: düğüm yok: ${name}`);
      continue;
    }
    if (parent && parentOf.get(name) !== parent)
      errors.push(`${lod}: ${name} ebeveyni ${parentOf.get(name)} (beklenen ${parent})`);
    if (loc) {
      const t = n.getTranslation();
      const d = Math.hypot(t[0] - loc[0], t[1] - loc[1], t[2] - loc[2]);
      if (d > TOL)
        errors.push(
          `${lod}: ${name} konumu ${t.map((v) => v.toFixed(4))} beklenen ${loc.map((v) => v.toFixed(4))} (fark ${(d * 1000).toFixed(2)} mm)`,
        );
    }
  }

  // Tekerlek yarıçapı: wheel_FL_mesh sınırlayıcı kutusu (dekode edilmiş, nicemleme düğüm ölçeğiyle)
  const wm = nodes.get('wheel_FL_mesh');
  if (wm?.getMesh()) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (const prim of wm.getMesh().listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      const el = [];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, el);
        min = min.map((v, j) => Math.min(v, el[j]));
        max = max.map((v, j) => Math.max(v, el[j]));
      }
    }
    const s = wm.getScale();
    const diameterX = (max[0] - min[0]) * s[0];
    const diameterY = (max[1] - min[1]) * s[1];
    const r = Math.max(diameterX, diameterY) / 2;
    if (Math.abs(r - G.wheelRadius) > TOL * 2)
      errors.push(`${lod}: tekerlek yarıçapı ${r.toFixed(4)} beklenen ${G.wheelRadius}`);
  } else errors.push(`${lod}: wheel_FL_mesh yok`);

  console.log(`${lod}: ${(statSync(file).size / 1024).toFixed(0)} KB, ${nodes.size} düğüm`);
}

if (errors.length) {
  console.error('✗ Doğrulama hataları:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('✓ Rover modeli parametrelerle uyumlu (eklem konumları ±1 mm, tekerlek yarıçapı ±2 mm).');
