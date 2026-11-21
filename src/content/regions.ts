// Görev bölgelerinin dilden bağımsız verisi. Metinler tr.ts/en.ts → missions.regions.
// Koordinatlar bölgenin temsil ettiği yerdir; görev arazisinin kesin merkezi B11'de veriden belirlenir.
import type { MissionStatus, RegionId } from './schema';

export interface Region {
  id: RegionId;
  order: number;
  status: MissionStatus;
  rover: 'summertech' | 'taykut2027';
  /** Yer adı bilinmiyorsa null (MRC 2026: konum doğrulanmadı, uydurulmaz). */
  geo: { lat: number; lon: number } | null;
  body: 'earth' | 'mars';
  source: string;
}

export const REGIONS: Region[] = [
  {
    id: 'ankara',
    order: 1,
    status: 'competed',
    rover: 'taykut2027',
    geo: { lat: 39.93, lon: 32.86 },
    body: 'earth',
    source: 'region-ankara',
  },
  {
    id: 'mrc2026',
    order: 2,
    status: 'competed',
    rover: 'summertech',
    geo: null,
    body: 'earth',
    source: 'mrc2026-final',
  },
  // CIRC Central = Badlands Community Facility; temsili arazi Midland Provincial Park badlands (dijital ikiz A1.1).
  {
    id: 'drumheller',
    order: 3,
    status: 'target',
    rover: 'taykut2027',
    geo: { lat: 51.4671, lon: -112.706 },
    body: 'earth',
    source: 'circ2027',
  },
  {
    id: 'alps',
    order: 4,
    status: 'target',
    rover: 'taykut2027',
    geo: { lat: 46.8, lon: 9.83 },
    body: 'earth',
    source: 'region-alps',
  },
  {
    id: 'utah',
    order: 5,
    status: 'dream',
    rover: 'taykut2027',
    geo: { lat: 38.4064, lon: -110.7919 },
    body: 'earth',
    source: 'region-utah',
  },
  {
    id: 'mars',
    order: 6,
    status: 'dream',
    rover: 'taykut2027',
    geo: { lat: 18.44, lon: 77.45 },
    body: 'mars',
    source: 'region-mars',
  },
];
