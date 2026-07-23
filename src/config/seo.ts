import { site } from './site';

/** SEO-Grundeinstellungen. Pro Seite werden Title/Description überschrieben. */
export const seo = {
  /** Title-Template: `%s` wird durch den Seitentitel ersetzt. */
  titleTemplate: '%s · KERNSEITE',
  /** Fallback-Title (Startseite bzw. wenn kein Seitentitel gesetzt ist). */
  defaultTitle: 'KERNSEITE · Individuelle Unternehmenswebsites aus Würzburg',
  defaultDescription: site.shortDescription,
  /** Lokal gehostetes Open-Graph-Bild (siehe public/assets). */
  defaultOgImage: '/assets/og/kernseite-og.svg',
  ogImageType: 'image/svg+xml',
  twitterCard: 'summary_large_image' as const,
};

export interface SeoInput {
  title?: string;
  description?: string;
  /** Pfad ab Root, z. B. `/leistungen/`. */
  path: string;
  ogImage?: string;
  /** Seite aus dem Suchindex nehmen. */
  noindex?: boolean;
  ogType?: 'website' | 'article';
}

export function buildTitle(title?: string): string {
  if (!title) return seo.defaultTitle;
  return seo.titleTemplate.replace('%s', title);
}

export function canonicalFor(path: string): string {
  const base = site.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
