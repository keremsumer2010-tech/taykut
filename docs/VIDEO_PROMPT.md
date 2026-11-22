# Açılış videosu — Higgsfield (Seedance 2.5, çoklu referans)

**Model:** `seedance_2_5`, mod `omni_reference`, 16:9, ses kapalı (site sessiz açılır).
**Maliyet (2026-11-22 teklifi):** 10 sn 720p = 70 kredi · 10 sn 1080p = 160 kredi · 4 sn 480p deneme = 12 kredi.
**Referanslar:** `tools/.cache/video/ref/` — 30 görsel, hepsi TAYKUT 2027 tasarım modelinden:
- 5 ortografik/izometrik görünüş (ön, sol, arka, sağ, 3/4),
- 3 Blender render'ı (3/4, yan, teker yakın çekim),
- 4 kinematik denetim sahnesi (45 cm basamak, yan eğim, kaya, engebe: süspansiyonun nasıl eğildiği),
- 14 Meteor Krateri sahne karesi (gerçek arazi verisi, aynı ışık),
- 2 poster (geniş, dikey), 1 dijital ikiz görüntüsü (Gazebo), 1 gerçekçi stil görseli.
Önizleme: `tools/.cache/video/referans_paketi.jpg`.

## Prompt (İngilizce ver)

```
Cinematic 10-second opening shot for a rover team website. Use the reference images as the exact design of the
rover: a six-wheeled rocker-bogie rover with a compact black-and-aluminium box body, long aluminium rocker beams
pivoting at the body sides, short bogies carrying the middle and rear wheels, and amber-gold chevron-tread TPU wheels
with perforated grey hubs. Keep its proportions, wheel count and suspension geometry exactly as in the references;
do not add parts that are not in the references.

Scene: the rim of a real impact crater in an Arizona desert at golden hour (as in the crater reference frames), low
warm sun, long soft shadows, fine dust, blue sky fading to a warm horizon.

Shot: start high and wide above the crater, glide down toward the rim, then a smooth low tracking shot beside the
rover as it drives slowly over small rocks; the rocker and bogie arms visibly tilt independently while all six
wheels stay on the ground; a little dust rises from the rear wheels. End on a heroic three-quarter low angle of the
rover with the crater bowl behind it. Photorealistic, natural motion, steady camera, no text, no logos, no people.
```

**Negatif (destekleniyorsa):** `four wheels, tank tracks, extra arms, deformed wheels, text, watermark, cartoon, fast shaky camera`

## Siteye ekleme planı
Üretilen video ana sayfada 3B sahnenin **açılışı** olarak oynar (bir kez, sessiz, `playsinline`), sonra canlı 3B sahneye
yumuşak geçiş yapar. Hareket azaltma tercihinde video oynamaz, poster görünür. Dosya WebM/MP4, ≤ 4 MB hedef
(Smart App Control ffmpeg'i engellediği için kodlama Higgsfield çıktısıyla sınırlı; gerekirse 720p seçilir).
Videonun yapay zekâ ile üretildiği, sitede küçük bir notla belirtilir.
