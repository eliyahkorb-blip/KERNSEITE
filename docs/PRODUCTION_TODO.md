# Production-Blocker

Was vor dem Live-Gang erledigt sein muss. Jeder Punkt mit **BLOCKER** verhindert
den Produktions-Build technisch (`src/lib/config-validation.ts`).

## BLOCKER 1 – Datenschutz-Infrastruktur

`src/config/company.ts`: `hostingProvider`, `hostingLocation`, `mailProvider`,
`formRetentionPeriod` sind Platzhalter. Solange das so ist, lässt sich weder
ein Serverstandort benennen noch eine Speicherdauer angeben.

Benötigt: Hostingprodukt, tatsächlicher Rechenzentrumsstandort,
Vertragspartner laut Rechnung, AV-Vertrag, Mailanbieter und -standort,
Aufbewahrungsfrist. Einzelheiten: `docs/LEGAL_TODO.md`,
`docs/LEGAL_REVIEW_2026-08.md` Abschnitt 2.1.

Danach: `release.privacyInfrastructureConfirmed = true`.

## BLOCKER 2 – Endgültige Canonical-Domain

Aktuell steht `https://www.kernseite.de` in `SITE_URL`. **Nicht bestätigt.**

Es darf nicht zwei Canonical-Basen geben. Zu entscheiden ist eine Variante:

- `https://kernseite.de` (ohne www) **oder**
- `https://www.kernseite.de` (mit www)

Nach der Entscheidung auf genau diese Variante setzen:

- `SITE_URL` (Umgebungsvariable) und der Vorgabewert in `astro.config.mjs`
- `src/config/site.ts` → `site.url`
- `.env.example`
- Canonicals, OG-URLs, Sitemap, `robots.txt`, JSON-LD (folgen automatisch aus
  `site.url`)

Auf dem Hosting zusätzlich:

- 301 von der Nicht-Canonical-Variante auf die Canonical-Variante
- HTTPS erzwingen
- keine Weiterleitungsschleife (erst Host, dann Protokoll – nicht doppelt)

Danach: `release.canonicalDomainConfirmed = true`.

## BLOCKER 3 – Rechtliche Freigabe

Impressum, Datenschutzerklärung und AGB sind fachlich zu prüfen. Offene
Einzelfragen (B2B/B2C, Abnahmeklausel, VSBG, MStV, TDDDG, BFSG) stehen in
`docs/LEGAL_REVIEW_2026-08.md` Abschnitt 3.

Danach: `release.legalReviewApproved = true`.

## Kein Blocker, aber vor dem Launch zu erledigen

- Formular: SMTP-Zugang serverseitig einrichten, `.env` oberhalb des Webroots.
  Erst danach ist das Formular produktiv.
- `docs/SEARCH_LAUNCH_CHECKLIST.md` abarbeiten.
- HSTS erst aktivieren, wenn HTTPS auf der endgültigen Domain dauerhaft steht.
- Bildnachweise vervollständigen (`docs/ASSET_LICENSES.md`): Unsplash-Seiten-
  adressen und die fehlenden Fotografennamen.
- B2B-Motiv austauschen (`docs/ASSET_TODO.md` Abschnitt 2).

## Prüfen, ob der Schutz greift

```
pnpm build:production   # muss mit Meldung abbrechen, Exit-Code 1
pnpm build:ci           # läuft, Fixture-Daten, nicht deploybar
pnpm build:preview      # läuft, echte Daten, noindex, kein Mailversand
```

Der zugehörige Test steht in `tests/e2e/produktionsreife.spec.ts`
(„Ohne Freigabe entsteht kein Produktions-Build“).
