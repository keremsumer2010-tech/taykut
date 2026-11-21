// Takım üyeleri için rover parçası amblemleri (fotoğraf yerine). 48 px ızgara, 1.5 px çizgi.
// Bu projede çizildi; üye fotoğrafı yalnız kullanıcı verirse ve onay varsa eklenir.
import type { Emblem as EmblemName } from '@/content/team';

const GLYPHS: Record<EmblemName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="24" cy="24" r="15" />
      <path d="M24 9v4M24 35v4M9 24h4M35 24h4" />
      <path d="m24 15 4 9-4 9-4-9z" fill="currentColor" fillOpacity="0.25" />
    </>
  ),
  wheel: (
    <>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="4" />
      <path d="M24 9l3 4-3 4-3-4zM24 31l3 4-3 4-3-4zM9 24l4-3 4 3-4 3zM31 24l4-3 4 3-4 3z" />
    </>
  ),
  rocker: (
    <>
      <circle cx="24" cy="16" r="3" />
      <path d="m24 16-12 18M24 16l12 18" />
      <circle cx="12" cy="36" r="4" />
      <circle cx="36" cy="36" r="4" />
    </>
  ),
  arm: (
    <>
      <path d="M10 38h14M17 38V28l10-10 8 6" />
      <circle cx="17" cy="28" r="2.5" />
      <circle cx="27" cy="18" r="2.5" />
      <path d="m35 24 4-2M35 24l3 4" />
    </>
  ),
  antenna: (
    <>
      <path d="M24 40V18M18 40h12" />
      <path d="M16 14a11 11 0 0 1 16 0M12 10a17 17 0 0 1 24 0" />
      <circle cx="24" cy="18" r="2.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="24" cy="24" r="6" />
      <path d="M24 8v6M24 34v6M8 24h6M34 24h6M12.7 12.7l4.2 4.2M31.1 31.1l4.2 4.2M12.7 35.3l4.2-4.2M31.1 16.9l4.2-4.2" />
      <circle cx="24" cy="24" r="12" />
    </>
  ),
  camera: (
    <>
      <path d="M10 18h28v18H10zM18 18l2-5h8l2 5" />
      <circle cx="24" cy="27" r="5" />
    </>
  ),
  drill: (
    <>
      <path d="M18 8h12v8H18zM24 16v24" />
      <path d="m20 20 8 3-8 3 8 3-8 3 8 3" />
    </>
  ),
};

export function Emblem({ name, size = 48 }: { name: EmblemName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name]}
    </svg>
  );
}
