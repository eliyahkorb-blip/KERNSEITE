# Überarbeitung nach Bildfeedback · 16.09.2026

Arbeitsbranch: `rework/agentur-launch-2026-09-15`, bestehender PR #2. Kein Merge nach main.

## Änderungen

- Startseite: konkreter Nutzen, kleinere Überschriften, lesbare Begleittexte, keine dekorativen Eyebrows, Projektzahlen oder Schrittlinien. Preisrahmen und Anfrage-CTA bleiben unmittelbar sichtbar.
- Aktuelle, vom Nutzer bereitgestellte Screenshots für Kaya Döner, Babyschlafberatung Anna-Lena Korb und Bestattungen Gorhau. Das Kinderkörbchen bleibt erreichbar.
- Neue interne Projektseiten für Babyschlafberatung und Gorhau, mit großen Screenshots und einem Anfrageweg. Beide sind als Entwürfe eingeordnet; keine erfundenen Ergebnisse oder Kundenbewertungen.
- Die reservierte Domain `babyschlafberatung.example` ist eine sichtbare Beispieladresse. Sie wird niemals als externer Link verwendet. Der bisher bekannte Gorhau-Pages-Link lieferte HTTP 404 und wird nicht ausgespielt.
- Website-, Video-, SEO- und Automatisierungsabläufe ohne versetzte Reihen und dekorative Linien. Die ausführliche Prozessseite behält Zuständigkeiten und Ergebnisse.
- Footer mit flexiblen Linkreihen und vollständigen Begriffen, ohne doppelte Rechtslinks. Leistungsübersicht im Hauptmenü; Leistungs- und Branchenübersicht im Footer.
- Die Vorschau der Kontaktseite nennt neben dem Telefon einen direkten E-Mail-Link. Der echte Formularversand erfordert weiterhin die bestehende SMTP-/Hosting-Konfiguration.

## Prüfung

Lokal erfolgreich: Astro-Produktionscode im CI-Modus gebaut (30 Seiten), Typecheck ohne Fehler, ESLint, CSP, Bildquellen, ausschließlich lokale Ressourcen, 1.812 interne Links, statische Barrierearmut, eindeutige Titles/Descriptions/Canonicals, parsebare strukturierte Daten. Alle regulären HTML-Seiten sind ab der Startseite über Links erreichbar; die 404-Fehlerseite bleibt erwartungsgemäß ohne Menülink.

Die bestehenden GitHub-Tests werden um die neuen Entwurfseiten, vollständige Footerlinks bei 320/390/768/1024/1440 Pixeln und den gerade ausgerichteten Websiteablauf ergänzt. Der Playwright-Bericht enthält dazu weitere Screenshots. Laufstatus und Sichtprüfung stehen im PR.

Vorschau-Builds bleiben noindex. Der produktive Domainstart mit tatsächlichem Mailversand ist weiterhin von den bereits dokumentierten Produktionsvoraussetzungen abhängig. Eine technische Prüfung ist kein Nachweis für Rankings oder gemessene Konversionsraten.
