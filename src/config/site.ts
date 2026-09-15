import { hasConfirmedHostingLocation } from '../lib/config-validation';

/**
 * Globale Seiten-Konfiguration und Feature-Flags.
 */
export const site = {
  /** Produktions-Domain (Canonical = www-Variante; auch in astro.config.mjs verwendet). */
  url: process.env.SITE_URL || 'https://www.kernseite.com',
  name: 'KERNSEITE',
  lang: 'de',
  locale: 'de_DE',

  /**
   * Regionale Ausrichtung (SEO/GEO).
   *
   * WICHTIG – Standortwahrheit: Der Geschäftssitz liegt in Erlabrunn bei
   * Würzburg (siehe `company.ts`). Würzburg ist bedientes Marktgebiet, nicht
   * Sitz. Sichtbare Texte sagen deshalb „Raum Würzburg“ / „bei Würzburg“ und
   * niemals „sitzt in Würzburg“. Die Anschrift wird ausschließlich aus
   * `company.ts` gerendert – hier stehen keine Adressbestandteile.
   */
  region: {
    /** Bedientes Marktgebiet (nicht der Sitz). */
    city: 'Würzburg',
    area: 'Unterfranken',
    state: 'Bayern',
    country: 'Deutschland',
    /** Einheitliche Standortaussage für sichtbare Texte. */
    claim: 'Raum Würzburg. Projekte bundesweit.',
    sentence:
      'KERNSEITE arbeitet aus dem Raum Würzburg und betreut Unternehmen in Würzburg, Unterfranken und bundesweit.',
    /** Kurzform für Fließtext und Meta-Angaben. */
    origin: 'aus dem Raum Würzburg',
  },

  /**
   * Kurzbeschreibung für das Organization-Schema. Darf länger sein als eine
   * Meta-Description, weil sie nicht in Suchergebnissen abgeschnitten wird.
   */
  shortDescription:
    'KERNSEITE ist die Webdesign-Agentur von Eliyah Korb aus Erlabrunn bei Würzburg. Individuelle Unternehmenswebsites, Suchmaschinenoptimierung und persönliche Betreuung für Unternehmen in ganz Deutschland.',

  /** Meta-Description der Startseite (auf Anzeigelänge gekürzt). */
  metaDescription:
    'Individuelle Websites für Unternehmen. Persönlich mit Eliyah Korb, meist 1.500–3.600 € netto. Aus Erlabrunn bei Würzburg, bundesweit. Projekte ansehen.',

  /** Marken-Claims. */
  claim: 'Websites, die professionell wirken. Und genau deshalb funktionieren.',
  heroClaim: 'Dein Unternehmen kann mehr. Deine Website sollte es zeigen.',

  // --- Feature-Flags --------------------------------------------------------
  /**
   * Hosting-Hinweis nur anzeigen, wenn die Produktionsumgebung tatsächlich auf
   * einen deutschen Standort eingestellt UND dokumentiert wurde. Manueller Schalter
   * zusätzlich zur technischen Prüfung (hasConfirmedHostingLocation).
   */
  showHostingClaim: false,
  /**
   * Cookie-/Consent-Banner nur, wenn zustimmungspflichtige Dienste eingebunden werden.
   * Standard: aus (nur technisch notwendige Funktionen, keine externen Dienste).
   */
  consentRequired: false,

  /** Exakt erlaubte Hosting-Formulierung (nur bei bestätigtem DE-Standort). */
  hostingClaimText: 'Diese Website wird auf Servern in Deutschland gehostet.',

  /**
   * Optionaler externer Terminbuchungs-Link (Kontaktseite). Wird NICHT automatisch
   * eingebettet, sondern nur nach aktivem Klick geöffnet (Datenschutz). Leer = aus.
   */
  bookingUrl: '',
} as const;

/** Darf der Hosting-Hinweis angezeigt werden? (Flag UND bestätigter Standort) */
export const canShowHostingClaim: boolean = site.showHostingClaim && hasConfirmedHostingLocation;
