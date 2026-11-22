// Ana sayfa sinematik sahnesi: Meteor Krateri (gerçek veri) kenarında TAYKUT 2027 rover'ı.
// Rover pozları kinematik çözücüden gelir (src/scene/rover); kamera 6 çekimlik döngüyü akıcı geçişlerle izler.
// Bu modül yalnız tarayıcıda, dinamik import ile yüklenir (ilk yüke three.js girmez).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Heightfield } from '@/lib/heightfield';
import { rover2027Geometry } from '@/scene/rover/geometry';
import { sampleTrack, type TrackPose } from '@/scene/rover/poseTrack';
import { PATCH_SEG, buildScene, type Grid, type SceneData } from './build';
import { fbm, rng } from './noise';
import { CRATER_CENTER, INWARD, ORIGIN, PATCH, demSample, loadDem, type Dem } from './terrain';

/** Sahne verisini Worker'da üretir; Worker yoksa (eski tarayıcı) ana iş parçacığında. */
function buildSceneData(dem: Dem): Promise<SceneData> {
  if (typeof Worker === 'undefined') return Promise.resolve(buildScene(dem));
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL('../../workers/craterBuild.worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (e: MessageEvent<SceneData>) => {
      resolve(e.data);
      w.terminate();
    };
    w.onerror = (err) => {
      w.terminate();
      reject(err);
    };
    w.postMessage({ meta: dem.meta, h: dem.h.slice() });
  });
}

/** Worker'ın hazırladığı tamponlardan geometri (ana iş parçacığında döngü yok). */
function gridGeo(g: Grid, colorSize: 3 | 4, size: number, minY: number, maxY: number) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(g.position, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(g.normal, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(g.color, colorSize));
  if (g.uv) geo.setAttribute('uv', new THREE.BufferAttribute(g.uv, 2));
  geo.setIndex(new THREE.BufferAttribute(g.index, 1));
  const h = size / 2;
  geo.boundingBox = new THREE.Box3(new THREE.Vector3(-h, minY, -h), new THREE.Vector3(h, maxY, h));
  geo.boundingSphere = geo.boundingBox.getBoundingSphere(new THREE.Sphere());
  return geo;
}

export interface Telemetry {
  pitchDeg: number;
  rollDeg: number;
  rockerDeg: number;
  bogieDeg: number;
  speed: number;
  dist: number;
  shot: number;
}

export interface SceneOptions {
  base: string;
  reducedMotion: boolean;
  onTelemetry?: (t: Telemetry) => void;
  onReady?: () => void;
  /** Döngüde sabit an [0,1): sahne durur (inceleme ve ekran görüntüsü için). */
  fixedT?: number | undefined;
  /** Duraklatılmış başla (açılış oynarken arka planda hazır bekler); setPlaying(true) ile döngü 0'dan başlar. */
  startPaused?: boolean;
  /** Cihaz animasyonu kaldıramıyor: sahne sabit kareye geçti. */
  onSlow?: () => void;
}

const LOOP_S = 54; // tam döngü süresi
const SUN_DIR = new THREE.Vector3(-0.62, 0.24, 0.75).normalize(); // alçak güneş: uzun gölgeler
const SKY_TOP = new THREE.Color('#3f6ea8');
const SKY_HORIZON = new THREE.Color('#e7c39a');
const FOG = SKY_HORIZON;

// ENU (x doğu, y kuzey, z yukarı) → three (x, z, −y)
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, z, -y);

