# Asset-Lizenzen und Herkunft

## Schriften

| Schrift             | Lizenz  | Herkunft                                   | Dateien                |
| ------------------- | ------- | ------------------------------------------ | ---------------------- |
| Bricolage Grotesque | SIL OFL | `@fontsource-variable/bricolage-grotesque` | `public/fonts/*.woff2` |
| Inter               | SIL OFL | `@fontsource/inter`                        | `public/fonts/*.woff2` |
| IBM Plex Mono       | SIL OFL | `@fontsource/ibm-plex-mono`                | `public/fonts/*.woff2` |

Lizenztext: `public/fonts/OFL.txt`. Alle Schriften werden lokal ausgeliefert,
es gibt keine Verbindung zu Google Fonts oder einem CDN.

## Originalmedien (vom Auftraggeber bereitgestellt)

Diese Dateien stammen aus dem Asset-Paket `KERNSEITE_finale_assets.zip`. Sie wurden
**inhaltlich nicht verändert** – weder nachgezeichnet, noch neu erzeugt, noch mit
zusätzlichen Angaben versehen. Zulässig waren ausschließlich Formatkonvertierung,
Komprimierung, responsive Größen und ein Zuschnitt leerer Außenränder.

| Datei (ausgeliefert)                                               | Quelle (unverändert abgelegt)                                          | Bearbeitung                                               |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| `assets/references/kaya-doener-desktop.webp` (+ 800/1200/1600)     | `assets/references/source/case-kaya-doener-desktop.png`                | PNG → WebP q80, zusätzliche Breiten                       |
| `assets/references/kinderkoerbchen-desktop.webp` (+ 800/1200/1600) | `assets/references/source/case-kinderkoerbchen-desktop.png`            | PNG → WebP q80, zusätzliche Breiten                       |
| `assets/references/google-business-profile-kinderkoerbchen.webp`   | `assets/references/source/google-business-profile-kinderkoerbchen.png` | PNG → WebP q92 (Text bleibt scharf)                       |
| `assets/video/hero-kernseite-poster.webp` (+ 900/1280)             | `assets/references/source/hero-kernseite-poster.png`                   | PNG → WebP q86, zusätzliche Breiten                       |
| `assets/video/hero-kernseite-poster-portrait.webp`                 | dieselbe Quelle                                                        | Zuschnitt des leeren linken Randes (ab x = 620) für Mobil |

**Bewertungen, Telefonnummern, Adressen, Öffnungszeiten und Zahlen im
Google-Screenshot sind unverändert.** Die Screenshots behalten ihre Originalfarben
und werden nicht in die Markenfarbe eingefärbt.

Nutzungsrechte an den abgebildeten Kundenwebsites: freigegeben durch die jeweiligen
Auftraggeber (Kaya Döner Himmelstadt, Anna-Lena’s Kinderkörbchen).

## Eigene Grafiken

| Datei                                                | Herkunft                                      |
| ---------------------------------------------------- | --------------------------------------------- |
| `public/favicon.svg`                                 | eigenes K-Monogramm                           |
| `public/assets/og/kernseite-og.svg`                  | eigenes Open-Graph-Motiv                      |
| `public/assets/references/kernseite-crt-square.webp` | eigenes Markenmotiv, quadratischer Ausschnitt |
| `public/assets/video/hero-kernseite-final*.webp`     | eigenes Markenmotiv, bearbeitet (siehe unten) |

Der gezeichnete Porträt-Platzhalter (`assets/team/eliyah-portrait.svg`) wurde entfernt.
Auf `/agentur/` steht bis zum echten Foto das eigene Markenmotiv – keine gezeichnete
Ersatzfigur, kein leeres graues Feld.

## Bearbeitung des CRT-Motivs

`public/assets/video/hero-kernseite-final*.webp` entstehen reproduzierbar aus
`public/assets/references/source/hero-kernseite-poster.png` über
`node scripts/build-hero-crt.mjs` (Pillow + numpy, rein lokal). Verändert werden:

- die beiden leuchtenden Augen (vollständig entfernt),
- die Bildschirmfläche (KERNSEITE-Cyan `#00E3F2`, Verlauf und Scanlines aus dem
  Original gemessen, schwarzer Schriftzug KERNSEITE mittig auf dem Glas),
- der Cyan-Lichtsaum auf der Blende (vereinheitlicht),
- der Schriftzug auf dem Gehäuseschild (retuschiert, damit das Wort nur einmal im
  Bild steht).

Der schwarze Röhrenrahmen, die Gehäusekante, Anzug, Hemd und Hintergrund bleiben
unverändert aus dem Original.

