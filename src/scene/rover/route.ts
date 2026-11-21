// Rota: kontrol noktalarından centripetal Catmull-Rom eğrisi, yay uzunluğuna göre eşit aralıklı
// yeniden örneklenmiş. Rota boyunca pozlar SIRAYLA ve tohumlu çözülür (deterministik); render
// sırasında yalnız örnekler arasında enterpolasyon yapılır (poseTrack.ts). Zaman yok: konum `s ∈ [0,1]`.
import type { Heightfield } from '@/lib/heightfield';
import type { RoverGeometry } from './geometry';
import { solvePose, type JacobianCache, type RoverPose } from './kinematics';

export type Point2 = [number, number];

export interface RouteSample {
  x: number;
  y: number;
  yaw: number;
  /** Başlangıçtan yay uzunluğu (m). */
  dist: number;
}

/** Centripetal Catmull-Rom (α = 0.5): sivri döngü ve kendini kesme oluşturmaz. */
function catmullRom(p0: Point2, p1: Point2, p2: Point2, p3: Point2, t: number): Point2 {
  const a = 0.5;
  const d = (p: Point2, q: Point2) => Math.max(Math.hypot(q[0] - p[0], q[1] - p[1]) ** a, 1e-6);
  const t0 = 0;
  const t1 = t0 + d(p0, p1);
  const t2 = t1 + d(p1, p2);
  const t3 = t2 + d(p2, p3);
  const u = t1 + (t2 - t1) * t;
  const lerp = (p: Point2, q: Point2, ta: number, tb: number): Point2 => {
    const w = (u - ta) / (tb - ta);
    return [p[0] + (q[0] - p[0]) * w, p[1] + (q[1] - p[1]) * w];
  };
  const A1 = lerp(p0, p1, t0, t1);
  const A2 = lerp(p1, p2, t1, t2);
  const A3 = lerp(p2, p3, t2, t3);
  const B1 = lerp(A1, A2, t0, t2);
  const B2 = lerp(A2, A3, t1, t3);
  return lerp(B1, B2, t1, t2);
}

/** Kontrol noktalarından yoğun çoklu çizgi (uç noktalar yansıtılarak uzatılır). */
function densify(points: Point2[], perSegment = 48): Point2[] {
  if (points.length < 2) throw new Error('Rota en az 2 nokta ister');
  const first = points[0]!;
  const second = points[1]!;
  const last = points[points.length - 1]!;
  const beforeLast = points[points.length - 2]!;
  const ext: Point2[] = [
    [2 * first[0] - second[0], 2 * first[1] - second[1]],
    ...points,
    [2 * last[0] - beforeLast[0], 2 * last[1] - beforeLast[1]],
  ];
  const out: Point2[] = [];
  for (let i = 1; i < ext.length - 2; i++) {
    for (let k = 0; k < perSegment; k++)
      out.push(catmullRom(ext[i - 1]!, ext[i]!, ext[i + 1]!, ext[i + 2]!, k / perSegment));
  }
  out.push(last);
  return out;
}

/** Yay uzunluğuna göre eşit aralıklı `count` örnek; yaw = teğet yönü (ENU, doğudan saat yönü tersi). */
export function sampleRoute(points: Point2[], count: number): RouteSample[] {
  const poly = densify(points);
  const cum = [0];
  for (let i = 1; i < poly.length; i++) {
    cum.push(cum[i - 1]! + Math.hypot(poly[i]![0] - poly[i - 1]![0], poly[i]![1] - poly[i - 1]![1]));
  }
  const total = cum[cum.length - 1]!;
  const out: RouteSample[] = [];
  let j = 1;
  for (let i = 0; i < count; i++) {
    const target = (total * i) / (count - 1);
    while (j < poly.length - 1 && cum[j]! < target) j++;
    const seg = cum[j]! - cum[j - 1]!;
    const w = seg > 0 ? (target - cum[j - 1]!) / seg : 0;
    const a = poly[j - 1]!;
    const b = poly[j]!;
    out.push({
      x: a[0] + (b[0] - a[0]) * w,
      y: a[1] + (b[1] - a[1]) * w,
      yaw: Math.atan2(b[1] - a[1], b[0] - a[0]),
      dist: target,
    });
  }
  // Yaw'ı açı sarmasından arındır (−π/π atlaması olmasın) ve kısa dalgalanmayı yumuşat
  for (let i = 1; i < out.length; i++) {
    let d = out[i]!.yaw - out[i - 1]!.yaw;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    out[i]!.yaw = out[i - 1]!.yaw + d;
  }
  return out;
}

/** Rota boyunca tüm pozlar, sırayla ve bir öncekinin çözümünden başlayarak. */
export function solveRoute(g: RoverGeometry, hf: Heightfield, samples: RouteSample[]): RoverPose[] {
  const poses: RoverPose[] = [];
  let seed: RoverPose['seed'] | undefined;
  const cache: JacobianCache = { age: 0 };
  for (const s of samples) {
    const p = solvePose(g, hf, s.x, s.y, s.yaw, seed, cache);
    poses.push(p);
    seed = p.seed;
  }
  return poses;
}
