import { describe, expect, it } from 'vitest';
// @ts-expect-error -- tools/ altındaki .mjs dosyasının tip bildirimi yok.
import { extract, parseYamlSubset } from '../../tools/rover/extract_params.mjs';

// rover_params.yaml biçiminin küçük bir kopyası (CI'da dijital ikiz deposu yok).
const FIXTURE = `
rover:
  wheel_count: 6                 # [YH] sabit karar
  suspension: rocker_bogie_differential
  steering: skid_steer
  total_mass: 15.0               # KULLANICI KARARI 2026-11-12
wheel:
  diameter: 0.250
  radius: 0.125
  width: 0.100                   # VARSAYIM: tipik
drive:
  motor: DJI_M3508_P19_24V
  wheel_max_speed: 49.11
  battery_voltage: 24.0
geometry:                        # Gövde çerçevesi: x ileri
  body_size: [0.70, 0.40, 0.20]  # VARSAYIM
  wheelbase: 0.90                # VARSAYIM
  track_width: 0.68
  ground_clearance: 0.30         # VARSAYIM
  rocker_pivot_z: 0.0
  rocker_pivot_y: 0.25           # VARSAYIM
  rocker_front_dx: 0.45
  rocker_bogie_dx: -0.225
  bogie_half_length: 0.225
  wheel_y: 0.34
  wheel_z: -0.275
  bogie_pivot_z: -0.12           # VARSAYIM
  diff_bar_ratio: 1.5
joints:
  rocker_limit: 0.52             # VARSAYIM: ±30°
  bogie_limit: 0.70              # VARSAYIM: ±40°
`;

describe('extract_params', () => {
  it('değer yokken doğrudan gelen yorumu blok başlığı sayar', () => {
    const p = parseYamlSubset(FIXTURE);
    expect(p.geometry.wheelbase.value).toBe(0.9);
    expect(p.geometry.body_size.value).toEqual([0.7, 0.4, 0.2]);
  });

  it('türleri yorumlardan çıkarır', () => {
    const d = extract(FIXTURE);
    expect(d.wheelCount.value).toBe(6);
    expect(d.totalMassKg).toMatchObject({ value: 15, unit: 'kg', kind: 'design-target' });
    expect(d.wheelbaseM.kind).toBe('assumption');
    expect(d.trackWidthM.kind).toBe('design-target');
    expect(d.geometry).toMatchObject({ wheelRadius: 0.125, bogiePivotZ: -0.12, rockerLimitRad: 0.52 });
  });
});
