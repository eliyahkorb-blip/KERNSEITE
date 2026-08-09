# CLAUDE.md – Arbeitsleitfaden für dieses Repository

Diese Datei gibt KI-Assistenten und Entwickler:innen die wichtigsten Regeln und
Konventionen für die KERNSEITE-Website an die Hand.

## Was dieses Projekt ist

Eine hochwertige, eigenständige **Multi-Page-Agenturwebsite** für KERNSEITE –
Eliyah Korb (Digitalstudio, Würzburg). Sie ist zugleich das stärkste eigene
Referenzprojekt der Marke. Kein Template, keine austauschbare KI-SaaS-Optik.

## Grundprinzipien (nicht verhandelbar)

1. **Keine erfundenen Fakten.** Keine erfundenen Kundennamen, Ergebnisse,
   Kennzahlen, Bewertungen, Logos oder Awards. Pflichtangaben, die nicht bestätigt
   sind, bleiben Platzhalter (`[ERSETZEN]`) und stehen in `docs/LEGAL_TODO.md`.
2. **Platzhalter/Entwurfshinweise nur im Dev-Modus.** Produktions- und CI-Build
   zeigen niemals `[ERSETZEN]` oder „prüfpflichtiger Entwurf“. `build:production`
   bricht bei fehlenden Pflichtangaben ab (`src/lib/config-validation.ts`).
3. **Keine externen Dienste standardmäßig.** Keine Google Fonts/Maps, kein
   YouTube/Vimeo-Autoload, kein Analytics/Tracking, keine fremden CDNs.
   Einbettungen nur nach aktivem Klick / Einwilligung.
4. **Fonts lokal.** Schriften kommen aus `public/fonts/` (SIL OFL). Kein Hotlink.
5. **Barrierearmut & Performance** sind Qualitätsstandard, kein Nachgedanke.
6. **Keine Rankinggarantien / keine Heilversprechen / keine Superlative ohne Beleg.**

## Inhalt pflegen

- Firmendaten/Pflichtangaben: **nur** `src/config/company.ts`.
- Seiteninhalte/Struktur: `src/config/*` (services, industries, cases, faq, process, …).
- Konzeptstudien: `src/config/cases.ts` – immer `isConceptStudy: true` und das Badge
  „Konzeptstudie – kein Kundenprojekt“ auf Übersicht **und** Detailseite.
- Texte auf Deutsch, durchgehende Du-Ansprache, Fachbegriffe (SEO, GEO, Voice Agent)
  beim ersten Auftreten kurz erklären.

## Technische Konventionen

- Astro + TypeScript, semantisches HTML, eigenes CSS mit Tokens (`src/styles`).
- **Keine** React-Runtime, **kein** Tailwind, keine externe UI-Bibliothek.
- Interaktionen in Vanilla-TS, `transform`/`opacity`-basiert, `prefers-reduced-motion`
  respektieren, Animationen offscreen/inaktiver Tab pausieren.
- Genau **eine** `<h1>` pro Seite, saubere Überschriftenhierarchie, Landmarken,
  Skip-Link, sichtbare Fokuszustände.
- Ausführbare Scripts/Styles werden **extern** ausgeliefert (kein Inline), damit die
  CSP ohne `unsafe-inline` funktioniert. Inline nur nicht-ausführbares JSON-LD
  (per sha256-Hash in der CSP freigegeben).

## Build & Prüfen

- `pnpm dev` – Entwicklung. `pnpm build:ci` – Fixture-Build für Tests.
- `pnpm build:production` – echter Build (nur mit vollständigen Pflichtangaben).
- Vor dem Commit: `pnpm typecheck`, `pnpm lint`, ggf. `pnpm build:ci && pnpm qa`.
- Struktureller Build-/QA-Nachweis läuft immer über `build:ci` (Fixture, nicht deploybar).

## Sicherheit

- Keine Secrets im Repo/Build/Frontend. `.env` nur serverseitig, oberhalb des Webroots.
- Formular-Endpunkt: Same-Origin-/Origin-Referer-Prüfung, Honeypot, Mindest-Ausfüllzeit,
  Rate-Limit, serverseitige Validierung (kein behaupteter Token-CSRF ohne Umsetzung).

## Git

- Entwicklung auf `claude/feat-kernseite-website-5cid9c`, PR gegen `main`.
- Kein Force-Push, keine History-Überschreibung.
