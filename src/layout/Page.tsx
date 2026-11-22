import type { ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { Footer } from './Footer';
import { Nav } from './Nav';
import s from './layout.module.css';

/** Tüm sayfaların ortak iskeleti: içeriğe atla, üst çubuk, ana içerik, altbilgi. */
export function Page({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <>
      <a className={s.skip} href="#main">
        {t.a11y.skipToContent}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
