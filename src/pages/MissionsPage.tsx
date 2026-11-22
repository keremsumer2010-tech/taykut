import { Page } from '@/layout/Page';
import { Missions } from '@/sections/Missions';
import { Stats } from '@/sections/Stats';

/** /gorevler/ — yarışmalar ve rover'ın gideceği yerler, rakamlarla. Menüden açılır. */
export function MissionsPage() {
  return (
    <Page>
      <Missions page />
      <Stats />
    </Page>
  );
}
