// Sitenin tüm metinlerinin tipi. tr.ts ve en.ts bu tipe `satisfies Content` ile uymak zorunda;
// eksik veya fazla anahtar derleme hatası verir. Dilden bağımsız veriler (isimler, sayılar,
// koordinatlar) ayrı dosyalarda durur: team.ts, facts.ts, regions.ts, contact.ts.

export type Lang = 'tr' | 'en';

/** Bir sayının doğruluk türü. Arayüzde sayının yanında not olarak görünür (dürüstlük ilkesi). */
export type Kind =
  | 'result' // gerçek yarışma sonucu
  | 'measured' // ölçüldü
  | 'calculated' // hesaplandı
  | 'estimate' // tahmin
  | 'design-target' // tasarım hedefi, değişebilir
  | 'assumption' // varsayım, doğrulanmadı
  | 'simulated'; // simülasyon sonucu

export type MissionStatus = 'competed' | 'target' | 'dream';

export interface Cta {
  label: string;
  /** Erişilebilir uzun açıklama (gerekirse). */
  aria?: string;
}

export interface SectionText {
  index: string; // "01"
  kicker: string; // "ROVER"
  title: string[]; // satır satır
  lead?: string;
}

export interface Content {
  meta: { title: string; description: string; ogAlt: string };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    switchTo: string; // "English" / "Türkçe"
    externalLink: string; // "(yeni sekmede açılır)"
    scrollDown: string;
  };
  kinds: Record<Kind, string>;
  /** Dile göre değişen birimler (facts.ts'teki `unit` anahtarları). "ordinal" i18n.ts'te biçimlenir. */
  units: { min: string };
  statuses: Record<MissionStatus, string>;
  nav: {
    rover: string;
    missions: string;
    engineering: string;
    station: string;
    team: string;
    sponsor: string;
  };
  hero: {
    kicker: string;
    title: string; // "TAYKUT"
    tagline: string[]; // satır satır
    lead: string;
    primary: Cta;
    secondary: Cta;
    imageAlt: string;
  };
  inspect: SectionText & {
    parts: Record<PartId, { name: string; spec: string }>;
    imageAlt: string;
  };
  missions: SectionText & {
    mapAlt: string;
    viewMission: string;
    coordinates: string;
    regions: Record<RegionId, { name: string; place: string; summary: string; steps: string[] }>;
  };
  stats: SectionText & {
    items: Record<StatId, string>; // etiketler; değerler facts.ts'te
  };
  engineering: SectionText & {
    systems: Record<SystemId, { name: string; body: string; points: string[] }>;
    twin: { title: string; body: string; proof: string };
  };
  station: SectionText & {
    features: string[];
    honesty: string;
    openDemo: string;
    videoAlt: string;
  };
  journey: SectionText & {
    now: string;
    items: { date: string; title: string; body: string }[];
  };
  team: SectionText & {
    captain: string;
    advisor: string;
    member: string;
  };
  sponsor: SectionText & {
    why: { title: string; body: string }[];
    tiers: Record<TierId, { name: string; body: string; perks: string[] }>;
    emptyWall: string;
    contactTitle: string;
    emailCta: string;
    instagramCta: string;
  };
  footer: {
    school: string;
    advisor: string;
    captain: string;
    attributions: string;
    license: string;
    shortcuts: string;
    rights: string;
  };
  notFound: { title: string; body: string; home: string };
  fallback: { noWebgl: string };
}

// ---- Kimlikler (dilden bağımsız) ----
export const PART_IDS = [
  'wheel',
  'rocker',
  'differential',
  'arm',
  'gripper',
  'drill',
  'camera',
  'pixhawk',
  'pi',
  'mega',
  'battery',
  'samples',
] as const;
export type PartId = (typeof PART_IDS)[number];

export const REGION_IDS = ['ankara', 'mrc2026', 'drumheller', 'alps', 'utah', 'mars'] as const;
export type RegionId = (typeof REGION_IDS)[number];

export const STAT_IDS = ['videoRank', 'finalRank', 'envelope', 'runtime', 'speed', 'brains'] as const;
export type StatId = (typeof STAT_IDS)[number];

export const SYSTEM_IDS = ['mechanical', 'electronics', 'software', 'arm', 'science'] as const;
export type SystemId = (typeof SYSTEM_IDS)[number];

export const TIER_IDS = ['drumheller', 'alpine', 'regolith', 'friend'] as const;
export type TierId = (typeof TIER_IDS)[number];
