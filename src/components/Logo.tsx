import s from './Logo.module.css';
import logoUrl from '@/assets/brand/summertech-logo.png';

// Şeffaf zeminli kopyanın boyutu (tools/brand/logo_alpha.py çıktısı).
const W = 2053;
const H = 350;

interface LogoProps {
  /** Logo görselinin yüksekliği (px). Genişlik orandan gelir; logo asla esnetilmez. */
  height?: number;
}

/**
 * Takım logosu, beyaz plaka içinde. Logonun rengi, oranı ve biçimi değiştirilmez;
 * sadece kaynak görselin siyah arka planı şeffaflaştırılmıştır (tools/brand/logo_alpha.py).
 */
export function Logo({ height = 32 }: LogoProps) {
  const pad = Math.round(height * 0.25);
  return (
    <span className={s.plate} style={{ paddingBlock: pad, fontSize: height }}>
      <img src={logoUrl} alt="SummerTech" height={height} width={Math.round((height * W) / H)} />
    </span>
  );
}
