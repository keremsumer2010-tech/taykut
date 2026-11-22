// Altbilgideki "Veri ve atıflar" listesi. Her yeni üçüncü taraf varlık docs/VARLIKLAR.md'ye
// ve atıf gerekiyorsa buraya eklenir. Metinler sağlayıcının istediği biçimde, dilden bağımsız.
export interface Attribution {
  id: string;
  text: string;
  url: string;
}

export const ATTRIBUTIONS: Attribution[] = [
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
