import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { CONTACT } from '@/content/contact';
import { ATTRIBUTIONS } from '@/content/attributions';
import { useT } from '@/lib/i18n';
import { pageHref } from '@/lib/links';
import { LangSwitch } from './LangSwitch';
import s from './layout.module.css';

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={`container grid ${s.footerGrid}`}>
        <div className={`span-5 ${s.footerBrand}`}>
          <p className={s.footerWord} aria-hidden="true">
            TAYKUT
          </p>
          <p className="t-small">{t.footer.school}</p>
          <p className="t-small">
            {t.footer.captain}
            <br />
            {t.footer.advisor}
          </p>
          <Logo height={22} />
        </div>

        <div className={`span-3 ${s.footerCol}`}>
          <h2 className="t-label">TAYKUT</h2>
          <a href={pageHref('rover')}>{t.nav.rover}</a>
          <a href={pageHref('gorevler')}>{t.nav.missions}</a>
          <a href={pageHref('muhendislik')}>{t.nav.engineering}</a>
          <a href={pageHref('istasyon')}>{t.nav.station}</a>
          <a href={pageHref('takim')}>{t.nav.team}</a>
          <a href={pageHref('sponsor')}>{t.nav.sponsor}</a>
          <a href={pageHref('basin')}>{t.footer.press}</a>
          <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={16} />@{CONTACT.instagram}
            <span className="sr-only">{t.a11y.externalLink}</span>
          </a>
          <LangSwitch />
        </div>

        <div className={`span-4 ${s.footerCol}`}>
          <h2 className="t-label">{t.footer.attributions}</h2>
          <ul className={`t-small ${s.attrib}`}>
            {ATTRIBUTIONS.map((a) => (
              <li key={a.id}>
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  {a.text}
                  <span className="sr-only">{t.a11y.externalLink}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`container ${s.footerBottom}`}>
        <span className="t-small">
          © {year} TAYKUT. {t.footer.rights}
        </span>
        <span className="t-small">{t.footer.license}</span>
      </div>
    </footer>
  );
}
