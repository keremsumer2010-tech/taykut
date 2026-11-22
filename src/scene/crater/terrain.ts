// Meteor Krateri arazisi: gerçek yükseklik (Copernicus GLO-30, tools/terrain/bake_crater.py) +
// rover ölçeğinde prosedürel ayrıntı (çakıl dokusu ve kayalar). Yerel çerçeve: ENU (x doğu, y kuzey,
// z yukarı), orijin = rover güzergâhının ortası (kenar sırtı), z = 0 orijindeki gerçek yükseklik.
// Gerçek veri 8 m aralıklı; 30 m kaynak çözünürlüğünün altındaki her şey prosedüreldir (belgelendi).
import { fbm, rng } from './noise';

export interface DemMeta {
  sizeM: number;
  n: number;
  minM: number;
  maxM: number;
  attribution: string;
}

export interface Dem {
  meta: DemMeta;
  /** Satır 0 kuzey; metre. */
  h: Float32Array;
}

/** Krater merkezi ve güzergâh (DEM merkezli metrik koordinatlar, bkz. bake_crater.py). */
export const CRATER_CENTER: [number, number] = [88, -56];
const AZ = (300 * Math.PI) / 180; // güney-güneydoğu kenar
const RIM_R = 555;
export const ORIGIN: [number, number] = [
  CRATER_CENTER[0] + RIM_R * Math.cos(AZ),
  CRATER_CENTER[1] + RIM_R * Math.sin(AZ),
];
/** Kraterin içine doğru birim vektör (yerel). */
export const INWARD: [number, number] = [-Math.cos(AZ), -Math.sin(AZ)];
/** Sırta teğet birim vektör (rover bu yönde ilerler). */
export const TANGENT: [number, number] = [-Math.sin(AZ), Math.cos(AZ)];

export async function loadDem(base: string): Promise<Dem> {
  const [meta, img] = await Promise.all([
    fetch(`${base}terrain/meteor.json`).then((r) => r.json() as Promise<DemMeta>),
    fetch(`${base}terrain/meteor.png`)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })),
  ]);
  const n = meta.n;
  const cv = document.createElement('canvas');
  cv.width = n;
  cv.height = n;
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, n, n).data;
  const h = new Float32Array(n * n);
  const span = meta.maxM - meta.minM;
  for (let i = 0; i < n * n; i++) h[i] = meta.minM + ((px[i * 4]! * 256 + px[i * 4 + 1]!) / 65535) * span;
  return { meta, h };
}

/** DEM'in bilinear örneği; (x, y) DEM merkezli metre. */
export function demSample(dem: Dem, x: number, y: number): number {
  const { n, sizeM } = dem.meta;
  const fc = Math.min(Math.max((x / sizeM + 0.5) * (n - 1), 0), n - 1.001);
  const fr = Math.min(Math.max((0.5 - y / sizeM) * (n - 1), 0), n - 1.001);
  const c0 = Math.floor(fc);
  const r0 = Math.floor(fr);
  const tx = fc - c0;
  const ty = fr - r0;
  const i = r0 * n + c0;
  const h = dem.h;
  return (
    h[i]! * (1 - tx) * (1 - ty) +
    h[i + 1]! * tx * (1 - ty) +
    h[i + n]! * (1 - tx) * ty +
    h[i + n + 1]! * tx * ty
  );
}

/** Bikübik (Catmull-Rom) örnek: bilinear'ın 8 m hücre sınırlarındaki kırılmaları (ışıkta çizgi) yok. */
export function demSampleCubic(dem: Dem, x: number, y: number): number {
  const { n, sizeM } = dem.meta;
  const fc = Math.min(Math.max((x / sizeM + 0.5) * (n - 1), 1), n - 3.001);
  const fr = Math.min(Math.max((0.5 - y / sizeM) * (n - 1), 1), n - 3.001);
  const c0 = Math.floor(fc);
  const r0 = Math.floor(fr);
  const tx = fc - c0;
  const ty = fr - r0;
  const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
  const h = dem.h;
  const row = (r: number) => {
    const i = r * n + c0;
    return cr(h[i - 1]!, h[i]!, h[i + 1]!, h[i + 2]!, tx);
  };
  return cr(row(r0 - 1), row(r0), row(r0 + 1), row(r0 + 2), ty);
}