## Bildausschnitte aus Echtmaterial

`scripts/build-reference-crops.py` erzeugt Ausschnitte in wechselnden Formaten –
ausschließlich aus vorhandenem Echtmaterial, ohne externen Zugriff:

| Datei                                         | Quelle                        | Format |
| --------------------------------------------- | ----------------------------- | ------ |
| `assets/branchen/gastronomie-hotels.webp`     | Screenshot kaya-doener.de     | 2:1    |
| `assets/branchen/lokale-dienstleister.webp`   | Screenshot kinderkörbchen.com | 4:5    |
| `assets/references/kernseite-crt-square.webp` | eigenes CRT-Motiv             | 1:1    |
| `assets/references/kaya-doener-wide.webp`     | Screenshot kaya-doener.de     | 21:9   |

Die Screenshots zeigen von KERNSEITE umgesetzte Websites. Der Alternativtext benennt
das offen (`src/config/media.ts`) – es sind keine Stimmungs- oder Stockbilder.

## Noch zu beschaffen: Branchenbilder

Für die Branchenflächen sind Bilder vorgesehen. Sie werden **nur eingebunden, wenn die
Datei tatsächlich vorliegt** (`existsSync`-Prüfung im Build) – es entstehen also keine
leeren Bildplatzhalter. Bis dahin trägt die Typografie die Fläche.

Ablage: `public/assets/branchen/<slug>.webp`, Seitenverhältnis 3:2, min. 1600 × 1067.

| Branche        | Datei                                     | Unsplash-Photo-ID | Fotograf:in                 |
| -------------- | ----------------------------------------- | ----------------- | --------------------------- |
| Handwerk       | `assets/branchen/handwerk.webp`           | `oW4mPEcgdEc`     | _(beim Download eintragen)_ |
| Zahnarztpraxen | `assets/branchen/zahnarztpraxen.webp`     | `Bg81yWKZlMg`     | _(beim Download eintragen)_ |
| Gastronomie    | `assets/branchen/gastronomie-hotels.webp` | `dU6UO85FZgs`     | _(beim Download eintragen)_ |
| Hotels         | _(alternativ zur Gastronomie)_            | `dgTzAvblPw4`     | _(beim Download eintragen)_ |

**Wichtig:** Diese Bilder konnten im Build-Environment nicht geladen werden – der
ausgehende Netzwerkzugriff auf `unsplash.com` und `images.unsplash.com` wird von der
Egress-Policy blockiert (HTTP 403 beim CONNECT). Die Dateien müssen daher manuell
heruntergeladen und lokal abgelegt werden.

Beim Einsetzen bitte je Bild ergänzen: Fotograf:in, Photo-ID, Quell-URL und Datum des
Downloads. Nur kostenlose Unsplash-Bilder verwenden (**kein Unsplash+**). Keine
Hotlinks – die Dateien liegen lokal, sonst schlägt `pnpm qa` (`check-external`) fehl.

## Branchenmotive

Die fünf Branchenmotive fehlen noch. Der Download von Unsplash ist in dieser
Entwicklungsumgebung gesperrt (Egress-Proxy, HTTP 403 beim CONNECT, neun
Versuche über sechs Hosts mit vier Werkzeugen). Weil unsplash.com nicht
erreichbar war, konnten auch keine konkreten Fotos ausgewählt werden – es
stehen hier deshalb bewusst **keine Photo-IDs und keine Fotografennamen**.
Erfundene Angaben wären schlimmer als eine offene Lücke.

Motivbeschreibung, Suchbegriffe, Ablagepfade und der Ablauf beim Einsetzen
stehen in `docs/ASSET_TODO.md`.

| Branche              | Datei (nach Aufbereitung)                                  | Fotograf  | Photo-ID  | Quelle    | Datum     |
| -------------------- | ---------------------------------------------------------- | --------- | --------- | --------- | --------- |
| Handwerk             | `assets/branchen/handwerk-{640,960,1280,1600}.{webp,avif}` | _(offen)_ | _(offen)_ | _(offen)_ | _(offen)_ |
| Zahnarztpraxen       | `assets/branchen/zahnarztpraxen-…`                         | _(offen)_ | _(offen)_ | _(offen)_ | _(offen)_ |
| Gastronomie & Hotels | `assets/branchen/gastronomie-hotels-…`                     | _(offen)_ | _(offen)_ | _(offen)_ | _(offen)_ |
| Lokale Dienstleister | `assets/branchen/lokale-dienstleister-…`                   | _(offen)_ | _(offen)_ | _(offen)_ | _(offen)_ |
| B2B-Mittelstand      | `assets/branchen/b2b-mittelstand-…`                        | _(offen)_ | _(offen)_ | _(offen)_ | _(offen)_ |

