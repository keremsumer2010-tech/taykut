// Ana sayfa açılışı: derin uzaydan Dünya'ya, oradan Arizona'ya dalış (~16 sn), sonra krater sahnesine geçiş.
// Gerçek veri: Yale Bright Star Catalogue (9.096 yıldız, kadir ve B−V renk), NASA Blue Marble (gündüz),
// NASA Black Marble (gece ışıkları), Solar System Scope bulutları (CC BY 4.0). Birim: km; Dünya merkezde.
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

export interface IntroTelemetry {
  phase: number; // 0 derin uzay, 1 yaklaşma, 2 iniş, 3 atmosfer
  altitudeKm: number;
  /** Kameranın altındaki yer noktası (enlem, boylam; derece) */
  lat: number;
  lon: number;
}

export interface IntroOptions {
  base: string;
  onTelemetry?: (t: IntroTelemetry) => void;
  /** Haze tamamen kapladığında çağrılır: krater sahnesi bu anda açılır. */
  onHandoff?: () => void;
  /** Haze rengi (krater ufuk rengiyle aynı: geçiş dikişsiz). */
  hazeColor?: string;
  /** İnceleme: açılışı bu saniyede dondur (?it=6). */
  fixedTime?: number | undefined;
}

export const INTRO_S = 16;
const R = 6371; // km
const CRATER = { lat: 35.0274, lon: -111.0228 };
// 22 Kasım: Güneş yaklaşık −20° enlemin üstünde (deklinasyon); boylam, Arizona'da ikindi olacak şekilde seçildi
const SUBSOLAR = { lat: -20.2, lon: -140 }; // Arizona'da güneş ≈ 28° (ikindi)

/** Enlem/boylam → SphereGeometry doku düzeniyle uyumlu birim vektör (u=0: boylam −180°). */
export function geoDir(latDeg: number, lonDeg: number, out = new THREE.Vector3()) {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const phi = THREE.MathUtils.degToRad(lonDeg + 180);
  return out.set(-Math.cos(phi) * Math.cos(lat), Math.sin(lat), Math.sin(phi) * Math.cos(lat)).normalize();
}

const smooth = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** B−V renk indisinden yaklaşık yıldız rengi (Ballesteros sıcaklığı → siyah cisim yaklaşımı). */
function starColor(bv: number, out: THREE.Color) {
  const t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));
  const k = t / 100;
  let r: number, g: number, b: number;
  if (k <= 66) {
    r = 255;
    g = 99.47 * Math.log(k) - 161.12;
    b = k <= 19 ? 0 : 138.52 * Math.log(k - 10) - 305.04;
  } else {
    r = 329.7 * (k - 60) ** -0.1332;
    g = 288.12 * (k - 60) ** -0.0755;
    b = 255;
  }
  const c = (v: number) => Math.min(Math.max(v, 0), 255) / 255;
  // Gözün gördüğü gibi hafif doygunluk azaltma (yıldızlar soluk renkli görünür)
  out.setRGB(c(r), c(g), c(b), THREE.SRGBColorSpace).lerp(new THREE.Color(1, 1, 1), 0.35);
  return out;
}

const GLSL_NOISE = /* glsl */ `
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.07; a *= 0.5; } return s; }
`;

// Galaktik kuzey kutbu ve galaktik merkez (J2000 ekvatoral) → three gök küresi
function eqDir(raDeg: number, decDeg: number) {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const de = THREE.MathUtils.degToRad(decDeg);
  return new THREE.Vector3(Math.cos(de) * Math.cos(ra), Math.sin(de), -Math.cos(de) * Math.sin(ra));
}
const NGP = eqDir(192.859, 27.128);
const GC = eqDir(266.405, -28.936);

