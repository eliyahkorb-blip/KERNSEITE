export type CaseFilter =
  | 'referenz'
  | 'websites'
  | 'google'
  | 'video'
  | 'social'
  | 'ki'
  | 'gastronomie'
  | 'lokale-dienstleister'
  | 'konzeptstudie';

export type MockupTheme = 'meisterwerk' | 'dentale-linie' | 'haus-am-fluss';

/** Gemeinsame Felder aller Arbeiten. */
interface WorkCommon {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly industryLabel: string;
  readonly tagline: string;
  readonly filters: readonly CaseFilter[];
}

/** Referenz-Screenshot (aktuell klar gekennzeichneter Platzhalter). */
export interface WorkScreenshot {
  /** Bildpfad des echten Screenshots (WebP). */
  readonly src: string;
  /** Responsive Varianten für `srcset`. */
  readonly srcset?: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/** Echtes, umgesetztes Kundenprojekt (KEINE Konzeptstudie). */
export interface ProjectWork extends WorkCommon {
  readonly kind: 'project';
  /** Name des realen Auftraggebers (Nutzungsrechte bestätigt). */
  readonly client: string;
  /** z. B. "Gastronomie · Website · digitale Speisekarte". */
  readonly category: string;
  /** Große redaktionelle Projektüberschrift. */
  readonly headline: string;
  /** Live-Website (href, ggf. Punycode für IDN). */
  readonly liveUrl: string;
  /** Anzeige-Label der Live-Website (Unicode). */
  readonly liveLabel: string;
  /**
   * Ist die Live-URL im Build-Environment bestätigt/erreichbar? Wird `false`, wenn die URL
   * (noch) nicht verifiziert werden konnte – dann Hinweis, dass Link/Screenshots geprüft
   * bzw. ergänzt werden. Keine erfundenen Ergebnisse.
   */
  readonly verified: boolean;
  readonly situation: string;
  readonly solution: string;
  /** Leistungsumfang (beschreibend, keine erfundenen Kennzahlen). */
  readonly scope: readonly string[];
  readonly screenshotDesktop: WorkScreenshot;
}

/** Konzeptstudie – kein Kundenprojekt (klar gekennzeichnet). */
export interface ConceptWork extends WorkCommon {
  readonly kind: 'concept';
  /** Konzeptstudien werden getrennt von echten Projekten gezeigt. */
  readonly isConceptStudy: true;
  readonly badge: 'Konzeptstudie – kein Kundenprojekt';
  readonly mockupTheme: MockupTheme;
  readonly situation: string;
  readonly goal: string;
  readonly strategy: string;
  readonly designSystem: string;
  readonly services: readonly string[];
  readonly highlights: readonly string[];
  readonly optionalModules: readonly string[];
}

export type Work = ProjectWork | ConceptWork;

/**
 * ECHTE Referenzen (vom Auftraggeber freigegeben, Nutzungsrechte bestätigt).
 *
 * Hinweis: Die Live-Sites konnten im Build-Environment nicht abgerufen werden
 * (Egress-Policy), daher sind die Screenshots aktuell klar gekennzeichnete Platzhalter.
 * Sie werden durch echte, lokal gespeicherte Screenshots (WebP/AVIF) ersetzt.
 * Es werden KEINE erfundenen Ergebnisse oder Prozentwerte genannt.
 */
const projects: readonly ProjectWork[] = [
  {
    kind: 'project',
    slug: 'kaya-doener-himmelstadt',
    href: '/arbeiten/kaya-doener-himmelstadt/',
    title: 'Kaya Döner Himmelstadt',
    headline: 'Appetit auf den ersten Klick.',
    client: 'Kaya Döner Himmelstadt',
    industryLabel: 'Gastronomie',
    category: 'Gastronomie · Website · digitale Speisekarte',
    tagline:
      'Ein klarer und appetitlicher Webauftritt mit direkter Nutzerführung, digitaler Speisekarte und schnellem Zugang zu Standort und Kontakt.',
    liveUrl: 'https://www.kaya-doener-himmelstadt.de',
    liveLabel: 'www.kaya-doener-himmelstadt.de',
    verified: true,
    filters: ['referenz', 'websites', 'gastronomie'],
    situation:
      'Ein lokaler Gastronomiebetrieb braucht einen Auftritt, der die wichtigsten Informationen sofort erreichbar macht – gerade auf dem Smartphone.',
    solution:
      'Ein klar strukturierter Webauftritt mit direkter Nutzerführung, mobil optimierter Darstellung und schnellem Zugang zu den zentralen Inhalten.',
    scope: [
      'Individuelle Website',
      'Mobile Experience / responsive Umsetzung',
      'Klare Nutzerführung zu den wichtigsten Informationen',
      'Fokus auf Performance und Zugänglichkeit',
    ],
    screenshotDesktop: {
      src: '/assets/references/kaya-doener-desktop.webp',
      srcset:
        '/assets/references/kaya-doener-desktop-800.webp 800w, /assets/references/kaya-doener-desktop-1200.webp 1200w, /assets/references/kaya-doener-desktop-1600.webp 1600w, /assets/references/kaya-doener-desktop.webp 1904w',
      width: 1904,
      height: 1010,
      alt: 'Startseite von Kaya Döner Himmelstadt: dunkler Kopfbereich, Schlagzeile „Frischer Döner in Himmelstadt“, Produktfoto und Speisekarte.',
    },
  },
  {
    kind: 'project',
    slug: 'kinderkoerbchen',
    href: '/arbeiten/kinderkoerbchen/',
    title: 'Anna-Lena’s Kinderkörbchen',
    headline: 'Vertrauen, bevor man sich kennt.',
    client: 'Anna-Lena’s Kinderkörbchen',
    industryLabel: 'Kindertagespflege',
    category: 'Kindertagespflege · Website · lokale Sichtbarkeit',
    tagline:
      'Ein warmer, persönlicher Webauftritt, der Betreuung, Persönlichkeit und Vertrauen verständlich zusammenführt.',
    // IDN: Punycode als href, Unicode als Anzeige.
    liveUrl: 'https://www.xn--kinderkrbchen-omb.com',
    liveLabel: 'www.kinderkörbchen.com',
    verified: true,
    filters: ['referenz', 'websites', 'lokale-dienstleister'],
    situation:
      'Ein lokaler Dienstleister möchte Angebot, Persönlichkeit und Vertrauen online verständlich zusammenführen – zugänglich auf allen Geräten.',
    solution:
      'Ein freundlicher, übersichtlicher Webauftritt, der die wichtigsten Inhalte klar bündelt und Vertrauen aufbaut.',
    scope: [
      'Individuelle Website',
      'Struktur für Angebot und Vertrauen',
      'Responsive Darstellung für alle Geräte',
      'Grundlagen für die Auffindbarkeit',
    ],
    screenshotDesktop: {
      src: '/assets/references/kinderkoerbchen-desktop.webp',
      srcset:
        '/assets/references/kinderkoerbchen-desktop-800.webp 800w, /assets/references/kinderkoerbchen-desktop-1200.webp 1200w, /assets/references/kinderkoerbchen-desktop-1600.webp 1600w, /assets/references/kinderkoerbchen-desktop.webp 1905w',
      width: 1905,
      height: 1014,
      alt: 'Startseite von Anna-Lena’s Kinderkörbchen: warme Farbwelt, Begrüßung „Schön, dass du da bist.“ und Porträtfoto.',
    },
  },
];

/**
 * Konzeptstudien – fiktiv, klar als „Konzeptstudie – kein Kundenprojekt“ gekennzeichnet.
 * KEINE echten Kundennamen, Ergebnisse, Kennzahlen, Bewertungen oder Testimonials.
 */
const concepts: readonly ConceptWork[] = [
  {
    kind: 'concept',
    slug: 'meisterwerk',
    href: '/arbeiten/meisterwerk/',
    isConceptStudy: true,
    badge: 'Konzeptstudie – kein Kundenprojekt',
    title: 'Meisterwerk',
    industryLabel: 'Handwerksbetrieb',
    tagline: 'Ein moderner Handwerksbetrieb, der Qualität sichtbar macht.',
    filters: ['websites', 'google', 'konzeptstudie'],
    mockupTheme: 'meisterwerk',
    situation:
      'Ein etablierter Handwerksbetrieb wirkt online deutlich schwächer als in der Realität: veraltete Seite, unklare Leistungen, kaum Kontaktwege.',
    goal: 'Der Auftritt soll die tatsächliche Qualität zeigen, Anfragen erleichtern und Bewerber ansprechen.',
    strategy:
      'Klare Leistungsstruktur, prominente Kontaktwege, eine ehrliche Karriere-Sektion und eine kräftige, handwerklich-selbstbewusste Bildsprache.',
    designSystem:
      'Kräftiges Ultramarin als Ankerfarbe, große Typografie, ruhige Flächen und viel Raum für echte Baustellen- und Teambilder.',
    services: ['websites', 'google'],
    highlights: [
      'Leistungsübersicht mit klarer Gliederung',
      'Referenz-/Baustellen-Sektion',
      'Karriere-Bereich für Bewerber',
      'Schnelle Kontaktwege (Anruf, Rückruf, Formular)',
    ],
    optionalModules: ['Google-Unternehmensprofil'],
  },
  {
    kind: 'concept',
    slug: 'dentale-linie',
    href: '/arbeiten/dentale-linie/',
    isConceptStudy: true,
    badge: 'Konzeptstudie – kein Kundenprojekt',
    title: 'Dentale Linie',
    industryLabel: 'Zahnarztpraxis',
    tagline: 'Eine Zahnarztpraxis mit ruhiger, vertrauensbildender Nutzerführung.',
    filters: ['websites', 'ki', 'konzeptstudie'],
    mockupTheme: 'dentale-linie',
    situation:
      'Eine Praxis möchte online ruhiger und vertrauenswürdiger wirken und den Weg zum Termin vereinfachen – ohne reißerische Versprechen.',
    goal: 'Vertrauen aufbauen, Behandlungsschwerpunkte verständlich zeigen und Terminwege klar machen.',
    strategy:
      'Reduzierte, helle Gestaltung, verständliche Sprache, klare Terminwege und ein sympathisches Team-Kapitel.',
    designSystem:
      'Helle Papierflächen, feines Electric Cyan als Akzent, viel Weißraum und eine ruhige, seriöse Typografie.',
    services: ['websites', 'ki'],
    highlights: [
      'Verständliche Behandlungsschwerpunkte',
      'Team-Kapitel',
      'Klare Terminwege',
      'FAQ zu Ablauf und Angst-Themen',
    ],
    optionalModules: ['Website-Chatbot für häufige Fragen'],
  },
  {
    kind: 'concept',
    slug: 'haus-am-fluss',
    href: '/arbeiten/haus-am-fluss/',
    isConceptStudy: true,
    badge: 'Konzeptstudie – kein Kundenprojekt',
    title: 'Haus am Fluss',
    industryLabel: 'Boutique-Hotel',
    tagline: 'Ein Boutique-Hotel, das seine Atmosphäre spürbar macht.',
    filters: ['websites', 'video', 'social', 'konzeptstudie'],
    mockupTheme: 'haus-am-fluss',
    situation:
      'Ein kleines Hotel mit besonderer Atmosphäre transportiert online zu wenig von seinem Charakter und macht die Buchung zu umständlich.',
    goal: 'Die Atmosphäre erlebbar machen und den Weg zur Buchung deutlich vereinfachen.',
    strategy:
      'Bild- und videostarke Gestaltung, klare Zimmerdarstellung und ein prominenter, datenschutzfreundlicher Buchungsweg.',
    designSystem:
      'Tiefes Marineblau für stimmungsvolle Kapitel, warme Papierflächen und großformatige, ruhige Bildwelten.',
    services: ['websites', 'video', 'social'],
    highlights: [
      'Stimmungsvolle Startsequenz',
      'Zimmer- und Angebotsübersicht',
      'Prominenter Buchungsweg',
      'Anbindung an Social-Media-Inhalte',
    ],
    optionalModules: ['Kurzer Website-Clip', 'Social-Media-Vorschau'],
  },
];

/**
 * Konzeptstudien sind derzeit NICHT veröffentlicht. Sie wurden mit gezeichneten
 * Mockups dargestellt und sollen nicht neben echten Kundenprojekten stehen.
 * Zum Wiederveröffentlichen: `PUBLISH_CONCEPTS` auf `true` setzen – dann
 * erscheinen sie ausschließlich in einem eigenen Abschnitt unterhalb der
 * echten Arbeiten und niemals auf der Startseite.
 */
export const PUBLISH_CONCEPTS = false;

/** Öffentlich sichtbare Arbeiten: aktuell ausschließlich echte Referenzen. */
export const works: readonly Work[] = PUBLISH_CONCEPTS ? [...projects, ...concepts] : [...projects];

/** Alle Konzeptstudien (unabhängig von der Veröffentlichung). */
export const conceptStudies: readonly ConceptWork[] = concepts;

/** Nur echte Referenzprojekte (z. B. für „Ausgewählte Arbeiten“ auf der Startseite). */
export const featuredProjects: readonly ProjectWork[] = projects;

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export const workFilters: readonly { readonly key: CaseFilter; readonly label: string }[] = [
  { key: 'websites', label: 'Websites' },
  { key: 'gastronomie', label: 'Gastronomie' },
  { key: 'lokale-dienstleister', label: 'Lokale Dienstleister' },
];
