# Tripo için referans görsel promptları — TAYKUT 2027 rover

Bu görseller Tripo'nun "görselden 3B" üretimine girdi olur. Görsel üretiminde (ChatGPT, Midjourney vb.) promptu **İngilizce** ver; modeller İngilizceyi daha iyi anlar.

**Kurallar (Tripo'nun iyi model çıkarması için):**
- Kare (1:1), en az 1024 px, tercihen 2048 px.
- Düz açık gri ya da beyaz zemin. Araç tamamen kadrajda, kenarlarda boşluk olmalı; hiçbir teker kesilmemeli.
- Yazı, logo, insan, arazi, sert gölge olmamalı.
- Önce **ana görseli** (3/4 açı) üret. Beğendiğinde aynı sohbette 4 ortografik görünüşü iste ("same exact rover" diyerek); tutarlı olurlarsa Tripo'da çok görünüşlü üretim için kullanırız.

Ölçüler `rover_params.yaml` dosyasından alındı. Kol, takımın gripper tasarımına (Gripper A) göre tarif edildi.

---

## 1) Ana görsel — 3/4 ön açı (Tripo'ya bu gider)

```
Photorealistic studio product render of a university Mars-rover-competition robot, the "TAYKUT 2027" six-wheeled rocker-bogie rover, seen from a three-quarter front-left view, camera slightly above (about 25 degrees), entire vehicle fully in frame with generous empty margin on all sides, centered, isolated on a seamless plain light-grey background, soft even studio lighting, soft contact shadow only, sharp focus everywhere, high detail, 1:1 square.

Proportions (keep exactly): overall length about 1.15 m, overall width 0.78 m, body box 0.70 m long x 0.40 m wide x 0.20 m tall, body center 0.40 m above the ground, 0.30 m ground clearance. Six identical wheels, diameter 250 mm, width 100 mm: wheelbase 0.90 m front-to-rear axle, middle wheel exactly halfway; track 0.68 m.

Suspension: classic NASA-style rocker-bogie with differential. On each side a long rocker arm made of 40x20 mm rectangular aluminium box tube pivots on the body side at mid-height through a large flanged bearing hub; the rocker runs forward and down to the front wheel, and rearward to a pivot that carries a shorter bogie arm holding the middle and rear wheels. The bogie pivot is about 12 cm below the rocker pivot. Visible bolts, aluminium gusset plates, black anodized bearing housings, stainless 16 mm pivot pins. A small bevel-gear differential gearbox inside the lower center of the body links the left and right rockers.

Wheels: airless 3D-printed TPU tires in a warm amber-gold signature yellow (hex E7AD01, not lemon yellow), aggressive chevron (V-pattern) tread with 22 lugs, inner face with a light-grey printed hub with hexagonal lightening holes and a ring of hub bolts. Each wheel is driven directly by its own compact black cylindrical brushless gearmotor (DJI M3508 style, about 42 mm diameter, 80 mm long) mounted on the inboard side of the wheel on a vertical aluminium motor plate, with a short black cable running up the arm.

Body: rigid frame of 30x30 mm brushed aluminium box profile with black corner brackets and visible button-head bolts; matte dark-grey composite top deck with a neat grid of bolts; side panels slightly recessed showing an electronics enclosure, a prismatic battery pack and cable harnesses with braided sleeving; small ventilation slots. No text, no logos.

Sensors: at the front of the deck a slim vertical aluminium mast about 25 cm tall carrying a forward-facing stereo camera bar (two lenses 8 cm apart) tilted slightly down. At the rear a taller thin mast (about 40 cm) topped by a round white GNSS antenna puck. A short whip radio antenna at the rear corner. Small LiDAR rangefinder module at the front bumper.

Robot arm: a compact 5-axis robotic arm mounted on a turntable at the front-center of the top deck, posed raised and reaching forward and slightly up in front of the rover (not overlapping the wheels): black anodized rotating base with a slewing bearing, shoulder and elbow joints as dual-sided aluminium yokes with servo actuators, upper arm and forearm made of 16 mm carbon-fibre tubes joined by printed dark-grey CF-nylon brackets, a wrist pitch and wrist roll joint, cables routed neatly along the tubes. End effector: a parallel-jaw gripper with two straight jaws riding on a miniature linear rail, driven by a single lead screw with a small NEMA 11 stepper motor and timing belt at the back, rubber-padded jaw faces with a V-groove, a small wrist camera with two tiny LEDs beside it.

Materials: brushed and bead-blasted aluminium, black anodized aluminium, carbon fibre, matte dark-grey 3D-printed parts, amber-gold TPU tires, small red accents only on bearing seals. Clean, engineered, realistic, competition-ready, like a high-end university rover team (URC / ERC style), product-photography quality.
```

**Negatif prompt (destekleyen araçlarda):**
```
text, letters, logo, watermark, people, hands, terrain, sand, rocks, sky, background scene, cropped wheels, cut off, extra wheels, four wheels, tank tracks, cartoon, toy, plastic look, lemon yellow, motion blur, depth of field blur, fisheye, dramatic shadows, low detail, deformed geometry
```

---

## 2) Aynı aracın 4 ortografik görünüşü (tutarlılık için, isteğe bağlı)

Ana görseli beğendikten sonra **aynı sohbette** sırayla iste:

```
Now render the same exact rover, identical design, colors and arm pose, in a strict orthographic FRONT view (looking straight at the front, camera at body height), entire vehicle in frame with margin, same plain light-grey background and lighting, no perspective distortion, 1:1 square.
```
Sonra `FRONT` yerine sırayla `LEFT SIDE`, `BACK`, `RIGHT SIDE` yaz.

---

## 3) Kolsuz sürüm (sahne ve kinematik için ayrı model gerekebilir)

Ana prompttaki "Robot arm:" paragrafını şununla değiştir:
```
No robot arm: the front of the top deck has only a small folded black arm turntable cap and a magnetic parking cradle.
```

---

## Bana nasıl ileteceksin
Görselleri `taykut/tools/.cache/tripo/ref/` klasörüne at (ya da sohbete ekle). Ben Tripo Studio'ya yükleyip modeli üretir, indirir, ölçek ve eksenleri bizim ölçülerimize hizalar, siteye hazırlarım.
