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

## Runde: Liquid Glass auf Schaltflächen

Der Referenzcode (React, Tailwind, shadcn, Radix, CVA, SVG-Filter je Button)
wurde nicht übernommen. Umgesetzt ist ein eigenes CSS-System in
`src/styles/liquid-glass.css`, eingebunden in `BaseLayout.astro` direkt nach
`global.css`. Keine neue Abhängigkeit, kein Framework, kein Client-Skript.

### Nachweise

| Prüfung                                | Ergebnis                                     |
| -------------------------------------- | -------------------------------------------- |
| `pnpm install --frozen-lockfile`       | unverändert, keine neue Abhängigkeit         |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen                        |
| `pnpm lint`                            | ohne Befund                                  |
| `pnpm format:check`                    | ohne Befund                                  |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                                 |
| `pnpm qa`                              | alle fünf Prüfungen, 268 Dateien ohne Secret |
| `pnpm test:e2e`                        | 116 bestanden, 1 übersprungen                |
| `pnpm check:headings`                  | 136 Seitenaufrufe ohne Befund                |
| `pnpm visual-qa`                       | 17 Seiten × 4 Breiten ohne Befund            |

### Neue Tests

`tests/e2e/liquid-glass.spec.ts`, 26 Prüfungen: Body-Schrift auf allen `.btn`,
Radius höchstens 8px, keine Pillenform im CSS, Mindesthöhe 44px, Farbrollen und
Kontrast je Untergrund (hell, dunkel, Cyan-Fläche), nur ein Türkiston in Hex-
und rgb-Schreibweise, Pseudo-Ebenen mit `pointer-events: none` und negativer
Ebene, sichtbarer Fokusring, kein abgeschnittener Text bei 1440/390/360px, kein
waagerechter Überlauf, unveränderte Geometrie beim Hover, abgeschaltete
Spiegelung bei reduzierter Bewegung, genau ein Animationsdurchlauf,
deaktivierte Buttons ohne Hoverreaktion, kein Glas auf Hamburger, Textlinks,
FAQ-Toggles, Navigation, Footer, Karten oder Abschnitten, keine React-,
Tailwind-, shadcn-, Radix- oder CVA-Abhängigkeit, kein `.tsx`, kein doppelter
SVG-Filter, kein `feTurbulence`/`feDisplacementMap`, korrekte Ladereihenfolge
des Stylesheets, keine Inline-Eventhandler, deckender Rückfall über `@supports`.

### Während der Sichtprüfung korrigiert

- Erster Entwurf: Der Verlauf auf dem Primärbutton war zu stark – die Fläche
  wirkte wie Gel, der Button auf der Cyan-Fläche wie ein grauer Metallverlauf,
  der Sekundärbutton auf Dunkel wie graues Plastik. Ursache war, dass sich der
  Verlauf auf dem Element und der Verlauf auf `::before` addierten. Die
  Lichtführung läuft jetzt allein über vier Variablen auf `::before`; jeder
  Kontext überschreibt nur diese Werte.
- Deaktivierte Buttons übernahmen die invertierte Hoverfläche, weil Chrome
  `:hover` auf `disabled`-Elementen weiterhin greifen lässt. Ergänzte Regeln
  nehmen die Farbumkehr für `:disabled` und `[aria-disabled="true"]` zurück.

### Geprüfte Schaltflächen

Header-CTA, CTA im mobilen Menü, beide Hero-CTAs, Abschluss-CTA auf der
Cyan-Fläche, Seiten-CTAs der Leistungsseiten, Formularbutton „Anfrage senden“
(aktiv und deaktiviert), Buttons auf der 404-Seite. Consent-Banner und
Cookie-Einstellungen wurden mit vorübergehend gesetztem `consentRequired: true`
gebaut und geprüft; die Einstellung steht wieder auf `false`.

## Runde: gerichtete Reflexion auf den großen Schaltflächen

Vorlage war eine React-/Tailwind-/shadcn-Komponente mit WebGL-Shader
(`@paper-design/shaders`), Pillenform und Metallverlauf. Übernommen wurde
davon nur die **Wirkung**, nicht der Code: keine neue Abhängigkeit, keine
React-Komponente, kein `components/ui`, kein Shader, keine Inline-Styles, keine
Pillenform. Die Umsetzung liegt weiterhin allein in
`src/styles/liquid-glass.css`.

### Was dazugekommen ist

