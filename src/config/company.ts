/**
 * Zentrale Firmen-/Pflichtangaben (Single Source of Truth).
 *
 * REGELN:
 * - Keine Daten erfinden. Noch nicht bestätigte Pflichtangaben bleiben als
 *   `PLACEHOLDER` markiert und sind in docs/LEGAL_TODO.md gelistet.
 * - Der Produktions-Build (`pnpm build:production`) bricht ab, solange die
 *   für Impressum/Datenschutz/Kontakt erforderlichen Felder Platzhalter sind
 *   (siehe src/lib/config-validation.ts).
 * - `[ERSETZEN]`-Werte werden niemals produktiv gerendert.
 */

export const PLACEHOLDER = '[ERSETZEN]';
export const PLACEHOLDER_OPTIONAL = '[ERSETZEN ODER ENTFERNEN]';

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export interface Company {
  /** Sichtbare Marke im Marketing. */
  readonly brandName: string;
  /** Rechtlich saubere Form für Impressum/Footer/geschäftliche Bereiche. */
  readonly legalDisplayName: string;
  /** Name der natürlichen Person, die KERNSEITE betreibt (Anbieter i. S. d. § 5 DDG). */
  readonly legalName: string;
  /**
   * Rechtsform – NICHT erfinden. Solange die Firmierung nicht final geklärt ist, leer
   * lassen; dann wird keine Rechtsform behauptet. Zentral hier änderbar.
   */
  readonly legalForm: string;
  /**
   * Statushinweis: KERNSEITE wird bis zur endgültigen Klärung als Marke bzw.
   * geschäftliche Bezeichnung dargestellt.
   */
  readonly legalStatusNote: string;
  readonly street: string;
  readonly postalCode: string;
  readonly city: string;
  readonly country: string;
  readonly email: string;
  readonly phone: string;
  /** Umsatzsteuer-Identifikationsnummer – optional, ggf. entfernen. */
  readonly vatId: string;
  /** Inhaltlich Verantwortlicher (§ 18 Abs. 2 MStV). */
  readonly responsibleContent: string;
  /** Nur nennen, wenn tatsächlich erforderlich. */
  readonly supervisoryAuthority: string;
  /** Hostinganbieter – wird NICHT öffentlich angezeigt, bleibt Platzhalter. */
  readonly hostingProvider: string;
  /** Serverstandort (z. B. "Deutschland"), Grundlage für den Hosting-Hinweis. */
  readonly hostingLocation: string;
  /** Mailversand-Anbieter für die Datenschutz-Doku. */
  readonly mailProvider: string;
  /** Aufbewahrungsdauer der Formularanfragen (Klartext für Datenschutzerklärung). */
  readonly formRetentionPeriod: string;
  readonly socialLinks: readonly SocialLink[];
}

/**
 * ECHTE Firmendaten. Noch offene Pflichtangaben = PLACEHOLDER.
 * Bitte ausschließlich hier pflegen (nicht in Komponenten).
 */
export const company: Company = {
  brandName: 'KERNSEITE',
  legalDisplayName: 'KERNSEITE – Eliyah Korb',
  legalName: 'Eliyah Korb',
  // Rechtsform noch nicht final geklärt -> bewusst leer (keine erfundene Rechtsform).
  legalForm: '',
  legalStatusNote:
    'KERNSEITE ist eine Marke bzw. geschäftliche Bezeichnung. Anbieter im Sinne des § 5 DDG ist Eliyah Korb.',
  // Vorläufige, für die Vorschau bestätigte Angaben:
  street: 'Würzburger Straße 14',
  postalCode: '97250',
  city: 'Erlabrunn',
  country: 'Deutschland',
  email: 'info@kernseite.de',
  phone: '+49 160 92647414',
  // USt-IdNr. nicht erfunden -> leer (Impressum blendet den Abschnitt dann aus).
  vatId: '',
  responsibleContent: 'Eliyah Korb',
  supervisoryAuthority: '',
  hostingProvider: PLACEHOLDER,
  hostingLocation: PLACEHOLDER,
  mailProvider: PLACEHOLDER,
  formRetentionPeriod: PLACEHOLDER,
  socialLinks: [],
};

/**
 * Felder, die für einen produktiven Live-Gang zwingend echte Werte brauchen
 * (Impressum + Datenschutz + Kontakt). Basis der Build-Validierung.
 */
export const REQUIRED_LEGAL_FIELDS = [
  'street',
  'postalCode',
  'city',
  'email',
  'phone',
] as const satisfies readonly (keyof Company)[];
