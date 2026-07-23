/**
 * Zentrale Bestimmung des Build-Modus.
 *
 * - `dev`        : `astro dev` (oder NODE_ENV=development). Entwurfshinweise und
 *                  `[ERSETZEN]`-Platzhalter sind ausschliesslich hier sichtbar.
 * - `ci`         : `pnpm build:ci` – baut mit rein fiktiven Fixture-Daten. Nur fuer
 *                  Tests/QA/E2E. Output wird als "NICHT DEPLOYEN" markiert (noindex + Marker).
 * - `production` : `pnpm build:production` – verlangt vollstaendige echte Pflichtangaben;
 *                  bricht sonst mit klarer Meldung ab. Einziger deploybarer Build.
 *
 * Wir lesen bewusst `process.env` (im SSG-Build in Node verfuegbar), damit sich der
 * Modus konsistent in Konfigmodulen, Komponenten und Skripten verhaelt.
 */
export type BuildMode = 'dev' | 'ci' | 'production';

export function resolveBuildMode(): BuildMode {
  const raw = process.env.KERNSEITE_BUILD_MODE;
  if (raw === 'ci' || raw === 'production' || raw === 'dev') return raw;
  return process.env.NODE_ENV === 'development' ? 'dev' : 'production';
}

export const BUILD_MODE: BuildMode = resolveBuildMode();
export const IS_DEV = BUILD_MODE === 'dev';
export const IS_CI = BUILD_MODE === 'ci';
export const IS_PRODUCTION = BUILD_MODE === 'production';

/**
 * Entwurfs-/Prüfhinweise und Platzhalter dürfen NUR im Entwicklungsmodus erscheinen.
 * Weder der Produktions- noch der CI-Output zeigt sie an.
 */
export const SHOW_DRAFT_NOTICES = IS_DEV;
