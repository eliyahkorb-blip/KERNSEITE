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

| Prüfung            | Befehl                       | Ergebnis                                                          |
| ------------------ | ---------------------------- | ----------------------------------------------------------------- |
| Typen              | `pnpm typecheck`             | 0 Fehler, 0 Warnungen (58 Dateien)                                |
| Lint               | `pnpm lint`                  | keine Befunde                                                     |
| Fixture-Build      | `pnpm build:ci`              | 27 Seiten                                                         |
| Inline-Code        | `check-no-inline`            | keine ausführbaren Inline-Scripts/-Styles                         |
| Externe Ressourcen | `check-external`             | 0                                                                 |
| Interne Links      | `check-links`                | 1688 Links, keine defekten                                        |
| Statische A11y     | `check-a11y-static`          | bestanden (H1, Hierarchie, Alt, Namen, lang)                      |
| Secrets            | `check-secrets`              | keine Funde in 143 Dateien                                        |
| E2E                | `pnpm test:e2e`              | 42 bestanden, 1 übersprungen (Preview-Badge nur im Preview-Build) |
| Sichtprüfung       | `node scripts/visual-qa.mjs` | 12 Seiten × 5 Breiten: kein Überlauf, alle Bilder geladen         |

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

| Prüfung        | Befehl                | Ergebnis                                                                                     |
| -------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| Typen          | `pnpm typecheck`      | 0 Fehler, 0 Warnungen (59 Dateien)                                                           |
| Lint           | `pnpm lint`           | keine Befunde                                                                                |
| Fixture-Build  | `pnpm build:ci`       | 27 Seiten                                                                                    |
| Vorschau-Build | `pnpm build:preview`  | 27 Seiten                                                                                    |
| QA-Skripte     | `pnpm qa`             | alle fünf Prüfungen bestanden                                                                |
| E2E            | `pnpm test:e2e`       | 64 bestanden, 1 übersprungen                                                                 |
| Überschriften  | `pnpm check:headings` | 360 Seitenaufrufe: keine Überschneidung, kein Beschnitt, kein Überlauf, keine Silbentrennung |
| Sichtprüfung   | `pnpm visual-qa`      | 7 Seiten × 7 Breiten: kein Überlauf, alle Bilder geladen                                     |

### Überschriftenprüfung

`scripts/check-headings.mjs` misst im echten Browser die Kästen aller
Überschriften und meldet Überlappung, Beschnitt (`scrollWidth > clientWidth`),
Austritt aus dem Viewport, aktive Silbentrennung und horizontalen Überlauf.

Matrix: 10 Seiten × 9 Breiten (1920, 1680, 1440, 1280, 1024, 768, 430, 390, 360) × 4 Zoomstufen (100 %, 125 %, 150 %, 200 %) = 360 Seitenaufrufe.

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

---

## Überarbeitung: Leistungsseiten, Bilder, Standort (2026-07-27)

| Prüfung        | Befehl                | Ergebnis                                                        |
| -------------- | --------------------- | --------------------------------------------------------------- |
| Typen          | `pnpm typecheck`      | 0 Fehler (67 Dateien)                                           |
| Lint           | `pnpm lint`           | keine Befunde                                                   |
| Formatierung   | `pnpm format:check`   | alle Dateien konform                                            |
| Fixture-Build  | `pnpm build:ci`       | 32 Seiten                                                       |
| Vorschau-Build | `pnpm build:preview`  | 32 Seiten                                                       |
| QA-Skripte     | `pnpm qa`             | alle fünf Prüfungen bestanden                                   |
| E2E            | `pnpm test:e2e`       | 82 bestanden, 1 übersprungen                                    |
| Überschriften  | `pnpm check:headings` | 612 Seitenaufrufe (17 Seiten × 9 Breiten × 4 Zoomstufen) sauber |
| Sichtprüfung   | `pnpm visual-qa`      | 10 Seiten × 7 Breiten: kein Überlauf, alle Bilder geladen       |

