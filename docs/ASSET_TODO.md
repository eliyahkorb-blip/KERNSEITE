# Offene Bildbeschaffung

## 1. Zahnarztpraxen & medizinische Praxen

**Es fehlt genau ein Branchenmotiv.**

Die Lieferung `KERNSEITE_branchenbilder_4zu3.zip` enthielt zwar eine Datei
`zahnarztpraxen.jpg`, sie ist aber **byte-identisch mit `handwerk.jpg`**
(MD5 `96484aad8868e10d38508b9df6580933`) und zeigt eine Schleifmaschine auf
einer Holzplatte – keine Praxis.

Ein Handwerksfoto als Praxisbild auszugeben wäre eine falsche Darstellung.
Die Datei wurde deshalb nicht übernommen. Die Branche erscheint im Raster und
auf ihrer Detailseite ohne Bildfläche – kein grauer Platzhalter, keine
Ersatzlinie, kein zweckentfremdetes Motiv.

### Gesuchtes Motiv

Helle, moderne Praxis; ruhiges Gespräch zwischen medizinischem Personal und
Patient; vertrauensvolle Atmosphäre.

**Nicht:** Nahaufnahme eines Mundes, sichtbare Behandlung, Zahnbürsten-Stock,
künstlich lachendes Stockteam, Heilversprechen.

Suchbegriffe: `dentist patient modern clinic`, `dental practice interior`,
`doctor patient consultation`, `modern medical practice`,
`friendly dentist consultation`

### Einsetzen

1. Foto auf <https://unsplash.com/> auswählen – kostenlos, **kein Unsplash+**,
   keine KI-Bilder, keine fremden Marken.
2. Als `public/assets/branchen/source/zahnarztpraxen.jpg` ablegen (4:3).
3. `pnpm assets:images` ausführen. Das Skript beschneidet mittig auf 4:3 und
   schreibt 640/960/1280/1600 px als WebP und AVIF.
4. Fotograf, Photo-ID, Quell-URL und Datum in `docs/ASSET_LICENSES.md`
   eintragen, diesen Abschnitt entfernen.
5. `pnpm build:ci && pnpm qa && pnpm test:e2e`. Der Test
   `tests/e2e/branchen.spec.ts` prüft, dass das Motiv geladen wird und
   dasselbe Seitenverhältnis hat wie die übrigen.

## 2. Nachzutragende Bildnachweise

Für die fünf Branchenmotive lagen Fotograf und Photo-ID nicht bei. Beides ist
in `docs/ASSET_LICENSES.md` nachzutragen, bevor die Website produktiv geht:

- `handwerk.jpg`
- `gastronomie-hotels.jpg`
- `lokale-dienstleister.jpg`
- `b2b-mittelstand.jpg`
- `restaurant-ambiente.jpg`, `hotelzimmer.jpg`, `garten-landschaftsbau.jpg`

Für die vier Leistungsbilder liegen die Fotografennamen vor (siehe
`docs/ASSET_LICENSES.md`); dort fehlen noch die Unsplash-Seitenadressen.

## 3. Weiterhin offen

- Ein echtes Porträt von Eliyah Korb für `/agentur/`. Bis dahin steht dort das
  eigene CRT-Markenmotiv – keine gezeichnete Ersatzfigur.
