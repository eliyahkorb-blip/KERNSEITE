# Hero-Video – CRT-Head-Figur

Der Hero zeigt eine **TV-Head-/CRT-Head-Figur**: menschlicher Körper im hochwertigen
Anzug, der Kopf ist **vollständig** durch einen alten Röhrenmonitor ersetzt. Der
Monitor-Kopf ist der zentrale Wiedererkennungswert der Marke.

## Aktueller Stand

Solange kein Video vorliegt, rendert `src/components/HeroFigure.astro` diese Figur
als ruhige, gezeichnete Szene (SVG) – inklusive Cyan-Bildschirm, Scanlines,
Helligkeitsatmen und wechselnden Begriffen. Die Seite ist damit vollständig
funktionsfähig; das Video ersetzt die Zeichnung später ohne weitere Änderungen.

| Datei                        | Zweck                          | Status                     |
| ---------------------------- | ------------------------------ | -------------------------- |
| `hero-kernseite.webm`        | Hauptformat (VP9/AV1)          | **fehlt – bitte ergänzen** |
| `hero-kernseite.mp4`         | Fallback (H.264)               | **fehlt – bitte ergänzen** |
| `hero-kernseite-poster.webp` | Posterbild / statische Fassung | **fehlt – bitte ergänzen** |

Ablage: `public/assets/video/`. Die Komponente prüft beim Build, ob die Dateien
existieren, und bindet sie erst dann ein – es entstehen keine 404-Requests.

---

## Motiv (verbindlich)

**Die Figur:**

- realistischer menschlicher Körper, Brust-/Oberkörper-Ausschnitt
- hochwertiger, gut sitzender Anzug, elegantes Styling
- **statt eines Kopfes** ein vintage Röhrenmonitor (beige-graues Gehäuse)
- der Monitor **ersetzt** den Kopf vollständig und sitzt direkt auf dem Hals/den Schultern

**Ausdrücklich nicht:**

- Mensch **neben** einem Computer
- normale menschliche Kopf-Silhouette
- Roboterkörper, Cyborg, futuristische KI-Figur
- Hacker-Ästhetik, Matrix-Code, Cyberpunk, Neon-Overkill
- cartoonhafte oder verspielte Darstellung

**Der Monitor:**

- vintage beige-graues Kunststoffgehäuse, leichte Alterung und Materialtextur
- realistische Glasscheibe mit leichter Wölbung und dezenten Reflexionen
- glaubwürdige physische Tiefe und Proportion (Gehäusetiefe sichtbar)
- Bildschirm leuchtet weich in **KERNSEITE-Cyan `#00E3F2`**
- feine Scanlines, sanftes Phosphor-Glühen, minimales Helligkeitsatmen
- **kein** aggressiver Glitch, keine starke Verzerrung, kein Rauschen

**Auf dem Bildschirm:** das Wort `KERNSEITE`, minimal und elegant gesetzt.
Optional weiche Übergänge zu `WEBSITE`, `GOOGLE`, `SEO / GEO`, `VIDEO`, `SOCIAL`,
`SYSTEME`.

**Szene und Komposition:**

- neutrale, edle Umgebung, ruhiger Hintergrund
- Figur **rechts bzw. rechts-mittig**
- **linke Bildhälfte bewusst frei** für die Website-Typografie
- Licht ruhig und weich; das Cyan kommt ausschließlich vom Bildschirm

**Bewegung:** nur ruhiges Idle – sanftes Atmen, minimale Körperbewegung, feines
Bildschirmflackern. Kein Sprechen, keine Gestik, keine dramatische Kamerafahrt.

---

## Prompt zum Kopieren (Video-Tools)

Für Runway, Kling, Veo, Sora o. ä. – bewusst englisch, weil die Modelle darauf
besser reagieren:

