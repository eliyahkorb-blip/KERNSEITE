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
  /** Bildpfad (Platzhalter; echte WebP/AVIF-Screenshots ersetzen ihn später). */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/** Echtes, umgesetztes Kundenprojekt (KEINE Konzeptstudie). */
export interface ProjectWork extends WorkCommon {
  readonly kind: 'project';
  /** Name des realen Auftraggebers (Nutzungsrechte bestätigt). */
  readonly client: string;
  /** z. B. "Gastronomie · Website · Mobile Experience". */
  readonly category: string;
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
  readonly screenshotMobile: WorkScreenshot;
}

/** Konzeptstudie – kein Kundenprojekt (klar gekennzeichnet). */
export interface ConceptWork extends WorkCommon {
  readonly kind: 'concept';
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
    title: 'Digitaler Auftritt für Kaya Döner Himmelstadt',
    client: 'Kaya Döner Himmelstadt',
    industryLabel: 'Gastronomie',
    category: 'Gastronomie · Website · Mobile Experience',
    tagline:
      'Ein klar strukturierter Webauftritt für einen lokalen Gastronomiebetrieb – mit direkter Nutzerführung, mobil optimierter Darstellung und schnellem Zugang zu den wichtigsten Informationen.',
    liveUrl: 'https://www.kaya-doener-himmelstadt.de',
    liveLabel: 'www.kaya-doener-himmelstadt.de',
    verified: false,
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
      src: '/assets/references/kaya-doener-desktop.svg',
      width: 1440,
      height: 900,
      alt: 'Gestaltungsvorschau der Website von Kaya Döner Himmelstadt: dunkler Kopfbereich, große Schlagzeile „Frischer Döner in Himmelstadt“ und Speisekarte.',
    },
    screenshotMobile: {
      src: '/assets/references/kaya-doener-mobile.svg',
      width: 390,
      height: 780,
      alt: 'Mobile Gestaltungsvorschau der Website von Kaya Döner Himmelstadt mit Schlagzeile, Aktionsschaltflächen und Öffnungszeiten.',
    },
  },
  {
    kind: 'project',
    slug: 'kinderkoerbchen',
    href: '/arbeiten/kinderkoerbchen/',
    title: 'Vertrauensvoller Webauftritt für Kinderkörbchen',
    client: 'Kinderkörbchen',
    industryLabel: 'Lokaler Dienstleister',
    category: 'Lokaler Dienstleister · Website · Sichtbarkeit',
    tagline:
      'Ein freundlicher und übersichtlicher Webauftritt, der Angebot, Persönlichkeit und Vertrauen verständlich zusammenführt und auf allen Geräten zugänglich macht.',
    // IDN: Punycode als href, Unicode als Anzeige.
    liveUrl: 'https://www.xn--kinderkrbchen-9ib.de',
    liveLabel: 'www.kinderkörbchen.de',
    verified: false,
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
      src: '/assets/references/kinderkoerbchen-desktop.svg',
      width: 1440,
      height: 900,
      alt: 'Gestaltungsvorschau der Website von Anna-Lena’s Kinderkörbchen: warme Farbwelt, Begrüßungstext und Porträtfläche.',
    },
    screenshotMobile: {
      src: '/assets/references/kinderkoerbchen-mobile.svg',
      width: 390,
      height: 780,
      alt: 'Mobile Gestaltungsvorschau der Website von Anna-Lena’s Kinderkörbchen mit Begrüßung und Kontaktschaltflächen.',
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

/** Reihenfolge: echte Referenzen zuerst, dann Konzeptstudien. */
export const works: readonly Work[] = [...projects, ...concepts];

/** Nur echte Referenzprojekte (z. B. für „Ausgewählte Arbeiten“ auf der Startseite). */
export const featuredProjects: readonly ProjectWork[] = projects;

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export const workFilters: readonly { readonly key: CaseFilter; readonly label: string }[] = [
  { key: 'referenz', label: 'Referenzen' },
  { key: 'websites', label: 'Websites' },
  { key: 'google', label: 'Google' },
  { key: 'video', label: 'Video' },
  { key: 'social', label: 'Social' },
  { key: 'ki', label: 'KI' },
  { key: 'konzeptstudie', label: 'Konzeptstudien' },
];
