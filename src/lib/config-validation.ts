import {
  company as companyReal,
  REQUIRED_LEGAL_FIELDS,
  PLACEHOLDER,
  PLACEHOLDER_OPTIONAL,
  type Company,
} from '../config/company';
import { companyFixture } from '../config/company.fixture';
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

/**
 * PRODUKTIONS-SCHUTZ (Korrektur 6):
 * Bricht `pnpm build:production` mit klarer Meldung ab, solange rechtliche
 * Pflichtangaben fehlen. Dev- und CI-Build sind davon nicht betroffen.
 */
if (IS_PRODUCTION && !hasCompleteLegalData) {
  const list = missingLegalFields.map((f) => `  - ${f}`).join('\n');
  throw new Error(
    [
      '',
      '══════════════════════════════════════════════════════════════════════',
      ' PRODUKTIONS-BUILD ABGEBROCHEN – fehlende rechtliche Pflichtangaben',
      '══════════════════════════════════════════════════════════════════════',
      '',
      ' Folgende Felder in src/config/company.ts sind noch Platzhalter:',
      list,
      '',
      ' Trage die echten Werte ein (siehe docs/LEGAL_TODO.md), bevor ein',
      ' produktiver, deploybarer Build erstellt wird.',
      '',
      ' Für Tests/QA ohne echte Daten stattdessen `pnpm build:ci` verwenden',
      ' (nicht deploybar, klar als Fixture markiert).',
      '══════════════════════════════════════════════════════════════════════',
      '',
    ].join('\n'),
  );
}

export { BUILD_MODE };
