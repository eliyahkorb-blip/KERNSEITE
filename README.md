# KERNSEITE

Website von **KERNSEITE – Eliyah Korb**, einem Digitalstudio aus Würzburg für
individuelle Unternehmenswebsites. Statische Multi-Page-Website auf Basis von
**Astro** und **TypeScript** mit eigenem Design-System – datenschutzfreundlich,
performant und barrierearm (Zielstandard WCAG 2.2 AA).

## Tech-Stack

- [Astro](https://astro.build) (statischer Multi-Page-Generator), TypeScript
- Eigenes CSS mit Design-Tokens (keine UI-Bibliothek, kein Tailwind)
- Vanilla-TypeScript für Interaktionen (keine React-Runtime)
- Lokale, selbst gehostete Schriften (SIL OFL) – kein Google-Fonts-/CDN-Hotlink
- Kontaktformular über einen gehärteten PHP-Endpunkt (PHPMailer via Composer)

## Voraussetzungen

- Node.js `>= 20.11` (siehe `.nvmrc`: 22)
- [pnpm](https://pnpm.io) `10.x`
- Für das Kontaktformular: PHP `>= 8.1` und Composer (nur serverseitig / für Deploy)

## Lokale Entwicklung

```bash
pnpm install
pnpm run copy-fonts   # einmalig / nach Font-Update: OFL-woff2 nach public/fonts kopieren
pnpm dev              # Entwicklungsserver (http://localhost:4321)
```

Im **Entwicklungsmodus** sind Entwurfshinweise und `[ERSETZEN]`-Platzhalter der
Rechtstexte sichtbar. Im Produktions- und CI-Build erscheinen sie nie.

## Build-Modi

Der Build ist strikt getrennt (siehe `src/lib/build-mode.ts`):

| Befehl                  | Zweck                                                       | Deploybar |
| ----------------------- | ----------------------------------------------------------- | --------- |
| `pnpm build:production` | Echter Build. **Bricht ab**, solange Pflichtangaben fehlen. | **Ja**    |
| `pnpm build:ci`         | Build mit **fiktiven Fixture-Daten** für Tests/QA/E2E.      | **Nein**  |

Der CI-Build markiert den Output mit `CI_FIXTURE_DO_NOT_DEPLOY.txt` / `.ci-fixture`
und `noindex`. Der Deploy-Guard (`pnpm guard:no-fixture`) verweigert dann den Upload.

> Solange die echten Pflichtangaben in `src/config/company.ts` noch Platzhalter sind,
> ist `pnpm build:production` bewusst blockiert. Das ist gewollt – siehe
> `docs/LEGAL_TODO.md`.

## Vorschau (vor dem Merge)

Für die visuelle Prüfung auf Smartphone und Desktop gibt es einen eigenen Vorschau-Build
(echte Daten, `noindex`, sichtbarer „Vorschau“-Hinweis, Formular deaktiviert):

```bash
pnpm build:preview      # baut die Vorschau
pnpm preview:host       # lokal ausliefern (auch fürs Smartphone im selben WLAN)
```

Öffentliche Vorschau-URL (GitHub Pages) und Artefakt-Download: siehe `docs/PREVIEW.md`.

## Nützliche Skripte

```bash
pnpm typecheck        # astro check (TypeScript)
pnpm lint             # ESLint
pnpm format           # Prettier (schreiben)
pnpm build:ci         # Fixture-Build für QA/Tests
pnpm qa               # eigene Prüfskripte gegen dist/ (Links, Alt, extern, inline, Secrets)
pnpm test:e2e         # Playwright End-to-End-Tests
pnpm guard:no-fixture # verhindert Deploy eines Fixture-Builds
```

## Projektstruktur (Kurzüberblick)

```
src/config/     Zentrale Inhalte & Pflichtangaben (Single Source of Truth)
src/lib/        Build-Modus, Config-Validierung, JSON-LD-Helfer
src/layouts/    Seiten-Layouts
src/components/  Wiederverwendbare Komponenten (inkl. Hero-Animation)
src/pages/      Alle Seiten (echte Multi-Page-Struktur)
src/styles/     tokens.css, global.css, fonts.css
public/         Statische Assets, Schriften, robots.txt, .htaccess
php/            PHP-Kontaktendpunkt (PHPMailer via Composer)
scripts/        Build-/QA-/Deploy-Skripte
docs/           Projekt-, Datenschutz-, Deployment- und Test-Dokumentation
```

## Deployment

Das Produktionshosting läuft auf Servern in Deutschland. Der konkrete Anbieter wird
öffentlich nicht genannt. Schritt-für-Schritt-Anleitungen:

- `docs/DEPLOYMENT_SHARED_HOSTING_DE.md` – aktiver Weg (statischer Build + PHP-Formular)
- `docs/DEPLOYMENT_VPS_DE.md` – Alternative (Node/Express-Formularendpunkt)

**Niemals** Zugangsdaten oder `.env`-Dateien committen. Die produktive `.env` des
Formulars liegt auf dem Server oberhalb des Webroots.

## Weiterführende Dokumentation

Siehe Ordner `docs/` (Design-System, Content-Modell, Datenschutz-Inventar,
Rechts-TODO, Asset-Shotlist/Lizenzen, SEO-Map, Testbericht) sowie `CLAUDE.md`.

## Lizenz

Proprietär – siehe `LICENSE`. Drittanbieter-Schriften stehen unter der SIL OFL
(`public/fonts/OFL.txt`, dokumentiert in `docs/ASSET_LICENSES.md`).