export interface Rock {
  x: number;
  y: number;
  r: number;
}

export const PATCH = 64; // ayrıntılı alan kenarı (m)

/** Rover çevresindeki kayalar: güzergâhın üstünde birkaç küçük kaya (süspansiyon çalışsın), çevrede daha çok. */
export function makeRocks(): Rock[] {
  const rand = rng(2027);
  const rocks: Rock[] = [];
  for (let i = 0; i < 420; i++) {
    const x = (rand() - 0.5) * (PATCH - 6);
    const y = (rand() - 0.5) * (PATCH - 6);
    const big = rand() < 0.08;
    const r = big ? 0.28 + rand() * 0.22 : 0.04 + rand() ** 2 * 0.16;
    // Güzergâh şeridinde (±1,2 m) yalnız küçük kayalar: en çok ~11 cm yükseklik
    const along = x * TANGENT[0] + y * TANGENT[1];
    const across = x * INWARD[0] + y * INWARD[1] - routeOffset(along);
    if (Math.abs(across) < 1.2 && r > 0.18) continue;
    rocks.push({ x, y, r });
  }
  return rocks;
}

/** Güzergâhın sırta dik sapması (m): hafif S kıvrımı. */
export function routeOffset(along: number): number {
  return 1.6 * Math.sin(along * 0.11) - 0.6 * Math.sin(along * 0.31 + 1.3);
}

/** Kaya yükseklik katkısı: küre kapağı (kürenin merkezi zeminin 0,4r altında). */
function rockBump(grid: Map<string, Rock[]>, x: number, y: number): number {
  const key = `${Math.floor(x)},${Math.floor(y)}`;
  const list = grid.get(key);
  if (!list) return 0;
  let best = 0;
  for (const k of list) {
    const d2 = (x - k.x) ** 2 + (y - k.y) ** 2;
    if (d2 >= k.r * k.r) continue;
    const top = Math.sqrt(k.r * k.r - d2) - 0.4 * k.r;
    if (top > best) best = top;
  }
  return best;
}

export function rockGrid(rocks: Rock[]) {
  const grid = new Map<string, Rock[]>();
  for (const k of rocks) {
    for (let gx = Math.floor(k.x - k.r); gx <= Math.floor(k.x + k.r); gx++) {
      for (let gy = Math.floor(k.y - k.r); gy <= Math.floor(k.y + k.r); gy++) {
        const key = `${gx},${gy}`;
        const l = grid.get(key);
        if (l) l.push(k);
        else grid.set(key, [k]);
      }
    }
  }
  return grid;
}

/** Yerel yükseklik fonksiyonları. `base`: gerçek veri; `detail`: prosedürel (≥ 0, kenarda sönümlenir). */
export function makeHeight(dem: Dem, rocks: Rock[]) {
  const z0 = demSampleCubic(dem, ORIGIN[0], ORIGIN[1]);
  const grid = rockGrid(rocks);
  const base = (x: number, y: number) => demSampleCubic(dem, ORIGIN[0] + x, ORIGIN[1] + y) - z0;
  const half = PATCH / 2;
  const detail = (x: number, y: number) => {
    const e = Math.min(half - Math.abs(x), half - Math.abs(y));
    const fade = Math.min(Math.max(e / 6, 0), 1);
    const grain = fbm(x * 0.9, y * 0.9, 4, 7) * 0.09 + fbm(x * 0.18, y * 0.18, 3, 3) * 0.16;
    return (grain + rockBump(grid, x, y)) * fade + 0.02;
  };
  return { z0, base, detail, full: (x: number, y: number) => base(x, y) + detail(x, y) };
}