```text
Cinematic medium shot of a man in a impeccably tailored dark charcoal suit,
standing calmly. Instead of a human head, he has a vintage 1980s beige CRT
computer monitor as his head — the monitor completely replaces the head and sits
directly on his shoulders. The monitor casing is aged beige-grey plastic with
subtle scratches and realistic material texture, believable physical depth and
proportions, curved glass screen with soft reflections.

The screen glows softly in a turquoise cyan colour (#00E3F2) and displays the
single word "KERNSEITE" in a minimal monospaced typeface. Gentle analog CRT
flicker, fine scanlines, soft phosphor bloom, subtle brightness breathing.

Composition: the figure is positioned on the RIGHT side of the frame, the LEFT
half of the frame is intentionally empty negative space. Neutral, refined,
softly lit interior. Muted desaturated colour palette — the only saturated
colour is the cyan screen glow.

Motion: extremely subtle idle only — gentle breathing, tiny shoulder movement,
soft screen flicker. No talking, no gestures, no camera movement. Locked-off
camera.

Style: editorial, premium, realistic, calm, slightly surreal but believable.
NOT cartoon, NOT sci-fi, NOT cyberpunk, NOT a robot body, NOT a hacker
aesthetic, no matrix code, no glitch effects, no neon.

Seamless loop, 8 seconds, 16:9, 1920x1080, no audio.
```

**Negativ-Prompt (falls das Tool eines unterstützt):**

```text
human head, face, visible eyes, robot body, android, cyborg, mecha, sci-fi armour,
cyberpunk, neon lights, matrix code, glitch, distortion, noise, cartoon, anime,
3d render look, plastic skin, extra limbs, deformed hands, text artifacts,
watermark, logo, busy background, cluttered scene
```

### Alternative ohne Video-KI

Fotografisch umsetzbar: Person im Anzug fotografieren/filmen, Kopf in der Post
durch einen realen Röhrenmonitor ersetzen (Compositing). Der Bildschirminhalt
wird dabei ohnehin separat eingesetzt – das ergibt die beste Kontrolle über Farbe
und Schrift. Ein realer alter Monitor als Requisite ist Gold wert.

---

## Technische Anforderungen

- Seitenverhältnis 16:9, mindestens 1920×1080 (besser 2560×1440)
- Länge 6–8 s, **nahtlos loopbar** (erster und letzter Frame identisch)
- **Kein Ton** – Tonspur vor dem Export entfernen (spart Datenvolumen)
- Ruhige, feststehende Kamera
- Zielgröße: **WebM ≤ 2,5 MB**, MP4 ≤ 4 MB (der Hero lädt mit `preload="auto"`)
- Farbstimmung entsättigt/neutral; gesättigt ist nur das Bildschirm-Cyan

```bash
# WebM (VP9), ohne Ton
ffmpeg -i quelle.mov -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf scale=1920:-2 hero-kernseite.webm
# MP4 (H.264), ohne Ton
ffmpeg -i quelle.mov -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -vf scale=1920:-2 hero-kernseite.mp4
# Poster aus dem ersten Frame
ffmpeg -i quelle.mov -frames:v 1 -vf scale=1920:-2 hero-kernseite-poster.webp
```

Danach die drei Dateien nach `public/assets/video/` legen – mehr ist nicht nötig.
Die Komponente erkennt sie automatisch und blendet die gezeichnete Figur aus.

---

## Bildschirm-Overlay justieren

Liegt das Cyan **nicht** schon im gefilmten Material auf dem Monitor, legt die
Komponente eine eigene Bildschirmfläche darüber (inkl. Wortwechsel und Scanlines).
Ihre Position wird über fünf Variablen in `HeroCinematic.astro` gesteuert
(Selektor `.hero`):

```css
--screen-x: 62%; /* linke Kante der Bildschirmfläche */
--screen-y: 34%; /* obere Kante */
--screen-w: 19%; /* Breite */
--screen-h: 27%; /* Höhe */
--screen-skew: -7deg; /* perspektivische Neigung (rotateY) */
--screen-rotate: -1deg; /* leichte Bildrotation */
```

Vorgehen: Video einsetzen, Seite öffnen, die Werte anpassen, bis die Fläche
deckungsgleich auf dem Monitor sitzt. Für Mobil gibt es einen eigenen Satz Werte
im Media-Query `max-width: 63.99rem`.

Zeigt das Video den Bildschirminhalt bereits korrekt, kann das Overlay entfallen:
dazu in `HeroCinematic.astro` den Block `<div class="hero__screen" …>` entfernen.
