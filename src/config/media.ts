/**
 * Bildmotive der Website.
 *
 * Branchenbilder zeigen das jeweilige Gewerk beziehungsweise Unternehmens-
 * umfeld – echte Fotografie. Screenshots von Kundenprojekten gehören
 * ausschließlich in den Bereich „Arbeiten“ und werden hier bewusst NICHT
 * als Stimmungsbilder zweckentfremdet.
 *
 * Alle fünf Motive haben dasselbe Seitenverhältnis (4:3) und dieselben
 * Breiten, damit das Raster ruhig bleibt. Eine Branche wird nur dann mit
 * Bild gerendert, wenn die Datei tatsächlich vorliegt – bis dahin bleibt
 * die Fläche leer statt einen Platzhalter oder eine Ersatzlinie zu zeigen.
 *
 * Beschaffungsstand siehe `docs/ASSET_TODO.md`.
 */
export interface Motif {
  /** Dateiname ohne Endung, relativ zu `public/assets/branchen/`. */
  readonly name: string;
  readonly alt: string;
}

/** Einheitliches Format aller Branchenmotive. */
export const INDUSTRY_ASPECT = { width: 1600, height: 1200 } as const;

/** Breiten, die `scripts/build-industry-images.py` erzeugt. */
export const INDUSTRY_WIDTHS = [640, 960, 1280, 1600] as const;

export const industryMotifs: Readonly<Record<string, Motif>> = {
  handwerk: {
    name: 'handwerk',
    alt: 'Handwerkerin bei der Arbeit in einer Werkstatt.',
  },
  zahnarztpraxen: {
    name: 'zahnarztpraxen',
    alt: 'Beratungsgespräch in einer hellen, modernen Praxis.',
  },
  'gastronomie-hotels': {
    name: 'gastronomie-hotels',
    alt: 'Küchenteam bei der Arbeit in einer Restaurantküche.',
  },
  'lokale-dienstleister': {
    name: 'lokale-dienstleister',
    alt: 'Inhaberin eines kleinen Betriebs im Gespräch mit einer Kundin.',
  },
  'b2b-mittelstand': {
    name: 'b2b-mittelstand',
    alt: 'Technisches Team in einem mittelständischen Produktionsbetrieb.',
  },
};

/** Quadratischer Ausschnitt des eigenen Markenmotivs. */
export const crtSquare = {
  src: '/assets/references/kernseite-crt-square.webp',
  width: 900,
  height: 900,
  alt: 'Nahaufnahme des KERNSEITE-Motivs: ein Röhrenmonitor als Kopf, auf dem cyanfarbenen Bildschirm steht KERNSEITE.',
} as const;
