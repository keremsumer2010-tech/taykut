// Dijital ikizin rover_params.yaml dosyasından sitede kullanılacak 2027 rover değerlerini çıkarır.
// `# VARSAYIM` yorumlu satırlar `kind: 'assumption'`, "KULLANICI KARARI" yorumlular `design-target` olur.
// Kullanım: node tools/rover/extract_params.mjs [yaml-yolu]
// Çıktı:    src/content/rover2027.generated.json
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_YAML = resolve(
  ROOT,
  '../Rover_Dijital_Ikiz/ros2_ws/src/taykut_description/config/rover_params.yaml',
);
const OUT = join(ROOT, 'src/content/rover2027.generated.json');

/** Bu projede gereken alt küme için yeterli, bağımlılıksız YAML okuyucu (yalnız `anahtar: değer` ve iç içe bloklar). */
export function parseYamlSubset(text) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    const m = raw.trim().match(/^([\w.-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).obj;
    // Yorum ya değerden sonra boşlukla (`1.0  # not`) ya da değer yokken doğrudan (`geometry: # not`) gelir.
    const commentIdx = rest.startsWith('#') ? 0 : rest.search(/\s#/);
    const valueText = (commentIdx >= 0 ? rest.slice(0, commentIdx) : rest).trim();
    const comment = commentIdx >= 0 ? rest.slice(commentIdx).replace(/^\s*#\s*/, '') : '';
    if (valueText === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
      continue;
    }
    let value;
    if (/^\[.*\]$/.test(valueText))
      value = valueText
        .slice(1, -1)
        .split(',')
        .map((v) => Number(v.trim()));
    else if (/^-?\d+(\.\d+)?$/.test(valueText)) value = Number(valueText);
    else value = valueText.replace(/^['"]|['"]$/g, '');
    parent[key] = { value, comment };
  }
  return root;
}

function kindOf(comment) {
  if (/VARSAYIM/i.test(comment)) return 'assumption';
  if (/KULLANICI KARARI/i.test(comment)) return 'design-target';
  return 'design-target'; // 2027 rover'ı tasarım aşamasında: kesin ölçüm değil
}

const pick = (node, unit) => ({
  value: node.value,
  unit,
  kind: kindOf(node.comment),
  source: 'rover2027-params',
});

export function extract(yamlText) {
  const p = parseYamlSubset(yamlText);
  return {
    $comment: 'OTOMATİK ÜRETİLDİ: tools/rover/extract_params.mjs — elle düzenleme. Kaynak: rover_params.yaml',
    wheelCount: pick(p.rover.wheel_count),
    suspension: pick(p.rover.suspension),
    steering: pick(p.rover.steering),
    totalMassKg: pick(p.rover.total_mass, 'kg'),
    wheelDiameterM: pick(p.wheel.diameter, 'm'),
    wheelWidthM: pick(p.wheel.width, 'm'),
    wheelbaseM: pick(p.geometry.wheelbase, 'm'),
    trackWidthM: pick(p.geometry.track_width, 'm'),
    bodySizeM: pick(p.geometry.body_size, 'm'),
    groundClearanceM: pick(p.geometry.ground_clearance, 'm'),
    motor: pick(p.drive.motor),
    maxWheelSpeedRadS: pick(p.drive.wheel_max_speed, 'rad/s'),
    batteryVoltageV: pick(p.drive.battery_voltage, 'V'),
    geometry: {
      rockerPivotZ: p.geometry.rocker_pivot_z.value,
      rockerPivotY: p.geometry.rocker_pivot_y.value,
      rockerFrontDx: p.geometry.rocker_front_dx.value,
      rockerBogieDx: p.geometry.rocker_bogie_dx.value,
      bogieHalfLength: p.geometry.bogie_half_length.value,
      bogiePivotZ: p.geometry.bogie_pivot_z.value,
      wheelZ: p.geometry.wheel_z.value,
      wheelY: p.geometry.wheel_y.value,
      wheelRadius: p.wheel.radius.value,
      diffRatio: p.geometry.diff_bar_ratio.value,
      rockerLimitRad: p.joints.rocker_limit.value,
      bogieLimitRad: p.joints.bogie_limit.value,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const yamlPath = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_YAML;
  const data = extract(readFileSync(yamlPath, 'utf8'));
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  const speed = data.maxWheelSpeedRadS.value * data.geometry.wheelRadius;
  console.log(`OK ${OUT}`);
  console.log(
    `  ${data.wheelCount.value} tekerlek, ${data.totalMassKg.value} kg hedef, azami ~${speed.toFixed(2)} m/s`,
  );
}
