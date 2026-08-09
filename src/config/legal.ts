/**
 * Textbausteine für rechtliche Seiten.
 *
 * WICHTIG: Dies sind technisch vorbereitete ENTWÜRFE. Sie müssen vor Veröffentlichung
 * fachlich (z. B. anwaltlich) geprüft und mit echten Unternehmensdaten vervollständigt
 * werden. Die Website wird nicht als automatisch „rechtssicher“ bezeichnet.
 *
 * Der Entwurfshinweis (draftNotice) wird ausschließlich im Entwicklungsmodus angezeigt
 * (siehe src/lib/build-mode.ts → SHOW_DRAFT_NOTICES). Im Produktions- und CI-Build ist er
 * nicht sichtbar; fehlende Pflichtangaben verhindern dort bereits den Build.
 */
export const legal = {
  draftNotice:
    'Entwurf – nur im Entwicklungsmodus sichtbar. Dieser Rechtstext ist ein technisch ' +
    'vorbereiteter Entwurf und muss vor Veröffentlichung fachlich geprüft und mit echten ' +
    'Unternehmensdaten vervollständigt werden.',

  /**
   * Verbraucherschlichtung. Der frühere Verweis auf die OS-Plattform der
   * Europäischen Kommission ist entfallen: Die Plattform wurde eingestellt,
   * ein Link darauf wäre irreführend.
   */
  disputeResolution:
    'Zur Teilnahme an einem Streitbeilegungsverfahren vor einer ' +
    'Verbraucherschlichtungsstelle sind wir nicht verpflichtet und ' +
    'grundsätzlich nicht bereit.',

  /**
   * Journalistisch-redaktionelles Angebot i. S. d. § 18 Abs. 2 MStV?
   *
   * Die zusätzliche Angabe eines inhaltlich Verantwortlichen knüpft an
   * journalistisch-redaktionell gestaltete Angebote an – nicht an jede
   * Unternehmenswebsite. KERNSEITE betreibt derzeit weder Blog noch
   * Nachrichtenportal noch ein Magazin mit regelmäßigen redaktionellen
   * Veröffentlichungen; die Seiten beschreiben ausschließlich das eigene
   * Leistungsangebot.
   *
   * Der Block wird deshalb nicht als Pflichtangabe dargestellt. Kommt später
   * ein redaktioneller Bereich hinzu, wird dieser Schalter auf `true` gesetzt
   * und die Angabe erscheint wieder. Einordnung: docs/LEGAL_REVIEW_2026-08.md.
   */
  hasJournalisticContent: false,

  /** Kurzhinweis, der auf allen Rechtsseiten (Dev) erscheint. */
  reviewReminderTitle: 'Prüfpflichtiger Entwurf',
} as const;
