/**
 * Freigabe-Schalter für den Produktions-Build (INTERN).
 *
 * Diese Datei ist ein reiner Deployment-Schutz. Ihre Werte werden **niemals**
 * auf einer Seite gerendert, weder sichtbar noch in Metadaten oder
 * strukturierten Daten. Sie steuern ausschließlich, ob
 * `pnpm build:production` überhaupt einen deploybaren Build erzeugen darf.
 *
 * Hintergrund: Bis zu dieser Runde reichte es aus, dass Entwurfshinweise im
 * Produktions-Build ausgeblendet werden. Damit sah ein Build „fertig“ aus,
 * obwohl tragende Angaben (Hosting, Mailversand, Aufbewahrung, endgültige
 * Domain) noch nicht bestätigt waren. Ein ausgeblendeter Hinweis ist keine
 * Klärung – deshalb blockieren diese Schalter den Build, statt nur den Text
 * zu verstecken.
 *
 * Jeder Schalter darf erst nach echter fachlicher Klärung von Hand auf `true`
 * gesetzt werden. Wer ihn setzt, bestätigt damit den jeweils genannten
 * Sachverhalt – nicht das Bestehen einer Prüfung durch dieses Repository.
 */

export interface ReleaseGate {
  /**
   * Rechtliche Freigabe erteilt: Impressum, Datenschutzerklärung und AGB
   * wurden fachlich geprüft und für den Live-Gang freigegeben.
   * Offene Punkte: docs/LEGAL_REVIEW_2026-08.md
   */
  readonly legalReviewApproved: boolean;
  /**
   * Endgültige Produktionsdomain ist bestätigt (genau eine Canonical-Variante,
   * mit oder ohne `www`). Erst danach dürfen SITE_URL, Canonicals, Sitemap,
   * OG-URLs und JSON-LD festgeschrieben werden.
   */
  readonly canonicalDomainConfirmed: boolean;
  /**
   * Datenschutz-Infrastruktur bestätigt: Hostingvertragspartner,
   * Rechenzentrumsstandort, Mailanbieter und Aufbewahrungsdauer liegen als
   * belegte Angaben vor (nicht geraten, nicht aus Werbeseiten abgeleitet).
   */
  readonly privacyInfrastructureConfirmed: boolean;
}

export const release: ReleaseGate = {
  legalReviewApproved: false,
  canonicalDomainConfirmed: false,
  privacyInfrastructureConfirmed: false,
};

/** Klartext je Schalter für die Abbruchmeldung des Produktions-Builds. */
export const RELEASE_GATE_LABELS: Record<keyof ReleaseGate, string> = {
  legalReviewApproved:
    'Rechtliche Freigabe für Impressum, Datenschutz und AGB (docs/LEGAL_REVIEW_2026-08.md)',
  canonicalDomainConfirmed:
    'Endgültige Produktionsdomain bestätigt (genau eine Canonical-Variante)',
  privacyInfrastructureConfirmed:
    'Hostingvertragspartner, Serverstandort, Mailanbieter und Aufbewahrungsdauer belegt',
};
