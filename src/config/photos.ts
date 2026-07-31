/**
 * Fotoregister der Website.
 *
 * Jedes Motiv liegt als 4:3-Original unter `public/assets/<gruppe>/source/`
 * und wird von `scripts/build-images.py` in vier Breiten als WebP und AVIF
 * ausgegeben. Hier stehen nur Schlüssel, Gruppe und Alternativtext – die
 * konkreten Dateinamen setzt `src/lib/photo.ts` zusammen.
 *
 * Screenshots von Kundenprojekten stehen bewusst nicht in diesem Register.
 * Sie gehören in den Bereich „Arbeiten“ und sind keine Stimmungsbilder.
 */
export type PhotoGroup = 'branchen' | 'leistungen';

export interface PhotoSource {
  readonly group: PhotoGroup;
  readonly alt: string;
}

export const photos = {
  // --- Leistungen ---------------------------------------------------------
  'social-media': {
    group: 'leistungen',
    alt: 'Smartphone mit verschiedenen Social-Media-Apps',
  },
  unternehmensvideo: {
    group: 'leistungen',
    alt: 'Kamera bei einer professionellen Videoaufnahme',
  },
  'seo-geo': {
    group: 'leistungen',
    alt: 'Visualisierung von SEO und Website-Analyse',
  },
  'standort-wuerzburg': {
    group: 'leistungen',
    alt: 'Blick über Würzburg mit Alter Mainbrücke und Dom',
  },

  // --- Branchen -----------------------------------------------------------
  handwerk: {
    group: 'branchen',
    alt: 'Handwerker beim Schleifen einer Holzplatte',
  },
  zahnarztpraxen: {
    group: 'branchen',
    alt: 'Zahnärztliche Untersuchung einer Patientin in einer Praxis',
  },
  'gastronomie-hotels': {
    group: 'branchen',
    alt: 'Koch beim Anrichten eines Gerichts in der Restaurantküche',
  },
  'lokale-dienstleister': {
    group: 'branchen',
    alt: 'Gebäudereiniger bei der Fassadenreinigung an einem Bürogebäude',
  },
  'b2b-mittelstand': {
    group: 'branchen',
    alt: 'Fachkraft beim Zuschnitt von Bauholz in einer Produktionshalle',
  },
  'restaurant-ambiente': {
    group: 'branchen',
    alt: 'Blick von oben in ein besetztes Restaurant mit eingedeckten Tischen',
  },
  hotelzimmer: {
    group: 'branchen',
    alt: 'Ruhiges Hotelzimmer mit gemachtem Bett und Sessel am Fenster',
  },
  'garten-landschaftsbau': {
    group: 'branchen',
    alt: 'Angelegter Garten mit frischer Bepflanzung und Schubkarre',
  },
} as const satisfies Record<string, PhotoSource>;

export type PhotoKey = keyof typeof photos;
