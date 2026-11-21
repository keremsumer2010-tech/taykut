import { Button } from '@/components/Button';
import { useT } from '@/lib/i18n';
import { Page } from '@/layout/Page';
import { sectionHref } from '@/lib/links';
import s from './pages.module.css';

export function NotFoundPage() {
  const t = useT();
  return (
    <Page>
      <section className={`container ${s.notFound}`} aria-labelledby="nf-title">
        <p className={`t-label t-mono ${s.kicker}`}>404</p>
        <h1 id="nf-title" className="t-display">
          {t.notFound.title}
        </h1>
        <p className="t-lead">{t.notFound.body}</p>
        <Button href={sectionHref('top')} icon="arrow-right">
          {t.notFound.home}
        </Button>
      </section>
    </Page>
  );
}
