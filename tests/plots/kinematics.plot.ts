// Kinematik senaryolarının yan görünüş SVG şekilleri (docs/kinematik/*.svg).
// Çalıştırma: npm run plots   (PLOTS=1 ile vitest bu dosyayı da dahil eder)
import { mkdirSync, writeFileSync } from 'node:fs';
import { it } from 'vitest';
import { Heightfield } from '@/lib/heightfield';
import { bodyToWorld, type Vec3 } from '@/lib/frames';
import { rover2027Geometry, summertechGeometry, type RoverGeometry } from '@/scene/rover/geometry';
import { solvePose, type RoverPose } from '@/scene/rover/kinematics';

const OUT = 'docs/kinematik';
const deg = (r: number) => ((r * 180) / Math.PI).toFixed(1);

interface Scenario {
  file: string;
  title: string;
  g: RoverGeometry;
  terrain: (x: number, y: number) => number;
}

const g6 = rover2027Geometry();
const t = (d: number) => Math.tan((d * Math.PI) / 180);
const SCENARIOS: Scenario[] = [
  { file: '01-duz', title: 'Düz zemin', g: g6, terrain: () => 0 },
  {
    file: '02-basamak-10cm',
    title: 'Sol ön teker altında 10 cm basamak',
    g: g6,
    terrain: (x, y) => (x > 0.3 && x < 0.62 && y > 0.2 ? 0.1 : 0),
  },
  { file: '03-yokus-15', title: '15° yokuş', g: g6, terrain: (x) => x * t(15) },
  {
    file: '04-basamak-45cm',
    title: '45 cm basamak (limit içinde)',
    g: g6,
    terrain: (x, y) => (x > 0.3 && x < 1.5 && y > 0.2 ? 0.45 : 0),
  },
  {
    file: '05-basamak-60cm',
    title: '60 cm basamak: bogie limitte, teker boşta',
    g: g6,
    terrain: (x, y) => (x > 0.3 && y > 0.2 ? 0.6 : 0),
  },
  {
    file: '06-summertech-basamak',
    title: 'SummerTech: sol ön teker altında 4 cm',
    g: summertechGeometry,
    terrain: (x, y) => (x > 0.08 && x < 0.25 && y > 0.1 ? 0.04 : 0),
  },
];

const rot = (a: number, [x, z]: readonly [number, number]): [number, number] => [
  x * Math.cos(a) - z * Math.sin(a),
  x * Math.sin(a) + z * Math.cos(a),
];

/** Sol taraf mekanizma noktaları (dünya; yan görünüş x-z). */
function leftLinkage(g: RoverGeometry, p: RoverPose) {
  const a = p.rocker.left;
  const piv: Vec3 = [g.pivot.x, g.pivot.y, g.pivot.z];
  const W = (b: Vec3) => bodyToWorld(b, p.position, p.yaw, p.pitch, p.roll);
  const f = rot(a, g.rockerFront);
  const pts: Record<string, Vec3> = { P: W(piv), F: W([piv[0] + f[0], g.wheelY, piv[2] + f[1]]) };
  if (g.kind === 'rocker-bogie') {
    const b = rot(a, g.rockerToBogie);
    const beta = a + p.bogie!.left;
    const m = rot(beta, g.bogieMiddle);
    const r = rot(beta, g.bogieRear);
    pts.B = W([piv[0] + b[0], g.pivot.y, piv[2] + b[1]]);
    pts.M = W([piv[0] + b[0] + m[0], g.wheelY, piv[2] + b[1] + m[1]]);
    pts.R = W([piv[0] + b[0] + r[0], g.wheelY, piv[2] + b[1] + r[1]]);
  } else {
    const r = rot(a, g.rockerRear);
    pts.R = W([piv[0] + r[0], g.wheelY, piv[2] + r[1]]);
  }
  return pts;
}