const smootherstep = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Tekrarlayan ince taneli doku (yakın çekimde zemin "kumlu" görünsün). */
function grainTexture() {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(S, S);
  const rand = rng(99);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // döşenebilir: gürültü periyodu S
      const v = 0.85 + fbm((x / S) * 16, (y / S) * 16, 3, 21) * 0.3 + (rand() - 0.5) * 0.12; // ortalama ≈ 1
      const c = Math.max(0, Math.min(255, v * 255));
      const i = (y * S + x) * 4;
      img.data[i] = c;
      img.data[i + 1] = c * 0.98;
      img.data[i + 2] = c * 0.95;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function skyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: SKY_TOP },
      horizon: { value: SKY_HORIZON },
      sun: { value: SUN_DIR },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position.z = gl_Position.w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 top; uniform vec3 horizon; uniform vec3 sun;
      varying vec3 vDir;
      void main() {
        float h = max(vDir.y, 0.0);
        vec3 col = mix(horizon, top, pow(h, 0.32));
        float s = max(dot(vDir, sun), 0.0);
        col += vec3(1.0, 0.82, 0.55) * (pow(s, 600.0) * 6.0 + pow(s, 12.0) * 0.35);
        col = mix(col, horizon * 0.92, smoothstep(0.0, -0.08, vDir.y));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

export async function startCraterScene(container: HTMLElement, opts: SceneOptions) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const dprCap = matchMedia('(max-width: 768px)').matches ? 1.5 : 1.75;
  renderer.setPixelRatio(Math.min(devicePixelRatio, dprCap));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(FOG, 0.00024);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(9000, 32, 16), skyMaterial());
  scene.add(sky);

  // Gökyüzünden ortam ışığı (metal yansımaları için)
  // Üretimi pahalı: ilk kareden sonra, tarayıcı boştayken yapılır (bkz. dosya sonu).
  const makeEnvironment = () => {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const skyScene = new THREE.Scene();
    skyScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), skyMaterial()));
    scene.environment = pmrem.fromScene(skyScene, 0.02).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();
    if (!running) frame();
  };

  const sun = new THREE.DirectionalLight('#ffe2b8', 3.2);
  sun.castShadow = true;
  const small = matchMedia('(max-width: 768px)').matches;
  sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 80 });
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#bcd2f0', '#8a6a4c', 0.55));

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 12000);

  // ---- arazi ve rover poz izi: ağır hesap Web Worker'da (ana iş parçacığı kilitlenmez)
  const dem = await loadDem(opts.base);
  const gltfP = new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(`${opts.base}models/taykut2027.lod0.glb`);
  const data = await buildSceneData(dem);
  const { sizeM } = dem.meta;
  const grain = grainTexture();
  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
    map: grain,
  });

  // Geniş arazi: DEM ızgarasıyla birebir (513²), yerel orijine kaydırılmış
  const bigGeo = gridGeo(data.big, 3, sizeM, dem.meta.minM - data.z0 - 1, dem.meta.maxM - data.z0 + 1);
  // Dış etek: verinin bittiği yerden ufka kadar uzanan düz zemin (kenar görünmesin), sis içinde kaybolur
  {
    const ring = new THREE.RingGeometry(sizeM * 0.47, 9000, 96, 1);
    ring.rotateX(-Math.PI / 2);
    const edge = dem.meta.minM + (dem.meta.maxM - dem.meta.minM) * 0.18 - data.z0;
    const skirt = new THREE.Mesh(
      ring,
      new THREE.MeshStandardMaterial({ color: '#b99a74', roughness: 1, map: grain }),
    );
    skirt.position.copy(v3(-ORIGIN[0], -ORIGIN[1], edge - 3));
    scene.add(skirt);
  }
  const big = new THREE.Mesh(
    bigGeo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0 }),
  );
  big.position.set(-ORIGIN[0], 0, ORIGIN[1]); // DEM merkezi → yerel
  big.receiveShadow = true;
  scene.add(big);

  // Rover çevresi: 64 m × 64 m, 0,25 m aralık, gerçek taban + prosedürel ayrıntı; kenarda sönüm (alfa)
  const patchGeo = gridGeo(data.patch, 4, PATCH, -6, 6);
  const patchMat = terrainMat.clone();
  patchMat.alphaHash = true;
  const patch = new THREE.Mesh(patchGeo, patchMat);
  patch.receiveShadow = true;
  scene.add(patch);
  const patchHF = new Heightfield(data.patch.y, PATCH_SEG + 1, PATCH_SEG + 1, PATCH);
  const groundAt = (x: number, y: number) =>
    Math.abs(x) < PATCH / 2 - 1 && Math.abs(y) < PATCH / 2 - 1
      ? patchHF.sample(x, y)
      : demSample(dem, ORIGIN[0] + x, ORIGIN[1] + y) - data.z0;

  // Kayalar (yükseklik alanındaki küre kapaklarıyla aynı yer ve boyut)
  {
    const g = new THREE.IcosahedronGeometry(1, 2);
    const p = g.attributes.position!;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const k = 0.82 + fbm(v.x * 1.7 + 3, v.z * 1.7 + v.y, 3, 4) * 0.36;
      p.setXYZ(i, v.x * k, v.y * k * 0.92, v.z * k);
    }
    g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ color: '#8a7058', roughness: 0.92, map: grain });
    const inst = new THREE.InstancedMesh(g, m, data.rocks.length);
    const mat = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const rand = rng(5);
    data.rocks.forEach((k, i) => {
      q.setFromEuler(new THREE.Euler(rand() * 6.28, rand() * 6.28, rand() * 6.28));
      mat.compose(v3(k.x, k.y, data.rockBaseZ[i]!), q, new THREE.Vector3(k.r, k.r, k.r));
      inst.setMatrixAt(i, mat);
    });
    inst.castShadow = inst.receiveShadow = true;
    scene.add(inst);
  }
  const geom = rover2027Geometry();
  const track = data.track;

  // ---- rover modeli
  const gltf = await gltfP;
  const root = gltf.scene.getObjectByName('rover_root')!;
  gltf.scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
  });
  scene.add(gltf.scene);
  const node = (name: string) => root.getObjectByName(name)!;
  const J = {
    rL: node('rocker_L'),
    rR: node('rocker_R'),
    bL: node('bogie_L'),
    bR: node('bogie_R'),
    diff: node('diff_gear'),
    wL: ['wheel_FL', 'wheel_ML', 'wheel_RL'].map(node),
    wR: ['wheel_FR', 'wheel_MR', 'wheel_RR'].map(node),
  };

  // Toz: arka tekerlerden kalkan, sönen parçacıklar
  const DUST = 160;
  const dustGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(DUST * 3);
  const dLife = new Float32Array(DUST);
  const dVel = new Float32Array(DUST * 3);
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: '#d9bf98',
      size: 0.09,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  dust.frustumCulled = false;
  scene.add(dust);
  let dustNext = 0;

  // ---- poz uygulama
  const pose = {} as TrackPose;
  const roverPos = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const wheelR = geom.wheelRadius;
  function applyPose(s: number) {
    sampleTrack(track, s, pose);
    root.position.copy(v3(pose.x, pose.y, pose.z));
    root.rotation.set(pose.roll, pose.yaw, pose.pitch, 'YZX');
    J.rL.rotation.z = pose.rocker;
    J.rR.rotation.z = -pose.rocker;
    J.bL.rotation.z = pose.bogieL;
    J.bR.rotation.z = pose.bogieR;
    J.diff.rotation.y = pose.diff;
    for (const w of J.wL) w.rotation.z = -pose.spinL;
    for (const w of J.wR) w.rotation.z = -pose.spinR;
    roverPos.copy(root.position);
    fwd.set(Math.cos(pose.yaw), 0, -Math.sin(pose.yaw));
    right.crossVectors(fwd, up).normalize();
  }

  // ---- kamera çekimleri (yerel three koordinatları)
  const craterC = v3(CRATER_CENTER[0] - ORIGIN[0], CRATER_CENTER[1] - ORIGIN[1], -110);
  const inward = new THREE.Vector3(INWARD[0], 0, -INWARD[1]);
  const lookAt = new THREE.Vector3();
  type Shot = { from: number; to: number; cam: (u: number, p: THREE.Vector3, t: THREE.Vector3) => void };
  const tmp = new THREE.Vector3();
  const SHOTS: Shot[] = [
    {
      // 1. Krater, yüksekten süzülerek
      from: 0,
      to: 0.17,
      cam: (u, p, t) => {
        const a = -2.2 + u * 0.55;
        p.set(craterC.x + Math.cos(a) * 1500, 620 - u * 80, craterC.z + Math.sin(a) * 1500);
        t.copy(craterC).lerp(roverPos, u * 0.25);
      },
    },
    {
      // 2. Kenara iniş: rover'ın arkasından ve yukarıdan
      from: 0.17,
      to: 0.31,
      cam: (u, p, t) => {
        const e = smootherstep(u);
        tmp
          .copy(roverPos)
          .addScaledVector(fwd, -60 + e * 46)
          .addScaledVector(inward, -22 + e * 14);
        p.copy(tmp).add(new THREE.Vector3(0, 70 - e * 64, 0));
        t.copy(roverPos).add(new THREE.Vector3(0, 0.4, 0));
      },
    },
    {
      // 3. Yandan alçak takip: süspansiyon çalışırken
      from: 0.31,
      to: 0.49,
      cam: (u, p, t) => {
        p.copy(roverPos)
          .addScaledVector(right, 4.6 - u * 0.8)
          .addScaledVector(fwd, 1.8 - u * 2.6);
        p.y += 0.75 + u * 0.3;
        t.copy(roverPos).addScaledVector(fwd, 0.3);
        t.y += 0.35;
      },
    },
    {
      // 4. Önden, yerden: tekerler kameraya doğru
      from: 0.49,
      to: 0.64,
      cam: (u, p, t) => {
        p.copy(roverPos)
          .addScaledVector(fwd, 5.2 - u * 1.2)
          .addScaledVector(right, -2.2 + u * 3.4);
        p.y += 0.7;
        t.copy(roverPos);
        t.y += 0.35;
      },
    },
    {
      // 5. Omzun üstünden kratere bakış
      from: 0.64,
      to: 0.83,
      cam: (u, p, t) => {
        p.copy(roverPos)
          .addScaledVector(inward, -4.2 - u * 1.5)
          .addScaledVector(fwd, -0.9 + u * 0.8);
        p.y += 2.4 + u * 1.2;
        t.copy(roverPos).addScaledVector(inward, 9);
        t.y -= 1.4;
      },
    },
    {
      // 6. Yükselip geri çekilme: döngü başına dönüş
      from: 0.83,
      to: 1,
      cam: (u, p, t) => {
        const e = smootherstep(u);
        const a = -2.2;
        const pA = new THREE.Vector3(craterC.x + Math.cos(a) * 1500, 620, craterC.z + Math.sin(a) * 1500);
        const p0 = roverPos.clone().addScaledVector(inward, -5.7).addScaledVector(fwd, -0.1);
        p0.y += 3.6;
        // Önce krater dışına doğru geri ve yukarı çekil (kraterin içinden geçme), sonra açılış konumuna süzül
        const out = p0
          .clone()
          .addScaledVector(inward, -e * 420)
          .add(new THREE.Vector3(0, e * 560, 0));
        p.copy(out).lerp(pA, smootherstep((u - 0.45) / 0.55));
        t.copy(roverPos)
          .addScaledVector(inward, 9)
          .lerp(craterC, smootherstep(u * 1.4));
        t.y = THREE.MathUtils.lerp(roverPos.y - 1.4, craterC.y, smootherstep(u * 1.4));
      },
    },
  ];
  const camRight = new THREE.Vector3();
  const BLEND = 0.035; // çekimler arası yumuşak geçiş payı (döngü oranı)
  const pA = new THREE.Vector3();
  const tA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const tB = new THREE.Vector3();
  function cameraAt(t: number) {
    const i = SHOTS.findIndex((s) => t >= s.from && t < s.to);
    const k = i < 0 ? SHOTS.length - 1 : i;
    const s = SHOTS[k]!;
    s.cam((t - s.from) / (s.to - s.from), pA, tA);
    const next = SHOTS[(k + 1) % SHOTS.length]!;
    const w = (t - (s.to - BLEND)) / BLEND;
    if (w > 0 && k < SHOTS.length - 1) {
      next.cam(0, pB, tB);
      const e = smootherstep(w);
      pA.lerp(pB, e);
      tA.lerp(tB, e);
    }
    camera.position.copy(pA);
    lookAt.copy(tA);
    if (k >= 1 && k <= 3 && camera.aspect > 0.8) {
      const d = Math.min(camera.position.distanceTo(lookAt), camera.position.distanceTo(roverPos));
      camRight.subVectors(lookAt, camera.position).normalize().cross(up).normalize();
      lookAt.addScaledVector(camRight, -d * 0.2);
      lookAt.y -= d * 0.05;
    } else if (k >= 1 && k <= 4) {
      // Dar ekran: başlık altta; rover kadrajın üst yarısına (hedef aşağı kayar)
      const d = Math.min(camera.position.distanceTo(lookAt), camera.position.distanceTo(roverPos));
      lookAt.y -= d * (k === 4 ? 0.75 : 0.32);
    }
    // Kamera arazinin altına inmesin
    const lx = camera.position.x;
    const ly = -camera.position.z;
    const ground = groundAt(lx, ly);
    camera.position.y = Math.max(camera.position.y, ground + 0.25);
    camera.lookAt(lookAt);
    return k;
  }

  // ---- döngü
  const clock = new THREE.Clock();
  let running = !opts.reducedMotion && opts.fixedT === undefined && !opts.startPaused;
  let visible = true;
  let tLoop = opts.fixedT ?? (opts.reducedMotion ? 0.4 : 0);
  let lastTel = 0;
  let prevDist = 0;
  let raf = 0;

  // Yavaş cihaz koruması: 30 karelik ortalama < 10 kare/sn → önce çözünürlük 1×, yine yavaşsa sabit kare
  let probeN = 0;
  let probeSum = 0;
  let degraded = 0;
  function frame() {
    const raw = clock.getDelta();
    const dt = Math.min(raw, 0.05);
    if (running && degraded < 2) {
      if (++probeN > 3) probeSum += raw;
      if (probeN === 33) {
        if (probeSum / 30 > 0.1) {
          degraded++;
          if (degraded === 1) {
            renderer.setPixelRatio(1);
            resize();
          } else {
            running = false;
            opts.onSlow?.();
          }
        }
        probeN = 0;
        probeSum = 0;
      }
    }
    if (running) tLoop = (tLoop + dt / LOOP_S) % 1;
    // Rover döngünün %15'inden %97'sine kadar sürer; dönüş anı geniş çekimde (görünmez) olur.
    const s = smootherstep((tLoop - 0.12) / 0.86) * 0.999;
    applyPose(s);
    const shot = cameraAt(tLoop);
    sun.position.copy(roverPos).addScaledVector(SUN_DIR, 40);
    sun.target.position.copy(roverPos);

    // toz
    const speed = (pose.dist - prevDist) / Math.max(dt, 1e-4);
    prevDist = pose.dist;
    if (running && speed > 0.05 && clock.elapsedTime > dustNext) {
      dustNext = clock.elapsedTime + 0.03;
      for (const w of [J.wL[2]!, J.wR[2]!]) {
        const i = Math.floor(Math.random() * DUST);
        w.getWorldPosition(tmp);
        dPos[i * 3] = tmp.x + (Math.random() - 0.5) * 0.1;
        dPos[i * 3 + 1] = tmp.y - wheelR + 0.05;
        dPos[i * 3 + 2] = tmp.z + (Math.random() - 0.5) * 0.1;
        dVel[i * 3] = -fwd.x * 0.25 + (Math.random() - 0.5) * 0.2;
        dVel[i * 3 + 1] = 0.15 + Math.random() * 0.2;
        dVel[i * 3 + 2] = -fwd.z * 0.25 + (Math.random() - 0.5) * 0.2;
        dLife[i] = 1;
      }
    }
    for (let i = 0; i < DUST; i++) {
      if (dLife[i]! <= 0) {
        dPos[i * 3 + 1] = -9999;
        continue;
      }
      dLife[i] = dLife[i]! - dt * 0.6;
      dPos[i * 3] = dPos[i * 3]! + dVel[i * 3]! * dt;
      dPos[i * 3 + 1] = dPos[i * 3 + 1]! + dVel[i * 3 + 1]! * dt;
      dPos[i * 3 + 2] = dPos[i * 3 + 2]! + dVel[i * 3 + 2]! * dt;
    }
    dustGeo.attributes.position!.needsUpdate = true;

    renderer.render(scene, camera);

    if (opts.onTelemetry && clock.elapsedTime - lastTel > 0.25) {
      lastTel = clock.elapsedTime;
      const deg = (r: number) => (r * 180) / Math.PI;
      opts.onTelemetry({
        pitchDeg: deg(pose.pitch),
        rollDeg: deg(pose.roll),
        rockerDeg: deg(pose.rocker),
        bogieDeg: deg(Math.abs(pose.bogieL) > Math.abs(pose.bogieR) ? pose.bogieL : pose.bogieR),
        speed: Math.max(0, speed),
        dist: pose.dist,
        shot,
      });
    }
    if (running && visible) raf = requestAnimationFrame(frame);
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 52 : 38; // dar ekranda daha geniş açı
    camera.updateProjectionMatrix();
    if (!running) frame();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const io = new IntersectionObserver(([e]) => {
    const was = visible;
    visible = !!e?.isIntersecting && !document.hidden;
    if (visible && !was && running) {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  });
  io.observe(container);
  const onVis = () => {
    visible = !document.hidden;
    if (visible && running) {
      clock.getDelta();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVis);

  // Gölgelendiricileri ilk kareden önce asenkron derle (ilk karede uzun donma olmasın)
  applyPose(0);
  cameraAt(tLoop);
  await renderer.compileAsync(scene, camera);
  frame();
  opts.onReady?.();
  const idle = (cb: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, 1500);
  idle(makeEnvironment);

  // Kayıt kancası (yalnız ?capture): referans video üretimi için döngünün istenen anını çizer (tools/stage/record.mjs)
  if (new URLSearchParams(location.search).has('capture')) {
    (window as unknown as { __craterAt: (t: number) => void }).__craterAt = (t: number) => {
      tLoop = t;
      frame();
    };
  }

  return {
    setPlaying(p: boolean) {
      running = p && !opts.reducedMotion;
      if (running) {
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
