import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { useT } from '@/lib/i18n';
import { sectionHref, type SectionId } from '@/lib/links';
import { LangSwitch } from './LangSwitch';
import s from './layout.module.css';

const LINKS: { id: SectionId; key: 'rover' | 'missions' | 'engineering' | 'station' | 'team' }[] = [
  { id: 'rover', key: 'rover' },
  { id: 'missions', key: 'missions' },
  { id: 'engineering', key: 'engineering' },
  { id: 'station', key: 'station' },
  { id: 'team', key: 'team' },
];

export function Nav() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Kaydırınca çubuk incelir.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobil menü: Esc kapatır, odak menü içinde kalır, kapanınca odak düğmeye döner.
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
      const els = focusables();
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

  return (
    <header className={`${s.nav} ${compact ? s.navCompact : ''}`}>
      <div className={`container ${s.navInner}`}>
        <a className={s.brand} href={sectionHref('top')} aria-label="TAYKUT">
          <span className={s.brandMark} aria-hidden="true" />
          <span className={s.brandText}>TAYKUT</span>
        </a>

        <nav aria-label="Ana menü" className={s.navLinks}>
          {LINKS.map((l) => (
            <a key={l.id} href={sectionHref(l.id)} className="t-label">
              {t.nav[l.key]}
            </a>
          ))}
        </nav>

        <div className={s.navActions}>
          <LangSwitch />
          <a href={sectionHref('sponsor')} className={`t-label ${s.navCta}`}>
            {t.nav.sponsor}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={s.menuButton}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      <div
        id="mobil-menu"
        ref={menuRef}
        className={`${s.mobileMenu} ${open ? s.mobileMenuOpen : ''}`}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
      >
        <nav aria-label="Mobil menü" className={s.mobileLinks}>
          {LINKS.map((l, i) => (
            <a key={l.id} href={sectionHref(l.id)} onClick={close} className={s.mobileLink}>
              <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
              {t.nav[l.key]}
            </a>
          ))}
          <a href={sectionHref('sponsor')} onClick={close} className={`${s.mobileLink} ${s.mobileLinkCta}`}>
            <span className="t-label">→</span>
            {t.nav.sponsor}
          </a>
        </nav>
      </div>
    </header>
  );
}
