// Yükseklik alanı: düzenli ızgarada arazi yüksekliği, metre cinsinden.
// Koordinatlar yerel zemin çerçevesi: x doğu, y kuzey, z yukarı (ENU); orijin arazinin merkezi.
// Satır 0 = kuzey kenarı (+y), sütun 0 = batı kenarı (−x) — B11 heightmap PNG yönelimiyle aynı.
// Shader tarafı (B12) AYNI bilinear formülü kullanmalı; heightfield.test.ts bunu sabitler.

export class Heightfield {
  readonly cols: number;
  readonly rows: number;
  readonly sizeX: number;
  readonly sizeY: number;
  private readonly data: Float32Array;

  /**
   * @param data satır öncelikli yükseklikler (metre), uzunluk cols*rows
   * @param sizeX doğu-batı kenar uzunluğu (m), @param sizeY kuzey-güney kenar uzunluğu (m)
   */
  constructor(data: Float32Array, cols: number, rows: number, sizeX: number, sizeY: number = sizeX) {
    if (data.length !== cols * rows) throw new Error(`Heightfield: ${data.length} ≠ ${cols}×${rows}`);
    if (cols < 2 || rows < 2) throw new Error('Heightfield: en az 2×2 ızgara gerekir');
    this.data = data;
    this.cols = cols;
    this.rows = rows;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  /** Fonksiyondan ızgara üretir (testler ve prosedürel araziler için). */
  static fromFunction(fn: (x: number, y: number) => number, n: number, size: number): Heightfield {
    const data = new Float32Array(n * n);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const [x, y] = Heightfield.gridToWorld(c, r, n, n, size, size);
        data[r * n + c] = fn(x, y);
      }
    }
    return new Heightfield(data, n, n, size, size);
  }

  static gridToWorld(c: number, r: number, cols: number, rows: number, sx: number, sy: number) {
    return [(c / (cols - 1) - 0.5) * sx, (0.5 - r / (rows - 1)) * sy] as const;
  }

  private at(c: number, r: number): number {
    const cc = c < 0 ? 0 : c >= this.cols ? this.cols - 1 : c;
    const rr = r < 0 ? 0 : r >= this.rows ? this.rows - 1 : r;
    return this.data[rr * this.cols + cc]!;
  }

  /** Bilinear yükseklik. Alan dışında kenara kenetlenir. */
  sample(x: number, y: number): number {
    const fc = (x / this.sizeX + 0.5) * (this.cols - 1);
    const fr = (0.5 - y / this.sizeY) * (this.rows - 1);
    const c0 = Math.floor(fc);
    const r0 = Math.floor(fr);
    const tx = fc - c0;
    const ty = fr - r0;
    const h00 = this.at(c0, r0);
    const h10 = this.at(c0 + 1, r0);
    const h01 = this.at(c0, r0 + 1);
    const h11 = this.at(c0 + 1, r0 + 1);
    return (h00 * (1 - tx) + h10 * tx) * (1 - ty) + (h01 * (1 - tx) + h11 * tx) * ty;
  }

  /** Merkezi farkla yüzey normali (birim vektör, z yukarı). */
  normal(
    x: number,
    y: number,
    eps = Math.min(this.sizeX / (this.cols - 1), this.sizeY / (this.rows - 1)),
  ): [number, number, number] {
    const dx = (this.sample(x + eps, y) - this.sample(x - eps, y)) / (2 * eps);
    const dy = (this.sample(x, y + eps) - this.sample(x, y - eps)) / (2 * eps);
    const len = Math.hypot(dx, dy, 1);
    return [-dx / len, -dy / len, 1 / len];
  }

  /** Eğim açısı (radyan). */
  slope(x: number, y: number): number {
    return Math.acos(this.normal(x, y)[2]);
  }
}
