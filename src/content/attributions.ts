// Altbilgideki "Veri ve atıflar" listesi. Her yeni üçüncü taraf varlık docs/VARLIKLAR.md'ye
// ve atıf gerekiyorsa buraya eklenir. Metinler sağlayıcının istediği biçimde, dilden bağımsız.
export interface Attribution {
  id: string;
  text: string;
  url: string;
}

export const ATTRIBUTIONS: Attribution[] = [
  {
    id: 'nasa-blue-black-marble',
    text: 'Dünya / Earth: NASA Blue Marble & Black Marble (NASA Earth Observatory, public domain)',
    url: 'https://commons.wikimedia.org/wiki/File:Whole_world_-_land_and_oceans.jpg',
  },
  {
    id: 'solarsystemscope-clouds',
    text: 'Bulutlar / Clouds: Solar System Scope, CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_earth_clouds.jpg',
  },
  {
    id: 'yale-bsc',
    text: 'Yıldızlar / Stars: Yale Bright Star Catalogue, 5th ed. (Hoffleit & Warren)',
    url: 'http://tdc-www.harvard.edu/catalogs/bsc5.html',
  },
  {
    id: 'copernicus-dem',
    text: 'Arazi / Terrain (Meteor Crater): Copernicus GLO-30 DEM © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA',
    url: 'https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM',
  },
  {
    id: 'natural-earth',
    text: 'Harita / Map: Natural Earth (public domain)',
    url: 'https://www.naturalearthdata.com/',
  },
  {
    id: 'fonts',
    text: 'Fonts: Archivo, Inter, JetBrains Mono (SIL OFL 1.1)',
    url: 'https://openfontlicense.org/',
  },
];