`pnpm format:check` läuft erstmals durch: Das `<script>` in
`cookie-einstellungen.astro` stand in einem JSX-Ausdruck und war für Prettier
nicht parsbar. Es liegt jetzt auf oberster Ebene und prüft selbst, ob die
Schaltfläche existiert.

### Seitenlänge auf 390 px (vorher 9.000–12.000 px)

| Seite                                    | Höhe     |
| ---------------------------------------- | -------- |
| `/leistungen/websites/`                  | 6.106 px |
| `/leistungen/google-unternehmensprofil/` | 5.609 px |
| `/leistungen/unternehmensvideo/`         | 5.056 px |
| `/leistungen/social-media/`              | 4.962 px |
| `/leistungen/seo-geo/`                   | 4.944 px |
| `/leistungen/ki-automatisierung/`        | 4.665 px |

### Neue Tests

`tests/e2e/inhalt-bilder.spec.ts` prüft: kein „Regensburg“ im Build, keine
Vorschau- oder Entwurfshinweise, alle gelieferten Bilder werden verwendet,
AVIF und WebP mit `srcset`, keine fremden Bildquellen, feste Bildmaße,
unterschiedliche Abschnittsfolge je Leistungsseite, eigener Abschnittstyp je
Seite, Seitenlänge unter 8.000 px, keine `vh`-Höhen in Inhaltsabschnitten,
höchstens drei FAQ und vier Verweise je Seite, überschneidungsfreier
Würzburg-Abschnitt.

`tests/e2e/farben-formen.spec.ts` prüft zusätzlich: markierte Wörter sind
selbst `#00E3F2`, ohne Unterstreichung, Fläche, Verlauf, Schatten oder
Pseudo-Element – und stehen immer auf ausreichend dunklem Grund.

### Dabei gefundene und behobene Fehler

- `.section--dark a` überschrieb die Textfarbe des primären CTA: Auf dem neu
  dunklen Hero wurde der Neon-Button neon beschriftet und damit unlesbar.
  Behoben mit `:not(.btn)`.
- `.sscope__title` war in der schmalen Rasterspalte bei 1920 px breiter als
  ihr Container („übernehmen.“ ließ sich nicht umbrechen).
- Der Würzburg-Abschnitt dehnte die Textzeile bis auf Bildhöhe und riss eine
  leere Fläche auf (`align-content: start` fehlte).

### Offen

- Ein Branchenmotiv fehlt: Die gelieferte `zahnarztpraxen.jpg` ist
  byte-identisch mit `handwerk.jpg` und zeigt kein Praxisumfeld. Details in
  `docs/ASSET_TODO.md`.
- Fotografennamen und Photo-IDs der Branchenbilder sind nachzutragen.

## Runde: abschließende visuelle Qualitätsprüfung

Geprüft wurden 16 Seiten in vier Ansichten (1440×900, 1920×1080, 390×844,
430×932) anhand der zwölf vorgegebenen Kriterien. Es wurden ausschließlich
eindeutig sichtbare Fehler behoben – keine neuen Texte, keine neuen
Komponenten, keine Umgestaltung funktionierender Abschnitte.

### Nachweise

| Prüfung                                | Ergebnis                                                  |
| -------------------------------------- | --------------------------------------------------------- |
| `pnpm typecheck`                       | 0 Fehler, 0 Warnungen (67 Dateien)                        |
| `pnpm lint`                            | ohne Befund                                               |
| `pnpm format:check`                    | ohne Befund                                               |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                                              |
| `pnpm qa`                              | alle fünf Prüfungen bestanden, 1.693 interne Links        |
| `pnpm test:e2e`                        | 90 bestanden, 1 übersprungen                              |
| `pnpm check:headings`                  | 136 Seitenaufrufe über 8 Breiten ohne Befund              |
| `pnpm visual-qa`                       | 17 Seiten × 4 Breiten, kein Überlauf, alle Bilder geladen |

### Behobene Fehler

