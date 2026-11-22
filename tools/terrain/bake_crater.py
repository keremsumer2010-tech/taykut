"""Meteor Krateri (Barringer, Arizona) yükseklik haritası — gerçek veri.

Kaynak: Copernicus GLO-30 DEM, AWS açık veri kovası (anahtarsız):
  https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N35_00_W112_00_DEM/...tif
Atıf: © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under
COPERNICUS by the European Union and ESA.

Çıktı: public/terrain/meteor.png (RGB: yükseklik = (R·256 + G)/65535, metrik ızgara, kuzey yukarı) + meteor.json (ölçek).
Kullanım:
  uv run --no-project --with tifffile --with imagecodecs --with numpy --with scipy --with pillow \
    python tools/terrain/bake_crater.py
"""

import json
import math
import os
import urllib.request

import numpy as np
import tifffile
from PIL import Image
from scipy.ndimage import map_coordinates

URL = ("https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N35_00_W112_00_DEM/"
       "Copernicus_DSM_COG_10_N35_00_W112_00_DEM.tif")
CACHE = "tools/.cache/terrain/cop_N35_W112.tif"
SHA256 = "105a2ff831e660c878bb72ac88147c79659444167ef8931b5b4d4eeefc54b4b1"
CENTER = (35.0274, -111.0228)  # krater merkezi (enlem, boylam)
SIZE_M = 4096.0                # kenar (m)
N = 513                        # ızgara (8 m aralık)
OUT = "public/terrain"

if not os.path.exists(CACHE):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    urllib.request.urlretrieve(URL, CACHE)

import hashlib
assert hashlib.sha256(open(CACHE, "rb").read()).hexdigest() == SHA256, "kaynak dosya değişmiş"

dem = tifffile.imread(CACHE).astype(np.float64)  # (satır, sütun), satır 0 = 36°K, sütun 0 = 112°B
rows, cols = dem.shape
lat0, lon0 = 36.0, -112.0
dlat, dlon = 1.0 / rows, 1.0 / cols

# Metrik ızgara → enlem/boylam (yerel düzlem yaklaşımı; 4 km'de hata < 1 m)
R = 6371008.8
half = SIZE_M / 2
xs = np.linspace(-half, half, N)           # doğu
ys = np.linspace(half, -half, N)           # kuzey (satır 0 kuzey)
X, Y = np.meshgrid(xs, ys)
lat = CENTER[0] + np.degrees(Y / R)
lon = CENTER[1] + np.degrees(X / (R * math.cos(math.radians(CENTER[0]))))
r = (lat0 - lat) / dlat - 0.5
c = (lon - lon0) / dlon - 0.5
h = map_coordinates(dem, [r, c], order=3, mode="nearest")

lo, hi = float(h.min()), float(h.max())
q = np.round((h - lo) / (hi - lo) * 65535).astype(np.uint16)
os.makedirs(OUT, exist_ok=True)
# Tarayıcılar 16 bit PNG'yi 8 bite indirir; yükseklik R (yüksek bayt) + G (düşük bayt) olarak kodlanır.
rgb = np.zeros((N, N, 3), np.uint8)
rgb[..., 0] = q >> 8
rgb[..., 1] = q & 255
Image.fromarray(rgb).save(f"{OUT}/meteor.png", optimize=True)
meta = {
    "name": "Meteor Crater (Barringer), Arizona",
    "center": CENTER,
    "sizeM": SIZE_M,
    "n": N,
    "minM": round(lo, 2),
    "maxM": round(hi, 2),
    "source": "Copernicus GLO-30 DEM (AWS open data)",
    "attribution": "© DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, "
                   "provided under COPERNICUS by the European Union and ESA",
}
json.dump(meta, open(f"{OUT}/meteor.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("TAMAM", meta["minM"], meta["maxM"], os.path.getsize(f"{OUT}/meteor.png") // 1024, "KB")
