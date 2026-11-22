"""Uzay açılışının alçak irtifa dokusu: Meteor Krateri çevresi 2°×2° (34–36°K, 110–112°B).

Kaynak: Copernicus GLO-30 DEM, 4 karo (AWS açık veri, tools/.cache/terrain/cop_N3x_00_W11x_00.tif).
Gölgelendirilmiş rölyef (güneş batı-güneybatıdan, alçak: sahnedeki ışıkla aynı) × Blue Marble renk tonu.
Çıktı: public/space/earth-arizona.webp (2048², ≈108 m/piksel; 4K küresel dokudan ~90 kat keskin).

  uv run --no-project --with tifffile --with imagecodecs --with numpy --with scipy --with pillow \
    python tools/space/bake_region.py
"""

import math

import numpy as np
import tifffile
from PIL import Image
from scipy.ndimage import zoom

T = "tools/.cache/terrain/cop_{}_00_W{}_00.tif"
# Satır sırası kuzeyden güneye, sütun batıdan doğuya
rows = [["N35", "112"], ["N35", "111"]], [["N34", "112"], ["N34", "111"]]
mosaic = np.vstack([np.hstack([tifffile.imread(T.format(lat, lon)) for lat, lon in r]) for r in rows]).astype(np.float32)
N = 2048
h = zoom(mosaic, N / mosaic.shape[0], order=1)

# Gölgelendirme (piksel ≈ 2°/2048; doğu-batı ölçeği cos(35°))
lat_c = math.radians(35)
dy = 2 / N * 111_320
dx = dy * math.cos(lat_c)
gy, gx = np.gradient(h, dy, dx)  # gy: satır yönü (güneye), gx: doğuya
az = math.radians(250)  # batı-güneybatı
alt = math.radians(24)
sx, sy, sz = math.cos(alt) * math.sin(az), math.cos(alt) * math.cos(az), math.sin(alt)
nx, ny, nz = -gx, gy, np.ones_like(h)  # ny: kuzeye eğim (satır ters)
norm = np.sqrt(nx**2 + ny**2 + nz**2)
shade = np.clip((nx * sx + ny * sy + nz * sz) / norm, 0, 1)

# Yükseklik renkleri (Arizona: alçak çöl, Colorado Platosu, Mogollon kenarı ormanı, San Francisco Dağları)
stops = [(1100, (176, 140, 98)), (1500, (196, 165, 124)), (1800, (189, 160, 120)), (2100, (120, 112, 80)),
         (2500, (84, 92, 62)), (3200, (128, 120, 110)), (3800, (210, 208, 205))]
hyp = np.zeros(h.shape + (3,), np.float32)
for c in range(3):
    xs = [s[0] for s in stops]
    ys = [s[1][c] for s in stops]
    hyp[..., c] = np.interp(h, xs, ys)

# Blue Marble tonu (yörüngeden görülen renkle dikişsiz)
day = Image.open("tools/.cache/space/day.jpg").convert("RGB")
W, H = day.size
box = (round(68 / 360 * W), round((90 - 36) / 180 * H), round(70 / 360 * W), round((90 - 34) / 180 * H))
bm = np.asarray(day.crop(box).resize((N, N), Image.BICUBIC)).astype(np.float32)
base = hyp * 0.45 + bm * 0.55
light = 0.38 + 0.9 * shade[..., None]
out = np.clip(base * light, 0, 255).astype(np.uint8)
Image.fromarray(out).save("public/space/earth-arizona.webp", quality=82, method=6)
Image.fromarray(out).resize((512, 512)).save("tools/.cache/space/arizona_preview.jpg", quality=85)
print("tamam", out.shape, "yükseklik", int(h.min()), int(h.max()))
