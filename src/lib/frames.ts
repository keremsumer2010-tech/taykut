// Çerçeve dönüşümleri — TEK yer. Kinematik ve arazi ENU'da (x doğu, y kuzey, z yukarı) çalışır;
// rover gövde çerçevesi ROS düzenidir (x ileri, y sol, z yukarı). three.js/glTF ise y yukarıdır.
// Eşleme: three = (x_doğu, z_yukarı, −y_kuzey). Böylece three'de −Z kuzeydir (kamera varsayılanı).

export type Vec3 = [number, number, number];

/** ENU (x doğu, y kuzey, z yukarı) → three.js (x, y yukarı, z güney). */
export function enuToThree([x, y, z]: Vec3): Vec3 {
  return [x, z, -y];
}

export function threeToEnu([x, y, z]: Vec3): Vec3 {
  return [x, -z, y];
}

/** Gövde çerçevesindeki noktayı (x ileri, y sol, z yukarı) dünyaya (ENU) taşır.
 *  Dönüş sırası: önce roll (x etrafında), sonra pitch, sonra yaw (z etrafında).
 *  İşaret kuralı (kinematik ve HUD aynı): pozitif pitch burnu (+x) YUKARI, pozitif roll sol tarafı (+y)
 *  YUKARI kaldırır. (Not: ROS'ta pozitif pitch burnu aşağı indirir; burada HUD okunurluğu için ters.) */
export function bodyToWorld(p: Vec3, pos: Vec3, yaw: number, pitch: number, roll: number): Vec3 {
  const [x0, y0, z0] = p;
  // roll: +x etrafında; pozitif roll sol tarafı (+y) yukarı kaldırır
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const x1 = x0;
  const y1 = y0 * cr - z0 * sr;
  const z1 = y0 * sr + z0 * cr;
  // pitch: pozitif değer burnu (+x) yukarı kaldırır
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const x2 = x1 * cp - z1 * sp;
  const y2 = y1;
  const z2 = x1 * sp + z1 * cp;
  // yaw: +z etrafında, doğudan saat yönü tersine (ENU)
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  return [pos[0] + x2 * cy - y2 * sy, pos[1] + x2 * sy + y2 * cy, pos[2] + z2];
}
