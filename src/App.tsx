import { Page } from '@/layout/Page';
import { Stage } from '@/sections/Stage';

/** Ana sayfa: yalnız tam ekran sinematik sahne (kullanıcı isteği, 2026-11-22).
 *  Rover, Görevler, Mühendislik, Yer İstasyonu, Takım, Sponsor ve Basın menüden ayrı sayfalarda açılır. */
export function App() {
  return (
    <Page>
      <Stage />
    </Page>
  );
}
