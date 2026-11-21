"""Fotoğraf hattı: kaynak → kırpma → hafif renk derecelendirme → AVIF + WebP (birkaç genişlik) + LQIP.

Neden Python/Pillow: bu bilgisayarda Windows Akıllı Uygulama Denetimi imzasız yerel ikili dosyaları
(sharp/libvips, ffmpeg) engelliyor; Pillow 13 AVIF ve WebP'yi destekliyor.

Kullanım:  python tools/media/build_media.py        (npm run assets:media)
Girdi:     tools/media/media.config.json, kaynak/foto/*
Çıktı:     public/media/<ad>-<genişlik>.avif|webp
           src/content/media.generated.json  (boyutlar, srcset genişlikleri, LQIP)
Önbellek:  kaynak + yapılandırma değişmediyse görsel yeniden kodlanmaz (tools/.cache/media/hashes.json).
EXIF/GPS:  yeniden kodlamada meta veri yazılmaz (gizlilik).
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "tools" / "media" / "media.config.json"
OUT_DIR = ROOT / "public" / "media"
MANIFEST = ROOT / "src" / "content" / "media.generated.json"
CACHE = ROOT / "tools" / ".cache" / "media" / "hashes.json"


def file_hash(path: Path, extra: str) -> str:
    h = hashlib.sha256(path.read_bytes())
    h.update(extra.encode())
    return h.hexdigest()[:16]


def lqip(img: Image.Image) -> str:
    """20 px genişliğinde bulanık önizleme (CSS arka planı olarak; ~300 bayt)."""
    small = img.copy()
    small.thumbnail((20, 20))
    buf = io.BytesIO()
    small.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def process(entry: dict, defaults: dict, cache: dict, force: bool) -> dict:
    src = ROOT / entry["src"]
    widths = entry.get("widths", defaults["widths"])
    grade = {**defaults["grade"], **entry.get("grade", {})}
    key = json.dumps({"crop": entry.get("crop"), "grade": grade, "w": widths,
                      "q": [defaults["avifQuality"], defaults["webpQuality"]]}, sort_keys=True)
    digest = file_hash(src, key)

    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if "crop" in entry:
        img = img.crop(tuple(entry["crop"]))
    if grade["contrast"] != 1.0:
        img = ImageEnhance.Contrast(img).enhance(grade["contrast"])
    if grade["saturation"] != 1.0:
        img = ImageEnhance.Color(img).enhance(grade["saturation"])

    W, H = img.size
    made = [w for w in widths if w < W] + [W]  # kaynaktan büyük üretme; en büyüğü kaynak genişliği
    made = sorted(set(made))
    name = entry["name"]
    files_exist = all((OUT_DIR / f"{name}-{w}.{ext}").exists() for w in made for ext in ("avif", "webp"))
    sizes = {}
    if force or cache.get(name) != digest or not files_exist:
        for w in made:
            h = round(H * w / W)
            r = img.resize((w, h), Image.Resampling.LANCZOS) if w != W else img
            r.save(OUT_DIR / f"{name}-{w}.avif", "AVIF", quality=defaults["avifQuality"], speed=4)
            r.save(OUT_DIR / f"{name}-{w}.webp", "WEBP", quality=defaults["webpQuality"], method=6)
        cache[name] = digest
        status = "üretildi"
    else:
        status = "önbellekte"
    for w in made:
        sizes[w] = (OUT_DIR / f"{name}-{w}.avif").stat().st_size
    print(f"{name:16s} {W}×{H}  {status:10s} " + "  ".join(f"{w}:{s / 1024:.0f}KB" for w, s in sizes.items()))
    return {"width": W, "height": H, "widths": made, "lqip": lqip(img), "source": entry["src"]}


def main() -> None:
    force = "--force" in sys.argv
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    manifest = {"$comment": "OTOMATİK: tools/media/build_media.py — elle düzenleme."}
    for entry in cfg["images"]:
        manifest[entry["name"]] = process(entry, cfg["defaults"], cache, force)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    CACHE.write_text(json.dumps(cache, indent=2))
    print(f"OK {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
