# SEO-Map

Übersicht der Routen mit Title, H1 und strukturierten Daten. Title-Template:
`<Seitentitel> · KERNSEITE`. Jede Seite hat Canonical, Open-Graph/Twitter-Cards und
genau eine H1.

| Route                                    | Title (ohne Suffix)                                | H1                                                     | Schema (JSON-LD)            |
| ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------ | --------------------------- |
| `/`                                      | Individuelle Websites für Unternehmen mit Anspruch | Dein Unternehmen ist besser als sein Internetauftritt. | WebSite, Organization\*     |
| `/leistungen/`                           | Leistungen                                         | Alles beginnt mit einer starken Website.               | + BreadcrumbList            |
| `/leistungen/websites/`                  | Individuelle Websites                              | Websites, die nicht nur gut aussehen.                  | + Service\*, BreadcrumbList |
| `/leistungen/google-unternehmensprofil/` | Google-Unternehmensprofil                          | Gefunden werden, wenn es vor Ort zählt.                | + Service\*, BreadcrumbList |
| `/leistungen/unternehmensvideo/`         | Unternehmensvideo                                  | Zeig, was Texte allein nicht vermitteln können.        | + Service\*, BreadcrumbList |
| `/leistungen/social-media/`              | Social Media                                       | Eine Marke muss nicht jeden Tag posten …               | + Service\*, BreadcrumbList |
| `/leistungen/ki-automatisierung/`        | KI & Automatisierung                               | Automatisiere Arbeit. Nicht die Beziehung zum Kunden.  | + Service\*, BreadcrumbList |
| `/arbeiten/`                             | Arbeiten                                           | Arbeiten, die mehr zeigen als schöne Screens.          | + BreadcrumbList            |
| `/arbeiten/meisterwerk/`                 | Meisterwerk · Konzeptstudie                        | Meisterwerk                                            | + BreadcrumbList            |
| `/arbeiten/dentale-linie/`               | Dentale Linie · Konzeptstudie                      | Dentale Linie                                          | + BreadcrumbList            |
| `/arbeiten/haus-am-fluss/`               | Haus am Fluss · Konzeptstudie                      | Haus am Fluss                                          | + BreadcrumbList            |
| `/branchen/`                             | Branchen                                           | Gute Gestaltung versteht das Geschäft dahinter.        | + BreadcrumbList            |
| `/branchen/handwerk/`                    | Handwerk                                           | Websites für Handwerksbetriebe …                       | + BreadcrumbList            |
| `/branchen/zahnarztpraxen/`              | Zahnarztpraxen & medizinische Praxen               | Praxis-Websites, die Vertrauen schaffen …              | + BreadcrumbList            |
| `/branchen/gastronomie-hotels/`          | Gastronomie & Hotels                               | Websites für Gastronomie und Hotels …                  | + BreadcrumbList            |
| `/branchen/lokale-dienstleister/`        | Lokale Dienstleister                               | Websites für lokale Dienstleister …                    | + BreadcrumbList            |
| `/branchen/b2b-mittelstand/`             | B2B-Mittelstand                                    | Websites für den B2B-Mittelstand …                     | + BreadcrumbList            |
| `/agentur/`                              | Agentur                                            | Klein im Kern. Stark im Netzwerk.                      | + BreadcrumbList            |
| `/prozess/`                              | Prozess                                            | Von der ersten Idee bis zur fertigen KERNSEITE.        | + BreadcrumbList            |
| `/faq/`                                  | Häufige Fragen                                     | Häufige Fragen, ehrlich beantwortet.                   | + FAQPage, BreadcrumbList   |
| `/kontakt/`                              | Kontakt                                            | Erzähl kurz, was du vorhast.                           | + BreadcrumbList            |
| `/impressum/`                            | Impressum                                          | Impressum                                              | + BreadcrumbList            |
| `/datenschutz/`                          | Datenschutzerklärung                               | Datenschutzerklärung                                   | + BreadcrumbList            |
| `/barrierefreiheit/`                     | Barrierefreiheit                                   | Erklärung zur Barrierefreiheit                         | + BreadcrumbList            |
| `/cookie-einstellungen/`                 | Cookie-Einstellungen (noindex)                     | Cookie-Einstellungen                                   | —                           |
| `/404`                                   | Seite nicht gefunden (noindex)                     | Diese Seite gibt es nicht.                             | —                           |

\* **Organization / Service werden nur erzeugt, wenn die echten Firmendaten vollständig
sind** (Korrektur 8). Solange Pflichtfelder Platzhalter sind, werden diese Schemas
weggelassen – keine Platzhalter in strukturierten Daten. (Im CI-Build mit Fixture-Daten sind
sie vorhanden, der Output ist aber `noindex` und nicht deploybar.)

## Technische SEO-Basis

- `sitemap-index.xml` + `sitemap-0.xml` via `@astrojs/sitemap` (ohne `cookie-einstellungen`/`404`)
- Dynamische `robots.txt` (Sitemap-Referenz; im CI-Build alles gesperrt)
- Sprechende URLs mit Trailing-Slash, sauberes internes Linking, Breadcrumbs
- Lokale Ausrichtung: Würzburg / Unterfranken / Bayern (keine kopierten Stadtseiten)

## GEO (Antwortsysteme)

Faktenklare Struktur: Was bietet KERNSEITE (individuelle Websites + Erweiterungen), für wen
(lokale Unternehmen/Mittelstand), Region (Würzburg/Unterfranken/Bayern), Ablauf (Prozessseite),
Verantwortung (Eliyah Korb), Partneranteile (ehrlich gekennzeichnet), Standards (Datenschutz,
Barrierearmut, Performance).
