// Rocker-bogie (6 tekerlek) ve diferansiyelli rocker (4 tekerlek) süspansiyonunun araziye göre
// analitik + sayısal, DETERMİNİSTİK çözümü. Saf fonksiyonlar; zaman yok (scroll geri sarılınca birebir aynı).
//
// Bilinmeyenler (6 tekerlek): gövde yüksekliği z, pitch θ, roll φ, rocker açısı α (sol = +α, sağ = −α:
// DİFERANSİYEL kısıtı), bogie açıları βL, βR. Denklemler: her tekerlek merkezi, tekerlek profilinin
// araziye değdiği yükseklikte durur (6 temas). 4 tekerlekte bilinmeyenler z, θ, φ, α; 4 temas.
// Çözüm: düzlem uydurmasıyla başlangıç + sabit sayıda Gauss–Newton adımı (sayısal Jacobian).
// Tekerlek konumları İLERİ KİNEMATİKLE hesaplandığı için çizilen model ile temas birebir tutarlıdır.
// Ayrıntı ve denklemler: docs/KINEMATIK.md
import type { Heightfield } from '@/lib/heightfield';
import { bodyToWorld, type Vec3 } from '@/lib/frames';
import type { RoverGeometry } from './geometry';

export type WheelId = 'FL' | 'ML' | 'RL' | 'FR' | 'MR' | 'RR';

export interface WheelState {
  id: WheelId;
  center: Vec3;
  /** Temas noktası (tekerlek profilinin araziye en yakın noktası). */
  contact: Vec3;
  /** Merkez yüksekliği − desteklenen yükseklik (m). ≈0 temas, >0 havada, <0 gömülme. */
  gap: number;
  inContact: boolean;
}

export interface RoverPose {
  position: Vec3; // gövde orijini (ENU)
  yaw: number;
  pitch: number; // pozitif: burun yukarı
  roll: number; // pozitif: sol taraf yukarı
  rocker: { left: number; right: number }; // gövdeye göre (sol = −sağ)
  bogie: { left: number; right: number } | null; // rocker'a göre
  diff: number; // diferansiyel ara dişlisi açısı (görsel)
  wheels: WheelState[];
  limits: { rockerClamped: boolean; bogieClamped: boolean };
  /** Son adımdaki en büyük temas artığı (m); yakınsama göstergesi. */
  residual: number;
  /** Sonraki pozun sıcak başlangıcı için çözüm parametreleri. */
  seed: PoseSeed;
}

const CONTACT_TOL = 0.003; // 3 mm
const ITERATIONS = 24; // üst sınır; çoğu çözüm erken durur
const MAX_STEP = { z: 0.15, angle: 0.15 }; // güven bölgesi: ıraksamayı önler (m, rad)
const PROFILE_SAMPLES = 9; // tekerlek profili: −60°…+60°

/** Tekerlek merkezinin, profili hiçbir yerde araziye girmeyecek en düşük yüksekliği. */
function support(hf: Heightfield, x: number, y: number, yaw: number, r: number) {
  let best = -Infinity;
  let bx = x;
  let by = y;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  for (let k = 0; k < PROFILE_SAMPLES; k++) {
    const a = (-60 + (120 * k) / (PROFILE_SAMPLES - 1)) * (Math.PI / 180);
    const d = r * Math.sin(a);
    const px = x + d * cy;
    const py = y + d * sy;
    const h = hf.sample(px, py) + r * Math.cos(a);
    if (h > best) {
      best = h;
      bx = px;
      by = py;
    }
  }
  return { height: best, contactXY: [bx, by] as const };
}

/** Gövde x-z düzleminde dönüş: pozitif açı +x'i +z'ye çevirir (burun yukarı). */
const rot = (a: number, [x, z]: readonly [number, number]): [number, number] => [
  x * Math.cos(a) - z * Math.sin(a),
  x * Math.sin(a) + z * Math.cos(a),
];

interface Params {
  z: number;
  pitch: number;
  roll: number;
  rocker: number;
  bogieL: number;
  bogieR: number;
}

