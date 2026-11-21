// Coğrafi koordinat biçimleme ve statik harita projeksiyonu.
import meta from '@/assets/map/worldmap.meta.json';

/** 51.4671, -112.706 → "51.47°N 112.71°W" (Türkçede K/G/D/B). */
export function formatLatLon(lat: number, lon: number, lang: 'tr' | 'en', digits = 2): string {
  const ns = lat >= 0 ? (lang === 'tr' ? 'K' : 'N') : lang === 'tr' ? 'G' : 'S';
  const ew = lon >= 0 ? (lang === 'tr' ? 'D' : 'E') : lang === 'tr' ? 'B' : 'W';
  const f = (n: number) => {
    const s = Math.abs(n).toFixed(digits);
    return lang === 'tr' ? s.replace('.', ',') : s;
  };
  return `${f(lat)}°${ns} ${f(lon)}°${ew}`;
}

/** Eşdikdörtgen statik harita üzerinde yüzde konum (tools/map/build_worldmap.mjs ile aynı projeksiyon). */
export function mapPosition(lat: number, lon: number): { x: number; y: number } {
  const clamped = Math.max(meta.latBottom, Math.min(meta.latTop, lat));
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((meta.latTop - clamped) / (meta.latTop - meta.latBottom)) * 100,
  };
}
