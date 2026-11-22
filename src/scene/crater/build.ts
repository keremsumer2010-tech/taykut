// Sahne verisinin ağır kısmı (saf, three.js'siz): arazi yükseklikleri, normaller, renkler, kaya listesi
// ve rover poz izi. Web Worker'da çalışır (build.worker.ts); ana iş parçacığı yalnız tamponları GPU'ya verir.
import { Heightfield } from '@/lib/heightfield';
import { rover2027Geometry } from '@/scene/rover/geometry';
import { packTrack, type PoseTrack } from '@/scene/rover/poseTrack';
import { sampleRoute, solveRoute, type Point2 } from '@/scene/rover/route';
import { fbm } from './noise';
import {
  INWARD,
  ORIGIN,
  PATCH,
  TANGENT,
  makeHeight,
  makeRocks,
  routeOffset,
  type Dem,
  type Rock,
} from './terrain';

export const PATCH_SEG = 256; // ayrıntılı zemin: 0,25 m
export const ROUTE_LEN = 46; // m

export interface Grid {
  /** Satır 0 kuzey; yalnız yükseklikler (yükseklik alanı ve kamera zemin denetimi için). */
  y: Float32Array;
  /** three koordinatlarında köşe konumları (x, y, z), normaller, renkler, indeks. */
  position: Float32Array;
  normal: Float32Array;
  color: Float32Array;
  index: Uint32Array;
  uv?: Float32Array;
}

export interface SceneData {
  z0: number;
  big: Grid;
  patch: Grid;
  rocks: Rock[];
  rockBaseZ: Float32Array;
  track: PoseTrack;
}

// sRGB hex → doğrusal RGB (three.js köşe renkleri doğrusal uzayda)
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const hex = (h: string): [number, number, number] => [
  lin(parseInt(h.slice(1, 3), 16) / 255),
  lin(parseInt(h.slice(3, 5), 16) / 255),
  lin(parseInt(h.slice(5, 7), 16) / 255),
];
const SAND = hex('#c7a77c');
const EJECTA = hex('#d8c3a0');
const RUST = hex('#8f5f43');
const SHADE = hex('#6d6152');
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Arazi rengi: yükseklik, eğim ve gürültüden (Arizona çölü; ejekta açık, yamaçlar kızıl-kahve). */
function terrainColor(out: Float32Array, o: number, x: number, y: number, z: number, slope: number) {
  const n = fbm(x * 0.02, y * 0.02, 4, 11);
  const fine = fbm(x * 0.4, y * 0.4, 3, 5);
  const a = clamp01((z + 20) / 60) * 0.55;
  const b = clamp01((slope - 0.25) * 2.2) * 0.75;
  const c = Math.max(0, n - 0.55) * 1.2;
  const k = 0.86 + fine * 0.28;
  for (let j = 0; j < 3; j++) {
    let v = SAND[j]! + (EJECTA[j]! - SAND[j]!) * a;
    v += (RUST[j]! - v) * b;
    v += (SHADE[j]! - v) * c;
    out[o + j] = v * k;
  }
}

/** Izgara geometrisi: konumlar (three: x doğu, y yukarı, z güney; merkez 0) ve üçgen indeksi. */
function gridGeometry(y: Float32Array, n: number, size: number, uvRepeat = 0) {
  const position = new Float32Array(n * n * 3);
  const step = size / (n - 1);
  const half = size / 2;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      position[i * 3] = -half + c * step;
      position[i * 3 + 1] = y[i]!;
      position[i * 3 + 2] = -half + r * step;
    }
  }
  const index = new Uint32Array((n - 1) * (n - 1) * 6);
  let k = 0;
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const a = r * n + c;
      const b = a + n;
      index[k++] = a;
      index[k++] = b;
      index[k++] = a + 1;
      index[k++] = b;
      index[k++] = b + 1;
      index[k++] = a + 1;
    }
  }
  let uv: Float32Array | undefined;
  if (uvRepeat) {
    uv = new Float32Array(n * n * 2);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const i = r * n + c;
        uv[i * 2] = (c / (n - 1)) * uvRepeat;
        uv[i * 2 + 1] = (1 - r / (n - 1)) * uvRepeat;
      }
    }
  }
  return { position, index, uv };
}

