/**
 * Bildmotive, die aus echtem Projektmaterial stammen.
 *
 * Die Branchenbilder sind Ausschnitte aus den Screenshots der beiden echten
 * Referenzprojekte (`scripts/build-reference-crops.py`). Der Alternativtext
 * benennt das offen – es sind keine Stimmungsbilder und keine Stockfotos.
 * Branchen ohne Eintrag bekommen kein Bild und keinen leeren Platzhalter.
 *
 * Breite und Höhe entsprechen den echten Dateimaßen. Die Flächen übernehmen
 * dieses Seitenverhältnis, statt jedes Motiv in dasselbe Raster zu schneiden –
 * daher kommen die wechselnden Formate auf der Seite.
 */
export interface Motif {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export const industryImages: Readonly<Record<string, Motif>> = {
  'gastronomie-hotels': {
    src: '/assets/branchen/gastronomie-hotels.webp',
    width: 1400,
    height: 699,
    alt: 'Ausschnitt der von KERNSEITE umgesetzten Website für Kaya Döner in Himmelstadt: Startbereich mit Speisekarten-Einstieg.',
  },
  'lokale-dienstleister': {
    src: '/assets/branchen/lokale-dienstleister.webp',
    width: 900,
    height: 1125,
    alt: 'Ausschnitt der von KERNSEITE umgesetzten Website für Anna-Lena’s Kinderkörbchen: Startbereich mit Begrüßung und Kontaktmöglichkeiten.',
  },
};

/** Quadratischer Ausschnitt des eigenen Markenmotivs. */
export const crtSquare: Motif = {
  src: '/assets/references/kernseite-crt-square.webp',
  width: 900,
  height: 900,
  alt: 'Nahaufnahme des KERNSEITE-Motivs: ein Röhrenmonitor als Kopf, auf dem cyanfarbenen Bildschirm steht KERNSEITE.',
};
