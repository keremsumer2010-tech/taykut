// Tüm sayfaların tek kaydı: bileşen + başlık + açıklama. Tarayıcı girişleri (src/entries) ve
// önceden HTML üretimi (src/entry-server.tsx) bu kaydı kullanır; böylece ikisi asla ayrışmaz.
import type { ComponentType } from 'react';
import type { Content } from '@/content/schema';
import type { RouteId } from '@/lib/route';
import { App } from '@/App';
import { EngineeringPage } from './EngineeringPage';
import { MissionsPage } from './MissionsPage';
import { NotFoundPage } from './NotFoundPage';
import { PressPage } from './PressPage';
import { RoverPage } from './RoverPage';
import { SponsorPage } from './SponsorPage';
import { StationPage } from './StationPage';
import { TeamPage } from './TeamPage';

export interface PageDef {
  Component: ComponentType;
  /** null: ana sayfa (t.meta.title kullanılır) */
  title: ((t: Content) => string) | null;
  description: (t: Content) => string;
}

export const PAGES: Record<RouteId, PageDef> = {
  home: { Component: App, title: null, description: (t) => t.meta.description },
  rover: {
    Component: RoverPage,
    title: (t) => `${t.pages.rover.title} — TAYKUT`,
    description: (t) => t.pages.rover.lead,
  },
  gorevler: {
    Component: MissionsPage,
    title: (t) => `${t.nav.missions} — TAYKUT`,
    description: (t) => t.missions.lead ?? t.meta.description,
  },
  muhendislik: {
    Component: EngineeringPage,
    title: (t) => `${t.nav.engineering} — TAYKUT`,
    description: (t) => t.engineering.lead ?? t.meta.description,
  },
  istasyon: {
    Component: StationPage,
    title: (t) => `${t.nav.station} — TAYKUT`,
    description: (t) => t.station.lead ?? t.meta.description,
  },
  takim: {
    Component: TeamPage,
    title: (t) => `${t.nav.team} — TAYKUT`,
    description: (t) => t.team.lead ?? t.meta.description,
  },
  sponsor: {
    Component: SponsorPage,
    title: (t) => `${t.pages.sponsor.title} — TAYKUT`,
    description: (t) => t.pages.sponsor.lead,
  },
  basin: {
    Component: PressPage,
    title: (t) => `${t.pages.press.title} — TAYKUT`,
    description: (t) => t.pages.press.lead,
  },
  notfound: {
    Component: NotFoundPage,
    title: (t) => `404 — ${t.notFound.title}`,
    description: (t) => t.notFound.body,
  },
};
