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

---

## Relaunch-Runde: CRT-Motiv, Nummern, Metadaten (2026-07-26)

### Automatisierte Prüfungen

| Prüfung | Befehl | Ergebnis |
| ------- | ------ | -------- |
| Typen | `pnpm typecheck` | 0 Fehler, 0 Warnungen (58 Dateien) |
| Lint | `pnpm lint` | keine Befunde |
| Fixture-Build | `pnpm build:ci` | 27 Seiten |
| Inline-Code | `check-no-inline` | keine ausführbaren Inline-Scripts/-Styles |
| Externe Ressourcen | `check-external` | 0 |
| Interne Links | `check-links` | 1688 Links, keine defekten |
| Statische A11y | `check-a11y-static` | bestanden (H1, Hierarchie, Alt, Namen, lang) |
| Secrets | `check-secrets` | keine Funde in 143 Dateien |
| E2E | `pnpm test:e2e` | 42 bestanden, 1 übersprungen (Preview-Badge nur im Preview-Build) |
| Sichtprüfung | `node scripts/visual-qa.mjs` | 12 Seiten × 5 Breiten: kein Überlauf, alle Bilder geladen |

### Suchlauf über entfernte Muster

`chapter-num`, `rows__num`, `igrid__num`, `tl__num`, `plist__num`, `gbp__point-num`,
`scope__num`, `steps__n`, `focus__num`, `rel__num`, `wf__meta`, `wf__cat`,
`label--meta`, `beat__n`, `chain__n`, `padStart(2, '0')`, `font-mono`, `fs-label`,
`track-label`, `text-transform: uppercase` → **keine Treffer** in `src/` und `scripts/`.
Der Build wird zusätzlich durch `tests/e2e/visual-relaunch.spec.ts` dagegen abgesichert.

### Sichtprüfung 1920 / 1440 / 768 / 430 / 390 px

Geprüft: `/`, `/arbeiten/`, `/arbeiten/kaya-doener-himmelstadt/`, `/leistungen/`,
`/branchen/`, `/branchen/gastronomie-hotels/`, `/branchen/lokale-dienstleister/`,
`/agentur/`, `/prozess/`, `/kontakt/`, `/leistungen/seo-geo/`, `/agb/`.

Kein horizontaler Überlauf, kein Bild ohne Inhalt, keine leere graue Fläche.
Für die Aufnahme wird `has-reveal` abgeschaltet, damit der Endzustand geprüft wird;
dass die Reveal-Abschnitte beim echten Scrollen sichtbar werden, prüft ein eigener
E2E-Test.

### Bekannt und offen

- Unsplash ist aus dieser Umgebung nicht erreichbar (Egress-Proxy, HTTP 403 beim
  CONNECT). Vier Methoden geprüft, Details in `docs/IMAGE_PLAN.md`. Branchenbilder für
  Handwerk, Zahnarztpraxen und B2B-Mittelstand fehlen deshalb weiterhin; diese Flächen
  tragen reine Typografie statt eines Platzhalters.
- `pnpm format:check` scheitert an `src/pages/cookie-einstellungen.astro`: Prettier kann
  das `<script>` innerhalb des JSX-Ausdrucks nicht parsen. Bestand vor dieser Runde,
  betrifft nur die Formatierung, nicht den Build.

---

## Korrekturrunde: Farbe, Formen, Branchenraster, Überschriften (2026-07-26)

### Automatisierte Prüfungen

| Prüfung | Befehl | Ergebnis |
| ------- | ------ | -------- |
| Typen | `pnpm typecheck` | 0 Fehler, 0 Warnungen (59 Dateien) |
| Lint | `pnpm lint` | keine Befunde |
| Fixture-Build | `pnpm build:ci` | 27 Seiten |
| Vorschau-Build | `pnpm build:preview` | 27 Seiten |
| QA-Skripte | `pnpm qa` | alle fünf Prüfungen bestanden |
| E2E | `pnpm test:e2e` | 64 bestanden, 1 übersprungen |
| Überschriften | `pnpm check:headings` | 360 Seitenaufrufe: keine Überschneidung, kein Beschnitt, kein Überlauf, keine Silbentrennung |
| Sichtprüfung | `pnpm visual-qa` | 7 Seiten × 7 Breiten: kein Überlauf, alle Bilder geladen |

### Überschriftenprüfung

`scripts/check-headings.mjs` misst im echten Browser die Kästen aller
Überschriften und meldet Überlappung, Beschnitt (`scrollWidth > clientWidth`),
Austritt aus dem Viewport, aktive Silbentrennung und horizontalen Überlauf.

Matrix: 10 Seiten × 9 Breiten (1920, 1680, 1440, 1280, 1024, 768, 430, 390,
360) × 4 Zoomstufen (100 %, 125 %, 150 %, 200 %) = 360 Seitenaufrufe.

Dabei gefundene und behobene Fehler:

- Footer-Wortmarke mit `line-height: 0.82` und `letter-spacing: -0.06em` –
  Ober- und Unterlängen stießen aneinander, Buchstaben wurden beschnitten.
- `ServiceRows`: `display: contents` ohne ausdrückliche Spaltenzuweisung
  schob den Pfeil in die Textspalte; die Leistungsnamen liefen aus dem Raster.
- `/agentur/`: Zweispaltigkeit ab 48rem war für die Überschrift zu eng.
- Begrenzungen in `ch` (`max-width: 18ch`) waren auf schmalen Spalten breiter
  als der Container – jetzt durchgängig `min(NNch, 100%)`.
- `.accent-word` mit `white-space: nowrap` sprengte bei starkem Zoom die
  Zeile; die Ausnahmeregel stand vor der Basisregel und griff deshalb nicht.
- Formularfelder, Footer-Navigation, Header, lange Domains und die
  E-Mail-Adresse im CTA-Band liefen bei starkem Zoom über.

### Bekannt und offen

- Die fünf Branchenmotive fehlen. Unsplash ist aus dieser Umgebung nicht
  erreichbar (neun Versuche, sechs Hosts, vier Werkzeuge – alle HTTP 403 vom
  Egress-Proxy). Belege in `docs/ASSET_TODO.md`. Das Raster ist so gebaut,
  dass die Bilder ohne weitere Änderung eingesetzt werden können.
- `pnpm format:check` scheitert weiterhin an
  `src/pages/cookie-einstellungen.astro` (Prettier kann das `<script>` im
  JSX-Ausdruck nicht parsen). Bestand vor dieser Runde.