Hero-CTAs und Abschluss-CTA tragen eine gerichtete Bänderung als zweite
Hintergrundebene auf `::before` sowie eine härtere Lichtkante. Header-CTA,
Formularbutton, mobiler Menü-CTA, 404-, Consent- und Cookie-Buttons behalten
die ruhige Oberfläche.

### Während der Sichtprüfung korrigiert

Erster Entwurf: Auf dunklem Grund lief eine breite helle Bahn quer über die
Fläche. Der Sekundärbutton im Hero sah dadurch bei 390px aus wie ein grauer
Metallbalken – genau der ausgeschlossene Eindruck. Für dunkle Kontexte ist die
helle Bahn jetzt auf `.05` reduziert und die dunkle auf `.2` angehoben; die
Tiefe entsteht dort aus dem Schatten, nicht aus einer Aufhellung.

### Nachweise

| Prüfung                                | Ergebnis                          |
| -------------------------------------- | --------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen             |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                       |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                      |
| `pnpm qa`                              | alle fünf Prüfungen               |
| `pnpm test:e2e`                        | 121 bestanden, 1 übersprungen     |
| `pnpm check:headings`                  | 136 Seitenaufrufe ohne Befund     |
| `pnpm visual-qa`                       | 17 Seiten × 4 Breiten ohne Befund |

### Ergänzte Tests

`tests/e2e/liquid-glass.spec.ts` wächst auf 31 Prüfungen. Neu: nur Hero- und
Abschluss-CTA tragen zwei Verlaufsebenen, die ruhigen Schaltflächen genau eine;
die helle Bänderung auf dunklem Grund bleibt unter `.12`; die Markenfarbe misst
auch unter der Bänderung exakt `rgb(0, 227, 242)`; jede Regel, die die
Spiegelung startet, hängt an `:hover`; im Ruhezustand ist die Spiegelung auf
allen Schaltflächen unsichtbar.

## Runde: Chromfassung auf dem Rand

Korrektur der vorigen Runde. Die gerichtete Bänderung lag über der **Fläche**;
gewünscht war Metall ausschließlich auf dem **Rand**, mit durchlaufendem Glanz.

### Umbau

Die Bänderung auf `::before` ist entfallen, die Fläche der großen
Schaltflächen ist wieder flach. Das Metall sitzt jetzt auf `::after`: ein
1,6px schmaler Ring, erzeugt aus zwei einander ausschließenden Masken
(`mask-composite: exclude`), mit `border-radius: inherit` – weiterhin 6px.

Darauf zwei Hintergrundebenen: ein schmales helles Band, das in 5s um die
Fassung wandert (beim Hover 2,2s), und eine stehende Chromfassung aus hell,
dunkel, hell. Animiert wird nur die `background-position` der ersten Ebene –
eine Fläche von rund 200×52px, kein Layout, kein Repaint der Seite.

### Während der Sichtprüfung korrigiert

Erster Entwurf der Fassung war zu weiß (Spitzlichter bei `.9`/`.95`) und las
sich als Leuchten statt als geschliffene Kante. Die Spitzlichter liegen jetzt
bei `.66`/`.78`, die dunklen Bahnen bei `.58`/`.62`.

### Nachweise

| Prüfung                                | Ergebnis                          |
| -------------------------------------- | --------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen             |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                       |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                      |
| `pnpm qa`                              | alle fünf Prüfungen               |
| `pnpm test:e2e`                        | 124 bestanden, 1 übersprungen     |
| `pnpm check:headings`                  | 136 Seitenaufrufe ohne Befund     |
| `pnpm visual-qa`                       | 17 Seiten × 4 Breiten ohne Befund |

Zusätzlich vier Aufnahmen derselben Schaltfläche im Abstand von 900ms: Die
`background-position` wandert von −61 % über −9 % und 41 % auf 90 %, der helle
Punkt auf der Fassung verschiebt sich sichtbar mit.

### Ergänzte Tests

`tests/e2e/liquid-glass.spec.ts` wächst auf 34 Prüfungen. Neu: nur die großen
Schaltflächen tragen eine Ringmaske aus zwei Ebenen mit Ausschlussmodus und
laufendem Glanz; die ruhigen tragen gar keine; die Fläche der großen
Schaltflächen führt genau eine Lichtebene und keinen Verlauf quer darüber; die
Fassung bleibt bei höchstens 8px Radius und bündig am Rand; der Randglanz
bewegt sich messbar; `ks-rim-shine` erscheint in keiner Regel außerhalb der
großen Schaltflächen; bei reduzierter Bewegung steht der Glanz still, während
die Fassung sichtbar bleibt.

