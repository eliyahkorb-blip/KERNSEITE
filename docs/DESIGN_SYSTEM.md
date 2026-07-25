# Design-System

Haltung: **ruhig, hochwertig, präzise, agenturig.** Große Typografie, viel Weißraum,
klare Hierarchien, feine Linien statt Kacheln. Farbe wird sparsam eingesetzt.

Bewusst **nicht**: KI-SaaS-Optik, Glassmorphism, Neonverläufe, bunte Icon-Kacheln,
Bento-Überladung, verspielte Microinteractions, Deko ohne Funktion.

## Farben (`src/styles/tokens.css`)

| Token                 | Wert      | Rolle                                        |
| --------------------- | --------- | -------------------------------------------- |
| `--color-sand`        | `#EDE9E1` | warmes Beige-Grau – ruhige Grundfläche        |
| `--color-paper`       | `#F6F4EF` | Off-White                                     |
| `--color-bright`      | `#FDFCFA` | hellste Fläche (Karten)                       |
| `--color-ink`         | `#14161A` | Typografie, primäre Schaltflächen             |
| `--color-ink-deep`    | `#0F1215` | dunkle Kapitel, Hero, Footer                  |
| `--color-cyan`        | `#19E6F2` | **einzige Akzentfarbe** (Flächen, Dunkelgrund) |
| `--color-accent-deep` | `#0A6A73` | lesbare Cyan-Variante auf Hell (Links, Pfeile) |
| `--color-alert`       | `#B4442F` | **nur** Dev-/Vorschau-Hinweise, nie im Design |

**Regel:** Cyan ist die einzige Akzentfarbe. Auf hellem Grund wird die dunkle
Variante `--color-accent-deep` verwendet (AA-Kontrast), auf dunklem Grund das
helle Cyan. Keine zweite Akzentfarbe einführen. Keine Farbverläufe als Deko.

Kontraste (geprüft): Text auf allen Hellflächen ≥ 5,0:1, Cyan auf `--color-ink-deep`
≥ 11,7:1.

## Typografie

- **Display/Headlines:** Bricolage Grotesque (variabel)
- **Fließtext/UI:** Inter
- **Labels/technisch:** IBM Plex Mono (Eyebrows, Zähler, Meta)
- Alle Schriften **lokal** (SIL OFL), `font-display: swap`, kritische Schnitte vorgeladen.
- Skala via `clamp()`: `--fs-hero` 48 → 160 px, `--fs-h1` 36 → 76 px, `--fs-h2` 30 → 56 px.
- Enges Tracking bei großen Graden (`--tracking-tight` / `--tracking-tighter`),
  Zeilenhöhe `0.98`–`1.14` bei Headlines.

## Layout

- Container max. `1600px`, Inhaltsbreite max. `1380px`, Lesebreite `~62ch`.
- `--section-y` (72 → 176 px) als vertikaler Rhythmus; direkt nach einem Seitenkopf reduziert.
- Flächenwechsel: `sand` → `bright` → `paper` → `dark`. Klassen:
  `.section--sand`, `.section--paper`, `.section--bright`, `.section--muted`, `.section--dark`.
- Mobile Layouts eigenständig gestaltet (nicht nur zusammengeschoben).

## Bausteine

- `.section-head` – einheitlicher Sektionskopf (Eyebrow, Titel, Lead)
- `.eyebrow` – Mono-Label mit kurzer Cyan-Linie
- `.arrow-link` – Standard-Textlink mit Unterlinie, Cyan beim Hover
- `.btn--primary` (Ink auf Hell / Cyan auf Dunkel), `.btn--secondary` (Hairline)
- `.card` – ruhige helle Fläche, 1 px Kontur, `--radius-lg`
- `.hairline` – feine Trennlinie
- `.reveal` – dezentes Einblenden beim Scrollen (Progressive Enhancement, s. u.)

**Karten-Regel:** helle Fläche, feine Kontur, kein Schlagschatten im Ruhezustand,
kein Farbfeld, keine Badge-Systeme. Hover verändert nur die Konturfarbe bzw. hebt
Medien minimal an.

## Komponenten (`src/components/`)

- `Header` (+ barrierefreies Mobilmenü mit Fokusfalle), `Footer`, `Seo`, `Breadcrumbs`
- `HeroCinematic` – Hero mit Loop-Video, Cyan-Bildschirmfläche und CRT-Anmutung
- `GoogleProfile` – Sektion „Lokale Sichtbarkeit“ (Google-Unternehmensprofil)
- `ServiceCard`, `ProcessBand`, `WorkCard`, `ReferenceImage`, `CaseMockup`,
  `IndustryList`, `FaqAccordion`, `CtaBanner`, `ContactForm`, `ConsentManager`, `DraftNotice`
- Layouts: `BaseLayout`, `PageLayout`

## Bewegung

- Nur `transform`/`opacity`, ruhig und kurz. Keine Parallax-Effekte, kein Scroll-Jacking.
- `.reveal`: Inhalte sind **standardmäßig sichtbar**; erst wenn das Skript den
  Beobachter aktiviert, wird eingeblendet (`html.has-reveal`). Ohne JS oder bei
  `prefers-reduced-motion` bleibt alles sofort lesbar.
- Hero: Video und Bildschirm-Flackern pausieren offscreen, bei inaktivem Tab und bei
  `prefers-reduced-motion`.
- Keine WebGL/3D-Bibliothek. Das Hero-Video ist dekorativ, stumm und ohne Steuerung.

## Barrierefreiheit

WCAG 2.2 AA als Zielstandard: Landmarken, genau eine H1/Seite, Fokus-Sichtbarkeit,
Skip-Link, ausreichende Kontraste, Tastaturbedienbarkeit, Live-Regionen, keine Info nur
über Farbe, Touch-Ziele ≥ 48 px (Schaltflächen `min-height: 52px`).

## Marke

Wortmarke „KERNSEITE.“ mit Punkt in Cyan; reduziertes K-Monogramm als Favicon
(`public/favicon.svg`).
