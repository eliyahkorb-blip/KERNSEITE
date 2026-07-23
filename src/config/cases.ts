export type CaseFilter = 'websites' | 'google' | 'video' | 'social' | 'ki' | 'konzeptstudie';

export interface CaseStudy {
  readonly slug: string;
  readonly href: string;
  /** Immer true, solange keine echten, freigegebenen Kundenprojekte vorliegen. */
  readonly isConceptStudy: true;
  /** Einheitliches Label für Karten und Detailseiten. */
  readonly badge: 'Konzeptstudie – kein Kundenprojekt';
  readonly title: string;
  readonly industryLabel: string;
  readonly tagline: string;
  /** Filter-Tags für die Übersichtsseite. */
  readonly filters: readonly CaseFilter[];
  /** Farbwelt-Schlüssel für das lokal erzeugte Mockup. */
  readonly mockupTheme: 'meisterwerk' | 'dentale-linie' | 'haus-am-fluss';
  readonly situation: string;
  readonly goal: string;
  readonly strategy: string;
  readonly designSystem: string;
  /** Genutzte Leistungen (service keys). */
  readonly services: readonly string[];
  /** Website-Ausschnitte / Module, die im Mockup gezeigt werden. */
  readonly highlights: readonly string[];
  /** Optionale Module (Video, Google, KI …). */
  readonly optionalModules: readonly string[];
}

/**
 * Drei Konzeptstudien. Alle Namen, Inhalte und Darstellungen sind fiktiv und dienen
 * ausschließlich der Illustration. KEINE echten Kundennamen, Ergebnisse, Kennzahlen,
 * Bewertungen oder Testimonials.
 */
export const cases: readonly CaseStudy[] = [
  {
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

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

export const caseFilters: readonly { readonly key: CaseFilter; readonly label: string }[] = [
  { key: 'websites', label: 'Websites' },
  { key: 'google', label: 'Google' },
  { key: 'video', label: 'Video' },
  { key: 'social', label: 'Social' },
  { key: 'ki', label: 'KI' },
  { key: 'konzeptstudie', label: 'Konzeptstudien' },
];
