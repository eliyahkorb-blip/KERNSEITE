import { site } from './site';

/**
 * Preis-/Paketstruktur ist technisch vorbereitet, aber standardmäßig NICHT veröffentlicht.
 * Es werden keine unbestätigten Preise oder Laufzeiten erfunden.
 *
 * Zum Aktivieren: `site.showPricing` auf true setzen UND alle Felder vollständig füllen.
 */
export interface PricingPackage {
  readonly name: string;
  readonly oneTimePrice: string;
  readonly monthlyCare: string;
  readonly minimumTerm: string;
  readonly installmentModel: string;
  readonly includes: readonly string[];
  readonly additionalCosts: string;
  readonly vatNote: string;
}

/** Standard: keine Preise veröffentlicht. */
export const showPricing = site.showPricing;

/** Leer, bis geprüfte, vollständige Preise vorliegen. */
export const pricingPackages: readonly PricingPackage[] = [];
