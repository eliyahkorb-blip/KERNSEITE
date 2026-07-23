export interface ProcessStep {
  readonly number: number;
  readonly title: string;
  readonly body: string;
  /** Was der Kunde beiträgt. */
  readonly customer?: string;
  /** Was KERNSEITE übernimmt. */
  readonly kernseite?: string;
}

/** Kurzform (Startseite). */
export const processShort: readonly { readonly title: string; readonly body: string }[] = [
  { title: 'Kennenlernen', body: 'Wir klären, was du vorhast und was wirklich sinnvoll ist.' },
  {
    title: 'Strategie & Angebot',
    body: 'Ziele, Umfang und ein transparentes, schriftliches Angebot.',
  },
  {
    title: 'Inhalte & Design',
    body: 'Struktur, Texte und eine visuelle Richtung, die zu dir passt.',
  },
  { title: 'Entwicklung', body: 'Saubere, schnelle und barrierearme Umsetzung.' },
  {
    title: 'Prüfung & Veröffentlichung',
    body: 'Technische und inhaltliche Kontrolle, dann Live-Gang.',
  },
  { title: 'Betreuung & Wachstum', body: 'Pflege, Weiterentwicklung und optionale Erweiterungen.' },
];

/** Ausführliche Prozessseite. */
export const processFull: readonly ProcessStep[] = [
  {
    number: 1,
    title: 'Erstgespräch und Ziele',
    body: 'Wir sprechen über dein Unternehmen, deine Ziele und die wichtigsten Fragen. Ohne Verkaufsdruck.',
    customer: 'Einblick in Unternehmen, Ziele und bestehende Materialien.',
    kernseite: 'Zuhören, einordnen, erste Empfehlung.',
  },
  {
    number: 2,
    title: 'Bestandsaufnahme',
    body: 'Wir schauen uns bestehende Website, Google-Profil und Inhalte an und leiten daraus ab, was übernommen und was neu gemacht wird.',
    customer: 'Zugänge/Informationen zu bestehenden Auftritten.',
    kernseite: 'Analyse und Empfehlung.',
  },
  {
    number: 3,
    title: 'Seitenstruktur und Inhalte',
    body: 'Wir legen die Seitenstruktur fest und planen die Inhalte. So entsteht ein roter Faden, bevor gestaltet wird.',
    customer: 'Fachliche Inhalte, Freigaben, Zuarbeit.',
    kernseite: 'Struktur, Textaufbau, Inhaltsplan.',
  },
  {
    number: 4,
    title: 'Visuelle Richtung',
    body: 'Wir entwickeln eine gestalterische Richtung: Farben, Typografie und Bildsprache – abgestimmt auf dein Unternehmen.',
    kernseite: 'Designkonzept und erste Entwürfe.',
  },
  {
    number: 5,
    title: 'Designfreigabe',
    body: 'Gemeinsam schauen wir das Design an, klären Fragen und geben es frei.',
    customer: 'Feedback und Freigabe.',
    kernseite: 'Anpassungen bis zur Freigabe.',
  },
  {
    number: 6,
    title: 'Entwicklung',
    body: 'Die Website wird sauber, schnell und barrierearm umgesetzt – mit Blick auf Performance und Datenschutz.',
    kernseite: 'Technische Umsetzung und Integration.',
  },
  {
    number: 7,
    title: 'Technische und inhaltliche Prüfung',
    body: 'Wir prüfen Funktion, Darstellung, Verlinkung, Barrierefreiheit und Inhalte auf verschiedenen Geräten.',
    customer: 'Letzte inhaltliche Kontrolle.',
    kernseite: 'Qualitätssicherung und Korrekturen.',
  },
  {
    number: 8,
    title: 'Veröffentlichung',
    body: 'Nach bestandener Prüfung geht die Website live – auf Wunsch auf einem deutschen Serverstandort.',
    kernseite: 'Live-Gang und technische Einrichtung.',
  },
  {
    number: 9,
    title: 'Betreuung und Wachstum',
    body: 'Nach dem Start geht es weiter: Pflege, Weiterentwicklung und optionale Erweiterungen wie Google, Video, Social oder Automatisierung.',
    kernseite: 'Laufende Betreuung und Weiterentwicklung.',
  },
];
