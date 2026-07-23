// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Produktions-Domain zentral über Env konfigurierbar. Muss vor Live-Gang bestätigt
// werden (siehe docs/LEGAL_TODO.md). Wird für Canonicals, Sitemap und OG-URLs genutzt.
const SITE_URL = process.env.SITE_URL || 'https://kernseite.de';
const BUILD_MODE =
  process.env.KERNSEITE_BUILD_MODE ||
  (process.env.NODE_ENV === 'development' ? 'dev' : 'production');

/**
 * Schreibt beim CI-/Fixture-Build eindeutige "Nicht deployen"-Marker in den Output.
 * Der Deploy-Guard (scripts/guard-no-fixture.mjs) verweigert daraufhin den Upload.
 */
function ciFixtureMarkers() {
  return {
    name: 'kernseite:ci-fixture-markers',
    hooks: {
      'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
        if (BUILD_MODE !== 'ci') return;
        const outDir = fileURLToPath(dir);
        const note =
          'CI-/FIXTURE-BUILD – NICHT DEPLOYEN.\n\n' +
          'Dieser Build wurde mit `pnpm build:ci` und rein fiktiven Fixture-Daten\n' +
          '(src/config/company.fixture.ts) erzeugt. Er dient ausschliesslich Tests,\n' +
          'Linkpruefung, QA-Skripten und E2E-Pruefungen.\n\n' +
          'Fuer ein produktives Deployment ausschliesslich `pnpm build:production`\n' +
          'mit vollstaendigen echten Pflichtangaben verwenden.\n';
        await fs.writeFile(path.join(outDir, 'CI_FIXTURE_DO_NOT_DEPLOY.txt'), note, 'utf8');
        await fs.writeFile(
          path.join(outDir, '.ci-fixture'),
          new Date().toISOString() + '\n',
          'utf8',
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Korrektur 9: ausfuehrbare Styles extern & selbst gehostet ausliefern (keine Inline-Styles),
    // damit die CSP ohne 'unsafe-inline' funktioniert.
    inlineStylesheets: 'never',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      // Rechts-/Konfigurationsseiten aus dem Index halten.
      filter: (page) => !page.includes('/cookie-einstellungen') && !page.includes('/404'),
    }),
    ciFixtureMarkers(),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      // Keine Inline-Assets/-Scripts – ausführbare Skripte extern ausliefern (CSP-freundlich).
      assetsInlineLimit: 0,
    },
  },
});
