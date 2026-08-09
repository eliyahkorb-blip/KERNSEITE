# Bildplan – KERNSEITE

Dieser Plan legt fest, **wo** welches Motiv steht, **welcher Bildtyp** gemeint ist,
**welches Seitenverhältnis**, **welcher Dateiname** und **welcher Alt-Text**. Er gilt
als Auftragsliste für die Bildbeschaffung.

## Grundregeln für die Bildsprache

Die Bilder tragen die Haltung der Seite: ruhig, hochwertig, real.

**Erwünscht:** clean, warm, editorial, echt, ungekünstelt, minimal, vertrauenswürdig.
Natürliches Licht, ruhige Bildausschnitte, echte Arbeitssituationen, viel Raum,
zurückhaltende Farbigkeit (passend zu Beige-Grau/Off-White + Cyan-Akzent).

**Nicht erwünscht:**

- Stock-Klischees (Handschlag vor Glasfassade, Team mit erhobenen Daumen)
- inszenierte Lach-Meetings, „Fake-Office-Glück“
- offensichtlich KI-generierte Menschen (glatte Haut, seltsame Hände, Fantasie-Logos)
- futuristische Tech-Bilder, Platinen, Datenströme, Hologramme, blaue Neon-Optik
- harte Farbfilter, starke Vignetten, HDR-Look

**Technisch:** AVIF oder WebP, `srcset` in 2 Breiten (1×/2×), Qualität ~72–80,
Farbprofil sRGB. Immer `width`/`height` setzen (kein Layout Shift). Alles liegt
**lokal** unter `public/assets/` – keine Hotlinks, keine externen CDNs.

**Rechtliches:** Für jedes Bild Quelle und Lizenz in `docs/ASSET_LICENSES.md`
eintragen. Bei Unsplash: Fotograf:in + Bild-URL dokumentieren. Bei Personenfotos
Einwilligung einholen (siehe `docs/LEGAL_TODO.md`). Kundenfotos nur mit Freigabe.

---

## 1. Hero – bewegte Szene

| Feld             | Wert                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| Ort              | Startseite, `src/components/HeroCinematic.astro`                                 |
| Typ              | Loop-Video (stumm) + Posterbild                                                  |
| Motiv            | Stilvoller Mann im guten Anzug, cineastisch, mit altem Macintosh-/Retro-Computer |
| Stimmung         | edel, ruhig, leicht mystisch/ikonisch – nicht kitschig, nicht Sci-Fi             |
| Seitenverhältnis | 16:9, min. 1920×1080                                                             |
| Dateien          | `assets/video/hero-kernseite.webm`, `.mp4`, `hero-kernseite-poster.webp`         |
| Alt-Text         | entfällt (dekorativ, `aria-hidden`) – Aussage steht als Text daneben             |
| Status           | **offen** – solange nichts vorliegt, zeigt der Hero eine gezeichnete Ersatzszene |

Details zu Export, Dateigrößen und zur Justage der Cyan-Bildschirmfläche:
siehe `docs/HERO_VIDEO.md`.

---

## 2. Porträt Eliyah Korb

| Feld             | Wert                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| Ort              | `/agentur/`, optional Kontaktseite                                         |
| Typ              | Business-Porträt, natürliches Licht, ruhiger Hintergrund                   |
| Motiv            | Halbnah, direkter Blick, freundlich-sachlich. Kein Studio-Weißhintergrund. |
| Seitenverhältnis | 4:5 (hoch), min. 1200×1500                                                 |
| Datei            | `assets/team/eliyah-portrait.webp`                                         |
| Alt-Text         | „Eliyah Korb, Inhaber von KERNSEITE, in seinem Arbeitsumfeld in Würzburg.“ |
| Status           | **offen** – aktuell klar gekennzeichneter Platzhalter (SVG)                |

---

## 3. Referenz Kaya Döner Himmelstadt

| Feld             | Wert                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| Ort              | Startseite (Arbeiten), `/arbeiten/`, `/arbeiten/kaya-doener-himmelstadt/`           |
| Typ              | **Screenshot der Live-Website** (Desktop + Mobil)                                   |
| Seitenverhältnis | Desktop 16:10 (1440×900), Mobil 390×780                                             |
| Dateien          | `assets/references/kaya-doener-desktop.webp`, `…-mobile.webp`                       |
| Alt-Text Desktop | „Startseite der Website von Kaya Döner Himmelstadt mit Speisekarte und Kontaktweg.“ |
| Alt-Text Mobil   | „Mobile Ansicht der Website von Kaya Döner Himmelstadt.“                            |
| Status           | **offen** – aktuell Gestaltungsvorschau (SVG), sichtbar gekennzeichnet              |

