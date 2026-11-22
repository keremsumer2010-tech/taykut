# Üçüncü Taraf Varlıklar ve Lisanslar

Sitede kullanılan her üçüncü taraf veri, doku, font, ses ve kütüphane burada listelenir. Lisansı belirsiz hiçbir şey kullanılmaz. Atıf gerektirenler sitenin altbilgisindeki "Veri ve atıflar" bölümünde gösterilir.

## Veri ve görsel varlıklar
| Varlık | Kaynak (URL) | Lisans | Atıf metni | Kullanıldığı yer | Eklendiği bölüm |
|---|---|---|---|---|---|
| Copernicus GLO-30 DEM, N35 W112 karosu (Meteor Krateri, 4×4 km kesit) | https://copernicus-dem-30m.s3.amazonaws.com/ (AWS açık veri) | Copernicus DEM lisansı (ücretsiz kullanım, atıf zorunlu) | © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA | Ana sayfa 3B sahnesi (`public/terrain/meteor.*`, `tools/terrain/bake_crater.py`) | Ana sayfa sahnesi (2026-11-22) |

## Kütüphaneler (çalışma zamanı)
| Paket | Sürüm | Lisans |
|---|---|---|
| react, react-dom | 19.3.1 | MIT |
| three (GLTFLoader, MeshoptDecoder dahil) | 0.187.0 | MIT |

Rover 3B modeli (`public/models/taykut2027.*.glb`) takımın kendi dijital ikiz parçalarından üretilir; üçüncü taraf varlık değildir.

Geliştirme araçları (`devDependencies`) siteye dahil edilmez; lisansları `package-lock.json` üzerinden izlenebilir.
