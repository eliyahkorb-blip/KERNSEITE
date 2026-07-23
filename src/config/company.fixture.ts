import type { Company } from './company';

/**
 * FIXTURE-DATEN – rein fiktiv, offensichtlich als Muster erkennbar.
 *
 * Wird AUSSCHLIESSLICH im CI-Build (`pnpm build:ci`) verwendet, damit Tests,
 * Linkprüfung, QA-Skripte und E2E gegen einen vollständigen, gültigen Build laufen
 * können, OHNE echte Firmendaten zu erfinden.
 *
 * Diese Daten dürfen NIEMALS produktiv deployt werden. Der CI-Output wird dafür
 * mit `.ci-fixture` / `CI_FIXTURE_DO_NOT_DEPLOY.txt` markiert und auf `noindex` gesetzt;
 * der Deploy-Guard (scripts/guard-no-fixture.mjs) verweigert den Upload.
 */
export const companyFixture: Company = {
  brandName: 'KERNSEITE',
  legalDisplayName: 'KERNSEITE – Eliyah Korb (FIXTURE)',
  legalName: 'Eliyah Korb',
  legalForm: '',
  legalStatusNote:
    'KERNSEITE ist eine Marke bzw. geschäftliche Bezeichnung. Anbieter im Sinne des § 5 DDG ist Eliyah Korb. (FIXTURE)',
  street: 'Musterstraße 1',
  postalCode: '97070',
  city: 'Musterstadt',
  country: 'Deutschland',
  email: 'fixture@example.invalid',
  phone: '+49 000 0000000',
  vatId: 'DE000000000',
  responsibleContent: 'Eliyah Korb',
  supervisoryAuthority: '',
  hostingProvider: 'Fixture-Hosting (nicht öffentlich)',
  hostingLocation: 'Deutschland',
  mailProvider: 'Fixture-Mailprovider',
  formRetentionPeriod: '90 Tage',
  socialLinks: [],
};
