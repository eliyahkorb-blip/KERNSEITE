# Schritte bis zum Produktionsstart

Stand: 15.09.2026. Die neue Vorschau ist kein Produktionsdeploy.

## Erledigt

- Produktionsadresse vom Inhaber bestätigt: `https://www.kernseite.com`.
- Domain in Canonicals, Sitemap, Open Graph, JSON-LD und Kontaktangaben angeglichen.
- Weiterleitung auf HTTPS und www in `public/.htaccess` vorbereitet.
- Angebotsrahmen 1.500–3.600 Euro netto mit Umfang und Zusatzkosten veröffentlicht.
- Zehn Stockmotive zugeordnet, fünf davon durch dokumentierte Unsplash-Downloads ersetzt.
- Bildnachweise öffentlich und im Repository dokumentiert.

## Vor dem Live-Gang erforderlich

1. **Produktionshosting:** Anbieter, Produkt und tatsächlichen Serverstandort bestätigen. PHP ab 8.1 mit mbstring, Composer-Abhängigkeiten und Apache-Konfiguration bereitstellen. Bei vorgeschaltetem Proxy die HTTPS-Erkennung passend konfigurieren.
2. **E-Mail:** Tatsächlichen Versandweg bestätigen, SMTP-Zugang serverseitig hinterlegen und `info@kernseite.com` als erreichbaren Empfänger testen. Google Workspace als eingerichtetes Firmenpostfach ersetzt noch keine SMTP-Konfiguration des Formulars. Erfolgreichen Empfang, Antwortadresse und Fehlermeldung auf dem Zielhosting prüfen.
3. **Datenschutz:** `hostingProvider`, `hostingLocation`, `mailProvider`, `formRetentionPeriod` in `src/config/company.ts` anhand des tatsächlichen Betriebs vervollständigen. AV-Verträge, etwaige Drittlandübermittlungen und Löschpraxis prüfen. Es gibt keine implementierte automatische Löschung von E-Mail-Anfragen nach 90 Tagen.
4. **Rechtliche Prüfung:** Impressum, Datenschutz, AGB, Steuerdarstellung und tatsächlichen Barrierefreiheitsstatus mit dem Anwalt prüfen. Die Abnahme- und Gerichtsstandsklauseln wurden überarbeitet; eine anwaltliche Freigabe ist damit nicht erfolgt.
5. Nach belegter Klärung `privacyInfrastructureConfirmed` und `legalReviewApproved` in `src/config/release.ts` setzen. Die Domainfreigabe steht bereits auf `true`.
6. Produktionsbuild erstellen, QA durchführen, Deployment zusammenstellen. DNS für beide Hostnamen und TLS auf dem Zielhosting prüfen. Echte SMTP-Testanfrage durchführen.
7. Erst den geprüften Produktionsstand veröffentlichen. Kein Vorschau-/CI-Verzeichnis hochladen; die vorhandenen Deploy-Guards beibehalten.
8. Search Console/Bing einrichten, Sitemap einreichen, Weiterleitungen und Linkvorschauen prüfen. Details: `SEARCH_LAUNCH_CHECKLIST.md`.

## GitHub

Die Änderungen werden auf `rework/agentur-launch-2026-09-15` gesichert. Kein Merge in `main` ohne ausdrückliche Freigabe. Der vorherige Websitebranch ist enthalten; sein Pull Request muss nicht vorher gemergt werden.
