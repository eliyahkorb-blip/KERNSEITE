export interface Industry {
  readonly slug: string;
  readonly href: string;
  readonly label: string;
  readonly title: string;
  /**
   * Titel für Suchergebnisse. Die sichtbare Überschrift bleibt markenstark;
   * hier steht, wonach tatsächlich gesucht wird. Eine Branche = eine
   * Suchintention, keine Aufzählung von Schreibvarianten.
   */
  readonly seoTitle: string;
  /** Beschreibung für Suchergebnisse, 140–160 Zeichen, in ganzen Sätzen. */
  readonly metaDescription: string;
  /** Beschriftung des Abschluss-CTA – benennt das Vorhaben, nicht die Aktion. */
  readonly ctaLabel: string;
  /** Kurzes Nutzenargument für die typografische Branchenliste. */
  readonly argument: string;
  readonly detailH1: string;
  readonly intro: string;
  /** Eigenständige Schwerpunkte (kein Textklon zwischen Branchen). */
  readonly focus: readonly { readonly title: string; readonly body: string }[];
  /** Passende Leistungen (service keys). */
  readonly relatedServices: readonly string[];
}

export const industries: readonly Industry[] = [
  {
    slug: 'handwerk',
    href: '/branchen/handwerk/',
    label: 'Handwerk',
    title: 'Handwerk',
    seoTitle: 'Webdesign für Handwerker',
    metaDescription:
      'Website für Handwerksbetriebe: Leistungen verständlich zeigen, regional gefunden werden und Anfragen wie Bewerbungen einfach machen.',
    ctaLabel: 'Website fürs Handwerk besprechen',
    argument: 'Zeig Qualität, gewinne Aufträge und Bewerber – mit klaren Kontaktwegen.',
    detailH1: 'Websites für Handwerksbetriebe. Leistungen zeigen, Anfragen erleichtern.',
    intro:
      'Ein etablierter Betrieb verdient einen Auftritt, der die tatsächliche Qualität zeigt – und der neben Kunden auch Bewerber überzeugt.',
    focus: [
      {
        title: 'Leistungen verständlich darstellen',
        body: 'Eigene Seiten für deine wichtigsten Leistungen zeigen Material, Vorgehen und passende Projektbeispiele. Ob Reparatur, Ausbau oder Maßanfertigung: Interessenten erkennen, mit welchem Anliegen sie bei dir richtig sind.',
      },
      {
        title: 'Passende Anfragen erhalten',
        body: 'Dein Einsatzgebiet, die Art des Vorhabens und der gewünschte Termin helfen bei der Einordnung. Ein kurzes Anfrageformular kann diese Angaben direkt abfragen.',
      },
      {
        title: 'Referenzen und Baustellen',
        body: 'Abgeschlossene Projekte und Baustellen zeigen greifbar, was der Betrieb kann – mit echten Bildern statt Stockfotos.',
      },
      {
        title: 'Bewerber gewinnen',
        body: 'Eine ehrliche Karriere-Sektion mit Einblicken ins Team spricht Fachkräfte an, die zu modernen Betrieben wollen.',
      },
      {
        title: 'Schnelle Kontaktwege',
        body: 'Anruf, Rückrufwunsch oder kurzes Formular – der schnellste Weg zur Anfrage steht im Vordergrund.',
      },
    ],
    relatedServices: ['websites', 'google', 'video'],
  },
  {
    slug: 'zahnarztpraxen',
    href: '/branchen/zahnarztpraxen/',
    label: 'Zahnarztpraxen',
    title: 'Zahnarztpraxen & medizinische Praxen',
    seoTitle: 'Webdesign für Zahnarztpraxen',
    metaDescription:
      'Praxis-Website, die Vertrauen schafft: ruhige Nutzerführung, klar erklärte Leistungen und einfache Terminwege – ohne Heilversprechen.',
    ctaLabel: 'Praxis-Website besprechen',
    argument: 'Vertrauen, ruhige Nutzerführung und klare Terminwege – ohne Heilversprechen.',
    detailH1: 'Praxis-Websites, die Vertrauen schaffen und Termine erleichtern.',
    intro:
      'Patientinnen und Patienten entscheiden sich für Menschen, denen sie vertrauen. Eine ruhige, klare Website unterstützt genau das.',
    focus: [
      {
        title: 'Vertrauen und ruhige Nutzerführung',
        body: 'Klare Struktur, angenehme Bildsprache und verständliche Sprache – nichts Reißerisches, nichts Überladenes.',
      },
      {
        title: 'Leistungen und Behandlungsschwerpunkte',
        body: 'Eigene Leistungsseiten erklären Behandlungsabläufe und organisatorische Fragen. Medizinische Inhalte und berufsrechtliche Pflichtangaben werden von der Praxis geliefert und fachlich freigegeben.',
      },
      {
        title: 'Team',
        body: 'Ein sympathisches, echtes Team-Kapitel senkt die Hemmschwelle für den ersten Termin.',
      },
      {
        title: 'Terminwege',
        body: 'Klare Wege zum Termin: Telefon, Formular oder – nur nach Klick – ein externer Terminlink.',
      },
      {
        title: 'Lokale Sichtbarkeit',
        body: 'Ein konsistentes Google-Profil hilft, wenn Menschen in der Nähe eine Praxis suchen.',
      },
    ],
    relatedServices: ['websites', 'google', 'ki'],
  },
  {
    slug: 'gastronomie-hotels',
    href: '/branchen/gastronomie-hotels/',
    label: 'Gastronomie & Hotels',
    title: 'Gastronomie & Hotels',
    seoTitle: 'Webdesign für Gastronomie & Hotels',
    metaDescription:
      'Restaurant- und Hotel-Website: Atmosphäre zeigen, Speisekarte aktuell halten, Reservierung und Buchung erleichtern, Google-Profil verbinden.',
    ctaLabel: 'Website-Projekt besprechen',
    argument: 'Atmosphäre spürbar machen und Reservierungen bzw. Buchungen erleichtern.',
    detailH1: 'Websites für Gastronomie und Hotels, die Lust auf einen Besuch machen.',
    intro:
      'Bei Gastgebern zählt die Atmosphäre. Bilder, Video und klare Wege zur Reservierung oder Buchung machen den Unterschied.',
    focus: [
      {
        title: 'Atmosphäre',
        body: 'Die Stimmung des Hauses wird visuell erlebbar – mit hochwertiger Bild- und Videosprache statt Standardfotos.',
      },
      {
        title: 'Für Restaurants: Speisekarte und Öffnungszeiten',
        body: 'Eine mobil lesbare Speisekarte führt direkt zum Angebot. Öffnungszeiten, Standort, Anruf und Reservierungsweg sind schnell erreichbar. Das Projekt Kaya zeigt eine solche Umsetzung.',
      },
      {
        title: 'Für Hotels: Zimmer und Buchungsweg',
        body: 'Zimmerkategorien, Ausstattung, Anreise und Fragen zum Aufenthalt werden getrennt aufbereitet. Ein vorhandenes Buchungssystem kann nach technischer und datenschutzrechtlicher Prüfung angebunden werden; dessen Kosten sind separat zu berücksichtigen.',
      },
      {
        title: 'Google-Profil',
        body: 'Öffnungszeiten, Bilder und Bewertungen werden konsistent gepflegt, damit spontane Gäste dich finden.',
      },
      {
        title: 'Lokale und touristische Suche',
        body: 'Inhalte werden so strukturiert, dass sowohl Menschen aus der Region als auch Reisende dich finden.',
      },
    ],
    relatedServices: ['websites', 'video', 'google'],
  },
  {
    slug: 'lokale-dienstleister',
    href: '/branchen/lokale-dienstleister/',
    label: 'Lokale Dienstleister',
    title: 'Lokale Dienstleister',
    seoTitle: 'Webdesign für lokale Dienstleister',
    metaDescription:
      'Website für lokale Dienstleister: Leistungen klar benennen, im Einzugsgebiet gefunden werden und die Kontaktaufnahme kurz halten.',
    ctaLabel: 'Website-Projekt besprechen',
    argument: 'Klare Leistungen, regionale Auffindbarkeit und einfache Kontaktaufnahme.',
    detailH1: 'Websites für Dienstleister. Verständlich, persönlich, erreichbar.',
    intro:
      'Ob Beratung, Pflege oder Service: Wer lokal Dienstleistungen anbietet, braucht Klarheit, Vertrauen und einen einfachen Weg zur Anfrage.',
    focus: [
      {
        title: 'Klare Leistungen',
        body: 'Für jedes Angebot werden Zielgruppe, Ablauf und der nächste Schritt verständlich beschrieben. Bei einer Kindertagespflege sind das andere Fragen als bei einer Gebäudereinigung oder Beratung.',
      },
      {
        title: 'Regionale Auffindbarkeit',
        body: 'Region und Leistungsgebiet werden eindeutig kommuniziert und für die lokale Suche aufbereitet.',
      },
      {
        title: 'Bewertungen',
        body: 'Ein einfacher Prozess für Bewertungen stärkt das Vertrauen neuer Interessenten.',
      },
      {
        title: 'Kontakt und Termin',
        body: 'Kurze Wege zur Anfrage: Formular, Telefon oder – nur nach Klick – ein externer Terminlink.',
      },
      {
        title: 'Vertrauen',
        body: 'Echte Einblicke und eine ehrliche Darstellung schaffen die Grundlage für die erste Anfrage.',
      },
    ],
    relatedServices: ['websites', 'google', 'ki'],
  },
  {
    slug: 'b2b-mittelstand',
    href: '/branchen/b2b-mittelstand/',
    label: 'B2B-Mittelstand',
    title: 'B2B-Mittelstand',
    seoTitle: 'B2B-Webdesign für den Mittelstand',
    metaDescription:
      'B2B-Website für mittelständische Unternehmen: erklärungsbedürftige Leistungen verständlich darstellen und qualifizierte Anfragen erzeugen.',
    ctaLabel: 'B2B-Website besprechen',
    argument: 'Komplexe Leistungen verständlich machen und qualifizierte Anfragen erzeugen.',
    detailH1: 'Websites für den B2B-Mittelstand, die komplexe Leistungen verständlich machen.',
    intro:
      'Im B2B entscheiden oft mehrere Personen. Eine gute Website macht komplexe Leistungen verständlich und liefert die richtigen Informationen.',
    focus: [
      {
        title: 'Komplexe Leistungen verständlich machen',
        body: 'Technische oder erklärungsbedürftige Angebote werden strukturiert und nachvollziehbar aufbereitet.',
      },
      {
        title: 'Ansprechpartner',
        body: 'Klare Ansprechpartner und Zuständigkeiten senken die Hürde für die erste Kontaktaufnahme.',
      },
      {
        title: 'Cases',
        body: 'Projektbeispiele erläutern die Aufgabe, die eingesetzte Lösung und den jeweiligen Leistungsumfang. Technische Datenblätter oder weiterführende Unterlagen können passend verlinkt werden.',
      },
      {
        title: 'Recruiting',
        body: 'Fachkräfte informieren sich online. Eine überzeugende Karriere-Sektion unterstützt die Personalgewinnung.',
      },
      {
        title: 'Lead-Qualifizierung',
        body: 'Ein Anfrageformular kann Produktbereich, benötigte Leistung und Zeitrahmen abfragen. So erhält der zuständige Ansprechpartner die Informationen, die er für ein erstes Gespräch braucht.',
      },
    ],
    relatedServices: ['websites', 'ki', 'video'],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
