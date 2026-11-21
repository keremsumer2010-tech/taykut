import { Page } from '@/layout/Page';
import { Engineering } from '@/sections/Engineering';
import { Hero } from '@/sections/Hero';
import { Inspect } from '@/sections/Inspect';
import { Journey } from '@/sections/Journey';
import { Missions } from '@/sections/Missions';
import { Sponsor } from '@/sections/Sponsor';
import { Station } from '@/sections/Station';
import { Stats } from '@/sections/Stats';
import { Team } from '@/sections/Team';

/** Ana sayfa. Bölüm sırası anayasadaki bilgi mimarisini izler. */
export function App() {
  return (
    <Page rail>
      <Hero />
      <Inspect />
      <Missions />
      <Stats />
      <Engineering />
      <Station />
      <Journey />
      <Team />
      <Sponsor />
    </Page>
  );
}
