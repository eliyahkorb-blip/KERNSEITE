# Datenschutz-Inventar

Übersicht der Datenverarbeitungen und externen Abhängigkeiten. Ziel: datenschutzfreundlicher
Standard ohne Tracking und ohne externe Dienste.

## Externe Dienste / Requests

| Dienst / Ressource     | Status          | Anmerkung                                        |
| ---------------------- | --------------- | ------------------------------------------------ |
| Google Fonts           | **nicht aktiv** | Schriften lokal (SIL OFL) in `public/fonts/`     |
| Google Maps            | **nicht aktiv** | keine Karten-Einbettung                          |
| YouTube / Vimeo        | **nicht aktiv** | Videos nur datenschutzfreundlich / Click-to-load |
| Google Analytics       | **nicht aktiv** | kein Tracking                                    |
| Meta Pixel / Ads       | **nicht aktiv** | kein Marketing-Tracking                          |
| Externe Chat-Widgets   | **nicht aktiv** | —                                                |
| Externe CDNs           | **nicht aktiv** | alle Assets self-hosted (per QA geprüft)         |
| Terminbuchung (extern) | optional        | nur nach aktivem Klick (`site.bookingUrl`)       |

Automatisierte Prüfung: `pnpm qa` → `check-external.mjs` (erwartet 0 externe Requests).

## Cookies / lokale Speicherung

| Zweck                        | Art            | Einwilligung             |
| ---------------------------- | -------------- | ------------------------ |
| Consent-Status (falls aktiv) | `localStorage` | nur wenn consentRequired |
| Sonstige                     | keine          | —                        |

Standard: **kein Cookie-Banner** (nur technisch notwendige Funktionen). Sobald
zustimmungspflichtige Dienste aktiviert werden (`site.consentRequired = true`), greift das
Zwei-Ebenen-Consent-Gerüst (Alle akzeptieren / Alle ablehnen / Einstellungen, nichts
vorausgewählt, Widerruf über Footer-Link).

## Kontaktformular

| Aspekt          | Umsetzung                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| Erhobene Daten  | Name, Unternehmen, E-Mail, Telefon (opt.), Leistung, Website (opt.), Nachricht, Budget (opt.), Start (opt.) |
| Übertragung     | serverseitig (PHP), Versand per SMTP über deutschen Server                                                  |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b bzw. f DSGVO                                                                           |
| Spam-Schutz     | Honeypot, Mindest-Ausfüllzeit, Rate-Limit, Same-Origin-Prüfung                                              |
| Zugangsdaten    | nur serverseitig (`.env` oberhalb Webroot), nie im Repo                                                     |
| Aufbewahrung    | nur zur Bearbeitung; konkrete Frist in `formRetentionPeriod` (offen)                                        |

## Server-Logfiles

Technisch notwendige Zugriffsdaten (gekürzte IP, Zeit, Datei, Referrer, User-Agent) zum
sicheren Betrieb; Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO. Details je nach Hoster.

## Offene Punkte

Siehe `docs/LEGAL_TODO.md` (Auftragsverarbeiter, Aufbewahrungsfrist, Aufsichtsbehörde).
