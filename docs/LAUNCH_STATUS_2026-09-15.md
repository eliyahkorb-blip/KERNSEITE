# KERNSEITE – Stand der Überarbeitung vom 15.09.2026

## Umgesetzt

- Ruhiger Einstieg mit echter Projektabbildung; Websiteangebot und Anfrageweg direkt sichtbar.
- Hauptnavigation Websites, Projekte, Agentur, Kontakt. Ergänzende Leistungen und Branchen bleiben gezielt erreichbar.
- Startseite gestrafft, Typografie und Abstände reduziert; WebGL, Neon- und Metallbutton-Effekte entfernt.
- Websiteangebot mit 1.500–3.600 Euro Orientierungsrahmen, Steuerhinweis, Leistungsumfang und getrennten Zusatzkosten.
- Zwei Kundenprojekte konkret beschrieben, keine erfundenen Ergebnisse oder Bewertungen. Eliyah als direkter Ansprechpartner, ohne fremdes Personenfoto.
- Formular auf fünf zunächst sichtbare Felder reduziert, weitere Angaben optional. Fehler behalten Eingaben; ein HTTP-200 ohne bestätigten JSON-Erfolg gilt nicht als erfolgreiche Anfrage.
- Serverseitige Herkunftsprüfung geschlossen, Größenlimit, URL- und Headerprüfung sowie SMTP-Zeitlimit verbessert.
- Produktionsdomain www.kernseite.com und info@kernseite.com zentral angeglichen; Mailzustellung steht noch aus.
- Neue PNG-Linkvorschau; individuelle Metadaten, canonicals und strukturierte Daten bleiben erhalten.
- Zehn Stockmotive dokumentiert, davon fünf neu von Unsplash bezogen. Öffentliche Bildnachweisseite, Quellenmanifest mit Datei-Hashes und Fotografennamen. Originale werden nicht mehr öffentlich ausgeliefert.
- Entwicklungsleitfaden neutral benannt, unnötige Effekt-Abhängigkeiten und zugehörige Dateien entfernt. Erforderliche Drittanbieter-Lizenzen und Git-Historie bleiben bestehen.
- Datenschutz beschreibt die deaktivierte Vorschau; unbelegte Aussagen zu gekürzten IP-Adressen entfernt. Abnahme und Gerichtsstand in AGB korrigiert; anwaltliche Prüfung bleibt offen.

## Lokal nachgewiesen

- Installation mit unveränderter Lockfile und deaktivierten Installationsscripts erfolgreich.
- Astro-Typecheck: 0 Fehler, 0 Warnungen, 2 Hinweise auf ungenutzte Props-Typdeklarationen.
- ESLint erfolgreich.
- CI-Build: 28 HTML-Seiten einschließlich 404.
- 1.678 interne Links ohne defekte Verweise; eindeutige Titles/Beschreibungen, Canonicals und parsebares JSON-LD.
- Statische Prüfung von Überschriften, Alternativtexten, Namen und Seitensprache erfolgreich.
- Keine extern geladenen Ressourcen oder ausführbaren Inline-Scripts/-Styles im Build.
- Zehn Originalquellen stimmen mit ihren SHA-256-Nachweisen überein; je acht Auslieferungsvarianten vorhanden. Alle 90 ausgelieferten Rasterbilder mit Bilddecoder geöffnet; Reinigungskraft im Ausschnitt korrigiert.
- Produktionsbuild bricht weiterhin korrekt ab: vier Infrastrukturangaben und zwei fachliche Freigaben fehlen.

GitHub-CI prüft zusätzlich Browserinteraktionen, schmale Ansichten, PHP-Syntax und serverseitige Formularvalidierung. Diese Ergebnisse sind dem jeweiligen Commit und Workflow zu entnehmen; ein lokaler Browser-/SMTP-/PHP-Erfolg wird nicht behauptet.

## Noch offen für den tatsächlichen Start

Die Website ist als Vorschau prüfbar. Für den produktiven Betrieb fehlen die bestätigte Hosting-/Mailkonfiguration, die tatsächliche Löschpraxis, rechtliche Freigabe, DNS/TLS-Einrichtung und ein echter Formular-Zustelltest. Einzelne Schritte: `PRODUCTION_TODO.md`.

Ein echtes Porträt von Eliyah verbessert die persönliche Darstellung; es wurde nicht durch ein Stock- oder generiertes Personenbild ersetzt. Referenz-Screenshots dokumentieren den bereitgestellten Projektstand, nicht zwingend die aktuelle externe Live-Version.

Die technische Vorbereitung ist keine Ranking-, Auftrags- oder Rechtskonformitätsgarantie. Nachfrage und gewonnene Aufträge müssen nach dem Domainstart gemessen werden. Die qualitative Wettbewerbsanalyse des beigefügten Audits ersetzt keine Suchvolumen-/Search-Console-Daten.

## GitHub-Prüfung und Veröffentlichung

Commit `a314d7d`: CI-Build, Typecheck, Lint, QA, End-to-End-Tests sowie PHP-Syntax/Composer/Formularvalidierung erfolgreich. Der Vorschau-Build als Artefakt ist ebenfalls erfolgreich.

GitHub Pages hat den Veröffentlichungsjob vor dem Start abgewiesen: Der Branch `rework/agentur-launch-2026-09-15` ist durch die Environment-Regeln nicht zum Deployment auf `github-pages` zugelassen. Die bestehende öffentliche URL zeigt deshalb noch den vorherigen Stand. Keine Schutzregel wurde verändert oder umgangen.

Erforderliche Administratoreinstellung für die neue Vorschau: Repository → Settings → Environments → github-pages → Deployment branches and tags. Den Branch `rework/agentur-launch-2026-09-15` ausdrücklich zulassen, danach den Preview-Workflow erneut starten. Nicht pauschal sämtliche Branches freigeben. Ein Merge in main ist hierfür nicht nötig.
