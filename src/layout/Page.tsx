import type { ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { ProgressRail } from './ProgressRail';
import s from './layout.module.css';

/** Tüm sayfaların ortak iskeleti: içeriğe atla, üst çubuk, ana içerik, (ana sayfada) bölüm göstergesi, altbilgi. */
export function Page({ children, rail = false }: { children: ReactNode; rail?: boolean }) {
  const t = useT();
  return (
    <>
      <a className={s.skip} href="#main">
        {t.a11y.skipToContent}
      </a>
      <Nav />
      {rail && <ProgressRail />}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