/** Düzenli ızgara normalleri (three çerçevesi: x doğu, z güney; satır 0 kuzey). */
function gridNormals(y: Float32Array, n: number, step: number): Float32Array {
  const out = new Float32Array(n * n * 3);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const hl = y[r * n + Math.max(c - 1, 0)]!;
      const hr = y[r * n + Math.min(c + 1, n - 1)]!;
      const hu = y[Math.max(r - 1, 0) * n + c]!;
      const hd = y[Math.min(r + 1, n - 1) * n + c]!;
      const dx = (hr - hl) / ((Math.min(c + 1, n - 1) - Math.max(c - 1, 0)) * step);
      const dz = (hd - hu) / ((Math.min(r + 1, n - 1) - Math.max(r - 1, 0)) * step);
      const inv = 1 / Math.hypot(dx, 1, dz);
      const i = (r * n + c) * 3;
      out[i] = -dx * inv;
      out[i + 1] = inv;
      out[i + 2] = -dz * inv;
    }
  }
  return out;
}

export function buildScene(dem: Dem): SceneData {
  const rocks = makeRocks();
  const H = makeHeight(dem, rocks);
  const { n, sizeM } = dem.meta;
  const half = sizeM / 2;
  const step = sizeM / (n - 1);

  // Geniş arazi (DEM ızgarası). Ayrıntılı alanın altında kalan köşeler indirilir: kaba üçgenler görünmesin.
  const bigY = new Float32Array(n * n);
  const lim = PATCH / 2 - 16; // 8 m sönüm + 8 m hücre payı
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      bigY[r * n + c] = dem.h[r * n + c]! - H.z0;
    }
  }
  const bigN = gridNormals(bigY, n, step);
  const bigC = new Float32Array(n * n * 3);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const x = -half + c * step;
      const y = half - r * step;
      terrainColor(bigC, i * 3, x, y, bigY[i]!, 1 - bigN[i * 3 + 1]!);
      const lx = x - ORIGIN[0];
      const ly = y - ORIGIN[1];
      if (Math.abs(lx) < lim && Math.abs(ly) < lim) bigY[i] = bigY[i]! - 0.6;
    }
  }

  // Ayrıntılı zemin: gerçek taban (bikübik) + prosedürel ayrıntı; kenarda 8 m sönüm (alfa)
  const m = PATCH_SEG + 1;
  const ps = PATCH / PATCH_SEG;
  const ph = PATCH / 2;
  const patchY = new Float32Array(m * m);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < m; c++) patchY[r * m + c] = H.full(-ph + c * ps, ph - r * ps);
  }
  const patchN = gridNormals(patchY, m, ps);
  const patchC = new Float32Array(m * m * 4);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < m; c++) {
      const i = r * m + c;
      const x = -ph + c * ps;
      const y = ph - r * ps;
      terrainColor(patchC, i * 4, x + ORIGIN[0], y + ORIGIN[1], patchY[i]!, 1 - patchN[i * 3 + 1]!);
      const e = Math.min(ph - Math.abs(x), ph - Math.abs(y));
      patchC[i * 4 + 3] = clamp01(e / 8);
    }
  }

  const rockBaseZ = new Float32Array(rocks.length);
  rocks.forEach((k, i) => (rockBaseZ[i] = H.base(k.x, k.y) + 0.02 - 0.4 * k.r));

  // Rover pozları: görünen ayrıntılı zeminin AYNI köşe yükseklikleri üzerinde (satır 0 kuzey, sütun 0 batı)
  const geom = rover2027Geometry();
  const hf = new Heightfield(patchY.slice(), m, m, PATCH);
  const pts: Point2[] = [];
  for (let a = -ROUTE_LEN / 2; a <= ROUTE_LEN / 2 + 0.01; a += 4) {
    const o = routeOffset(a);
    pts.push([TANGENT[0] * a + INWARD[0] * o, TANGENT[1] * a + INWARD[1] * o]);
  }
  const samples = sampleRoute(pts, 700);
  const track = packTrack(geom, samples, solveRoute(geom, hf, samples));

  const bigG = gridGeometry(bigY, n, sizeM);
  const patchG = gridGeometry(patchY, m, PATCH, 14);
  return {
    z0: H.z0,
    big: { y: bigY, normal: bigN, color: bigC, position: bigG.position, index: bigG.index },
    patch: {
      y: patchY,
      normal: patchN,
      color: patchC,
      position: patchG.position,
      index: patchG.index,
      uv: patchG.uv!,
    },
    rocks,
    rockBaseZ,
    track,
  };
}
