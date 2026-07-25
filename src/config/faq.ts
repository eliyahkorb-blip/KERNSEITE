export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  /** Auf der Startseite anzeigen (Auszug). */
  readonly onHome?: boolean;
  /** Zu welchen Leistungen passt die Frage (service keys)? */
  readonly services?: readonly string[];
}

/**
 * FAQ – ehrliche, konkrete Antworten ohne Rechts- oder Erfolgsgarantien.
 * Wird für die FAQ-Seite und (Auszug) für die Startseite genutzt.
 * Die FAQPage-strukturierten Daten werden nur aus tatsächlich sichtbaren Fragen erzeugt.
 */
export const faqs: readonly FaqItem[] = [
  {
    question: 'Was kostet eine individuelle Website?',
    services: ['websites'],
    answer:
      'Das hängt vom Umfang ab: Seitenanzahl, Funktionen, Inhalte und gewünschte Erweiterungen. Nach einem kurzen Gespräch bekommst du ein transparentes, schriftliches Angebot – ohne versteckte Posten. Feste Preise veröffentlichen wir bewusst erst, wenn sie zu deinem Projekt passen.',
    onHome: true,
  },
  {
    question: 'Wie lange dauert ein Website-Projekt?',
    services: ['websites'],
    answer:
      'Ein typisches Projekt dauert je nach Umfang und Zuarbeit einige Wochen. Entscheidend ist, wie schnell Inhalte, Bilder und Freigaben vorliegen. Den realistischen Zeitrahmen legen wir gemeinsam zu Beginn fest.',
    onHome: true,
  },
  {
    question: 'Arbeitet KERNSEITE mit Templates?',
    services: ['websites'],
    answer:
      'Nein. Struktur, Design und Technik werden für dein Unternehmen entwickelt. Wir nutzen bewährte technische Grundlagen, aber kein fertiges Baukasten-Theme.',
    onHome: true,
  },
  {
    question: 'Kann meine bestehende Website übernommen werden?',
    services: ['websites'],
    answer:
      'Inhalte wie Texte und Bilder lassen sich oft übernehmen und aufbereiten. Ob die bestehende technische Basis sinnvoll weitergeführt wird, prüfen wir im Einzelfall – manchmal ist ein sauberer Neuaufbau der bessere Weg.',
  },
  {
    question: 'Wer erstellt Texte, Bilder und Videos?',
    services: ['websites', 'video', 'social'],
    answer:
      'Wir unterstützen bei Struktur und Formulierung der Texte und planen Bildmotive mit. Fachliche Inhalte kommen von dir. Für Video arbeiten wir mit einem spezialisierten Partner. Was jeweils von wem kommt, halten wir zu Projektbeginn klar fest.',
    onHome: true,
  },
  {
    question: 'Kann ich Inhalte später ändern lassen?',
    services: ['websites'],
    answer:
      'Ja. Änderungen und Weiterentwicklungen sind Teil der laufenden Betreuung. Je nach Wunsch übernehmen wir Anpassungen oder richten Wege ein, über die du selbst Inhalte pflegen kannst.',
  },
  {
    question: 'Übernehmt ihr Hosting und Wartung?',
    services: ['websites'],
    answer:
      'Ja. Auf Wunsch übernehmen wir Hosting, Updates, Sicherung und laufende Betreuung, damit die Website dauerhaft schnell und sicher bleibt.',
    onHome: true,
  },
  {
    question: 'Ist die Website für Smartphones optimiert?',
    services: ['websites', 'seo-geo'],
    answer:
      'Ja. Das mobile Layout wird eigenständig gestaltet, nicht nur verkleinert. Die meisten Besucher kommen über das Smartphone – entsprechend wichtig ist die mobile Nutzerführung.',
  },
  {
    question: 'Was bedeutet SEO und GEO?',
    services: ['seo-geo', 'google'],
    answer:
      'SEO steht für Suchmaschinenoptimierung: technisch saubere, gut auffindbare Seiten. GEO meint die Optimierung für KI-Antwortsysteme, die klare Fakten über dein Unternehmen erkennen und korrekt wiedergeben können. Beides gehört zur Grundlage jeder KERNSEITE.',
  },
  {
    question: 'Kann ein Google-Unternehmensprofil optimiert werden?',
    services: ['google', 'seo-geo'],
    answer:
      'Ja. Wir richten das Profil sauber ein oder optimieren es: Kategorien, Leistungen, Bilder und Bewertungsprozess. Ranking-Garantien gibt es dabei bewusst nicht – lokale Sichtbarkeit entsteht durch konsistente, gepflegte Daten.',
  },
  {
    question: 'Wie funktionieren Chatbot und Voice Agent?',
    services: ['ki'],
    answer:
      'Ein Chatbot beantwortet auf der Website häufige Fragen und bereitet Anfragen vor. Ein Voice Agent ist ein sprachgesteuerter Assistent, der z. B. Routineanfragen entgegennimmt. Beide entlasten bei wiederkehrenden Abläufen und übergeben bei Bedarf an einen Menschen.',
  },
  {
    question: 'Mit wem schließe ich den Vertrag?',
    services: ['video', 'social', 'ki'],
    answer:
      'Dein Vertragspartner ist KERNSEITE – Eliyah Korb. Eliyah ist dein zentraler Ansprechpartner und steuert das Projekt, auch wenn einzelne Leistungen über Partner umgesetzt werden.',
  },
  {
    question: 'Arbeitet KERNSEITE mit Subunternehmern?',
    services: ['video', 'social', 'ki'],
    answer:
      'Für Film, Social Media und KI arbeiten wir projektbezogen mit spezialisierten selbstständigen Partnern zusammen. Die Kommunikation bleibt zentral bei KERNSEITE, während jede Aufgabe von der passenden Fachperson umgesetzt wird.',
  },
  {
    question: 'Sind Datenschutz und Barrierefreiheit enthalten?',
    services: ['websites', 'seo-geo'],
    answer:
      'Datenschutzfreundliche Planung und Barrierearmut nach modernen Standards gehören zur Grundumsetzung. Rechtstexte werden als geprüfte Entwürfe vorbereitet und vor Veröffentlichung fachlich final geprüft. Eine automatische „Rechtssicherheit“ sagen wir bewusst nicht zu.',
  },
];

export const homeFaqs = faqs.filter((f) => f.onHome);
