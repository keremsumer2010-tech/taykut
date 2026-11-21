"""SummerTech logosunun siyah ARKA PLANINI şeffaflaştırır; logo işaretlerine dokunmaz.

Kural: logonun rengi, oranı, biçimi değişmez (bkz. PROMPT_TAYKUT_SITE.md hard_constraints 10).
Yöntem: Kaynak görsel siyah zemin üzerinde iki düz marka renginden (lacivert #01234A,
turuncu #D15B09) oluşur; kenarlardaki ara pikseller "renk x alfa + siyah x (1-alfa)" karışımıdır.
Her piksel için en yakın marka rengine göre alfa çözülür ve piksel o marka renginin
kendisi + alfa olarak yazılır. Böylece marka renkleri birebir korunur, kenar yumuşatması kalır.

Kullanım: uv run --no-project --with pillow --with numpy python tools/brand/logo_alpha.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT.parent / "summertech-logo.png"
DST = ROOT / "src" / "assets" / "brand" / "summertech-logo.png"

BLACK = np.array([8, 8, 8], dtype=np.float64)  # kaynaktaki zemin rengi (ölçüldü)
BRAND = np.array([[1, 35, 74], [209, 91, 9]], dtype=np.float64)  # lacivert, turuncu (ölçüldü)


def main() -> None:
    img = np.asarray(Image.open(SRC).convert("RGB"), dtype=np.float64)
    h, w, _ = img.shape
    p = img.reshape(-1, 3) - BLACK
    best_a = np.zeros(len(p))
    best_c = np.zeros((len(p), 3))
    best_err = np.full(len(p), np.inf)
    for c in BRAND:
        d = c - BLACK
        a = np.clip(p @ d / (d @ d), 0.0, 1.0)
        err = np.linalg.norm(p - np.outer(a, d), axis=1)
        better = err < best_err
        best_err[better], best_a[better], best_c[better] = err[better], a[better], c
    # Çok küçük alfalar sıkıştırma gürültüsüdür: sıfırla.
    best_a[best_a < 0.04] = 0.0
    out = np.concatenate([best_c, (best_a * 255)[:, None]], axis=1).round().clip(0, 255).astype(np.uint8)
    out_img = Image.fromarray(out.reshape(h, w, 4), "RGBA")
    # Boş kenarları kırp (logo oranı korunur, sadece şeffaf boşluk atılır), küçük pay bırak.
    bbox = out_img.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    if bbox:
        pad = 8
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
        out_img = out_img.crop(bbox)
    DST.parent.mkdir(parents=True, exist_ok=True)
    out_img.save(DST, optimize=True)
    print(f"OK {DST.relative_to(ROOT)} {out_img.size[0]}x{out_img.size[1]}  ortalama hata {best_err.mean():.2f}")


if __name__ == "__main__":
    main()