## Runde: Neon-Flow ersetzt das CRT-Motiv im Hero

Das CRT-Motiv (Person mit Röhrenmonitor) ist vollständig aus dem
Startseiten-Hero entfernt. An seiner Stelle steht `src/components/NeonFlow.astro`
mit einem interaktiven WebGL-Röhreneffekt.

### Vorlage nicht übernommen

Der Referenzcode war React + Tailwind + shadcn + Framer Motion + lucide-react
und lud die Bibliothek per `cdn.jsdelivr.net`. Übernommen wurde nur die
visuelle Funktion. Installiert ist ausschließlich `threejs-components@0.0.19`;
eingebunden wird `build/cursors/tubes1.min.js` – ein eigenständiges ES-Modul,
das zur Laufzeit nichts nachlädt. Keine CDN-Adresse im Build, keine Lockerung
der CSP, keine React-Komponente, kein `components/ui`.

### Ladeverhalten

| Datei                    | roh    | gzip   | Ladezeitpunkt                   |
| ------------------------ | ------ | ------ | ------------------------------- |
| NeonFlow-Initialisierung | 3,5 KB | 1,7 KB | mit der Seite                   |
| `tubes1.min.<hash>.js`   | 743 KB | 202 KB | erst wenn der Hero sichtbar ist |

Der große Chunk wird per `import()` nachgeladen und steht weder als
`modulepreload` noch als `<script>` im HTML – der kritische Ladepfad bleibt
unverändert. Bei reduzierter Bewegung und ohne WebGL wird er nie geladen.

### Zustände

`data-neon-status` ist `ready` (Effekt läuft) oder `fallback` (reduzierte
Bewegung, fehlendes WebGL oder fehlgeschlagener Import). Der Rückfall ist eine
statische cyanfarbene Lichtfläche aus CSS – kein CRT-Bild, keine graue Box,
keine Fehlermeldung.

### Farben

Nur `#00E3F2`, `#FFFFFF`, `#F4F0E7`, `#101214`. Die Bibliothek erzeugt in ihren
Voreinstellungen Zufallsfarben (`16777215 * Math.random()`); alle Farbfelder
werden deshalb ausdrücklich gesetzt. Der Klick wechselt zwischen drei fest
definierten Konfigurationen aus genau diesen vier Werten. `randomColors` gibt
es nicht.

### Während der Umsetzung korrigiert

- Erster Versuch fiel überall auf `fallback` zurück: `three.start()`/`stop()`
  sind nicht öffentlich. Pausiert wird jetzt, indem `render` und
  `onBeforeRender` gegen leere Funktionen getauscht werden.
- Der Bloom-Schleier stand als sichtbares helleres Rechteck auf dem Hero. Die
  Maske arbeitet jetzt mit `closest-side` und erreicht an der Kante volle
  Transparenz.
- Mobil war nur ein Ausschnitt der Röhren zu sehen. Unter 1024px steht die
  Kamera weiter hinten (z = 7.4 statt 5).
- Die Wortmarke wurde von der Maske mit ausgeblendet. Maskiert ist jetzt nur
  noch die Bühne; die Wortmarke steht daneben.
- Bei 1920px wurde „Unternehmen“ in der schmaleren 46-Prozent-Spalte
  beschnitten. Die H1 skaliert dort mit 4.6vw statt 4.9vw.

### Nachweise

| Prüfung                                | Ergebnis                           |
| -------------------------------------- | ---------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen (69 Dateien) |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                        |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                       |
| `pnpm qa`                              | alle fünf Prüfungen                |
| `pnpm test:e2e`                        | 150 bestanden, 1 übersprungen      |
| `pnpm check:headings`                  | 153 Seitenaufrufe über 9 Breiten   |
| `pnpm visual-qa`                       | 17 Seiten × 4 Breiten ohne Befund  |

Zusätzlich in sechs Ansichten geprüft (1920/1440/1280/430/390/360): Effekt
startet überall (`ready`), null Konsolenfehler, null externe Requests, kein
waagerechter Überlauf.

### Neue Tests

