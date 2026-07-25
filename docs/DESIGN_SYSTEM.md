# Design-System

Haltung: **editorial, mutig, ruhig, hochwertig.** Sehr große Typografie, echte Bilder,
wechselnde Layouts, bewusste Asymmetrie, klare Abschnittswechsel.

**Karten sind aus dem Frontend verschwunden.** Inhalte werden strukturiert über
Typografie, Bilder, Linien, Raster, Weißraum, wechselnde Hintergrundflächen und
große Kapitelnummern ohne Box. Kartenähnliche Flächen gibt es nur noch für
Formularfelder, Filter und Dialoge.

## Farben (`src/styles/tokens.css`)

| Token             | Wert      | Rolle                                        |
| ----------------- | --------- | -------------------------------------------- |
| `--ks-cyan`       | `#00E3F2` | **einzige kräftige Akzentfarbe**              |
| `--ks-cyan-dark`  | `#006B73` | Cyan für kleine Texte auf hellem Grund (AA)   |
| `--ks-black`      | `#101214` | Typografie, dunkle Flächen                    |
| `--ks-black-soft` | `#25282B` | abgesetzte dunkle Flächen                     |
| `--ks-paper`      | `#F4F0E7` | warme Grundfläche                             |
| `--ks-cream`      | `#FCFAF5` | hellste Fläche                                |
| `--ks-surface`    | `#EAE5DB` | abgesetzte helle Fläche                       |
| `--ks-line`       | `#D5CFC2` | Trennlinien                                   |
| `--ks-muted`      | `#60646B` | Sekundärtext                                  |

Entfernt: `#19E6F2`, Ultramarin, Marineblau, Blau-Grau, Signalrot als UI-Farbe.
Blau, Lila, Orange, Grün und Gelb kommen im Interface nicht vor.

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

- Display: Bricolage Grotesque · Text: Inter · Labels: IBM Plex Mono — alle lokal (SIL OFL)
- Hero-H1 `clamp(3.8rem, 8.5vw, 9.5rem)`, `line-height: .88`, `letter-spacing: -.065em`
- H2 `clamp(2.2rem, 6vw, 7rem)` · Projektüberschriften `clamp(2rem, 4.6vw, 5.8rem)`
- Fließtext max. `58ch`
- Überschriften mit `overflow-wrap: break-word` und `hyphens: auto` — lange deutsche
  Komposita sprengen sonst auf 390 px die Zeile.
- Keine Monospace-Eyebrows vor jedem Abschnitt. `.label` nur bei Projektkategorie,
  Branche, Abschnittsnummer, technischen Angaben und im Footer.

## Bausteine

`HeroCinematic` · `StatementBand` · `WorkFeature` · `ServiceRows` · `GoogleProfile` ·
`ProblemList` · `IndustryGrid` · `ProcessTimeline` · `FaqAccordion` · `CtaBanner` ·
`AccentWord` · `Header` · `Footer` · `ContactForm` · `Breadcrumbs` · `ConsentManager`

Entfernt: `ServiceCard`, `WorkCard`, `ProcessBand`, `IndustryList`, `CaseMockup`,
`ReferenceImage`, `HeroFigure` — sämtlich Träger der alten Kartenoptik.

## Bewegung

Nur `transform`/`opacity`. `.reveal` blendet erst ein, wenn das Skript den Beobachter
aktiviert (`html.has-reveal`) — ohne JS und bei `prefers-reduced-motion` ist alles
sofort sichtbar. Der CRT-Bildschirm flackert dezent und steht bei reduzierter Bewegung
still. Das Statement-Band läuft langsam und hält bei reduzierter Bewegung an.

## Barrierefreiheit

WCAG 2.2 AA als Zielstandard. Automatisch geprüft: genau eine H1 je Seite, korrekte
Überschriftenhierarchie, Alt-Texte, zugängliche Namen, Kontraste auf allen Flächen
(inkl. dunkler und cyanfarbener Kontexte), kein horizontaler Überlauf bei 390 px,
sichtbarer Fokus in Cyan, Skip-Link, Tastaturbedienung des Mobilmenüs.