Ergänzend (optional, nur mit Freigabe des Betriebs): eine ruhige, hochwertige
Gastronomie-Aufnahme (Theke, Zubereitung, Detail) im Format 3:2 als Stimmungsbild
für die Detailseite – **kein** generisches Food-Stock.

---

## 4. Referenz Anna-Lena’s Kinderkörbchen

| Feld             | Wert                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| Ort              | Startseite (Arbeiten), `/arbeiten/`, `/arbeiten/kinderkoerbchen/`                  |
| Typ              | **Screenshot der Live-Website** (Desktop + Mobil)                                  |
| Seitenverhältnis | Desktop 16:10 (1440×900), Mobil 390×780                                            |
| Dateien          | `assets/references/kinderkoerbchen-desktop.webp`, `…-mobile.webp`                  |
| Alt-Text Desktop | „Startseite der Website von Anna-Lena’s Kinderkörbchen mit Begrüßung und Angebot.“ |
| Alt-Text Mobil   | „Mobile Ansicht der Website von Anna-Lena’s Kinderkörbchen.“                       |
| Status           | **offen** – aktuell Gestaltungsvorschau (SVG), sichtbar gekennzeichnet             |

Ergänzend (nur mit ausdrücklicher Einwilligung, **keine erkennbaren Kinder** ohne
schriftliche Freigabe der Erziehungsberechtigten): warme Detailaufnahmen von Raum,
Garten oder Material im Format 3:2.

---

## 5. Branchenseiten – Stimmungsbilder

Je Branchenseite **ein** ruhiges, reales Motiv. Kein Symbolbild-Kitsch.

| Seite                             | Motiv                                                   | Datei                                 | Alt-Text                                                   |
| --------------------------------- | ------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `/branchen/handwerk/`             | Werkzeug/Hände bei echter Arbeit, Werkstattdetail       | `assets/branchen/handwerk.webp`       | „Detailaufnahme handwerklicher Arbeit an einem Werkstück.“ |
| `/branchen/zahnarztpraxen/`       | Helle, ruhige Praxisarchitektur, keine Behandlungsszene | `assets/branchen/zahnarztpraxen.webp` | „Heller, ruhiger Empfangsbereich einer Praxis.“            |
| `/branchen/gastronomie-hotels/`   | Warmer Gastraum oder Zubereitungsdetail                 | `assets/branchen/gastronomie.webp`    | „Warm beleuchteter Gastraum mit gedeckten Tischen.“        |
| `/branchen/lokale-dienstleister/` | Ruhige Beratungssituation, zwei Personen am Tisch       | `assets/branchen/dienstleister.webp`  | „Beratungsgespräch an einem Tisch in ruhiger Umgebung.“    |
| `/branchen/b2b-mittelstand/`      | Reduzierte Produktions-/Büroszene, Materialien          | `assets/branchen/b2b.webp`            | „Blick in eine aufgeräumte Fertigungs- oder Büroumgebung.“ |

Seitenverhältnis jeweils **3:2 quer**, min. 1600×1067.

---

## 6. Weitere Flächen

| Ort                        | Motiv                                                     | Datei                          | Seitenverhältnis |
| -------------------------- | --------------------------------------------------------- | ------------------------------ | ---------------- |
| `/agentur/` Arbeitsumfeld  | Reduzierter Workspace, Materialien, Notizen – ohne Person | `assets/studio/workspace.webp` | 3:2              |
| `/prozess/` Zwischenfläche | Hände bei Skizze/Planung, ruhiger Ausschnitt              | `assets/studio/prozess.webp`   | 3:2              |
| Google-Profil-Sektion      | _bewusst kein Foto_ – schematische Darstellung im Code    | –                              | –                |
| Open-Graph-Bild            | Wortmarke auf dunkler Fläche (vorhanden)                  | `assets/og/kernseite-og.svg`   | 1200×630         |

---

## Stand der Bildbeschaffung (Unsplash blockiert)

Der ausgehende Netzwerkzugriff dieser Entwicklungsumgebung lässt nur
Paketregistries zu. Der Download der geplanten Unsplash-Motive wurde am
2026-07-26 mit vier unabhängigen Methoden versucht und jedes Mal auf
Netzwerkebene abgewiesen – nicht von Unsplash, sondern vom vorgeschalteten
Egress-Proxy:

