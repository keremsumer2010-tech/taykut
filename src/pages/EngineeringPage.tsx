import { Page } from '@/layout/Page';
import { Engineering } from '@/sections/Engineering';
import { Button } from '@/components/Button';
import { pageHref } from '@/lib/links';
import { useT } from '@/lib/i18n';

/** /muhendislik/ — menüden açılan ayrı sayfa. */
export function EngineeringPage() {
  const t = useT();
  return (
    <Page>
      <Engineering page />
      <div className="container" style={{ paddingBottom: 'var(--section-gap)' }}>
        <Button href={pageHref('rover')} variant="secondary" icon="arrow-right">
          {t.pages.rover.title}
        </Button>
      </div>
    </Page>
  );
}