Beim Einsetzen je Bild eintragen: Fotograf, Unsplash-Seitenadresse, Photo-ID,
Einsatzort, Download-Datum und Lizenzquelle (Unsplash-Lizenz, kein Unsplash+).

**Entfernt:** Die früheren Branchenbilder waren Ausschnitte aus den
Screenshots der Kundenprojekte Kaya Döner und Kinderkörbchen. Das war eine
Zweckentfremdung – ein Website-Ausschnitt zeigt nicht das Gewerk. Diese
Dateien wurden gelöscht; die Screenshots erscheinen nur noch im Bereich
„Arbeiten“.

---

## Gelieferte Fotos (2026-07-27)

Die Motive wurden vom Auftraggeber als aufbereitete 4:3-Dateien (1600 × 1200)
bereitgestellt. Quelle laut mitgelieferter `BILDZUORDNUNG.txt`: Unsplash.

### Leistungsbilder

| Datei                                    | Fotograf       | Original                                  | Einsatzort                                                   |
| ---------------------------------------- | -------------- | ----------------------------------------- | ------------------------------------------------------------ |
| `assets/leistungen/social-media-*`       | Berke Citak    | `berke-citak-0cpyFsSUiSc-unsplash.jpg`    | Hero `/leistungen/social-media/`                             |
| `assets/leistungen/unternehmensvideo-*`  | Joao Marinho   | `joao-marinho-5o0vN9pDwuY-unsplash.jpg`   | Hero `/leistungen/unternehmensvideo/`                        |
| `assets/leistungen/seo-geo-*`            | Growtika       | `growtika-ANqHO-Jxkj8-unsplash.jpg`       | Split `/leistungen/seo-geo/`                                 |
| `assets/leistungen/standort-wuerzburg-*` | Daniel Sessler | `daniel-sessler-bN3WvTQQhFk-unsplash.jpg` | `/agentur/` (Verwurzelt in Würzburg), `/kontakt/` (Standort) |

### Branchenbilder

| Datei                                     | Motiv                                | Einsatzort                                         |
| ----------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| `assets/branchen/handwerk-*`              | Schleifarbeit an einer Holzplatte    | Branchenraster + `/branchen/handwerk/`             |
| `assets/branchen/zahnarztpraxen-*`        | Zahnärztliche Untersuchung           | Branchenraster + `/branchen/zahnarztpraxen/`       |
| `assets/branchen/gastronomie-hotels-*`    | Koch beim Anrichten                  | Branchenraster + `/branchen/gastronomie-hotels/`   |
| `assets/branchen/lokale-dienstleister-*`  | Fassadenreinigung                    | Branchenraster + `/branchen/lokale-dienstleister/` |
| `assets/branchen/b2b-mittelstand-*`       | Zuschnitt von Bauholz in einer Halle | Branchenraster + `/branchen/b2b-mittelstand/`      |
| `assets/branchen/restaurant-ambiente-*`   | Restaurant von oben                  | `/branchen/gastronomie-hotels/` (Galerie)          |
| `assets/branchen/hotelzimmer-*`           | Hotelzimmer                          | `/branchen/gastronomie-hotels/` (Galerie)          |
| `assets/branchen/garten-landschaftsbau-*` | Angelegter Garten                    | `/branchen/lokale-dienstleister/` (Bildstreifen)   |

Für das Zahnarztmotiv liegen die Angaben vor:

| Datei                              | Fotograf                 | Photo-ID      | Quelle   |
| ---------------------------------- | ------------------------ | ------------- | -------- |
| `assets/branchen/zahnarztpraxen-*` | Filip Rankovic Grobgaard | `rm7Mgu33tHU` | Unsplash |

Die Unsplash-Seitenadresse ist noch einzutragen; der Abruf ist aus dieser
Arbeitsumgebung nicht möglich (die Netzsperre lässt unsplash.com nicht zu).

Fotografennamen und Photo-IDs der übrigen Branchenbilder lagen der Lieferung
nicht bei und sind nachzutragen (siehe `docs/ASSET_TODO.md`).

Aufbereitung: `pnpm assets:images` (`scripts/build-images.py`) beschneidet auf
4:3 und schreibt je Motiv 640/960/1280/1600 px als WebP und AVIF. Der
Ausschnitt sitzt mittig; für Hochformate steht in `FOCUS` eine abweichende
senkrechte Lage (Zahnarztmotiv: 0.42). Die Originaldateien liegen unter
`public/assets/<gruppe>/source/` und werden nicht ausgeliefert.
