import { Page } from '@/layout/Page';
import { Team } from '@/sections/Team';
import { Journey } from '@/sections/Journey';

/** /takim/ — menüden açılan ayrı sayfa. */
export function TeamPage() {
  return (
    <Page>
      <Team page />
      <Journey />
    </Page>
  );
}