`tests/e2e/neon-flow.spec.ts`, 26 Prüfungen: kein CRT-Bild, kein CRT-Video,
kein CRT-Alternativtext, kein CRT-Asset im HTML und in den Requests; Canvas
vorhanden, `aria-hidden`, ohne `tabindex`, weder per Tab noch programmatisch
fokussierbar; genau eine Instanz; keine Konsolenfehler; Überschrift, Lead,
beide Buttons und Standortzeile unverändert; Bricolage Grotesque und Inter
aktiv; Effekt überdeckt keinen Button, beide bleiben klickbar; kein Überlauf
bei 360px; Rückfall bei reduzierter Bewegung und ohne WebGL; keine
CDN-Adresse; keine externen Requests; keine React-, Tailwind-,
Framer-Motion-, lucide-react-, shadcn-, Radix- oder CVA-Abhängigkeit; kein
`.tsx`; kein Vorladen des großen Chunks; kein `Math.random` im Neon-Skript;
nur die freigegebene Palette; Klickwechsel ohne Fehler; CSP weiterhin ohne
`unsafe-inline` und ohne `unsafe-eval`.

Zwei Alttests forderten noch das CRT-Motiv und prüfen jetzt den Sollzustand:
`hero.spec.ts` („Im Medienbereich steht der Neon-Flow“) und `relaunch.spec.ts`
(„Der Hero zeigt den Neon-Flow“). Der Test gegen dynamischen Wortwechsel
vergleicht jetzt den Textinhalt statt des Markups – der Statuswert des
Effekts ändert das Markup, ohne dass sich etwas Lesbares ändert.

## Runde: Vollbild-Neon-Hero, Barrierefreiheits-Schalter, Feinschliff

### Umgesetzt

- **Neon Flow über den gesamten Hero.** Die Kreismaske ist entfallen; Canvas
  und Container liegen auf `inset: 0` über die volle Hero-Fläche, der Hero
  misst `calc(88svh − Kopfzeile)` (mobil 92svh). Die Inhalte liegen als
  normale HTML-Ebene darüber, lesbar durch einen weichen dunklen Verlauf –
  ohne sichtbaren Kasten.
- **Zeigerinteraktion auf der gesamten Fläche.** Der Klick auf freie
  Hero-Fläche wechselt zwischen drei festen Konfigurationen; Klicks auf Links,
  Buttons und Formularelemente sind ausgenommen.
- **Palette.** Cyan dominiert, Magenta, Violett und Neon-Grün sind kleine
  Akzente, Weiß und Creme tragen die Reflexe. Keine Zufallsfarben. Diese
  Farben gelten ausschließlich im Hero.
- **Zweite Wortmarke im Hero entfernt.**
- **Footer-Wortmarke.** `.section--dark a:not(.btn)` färbte den gesamten
  Schriftzug cyan. `.ft a.ft__wordmark` gewinnt jetzt auf Spezifität: Wort
  cremefarben, nur der Punkt `#00E3F2`.
- **Buttons.** `backdrop-filter` ist von allen Schaltflächen entfernt, die
  Sekundärflächen sind entsprechend deckender. Die metallische Fassung bleibt.
  `liquid-glass.css` heißt jetzt `button-metal.css`.
- **Barrierefreiheits-Schalter** (`AccessibilityDock.astro`), global unten
  links: Textgröße 100/112,5/125 Prozent, hoher Kontrast, Bewegungen
  reduzieren, Zurücksetzen. `localStorage`, kein Cookie, keine
  personenbezogenen Daten. Angewendet vor dem ersten Paint über
  `public/a11y-init.js` – externe Datei, damit die CSP ohne `unsafe-inline`
  auskommt.
- **Rechtstexte.** Anschrift trägt wieder ein Leerzeichen (Astro schluckte den
  Zeilenumbruch zwischen zwei Ausdrücken). Der Verweis auf die eingestellte
  OS-Plattform ist entfernt. Die Barrierefreiheitserklärung nennt geprüfte
  Bereiche, bekannte Einschränkungen und das Prüfdatum statt Platzhaltern.
- **Kontaktformular.** Pflicht sind Name, E-Mail und Projektbeschreibung. Die
  Budgetauswahl beginnt bei „Bis 2.500 €“.

### Kürzung

Startseite von 17,9 auf 15,5 Smartphone-Bildschirme (−13 Prozent), Abschnitte
von 13 auf 10. Entfallen: das Aussagenband unter dem Hero (nach dem
Vollbild-Hero eine Wiederholung), der eigene Abschnitt für „Alle Arbeiten
ansehen“, der zweite Absatz im Studio-Abschnitt. Verkürzt: Prozessschritte auf
der Startseite ohne die drei Detailzeilen, Leistungszeilen ohne das Beispiel,
FAQ auf drei Fragen. Die geforderten 25–35 Prozent wurden nicht erreicht – dazu
hätten Inhalte entfernt werden müssen, die ausdrücklich bleiben sollen.

