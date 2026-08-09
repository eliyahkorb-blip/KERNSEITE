export type ServiceKey = 'websites' | 'seo-geo' | 'google' | 'video' | 'social' | 'ki';

export interface ServiceSection {
  readonly title: string;
  readonly body: string;
}

export interface Service {
  readonly key: ServiceKey;
  readonly slug: string;
  readonly href: string;
  readonly order: number;
  /** Kern-Leistung (Website) vs. andockende Erweiterung. */
  readonly isCore: boolean;
  /** Kurzes Navigations-/Karten-Label. */
  readonly label: string;
  /** Karten-Titel auf der Startseite. */
  readonly cardTitle: string;
  /** Kurzer Teaser (Karte, Übersicht). */
  readonly teaser: string;
  /** Konkretes Beispiel, das bei Hover/Fokus die Karte redaktionell erweitert. */
  readonly example: string;
  /** H1 der Detailseite. */
  readonly detailH1: string;
  /** Einleitung auf der Detailseite. */
  readonly intro: string;
  readonly problem: string;
  readonly solution: string;
  /** Typische Bestandteile. */
  readonly components: readonly string[];
  /** Nutzen. */
  readonly benefits: readonly string[];
  /** Ablauf-Schritte. */
  readonly steps: readonly string[];
  /** Passende Zielgruppen. */
  readonly audiences: readonly string[];
  /** Ehrlicher Hinweis auf Partner/Subunternehmer (falls zutreffend). */
  readonly partnerNote?: string;
  /** Weitere redaktionelle Abschnitte der Detailseite. */
  readonly sections: readonly ServiceSection[];
}

