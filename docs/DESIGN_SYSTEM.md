# Design-System

Helle, redaktionelle, mutige Gestaltung – bewusst **keine** typische KI-SaaS-Optik
(keine dunkle Cyberpunk-Fläche, kein Glassmorphism, keine Neonverläufe, keine generischen
Icon-Karten, keine Bento-Überladung).

## Farben (`src/styles/tokens.css`)

| Token                 | Wert      | Rolle                         |
| --------------------- | --------- | ----------------------------- |
| `--color-paper`       | `#F4F1E8` | Warmweiß / Grundstimmung      |
| `--color-bright`      | `#FCFBF7` | reines Hell (Flächen/Karten)  |
| `--color-graphite`    | `#111318` | Haupttext                     |
| `--color-ultramarine` | `#304FFE` | zentrale Markenfarbe          |
| `--color-cyan`        | `#19E6F2` | leuchtender Akzent (gezielt)  |
| `--color-navy`        | `#081B3A` | starke Kapitel / Footer       |
| `--color-slate`       | `#CBD4E3` | gedämpftes Blau-Grau          |
| `--color-alert`       | `#FF5D45` | Warn-/Kontrastfarbe (sparsam) |

Regeln: Warmweiß dominiert, Graphit als Text, Ultramarin als Marke, Cyan nur als Akzent,
Marineblau für einzelne Kapitel/Footer. Keine großen violetten KI-Verläufe.

## Typografie

- **Display/Headlines:** Bricolage Grotesque (variabel)
- **Fließtext/UI:** Inter
- **Labels/technisch:** IBM Plex Mono
- Alle Schriften **lokal** (SIL OFL), `font-display: swap`, kritische Schnitte vorgeladen.
- Responsive Skala via `clamp()`: Hero-H1 ca. 44 → 150 px; weitere Stufen `--fs-*`.

## Layout

- Container max. `1600px`, Inhaltsbreite max. `1440px`, Lesebreite `~68ch`.
- 12-Spalten-Denke, großzügiger Weißraum, `--section-y` als vertikaler Rhythmus.
- Wechsel zwischen ruhigen Textflächen (paper/bright/muted) und starken Kapiteln (navy).
- Mobile Layouts eigenständig gestaltet (nicht nur zusammengeschoben).

## Komponenten (`src/components/`)

- `Header` (+ barrierefreies Mobilmenü mit Fokusfalle), `Footer`, `Seo`, `Breadcrumbs`
- `HeroCore/` (Hero-Animation „Der digitale Kern“)
- `ServiceCard`, `ProcessBand`, `WorkGrid`, `CaseMockup`, `IndustryList`, `FaqAccordion`,
  `CtaBanner`, `ContactForm`, `ConsentManager`, `DraftNotice`
- Layouts: `BaseLayout`, `PageLayout`

## Bewegung

- `transform`/`opacity`-basiert, ruhig, hochwertig; Web Animations API / CSS.
- Respektiert `prefers-reduced-motion`; Animationen pausieren offscreen und bei inaktivem Tab.
- Keine WebGL/3D-Bibliothek, kein Hintergrundvideo.

## Barrierefreiheit

WCAG 2.2 AA als Zielstandard: Landmarken, genau eine H1/Seite, Fokus-Sichtbarkeit,
Skip-Link, ausreichende Kontraste, Tastaturbedienbarkeit, Live-Regionen, keine Info nur
über Farbe, ausreichend große Touch-Ziele.

## Marke

Wortmarke „KERNSEITE.“ mit Punkt/Kern in Electric Cyan; reduziertes K-Monogramm als
Favicon (`public/favicon.svg`).
