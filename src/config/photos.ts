/** Fotoregister. Quellen und Dateiprüfsummen: assets-source/photo-credits.json. */
export type PhotoGroup = 'branchen' | 'leistungen';
export interface PhotoSource {
  readonly group: PhotoGroup;
  readonly alt: string;
}
export const photos = {
  'social-media': { group: 'leistungen', alt: 'Smartphone mit verschiedenen Social-Media-Apps' },
  unternehmensvideo: { group: 'leistungen', alt: 'Kamera bei einer Videoaufnahme' },
  'seo-geo': { group: 'leistungen', alt: 'Visualisierung von SEO und Website-Analyse' },
  'standort-wuerzburg': {
    group: 'leistungen',
    alt: 'Blick über Würzburg mit Alter Mainbrücke und Dom',
  },
  handwerk: { group: 'branchen', alt: 'Werkzeuge, Holz und Bohrmaschine auf einer Werkbank' },
  zahnarztpraxen: { group: 'branchen', alt: 'Zahnärztliche Untersuchung in einer Praxis' },
  'gastronomie-hotels': { group: 'branchen', alt: 'Restaurantinterieur mit Tischen und Stühlen' },
  'lokale-dienstleister': { group: 'branchen', alt: 'Glasreinigung an einer Gebäudefassade' },
  'b2b-mittelstand': { group: 'branchen', alt: 'Innenraum einer industriellen Produktionshalle' },
  hotelzimmer: { group: 'branchen', alt: 'Hotelzimmer mit Doppelbett und warmem Licht' },
} as const satisfies Record<string, PhotoSource>;
export type PhotoKey = keyof typeof photos;
