"""Uzay açılışı varlıkları — gerçek veri, web boyutuna.

Kaynaklar (tools/.cache/space/, indirme komutları docs/VARLIKLAR.md'de):
  day.jpg    NASA Blue Marble ("Whole world - land and oceans"), kamu malı (Wikimedia Commons)
  night.jpg  NASA Black Marble ("The earth at night"), kamu malı (Wikimedia Commons)
  clouds.jpg Solar System Scope 2k earth clouds, CC BY 4.0 (Wikimedia Commons)
  bsc5.dat.gz Yale Bright Star Catalogue 5. baskı (Harvard CfA), ~9100 yıldız

Çıktı public/space/:
  earth-day-4k.webp, earth-day-2k.webp, earth-night-2k.webp, earth-clouds-2k.webp,
  earth-water-1k.webp (okyanus maskesi: parlama yalnız suda), stars.bin (Float32: x, y, z, Vmag, B-V)

  uv run --no-project --with pillow --with numpy python tools/space/bake_space.py
"""

import gzip
import math
import os

import numpy as np
from PIL import Image

SRC = "tools/.cache/space"
OUT = "public/space"
os.makedirs(OUT, exist_ok=True)

day = Image.open(f"{SRC}/day.jpg").convert("RGB")
day.resize((3840, 1920), Image.LANCZOS).save(f"{OUT}/earth-day-4k.webp", quality=80, method=6)
day.resize((2048, 1024), Image.LANCZOS).save(f"{OUT}/earth-day-2k.webp", quality=80, method=6)

night = Image.open(f"{SRC}/night.jpg").convert("RGB").resize((2048, 1024), Image.LANCZOS)
night.save(f"{OUT}/earth-night-2k.webp", quality=80, method=6)

clouds = Image.open(f"{SRC}/clouds.jpg").convert("L").resize((2048, 1024), Image.LANCZOS)
clouds.save(f"{OUT}/earth-clouds-2k.webp", quality=55, method=6)

# Okyanus maskesi: Blue Marble'da su koyu ve mavi baskın
a = np.asarray(day.resize((1024, 512), Image.LANCZOS)).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
water = ((b > r + 12) & (b > g - 6) & (r + g + b < 360)).astype(np.float32)
Image.fromarray((water * 255).astype(np.uint8)).save(f"{OUT}/earth-water-1k.webp", quality=85)

# Yıldızlar: BSC5 sabit genişlikli kayıtlar (J2000 RA/Dec, V kadir, B-V)
stars = []
for line in gzip.open(f"{SRC}/bsc5.dat.gz", "rt", encoding="latin-1"):
    try:
        rah, ram, ras = int(line[75:77]), int(line[77:79]), float(line[79:83])
        sign = -1 if line[83] == "-" else 1
        ded, dem, des = int(line[84:86]), int(line[86:88]), int(line[88:90])
        vmag = float(line[102:107])
    except ValueError:
        continue  # konumsuz kayıtlar (novalar vb.)
    try:
        bv = float(line[109:114])
    except ValueError:
        bv = 0.6
    ra = math.radians((rah + ram / 60 + ras / 3600) * 15)
    de = math.radians(sign * (ded + dem / 60 + des / 3600))
    # Gök küresi → three (y kuzey kutbu)
    x = math.cos(de) * math.cos(ra)
    z = -math.cos(de) * math.sin(ra)
    y = math.sin(de)
    stars.append((x, y, z, vmag, bv))
arr = np.array(stars, dtype=np.float32)
arr.tofile(f"{OUT}/stars.bin")
brightest = arr[arr[:, 3].argsort()][:3]
print("yıldız", len(arr), "en parlak V:", [round(float(v), 2) for v in brightest[:, 3]])
for f in sorted(os.listdir(OUT)):
    print(f, os.path.getsize(f"{OUT}/{f}") // 1024, "KB")
