"""Değişken fontları Türkçe + İngilizce karakter setine indirger (woff2, eksenler korunur).

Neden: @fontsource paketleri Türkçe karakterleri iki dosyaya böler (ı Latin'de; ş, ğ, İ Latin
Extended'da). Türkçe bir sayfa her fontta iki tam dosya indirir ve font bütçesini (≤ 180 KB) aşar.
Burada her iki parça yalnız gereken karakterlerle alt kümelenir; latin-ext parçası birkaç KB'a iner.
(fontTools.merge değişken fontlarda güvenilir olmadığı için parçalar birleştirilmez; CSS'te
unicode-range ile iki küçük dosya olarak sunulur.) Bu sette olmayan işaretler (oklar, ≤ ≥) için
sistem fontuna düşülür; sitede oklar SVG ikonla çizilir.

Kullanım:  uv run --with fonttools --with brotli python tools/fonts/subset.py
Çıktı:     src/assets/fonts/*.woff2  (kaynak dosyalar node_modules/@fontsource-variable altından)
"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
FS = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "src" / "assets" / "fonts"

# Türkçe + İngilizce + site için gereken tipografik işaretler.
UNICODES = [
    *range(0x0020, 0x007F),  # Temel Latin
    *range(0x00A0, 0x0100),  # Latin-1: Ç Ö Ü ç ö ü, °, ×, ·, «», é vb.
    0x011E, 0x011F,  # Ğ ğ
    0x0130, 0x0131,  # İ ı
    0x015E, 0x015F,  # Ş ş
    0x0152, 0x0153,  # Œ œ (İngilizce alıntılar için)
    *range(0x2010, 0x2028),  # tireler, tırnaklar, üç nokta, madde işareti
    *range(0x2030, 0x203B),  # ‰ ′ ″ ‹ ›
    0x2044,  # kesir çizgisi
    0x20AC,  # €
    0x2116,  # №
    0x2122,  # ™
    *range(0x2190, 0x2194),  # ← ↑ → ↓
    0x2196, 0x2197, 0x2198, 0x2199,  # çapraz oklar
    0x2212,  # eksi işareti (telemetri)
    0x2248,  # ≈
    0x2264, 0x2265,  # ≤ ≥
    0x00B1,  # ±
]

# ad: (fontsource paketi, dosya kalıbı, CSS font-family)
FONTS = {
    "inter": ("inter", "inter-{sub}-wght-normal.woff2", "Inter TK"),
    "jetbrains-mono": ("jetbrains-mono", "jetbrains-mono-{sub}-wght-normal.woff2", "JetBrains Mono TK"),
    "archivo-wdth": ("archivo", "archivo-{sub}-wdth-normal.woff2", "Archivo TK"),
}

CSS_OUT = ROOT / "src" / "styles" / "fonts.css"


def ranges(chars: list[int]) -> str:
    """Sıralı kod noktalarını en kısa unicode-range ifadesine çevirir."""
    out, start, prev = [], None, None
    for c in chars:
        if start is None:
            start = prev = c
        elif c == prev + 1:
            prev = c
        else:
            out.append((start, prev))
            start = prev = c
    if start is not None:
        out.append((start, prev))
    return ",".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in out)


def axes(path: Path) -> dict[str, tuple[float, float]]:
    font = TTFont(path)
    return {a.axisTag: (a.minValue, a.maxValue) for a in font["fvar"].axes} if "fvar" in font else {}


def cmap_of(path: Path) -> set[int]:
    return set(TTFont(path).getBestCmap().keys())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = set(UNICODES)
    report = []
    css = ["/* OTOMATİK ÜRETİLDİ: tools/fonts/subset.py — elle düzenleme. Lisans: SIL OFL 1.1 */"]
    for name, (pkg, pattern, family) in FONTS.items():
        latin = FS / pkg / "files" / pattern.format(sub="latin")
        ext = FS / pkg / "files" / pattern.format(sub="latin-ext")
        covered: set[int] = set()
        for sub, src in (("latin", latin), ("latin-ext", ext)):
            # latin-ext yalnız latin parçasında olmayan karakterleri taşır (aralıklar çakışmaz).
            chars = sorted((wanted & cmap_of(src)) - covered)
            covered |= set(chars)
            opts = subset.Options()
            opts.flavor = "woff2"
            opts.layout_features = ["kern", "liga", "calt", "tnum", "case", "ss01", "zero"]
            opts.name_IDs = ["*"]
            opts.notdef_outline = True
            opts.hinting = False
            font = TTFont(src)
            sub_ = subset.Subsetter(opts)
            sub_.populate(unicodes=chars)
            sub_.subset(font)
            dst = OUT / f"{name}-{sub}.woff2"
            font.flavor = "woff2"
            font.save(dst)
            report.append((dst.name, src.stat().st_size, dst.stat().st_size, chars))
            ax = axes(dst)
            decl = [f"  font-family: '{family}';", "  font-style: normal;", "  font-display: swap;"]
            if "wght" in ax:
                decl.append(f"  font-weight: {ax['wght'][0]:g} {ax['wght'][1]:g};")
            if "wdth" in ax:
                decl.append(f"  font-stretch: {ax['wdth'][0]:g}% {ax['wdth'][1]:g}%;")
            decl.append(f"  src: url('../assets/fonts/{dst.name}') format('woff2');")
            decl.append(f"  unicode-range: {ranges(chars)};")
            css.append("@font-face {\n" + "\n".join(decl) + "\n}")
    CSS_OUT.write_text("\n\n".join(css) + "\n", encoding="utf-8")
    print(f"OK {CSS_OUT.relative_to(ROOT)} yazildi")
    missing = wanted - set().union(*(set(r[3]) for r in report if r[0].startswith("inter")))
    for fname, before, after, chars in report:
        print(f"{fname:34s} {before/1024:6.1f} KB -> {after/1024:6.1f} KB  ({len(chars)} karakter)")
    if missing:
        print("Inter'de bulunmayan karakterler:", " ".join(f"U+{c:04X}" for c in sorted(missing)))


if __name__ == "__main__":
    main()