export const services: readonly Service[] = [
  {
    key: 'websites',
    slug: 'websites',
    href: '/leistungen/websites/',
    order: 1,
    isCore: true,
    label: 'Websites',
    cardTitle: 'Individuelle Websites',
    teaser:
      'Der Kern. Struktur, Design, Inhalte und Technik werden für dein Unternehmen entwickelt – nicht aus einem Template zusammengeklickt.',
    example:
      'Beispiel: Ein Handwerksbetrieb bekommt eine klare Leistungsstruktur, schnelle Kontaktwege und eine Karriere-Sektion, die zum Betrieb passt – statt einer Baukasten-Startseite.',
    detailH1: 'Websites, die nicht nur gut aussehen.',
    intro:
      'Deine Website soll nicht zeigen, dass du eine Website hast. Sie soll zeigen, warum man sich für dein Unternehmen entscheiden sollte.',
    problem:
      'Viele Unternehmensseiten sind technisch veraltet, langsam, schwer bedienbar und wirken austauschbar. Gute Betriebe verlieren dadurch Anfragen und Bewerber.',
    solution:
      'Jede KERNSEITE beginnt mit dem Unternehmen: Ziele, Zielgruppen und Nutzerführung. Darauf folgen individuelles Design, sauberer Code und eine Technik, die schnell, sicher und wartbar ist.',
    components: [
      'Strategie und Zieldefinition',
      'Seiten- und Nutzerführung (Informationsarchitektur)',
      'Individuelles Screendesign',
      'Responsive Entwicklung mit semantischem HTML',
      'SEO- und GEO-Grundlagen sowie strukturierte Daten',
      'Barrierearmut nach modernen Standards',
      'Performance-Optimierung',
      'Datenschutzfreundliche Umsetzung und sichere Formulare',
      'Hosting, Wartung und laufende Betreuung',
    ],
    benefits: [
      'Ein Auftritt, der zur tatsächlichen Qualität deines Betriebs passt',
      'Mehr qualifizierte Anfragen durch klare Nutzerführung',
      'Bessere Auffindbarkeit durch saubere Technik',
      'Volle Kontrolle: Inhalte lassen sich weiterentwickeln',
    ],
    steps: ['Strategie', 'Struktur', 'Design', 'Entwicklung', 'Veröffentlichung', 'Betreuung'],
    audiences: [
      'Handwerksbetriebe',
      'Praxen',
      'Gastronomie & Hotels',
      'Lokale Dienstleister',
      'B2B-Mittelstand',
    ],
    sections: [
      {
        title: 'Strategie vor Gestaltung',
        body: 'Bevor gestaltet wird, klären wir Ziele, Zielgruppen und die wichtigsten Wege durch die Seite. So entsteht eine Struktur, die Besucher führt statt verwirrt.',
      },
      {
        title: 'Individuelles Design statt Baukasten',
        body: 'Farben, Typografie und Bildsprache werden auf dein Unternehmen abgestimmt. Kein austauschbares Theme, sondern ein eigenständiger Auftritt.',
      },
      {
        title: 'Mobile Nutzerführung',
        body: 'Die meisten Besucher kommen über das Smartphone. Deshalb wird das mobile Layout eigenständig gestaltet – nicht nur zusammengeschoben.',
      },
      {
        title: 'Performance & Technik',
        body: 'Optimierte Bilder, wenig JavaScript, saubere Auslieferung. Das Ergebnis lädt schnell und läuft auf normalem deutschen Webhosting.',
      },
      {
        title: 'SEO/GEO-Grundlage',
        body: 'SEO steht für Suchmaschinenoptimierung: technisch saubere, gut auffindbare Seiten. GEO meint die Optimierung für KI-Antwortsysteme, die klare Fakten über dein Unternehmen erkennen können.',
      },
      {
        title: 'Datenschutz & Barrierearmut',
        body: 'Standardmäßig ohne externe Tracker und ohne fremde CDNs. Semantische Struktur, Tastaturbedienbarkeit und ausreichende Kontraste als Qualitätsstandard.',
      },
    ],
  },
  {
    key: 'seo-geo',
    slug: 'seo-geo',
    href: '/leistungen/seo-geo/',
    order: 2,
    isCore: false,
    label: 'SEO & GEO',
    cardTitle: 'SEO & GEO',
    teaser:
      'Gefunden werden – in der Google-Suche und in KI-Antworten. SEO sorgt für saubere, auffindbare Seiten, GEO dafür, dass Antwortsysteme dein Unternehmen richtig wiedergeben.',
    example:
      'Beispiel: Eine Praxis bekommt je Behandlungsschwerpunkt eine eigene, klar beantwortende Seite – Suchmaschinen und Antwortsysteme finden dieselbe Aussage.',
    detailH1: 'Gefunden werden. Und richtig wiedergegeben.',
    intro:
      'Suche passiert längst nicht mehr nur bei Google. Immer öfter beantworten Systeme die Frage direkt – mit Inhalten, die sie irgendwo gelesen haben. Beides braucht dieselbe Grundlage: klare, überprüfbare Inhalte auf einer technisch sauberen Seite.',
    problem:
      'Viele Seiten sind technisch langsam, thematisch unscharf und beantworten keine konkrete Frage. Dann fehlt Google die Grundlage für ein gutes Ergebnis – und Antwortsysteme geben Falsches oder gar nichts wieder.',
    solution:
      'Wir bauen die Inhalte entlang echter Fragen auf, geben jeder Seite genau ein Thema, sorgen für saubere Technik und machen Fakten wie Standort, Leistungen und Zuständigkeit eindeutig auslesbar.',
    components: [
      'Themen- und Fragenrecherche statt Keyword-Listen',
      'Eine klare Aufgabe pro Seite (Struktur & interne Verlinkung)',
      'Technische Grundlagen: Ladezeit, semantisches HTML, Sitemap, Canonicals',
      'Strukturierte Daten für Unternehmen, Leistungen und FAQ',
      'Verständliche, beantwortende Textstruktur (GEO-tauglich)',
      'Lokale Signale für Würzburg und die Region',
    ],
    benefits: [
      'Deine Seiten sind für Menschen und Maschinen eindeutig',
      'Antwortsysteme geben deine Fakten korrekt wieder',
      'Mehr qualifizierte Anfragen statt Zufallsbesuche',
      'Eine Grundlage, die auch bei künftigen Suchsystemen trägt',
    ],
    steps: [
      'Bestandsaufnahme: Was ist auffindbar, was fehlt?',
      'Fragen und Themen je Zielgruppe sammeln',
      'Seitenstruktur und interne Verlinkung festlegen',
      'Inhalte beantwortend schreiben',
      'Technik und strukturierte Daten umsetzen',
      'Sichtbarkeit beobachten und nachschärfen',
    ],
    audiences: ['Lokale Dienstleister', 'Praxen', 'Gastronomie & Hotels', 'B2B-Mittelstand'],
    sections: [
      {
        title: 'Was GEO bedeutet',
        body: 'GEO steht für Generative Engine Optimization: die Optimierung für Systeme, die Antworten erzeugen statt Linklisten. Entscheidend sind klare Fakten, eindeutige Zuständigkeit und eine Struktur, die eine Frage tatsächlich beantwortet.',
      },
      {
        title: 'Was wir nicht versprechen',
        body: 'Keine Platzierungen, keine Garantien, keine Tricks. Sichtbarkeit lässt sich verbessern – wir arbeiten an den Grundlagen, die du selbst in der Hand hast, und sagen offen, was Zeit braucht.',
      },
    ],
  },
  {
    key: 'google',
    slug: 'google-unternehmensprofil',
    href: '/leistungen/google-unternehmensprofil/',
    order: 3,
    isCore: false,
    label: 'Google-Sichtbarkeit',
    cardTitle: 'Google-Unternehmensprofil',
    teaser:
      'Gefunden werden, wenn es vor Ort zählt. Ein sauber gepflegtes Profil macht dein Angebot und deinen Standort für Google eindeutig.',
    example:
      'Beispiel: Eine Praxis erhält korrekte Kategorien, klare Leistungen, aktuelle Bilder und einen Prozess, um auf Bewertungen zu antworten.',
    detailH1: 'Gefunden werden, wenn es vor Ort zählt.',
    intro:
      'Wer in der Nähe sucht, entscheidet schnell. Ein konsistentes Google-Unternehmensprofil sorgt dafür, dass dein Unternehmen richtig verstanden und gefunden wird.',
    problem:
      'Unvollständige oder widersprüchliche Profildaten führen dazu, dass Google Angebot und Standort nicht eindeutig zuordnet – und du sichtbar bleibst, wo es zählt.',
    solution:
      'Wir richten das Profil sauber ein oder optimieren es: passende Kategorien, klare Leistungen, aktuelle Inhalte und ein Prozess für Bewertungen – abgestimmt mit der Website.',
    components: [
      'Analyse des bestehenden Profils',
      'Passende Kategorien und Leistungen',
      'Aussagekräftige Unternehmensbeschreibung',
      'Bilder und Aktualität',
      'Bewertungsprozess und Antworten',
      'Konsistente Kontaktdaten (NAP)',
      'Zusammenspiel mit der Website',
    ],
    benefits: [
      'Bessere lokale Auffindbarkeit',
      'Klarere Zuordnung von Angebot und Standort',
      'Mehr Vertrauen durch aktuelle, konsistente Angaben',
    ],
    steps: [
      'Analyse',
      'Einrichtung/Optimierung',
      'Inhalte & Bilder',
      'Bewertungsprozess',
      'Betreuung',
    ],
    audiences: ['Lokale Dienstleister', 'Praxen', 'Handwerk', 'Gastronomie & Hotels'],
    sections: [
      {
        title: 'Konsistente Unternehmensdaten',
        body: 'Name, Adresse und Telefonnummer müssen überall gleich sein. Widersprüche schwächen die lokale Sichtbarkeit.',
      },
      {
        title: 'Bewertungen und Antworten',
        body: 'Wir richten einen einfachen Prozess ein, um Bewertungen zu erhalten und professionell zu beantworten – ohne Bewertungen zu kaufen oder zu fälschen.',
      },
      {
        title: 'Ehrliche Erwartungen',
        body: 'Wir geben keine Ranking-Garantien. Lokale Sichtbarkeit entsteht durch saubere Daten, Relevanz und kontinuierliche Pflege.',
      },
    ],
  },
  {
    key: 'video',
    slug: 'unternehmensvideo',
    href: '/leistungen/unternehmensvideo/',
    order: 4,
    isCore: false,
    label: 'Unternehmensvideo',
    cardTitle: 'Unternehmensvideo',
    teaser:
      'Zeig, was Texte allein nicht vermitteln können. Echte Einblicke schaffen Vertrauen – auf der Website und in Social Media.',
    example:
      'Beispiel: Ein kurzer Website-Clip zeigt Team und Arbeitsweise. Datenschutzfreundlich eingebunden, ohne Autoplay mit Ton.',
    detailH1: 'Zeig, was Texte allein nicht vermitteln können.',
    intro:
      'Menschen vertrauen dem, was sie sehen. Ein gutes Unternehmensvideo macht Atmosphäre, Team und Arbeitsweise erlebbar.',
    problem:
      'Reine Textseiten wirken oft distanziert. Gerade Vertrauen, Handschlagqualität und Atmosphäre lassen sich schwer beschreiben.',
    solution:
      'Von Konzept über Drehplanung bis zur Einbindung: Wir planen das Video entlang deiner Ziele und binden es performant und datenschutzfreundlich ein.',
    components: [
      'Konzeption und Briefing',
      'Drehplanung',
      'Unternehmensfilm',
      'Recruitingfilm',
      'Kurze Website-Clips',
      'Mitarbeiter- und Prozessaufnahmen',
      'Technische Website-Integration',
    ],
    benefits: [
      'Mehr Vertrauen durch echte Einblicke',
      'Stärkere Wirkung auf Website und Social Media',
      'Unterstützung beim Recruiting',
    ],
    steps: ['Konzept', 'Drehplanung', 'Dreh', 'Schnitt', 'Einbindung'],
    audiences: ['Handwerk', 'Hotels & Gastronomie', 'B2B-Mittelstand', 'Praxen'],
    partnerNote:
      'Die filmische Umsetzung erfolgt gemeinsam mit einem spezialisierten Videopartner. Konzept, Website-Integration und Projektsteuerung bleiben bei KERNSEITE.',
    sections: [
      {
        title: 'Datenschutzfreundliche Einbindung',
        body: 'Keine automatisch startenden Videos mit Ton, kein fremder Player, der ungefragt lädt. Die Vorschau wird lokal ausgeliefert; der Player startet erst nach aktivem Klick.',
      },
      {
        title: 'Vom Clip bis zum Recruitingfilm',
        body: 'Kurze Sequenzen für die Startseite, ein ausführlicher Unternehmensfilm oder ein Recruitingfilm für offene Stellen – je nach Ziel.',
      },
    ],
  },
  {
    key: 'social',
    slug: 'social-media',
    href: '/leistungen/social-media/',
    order: 5,
    isCore: false,
    label: 'Social Media',
    cardTitle: 'Social Media',
    teaser:
      'Eine Marke muss nicht jeden Tag posten. Sie muss erkennbar bleiben. Strategie und Wiedererkennung statt Aktionismus.',
    example:
      'Beispiel: Ein Brandbook definiert Look und Tonalität, ein Redaktionsplan sorgt für regelmäßige, erkennbare Beiträge.',
    detailH1: 'Eine Marke muss nicht jeden Tag posten. Sie muss erkennbar bleiben.',
    intro:
      'Guter Social-Media-Auftritt beginnt mit einer klaren Marke und einem realistischen Plan – nicht mit Dauerdruck.',
    problem:
      'Ohne Strategie und Wiedererkennung verpufft der Aufwand: uneinheitliche Beiträge, unklare Botschaft, keine Verbindung zur Website.',
    solution:
      'Wir schaffen einen erkennbaren Markenauftritt, planbare Inhalte und die Verbindung zu Website und Kampagnen.',
    components: [
      'Social-Media-Strategie',
      'Markenauftritt und Brandbook',
      'Content-Säulen',
      'Reels und Kurzvideos',
      'Redaktionelle Planung',
      'Laufende Betreuung',
      'Verbindung mit Website und Kampagnen',
    ],
    benefits: [
      'Wiedererkennbarer Auftritt',
      'Planbarkeit statt Aktionismus',
      'Verbindung von Reichweite und Website',
    ],
    steps: ['Strategie', 'Brandbook', 'Redaktionsplan', 'Produktion', 'Betreuung'],
    audiences: ['Gastronomie & Hotels', 'Handwerk', 'Lokale Dienstleister', 'B2B-Mittelstand'],
    partnerNote:
      'Die laufende Social-Media-Betreuung wird projektbezogen mit einer spezialisierten Partnerin bzw. einem spezialisierten Partner umgesetzt.',
    sections: [
      {
        title: 'Brandbook als Grundlage',
        body: 'Ein kompaktes Brandbook legt Farben, Typografie, Bildsprache und Tonalität fest – damit jeder Beitrag erkennbar bleibt.',
      },
      {
        title: 'Realistische Frequenz',
        body: 'Lieber wenige, gute und konsistente Beiträge als täglicher Druck. Der Plan richtet sich nach deinen Ressourcen.',
      },
    ],
  },
  {
    key: 'ki',
    slug: 'ki-automatisierung',
    href: '/leistungen/ki-automatisierung/',
    order: 6,
    isCore: false,
    label: 'KI & Automatisierung',
    cardTitle: 'KI & Automatisierung',
    teaser:
      'Automatisiere Arbeit. Nicht die Beziehung zum Kunden. Sinnvolle Werkzeuge für wiederkehrende Abläufe – mit klaren Grenzen.',
    example:
      'Beispiel: Ein Website-Chatbot beantwortet häufige Fragen und bereitet Anfragen vor. Die eigentliche Beratung übernimmt ein Mensch.',
    detailH1: 'Automatisiere Arbeit. Nicht die Beziehung zum Kunden.',
    intro:
      'KI ist ein Werkzeug, keine Marke. Sinnvoll eingesetzt, nimmt sie Routinearbeit ab – ohne den persönlichen Kontakt zu ersetzen.',
    problem:
      'Wiederkehrende Anfragen, Terminkoordination und immer gleiche Fragen kosten Zeit. Gleichzeitig soll die Beziehung zum Kunden persönlich bleiben.',
    solution:
      'Wir setzen KI dort ein, wo sie klar hilft: Anfragen qualifizieren, Termine vorbereiten, FAQ automatisieren – mit menschlicher Übergabe und Datenschutz im Blick.',
    components: [
      'Website-Chatbots',
      'Voice Agents',
      'Anfragequalifizierung',
      'Terminvorbereitung',
      'FAQ-Automatisierung',
      'CRM-Übergabe',
      'Individuelle Integrationen',
    ],
    benefits: [
      'Weniger Routinearbeit',
      'Schnellere erste Antworten',
      'Saubere Übergabe an einen Menschen',
    ],
    steps: ['Einsatzfälle klären', 'Konzept', 'Integration', 'Test', 'Betreuung'],
    audiences: ['B2B-Mittelstand', 'Lokale Dienstleister', 'Praxen', 'Handwerk'],
    partnerNote:
      'Anspruchsvolle KI-Integrationen werden gemeinsam mit einem spezialisierten KI-Partner umgesetzt. Konzept und Einbindung in die Website bleiben bei KERNSEITE.',
    sections: [
      {
        title: 'Ein Voice Agent, einfach erklärt',
        body: 'Ein Voice Agent ist ein sprachgesteuerter Assistent, der z. B. Anrufe annehmen, häufige Fragen beantworten oder Termine vorbereiten kann. Er ersetzt keine Beratung, sondern entlastet bei Routine.',
      },
      {
        title: 'Datenschutz und menschliche Übergabe',
        body: 'Automatisierung endet dort, wo persönliche Beratung beginnt. Übergaben an Menschen sind fester Bestandteil, nicht die Ausnahme.',
      },
      {
        title: 'Klare Grenzen',
        body: 'Kein „vollautomatisches Unternehmen“, keine futuristischen Versprechen. Nur das, was messbar Arbeit abnimmt.',
      },
    ],
  },
];

export function getService(key: ServiceKey): Service {
  const s = services.find((service) => service.key === key);
  if (!s) throw new Error(`Unbekannte Leistung: ${key}`);
  return s;
}
