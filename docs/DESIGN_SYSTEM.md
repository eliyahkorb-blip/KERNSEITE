# Design-System

Haltung: **editorial, mutig, ruhig, hochwertig.** Sehr große Typografie, echte Bilder,
wechselnde Layouts, bewusste Asymmetrie, klare Abschnittswechsel.

**Karten sind aus dem Frontend verschwunden.** Inhalte werden strukturiert über
Typografie, Bilder, Linien, Raster, Weißraum, wechselnde Hintergrundflächen und
große Kapitelnummern ohne Box. Kartenähnliche Flächen gibt es nur noch für
Formularfelder, Filter und Dialoge.

## Farben (`src/styles/tokens.css`)

| Token             | Wert            | Rolle                                                       |
| ----------------- | --------------- | ----------------------------------------------------------- |
| `--ks-cyan`       | `#00E3F2`       | **einzige kräftige Akzentfarbe**                            |
| `--accent-mark`   | `#00E3F2`       | Neon als Linie, Unterstreichung, Pfeil, Fläche, Fokus       |
| `--accent-ink`    | kontextabhängig | Akzent-Schriftfarbe: schwarz auf hell, `#00E3F2` auf dunkel |
| `--ks-black`      | `#101214`       | Typografie, dunkle Flächen                                  |
| `--ks-black-soft` | `#25282B`       | abgesetzte dunkle Flächen                                   |
| `--ks-paper`      | `#F4F0E7`       | warme Grundfläche                                           |
| `--ks-cream`      | `#FCFAF5`       | hellste Fläche                                              |
| `--ks-surface`    | `#EAE5DB`       | abgesetzte helle Fläche                                     |
| `--ks-line`       | `#D5CFC2`       | Trennlinien                                                 |
| `--ks-muted`      | `#60646B`       | Sekundärtext                                                |

Entfernt: `#19E6F2`, `#006B73`, `#00757D`, `#0C3D42`, `#0A6A73`, Ultramarin,
Marineblau, Blau-Grau, Signalrot als UI-Farbe. Blau, Lila, Orange, Grün und Gelb
kommen im Interface nicht vor.

**Es gibt bewusst keine abgeschwächte Türkis- oder Petrolvariante.** `#00E3F2` ist
zu hell, um auf Beige als kleiner Text zu funktionieren – die Lösung ist deshalb
nicht ein zweiter, dunklerer Türkiston, sondern eine andere Rolle:

| Untergrund                    | Text              | Neon-Türkis wirkt als                        |
| ----------------------------- | ----------------- | -------------------------------------------- |
| hell (Papier, Creme, Surface) | schwarz           | Unterstreichung, Linie, Pfeil, Fläche, Fokus |
| dunkel (`#101214`)            | `#00E3F2` erlaubt | Fläche, Linie, Fokus                         |
| Neon-Fläche (`#00E3F2`)       | schwarz           | – (Markierung wird schwarz)                  |

Markierte Wörter (`AccentWord`) sind auf hellem Grund **schwarz mit
Neon-Unterstreichung**, auf dunklem Grund neonfarben.

**Kontextfarben über Variablen.** `.section--dark`, `.wf--dark` und `.section--cyan`
setzen `--text`, `--text-muted`, `--accent-ink`, `--line` und `--line-strong` neu.
Custom Properties vererben sich, dadurch passen sich alle Komponenten automatisch an –
das ist zuverlässiger als Overrides, die an Astros Style-Scoping scheitern.

**Ausnahme:** Kunden-Screenshots behalten ihre Originalfarben und werden nicht
eingefärbt.

## Markiertes Wort (`AccentWord`)

Zentrales Markenelement: schwarzer Text auf cyanfarbener Markerfläche mit leicht
organischen Kanten, `box-decoration-break: clone` für stabile Zeilenumbrüche.
Maximal ein bis zwei markierte Begriffe je großer Headline. Die Markierung trägt
keine eigene Bedeutung – der Text bleibt ohne Farbwahrnehmung vollständig verständlich.

Variante `underline` für kräftige Unterstreichung statt Fläche.

## Typografie

- Display: Bricolage Grotesque · Text: Inter — beide lokal (SIL OFL). **Keine
  Monospace-Schrift mehr**: IBM Plex Mono ist aus Tokens, `@font-face`, Abhängigkeiten
  und `public/fonts/` entfernt.
- Hero-H1 `clamp(3.8rem, 8.5vw, 9.5rem)`, `line-height: .88`, `letter-spacing: -.065em`
- H2 `clamp(2.2rem, 6vw, 7rem)` · Projektüberschriften `clamp(2rem, 4.6vw, 5.8rem)`
- Fließtext max. `58ch`
- Überschriften mit `overflow-wrap: break-word` und `hyphens: auto` — lange deutsche
  Komposita sprengen sonst auf 390 px die Zeile.
