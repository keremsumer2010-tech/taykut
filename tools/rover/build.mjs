// Rover modeli boru hattı: Blender montaj → meshopt → doğrulama.
// Kullanım: npm run assets:rover [-- --render]
// Kaynak parçalar dijital ikiz deposunda (depo dışı); yol TAYKUT_IKIZ_MESHES ile değiştirilebilir.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const BLENDER = process.env.BLENDER ?? 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe';
const MESHES =
  process.env.TAYKUT_IKIZ_MESHES ?? '../Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/meshes';

for (const [what, p] of [
  ['Blender', BLENDER],
  ['İkiz parçaları', MESHES],
]) {
  if (!existsSync(p)) {
    console.error(`✗ ${what} bulunamadı: ${p}`);
    process.exit(1);
  }
}
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
run(BLENDER, [
  '-b',
  '--factory-startup',
  '--python',
  'tools/rover/build_rover.py',
  '--',
  MESHES,
  'src/content/rover2027.generated.json',
  'tools/.cache/rover',
  ...process.argv.slice(2),
]);
run('node', ['tools/rover/optimize.mjs']);
run('node', ['tools/rover/validate.mjs']);
