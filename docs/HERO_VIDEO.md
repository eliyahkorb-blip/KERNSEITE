# Hero-Video – Ablage und Anforderungen

Die Hero-Komponente (`src/components/HeroCinematic.astro`) erwartet die folgenden
Dateien **in diesem Ordner**. Solange das finale Video fehlt, zeigt der Hero
automatisch das Posterbild – die Seite bleibt vollständig funktionsfähig.

| Datei                        | Zweck                          | Status                        |
| ---------------------------- | ------------------------------ | ----------------------------- |
| `hero-kernseite.webm`        | Hauptformat (VP9/AV1)          | **fehlt – bitte ergänzen**    |
| `hero-kernseite.mp4`         | Fallback (H.264)               | **fehlt – bitte ergänzen**    |
| `hero-kernseite-poster.webp` | Posterbild / statische Fassung  | **fehlt – bitte ergänzen**    |
| `hero-kernseite-poster.svg`  | Platzhalter-Poster              | vorhanden (klar gekennzeichnet) |

## Motiv

Cineastische, ruhige Szene: ein stilvoll gekleideter Mann (guter Anzug) in
Verbindung mit einem alten Macintosh-/Retro-Computer. Der Computer darf visuell
prominent sein. Stimmung: edel, leicht mystisch, ikonisch – **nicht** kitschig,
**nicht** Sci-Fi, **nicht** Hacker-Ästhetik.

## Technische Anforderungen

- Seitenverhältnis 16:9, mindestens 1920×1080 (besser 2560×1440)
- Länge 8–14 s, **nahtlos loopbar** (Anfang und Ende identisch)
- **Kein Ton** (die Tonspur bitte vor dem Export entfernen – spart Datenvolumen)
- Ruhige Kamera: leichter Push-in oder Standbild mit minimaler Bewegung.
  Keine schnellen Schnitte, kein Wackeln, keine harten Blenden.
- Zielgröße: **WebM ≤ 2,5 MB**, MP4 ≤ 4 MB (Hero lädt mit `preload="auto"`)
- Farbstimmung eher entsättigt/warm-neutral; das Cyan kommt vom Bildschirm

Beispiel für den Export (ffmpeg):

```bash
# WebM (VP9), ohne Ton
ffmpeg -i quelle.mov -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf scale=1920:-2 hero-kernseite.webm
# MP4 (H.264), ohne Ton
ffmpeg -i quelle.mov -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -vf scale=1920:-2 hero-kernseite.mp4
# Poster aus dem ersten Frame
ffmpeg -i quelle.mov -frames:v 1 -vf scale=1920:-2 hero-kernseite-poster.webp
```

Danach in `src/components/HeroCinematic.astro` die Zeile
`const poster = '/assets/video/hero-kernseite-poster.svg';`
auf `…-poster.webp` umstellen.

## Bildschirm-Overlay justieren

Liegt das Cyan **nicht** schon im Video auf dem Monitor, blendet die Komponente
eine eigene Bildschirmfläche darüber. Ihre Position wird ausschließlich über fünf
Variablen in `HeroCinematic.astro` (Selektor `.hero__screen`) gesteuert:

```css
--screen-x: 63%; /* linke Kante der Bildschirmfläche */
--screen-y: 41%; /* obere Kante */
--screen-w: 15%; /* Breite */
--screen-h: 20%; /* Höhe */
--screen-skew: -6deg; /* perspektivische Neigung (rotateY) */
--screen-rotate: -1.5deg; /* leichte Bildrotation */
```

Vorgehen: Video einsetzen, Seite öffnen, die fünf Werte anpassen, bis die Fläche
deckungsgleich auf dem Monitor sitzt. Für Mobil gibt es einen eigenen Satz Werte
im Media-Query `max-width: 63.99rem`.

Ist das Cyan bereits im Video enthalten, kann das Overlay entfallen: dazu in der
Komponente den Block `<div class="hero__screen" …>` entfernen.
