import { hasConfirmedHostingLocation } from '../lib/config-validation';

/**
 * Globale Seiten-Konfiguration und Feature-Flags.
 */
export const site = {
  /** Produktions-Domain (auch in astro.config.mjs verwendet). */
  url: process.env.SITE_URL || 'https://kernseite.de',
  name: 'KERNSEITE',
  lang: 'de',
  locale: 'de_DE',

  /** Regionale Ausrichtung (SEO/GEO). */
  region: {
    city: 'Würzburg',
    area: 'Unterfranken',
    state: 'Bayern',
    country: 'Deutschland',
  },

  /** Kurzbeschreibung (Default-Meta, Organization-Schema). */
  shortDescription:
    'KERNSEITE entwickelt individuelle Unternehmenswebsites für lokale Unternehmen und den Mittelstand – auf Wunsch verbunden mit Google-Sichtbarkeit, Unternehmensvideo, Social Media und Automatisierung.',

  /** Marken-Claims. */
  claim: 'Der digitale Kern deines Unternehmens.',
  heroClaim: 'Dein Unternehmen ist besser als sein Internetauftritt.',

  // --- Feature-Flags --------------------------------------------------------
  /** Preise sind standardmäßig unveröffentlicht (siehe pricing.ts). */
  showPricing: false,
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
