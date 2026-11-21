import { describe, expect, it } from 'vitest';
import { Heightfield } from '@/lib/heightfield';
import { bodyToWorld, enuToThree, threeToEnu } from '@/lib/frames';
import { rover2027Geometry, summertechGeometry } from '@/scene/rover/geometry';
import { packTrack, sampleTrack } from '@/scene/rover/poseTrack';
import { sampleRoute, solveRoute } from '@/scene/rover/route';
import { runRouteJob } from '@/workers/routeSolver';

describe('heightfield', () => {
  it('ızgara noktalarında tam değer, aralarda bilinear', () => {
    // 3×3 ızgara, 2 m: sütun −1,0,+1 m; satır +1,0,−1 m (satır 0 = kuzey)
    const hf = new Heightfield(new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), 3, 3, 2);
    expect(hf.sample(-1, 1)).toBeCloseTo(0);
    expect(hf.sample(1, -1)).toBeCloseTo(8);
    expect(hf.sample(0, 0)).toBeCloseTo(4);
    expect(hf.sample(0.5, 0)).toBeCloseTo(4.5); // 4 ile 5 arası
    expect(hf.sample(0, -0.5)).toBeCloseTo(5.5); // 4 ile 7 arası
    expect(hf.sample(0.5, 0.5)).toBeCloseTo((1 + 2 + 4 + 5) / 4);
  });

  it('alan dışında kenara kenetlenir', () => {
    const hf = new Heightfield(new Float32Array([0, 1, 2, 3]), 2, 2, 2);
    expect(hf.sample(-5, 5)).toBeCloseTo(0);
    expect(hf.sample(5, -5)).toBeCloseTo(3);
  });

  it('eğim düzleminde normal ve eğim doğru', () => {
    const t = Math.tan((20 * Math.PI) / 180);
    const hf = Heightfield.fromFunction((x) => x * t, 65, 10);
    const [nx, ny, nz] = hf.normal(1, 1);
    expect((Math.acos(nz) * 180) / Math.PI).toBeCloseTo(20, 3);
    expect(nx).toBeLessThan(0);
    expect(Math.abs(ny)).toBeLessThan(1e-6);
  });

  it('boyut uyuşmazlığında hata verir', () => {
    expect(() => new Heightfield(new Float32Array(5), 3, 3, 1)).toThrow();
  });
});

describe('çerçeveler', () => {
  it('ENU ↔ three gidiş-dönüş; three −Z kuzeydir', () => {
    expect(threeToEnu(enuToThree([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(enuToThree([0, 1, 0])).toEqual([0, 0, -1]);
  });

  it('gövde → dünya: ön tekerlek rover’ın önünde, pozitif pitch burnu kaldırır, pozitif roll solu kaldırır', () => {
    const front = bodyToWorld([1, 0, 0], [0, 0, 0], Math.PI / 2, 0, 0); // kuzeye bakıyor
    expect(front[0]).toBeCloseTo(0);
    expect(front[1]).toBeCloseTo(1);
    expect(bodyToWorld([1, 0, 0], [0, 0, 0], 0, 0.1, 0)[2]).toBeGreaterThan(0);
    expect(bodyToWorld([0, 1, 0], [0, 0, 0], 0, 0, 0.1)[2]).toBeGreaterThan(0);
  });
});

describe('rota ve poz izi', () => {
  const pts: [number, number][] = [
    [0, 0],
    [5, 0],
    [8, 3],
    [8, 8],
  ];

  it('örnekler eşit aralıklı, uçlar kontrol noktalarında, yaw sürekli', () => {
    const s = sampleRoute(pts, 200);
    expect(s[0]!.x).toBeCloseTo(0, 6);
    expect(s.at(-1)!.y).toBeCloseTo(8, 6);
    const steps = s.slice(1).map((p, i) => p.dist - s[i]!.dist);
    expect(Math.max(...steps) - Math.min(...steps)).toBeLessThan(1e-9);
    const dyaw = s.slice(1).map((p, i) => Math.abs(p.yaw - s[i]!.yaw));
    expect(Math.max(...dyaw)).toBeLessThan(0.1); // sıçrama yok
    expect(s.at(-1)!.yaw).toBeCloseTo(Math.PI / 2, 1); // sonda kuzeye bakar
  });

  it('düz yolda tekerlek dönüşü = yol / yarıçap; dönüşte dış taraf daha çok döner', () => {
    const g = rover2027Geometry();
    const hf = Heightfield.fromFunction(() => 0, 65, 30);
    const straight = sampleRoute(
      [
        [0, 0],
        [10, 0],
      ],
      101,
    );
    const t1 = packTrack(g, straight, solveRoute(g, hf, straight));
    const end = sampleTrack(t1, 1);
    expect(end.spinL).toBeCloseTo(10 / g.wheelRadius, 2);
    expect(end.spinR).toBeCloseTo(10 / g.wheelRadius, 2);
    const turn = sampleRoute(
      [
        [0, 0],
        [4, 0],
        [6, 2],
        [6, 6],
      ],
      201,
    ); // sola dönüş
    const t2 = sampleTrack(packTrack(g, turn, solveRoute(g, hf, turn)), 1);
    expect(t2.spinR).toBeGreaterThan(t2.spinL); // sağ taraf dışta
  });

  it('enterpolasyon: s ileri ve geri aynı pozu verir (scroll geri sarma)', () => {
    const g = summertechGeometry;
    const hf = Heightfield.fromFunction((x, y) => 0.03 * Math.sin(2 * x) * Math.cos(3 * y), 129, 10);
    const s = sampleRoute(pts, 400);
    const track = packTrack(g, s, solveRoute(g, hf, s));
    const a = sampleTrack(track, 0.4321);
    sampleTrack(track, 0.9);
    const b = sampleTrack(track, 0.4321);
    expect(b).toEqual(a);
  });

  it('worker çekirdeği: aynı iş iki kez bit düzeyinde aynı paket, artık < 3 mm', () => {
    const g = rover2027Geometry();
    const hf = Heightfield.fromFunction((x, y) => 0.3 * Math.sin(0.4 * x) * Math.cos(0.3 * y), 129, 32);
    const job = {
      geometry: g,
      heights: new Float32Array(hf['data' as never] as unknown as Float32Array),
      cols: 129,
      rows: 129,
      sizeX: 32,
      sizeY: 32,
      points: [
        [-10, 0],
        [0, 4],
        [10, -2],
      ] as [number, number][],
      samples: 512,
    };
    const r1 = runRouteJob(job);
    const r2 = runRouteJob(job);
    expect(Buffer.from(r1.data.buffer).equals(Buffer.from(r2.data.buffer))).toBe(true);
    expect(r1.maxResidual).toBeLessThan(0.003);
  });
});