### Nachweise

| Prüfung                                | Ergebnis                          |
| -------------------------------------- | --------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen             |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                       |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                      |
| `pnpm qa`                              | alle fünf Prüfungen               |
| `pnpm test:e2e`                        | 175 bestanden, 1 übersprungen     |
| `pnpm check:headings`                  | 152 Seitenaufrufe über 8 Breiten  |
| `pnpm visual-qa`                       | 19 Seiten × 7 Breiten ohne Befund |

### Neue Tests

`tests/e2e/feinschliff-final.spec.ts`, 24 Prüfungen: Canvas deckungsgleich mit
dem Hero, keine Maske, kein Radius, kein Clip-Path, keine zweite Wortmarke,
Zeigerwirkung über die gesamte Fläche, Buttons klickbar, kein Überlauf bei
430/390/360 px; Footer-Wortmarke cremefarben mit cyanem Punkt auf fünf Seiten
und der 404-Seite; Cyan-Block und Footer auf allen Marketingseiten, genau ein
Footer je Seite; Schalter auf 14 Seiten unten links, 44-px-Flächen,
Kapselmaß, Textgröße ohne Überlauf, Hochkontrast mit Kontrastverhältnis ≥ 7,
Bewegungsschalter stoppt den Neon-Hero, Persistenz über Seitenwechsel, Escape
und Klick außerhalb, Tastaturbedienung; Vorschau bleibt noindex, Anschrift mit
Leerzeichen, kein OS-Plattform-Verweis, echter Prüfstand, drei Pflichtfelder,
neue Budgetstufen.

### Angepasste Alttests

Acht Tests forderten den alten Zustand und prüfen jetzt den neuen: Pillenform
(der Systemschalter darf rund sein), Stylesheet-Name, fehlender
`backdrop-filter`, `aria-hidden` am Neon-Container statt am Canvas, Animation
hinter statt neben dem Inhalt, erweiterte Hero-Palette, entfallenes
Aussagenband.

## Runde: Branchenraster – Bildfenster bleibt frei

### Befund

Die CI schlug seit Commit `1796c4c` bei jedem Lauf fehl, lokal aber nie:
`feinschliff.spec.ts` meldete für das Branchenraster „Namen versetzt“ mit
22 px Abweichung. Ursache war keine Schwankung des Prüfrechners, sondern eine
echte Abhängigkeit im Layout.

Der Eintrag ohne Bildmotiv war unten bündig gestellt. Dadurch hing die Höhe
seines Namens davon ab, über wie viele Zeilen das Argument **darunter** lief.
Auf dem CI-Rechner brach ein Argument der Nachbarzelle eine Zeile später um,
die Rasterzeile wurde höher, und der Name des motivlosen Eintrags rutschte
mit nach unten.

Nachgestellt wurde der Fall lokal, indem die Hausschriften blockiert wurden:
mit Ersatzschrift bricht `Atmosphäre spürbar machen und Reservierungen bzw.
Buchungen erleichtern.` dreizeilig statt zweizeilig um – exakt dieselbe
Abweichung von 22 px.

### Behebung

Fehlt das Motiv, bleibt der Platz des Bildfensters jetzt leer, statt zu
fehlen: gleiche Breite, gleiches Seitenverhältnis, keine Fläche, kein Rahmen,
keine Farbe. Der Name beginnt dadurch in jeder Rasterzeile auf derselben
Höhe – unabhängig vom Umbruch darunter. Der Test
`Die Branche ohne Motiv trägt weder Rahmen noch graue Fläche` bleibt gültig.

**Nebenbefund:** Die Regeln für `.igrid__media` griffen nie. Die Klasse sitzt
auf dem Wurzelelement der Photo-Komponente und trägt deren Bereichskennung,
nicht die des Rasters – ein markierter Selektor findet sie dort nicht. Die
Bildüberblendung beim Hover ist jetzt über `:global()` angebunden, der tote
Außenabstand ist entfernt. Die Darstellung im Ruhezustand bleibt unverändert.

### Neue und geänderte Prüfungen

