import { describe, expect, it } from 'vitest';
import { Heightfield } from '@/lib/heightfield';
import { rover2027Geometry, summertechGeometry, type RockerBogieGeometry } from '@/scene/rover/geometry';
import { solvePose } from '@/scene/rover/kinematics';

const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;
const g6 = rover2027Geometry() as RockerBogieGeometry;
// Testler 6 tekerlek varsayar (rover_params.yaml: wheel_count 6).
const N = 257;
const SIZE = 8; // 8 m × 8 m, ~3 cm ızgara

const field = (fn: (x: number, y: number) => number) => Heightfield.fromFunction(fn, N, SIZE);
const maxGap = (p: ReturnType<typeof solvePose>) => Math.max(...p.wheels.map((w) => Math.abs(w.gap)));

describe('rocker-bogie çözücüsü (6 tekerlek)', () => {
  it('geometri 6 tekerlek', () => {
    expect(g6.kind).toBe('rocker-bogie');
  });

  it('düz zemin: tüm açılar 0, gövde yüksekliği = r − tekerlek z (0.125 − (−0.275) = 0.40 m)', () => {
    const p = solvePose(
      g6,
      field(() => 0),
      0,
      0,
      0,
    );
    for (const a of [p.pitch, p.roll, p.rocker.left, p.bogie!.left, p.bogie!.right])
      expect(Math.abs(a)).toBeLessThan(1e-6);
    expect(p.position[2]).toBeCloseTo(0.4, 6);
    expect(p.wheels.every((w) => w.inContact)).toBe(true);
  });

  it('15° düzgün yokuş (ileri yön): pitch = 15°, rocker ve bogie ≈ 0', () => {
    const t = Math.tan(rad(15));
    for (const yaw of [0, 0.7, -2.1]) {
      // Yokuş rover'ın baktığı yöne doğru yükselir
      const hf = field((x, y) => (x * Math.cos(yaw) + y * Math.sin(yaw)) * t);
      const p = solvePose(g6, hf, 0.3, -0.2, yaw);
      expect(deg(p.pitch)).toBeCloseTo(15, 1);
      expect(Math.abs(deg(p.roll))).toBeLessThan(0.1);
      expect(Math.abs(deg(p.rocker.left))).toBeLessThan(0.1);
      expect(Math.abs(deg(p.bogie!.left))).toBeLessThan(0.1);
      expect(maxGap(p)).toBeLessThan(0.003);
    }
  });

  it('10° yan eğim: roll = 10° (sol taraf yukarı)', () => {
    const t = Math.tan(rad(10));
    const p = solvePose(
      g6,
      field((_x, y) => y * t),
      0,
      0,
      0,
    );
    expect(deg(p.roll)).toBeCloseTo(10, 1);
    expect(Math.abs(deg(p.pitch))).toBeLessThan(0.1);
    expect(maxGap(p)).toBeLessThan(0.003);
  });

  it('yalnız sol ön teker altında 10 cm basamak: 6 tekerlek temasta, diferansiyel eşit-ters, burun ve sol taraf yukarı', () => {
    // Sol ön tekerlek x = +0.45, y = +0.34'te; basamak yalnız onu kapsar.
    const hf = field((x, y) => (x > 0.3 && x < 0.62 && y > 0.2 ? 0.1 : 0));
    const p = solvePose(g6, hf, 0, 0, 0);
    expect(maxGap(p)).toBeLessThan(0.003);
    expect(p.rocker.left).toBeCloseTo(-p.rocker.right, 12);
    const fl = p.wheels.find((w) => w.id === 'FL')!;
    expect(fl.center[2]).toBeCloseTo(0.1 + g6.wheelRadius, 2);
    for (const id of ['ML', 'RL', 'FR', 'MR', 'RR']) {
      expect(p.wheels.find((w) => w.id === id)!.center[2]).toBeCloseTo(g6.wheelRadius, 2);
    }
    expect(p.pitch).toBeGreaterThan(0); // burun yukarı
    expect(p.roll).toBeGreaterThan(0); // sol taraf yukarı
    expect(p.rocker.left).toBeGreaterThan(0); // sol rocker'ın önü kalktı (gövdeye göre)
    // Gövde, iki tarafın ortalamasında: sol tarafın kalkışının yaklaşık yarısını alır
    expect(Math.abs(deg(p.pitch))).toBeLessThan(Math.abs(deg(p.rocker.left)) * 2);
  });

  it('iki ön teker altında simetrik tümsek: diferansiyel kilitli (α = 0), roll = 0, eğimi gövde alır', () => {
    const hf = field((x) => (x > 0.3 && x < 0.62 ? 0.08 : 0));
    const p = solvePose(g6, hf, 0, 0, 0);
    expect(Math.abs(deg(p.roll))).toBeLessThan(0.05);
    expect(Math.abs(deg(p.rocker.left))).toBeLessThan(0.05);
    expect(p.pitch).toBeGreaterThan(0);
    expect(p.bogie!.left).toBeCloseTo(p.bogie!.right, 6);
    expect(maxGap(p)).toBeLessThan(0.003);
  });

  it('limit aşımı (60 cm basamak): eklem sınırda, bir tekerlek HAVADA, hiçbir tekerlek gömülmez', () => {
    const hf = field((x, y) => (x > 0.3 && y > 0.2 ? 0.6 : 0));
    const p = solvePose(g6, hf, 0, 0, 0);
    expect(p.limits.rockerClamped || p.limits.bogieClamped).toBe(true);
    expect(Math.abs(p.rocker.left)).toBeLessThanOrEqual(g6.rockerLimit + 1e-9);
    expect(Math.abs(p.bogie!.left)).toBeLessThanOrEqual(g6.bogieLimit + 1e-9);
    expect(Math.min(...p.wheels.map((w) => w.gap))).toBeGreaterThan(-0.003); // gömülme yok
    expect(p.wheels.some((w) => w.gap > 0.003)).toBe(true); // bir teker boşta
  });

  it('aşırı basamak (80 cm) çözümü ıraksatmaz: açılar makul aralıkta, gömülme yok', () => {
    const hf = field((x, y) => (x > 0.3 && y > 0.2 ? 0.8 : 0));
    const p = solvePose(g6, hf, 0, 0, 0);
    expect(Math.abs(deg(p.roll))).toBeLessThan(45);
    expect(Math.abs(deg(p.pitch))).toBeLessThan(45);
    expect(Math.min(...p.wheels.map((w) => w.gap))).toBeGreaterThan(-0.003);
  });

  it('45 cm basamak limit içinde aşılır (Ø25 cm teker; rocker-bogie kabiliyeti)', () => {
    const hf = field((x, y) => (x > 0.3 && x < 1.5 && y > 0.2 ? 0.45 : 0));
    const p = solvePose(g6, hf, 0, 0, 0);
    expect(p.limits.rockerClamped || p.limits.bogieClamped).toBe(false);
    expect(maxGap(p)).toBeLessThan(0.003);
  });

  it('determinizm: aynı girdi bit düzeyinde aynı çıktı', () => {
    const hf = field((x, y) => 0.05 * Math.sin(3 * x) * Math.cos(2 * y));
    const a = solvePose(g6, hf, 0.7, -0.4, 0.3);
    const b = solvePose(g6, hf, 0.7, -0.4, 0.3);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('rastgele engebeli arazide 300 pozda yakınsar (temas artığı < 3 mm, limit dışı)', () => {
    let seed = 1234567;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    const hf = field(
      (x, y) => 0.04 * Math.sin(2.3 * x + 1) * Math.cos(1.7 * y) + 0.02 * Math.sin(5.1 * x * y),
    );
    let worst = 0;
    for (let i = 0; i < 300; i++) {
      const p = solvePose(g6, hf, (rnd() - 0.5) * 4, (rnd() - 0.5) * 4, rnd() * Math.PI * 2);
      if (!p.limits.rockerClamped && !p.limits.bogieClamped) worst = Math.max(worst, maxGap(p));
    }
    expect(worst).toBeLessThan(0.003);
  });
});

describe('diferansiyelli rocker (4 tekerlek, SummerTech)', () => {
  it('düz zemin: açılar 0', () => {
    const p = solvePose(
      summertechGeometry,
      field(() => 0),
      0,
      0,
      0,
    );
    expect(p.wheels).toHaveLength(4);
    expect(Math.abs(p.pitch) + Math.abs(p.roll) + Math.abs(p.rocker.left)).toBeLessThan(1e-6);
    expect(p.bogie).toBeNull();
  });

  it('sol ön teker altında 4 cm basamak: 4 tekerlek temasta, diferansiyel eşit-ters', () => {
    const hf = field((x, y) => (x > 0.08 && x < 0.25 && y > 0.1 ? 0.04 : 0));
    const p = solvePose(summertechGeometry, hf, 0, 0, 0);
    expect(maxGap(p)).toBeLessThan(0.003);
    expect(p.rocker.left).toBeCloseTo(-p.rocker.right, 12);
    expect(p.rocker.left).toBeGreaterThan(0);
  });

  it('12° yokuş: pitch = 12°', () => {
    const t = Math.tan(rad(12));
    const p = solvePose(
      summertechGeometry,
      field((x) => x * t),
      0,
      0,
      0,
    );
    expect(deg(p.pitch)).toBeCloseTo(12, 1);
  });
});