/** İleri kinematik: parametrelerden tekerlek merkezleri (gövde çerçevesi). */
function wheelCentersBody(g: RoverGeometry, p: Params): { id: WheelId; pos: Vec3 }[] {
  const out: { id: WheelId; pos: Vec3 }[] = [];
  for (const side of [1, -1] as const) {
    const a = side === 1 ? p.rocker : -p.rocker;
    const piv: Vec3 = [g.pivot.x, side * g.pivot.y, g.pivot.z];
    const y = side * g.wheelY;
    const tag = side === 1 ? 'L' : 'R';
    const f = rot(a, g.rockerFront);
    out.push({ id: `F${tag}` as WheelId, pos: [piv[0] + f[0], y, piv[2] + f[1]] });
    if (g.kind === 'rocker-bogie') {
      const b = rot(a, g.rockerToBogie);
      const beta = a + (side === 1 ? p.bogieL : p.bogieR);
      const m = rot(beta, g.bogieMiddle);
      const r = rot(beta, g.bogieRear);
      out.push({ id: `M${tag}` as WheelId, pos: [piv[0] + b[0] + m[0], y, piv[2] + b[1] + m[1]] });
      out.push({ id: `R${tag}` as WheelId, pos: [piv[0] + b[0] + r[0], y, piv[2] + b[1] + r[1]] });
    } else {
      const r = rot(a, g.rockerRear);
      out.push({ id: `R${tag}` as WheelId, pos: [piv[0] + r[0], y, piv[2] + r[1]] });
    }
  }
  return out;
}

function residuals(g: RoverGeometry, hf: Heightfield, x: number, y: number, yaw: number, p: Params) {
  const pos: Vec3 = [x, y, p.z];
  return wheelCentersBody(g, p).map(({ id, pos: b }) => {
    const c = bodyToWorld(b, pos, yaw, p.pitch, p.roll);
    const s = support(hf, c[0], c[1], yaw, g.wheelRadius);
    return { id, center: c, support: s, r: c[2] - s.height };
  });
}

const KEYS_6: (keyof Params)[] = ['z', 'pitch', 'roll', 'rocker', 'bogieL', 'bogieR'];
const KEYS_4: (keyof Params)[] = ['z', 'pitch', 'roll', 'rocker'];

/** Küçük yoğun doğrusal sistem: Gauss eliminasyonu, kısmi pivotlama. */
function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r]![c]!) > Math.abs(M[piv]![c]!)) piv = r;
    [M[c], M[piv]] = [M[piv]!, M[c]!];
    const d = M[c]![c]!;
    if (Math.abs(d) < 1e-12) continue;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r]![c]! / d;
      for (let k = c; k <= n; k++) M[r]![k]! -= f * M[c]![k]!;
    }
  }
  return M.map((row, i) => (Math.abs(row[i]!) < 1e-12 ? 0 : row[n]! / row[i]!));
}

/** Başlangıç tahmini: nominal tekerlek konumlarındaki arazi yüksekliklerine düzlem uydurma. */
function initialGuess(g: RoverGeometry, hf: Heightfield, x: number, y: number, yaw: number): Params {
  const p0: Params = { z: 0, pitch: 0, roll: 0, rocker: 0, bogieL: 0, bogieR: 0 };
  const wheels = wheelCentersBody(g, p0);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  // Yerel (ileri u, sol v) koordinatlarda h ≈ a + b·u + c·v en küçük kareler
  let n = 0,
    su = 0,
    sv = 0,
    sh = 0,
    suu = 0,
    svv = 0,
    suh = 0,
    svh = 0,
    suv = 0;
  for (const { pos } of wheels) {
    const wx = x + pos[0] * cy - pos[1] * sy;
    const wy = y + pos[0] * sy + pos[1] * cy;
    const h = hf.sample(wx, wy);
    n++;
    su += pos[0];
    sv += pos[1];
    sh += h;
    suu += pos[0] ** 2;
    svv += pos[1] ** 2;
    suv += pos[0] * pos[1];
    suh += pos[0] * h;
    svh += pos[1] * h;
  }
  const A = [
    [n, su, sv],
    [su, suu, suv],
    [sv, suv, svv],
  ];
  const [a, b, c] = solveLinear(A, [sh, suh, svh]) as [number, number, number];
  const meanWheelZ = wheels.reduce((s, w) => s + w.pos[2], 0) / wheels.length;
  return {
    z: a + g.wheelRadius - meanWheelZ,
    pitch: Math.atan(b),
    roll: Math.atan(c),
    rocker: 0,
    bogieL: 0,
    bogieR: 0,
  };
}

