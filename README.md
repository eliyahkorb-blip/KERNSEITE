# KERNSEITE

Agenturwebsite von KERNSEITE – Eliyah Korb aus Erlabrunn bei Würzburg.
Individuelle Unternehmenswebsites für Auftraggeber in ganz Deutschland.
Astro, TypeScript, eigenes CSS, lokale Schriften und Bilder, PHP-Kontaktformular.

## Stand und Vorschau

Die Überarbeitung liegt auf `rework/agentur-launch-2026-09-15` und enthält den bisherigen vollständigen Websitecode. `main` bleibt bis zur ausdrücklichen Freigabe unverändert. Der vorherige Pull Request muss nicht zuerst gemergt werden.

- Vorschau: https://eliyahkorb-blip.github.io/KERNSEITE/
- Bestätigte Produktionsdomain: https://www.kernseite.com
- Aktueller Prüfstand und offene Betriebsschritte: [Launchstatus](docs/LAUNCH_STATUS_2026-09-15.md)
- Entwicklungsregeln: [CONTRIBUTING.md](CONTRIBUTING.md)

## Entwicklung

Node.js ab 22.12, pnpm 10.33.0. Für das Formular PHP ab 8.1 mit mbstring und Composer.

```bash
pnpm install --frozen-lockfile
pnpm copy-fonts
pnpm dev
```

```bash
pnpm typecheck
pnpm lint
pnpm build:ci
pnpm qa
pnpm test:e2e
php php/tests/ValidatorTest.php
```

## Build und Veröffentlichung

| Befehl                  | Verwendung                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| `pnpm build:ci`         | Testdaten, noindex, nicht produktiv deploybar                       |
| `pnpm build:preview`    | Echte Vorschau, noindex, Formular deaktiviert                       |
| `pnpm build:production` | Produktionsbuild; verweigert fehlende Pflichtangaben oder Freigaben |

GitHub Pages führt PHP nicht aus. Der Produktionsstand braucht das in [Deployment](docs/DEPLOYMENT_SHARED_HOSTING_DE.md) beschriebene Hosting mit PHP und SMTP. Der Anbieter und Serverstandort sind noch zu bestätigen. Zugangsdaten gehören ausschließlich auf den Server oberhalb des Webroots.

`src/config/company.ts` bündelt die Unternehmensdaten; `src/config/release.ts` die fachlichen Freigaben. Diese nicht setzen, um eine fehlende Prüfung zu umgehen.

## Bilder und Lizenzen

Optimierte Bilder liegen in `public/assets/`. Originale und Herkunftsmanifest liegen außerhalb des öffentlich ausgelieferten Verzeichnisses in `assets-source/`. Die öffentliche Seite `/bildnachweise/` nennt Fotografen und Quellen. Details: [Bilddokumentation](docs/ASSET_LICENSES.md).

`pnpm assets:images` benötigt Pillow mit WebP-/AVIF-Unterstützung. Der Bildexport prüft jede Datei vor dem Ersetzen. Die Qualitätsprüfung kontrolliert zusätzlich Quellen-Hashes und sämtliche erwarteten Bildvarianten.

Proprietäre Projektlizenz: [LICENSE](LICENSE). Drittanbieter-Lizenzen bleiben erhalten, insbesondere SIL OFL für die lokalen Schriften.