function glowTexture(inner: string, outer: string, size = 256) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ringTexture(size = 256) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.36, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, 'rgba(160,200,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function startSpaceIntro(container: HTMLElement, opts: IntroOptions) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(max-width: 768px)').matches ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
  const small = matchMedia('(max-width: 860px)').matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000000');
  const camera = new THREE.PerspectiveCamera(40, 1, 1, 400000);
  const sunDir = geoDir(SUBSOLAR.lat, SUBSOLAR.lon);
  const P = geoDir(CRATER.lat, CRATER.lon); // krater yönü (Dünya yüzeyinde)

  // ---- doku ve katalog yükleme
  const tl = new THREE.TextureLoader();
  const tex = (name: string, srgb = true) =>
    tl.loadAsync(`${opts.base}space/${name}`).then((t) => {
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 8;
      return t;
    });
  const [day, night, clouds, water, region, starBuf] = await Promise.all([
    tex(small ? 'earth-day-2k.webp' : 'earth-day-4k.webp'),
    tex('earth-night-2k.webp'),
    tex('earth-clouds-2k.webp', false),
    tex('earth-water-1k.webp', false),
    tex('earth-arizona.webp'),
    fetch(`${opts.base}space/stars.bin`).then((r) => r.arrayBuffer()),
  ]);

  // ---- yıldızlar: gerçek katalog + galaktik düzlemde yoğunlaşan sönük alan yıldızları
  const cat = new Float32Array(starBuf);
  const nCat = cat.length / 5;
  const nFaint = small ? 14000 : 28000;
  const total = nCat + nFaint;
  const sPos = new Float32Array(total * 3);
  const sCol = new Float32Array(total * 3);
  const sMag = new Float32Array(total);
  const c = new THREE.Color();
  for (let i = 0; i < nCat; i++) {
    sPos.set([cat[i * 5]!, cat[i * 5 + 1]!, cat[i * 5 + 2]!], i * 3);
    sMag[i] = cat[i * 5 + 3]!;
    starColor(cat[i * 5 + 4]!, c).toArray(sCol, i * 3);
  }
  {
    const e1 = GC.clone();
    const e2 = new THREE.Vector3().crossVectors(NGP, GC).normalize();
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let k = 0; k < nFaint; k++) {
      const i = nCat + k;
      const l = rnd() * Math.PI * 2;
      // Düzleme yakın yoğunluk: yarısı dar bantta, yarısı geniş
      const g = (rnd() + rnd() + rnd() - 1.5) * (rnd() < 0.55 ? 0.18 : 0.9);
      const v = e1
        .clone()
        .multiplyScalar(Math.cos(l) * Math.cos(g))
        .addScaledVector(e2, Math.sin(l) * Math.cos(g))
        .addScaledVector(NGP, Math.sin(g));
      v.toArray(sPos, i * 3);
      sMag[i] = 6.4 + rnd() * 2.6;
      starColor(rnd() * 1.6 - 0.1, c).toArray(sCol, i * 3);
    }
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
  starGeo.setAttribute('mag', new THREE.BufferAttribute(sMag, 1));
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { scale: { value: 1 }, time: { value: 0 }, fade: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float mag; attribute vec3 color;
      uniform float scale; uniform float time;
      varying vec3 vCol; varying float vB;
      void main() {
        float flux = pow(10.0, -0.4 * (mag - 1.0));        // kadir → akı
        float tw = 0.85 + 0.15 * sin(time * 2.3 + position.x * 913.0 + position.y * 517.0);
        vB = clamp(flux * 3.0, 0.55, 8.0) * tw;
        vCol = color;
        vec4 mv = modelViewMatrix * vec4(position * 150000.0, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_Position.z = gl_Position.w * 0.9999;
        gl_PointSize = clamp((2.6 + sqrt(flux) * 4.0) * scale, 2.2, 18.0 * scale);
      }`,
    fragmentShader: /* glsl */ `
      uniform float fade;
      varying vec3 vCol; varying float vB;
      void main() {
        vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
        float core = exp(-r * r * 9.0);
        float halo = exp(-r * 3.5) * 0.25;
        float a = (core + halo) * min(vB, 2.0) * fade;
        if (a < 0.003) discard;
        gl_FragColor = vec4(vCol * a, 1.0); // toplamalı: alfa ikinci kez çarpılmasın
      }`,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  // ---- Samanyolu: galaktik düzlem boyunca bant, toz şeritleri (gök küresi)
  const milky = new THREE.Mesh(
    new THREE.SphereGeometry(180000, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: { ngp: { value: NGP }, gc: { value: GC }, fade: { value: 1 } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
      fragmentShader:
        GLSL_NOISE +
        /* glsl */ `
        uniform vec3 ngp; uniform vec3 gc; uniform float fade;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float b = asin(clamp(dot(d, ngp), -1.0, 1.0));
          float l = acos(clamp(dot(normalize(d - ngp * dot(d, ngp)), gc), -1.0, 1.0));
          float band = exp(-pow(b / 0.16, 2.0)) + 0.35 * exp(-pow(b / 0.42, 2.0));
          float core = 0.55 + 0.9 * exp(-pow(l / 0.9, 2.0));            // galaktik merkeze doğru parlak
          float n = fbm(d * 7.0) * 0.7 + fbm(d * 23.0) * 0.3;
          float dust = smoothstep(0.42, 0.68, fbm(d * 11.0 + 3.0)) * exp(-pow(b / 0.06, 2.0));
          float v = band * core * (0.45 + n) * (1.0 - 0.85 * dust);
          vec3 col = mix(vec3(0.55, 0.62, 0.85), vec3(1.0, 0.86, 0.68), exp(-pow(l / 1.1, 2.0))) * v * 0.6 * fade;
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  milky.frustumCulled = false;
  scene.add(milky);

  // ---- Güneş ve mercek parlaması (Dünya önüne geçince parlama kendiliğinden kaybolur)
  const sunLight = new THREE.PointLight('#fff4e5', 0);
  const flare = new Lensflare();
  flare.addElement(
    new LensflareElement(
      glowTexture('rgba(255,255,255,1)', 'rgba(255,220,170,0.25)', 512),
      420,
      0,
      new THREE.Color(1, 1, 1),
    ),
  );
  flare.addElement(new LensflareElement(ringTexture(), 120, 0.35));
  flare.addElement(
    new LensflareElement(glowTexture('rgba(150,190,255,0.5)', 'rgba(80,120,255,0.05)'), 90, 0.6),
  );
  flare.addElement(
    new LensflareElement(glowTexture('rgba(255,200,140,0.4)', 'rgba(255,160,80,0.04)'), 140, 0.85),
  );
  flare.addElement(new LensflareElement(ringTexture(), 180, 1.0));
  sunLight.add(flare);
  sunLight.position.copy(sunDir).multiplyScalar(140000);
  scene.add(sunLight);

  // ---- Dünya
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      dayMap: { value: day },
      nightMap: { value: night },
      waterMap: { value: water },
      regionMap: { value: region },
      cloudMap: { value: clouds },
      sunDir: { value: sunDir },
      cloudOffset: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main() {
        vUv = uv; vN = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D waterMap; uniform sampler2D cloudMap;
      uniform sampler2D regionMap;
      uniform vec3 sunDir; uniform float cloudOffset;
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main() {
        vec3 n = normalize(vN); vec3 v = normalize(cameraPosition - vW); vec3 l = normalize(sunDir);
        float ndl = dot(n, l);
        vec3 dayC = texture2D(dayMap, vUv).rgb;
        // Krater çevresi 2°×2° (34–36°K, 110–112°B): Copernicus DEM rölyefi (≈108 m/piksel), kenarda yumuşak geçiş
        float lon = vUv.x * 360.0 - 180.0; float lat = vUv.y * 180.0 - 90.0;
        vec2 ruv = vec2((lon + 112.0) / 2.0, (lat - 34.0) / 2.0);
        float edge = min(min(ruv.x, 1.0 - ruv.x), min(ruv.y, 1.0 - ruv.y));
        if (edge > 0.0) dayC = mix(dayC, texture2D(regionMap, ruv).rgb, smoothstep(0.0, 0.18, edge));
        float water = texture2D(waterMap, vUv).r;
        // Bulut gölgesi: bulut dokusunu güneş yönünde hafifçe kaydırarak örnekle
        float cs = texture2D(cloudMap, vUv + vec2(cloudOffset - 0.0015, 0.0008)).r;
        float lit = smoothstep(-0.08, 0.35, ndl);
        vec3 col = dayC * (0.015 + 1.25 * max(ndl, 0.0)) * (1.0 - 0.45 * cs * lit);
        // Alacakaranlık: gece-gündüz sınırında turuncu kızıllık
        float twilight = exp(-pow(ndl / 0.12, 2.0));
        col += vec3(0.9, 0.42, 0.18) * twilight * 0.08;
        // Gece ışıkları (yalnız karanlık tarafta, bulut altında sönük)
        vec3 lights = texture2D(nightMap, vUv).rgb;
        col += lights * vec3(1.0, 0.82, 0.55) * smoothstep(0.05, -0.2, ndl) * 1.9 * (1.0 - 0.6 * cs);
        // Okyanus parıltısı (güneş yansıması yalnız suda)
        vec3 h = normalize(l + v);
        col += vec3(1.0, 0.93, 0.8) * pow(max(dot(n, h), 0.0), 90.0) * water * 0.9 * lit;
        // Atmosferin yüzeye düşen mavisi (kenarlarda güçlü)
        float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        col += vec3(0.2, 0.45, 1.0) * fres * (0.04 + 0.9 * lit) * 0.3;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, small ? 128 : 192, small ? 96 : 128), earthMat);
  scene.add(earth);

  const cloudMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { cloudMap: { value: clouds }, sunDir: { value: sunDir }, cloudOffset: { value: 0 } },
    vertexShader: earthMat.vertexShader,
    fragmentShader: /* glsl */ `
      uniform sampler2D cloudMap; uniform vec3 sunDir; uniform float cloudOffset;
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main() {
        vec3 n = normalize(vN); float ndl = dot(n, normalize(sunDir));
        float c = texture2D(cloudMap, vUv + vec2(cloudOffset, 0.0)).r;
        float lit = smoothstep(-0.12, 0.3, ndl);
        vec3 col = mix(vec3(0.02, 0.025, 0.04), vec3(1.0, 0.98, 0.96) * (0.25 + 1.1 * max(ndl, 0.0)), lit);
        col = mix(col, vec3(1.0, 0.6, 0.35), exp(-pow(ndl / 0.1, 2.0)) * 0.35);
        gl_FragColor = vec4(col, c * 0.92);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const cloudSphere = new THREE.Mesh(new THREE.SphereGeometry(R + 14, 128, 96), cloudMat);
  scene.add(cloudSphere);

  // Atmosfer kabuğu: kenar halesi; güneşe karşı bakınca (gün doğumu) parlar
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.028, 128, 96),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { sunDir: { value: sunDir } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vW;
        void main() { vN = normalize((modelMatrix * vec4(normal, 0.0)).xyz); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 sunDir; varying vec3 vN; varying vec3 vW;
        void main() {
          vec3 n = normalize(vN); vec3 v = normalize(cameraPosition - vW); vec3 l = normalize(sunDir);
          float rim = pow(clamp(1.0 + dot(v, n), 0.0, 1.0), 3.0);
          float day = smoothstep(-0.35, 0.4, dot(n, l));
          float forward = pow(max(dot(-v, l), 0.0), 8.0);          // güneş arkadayken ileri saçılma
          vec3 col = vec3(0.22, 0.5, 1.0) * rim * (0.05 + 0.75 * day) + vec3(1.0, 0.55, 0.28) * rim * forward * 1.6;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  scene.add(atmo);

  // ---- haze katmanı (atmosfere giriş): tam ekran dörtgen, kamerada
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { color: { value: new THREE.Color(opts.hazeColor ?? '#e7c39a') }, amount: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: /* glsl */ `
        uniform vec3 color; uniform float amount; varying vec2 vUv;
        void main() {
          float v = length(vUv - 0.5) * 1.4;
          gl_FragColor = vec4(color, clamp(amount * (0.85 + 0.3 * v), 0.0, 1.0));
          #include <colorspace_fragment>
        }`,
    }),
  );
  haze.frustumCulled = false;
  haze.renderOrder = 999;
  scene.add(haze);

  // ---- kamera yolu: anahtar kareler (yön + irtifa); irtifa logaritmik aradeğerlenir
  const north = new THREE.Vector3(0, 1, 0);
  const east = new THREE.Vector3().crossVectors(north, P).normalize();
  // Güneş Dünya'nın tam kenarında (açısal yarıçap ≈ 6,3°): "elmas yüzük" anı, sonra yörüngede belirir
  const behind = sunDir.clone().negate().addScaledVector(north, 0.1).normalize();
  const mid = behind.clone().lerp(P, 0.55).normalize();
  const approach = P.clone().addScaledVector(east, 0.32).addScaledVector(north, -0.12).normalize();
  const KEYS = [
    { t: 0, dir: behind, alt: 52000 },
    { t: 4.8, dir: mid, alt: 26000 },
    { t: 9.2, dir: approach, alt: 9000 },
    { t: 13.2, dir: P.clone().addScaledVector(east, 0.004).normalize(), alt: 140 },
    { t: INTRO_S, dir: P, alt: 6 },
  ];
  const tmpDir = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const up = new THREE.Vector3();
  function camAt(t: number) {
    let k = 0;
    while (k < KEYS.length - 2 && t > KEYS[k + 1]!.t) k++;
    const a = KEYS[k]!;
    const b = KEYS[k + 1]!;
    const u = smooth((t - a.t) / (b.t - a.t));
    tmpDir.copy(a.dir).lerp(b.dir, u).normalize();
    const alt = Math.exp(Math.log(a.alt) + (Math.log(b.alt) - Math.log(a.alt)) * u);
    camera.position.copy(tmpDir).multiplyScalar(R + alt);
    // Bakış: önce Dünya merkezine, inişte krater noktasına ve ufka
    const w = smooth((t - 8) / 6);
    const surf = P.clone().multiplyScalar(R);
    const horizon = surf
      .clone()
      .addScaledVector(east, -alt * 2.2)
      .addScaledVector(north, alt * 0.6);
    lookAt.set(0, 0, 0).lerp(surf.lerp(horizon, smooth((t - 12.5) / 3) * 0.85), w);
    up.copy(north)
      .lerp(P, smooth((t - 10) / 4))
      .normalize();
    camera.up.copy(up);
    camera.lookAt(lookAt);
    // Geniş ekranda Dünya kadrajın sağında (başlık solda); inişte merkeze döner
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const shift = vw / vh > 1 ? (1 - smooth((t - 9) / 3)) * 0.2 : 0;
    camera.setViewOffset(vw, vh, -vw * shift, 0, vw, vh);
    return alt;
  }

  // ---- döngü
  const clock = new THREE.Clock();
  let t = 0;
  let raf = 0;
  let handed = false;
  let lastTel = 0;
  // Yavaş cihaz koruması: ilk 20 karenin ortalaması < 12 kare/sn ise doğrudan atmosfere girişe atla
  let probeN = 0;
  let probeSum = 0;
  function frame() {
    const raw = clock.getDelta();
    const dt = Math.min(raw, 0.05);
    if (probeN < 20 && opts.fixedTime === undefined) {
      if (probeN > 2) probeSum += raw; // ilk kareler derleme/yükleme içerir
      probeN++;
      if (probeN === 20 && probeSum / 17 > 1 / 12) t = Math.max(t, INTRO_S - 1.6);
    }
    t = opts.fixedTime ?? t + dt;
    const alt = camAt(Math.min(t, INTRO_S));
    starMat.uniforms.time!.value = t;
    // Atmosfere girince yıldızlar ve Samanyolu söner
    const sky = 1 - smooth((180 - alt) / 160);
    starMat.uniforms.fade!.value = sky;
    milky.material.uniforms.fade!.value = sky;
    earthMat.uniforms.cloudOffset!.value = t * 0.0006;
    cloudMat.uniforms.cloudOffset!.value = t * 0.0006;
    // Pus: alçak irtifada yoğunlaşır (uydu dokusunun bulanıklığı görünmez), sonunda tamamen kaplar
    const hz = Math.max(smooth((t - (INTRO_S - 1.6)) / 1.4), smooth((120 - alt) / 114) * 0.55);
    (haze.material as THREE.ShaderMaterial).uniforms.amount!.value = hz;
    renderer.render(scene, camera);
    if (opts.onTelemetry && t - lastTel > 0.1) {
      lastTel = t;
      opts.onTelemetry({
        phase: t < 4.8 ? 0 : t < 9.2 ? 1 : t < INTRO_S - 1.6 ? 2 : 3,
        altitudeKm: alt,
        lat: THREE.MathUtils.radToDeg(Math.asin(camera.position.y / camera.position.length())),
        lon: THREE.MathUtils.radToDeg(Math.atan2(camera.position.z, -camera.position.x)) - 180,
      });
    }
    if (!handed && hz >= 0.999) {
      handed = true;
      opts.onHandoff?.();
      return; // açılış biter, kaynaklar bırakılır (dispose çağıranın işi)
    }
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 58 : 40;
    camera.updateProjectionMatrix();
    starMat.uniforms.scale!.value = renderer.getPixelRatio();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  camAt(0);
  await renderer.compileAsync(scene, camera);

  return {
    play() {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    },
    /** Açılışı geç: atmosfere girişin son 1,6 sn'sine atla. */
    skip() {
      t = Math.max(t, INTRO_S - 1.6);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
