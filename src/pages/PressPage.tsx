import { Button } from '@/components/Button';
import { Picture, mediaInfo, type MediaName } from '@/components/Picture';
import { HudFrame } from '@/components/HudFrame';
import { Logo } from '@/components/Logo';
import { useT } from '@/lib/i18n';
import { Page } from '@/layout/Page';
import { PageHeader } from './PageHeader';
import logoUrl from '@/assets/brand/summertech-logo.png';
import s from './pages.module.css';

export function PressPage() {
  const t = useT();
  const p = t.pages.press;
  const photos: { name: MediaName; alt: string }[] = [
    { name: 'hero-regolit', alt: t.hero.imageAlt },
    { name: 'gece-ahtapot', alt: t.inspect.imageAlt },
    { name: 'dijital-ikiz', alt: t.engineering.twin.title },
  ];
  const full = (n: MediaName) => {
    const m = mediaInfo(n);
    return `${import.meta.env.BASE_URL}media/${n}-${m.width}.webp`;
  };
  return (
    <Page>
      <PageHeader kicker={t.footer.press} title={p.title} lead={p.lead} />
      <div className={`container ${s.body}`}>
        <section className={`grid ${s.block}`} aria-labelledby="short-title">
          <div className="span-6">
            <HudFrame title={p.shortTitle} meta="~50">
              <h2 id="short-title" className="sr-only">
                {p.shortTitle}
              </h2>
              <p className="t-body">{p.short}</p>
            </HudFrame>
          </div>
          <div className="span-6">
            <HudFrame title={p.longTitle} meta="~150">
              <h2 className="sr-only">{p.longTitle}</h2>
              <p className="t-body">{p.long}</p>
            </HudFrame>
          </div>
        </section>

        <section className={s.block} aria-labelledby="logo-title">
          <h2 id="logo-title" className="t-h2">
            {p.logoTitle}
          </h2>
          <p className="t-body">{p.logoNote}</p>
          <div className="cluster">
            <Logo height={48} />
            <Button href={logoUrl} download="summertech-logo.png" variant="secondary" icon="download">
              {p.downloadLogo}
            </Button>
          </div>
        </section>

        <section className={s.block} aria-labelledby="photos-title">
          <h2 id="photos-title" className="t-h2">
            {p.photosTitle}
          </h2>
          <p className="t-body">{p.photosNote}</p>
          <ul className={s.photos}>
            {photos.map((ph) => (
              <li key={ph.name}>
                <a href={full(ph.name)} download>
                  <Picture name={ph.name} alt={ph.alt} sizes="(min-width: 1024px) 33vw, 100vw" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}
