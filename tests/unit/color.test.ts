import { describe, expect, it } from 'vitest';
// @ts-expect-error -- tools/ altındaki .mjs dosyasının tip bildirimi yok; davranışı test ediyoruz.
import { contrast, hexToRgb, oklchToRgb, rgbToHex, rgbToOklch } from '../../tools/design/color.mjs';

describe('renk araçları', () => {
  it('WCAG kontrastı bilinen değerleri verir', () => {
    expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrast('#000000', '#000000')).toBeCloseTo(1, 5);
    // WebAIM referansı: #777777 beyaz üzerinde 4.48:1
    expect(contrast('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });

  it('sRGB → OKLCH → sRGB gidiş-dönüş marka renklerini korur', () => {
    for (const hex of ['#01234A', '#D15B09', '#E7AD01', '#07090C']) {
      expect(rgbToHex(oklchToRgb(rgbToOklch(hexToRgb(hex))))).toBe(hex);
    }
  });

  it('beyazın OKLCH açıklığı 1, kroması 0', () => {
    const [L, C] = rgbToOklch([1, 1, 1]);
    expect(L).toBeCloseTo(1, 4);
    expect(C).toBeCloseTo(0, 4);
  });
});
