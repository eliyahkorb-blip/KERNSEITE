/**
 * Zentrale Bestimmung des Build-Modus.
 *
 * - `dev`        : `astro dev` (oder NODE_ENV=development). Entwurfshinweise und
 *                  `[ERSETZEN]`-Platzhalter sind ausschliesslich hier sichtbar.
 * - `ci`         : `pnpm build:ci` – baut mit rein fiktiven Fixture-Daten. Nur fuer
 *                  Tests/QA/E2E. Output wird als "NICHT DEPLOYEN" markiert (noindex + Marker).
 * - `preview`    : `pnpm build:preview` – baut mit ECHTEN Daten fuer die visuelle Pruefung.
 *                  noindex + sichtbarer "Vorschau"-Hinweis, Formular deaktiviert (kein
 *                  echter Mailversand). Bricht NICHT wegen optionaler Medien ab. Nicht fuer
 *                  produktives Hosting (Marker verhindert Upload).
 * - `production` : `pnpm build:production` – verlangt vollstaendige echte Pflichtangaben;
 *                  bricht sonst mit klarer Meldung ab. Einziger fuer das echte Hosting
 *                  vorgesehene Build.
 *
 * Wir lesen bewusst `process.env` (im SSG-Build in Node verfuegbar), damit sich der
 * Modus konsistent in Konfigmodulen, Komponenten und Skripten verhaelt.
 */
export type BuildMode = 'dev' | 'ci' | 'preview' | 'production';

export function resolveBuildMode(): BuildMode {
  const raw = process.env.KERNSEITE_BUILD_MODE;
  if (raw === 'ci' || raw === 'production' || raw === 'dev' || raw === 'preview') return raw;
  return process.env.NODE_ENV === 'development' ? 'dev' : 'production';
}

export const BUILD_MODE: BuildMode = resolveBuildMode();
export const IS_DEV = BUILD_MODE === 'dev';
export const IS_CI = BUILD_MODE === 'ci';
export const IS_PREVIEW = BUILD_MODE === 'preview';
export const IS_PRODUCTION = BUILD_MODE === 'production';

/** Builds, die nicht öffentlich indexiert werden dürfen (CI + Vorschau). */
export const IS_NOINDEX_BUILD = IS_CI || IS_PREVIEW;

/**
 * Entwurfs-/Prüfhinweise und Platzhalter dürfen NUR im Entwicklungsmodus erscheinen.
 * Weder der Produktions-, CI- noch Vorschau-Output zeigt sie an.
 */
export const SHOW_DRAFT_NOTICES = IS_DEV;
