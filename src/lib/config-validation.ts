import {
  company as companyReal,
  REQUIRED_LEGAL_FIELDS,
  PLACEHOLDER,
  PLACEHOLDER_OPTIONAL,
  type Company,
} from '../config/company';
import { companyFixture } from '../config/company.fixture';
import { release, RELEASE_GATE_LABELS, type ReleaseGate } from '../config/release';
import { BUILD_MODE, IS_CI, IS_PRODUCTION } from './build-mode';

/** True, wenn ein Wert leer oder ein `[ERSETZEN]`-Platzhalter ist. */
export function isPlaceholder(value: string | undefined | null): boolean {
  if (value == null) return true;
  const v = value.trim();
  return v === '' || v === PLACEHOLDER || v === PLACEHOLDER_OPTIONAL || /\[ERSETZEN/i.test(v);
}

/** Liste der noch fehlenden rechtlichen Pflichtfelder einer Company. */
export function getMissingLegalFields(c: Company): string[] {
  return REQUIRED_LEGAL_FIELDS.filter((field) => isPlaceholder(c[field]));
}

/**
 * Aktive Firmendaten je nach Build-Modus:
 * - CI  -> Fixture (vollständig, fiktiv)
 * - sonst (dev/production) -> echte Daten (ggf. mit Platzhaltern im Dev)
 */
export const activeCompany: Company = IS_CI ? companyFixture : companyReal;

/** Fehlende Pflichtfelder der AKTIVEN Company. */
export const missingLegalFields: string[] = getMissingLegalFields(activeCompany);

/** True, wenn alle rechtlichen Pflichtangaben echte Werte tragen. */
export const hasCompleteLegalData: boolean = missingLegalFields.length === 0;

/** True, wenn ein bestätigter Serverstandort vorliegt (Grundlage Hosting-Hinweis). */
export const hasConfirmedHostingLocation: boolean = !isPlaceholder(activeCompany.hostingLocation);

/** Noch nicht erteilte Freigaben aus `src/config/release.ts`. */
export const openReleaseGates: string[] = (Object.keys(release) as (keyof ReleaseGate)[]).filter(
  (key) => !release[key],
);

/** True, wenn alle internen Freigabeschalter gesetzt sind. */
export const hasReleaseApproval: boolean = openReleaseGates.length === 0;

/**
 * PRODUKTIONS-SCHUTZ.
 *
 * Bricht `pnpm build:production` mit klarer Meldung ab, solange rechtliche
 * Pflichtangaben fehlen ODER eine der internen Freigaben aussteht. Dev-, CI-
 * und Vorschau-Build sind davon nicht betroffen.
 *
 * Der zweite Teil ist bewusst getrennt: Vollständige Feldwerte allein machen
 * einen Auftritt nicht rechtlich fertig. Ohne ausdrückliche fachliche Freigabe
 * entsteht kein deploybarer Build – auch dann nicht, wenn technisch alles grün
 * ist. Die Schalter erscheinen nirgends auf der Website.
 */
if (IS_PRODUCTION && (!hasCompleteLegalData || !hasReleaseApproval)) {
  const lines = [
    '',
    '══════════════════════════════════════════════════════════════════════',
    ' PRODUKTIONS-BUILD ABGEBROCHEN',
    '══════════════════════════════════════════════════════════════════════',
    '',
  ];

  if (!hasCompleteLegalData) {
    lines.push(
      ' Fehlende Pflichtangaben in src/config/company.ts:',
      ...missingLegalFields.map((f) => `   - ${f}`),
      '',
    );
  }

  if (!hasReleaseApproval) {
    lines.push(
      ' Ausstehende Freigaben in src/config/release.ts:',
      ...openReleaseGates.map((k) => `   - ${k}: ${RELEASE_GATE_LABELS[k as keyof ReleaseGate]}`),
      '',
    );
  }

  lines.push(
    ' Nächste Schritte: docs/LEGAL_TODO.md, docs/LEGAL_REVIEW_2026-08.md und',
    ' docs/PRODUCTION_TODO.md. Die Freigaben werden erst nach echter fachlicher',
    ' Klärung von Hand gesetzt – nicht, um den Build durchzubekommen.',
    '',
    ' Für Tests/QA ohne echte Daten `pnpm build:ci` verwenden, für die',
    ' visuelle Abnahme `pnpm build:preview` (beide nicht deploybar).',
    '══════════════════════════════════════════════════════════════════════',
    '',
  );

  throw new Error(lines.join('\n'));
}

export { BUILD_MODE };
