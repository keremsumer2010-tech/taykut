// Tasarım sistemi vitrini (yalnız geliştirme: /taykut/vitrin/). Üretim derlemesine girmez.
import palette from '../../tools/design/palette.json';
import { Button } from '@/components/Button';
import { HudFrame } from '@/components/HudFrame';
import { ICON_NAMES, Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { SectionHeader } from '@/components/SectionHeader';
import { Divider, KindNote, Stat, StatusBadge, Tag } from '@/components/bits';
import s from './Vitrin.module.css';

const TR_TEST = "Ağır yükü çeken ışıklı gövde, şişmiş öğütücü İzmir'e. ÇĞİÖŞÜ çğıöşü";
const SEMANTIC = [
  'bg',
  'surface-1',
  'surface-2',
  'surface-3',
  'line',
  'line-strong',
  'text',
  'text-2',
  'text-3',
  'accent',
  'signal',
  'brand-navy',
  'ok',
  'warn',
  'danger',
];
const STEPS = ['7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2'];

export function Vitrin() {
  return (
    <main className={`container ${s.page}`}>
      <SectionHeader
        as="h1"
        index="00"
        kicker="TASARIM SİSTEMİ"
        title={['TAYKUT', 'Görev kontrol dili']}
        lead="Renk, tipografi, boşluk ve bileşenler. Bu sayfa yalnız geliştirmede açılır."
      />

      <section className={s.block} aria-labelledby="v-colors">
        <h2 id="v-colors" className="t-h3">
          Anlamsal renkler
        </h2>
        <div className={s.swatches}>
          {SEMANTIC.map((t) => (
            <figure key={t} className={s.swatch}>
              <span className={s.chip} style={{ background: `var(--${t})` }} />
              <figcaption lang="en" className="t-label">
                --{t}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={s.block} aria-labelledby="v-scales">
        <h2 id="v-scales" className="t-h3">
          Ölçekler (OKLCH)
        </h2>
        {Object.entries(palette).map(([name, scale]) => (
          <div key={name} className={s.scaleRow}>
            <span lang="en" className="t-label">
              {name}
            </span>
            <div className={s.scale}>
              {Object.entries(scale).map(([step, hex]) => (
                <span key={step} className={s.scaleCell} style={{ background: hex }} title={`${step} ${hex}`}>
                  <span className={s.scaleText}>{step}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={s.block} aria-labelledby="v-scale-type">
        <h2 id="v-scale-type" className="t-h3">
          Tip ölçeği
        </h2>
        {STEPS.map((step) => (
          <p key={step} className={s.typeRow} style={{ fontSize: `var(--step-${step})` }}>
            <span className="t-label">step {step}</span>
            <span className={Number(step) >= 2 ? s.display : undefined}>
              TAYKUT rover {TR_TEST.slice(0, 18)}
            </span>
          </p>
        ))}
        <p className="t-hero">TAYKUT</p>
        <p className="t-lead">
          Lise öğrencileriyiz. Rover'ımızı sıfırdan tasarladık, ürettik ve MRC 2026'da genel dördüncü olduk.
        </p>
        <p className="t-body">{TR_TEST}. Gövde metni Inter ile, en fazla 68 karakterlik satırlarla okunur.</p>
        <p className="t-label">Etiket · Kicker · HUD başlığı</p>
        <p className="t-data">
          0.58<span className="t-unit">m/s</span>
        </p>
      </section>

      <section className={s.block} aria-labelledby="v-buttons">
        <h2 id="v-buttons" className="t-h3">
          Düğmeler
        </h2>
        <div className="cluster">
          <Button icon="arrow-right">Sponsor Ol</Button>
          <Button variant="secondary">Görevleri Gör</Button>
          <Button variant="ghost" icon="arrow-up-right">
            Basın kiti
          </Button>
          <Button size="small" variant="secondary" icon="download">
            PDF
          </Button>
          <Button disabled>Devre dışı</Button>
          <Button href="#v-buttons" variant="secondary" icon="external">
            Bağlantı
          </Button>
        </div>
      </section>

      <section className={s.block} aria-labelledby="v-hud">
        <h2 id="v-hud" className="t-h3">
          HUD çerçevesi ve rozetler
        </h2>
        <div className="grid">
          <HudFrame className="span-4" title="TELEMETRİ" meta="UTC 14:32:07">
            <div className="stack">
              <p className="t-data">
                +12.4<span className="t-unit">° PITCH</span>
              </p>
              <KindNote>SİM</KindNote>
            </div>
          </HudFrame>
          <HudFrame className="span-4" accent title="GÖREV 03" meta="DRUMHELLER">
            <div className="cluster">
              <StatusBadge kind="competed">Yarıştık</StatusBadge>
              <StatusBadge kind="target">Hedef</StatusBadge>
              <StatusBadge kind="dream">Bir gün</StatusBadge>
              <StatusBadge kind="danger">Acil durdur</StatusBadge>
            </div>
          </HudFrame>
          <HudFrame className="span-4" translucent title="ETİKETLER">
            <div className="cluster">
              <Tag>ArduRover</Tag>
              <Tag>OpenCV</Tag>
              <Tag>ROS 2</Tag>
            </div>
          </HudFrame>
        </div>
      </section>

      <section className={s.block} aria-labelledby="v-stats">
        <h2 id="v-stats" className="t-h3">
          İstatistik
        </h2>
        <div className="grid">
          <div className="span-4">
            <Stat value="4." label="MRC 2026 final, genel sıralama" />
          </div>
          <div className="span-4">
            <Stat value="35" unit="dk" label="Çalışma süresi" note="hesaplanan" />
          </div>
          <div className="span-4">
            <Stat value="0.58" unit="m/s" label="Seyir hızı (11.1 V)" note="tahmin" />
          </div>
        </div>
        <Divider />
      </section>

      <section className={s.block} aria-labelledby="v-icons">
        <h2 id="v-icons" className="t-h3">
          İkonlar
        </h2>
        <div className="cluster">
          {ICON_NAMES.map((n) => (
            <span key={n} className={s.icon} title={n}>
              <Icon name={n} size={24} />
              <span lang="en" className="t-label">
                {n}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section className={s.block} aria-labelledby="v-logo">
        <h2 id="v-logo" className="t-h3">
          Logo (beyaz plaka)
        </h2>
        <div className="cluster">
          <Logo height={24} />
          <Logo height={40} />
        </div>
      </section>
    </main>
  );
}