- **Keine dekorativen Nummern.** Es gibt keine `01`/`02`-Zähler vor Kapiteln, Zeilen,
  Rasterfeldern, Prozessschritten oder Aufzählungen. Reihenfolge entsteht durch die
  Leserichtung, Blickanker durch feine Linien und Punkte.
- **Keine gesperrten Mini-Versalien.** Kein `text-transform: uppercase`, kein
  `letter-spacing` über 0 für Kleintext, kein Monospace. Alles in normaler
  Schreibweise und normaler Body-Schrift.
- `.label` ist eine ruhige Zwischenzeile in Body-Schrift (Sentence Case).
- `.tag` ordnet ein (Projektkategorie, Branche): kleine Schrift, feine Kontur,
  Pillenform, normale Schreibweise. Steht **unter** der Beschreibung, nicht darüber.

## Formen

Marketingelemente sind rechteckig. Es gibt **keinen Pillen-Radius** mehr –
vollrunde Chips, Tags und Buttons wirken beliebig und austauschbar.

| Element              | Radius                 | Form                                       |
| -------------------- | ---------------------- | ------------------------------------------ |
| Buttons (`.btn`)     | 6px                    | Rechteck, Mindesthöhe 52px, Padding 1.7rem |
| Bilder               | 4px (`--radius-image`) | Rechteck                                   |
| Formularfelder       | 6px                    | Rechteck                                   |
| Schlagworte (`.tag`) | 0                      | reiner Text, Trenner `/`                   |
| Fokusring            | 2px                    | 3px Neon-Kontur, 3px Abstand               |

Primärer CTA: Fläche `#00E3F2`, Text `#101214`, kein Verlauf, kein Schatten.
Beim Hover invertiert er zu schwarzer Fläche mit Neon-Text.

Schlagworte tragen keine Umrandung, keinen Hintergrund und keine Rundung. Sie
stehen als normale Textbegriffe unter der Beschreibung, getrennt durch einen
feinen Schrägstrich.

## Liquid Glass auf Schaltflächen (`src/styles/liquid-glass.css`)

Schaltflächen tragen eine feine Glasoberfläche. Sie liegt ausschließlich auf
`.btn`; Navigationslinks, Textlinks, FAQ-Toggles, der Hamburger, Formularfelder,
Karten, Bilder und ganze Abschnitte bleiben unberührt. Form, Größe, Typografie
und Farben ändern sich nicht – es kommt nur Material dazu.

### Ebenen

| Ebene | Träger     | Aufgabe                                      |
| ----- | ---------- | -------------------------------------------- |
| 1     | `.btn`     | markenkonformer Hintergrund aus `global.css` |
| 2     | `::before` | Lichtbrechung, Materialtiefe, innere Kante   |
| 3     | `::after`  | schmale Spiegelung, läuft einmal beim Hover  |
| 4     | Inhalt     | Text und Icon                                |

Beide Pseudo-Ebenen stehen auf `z-index: -1` und `pointer-events: none`. Der
Button setzt `isolation: isolate` und bildet damit einen eigenen Stapelkontext:
Die Ebenen liegen über der Fläche und unter der Schrift. Dadurch braucht kein
Button zusätzliche `span`-Wrapper – auch die, die nur aus Text bestehen.

### Lichtführung je Kontext

Jeder Kontext überschreibt nur vier Variablen. So stapeln sich nie zwei
Lichtebenen übereinander – genau daraus entstünde der Gel- oder Metalleindruck.

| Variable              | Aufgabe                    |
| --------------------- | -------------------------- |
| `--glass-top`         | Lichtkante oben links      |
| `--glass-bottom`      | Materialtiefe unten rechts |
| `--glass-ring-top`    | innere Kante oben          |
| `--glass-ring-bottom` | innere Kante unten         |

| Kontext                    | Fläche                             | Text      |
| -------------------------- | ---------------------------------- | --------- |
| Primär, hell und dunkel    | `#00E3F2`                          | `#101214` |
| Primär, Hover              | schwarz, Neon-Kante                | `#00E3F2` |
| Sekundär, hell             | `rgba(255,255,255,.28)`, Blur 16px | dunkel    |
| Sekundär, dunkel           | `rgba(255,255,255,.07)`, Rauchglas | hell      |
| Primär auf der Cyan-Fläche | dunkles Rauchglas                  | `#00E3F2` |

Die gemessene `background-color` des primären CTA bleibt exakt `#00E3F2`: Die
Materialtiefe kommt allein aus `::before`, nicht aus einem zweiten Verlauf auf
dem Element. Es gibt weiterhin nur einen Türkiston.

### Bewegung

