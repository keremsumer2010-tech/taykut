import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { CONTACT } from '@/content/contact';
import { useLang, useT } from '@/lib/i18n';
import { formatLatLon } from '@/lib/geofmt';
import { currentPage, pageHref, sectionHref, type PageId } from '@/lib/links';
import { LangSwitch } from './LangSwitch';
import s from './layout.module.css';

type MenuKey = 'rover' | 'missions' | 'engineering' | 'station' | 'team' | 'sponsor';

/** Menü: her ekran boyutunda 3 çizgi. Başlıklar ayrı sayfalarda açılır (kullanıcı isteği, 2026-11-22).
 *  Ana sayfada yalnız 3B sahne vardır (kullanıcı isteği, 2026-11-22); Görevler de ayrı sayfadır. */
const ITEMS: { key: MenuKey; page: PageId }[] = [
  { key: 'rover', page: 'rover' },
  { key: 'missions', page: 'gorevler' },
  { key: 'engineering', page: 'muhendislik' },
  { key: 'station', page: 'istasyon' },
  { key: 'team', page: 'takim' },
  { key: 'sponsor', page: 'sponsor' },
];

export function Nav() {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const here = currentPage();

  // Kaydırınca çubuk incelir ve zemin kazanır.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü açıkken: Esc kapatır, odak menü içinde döner, sayfa kaydırılmaz; kapanınca odak düğmeye döner.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>('a, button') ?? []).filter(
        (el) => !el.hasAttribute('disabled'),
      );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const els = [toggleRef.current, ...focusables()].filter((el): el is HTMLElement => !!el);
      const first = els[0];
      const last = els[els.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const toggle = toggleRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  // Menü üst çubuğun DIŞINDA durur: çubuktaki backdrop-filter, sabit konumlu alt öğeleri
  // çubuğun içine hapseder (menü 0 yükseklikte kalıyordu; B03+ düzeltmesi).
  return (
    <>
      <header className={`${s.nav} ${compact || open ? s.navCompact : ''} ${open ? s.navOpen : ''}`}>
        <div className={`container ${s.navInner}`}>
          <a className={s.brand} href={sectionHref('top')} aria-label="TAYKUT">
            <span className={s.brandMark} aria-hidden="true" />
            <span className={s.brandText}>TAYKUT</span>
          </a>

          <div className={s.navActions}>
            <LangSwitch />
            <a href={pageHref('sponsor')} className={`t-label ${s.navCta}`}>
              {t.nav.sponsor}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={`${s.menuButton} ${open ? s.menuButtonOpen : ''}`}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`t-label ${s.menuWord}`} aria-hidden="true">
                {t.a11y.menu}
              </span>
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={s.menu}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label={t.a11y.menu}
      >
        <div className={`container ${s.menuGrid}`}>
          <nav aria-label={t.a11y.menu} className={s.menuLinks}>
            <ol>
              {ITEMS.map((it, i) => {
                const active = it.page === here;
                return (
                  <li key={it.key}>
                    <a
                      href={pageHref(it.page)}
                      onClick={close}
                      className={`${s.menuLink} ${it.key === 'sponsor' ? s.menuLinkCta : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={`t-label ${s.menuIndex}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={s.menuText}>{t.nav[it.key]}</span>
                      <Icon name="arrow-up-right" size={22} className={s.menuArrow} />
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <aside className={s.menuAside}>
            <p className="t-label">{t.hero.kicker}</p>
            <p className="t-body">{t.hero.lead}</p>
            <ul className={s.menuMeta}>
              <li>
                <a href={pageHref('basin')} onClick={close}>
                  {t.footer.press}
                </a>
              </li>
              <li>
                <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="instagram" size={16} />@{CONTACT.instagram}
                  <span className="sr-only">{t.a11y.externalLink}</span>
                </a>
              </li>
            </ul>
            <p className={`t-label t-mono ${s.menuCoords}`} aria-hidden="true">
              {formatLatLon(39.93, 32.86, lang)} · ANKARA
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
