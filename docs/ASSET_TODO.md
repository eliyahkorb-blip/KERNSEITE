# Offene Bildbeschaffung – Branchenmotive

Fünf Branchenmotive fehlen. Sie konnten in dieser Entwicklungsumgebung nicht
beschafft werden, weil der ausgehende Netzwerkzugriff auf Unsplash gesperrt ist.

## Warum die Bilder fehlen

Der Download wurde am 2026-07-26 mit vier Werkzeugen über sechs Unsplash-Hosts
versucht. Jeder Versuch wurde vom vorgeschalteten Egress-Proxy abgewiesen –
nicht von Unsplash selbst:

| # | Werkzeug | Ziel | Ergebnis |
| - | -------- | ---- | -------- |
| 1 | `curl -L` | `https://unsplash.com/` | `curl: (56) CONNECT tunnel failed, response 403` |
| 2 | `curl -L` | `https://unsplash.com/s/photos/craftsman-workshop` | `curl: (56) CONNECT tunnel failed, response 403` |
| 3 | `curl -L` | `https://images.unsplash.com/photo-…` | `curl: (56) CONNECT tunnel failed, response 403` |
| 4 | `curl -L` | `https://source.unsplash.com/1600x1200/?workshop` | `curl: (56) CONNECT tunnel failed, response 403` |
| 5 | `curl -L` | `https://api.unsplash.com/photos/random` | `curl: (56) CONNECT tunnel failed, response 403` |
| 6 | `wget --max-redirect=10` | `https://unsplash.com/photos/<id>/download?force=true` | Abbruch, 0 Byte |
| 7 | `fetch()` (Node 22) | `https://unsplash.com/` | HTTP 403 vom Proxy |
| 8 | `fetch()` (Node 22) | `https://images.unsplash.com/photo-…` | HTTP 403 vom Proxy |
| 9 | `fetch()` (Node 22) | `https://source.unsplash.com/…` | HTTP 403 vom Proxy |

Proxy-Status (`$HTTPS_PROXY/__agentproxy/status`): `enabled: true`,
`selective: false`. Die `noProxy`-Liste enthält ausschließlich Paketregistries
(npm, PyPI, crates.io, Go-Proxy) – keine Bildquellen.

**Wichtig:** Weil unsplash.com nicht erreichbar ist, konnten auch keine
konkreten Fotos ausgewählt werden. Es stehen deshalb hier bewusst **keine
Photo-IDs und keine Fotografennamen** – erfundene Angaben wären schlimmer als
gar keine. Was feststeht, ist das gesuchte Motiv je Branche.

## Was fehlt

Ablage der Originaldatei: `public/assets/branchen/source/<slug>.jpg`

| Branche | Datei | Gesuchtes Motiv |
| ------- | ----- | --------------- |
| Handwerk | `handwerk.jpg` | Echter Handwerksbetrieb: Werkstatt, Schreinerei, Elektro, Metallbau, arbeitende Fachkraft in authentischer Umgebung |
| Zahnarztpraxen & medizinische Praxen | `zahnarztpraxen.jpg` | Helle moderne Praxis, ruhiges Gespräch zwischen Personal und Patient |
| Gastronomie & Hotels | `gastronomie-hotels.jpg` | Küchenteam bei echter Arbeit, Restaurantküche, Gastfreundschaft, Hotelempfang |
| Lokale Dienstleister | `lokale-dienstleister.jpg` | Kleiner Betrieb, Beratung, persönlicher Service, regionale Nähe |
| B2B-Mittelstand | `b2b-mittelstand.jpg` | Mittelständische Fertigung, technisches Team, Produktionsbetrieb, Maschinenbau |

### Suchbegriffe

- **Handwerk:** `craftsman workshop`, `carpenter workshop`, `German tradesman`,
  `electrician working`, `metal workshop`, `construction craftsman`
- **Praxen:** `dentist patient modern clinic`, `dental practice interior`,
  `doctor patient consultation`, `modern medical practice`
- **Gastronomie:** `restaurant kitchen chef`, `hospitality team`,
  `modern restaurant interior`, `hotel lobby`, `boutique hotel interior`
- **Lokale Dienstleister:** `small business owner customer`,
  `local business service`, `consultant client meeting`, `local shop owner`
- **B2B:** `industrial manufacturing team`, `engineers factory`,
  `manufacturing company`, `mechanical engineering factory`

### Nicht verwenden

Gestellte Handschlag-Szenen, KI-generierte Menschen, Nahaufnahmen von
Behandlungen, einzelne Teller auf weißem Grund, Skylines, Hochhausfassaden,
generische Laptop-Schreibtische, fremde Marken und Logos.

## Einsetzen

1. Foto auf <https://unsplash.com/> auswählen – nur kostenlose Bilder,
   **kein Unsplash+**, keine KI-Bilder, keine fremden Logos.
2. Als `public/assets/branchen/source/<slug>.jpg` ablegen.
3. `pnpm assets:branchen` ausführen. Das Skript beschneidet mittig auf 4:3 und
   schreibt je Motiv 640/960/1280/1600 px als WebP (und AVIF, sofern der
   Encoder vorhanden ist).
4. Fotograf, Photo-ID, Unsplash-Seitenadresse, Einsatzort, Download-Datum und
   Lizenzquelle in `docs/ASSET_LICENSES.md` eintragen.
5. Zeile aus dieser Datei entfernen.
6. `pnpm build:ci && pnpm qa && pnpm test:e2e` – der Test
   `tests/e2e/branchen.spec.ts` prüft, dass alle Motive dasselbe
   Seitenverhältnis besitzen und tatsächlich laden.

## Bis dahin

Das Branchenraster rendert die Einträge **ohne Bildfläche**. Es gibt keine
grauen Platzhalter, keine schwarzen Ersatzlinien und keine zweckentfremdeten
Kunden-Screenshots. Alle fünf Einträge haben denselben Aufbau, damit das
Raster auch ohne Bilder ruhig und gleichmäßig bleibt.
