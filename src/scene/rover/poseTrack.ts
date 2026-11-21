// Poz izi: rota boyunca önceden çözülmüş pozları tek bir Float32Array'de paketler (worker'dan ana
// iş parçacığına kopyasız aktarılır) ve `s ∈ [0,1]` için enterpolasyon yapar. Saf fonksiyonlar.
// Görsel yumuşatma YOK: temas doğruluğu önceliklidir; arazi bilinear olduğu için çözüm zaten süreklidir.
import type { RoverGeometry } from './geometry';
import type { RoverPose } from './kinematics';
import type { RouteSample } from './route';

/** Örnek başına alanlar (sıra sabit; paket düzeni). */
export const FIELDS = [
  'x',
  'y',
  'z',
  'yaw',
  'pitch',
  'roll',
  'rocker',
  'bogieL',
  'bogieR',
  'diff',
  'spinL',
  'spinR', // sol/sağ tekerlek dönüş açısı (rad); skid-steer'de taraflar farklı döner
  'dist',
  'minGap',
  'flags', // flags: bit0 rocker limitte, bit1 bogie limitte, bit2 teker boşta
] as const;
export type Field = (typeof FIELDS)[number];
const F = FIELDS.length;
const IDX = Object.fromEntries(FIELDS.map((f, i) => [f, i])) as Record<Field, number>;

export interface PoseTrack {
  count: number;
  data: Float32Array;
}

/** Pozları pakete çevirir. Tekerlek dönüşü: taraf başına kat edilen yay / yarıçap. */
export function packTrack(g: RoverGeometry, samples: RouteSample[], poses: RoverPose[]): PoseTrack {
  const n = samples.length;
  const data = new Float32Array(n * F);
  let spinL = 0;
  let spinR = 0;
  for (let i = 0; i < n; i++) {
    const s = samples[i]!;
    const p = poses[i]!;
    if (i > 0) {
      const prev = samples[i - 1]!;
      const ds = s.dist - prev.dist;
      const dyaw = s.yaw - prev.yaw;
      // Sol taraf dönüş merkezine göre iç/dış: dL = ds − dψ·(iz/2), dR = ds + dψ·(iz/2)
      spinL += (ds - dyaw * g.wheelY) / g.wheelRadius;
      spinR += (ds + dyaw * g.wheelY) / g.wheelRadius;
    }
    const minGap = Math.min(...p.wheels.map((w) => w.gap));
    const airborne = p.wheels.some((w) => !w.inContact);
    const row = i * F;
    data[row + IDX.x] = p.position[0];
    data[row + IDX.y] = p.position[1];
    data[row + IDX.z] = p.position[2];
    data[row + IDX.yaw] = p.yaw;
    data[row + IDX.pitch] = p.pitch;
    data[row + IDX.roll] = p.roll;
    data[row + IDX.rocker] = p.rocker.left;
    data[row + IDX.bogieL] = p.bogie?.left ?? 0;
    data[row + IDX.bogieR] = p.bogie?.right ?? 0;
    data[row + IDX.diff] = p.diff;
    data[row + IDX.spinL] = spinL;
    data[row + IDX.spinR] = spinR;
    data[row + IDX.dist] = s.dist;
    data[row + IDX.minGap] = minGap;
    data[row + IDX.flags] =
      (p.limits.rockerClamped ? 1 : 0) | (p.limits.bogieClamped ? 2 : 0) | (airborne ? 4 : 0);
  }
  return { count: n, data };
}

export type TrackPose = Record<Field, number>;

/** `s ∈ [0,1]` konumunda doğrusal enterpolasyonlu poz. Bayraklar en yakın örnekten. */
export function sampleTrack(track: PoseTrack, s: number, out: Partial<TrackPose> = {}): TrackPose {
  const n = track.count;
  const f = Math.min(Math.max(s, 0), 1) * (n - 1);
  const i0 = Math.floor(f);
  const i1 = Math.min(i0 + 1, n - 1);
  const t = f - i0;
  const d = track.data;
  for (const k of FIELDS) {
    const a = d[i0 * F + IDX[k]]!;
    const b = d[i1 * F + IDX[k]]!;
    (out as TrackPose)[k] = k === 'flags' ? (t < 0.5 ? a : b) : a + (b - a) * t;
  }
  return out as TrackPose;
}