- Die Rasterprüfung misst die **Oberkante der ersten Namenszeile** statt der
  letzten. Zweizeilige Namen laufen nach unten weiter, beginnen in der Reihe
  aber auf einer Linie – das ist die Zusage, die das Layout hält.
- Neu: dieselbe Prüfung mit blockierten Hausschriften. Sie hält den Fall
  fest, der auf dem CI-Rechner auftrat.

### Nebenbefund Lint

`pnpm lint` beanstandete `public/a11y-init.js` (Browsergloable in einer Datei
außerhalb von `src/`) und eine ungenutzte Variable in
`feinschliff-final.spec.ts`. Die ESLint-Konfiguration kennt jetzt
`public/**/*.js` als Browserumgebung; beide Befunde sind bereinigt.

### Nachweise

| Prüfung                                | Ergebnis                                 |
| -------------------------------------- | ---------------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen                    |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                              |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                             |
| `pnpm qa`                              | alle fünf Prüfungen                      |
| `pnpm test:e2e`                        | 176 bestanden, 1 übersprungen            |
| `pnpm check:headings`                  | 152 Seitenaufrufe über 8 Breiten         |
| `pnpm visual-qa`                       | 19 Seiten × 7 Breiten ohne Befund        |
| GitHub Actions „CI“                    | grün (erster grüner Lauf seit `7f1256f`) |
| GitHub Actions „Preview“               | grün, auf GitHub Pages veröffentlicht    |

## Runde: Zahnarztmotiv eingesetzt

### Bild

Das gelieferte Foto (Filip Rankovic Grobgaard, Unsplash `rm7Mgu33tHU`) liegt
als `public/assets/branchen/source/zahnarztpraxen.jpg` (1476 × 2000, Hochformat)
und wird von `pnpm assets:images` in acht Dateien aufbereitet: 640/960/1280/1600 px
je als WebP und AVIF. Alle übrigen Motive bleiben byte-identisch.

Das frühere, mit `handwerk.jpg` identische Bild (MD5 `96484aad…`) wird nicht
verwendet; die neue Quelle trägt MD5 `ab160840…`.

### Ausschnitt

Aus dem Hochformat entsteht ein 4:3-Querformat. Der Ausschnitt sitzt bewusst
nicht exakt mittig: `scripts/build-images.py` kennt jetzt eine Karte `FOCUS`
mit der senkrechten Lage je Motiv (0 = oben, 0.5 = Mitte, 1 = unten). Für
`zahnarztpraxen` steht dort **0.42**.

Der Grund ist doppelt: weiter oben käme der aufgestickte Name einer fremden
Praxis ins Bild – eine andere Marke auf der eigenen Website; weiter unten
liefe das obere Auge aus dem Bild. Bei 0.42 stehen Gesicht, beide Augen,
Hand, Instrument, Mundspiegel und die Behandlungssituation vollständig im
Ausschnitt. Ohne Eintrag in `FOCUS` bleibt es bei der Mitte, sodass die
bestehenden Motive unverändert erzeugt werden.

### Nebenbefund: Bildfenster liefen oben bündig ab

Beim Prüfen des Hauptmotivs auf der Detailseite fiel auf, dass das Bild
oben bündig abgeschnitten wurde statt mittig – die Behandlung lag unterhalb
der Kante. Ursache war nicht der Ausschnitt, sondern die Photo-Komponente:
`picture` ist von Haus aus inline und ohne eigene Höhe, ein `block-size: 100%`
am Bild fand dort keinen Bezug und fiel auf die Eigenhöhe zurück. Das Bild
ragte aus dem Fenster und wurde vom `overflow: hidden` oben bündig
beschnitten; `object-fit` und `object-position` blieben wirkungslos.

Betroffen war jedes Fenster, dessen Format vom 4:3 der Datei abweicht:

| Fläche                                   | Überstand vorher |
| ---------------------------------------- | ---------------- |
| Branchen-Hauptmotive (21:9), fünf Seiten | 426 px           |
| Bildstreifen `/branchen/lokale-…` (21:9) | 426 px           |
| Standortbild `/kontakt/` (16:9)          | 135 px           |
| Hochformat `/branchen/gastronomie-…`     | −302 px          |

Der letzte Fall lief andersherum: das Bild war kleiner als das Fenster, unter
dem Hotelzimmer stand ein grauer Balken – genau die Fläche, die es auf dieser
Website nicht geben soll.

