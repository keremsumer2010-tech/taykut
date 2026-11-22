# Üçüncü Taraf Varlıklar ve Lisanslar

Sitede kullanılan her üçüncü taraf veri, doku, font, ses ve kütüphane burada listelenir. Lisansı belirsiz hiçbir şey kullanılmaz. Atıf gerektirenler sitenin altbilgisindeki "Veri ve atıflar" bölümünde gösterilir.

## Veri ve görsel varlıklar
| Varlık | Kaynak (URL) | Lisans | Atıf metni | Kullanıldığı yer | Eklendiği bölüm |
|---|---|---|---|---|---|
| NASA Blue Marble ("Whole world - land and oceans", 3840 px) | https://commons.wikimedia.org/wiki/File:Whole_world_-_land_and_oceans.jpg | Kamu malı (NASA) | NASA Earth Observatory | Uzay açılışı, gündüz dokusu (`public/space/earth-day-*.webp`) | Uzay açılışı (2026-11-22) |
| NASA Black Marble ("The earth at night", 3840 px) | https://commons.wikimedia.org/wiki/File:The_earth_at_night.jpg | Kamu malı (NASA) | NASA Earth Observatory | Gece ışıkları (`earth-night-2k.webp`) | Uzay açılışı (2026-11-22) |
| Solar System Scope 2k earth clouds | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_earth_clouds.jpg | CC BY 4.0 | Solar System Scope | Bulut katmanı (`earth-clouds-2k.webp`) | Uzay açılışı (2026-11-22) |
| Yale Bright Star Catalogue 5. baskı (BSC5) | http://tdc-www.harvard.edu/catalogs/bsc5.html | Akademik katalog, serbest dağıtım | Hoffleit & Warren, Yale University Observatory | 9.096 yıldız (`stars.bin`) | Uzay açılışı (2026-11-22) |
| Copernicus GLO-30 DEM, 4 karo N34–N35 W111–W112 | https://copernicus-dem-30m.s3.amazonaws.com/ | Copernicus DEM lisansı (atıf zorunlu) | © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA | Alçak irtifa rölyefi (`earth-arizona.webp`, `tools/space/bake_region.py`) | Uzay açılışı (2026-11-22) |
| Copernicus GLO-30 DEM, N35 W112 karosu (Meteor Krateri, 4×4 km kesit) | https://copernicus-dem-30m.s3.amazonaws.com/ (AWS açık veri) | Copernicus DEM lisansı (ücretsiz kullanım, atıf zorunlu) | © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA | Ana sayfa 3B sahnesi (`public/terrain/meteor.*`, `tools/terrain/bake_crater.py`) | Ana sayfa sahnesi (2026-11-22) |

## Kütüphaneler (çalışma zamanı)
| Paket | Sürüm | Lisans |
|---|---|---|
| react, react-dom | 19.3.1 | MIT |
| three (GLTFLoader, MeshoptDecoder dahil) | 0.187.0 | MIT |

Rover 3B modeli (`public/models/taykut2027.*.glb`) takımın kendi dijital ikiz parçalarından üretilir; üçüncü taraf varlık değildir.

Geliştirme araçları (`devDependencies`) siteye dahil edilmez; lisansları `package-lock.json` üzerinden izlenebilir.
