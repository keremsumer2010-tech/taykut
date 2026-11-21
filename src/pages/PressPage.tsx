import { Button } from '@/components/Button';
import { HudFrame } from '@/components/HudFrame';
import { Logo } from '@/components/Logo';
import { useT } from '@/lib/i18n';
import { Page } from '@/layout/Page';
import { PageHeader } from './PageHeader';
import logoUrl from '@/assets/brand/summertech-logo.png';
import heroImg from '@/assets/photos/hero-regolit.jpg';
import nightImg from '@/assets/photos/gece-ahtapot.webp';
import twinImg from '@/assets/photos/dijital-ikiz.webp';
import s from './pages.module.css';

export function PressPage() {
  const t = useT();
  const p = t.pages.press;
  const photos = [
    { src: heroImg, alt: t.hero.imageAlt, w: 1200, h: 1600 },
    { src: nightImg, alt: t.inspect.imageAlt, w: 1800, h: 1350 },
    { src: twinImg, alt: t.engineering.twin.title, w: 1480, h: 920 },
  ];
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
              <li key={ph.src}>
                <a href={ph.src} download>
                  <img src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} loading="lazy" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}
