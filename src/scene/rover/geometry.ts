// Rover süspansiyon geometrisi (gövde çerçevesi: x ileri, y sol, z yukarı; orijin gövde merkezi; metre).
// 2027 rover: dijital ikizin rover_params.yaml dosyasından (src/content/rover2027.generated.json).
// SummerTech: fotoğraflardan oransal tahmin (tekerlek Ø10 cm cetvel alınarak), kind: 'estimate-from-photo'.
import rover2027 from '@/content/rover2027.generated.json';

export interface RockerBogieGeometry {
  kind: 'rocker-bogie';
  wheelRadius: number;
  /** Rocker pivotu (gövdeye bağlantı), sol taraf; sağ taraf y işareti ters. */
  pivot: { x: number; y: number; z: number };
  /** Tekerlek merkezlerinin yanal konumu (|y|). */
  wheelY: number;
  /** Rocker çerçevesinde (pivota göre, rocker açısı 0 iken) ön tekerlek merkezi ve bogie pivotu (x, z). */
  rockerFront: [number, number];
  rockerToBogie: [number, number];
  /** Bogie çerçevesinde (bogie pivotuna göre) orta ve arka tekerlek merkezleri (x, z). */
  bogieMiddle: [number, number];
  bogieRear: [number, number];
  rockerLimit: number;
  bogieLimit: number;
  /** Diferansiyel ara dişlisi dönüşü / rocker açısı (görsel). */
  diffRatio: number;
}

export interface RockerGeometry {
  kind: 'rocker';
  wheelRadius: number;
  pivot: { x: number; y: number; z: number };
  wheelY: number;
  /** Rocker çerçevesinde ön ve arka tekerlek merkezleri (x, z). */
  rockerFront: [number, number];
  rockerRear: [number, number];
  rockerLimit: number;
  diffRatio: number;
  /** Yalnız fotoğraftan tahmin edilen geometride. */
  source?: 'estimate-from-photo';
}

export type RoverGeometry = RockerBogieGeometry | RockerGeometry;

/** 2027 rover'ı (rover_params.yaml). wheel_count 4 olursa rocker varyantı kullanılır. */
export function rover2027Geometry(json = rover2027): RoverGeometry {
  const g = json.geometry;
  const pivot = { x: 0, y: g.rockerPivotY, z: g.rockerPivotZ };
  const wheelZrel = g.wheelZ - g.rockerPivotZ;
  if (json.wheelCount.value === 4) {
    const half = json.wheelbaseM.value / 2;
    return {
      kind: 'rocker',
      wheelRadius: g.wheelRadius,
      pivot,
      wheelY: g.wheelY,
      rockerFront: [half, wheelZrel],
      rockerRear: [-half, wheelZrel],
      rockerLimit: g.rockerLimitRad,
      diffRatio: g.diffRatio,
    };
  }
  return {
    kind: 'rocker-bogie',
    wheelRadius: g.wheelRadius,
    pivot,
    wheelY: g.wheelY,
    rockerFront: [g.rockerFrontDx, wheelZrel],
    rockerToBogie: [g.rockerBogieDx, g.bogiePivotZ - g.rockerPivotZ],
    bogieMiddle: [g.bogieHalfLength, g.wheelZ - g.bogiePivotZ],
    bogieRear: [-g.bogieHalfLength, g.wheelZ - g.bogiePivotZ],
    rockerLimit: g.rockerLimitRad,
    bogieLimit: g.bogieLimitRad,
    diffRatio: g.diffRatio,
  };
}

/**
 * SummerTech (MRC 2026): 4 tekerlek, diferansiyelli rocker. Fotoğraflardan oransal tahmin:
 * tekerlek Ø0.10 m; dingil mesafesi ≈ 3.0 tekerlek çapı; iz genişliği ≈ 3.4 çap;
 * rocker pivotu tekerlek merkezinin ≈ 0.85 çap üstünde (ters V profil). Fusion dosyası gelirse güncellenir.
 */
export const summertechGeometry: RockerGeometry = {
  kind: 'rocker',
  wheelRadius: 0.05,
  pivot: { x: 0, y: 0.13, z: 0.0 },
  wheelY: 0.17,
  rockerFront: [0.15, -0.085],
  rockerRear: [-0.15, -0.085],
  rockerLimit: 0.45,
  diffRatio: 1,
  source: 'estimate-from-photo',
};