`picture` spannt jetzt das Fenster auf. Alle neun Flächen füllen exakt
(Überstand 0 px), und der graue Balken ist weg. Sichtbare Folge: die Motive
zeigen ihre Mitte statt ihres oberen Randes – bei allen fünf Branchenbildern,
dem Standortbild und den beiden Galeriebildern ist mehr vom Motiv zu sehen
als zuvor.

### Neue Tests

`tests/e2e/zahnarztmotiv.spec.ts`, 8 Prüfungen: acht Varianten vorhanden;
Quelldatei nicht das Handwerksbild (MD5-Vergleich gegen den alten Hash und
gegen `handwerk.jpg`); auch die ausgelieferten Breiten unterscheiden sich vom
Handwerksmotiv; Bildfeld bei 1440 × 900 und 390 × 844 gefüllt, `naturalWidth`

> 0, Alternativtext, feste `width`/`height`, 4:3, `object-fit: cover`, kein
> Handwerkspfad; gleicher Aufbau wie Handwerk und Gastronomie (Bild,
> Überschrift, Beschreibung, Pfeil); `picture` mit AVIF- und WebP-Quelle,
> `srcset` über alle vier Breiten, `sizes` gesetzt; Hauptmotiv auf der
> Detailseite; Bild füllt sein Fenster (Überstand ≤ 1 px); kein waagerechter
> Überlauf bei 360/390/430 px.

### Geänderter Alttest

`Die Branche ohne Motiv trägt weder Rahmen noch graue Fläche` setzte einen
Eintrag ohne Bild voraus – den gibt es nicht mehr. Die Prüfung ist geteilt:
eine Zusage, dass jede Branche ihr Motiv trägt, und eine zweite, die die alte
Regel für den Fall erhält, dass später wieder ein Motiv fehlt.

### Nachweise

| Prüfung                                | Ergebnis                          |
| -------------------------------------- | --------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen             |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                       |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                      |
| `pnpm qa`                              | alle fünf Prüfungen               |
| `pnpm test:e2e`                        | 187 bestanden, 1 übersprungen     |
| `pnpm check:headings`                  | 152 Seitenaufrufe über 8 Breiten  |
| `pnpm visual-qa`                       | 19 Seiten × 7 Breiten ohne Befund |

### Nebenbefund package.json

`assets:branchen` zeigte auf `scripts/build-industry-images.py` – eine Datei,
die es nicht gibt. Der Eintrag heißt jetzt `assets:images` und zeigt auf
`scripts/build-images.py`, wie in der Dokumentation und im Skript selbst
angegeben.

## Runde: Produktions-, SEO-, Recht- und Conversion-Prüfung

Ausgangsstand: `388b29b`. Geprüft wurden 27 Routen an 8 Breiten und 4
Zoomstufen – 297 Einzelprüfungen ohne Befund.

### Vier Befunde, die vorher niemand gemeldet hatte

**1. `build:production` lief durch, obwohl tragende Angaben fehlten.**
`REQUIRED_LEGAL_FIELDS` enthielt nur Anschrift, E-Mail und Telefon. Hosting-
anbieter, Serverstandort, Mailanbieter und Aufbewahrungsdauer standen auf
`[ERSETZEN]` – und trotzdem entstand ein deploybarer Build. Die vier Felder
sind jetzt Pflicht.

**2. Die Datenschutzerklärung behauptete einen Serverstandort.**
„Serverstandort in Deutschland“ und „über einen Server in Deutschland“ standen
im Text, während genau diese Angaben unbestätigt waren. Beide Aussagen
erscheinen jetzt nur bei belegten Werten; sonst steht dort, was tatsächlich
feststeht.

**3. Die Website verlegte den Sitz nach Würzburg.**
„KERNSEITE sitzt in Würzburg“ stand in `site.ts`, auf der Agenturseite und
sinngemäß in Hero, Fußzeile und Meta-Angaben. Der Sitz ist Erlabrunn.
Würzburg ist bedientes Marktgebiet und wird jetzt auch so benannt („Raum
Würzburg“, „bei Würzburg“). Die strukturierte Anschrift nannte bereits
Erlabrunn – Text und Daten widersprachen sich also.

**4. Das Kontaktformular veröffentlichte Preise.**
Vier Budgetklassen von „Bis 2.500 €“ bis „Über 10.000 €“ waren sichtbar,
obwohl KERNSEITE keine Preise veröffentlicht. Ersetzt durch den Projektumfang
ohne Beträge.

