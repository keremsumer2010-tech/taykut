"""Paylaşım (Open Graph) görselleri: 1200×630, TR ve EN.

Bileşim: saha fotoğrafı (sağda, rover kadrajda) + soldan koyulaşan zemin + "TAYKUT" (Archivo geniş) +
iki satır slogan + MRC 2026 sonucu + beyaz plakada logo. Fontlar sitedeki alt kümelenmiş woff2
dosyalarından TTF'ye çevrilerek kullanılır (Pillow woff2 okuyamaz).

Kullanım: uv run --no-project --with pillow --with fonttools --with brotli python tools/media/og.py
Çıktı:    public/og-tr.jpg, public/og-en.jpg
"""

from io import BytesIO
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
FONTS = ROOT / "src" / "assets" / "fonts"
W, H = 1200, 630
BG = (7, 9, 12)
TEXT = (232, 236, 241)
TEXT2 = (163, 173, 186)
SIGNAL = (231, 173, 1)

COPY = {
    "tr": {"tagline": ["Ankara’da tasarlandı.", "Başka dünyalar için."], "result": "MRC 2026 · GENEL 4.",
           "kicker": "LİSE ROVER TAKIMI · ANKARA"},
    "en": {"tagline": ["Designed in Ankara.", "Built for other worlds."], "result": "MRC 2026 · 4TH OVERALL",
           "kicker": "HIGH SCHOOL ROVER TEAM · ANKARA"},
}


def font(name: str, size: int, wdth: float | None = None, wght: float | None = None) -> ImageFont.FreeTypeFont:
    """woff2 → TTF (bellekte); değişken eksenler varsa ayarla."""
    tt = TTFont(FONTS / name)
    tt.flavor = None
    buf = BytesIO()
    tt.save(buf)
    buf.seek(0)
    f = ImageFont.truetype(buf, size)
    axes = {}
    try:
        names = [a["name"].decode() if isinstance(a["name"], bytes) else a["name"] for a in f.get_variation_axes()]
        for a, n in zip(f.get_variation_axes(), names):
            tag = n.lower()
            if "width" in tag and wdth is not None:
                axes[n] = wdth
            elif "weight" in tag and wght is not None:
                axes[n] = wght
            else:
                axes[n] = a.get("default", a["minimum"])
        if axes:
            f.set_variation_by_axes([axes[n] for n in names])
    except OSError:
        pass  # değişken olmayan font
    return f


def merged_font(base: str, size: int, **kw):
    """Türkçe harfler latin-ext dosyasında: metni harf harf uygun dosyayla çizmek için iki font döner."""
    return font(f"{base}-latin.woff2", size, **kw), font(f"{base}-latin-ext.woff2", size, **kw)


EXT_CHARS = set("ĞğİŞş")


def draw_text(draw: ImageDraw.ImageDraw, xy, text: str, fonts, fill, tracking: float = 0):
    x, y = xy
    latin, ext = fonts
    for ch in text:
        f = ext if ch in EXT_CHARS else latin
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + tracking
    return x


def build(lang: str) -> Image.Image:
    c = COPY[lang]
    img = Image.new("RGB", (W, H), BG)
    photo = ImageOps.exif_transpose(Image.open(ROOT / "kaynak" / "foto" / "summertech-gunduz-regolit.jpg")).convert("RGB")
    # Rover fotoğrafın orta-alt kısmında: sağ 62%'lik alana kırp
    pw = int(W * 0.62)
    scale = pw / photo.width
    ph = int(photo.height * scale)
    photo = photo.resize((pw, ph), Image.Resampling.LANCZOS)
    top = int(ph * 0.42) - H // 2
    photo = photo.crop((0, max(0, top), pw, max(0, top) + H))
    img.paste(photo, (W - pw, 0))
    # Soldan karartma
    grad = Image.new("L", (W, 1))
    for x in range(W):
        t = (x - (W - pw)) / (pw * 0.55)
        grad.putpixel((x, 0), int(255 * max(0.0, min(1.0, 1 - t))))
    mask = grad.resize((W, H))
    img = Image.composite(Image.new("RGB", (W, H), BG), img, mask)
    d = ImageDraw.Draw(img)

    x0 = 64
    mono = merged_font("jetbrains-mono", 20, wght=500)
    d.rectangle((x0, 92, x0 + 10, 102), fill=SIGNAL)
    draw_text(d, (x0 + 22, 86), c["kicker"], mono, TEXT2, tracking=2.5)
    title = merged_font("archivo-wdth", 150, wdth=118, wght=800)
    draw_text(d, (x0 - 6, 140), "TAYKUT", title, TEXT, tracking=-4)
    tag = merged_font("archivo-wdth", 40, wdth=112, wght=650)
    draw_text(d, (x0, 330), c["tagline"][0], tag, TEXT)
    draw_text(d, (x0, 380), c["tagline"][1], tag, TEXT2)
    draw_text(d, (x0, 470), c["result"], merged_font("jetbrains-mono", 24, wght=600), SIGNAL, tracking=2)
    # Logo plakası
    logo = Image.open(ROOT / "src" / "assets" / "brand" / "summertech-logo.png").convert("RGBA")
    lh = 30
    logo = logo.resize((int(logo.width * lh / logo.height), lh), Image.Resampling.LANCZOS)
    plate = Image.new("RGBA", (logo.width + 28, lh + 16), (255, 255, 255, 255))
    plate.alpha_composite(logo, (14, 8))
    img.paste(plate.convert("RGB"), (x0, H - 64 - plate.height))
    return img


def main():
    for lang in COPY:
        out = ROOT / "public" / f"og-{lang}.jpg"
        build(lang).save(out, quality=86, optimize=True, progressive=True)
        print(f"OK {out.relative_to(ROOT)} ({out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
