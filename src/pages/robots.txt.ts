import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { IS_CI } from '../lib/build-mode';

const base = site.url.replace(/\/$/, '');

// Im CI-/Fixture-Build alles sperren (Output ist ohnehin nicht deploybar).
const body = IS_CI
  ? `# CI-/Fixture-Build – nicht deployen\nUser-agent: *\nDisallow: /\n`
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
