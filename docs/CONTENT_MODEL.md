# Content-Modell

Alle Inhalte sind in der Konfigurationsschicht (`src/config/`) zentralisiert, damit keine
Fakten hart im Markup stehen und Pflege an einer Stelle möglich ist.

## Konfigurationsdateien

| Datei                | Inhalt                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `company.ts`         | Firmen-/Pflichtangaben (Single Source of Truth), `REQUIRED_LEGAL_FIELDS`                                   |
| `company.fixture.ts` | Fiktive Fixture-Daten **nur** für den CI-Build                                                             |
| `site.ts`            | Domain, Region, Feature-Flags (`showHostingClaim`, `consentRequired`), Hosting-Formulierung |
| `navigation.ts`      | Haupt-/Footer-Navigation, primärer CTA                                                                     |
| `services.ts`        | 5 Leistungen (Kern + Erweiterungen) inkl. Problem/Lösung/Bestandteile/Nutzen/Ablauf/Zielgruppen/Abschnitte |
| `industries.ts`      | 5 Branchen mit eigenständigen Schwerpunkten                                                                |
| `cases.ts`           | 3 Konzeptstudien (`isConceptStudy: true`, Badge)                                                           |
| `faq.ts`             | FAQ (Auszug für Startseite via `onHome`)                                                                   |
| `process.ts`         | Prozess (Kurzform + 9 Schritte mit Rollen)                                                                 |
| `pricing.ts`         | Preisstruktur (Standard: unveröffentlicht)                                                                 |
| `seo.ts`             | SEO-Defaults, Title-Template, Canonical-Helfer                                                             |
| `legal.ts`           | Rechtstext-Bausteine (Entwurfshinweis, EU-Streitschlichtung)                                               |

## Steuerlogik (`src/lib/`)

- `build-mode.ts` – `BUILD_MODE` (dev/ci/production), `SHOW_DRAFT_NOTICES` (nur dev)
- `config-validation.ts` – wählt aktive Firmendaten, bricht Produktions-Build bei fehlenden
  Pflichtangaben ab, liefert `hasCompleteLegalData`
- `jsonld.ts` – strukturierte Daten (nur bei vollständigen Echtdaten)

## Redaktionelle Regeln

- Deutsch, durchgehende Du-Ansprache, kurze selbstbewusste Sätze.
- Fachbegriffe (SEO, GEO, Voice Agent) beim ersten Auftreten erklären.
- Keine Superlative ohne Beleg, keine Garantien, keine erfundenen Fakten/Kennzahlen/Logos.
- Partner-/Netzwerkmodell ehrlich darstellen („Ein Ansprechpartner. Die richtigen
  Spezialisten.“).
- Konzeptstudien immer als solche kennzeichnen (Übersicht **und** Detailseite).

## Neue Inhalte hinzufügen

- Neue Leistung/Branche/Konzeptstudie: Eintrag in der jeweiligen Config-Datei ergänzen –
  Übersicht, Detailseite (dynamische Route) und Navigation ziehen automatisch nach.
- Rechtstexte: in `company.ts`/`legal.ts` pflegen; Entwurfshinweise erscheinen nur im Dev.
