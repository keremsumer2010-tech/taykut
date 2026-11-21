// Rover modeli ↔ kinematik çözücü uyum denetimi (geliştirme aracı).
// Model, solvePose çıktısıyla sürülür; her tekerlek düğümünün dünya konumu çözücünün tekerlek merkeziyle
// karşılaştırılır. Fark ≤ 1 mm olmalı: eksen eşlemesi, dönüş işaretleri ve pivotlar ancak böyle doğrulanır.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Heightfield } from '@/lib/heightfield';
import { enuToThree, type Vec3 } from '@/lib/frames';
import { rover2027Geometry } from '@/scene/rover/geometry';
import { solvePose, type RoverPose } from '@/scene/rover/kinematics';

const g = rover2027Geometry();
const tan = (d: number) => Math.tan((d * Math.PI) / 180);
const SCENARIOS: Record<string, { fn: (x: number, y: number) => number; yaw?: number }> = {
  'düz zemin': { fn: () => 0 },
  'sol ön 10 cm basamak': { fn: (x, y) => (x > 0.3 && x < 0.62 && y > 0.2 ? 0.1 : 0) },
  'sol 45 cm basamak': { fn: (x, y) => (x > 0.3 && x < 1.5 && y > 0.2 ? 0.45 : 0) },
  '15° yokuş': { fn: (x) => x * tan(15) },
  '12° yan eğim + 30° yön': { fn: (_x, y) => y * tan(12), yaw: (30 * Math.PI) / 180 },
  'sağ orta teker altında kaya': {
    fn: (x, y) => Math.max(0, 0.16 - Math.hypot(x - 0.0, y + 0.42) * 0.9),
  },
  engebeli: {
    fn: (x, y) => 0.06 * Math.sin(x * 3.1) * Math.cos(y * 2.3) + 0.04 * Math.sin(x * 7.3 + y * 5.1),
  },
};

const out = document.getElementById('out')!;
const scenarioSel = document.getElementById('scenario') as HTMLSelectElement;
const lodSel = document.getElementById('lod') as HTMLSelectElement;
for (const k of Object.keys(SCENARIOS)) scenarioSel.add(new Option(k));
const params = new URLSearchParams(location.search);
if (params.get('s')) scenarioSel.value = params.get('s')!;
if (params.get('lod')) lodSel.value = params.get('lod')!;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090c);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.6;
const sun = new THREE.DirectionalLight(0xfff4e0, 2.4);
sun.position.set(2.5, 4, 1.5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 12 });
sun.shadow.bias = -0.0004;
scene.add(sun);

const camera = new THREE.PerspectiveCamera(35, 1, 0.02, 50);
camera.position.set(
  ...((params.get('cam')?.split(',').map(Number) ?? [1.9, 1.05, 2.1]) as [number, number, number]),
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.25, 0);
controls.update();

// İnsan ölçeği referansı: 1,75 m çubuk (ölçeğin gözle denetimi)
const human = new THREE.Mesh(
  new THREE.CylinderGeometry(0.02, 0.02, 1.75, 8),
  new THREE.MeshStandardMaterial({ color: 0x5f646a }),
);
human.position.set(-0.4, 0.875, -1.1);
scene.add(human);

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
let rover: THREE.Object3D | null = null;
let terrain: THREE.Mesh | null = null;

function buildTerrain(fn: (x: number, y: number) => number) {
  if (terrain) scene.remove(terrain);
  const size = 4;
  const n = 401;
  const geo = new THREE.PlaneGeometry(size, size, n - 1, n - 1);
  geo.rotateX(-Math.PI / 2); // düzlem three XZ'de; (x, z) → ENU (x, −z)
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) pos.setY(i, fn(pos.getX(i), -pos.getZ(i)));
  geo.computeVertexNormals();
  terrain = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.95, flatShading: false }),
  );
  terrain.receiveShadow = true;
  scene.add(terrain);
}

/** Pozu modele uygular. Eşleme (docs/KINEMATIK.md):
 *  gövde: ENU konum → enuToThree; yaw ROS z → three +Y; pitch (burun yukarı +) ROS −y → three +Z;
 *  roll (sol yukarı +) ROS +x → three +X. Sıra roll → pitch → yaw = Euler 'YZX'.
 *  rocker/bogie: kinematikteki açı x-z düzleminde saat yönü tersi = three +Z ekseni etrafında. */
function applyPose(root: THREE.Object3D, p: RoverPose) {
  root.position.fromArray(enuToThree(p.position));
  root.rotation.set(p.roll, p.yaw, p.pitch, 'YZX');
  const n = (name: string) => root.getObjectByName(name)!;
  n('rocker_L').rotation.z = p.rocker.left;
  n('rocker_R').rotation.z = p.rocker.right;
  n('bogie_L').rotation.z = p.bogie!.left;
  n('bogie_R').rotation.z = p.bogie!.right;
  n('diff_gear').rotation.y = p.diff;
}

function check(root: THREE.Object3D, p: RoverPose) {
  root.updateMatrixWorld(true);
  const rows: string[] = [];
  let worst = 0;
  const v = new THREE.Vector3();
  for (const w of p.wheels) {
    root.getObjectByName(`wheel_${w.id}`)!.getWorldPosition(v);
    const e = enuToThree(w.center as Vec3);
    const d = Math.hypot(v.x - e[0], v.y - e[1], v.z - e[2]) * 1000;
    worst = Math.max(worst, d);
    rows.push(
      `${w.id}: fark <span class="${d <= 1 ? 'ok' : 'bad'}">${d.toFixed(2)} mm</span>` +
        ` · boşluk ${(w.gap * 1000).toFixed(1)} mm${w.inContact ? '' : ' (havada)'}`,
    );
  }
  const deg = (r: number) => ((r * 180) / Math.PI).toFixed(1);
  out.innerHTML =
    `pitch ${deg(p.pitch)}° · roll ${deg(p.roll)}° · rocker ${deg(p.rocker.left)}°` +
    ` · bogie L ${deg(p.bogie!.left)}° R ${deg(p.bogie!.right)}°<br>` +
    rows.join('<br>') +
    `<br><b>en büyük fark: <span class="${worst <= 1 ? 'ok' : 'bad'}">${worst.toFixed(2)} mm</span></b>`;
  document.body.dataset.worstMm = worst.toFixed(3);
}

async function load() {
  const s = SCENARIOS[scenarioSel.value]!;
  buildTerrain(s.fn);
  const hf = Heightfield.fromFunction(s.fn, 513, 8);
  const pose = solvePose(g, hf, 0, 0, s.yaw ?? 0);
  if (rover) scene.remove(rover);
  const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/taykut2027.${lodSel.value}.glb`);
  rover = gltf.scene;
  rover.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
  });
  const root = rover.getObjectByName('rover_root')!;
  applyPose(root, pose);
  scene.add(rover);
  check(root, pose);
  document.body.dataset.ready = '1';
}
scenarioSel.onchange = lodSel.onchange = () => void load();
void load();

renderer.setAnimationLoop(() => renderer.render(scene, camera));
