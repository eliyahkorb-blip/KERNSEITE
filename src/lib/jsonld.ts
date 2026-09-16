import { activeCompany, hasCompleteLegalData } from './config-validation';
import { site } from '../config/site';
import type { Service } from '../config/services';
import type { FaqItem } from '../config/faq';
import { canonicalFor } from '../config/seo';

/**
 * Strukturierte Daten (JSON-LD).
 *
 * REGEL (Korrektur 8): Organization/LocalBusiness/ProfessionalService/Service werden
 * NUR erzeugt, wenn die dafür nötigen Echtdaten vollständig vorhanden sind. Andernfalls
 * geben die Helfer `null` zurück – niemals Platzhalter in strukturierte Daten schreiben.
 * BreadcrumbList und FAQPage (ohne PII) sind davon unabhängig.
 */

type Json = Record<string, unknown>;

/**
 * Tatsächlich betreutes Gebiet.
 *
 * Der Sitz steht in `address` (Erlabrunn) und wird davon nicht berührt:
 * `areaServed` beschreibt, wo gearbeitet wird, nicht wo das Büro steht.
 * Deutschland gehört dazu, weil Projekte bundesweit umgesetzt werden – das
 * deckt sich mit der sichtbaren Aussage „Persönlich im Raum Würzburg. Digital
 * bundesweit.“
 */
const AREA_SERVED = [
  site.region.city,
  site.region.area,
  site.region.state,
  site.region.country,
].filter(Boolean);

/** ProfessionalService/LocalBusiness der Marke – nur bei vollständigen Daten. */
export function organizationJsonLd(): Json | null {
  if (!hasCompleteLegalData) return null;
  const c = activeCompany;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url.replace(/\/$/, '')}/#organization`,
    name: c.legalDisplayName,
    alternateName: c.brandName,
    url: site.url,
    email: c.email,
    telephone: c.phone,
    description: site.shortDescription,
    areaServed: AREA_SERVED,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.street,
      postalCode: c.postalCode,
      addressLocality: c.city,
      addressCountry: 'DE',
    },
    founder: { '@type': 'Person', name: c.legalName },
    ...(c.socialLinks.length ? { sameAs: c.socialLinks.map((s) => s.href) } : {}),
  };
}

/** WebSite-Objekt (unkritisch, ohne PII). */
export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'de-DE',
  };
}

/** Einzelne Leistung – nur bei vollständigen Firmendaten (Provider-Bezug). */
export function serviceJsonLd(service: Service): Json | null {
  if (!hasCompleteLegalData) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.cardTitle,
    serviceType: service.label,
    description: service.teaser,
    provider: {
      '@type': 'ProfessionalService',
      name: activeCompany.legalDisplayName,
      url: site.url,
    },
    areaServed: AREA_SERVED,
    url: canonicalFor(service.href),
  };
}

export interface BreadcrumbEntry {
  readonly name: string;
  readonly path: string;
}

/** BreadcrumbList – immer erlaubt (keine PII). */
export function breadcrumbJsonLd(entries: readonly BreadcrumbEntry[]): Json | null {
  if (entries.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.name,
      item: canonicalFor(e.path),
    })),
  };
}

/** FAQPage – nur aus tatsächlich sichtbaren Fragen (keine PII). */
export function faqPageJsonLd(items: readonly FaqItem[]): Json | null {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
