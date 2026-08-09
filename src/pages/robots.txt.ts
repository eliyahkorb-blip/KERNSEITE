import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { IS_NOINDEX_BUILD } from '../lib/build-mode';

const base = site.url.replace(/\/$/, '');

// Im CI-/Fixture- und Vorschau-Build alles sperren (Output ist nicht produktiv).
const body = IS_NOINDEX_BUILD
  ? `# Nicht-produktiver Build (CI/Vorschau) – nicht indexieren\nUser-agent: *\nDisallow: /\n`
  : `User-agent: *
Allow: /

# Konfigurationsseite nicht indexieren
Disallow: /cookie-einstellungen/

Sitemap: ${base}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