function svg(s: Scenario, p: RoverPose): string {
  const g = s.g;
  const hf = Heightfield.fromFunction(s.terrain, 513, 8);
  const span = g.kind === 'rocker-bogie' ? [-0.9, 1.0] : [-0.35, 0.4];
  const W = 720;
  const H = 360;
  const scale = W / (span[1]! - span[0]!);
  const zMin = -0.05;
  const X = (x: number) => (x - span[0]!) * scale;
  const Z = (z: number) => H - 40 - (z - zMin) * scale;
  const L = leftLinkage(g, p);
  const body = [
    [0.35, 0.1],
    [-0.35, 0.1],
    [-0.35, -0.1],
    [0.35, -0.1],
  ]
    .map(([bx, bz]) => (g.kind === 'rocker-bogie' ? [bx!, bz!] : [bx! * 0.45, bz! * 0.5]))
    .map(([bx, bz]) => bodyToWorld([bx!, 0, bz!], p.position, p.yaw, p.pitch, 0));
  // Arazi profili: sol tekerlek hattında (y = +wheelY)
  let terrain = '';
  for (let i = 0; i <= 400; i++) {
    const x = span[0]! + ((span[1]! - span[0]!) * i) / 400;
    terrain += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Z(hf.sample(x, g.wheelY)).toFixed(1)} `;
  }
  terrain += `L${W} ${H} L0 ${H} Z`;
  const line = (a: Vec3, b: Vec3, cls: string) =>
    `<line class="${cls}" x1="${X(a[0]).toFixed(1)}" y1="${Z(a[2]).toFixed(1)}" x2="${X(b[0]).toFixed(1)}" y2="${Z(b[2]).toFixed(1)}"/>`;
  const wheelIds = g.kind === 'rocker-bogie' ? ['FL', 'ML', 'RL'] : ['FL', 'RL'];
  const wheels = p.wheels
    .filter((w) => wheelIds.includes(w.id))
    .map((w) => {
      const air = !w.inContact;
      return (
        `<circle class="wheel${air ? ' air' : ''}" cx="${X(w.center[0]).toFixed(1)}" cy="${Z(w.center[2]).toFixed(1)}" r="${(g.wheelRadius * scale).toFixed(1)}"/>` +
        `<circle class="hub" cx="${X(w.center[0]).toFixed(1)}" cy="${Z(w.center[2]).toFixed(1)}" r="3"/>`
      );
    });
  const links = [line(L.P!, L.F!, 'rocker')];
  if (L.B) links.push(line(L.P!, L.B, 'rocker'), line(L.B, L.M!, 'bogie'), line(L.B, L.R!, 'bogie'));
  else links.push(line(L.P!, L.R!, 'rocker'));
  const info = [
    `pitch ${deg(p.pitch)}°  roll ${deg(p.roll)}°`,
    `rocker sol ${deg(p.rocker.left)}° / sağ ${deg(p.rocker.right)}°`,
    p.bogie ? `bogie sol ${deg(p.bogie.left)}° / sağ ${deg(p.bogie.right)}°` : 'bogie yok (4 tekerlek)',
    `en büyük temas artığı ${(Math.max(...p.wheels.map((w) => Math.abs(w.gap))) * 1000).toFixed(1)} mm` +
      (p.limits.rockerClamped || p.limits.bogieClamped ? '  ·  EKLEM LİMİTTE' : ''),
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="monospace" font-size="12">
<style>
 .bg{fill:#07090C}.ground{fill:#1A2029;stroke:#5F646A;stroke-width:1}
 .body{fill:none;stroke:#A3ADBA;stroke-width:1.5}.rocker{stroke:#E7AD01;stroke-width:4;stroke-linecap:round}
 .bogie{stroke:#D15B09;stroke-width:4;stroke-linecap:round}.wheel{fill:none;stroke:#E8ECF1;stroke-width:2}
 .wheel.air{stroke:#E5484D;stroke-dasharray:4 3}.hub{fill:#E8ECF1}.pivot{fill:#07090C;stroke:#E7AD01;stroke-width:2}
 text{fill:#A3ADBA}.title{fill:#E8ECF1;font-size:14}
</style>
<rect class="bg" width="${W}" height="${H}"/>
<path class="ground" d="${terrain}"/>
<polygon class="body" points="${body.map((b) => `${X(b[0]).toFixed(1)},${Z(b[2]).toFixed(1)}`).join(' ')}"/>
${links.join('\n')}
${wheels.join('\n')}
<circle class="pivot" cx="${X(L.P![0]).toFixed(1)}" cy="${Z(L.P![2]).toFixed(1)}" r="5"/>
${L.B ? `<circle class="pivot" cx="${X(L.B[0]).toFixed(1)}" cy="${Z(L.B[2]).toFixed(1)}" r="4"/>` : ''}
<text class="title" x="16" y="24">${s.title}</text>
${info.map((t, i) => `<text x="16" y="${46 + i * 16}">${t}</text>`).join('\n')}
<text x="${W - 16}" y="${H - 12}" text-anchor="end">sol taraf, yan görünüş · sarı: rocker · turuncu: bogie · kırmızı kesik: temas yok</text>
</svg>
`;
}

it('kinematik şekilleri üret', () => {
  mkdirSync(OUT, { recursive: true });
  for (const s of SCENARIOS) {
    const hf = Heightfield.fromFunction(s.terrain, 257, 8);
    const p = solvePose(s.g, hf, 0, 0, 0);
    writeFileSync(`${OUT}/${s.file}.svg`, svg(s, p));
  }
});
