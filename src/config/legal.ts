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

  /** EU-Streitschlichtung – Formulierung fachlich prüfen. */
  disputeResolution:
    'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: ' +
    'https://ec.europa.eu/consumers/odr/. Zur Teilnahme an einem Streitbeilegungsverfahren vor ' +
    'einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und grundsätzlich nicht bereit.',

  /** Kurzhinweis, der auf allen Rechtsseiten (Dev) erscheint. */
  reviewReminderTitle: 'Prüfpflichtiger Entwurf',
} as const;