Hover hebt den Button um 1px, setzt einen leichten Schlagschatten und lässt die
Spiegelung einmal in 520ms durchlaufen – keine Schleife, kein Blinken. Aktiv:
1px nach unten, `scale(.99)`. Alles nur unter `(hover: hover) and (pointer:
fine)`, damit auf Touch nach dem Antippen nichts hängen bleibt. Bei
`prefers-reduced-motion: reduce` entfallen Spiegelung und Transform; der
Glaslook bleibt statisch sichtbar.

### Zwei Materialstärken

Die Haupt-CTAs – beide Hero-Schaltflächen und der Abschluss-CTA – tragen
zusätzlich zur Lichtebene eine **gerichtete Bänderung**: hell, dunkel, hell quer
über die Fläche, wie auf gebürstetem Material. Daher der metallische Eindruck,
ohne Metallfarbe und ohne Grauverlauf. Die Bänderung liegt als zweite
Hintergrundebene auf `::before`; die gemessene `background-color` bleibt exakt
`#00E3F2`.

| Schaltfläche                                 | Material               |
| -------------------------------------------- | ---------------------- |
| Hero-CTAs, Abschluss-CTA                     | Bänderung + Lichtebene |
| Header-CTA, Formularbutton, mobiler Menü-CTA | nur Lichtebene         |
| 404-Buttons, Consent- und Cookie-Buttons     | nur Lichtebene         |

Auf kleinen Flächen wirkt eine kräftige Bänderung schnell billig – deshalb die
Trennung. Auf dunklem Grund kippt eine helle Bahn sofort ins Graue und der
Button sieht aus wie ein Metallbalken; dort trägt überwiegend die dunkle Bahn
die Tiefe (`--metal-dark: .2`), die helle bleibt eine schmale Kante
(`--metal-light: .05`).

Bei den großen Schaltflächen wandert der Lichtstreifen, solange der Zeiger
darauf liegt (2600ms je Durchlauf). Ohne Hover steht das Material still – es
gibt keine dauerhaft laufende Animation auf der Seite. Die ruhigen
Schaltflächen behalten den einmaligen Durchlauf.

### Grenzen

Kein SVG-Filter, kein `feTurbulence`, kein `feDisplacementMap`: Eine echte
Verzerrung würde Schrift und Kanten unruhig machen und je Button anders
aussehen. Kein JavaScript, keine Hydration, keine zusätzliche Netzwerkdatei
außer dem Stylesheet. Browser ohne `backdrop-filter` bekommen über `@supports`
deckendere Flächen und damit weiterhin lesbare Schaltflächen.

## Branchenraster

Fünf gleichwertige Einträge, gleicher Aufbau, gleiches Bildformat:

- Bildfenster 4:3, `object-fit: cover`, Radius 4px
- darunter Branchenname, ein kurzes Argument, Pfeillink
- keine Karte, kein Rahmen, kein Schatten, keine Nummer, kein Badge
- Desktop ab 69rem drei Spalten (3 + 2), Tablet zwei, Mobil eine
- Hover: Bildzoom 1.025 und eine Neon-Linie unter dem Namen

Bilder zeigen das jeweilige Gewerk. Screenshots von Kundenprojekten gehören
ausschließlich in den Bereich „Arbeiten“ und werden hier nicht als
Stimmungsbilder zweckentfremdet. Liegt ein Motiv nicht vor, erscheint der
Eintrag ohne Bildfläche – kein grauer Platzhalter, keine schwarze Ersatzlinie.

## Bausteine

`HeroCinematic` · `StatementBand` · `WorkFeature` · `ServiceRows` · `GoogleProfile` ·
`ProblemList` · `IndustryGrid` · `ProcessTimeline` · `FaqAccordion` · `CtaBanner` ·
`AccentWord` · `Header` · `Footer` · `ContactForm` · `Breadcrumbs` · `ConsentManager`

Entfernt: `ServiceCard`, `WorkCard`, `ProcessBand`, `IndustryList`, `CaseMockup`,
`ReferenceImage`, `HeroFigure` — sämtlich Träger der alten Kartenoptik.

## Bewegung

Nur `transform`/`opacity`. `.reveal` blendet erst ein, wenn das Skript den Beobachter
aktiviert (`html.has-reveal`) — ohne JS und bei `prefers-reduced-motion` ist alles
sofort sichtbar. Der CRT-Bildschirm ist ein fertiges Standbild – kein Overlay, kein Flackern,
kein Wortwechsel. Das Aussagenband unter dem Hero steht still; die Scrollmotivation
kommt aus dem Text und einem Weiterlese-Hinweis, nicht aus einer Animation.

## Barrierefreiheit

WCAG 2.2 AA als Zielstandard. Automatisch geprüft: genau eine H1 je Seite, korrekte
Überschriftenhierarchie, Alt-Texte, zugängliche Namen, Kontraste auf allen Flächen
(inkl. dunkler und cyanfarbener Kontexte), kein horizontaler Überlauf bei 390 px,
sichtbarer Fokus in Cyan, Skip-Link, Tastaturbedienung des Mobilmenüs.