const STOP_TOL = 2e-4; // 0.2 mm: bu artığın altında dur (deterministik: aynı girdi → aynı adımlar)
const JACOBIAN_EVERY = 3; // chord yöntemi: Jacobian her 3 adımda bir yeniden hesaplanır
const CACHE_MAX_AGE = 6; // rota boyunca aynı Jacobian en fazla 6 pozda kullanılır

/** Rota boyunca ardışık pozlar arasında paylaşılan Jacobian (yalnız tam 6/4 bilinmeyenli çözüm). */
export interface JacobianCache {
  JT?: number[][];
  JTJ?: number[][];
  age: number;
}

function gaussNewton(
  g: RoverGeometry,
  hf: Heightfield,
  x: number,
  y: number,
  yaw: number,
  start: Params,
  keys: (keyof Params)[],
  active?: boolean[], // false: o tekerlek temas denkleminden çıkarılır (havada kalabilir)
  maxIter = ITERATIONS,
  cache?: JacobianCache, // rota boyunca ardışık pozlarda Jacobian yeniden kullanılır
): Params {
  const p = { ...start };
  const h = 1e-6;
  const pick = (r: number[]) => (active ? r.filter((_, i) => active[i]) : r);
  let JT: number[][] = cache?.JT ?? [];
  let JTJ: number[][] = cache?.JTJ ?? [];
  let fresh = !cache?.JT || cache.age >= CACHE_MAX_AGE;
  for (let it = 0; it < maxIter; it++) {
    const r0 = pick(residuals(g, hf, x, y, yaw, p).map((w) => w.r));
    if (Math.max(...r0.map(Math.abs)) < STOP_TOL) break;
    if (fresh || (it > 0 && it % JACOBIAN_EVERY === 0)) {
      fresh = false;
      const J: number[][] = r0.map(() => new Array(keys.length).fill(0));
      keys.forEach((k, j) => {
        const q = { ...p, [k]: p[k] + h };
        const r1 = pick(residuals(g, hf, x, y, yaw, q).map((w) => w.r));
        r1.forEach((v, i) => (J[i]![j] = (v - r0[i]!) / h));
      });
      JT = keys.map((_, j) => J.map((row) => row[j]!));
      JTJ = JT.map((a) => JT.map((b) => a.reduce((s, v, i) => s + v * b[i]!, 0)));
      JTJ.forEach((row, i) => (row[i]! += 1e-9));
      if (cache) {
        cache.JT = JT;
        cache.JTJ = JTJ;
        cache.age = 0;
      }
    }
    // Normal denklemler: (JᵀJ + λI) Δ = −Jᵀ r
    const JTr = JT.map((a) => -a.reduce((s, v, i) => s + v * r0[i]!, 0));
    const d = solveLinear(
      JTJ.map((row) => [...row]),
      JTr,
    );
    // Adımı ölçekle: en büyük bileşen güven bölgesini aşmasın (yön korunur, ölçek deterministik)
    let scale = 1;
    keys.forEach((k, j) => {
      const lim = k === 'z' ? MAX_STEP.z : MAX_STEP.angle;
      if (Math.abs(d[j]!) > lim) scale = Math.min(scale, lim / Math.abs(d[j]!));
    });
    keys.forEach((k, j) => (p[k] += d[j]! * scale));
  }
  return p;
}

const withinLimits = (g: RoverGeometry, p: Params) =>
  Math.abs(p.rocker) <= g.rockerLimit + 1e-9 &&
  (g.kind !== 'rocker-bogie' ||
    (Math.abs(p.bogieL) <= g.bogieLimit + 1e-9 && Math.abs(p.bogieR) <= g.bogieLimit + 1e-9));

export type PoseSeed = Params;

/**
 * Rover'ın (x, y, yaw) konumunda araziye oturmuş pozu.
 * @param seed Rota boyunca bir önceki pozun çözümü (sıcak başlangıç; ardışık pozlar çok yakın).
 *             Verilmezse düzlem uydurmasıyla başlanır. Rota her zaman aynı sırayla çözüldüğü için
 *             tohumlu sonuçlar da deterministiktir.
 */
