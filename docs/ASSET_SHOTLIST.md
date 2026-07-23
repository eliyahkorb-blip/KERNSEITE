# Asset-Shotlist – benötigte echte Motive

Diese Liste beschreibt die echten Bilder/Videos, die die aktuellen, bewusst gestalteten
Platzhalter (CSS/SVG-Mockups) später ersetzen sollen. Bis dahin bleibt die Seite ohne
Stockbilder und ohne erfundene Referenzen.

## Priorität hoch

- [ ] **Portrait Eliyah Korb** – hochwertig, sympathisch (Agentur-/Kontaktseite,
      ggf. Startseite „Netzwerk“). Quer- und Hochformat.
- [ ] **Arbeitssituation / Studio** – Eliyah bei der Arbeit (Agentur, Prozess).
- [ ] **Finales OG-Bild** – 1200×630 PNG/JPG (ersetzt `assets/og/kernseite-og.svg`,
      falls SVG-OG bei einzelnen Plattformen nicht rendert).

## Priorität mittel (sobald echte Projekte vorliegen)

- [ ] **Screenshots echter Kundenprojekte** (ersetzen die Konzeptstudien-Mockups).
- [ ] **Branchenmotive**: Handwerk/Baustelle, Zahnarzt-/Praxissituation, Gastronomie/Hotel,
      lokale Dienstleistung, B2B/Produktion – jeweils echt, mit Freigabe.
- [ ] **Partnerportraits** (Video, Social, KI) – nur mit ausdrücklicher Freigabe.

## Formate & Technik

- Auslieferung als **AVIF/WebP mit Fallback**, responsive `srcset`/`sizes`.
- Wichtige Visuals priorisieren (Preload), restliche `loading="lazy"`.
- Feste Seitenverhältnisse reservieren (CLS vermeiden).
- Videos: datenschutzfreundlich, kein Autoplay mit Ton, Click-to-load.

## Ablageort

`public/assets/` (nach Themen unterordnen, z. B. `assets/team/`, `assets/cases/`).
Jedes neue Asset in `docs/ASSET_LICENSES.md` mit Quelle/Lizenz dokumentieren.
