import { Page } from '@/layout/Page';
import { Hero } from '@/sections/Hero';
import { Inspect } from '@/sections/Inspect';
import { Missions } from '@/sections/Missions';
import { SponsorCta } from '@/sections/SponsorCta';
import { Stats } from '@/sections/Stats';

/** Ana sayfa: sinematik akış (açılış → rover → Dünya turu ve görevler → rakamlar → sponsor).
 *  Mühendislik, Yer İstasyonu, Takım, Sponsor, Rover ve Basın menüden ayrı sayfalarda açılır. */
export function App() {
  return (
    <Page rail>
      <Hero />
      <Inspect />
      <Missions />
      <Stats />
      <SponsorCta />
    </Page>
  );
}