export function solvePose(
  g: RoverGeometry,
  hf: Heightfield,
  x: number,
  y: number,
  yaw: number,
  seed?: PoseSeed,
  cache?: JacobianCache,
): RoverPose {
  const keys = g.kind === 'rocker-bogie' ? KEYS_6 : KEYS_4;
  const useSeed = !!seed && withinLimits(g, seed);
  if (cache) cache.age++;
  let p = gaussNewton(
    g,
    hf,
    x,
    y,
    yaw,
    useSeed ? seed : initialGuess(g, hf, x, y, yaw),
    keys,
    undefined,
    ITERATIONS,
    useSeed ? cache : undefined,
  );

  // Eklem limitleri. Limit aşılıyorsa bir tekerlek havaya kalkmak zorundadır (gerçekçi; HUD'da
  // "TEKER BOŞTA"). Hangisi? Aktif küme: aşan açıyı sınırda sabitle, her tekerleği sırayla temas dışı
  // say, kalan sistemi çöz; GÖMÜLME olmayan, limitlere uyan ve havadaki tekerleği gerçekten yukarıda
  // kalan çözümlerden en küçük temas artıklısını seç. Sıra sabit olduğu için sonuç deterministiktir.
  let rockerClamped = false;
  let bogieClamped = false;
  if (!withinLimits(g, p)) {
    const clampTo = (q: Params): { q: Params; fixed: Set<keyof Params> } => {
      const out = { ...q };
      const fixed = new Set<keyof Params>();
      if (Math.abs(out.rocker) > g.rockerLimit) {
        out.rocker = Math.sign(out.rocker) * g.rockerLimit;
        fixed.add('rocker');
      }
      if (g.kind === 'rocker-bogie') {
        for (const k of ['bogieL', 'bogieR'] as const) {
          if (Math.abs(out[k]) > g.bogieLimit) {
            out[k] = Math.sign(out[k]) * g.bogieLimit;
            fixed.add(k);
          }
        }
      }
      return { q: out, fixed };
    };
    const { q: clamped, fixed } = clampTo(p);
    rockerClamped = fixed.has('rocker');
    bogieClamped = fixed.has('bogieL') || fixed.has('bogieR');
    const freeKeys = keys.filter((k) => !fixed.has(k));
    const nWheels = g.kind === 'rocker-bogie' ? 6 : 4;
    let best: { q: Params; score: number } | null = null;
    for (let drop = 0; drop < nWheels; drop++) {
      const active = Array.from({ length: nWheels }, (_, i) => i !== drop);
      // Serbest bilinmeyen sayısından fazla temas kalırsa en küçük kareler; azsa eksik belirli (λ ile).
      const q = gaussNewton(g, hf, x, y, yaw, clamped, freeKeys, active);
      if (!withinLimits(g, q)) continue;
      const r = residuals(g, hf, x, y, yaw, q).map((w) => w.r);
      const penetration = Math.min(...r);
      if (penetration < -CONTACT_TOL) continue; // gömülme kabul edilmez
      const score = Math.max(...r.filter((_, i) => active[i]).map(Math.abs));
      if (!best || score < best.score) best = { q, score };
    }
    p = best ? best.q : clamped;
  }

  const res = residuals(g, hf, x, y, yaw, p);
  const wheels: WheelState[] = res.map((w) => {
    const [cx, cy] = w.support.contactXY;
    return {
      id: w.id,
      center: w.center,
      contact: [cx, cy, hf.sample(cx, cy)],
      gap: w.r,
      inContact: Math.abs(w.r) <= CONTACT_TOL,
    };
  });
  return {
    position: [x, y, p.z],
    yaw,
    pitch: p.pitch,
    roll: p.roll,
    rocker: { left: p.rocker, right: -p.rocker },
    bogie: g.kind === 'rocker-bogie' ? { left: p.bogieL, right: p.bogieR } : null,
    diff: p.rocker * g.diffRatio,
    wheels,
    limits: { rockerClamped, bogieClamped },
    residual: Math.max(...res.map((w) => Math.abs(w.r))),
    seed: p,
  };
}