| Methode             | Ziel                                                   | Ergebnis                                         |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `curl -L`           | `https://unsplash.com/photos/<id>/download?force=true` | `curl: (56) CONNECT tunnel failed, response 403` |
| `curl -L`           | `https://images.unsplash.com/photo-…`                  | `curl: (56) CONNECT tunnel failed, response 403` |
| `wget -O`           | `https://images.unsplash.com/photo-…`                  | Abbruch, 0 Byte geschrieben                      |
| `fetch()` (Node 22) | `https://images.unsplash.com/photo-…`                  | `HTTP 403` vom Proxy                             |

Proxy-Status zur Kontrolle (`$HTTPS_PROXY/__agentproxy/status`):
`enabled: true`, `selective: false`; die `noProxy`-Liste enthält ausschließlich
Paketregistries (npm, PyPI, crates.io, Go-Proxy) – keine Bildquellen.

**Konsequenz:** Es wurden **keine** Ersatzbilder erfunden, generiert oder aus
fremden Quellen nachgebaut, und es steht **kein leeres graues Feld** auf der Seite.
Flächen ohne vorliegendes Bild werden nicht gerendert (`existsSync`-Prüfung im
Build). Stattdessen arbeitet die Seite mit vorhandenem Echtmaterial in wechselnden
Formaten:

| Datei                                                            | Format     | Herkunft                          |
| ---------------------------------------------------------------- | ---------- | --------------------------------- |
| `assets/video/hero-kernseite-final*.webp`                        | 16:9 / 9:8 | eigenes CRT-Motiv                 |
| `assets/references/kernseite-crt-square.webp`                    | 1:1        | eigenes CRT-Motiv, Ausschnitt     |
| `assets/references/kaya-doener-desktop*.webp`                    | 16:9       | Screenshot Projekt Kaya Döner     |
| `assets/references/kaya-doener-wide.webp`                        | 21:9       | Ausschnitt desselben Screenshots  |
| `assets/branchen/gastronomie-hotels.webp`                        | 2:1        | Ausschnitt desselben Screenshots  |
| `assets/references/kinderkoerbchen-desktop*.webp`                | 16:9       | Screenshot Projekt Kinderkörbchen |
| `assets/branchen/lokale-dienstleister.webp`                      | 4:5        | Ausschnitt desselben Screenshots  |
| `assets/references/google-business-profile-kinderkoerbchen.webp` | 4:5        | echtes Google-Profil              |

Die Ausschnitte erzeugt `python3 scripts/build-reference-crops.py` reproduzierbar
aus `public/assets/references/source/`. Sobald echte Motive vorliegen, ersetzen sie
die Ausschnitte an denselben Dateinamen.

**Offen bleiben** die Branchenbilder für Handwerk, Zahnarztpraxen und
B2B-Mittelstand sowie Studio-/Prozessbilder und ein echtes Porträt. Diese Flächen
zeigen derzeit reine Typografie.

---

## Suchbegriffe für Unsplash

Die folgenden Suchen liefern erfahrungsgemäß Motive, die zur Haltung passen.
Immer prüfen: wirkt es echt? Ist es ruhig? Passt die Farbtemperatur?

- Porträt/Unternehmer: `business portrait natural light`, `craftsman portrait workshop`,
  `small business owner candid`
- Interior/Office: `minimal office interior warm`, `quiet workspace daylight`,
  `architecture interior neutral`
- Arbeitsdetails: `hands working craft`, `workshop tools detail`, `sketching notebook desk`
- Gastronomie: `restaurant interior warm light`, `kitchen preparation hands`
- Familie/Betreuung: `children playing outdoors natural`, `warm home interior kids`
  (→ nur ohne erkennbare Gesichter verwenden, wenn keine Freigabe vorliegt)
- Material/Branding: `paper texture neutral`, `brand stationery minimal`

**Vermeiden:** `technology background`, `digital transformation`, `network connection`,
`ai brain`, `futuristic` – genau diese Ergebnisse erzeugen den KI-Look, den die Seite
nicht haben soll.

---

## Ablauf beim Einsetzen

1. Bild in der Zielgröße exportieren (AVIF/WebP), Dateiname exakt wie oben.
2. Datei nach `public/assets/…` legen.
3. Alt-Text aus dieser Tabelle übernehmen (bei Bedarf präzisieren – Alt-Text
   beschreibt, was zu sehen ist, nicht was es bedeuten soll).
4. Quelle/Lizenz in `docs/ASSET_LICENSES.md` ergänzen.
5. Bei Referenz-Screenshots zusätzlich in `src/config/cases.ts` `verified: true`
   setzen, sobald Live-URL und Screenshot geprüft sind – dann verschwindet der
   Hinweis „Gestaltungsvorschau – finaler Screenshot folgt“ automatisch.
6. `pnpm build:ci && pnpm qa` ausführen (prüft Alt-Texte und tote Verweise).
