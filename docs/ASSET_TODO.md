# Offene Bildbeschaffung

## 1. Zahnarztpraxen & medizinische Praxen – erledigt

Das Motiv liegt vor und ist eingebunden: Foto von **Filip Rankovic
Grobgaard** (Unsplash, Photo-ID `rm7Mgu33tHU`), abgelegt als
`public/assets/branchen/source/zahnarztpraxen.jpg`, aufbereitet mit
`pnpm assets:images`. Es erscheint im Branchenraster und als Hauptmotiv auf
`/branchen/zahnarztpraxen/`.

Das frühere, mit `handwerk.jpg` byte-identische Bild
(MD5 `96484aad8868e10d38508b9df6580933`) wird **nicht** verwendet; die Quelldatei
trägt jetzt MD5 `ab160840f11f01630efe3a69bfc49103`.

Offen bleibt allein die Unsplash-Seitenadresse in `docs/ASSET_LICENSES.md` –
der Abruf ist aus der Arbeitsumgebung gesperrt.

## 2. B2B-Mittelstand – Motiv passt nicht zur Branche

Die gelieferte `b2b-mittelstand.jpg` zeigt eine Zimmerei auf der Baustelle:
Bauholz auf dem Bock, Handkreissäge, Helm, Warnweste, Gesichtsschutz. Das
Bild ist gut, liest sich aber als **Handwerk und Baustelle** – und damit fast
identisch zum Motiv der Branche „Handwerk“ (Schleifarbeit an einer
Holzplatte). Ein mittelständisches Produktionsunternehmen erkennt sich darin
nicht wieder.

Das Bild wurde nicht eigenmächtig entfernt, weil es Teil der Lieferung ist.
Sobald ein passendes Motiv vorliegt, ersetzt es die Datei an derselben
Stelle – Einbindung und Zuschnitt bleiben unverändert.

### Gesuchtes Motiv

Fertigung oder Montage in einer aufgeräumten Produktionshalle; CNC-Maschine,
Maschinenbau, Metall- oder Kunststoffverarbeitung, Qualitätskontrolle,
Technikerin oder Techniker an einer Anlage. Ruhig, sachlich, hell.

**Nicht:** Baustelle, Helm mit Warnweste, Holzzuschnitt, Handwerkzeug,
Konferenzraum mit Handschlag, Roboterhand vor blauem Datenraster.

Suchbegriffe: `manufacturing facility`, `cnc machine operator`,
`modern production hall`, `industrial engineer factory`,
`quality control manufacturing`

### Einsetzen

1. Foto auf <https://unsplash.com/> auswählen – kostenlos, **kein Unsplash+**,
   keine KI-Bilder, keine fremden Marken.
2. Als `public/assets/branchen/source/b2b-mittelstand.jpg` ablegen (4:3) und
   die vorhandene Datei ersetzen.
3. `pnpm assets:images` ausführen.
4. Den Alternativtext in `src/config/photos.ts` auf das neue Motiv anpassen –
   er beschreibt derzeit den Zuschnitt von Bauholz.
5. Fotograf, Photo-ID und Quell-URL in `docs/ASSET_LICENSES.md` eintragen,
   diesen Abschnitt entfernen.

## 3. Nachzutragende Bildnachweise

Für die fünf Branchenmotive lagen Fotograf und Photo-ID nicht bei. Beides ist
in `docs/ASSET_LICENSES.md` nachzutragen, bevor die Website produktiv geht:

- `handwerk.jpg`
- `gastronomie-hotels.jpg`
- `lokale-dienstleister.jpg`
- `b2b-mittelstand.jpg`
- `restaurant-ambiente.jpg`, `hotelzimmer.jpg`, `garten-landschaftsbau.jpg`

Für `zahnarztpraxen.jpg` liegen Fotograf und Photo-ID vor; dort fehlt nur noch
die Unsplash-Seitenadresse.

Für die vier Leistungsbilder liegen die Fotografennamen vor (siehe
`docs/ASSET_LICENSES.md`); dort fehlen noch die Unsplash-Seitenadressen.

## 4. Weiterhin offen

- Ein echtes Porträt von Eliyah Korb für `/agentur/`. Bis dahin steht dort das
  eigene CRT-Markenmotiv – keine gezeichnete Ersatzfigur.

## 5. Stand

**Zahnarztpraxen:** erledigt, siehe Abschnitt 1.

**B2B-Mittelstand:** weiterhin offen. Das gelieferte Motiv zeigt eine Zimmerei
auf der Baustelle und liest sich als Handwerk. Es steht bis zum Austausch
weiter auf der Seite; auf der Website wird zum Motiv keine Aussage getroffen,
die darüber hinausginge. Gesucht: Fertigung oder Montage in einer aufgeräumten
Produktionshalle, Maschinenbau, technische Fertigung, Qualitätskontrolle.
