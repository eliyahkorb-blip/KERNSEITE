# Asset-Shotlist – benötigte echte Motive

Diese Liste beschreibt die echten Bilder/Videos, die die aktuellen, klar gekennzeichneten
Platzhalter ersetzen. Bis dahin bleibt die Seite ohne Stockfotos, ohne KI-Porträts und ohne
erfundene Teammitglieder. Optionale Medien blockieren weder `build:ci`/`build:preview` noch CI.

**Format-Regeln:** Auslieferung als **WebP/AVIF** (mit Fallback), responsive `srcset`/`sizes`,
`width`/`height` im Markup, `loading="lazy"` unterhalb des sichtbaren Bereichs (Hero = `eager`),
aussagekräftige Alt-Texte. Keine erfundenen Ergebnisse/Prozentwerte. Keine Cookie-Banner oder
Browserleisten im Screenshot; sauber und professionell zuschneiden.

## Referenz-Screenshots (ersetzen die aktuellen Platzhalter)

| Motiv                    | Empf. Größe (px)         | Seitenverhältnis | Verwendungsort                                                | Dateiname (Ziel)                                                    | Alt-Text-Vorschlag                                                          |
| ------------------------ | ------------------------ | ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Kaya Döner – Desktop     | 1440×900 (@2× 2880×1800) | 16:10            | Start (Ausgewählte Arbeiten), /arbeiten/, Projektseite (Hero) | `public/assets/references/kaya-doener-desktop.webp` (+ `.avif`)     | „Startseite der Website von Kaya Döner Himmelstadt in der Desktop-Ansicht.“ |
| Kaya Döner – Mobil       | 390×780 (@2× 780×1560)   | 1:2              | Projektseite (Darstellung)                                    | `public/assets/references/kaya-doener-mobile.webp` (+ `.avif`)      | „Mobile Ansicht der Website von Kaya Döner Himmelstadt.“                    |
| Kinderkörbchen – Desktop | 1440×900 (@2× 2880×1800) | 16:10            | Start, /arbeiten/, Projektseite (Hero)                        | `public/assets/references/kinderkoerbchen-desktop.webp` (+ `.avif`) | „Startseite der Website von Kinderkörbchen in der Desktop-Ansicht.“         |
| Kinderkörbchen – Mobil   | 390×780 (@2× 780×1560)   | 1:2              | Projektseite (Darstellung)                                    | `public/assets/references/kinderkoerbchen-mobile.webp` (+ `.avif`)  | „Mobile Ansicht der Website von Kinderkörbchen.“                            |

> Aktueller Stand: klar gekennzeichnete SVG-Platzhalter unter `public/assets/references/`.
> Die Live-Sites konnten im Build-Environment nicht abgerufen werden (Egress-Policy); die echten
> Screenshots werden extern erstellt und ersetzt. Danach im Datenmodell `verified: true` setzen
> (`src/config/cases.ts`), damit die Platzhalter-Kennzeichnung entfällt.

## Personen / Team

| Motiv                             | Empf. Größe (px) | Seitenverhältnis | Verwendungsort                                | Dateiname (Ziel)                                      | Alt-Text-Vorschlag                                     |
| --------------------------------- | ---------------- | ---------------- | --------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| Porträt Eliyah Korb               | 1000×1250        | 4:5              | Agentur (Person), optional Kontakt/Startseite | `public/assets/team/eliyah-portrait.webp` (+ `.avif`) | „Eliyah Korb, Gründer von KERNSEITE.“                  |
| Arbeitssituation / Studio         | 1600×1067        | 3:2              | Agentur, Prozess                              | `public/assets/team/eliyah-arbeitssituation.webp`     | „Eliyah Korb bei der Arbeit an einem Website-Projekt.“ |
| Partnerporträts (Video/Social/KI) | 1000×1250        | 4:5              | Agentur (Rollen) – **nur mit Freigabe**       | `public/assets/team/partner-<name>.webp`              | „<Name>, <Rolle> im Partnernetzwerk von KERNSEITE.“    |

> Aktueller Stand: neutraler, klar gekennzeichneter Porträt-Platzhalter
> (`public/assets/team/eliyah-portrait.svg`). Keine Stock-/KI-Porträts, keine erfundenen Personen.

## Branchen- & Kundensituationen (optional, später)

| Motiv                | Empf. Größe (px) | Seitenverhältnis | Verwendungsort                | Dateiname (Ziel)                       | Alt-Text-Vorschlag                                   |
| -------------------- | ---------------- | ---------------- | ----------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Handwerk / Baustelle | 1600×1067        | 3:2              | /branchen/handwerk/           | `public/assets/branchen/handwerk.webp` | „Team eines Handwerksbetriebs auf einer Baustelle.“  |
| Praxis / Empfang     | 1600×1067        | 3:2              | /branchen/zahnarztpraxen/     | `public/assets/branchen/praxis.webp`   | „Freundlicher Empfangsbereich einer Zahnarztpraxis.“ |
| Gastronomie / Hotel  | 1600×1067        | 3:2              | /branchen/gastronomie-hotels/ | `public/assets/branchen/gastro.webp`   | „Atmosphäre eines gastronomischen Betriebs.“         |

## Social / Open Graph & Video

| Motiv                   | Empf. Größe (px) | Seitenverhältnis | Verwendungsort            | Dateiname (Ziel)                                               | Alt-Text-Vorschlag            |
| ----------------------- | ---------------- | ---------------- | ------------------------- | -------------------------------------------------------------- | ----------------------------- |
| Finales OG-/Social-Bild | 1200×630         | 1.91:1           | Meta (Open Graph/Twitter) | `public/assets/og/kernseite-og.png` (oder `.jpg`)              | – (Meta-Bild, kein Alt nötig) |
| Kurzer Website-Clip     | 1920×1080        | 16:9             | optional, Detailseiten    | `public/assets/video/…` (Click-to-load, kein Autoplay mit Ton) | „Kurzvorschau …“              |

> Aktueller Stand: OG-Bild als SVG-Platzhalter (`public/assets/og/kernseite-og.svg`). Ein final
> gerastertes 1200×630-Bild (PNG/JPG) empfiehlt sich, falls einzelne Plattformen SVG-OG nicht rendern.

## Ablage & Pflege

- Neue Dateien unter `public/assets/**` ablegen (Themen-Unterordner nutzen).
- Jedes neue Asset zusätzlich in `docs/ASSET_LICENSES.md` mit Quelle/Lizenz dokumentieren.
- Nach dem Einsetzen echter Referenz-Screenshots `verified: true` in `src/config/cases.ts` setzen.
