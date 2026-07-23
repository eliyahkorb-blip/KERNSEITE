# Testbericht

Stand: dieser Bericht dokumentiert die im Repository automatisierten Prüfungen und ihre
Ergebnisse. Alle Prüfungen laufen lokal und in GitHub Actions (`.github/workflows/ci.yml`).

## Befehle

```bash
pnpm typecheck        # astro check (TypeScript)
pnpm lint             # ESLint
pnpm build:ci         # Fixture-Build (+ CSP-Hashes)
pnpm qa               # Links, externe Requests, Inline-Scripts, A11y (statisch), Secrets
pnpm test:e2e         # Playwright End-to-End
pnpm build:production # echter Build (bricht bei fehlenden Pflichtdaten ab)
```

## Ergebnisse (lokaler Lauf)

| Prüfung                               | Ergebnis                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `astro check` (Typecheck)             | ✓ 0 Fehler, 0 Warnungen (nur Hinweise zu Inline-JSON-LD)                          |
| ESLint                                | ✓ 0 Fehler                                                                        |
| `build:ci`                            | ✓ 26 Seiten gebaut, CSP-Hashes eingesetzt                                         |
| `check-no-inline`                     | ✓ keine ausführbaren Inline-Scripts/-Styles                                       |
| `check-external`                      | ✓ keine externen Ressourcen (0 Requests)                                          |
| `check-links`                         | ✓ 1403 interne Links, keine defekten                                              |
| `check-a11y-static`                   | ✓ H1/Hierarchie/Alt/Namen/lang OK                                                 |
| `check-secrets`                       | ✓ keine Secrets in getrackten Dateien                                             |
| Playwright E2E                        | ✓ 15 Tests bestanden                                                              |
| PHP `php -l`                          | ✓ alle Dateien fehlerfrei                                                         |
| PHP-Endpunkt (Funktionstest)          | ✓ GET→405, Honeypot→200, kein SMTP→500, ungültige Mail→422, Direktzugriff src→403 |
| `build:production` (mit Platzhaltern) | ✓ bricht bewusst mit klarer Meldung ab (Exit 1)                                   |

## E2E-Abdeckung (Playwright)

- Navigation: Desktop-Links, Mobilmenü (öffnen/Escape/Fokusrückgabe), Fokusfalle
- Hero-Animation: Klick-/Tastatur-Aktivierung der Module, `prefers-reduced-motion`
- FAQ-Accordion: öffnen/schließen
- Kontaktformular: Validierungsfehler, ungültige E-Mail, Honeypot außerhalb Viewport
- Seiten/SEO: 404-Status, robots/sitemap erreichbar, genau eine H1, kein horizontaler
  Überlauf bei 390/768/1280/1600 px, Skip-Link

## Verifizierte Sonderfälle

- **Keine Platzhalter/Entwurfshinweise im Produktions-/CI-Output** (`grep` auf `dist/`
  bestätigt: kein `[ERSETZEN]`, kein „prüfpflichtiger Entwurf“).
- **CSP passt zum realen Build** (script/style-src `'self'`, JSON-LD via sha256-Hash).
- **Fixture-Build ist nicht deploybar** (`.ci-fixture`/`CI_FIXTURE_DO_NOT_DEPLOY.txt`,
  `robots.txt` = Disallow all, `guard-no-fixture.mjs`).

## Nicht automatisiert (manuell/extern zu prüfen)

- Reale Lighthouse-Werte (Ziel ≥ 95) auf dem Produktionsserver mit echten Assets.
- Echter SMTP-Versand (benötigt produktive `.env`).
- Kontrast-/Screenreader-Detailprüfung mit echten Assets.