- `/leistungen/seo-geo/`: Zwischen „…zu verstehen.“ und „GEO“ fehlte das
  Leerzeichen – die beiden Sätze klebten im dunklen Band aneinander.
- `/leistungen/seo-geo/`, `/leistungen/ki-automatisierung/`,
  `/leistungen/unternehmensvideo/`: Die Ablauf- und Produktionsschritte
  trugen eine türkise Linie **unter** dem Wort. Das sah aus wie ein Link und
  verstieß gegen die Regel „keine türkisen Unterstreichungen“. Die Linie
  steht jetzt über dem Wort – wie bereits bei `.needs__item` und `.flow`.
- `/agentur/`: Zwischen „Verwurzelt in Würzburg.“ und dem zugehörigen Text
  klaffte eine leere Fläche von rund 300 px. Ursache war das über zwei
  Rasterzeilen gespannte Bild, das seine Höhe auf beide Zeilen verteilte.
  Überschrift und Text stehen jetzt in einer gemeinsamen Rasterzelle.
- `/leistungen/social-media/`: Unter der kurzen Überschrift „Was wir
  übernehmen.“ blieb die linke Spalte über rund 350 px leer, weil der
  einordnende Satz rechts unter der Liste stand. Der Satz steht jetzt unter
  der Überschrift – wie im gleichartigen Abschnitt auf `/leistungen/websites/`.
- Branchenraster (`/` und `/branchen/`): Der Eintrag ohne Bildmotiv
  (Zahnarztpraxen) begann am oberen Rand der Rasterzeile, während die
  Nachbarn erst unter ihrem Bild anfingen. Name, Argument und Pfeil sprangen
  dadurch aus der Reihe. Einträge ohne Motiv richten sich jetzt an der
  Unterkante aus und stehen mit den übrigen auf einer Linie – weiterhin ohne
  graue Fläche, ohne Rahmen und ohne Ersatzmotiv.

### Neue Tests

`tests/e2e/feinschliff.spec.ts` sichert die Korrekturen ab: keine türkise
Linie unter Textzeilen auf allen 16 Seiten, Linie über den Ablaufschritten,
Leerzeichen zwischen „SEO“ und „GEO“, gemeinsame Grundlinie im
Branchenraster (Name und Pfeil, Toleranz 4 px), Eintrag ohne Motiv ohne
Rahmen und Fläche, sowie Höchstabstand zwischen kurzer Überschrift und
zugehörigem Text auf `/agentur/` und `/leistungen/social-media/`.

### Geprüft, aber bewusst nicht geändert

- Der Screenshot im Google-Abschnitt der Startseite ist auf Desktop
  `position: sticky`. Im Ganzseiten-Screenshot wirkt die Spalte darunter leer,
  beim Scrollen bleibt das Bild jedoch stehen. Kein Fehler.
- Die großen Aussagenbänder (`Eine schwache Website kostet mehr…`,
  `Profil und Website müssen dasselbe sagen…`) lassen rechts Fläche frei.
  Das ist die gewollte redaktionelle Setzung, keine Lücke.
- Cyanfarbene Unterstreichungen an Links auf dunklem Grund bleiben: Sie sind
  Bedienhilfe, nicht Dekoration.

### Offen

- Das Motiv für `b2b-mittelstand` zeigt eine Bauzimmerei (Zuschnitt von
  Bauholz, Helm und Warnweste). Es liest sich als Handwerk und Baustelle,
  nicht als mittelständisches Produktionsunternehmen – und liegt damit
  visuell zu nah am Motiv für „Handwerk“. Ein passenderes Motiv steht in
  `docs/ASSET_TODO.md`. Das gelieferte Bild wurde nicht eigenmächtig
  entfernt.
- Ein Branchenmotiv fehlt weiterhin: Die gelieferte `zahnarztpraxen.jpg` ist
  byte-identisch mit `handwerk.jpg`.
- Fotografennamen und Photo-IDs der Branchenbilder sind nachzutragen.
