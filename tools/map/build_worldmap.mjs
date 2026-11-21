// Natural Earth 1:110m kara verisinden (kamu malı) eşdikdörtgen projeksiyonlu SVG yol verisi üretir.
// Statik dünya haritası: 3D küre yüklenene kadar ve yedek modda (WebGL yok / reduced-motion).
// Kullanım: node tools/map/build_worldmap.mjs   (önce veri: bkz. aşağıdaki SOURCE_URL)
// Çıktı:    src/assets/map/worldmap.svg (kara) + src/assets/map/worldmap.meta.json (projeksiyon)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SOURCE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
const CACHE = 'tools/.cache/map/ne_110m_land.geojson';
const OUT_SVG = 'src/assets/map/worldmap.svg';
const OUT_META = 'src/assets/map/worldmap.meta.json';
const LAND = '#1A2029'; // --surface-3

// Görünür enlem aralığı: Antarktika'nın büyük kısmı ve kuzey kutbu kırpılır (görevler orada değil).
const LAT_TOP = 78;
const LAT_BOTTOM = -58;
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (LAT_TOP - LAT_BOTTOM)) / 360);

if (!existsSync(CACHE)) {
  console.error(`Veri yok: ${CACHE}\nİndir: curl -sSL -o ${CACHE} ${SOURCE_URL}`);
  process.exit(1);
}

export const project = (lon, lat) => [
  ((lon + 180) / 360) * WIDTH,
  ((LAT_TOP - Math.max(LAT_BOTTOM, Math.min(LAT_TOP, lat))) / (LAT_TOP - LAT_BOTTOM)) * HEIGHT,
];

const geo = JSON.parse(readFileSync(CACHE, 'utf8'));
const r1 = (n) => Math.round(n * 10) / 10;
let d = '';
let points = 0;
for (const f of geo.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      // Tamamen görünür alanın dışındaki halkaları at.
      if (ring.every(([, lat]) => lat < LAT_BOTTOM) || ring.every(([, lat]) => lat > LAT_TOP)) continue;
      let prev = '';
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat).map(r1);
        const key = `${x},${y}`;
        if (key === prev) return; // yuvarlama sonrası aynı nokta
        d += `${i === 0 ? 'M' : 'L'}${x} ${y}`;
        prev = key;
        points++;
      });
      d += 'Z';
    }
  }
}

mkdirSync('src/assets/map', { recursive: true });
writeFileSync(
  OUT_SVG,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">` +
    `<!-- Natural Earth 1:110m land, kamu malı. tools/map/build_worldmap.mjs -->` +
    `<path fill="${LAND}" d="${d}"/></svg>\n`,
);
writeFileSync(
  OUT_META,
  JSON.stringify({ width: WIDTH, height: HEIGHT, latTop: LAT_TOP, latBottom: LAT_BOTTOM }, null, 2) + '\n',
);
console.log(`OK ${OUT_SVG}: ${points} nokta, ${(d.length / 1024).toFixed(1)} KB, ${WIDTH}×${HEIGHT}`);
