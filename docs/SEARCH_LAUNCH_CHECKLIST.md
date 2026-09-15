# Suchmaschinen – Checkliste zum Launch

Abzuarbeiten **nach** dem Live-Gang auf der endgültigen Domain. Keine
Verifizierungs-Tokens im Repository: Sie werden beim Anlegen der Property
erzeugt und gehören in die Hosting-Konfiguration bzw. als DNS-Eintrag hinterlegt.

Diese Liste sagt nicht voraus, dass die Website indexiert oder gefunden wird.
Sie hält fest, was dafür technisch vorbereitet ist und was danach zu beobachten
ist.

## 1. Voraussetzungen (vor der Anmeldung)

- [x] Endgültige Domain bestätigt: `https://www.kernseite.com`
- [ ] HTTPS aktiv und gültig, kein Mixed Content
- [ ] 301 von der Nicht-Canonical-Variante steht, keine Schleife
- [ ] `pnpm build:production` erzeugt einen Build (alle Freigaben gesetzt)
- [ ] Canonicals zeigen auf die Produktionsdomain, nicht auf GitHub Pages
- [ ] `robots.txt` erlaubt die Marketingseiten und verweist auf die Sitemap
- [ ] Sitemap enthält nur kanonische, indexierbare URLs
      (kein 404, keine Cookie-Einstellungen)
- [ ] `pnpm qa` grün – darin läuft `check-seo.mjs`

## 2. Google Search Console

- [ ] Property anlegen (Domain-Property bevorzugt, deckt beide Varianten ab)
- [ ] Inhaberschaft bestätigen (DNS-TXT-Eintrag)
- [ ] Sitemap einreichen: `<domain>/sitemap-index.xml`
- [ ] URL-Prüfung Startseite → „Indexierung beantragen“
- [ ] URL-Prüfung der wichtigsten Leistungsseiten:
      `/leistungen/websites/`, `/leistungen/seo-geo/`,
      `/leistungen/ki-automatisierung/`, `/leistungen/google-unternehmensprofil/`
- [ ] URL-Prüfung der fünf Branchenseiten
- [ ] Bericht „Seiten“ auf ausgeschlossene URLs durchsehen

## 3. Bing Webmaster Tools

- [ ] Property anlegen (Import aus der Search Console ist möglich)
- [ ] Sitemap einreichen
- [ ] Indexierung der Startseite prüfen

## 4. Google-Unternehmensprofil

- [ ] Profil auf die endgültige Domain verlinken
- [ ] Anschrift im Profil und im Impressum stimmen überein
      (Erlabrunn – **nicht** Würzburg)
- [ ] Kategorien, Leistungen und Öffnungszeiten aktuell
- [ ] Bilder aktuell

## 5. Nach dem Launch beobachten

- [ ] Nach 1–2 Wochen: Indexierungsstatus in der Search Console
- [ ] Markensuche „KERNSEITE“ – erscheint die eigene Seite?
- [ ] Lokale Suchanfragen beobachten (z. B. „Webdesign Würzburg“,
      „Webdesign für Handwerker“) – **ohne** Erwartung einer festen Position
- [ ] Core Web Vitals im Bericht „Nutzerfreundlichkeit“ verfolgen
- [ ] Search-Console-Meldungen zu strukturierten Daten prüfen

## Was hier bewusst nicht steht

- Keine Zusage, dass Google die Seiten indexiert oder in bestimmter Position
  ausspielt. Indexierung ist eine Entscheidung der Suchmaschine.
- Keine speziellen KI-/GEO-Dateien. Für generative Antwortsysteme zählt
  derselbe sichtbare, überprüfbare Inhalt – keine gesonderten Dateien.
- Keine Erfolgsmessung in Rankingpositionen als Projektziel.