### Umgesetzt

- **Legal-Gate** (`src/config/release.ts`): drei interne Schalter
  (`legalReviewApproved`, `canonicalDomainConfirmed`,
  `privacyInfrastructureConfirmed`). Der Produktions-Build bricht ab, solange
  einer offen ist. Die Schalter erscheinen nirgends im Output.
- **Impressum**: Haftungs-Boilerplate zu §§ 7/8–10 DDG entfernt – keine
  Pflichtangabe und nur eine verkürzte Wiedergabe der Gesetzeslage. § 5 DDG
  bleibt Grundlage. „Redaktionell verantwortlich“ erscheint nur noch, wenn
  tatsächlich ein redaktionelles Angebot besteht (`legal.hasJournalisticContent`).
- **Datenschutz**: `kernseite-accessibility` mit Zweck, Inhalt, Speicherort
  und Löschweg beschrieben; keine Verharmlosung der Rechtslage.
- **SEO**: je Seite eine primäre Suchintention. Titel und Beschreibungen tragen
  jetzt den Suchbegriff statt nur den Seitennamen; die Startseite ordnet die
  Marke im ersten Fließtext sachlich ein. Keine Stadt-Landingpages, kein
  Keyword-Stuffing.
- **JSON-LD**: `areaServed` um Deutschland ergänzt. Weiterhin keine
  Bewertungen, Preise, Öffnungszeiten oder Auszeichnungen.
- **CTA**: kontextbezogene Beschriftungen; `/kontakt/?leistung=` und
  `?branche=` wählen im Formular vor. Der Wert aus der Adresszeile wird nur
  verglichen, nie übernommen – gesetzt wird der Wert aus der Whitelist.
- **Formular/PHP**: `budget` → `scope`, neues Feld `branch`, beide mit
  Längenbegrenzung im Validator.

### Neue dauerhafte Prüfungen

| Datei                                | Umfang                                                                                                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-seo.mjs`              | Teil von `pnpm qa`: eindeutige Titles/Descriptions, Längen, genau eine H1, Canonicals, Open Graph, parsebares JSON-LD, keine meta keywords, kein hreflang, Sitemap gegen noindex |
| `tests/e2e/a11y-reset.spec.ts`       | 5 Prüfungen: alle drei Einstellungen inkl. Reload, Reset inkl. Reload, beschädigtes JSON, gesperrter Speicher, Escape/Klick/Tastatur, Live-Region                                |
| `tests/e2e/produktionsreife.spec.ts` | 32 Prüfungen: Recht, Standortwahrheit, Suchintent je Seite, Preise, Query-Kontext, Produktions-Gate                                                                              |
| `tests/e2e/zoom-und-bilder.spec.ts`  | 7 Prüfungen: Zoom 125/150/200 %, Schalter bei 200 %, Bilder mit AVIF/WebP/Maßen/Alt                                                                                              |

### Nachweise

| Prüfung                                | Ergebnis                                  |
| -------------------------------------- | ----------------------------------------- |
| `pnpm astro check`                     | 0 Fehler, 0 Warnungen                     |
| `pnpm lint` / `pnpm format:check`      | ohne Befund                               |
| `pnpm build:ci` / `pnpm build:preview` | je 27 Seiten                              |
| `pnpm build:production`                | **bricht ab, Exit-Code 1** (gewollt)      |
| `pnpm qa`                              | sechs Prüfungen, darunter neu `check-seo` |
| `pnpm test:e2e`                        | **231 bestanden, 1 übersprungen**         |
| `pnpm check:headings`                  | 152 Seitenaufrufe über 8 Breiten          |
| Responsive-/Zoom-/Bildaudit            | 297 Prüfungen, keine Befunde              |

### Performance

Der Three.js-Anteil (`tubes1.min`, 761 KB) wird ausschließlich von der
Startseite dynamisch nachgeladen. Keine der 26 übrigen Seiten referenziert
ihn; Rechtstexte, Kontakt und Branchenseiten laden 6 kleine Skripte
(zusammen unter 12 KB). Der Effekt startet erst nach dem kritischen Inhalt
und entfällt bei reduzierter Bewegung, fehlendem WebGL und Datensparmodus.

### Bewusst nicht geändert

Schriften, Farben, Buttonoptik, Cyan-Abschluss, schwarzer Footer, Bildsprache
und Seitenaufbau bleiben unverändert. Diese Runde hat nichts neu gestaltet.
