# Asset-Lizenzen

Übersicht aller mitgelieferten Assets und ihrer Lizenzen. Es werden keine fremden
Stockbilder oder Hotlinks verwendet; alle visuellen Platzhalter sind eigenständig als
CSS/SVG gestaltet.

## Schriften (lokal gehostet, SIL Open Font License 1.1)

Bezogen über die npm-Pakete `@fontsource*` (Quelle: npm-Registry), lokal nach
`public/fonts/` kopiert (`scripts/copy-fonts.mjs`). Vollständige Lizenztexte:
`public/fonts/OFL.txt`.

| Schrift             | Verwendung          | Dateien                               | Lizenz      |
| ------------------- | ------------------- | ------------------------------------- | ----------- |
| Bricolage Grotesque | Display / Headlines | `bricolage-grotesque-latin-var.woff2` | SIL OFL 1.1 |
| Inter               | Fließtext / UI      | `inter-latin-{400,500,600,700}.woff2` | SIL OFL 1.1 |
| IBM Plex Mono       | technische Labels   | `ibm-plex-mono-latin-{400,500}.woff2` | SIL OFL 1.1 |

Die SIL OFL erlaubt die Einbettung und Weitergabe. Kein Google-Fonts-/CDN-Hotlink.

## Eigene Grafiken (© KERNSEITE – Eliyah Korb)

| Asset                               | Typ         | Zweck                       |
| ----------------------------------- | ----------- | --------------------------- |
| `public/favicon.svg`                | SVG         | Favicon (K-Monogramm)       |
| `public/assets/og/kernseite-og.svg` | SVG         | Open-Graph-/Social-Preview  |
| Hero-Animation „Der digitale Kern“  | DOM/CSS/SVG | interaktives Konzept-Mockup |
| Case-Mockups (Konzeptstudien)       | CSS/SVG     | eigenständige UI-Attrappen  |

## Bibliotheken (Server, Kontaktformular)

| Paket                 | Lizenz   | Zweck              |
| --------------------- | -------- | ------------------ |
| `phpmailer/phpmailer` | LGPL-2.1 | SMTP-Versand (PHP) |

Composer verwaltet die Abhängigkeit reproduzierbar (`php/composer.json` + `composer.lock`).
Der `vendor/`-Ordner wird nicht committet und ist im Deployment per `.htaccess`/Guard gesperrt.

## Noch zu ersetzen

Ein final gerastertes OG-Bild (1200×630 PNG/JPG) kann das SVG ersetzen, falls einzelne
Plattformen SVG-OG nicht rendern (siehe `docs/ASSET_SHOTLIST.md`).
