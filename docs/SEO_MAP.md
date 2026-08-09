# SEO-Karte

Eine Seite = eine primäre Suchintention. Semantische Varianten stehen im
Fließtext, nicht als Aufzählung von Schreibweisen. Es gibt bewusst **keine**
Stadt-Landingpages wie `/webdesign-wuerzburg/` – dieselbe Leistung unter
mehreren Adressen ist keine zusätzliche Information.

Die Angaben stammen aus dem gebauten Output (`pnpm build:ci`), nicht aus der
Planung. Automatisch geprüft wird das von `scripts/check-seo.mjs` (Teil von
`pnpm qa`) und von `tests/e2e/produktionsreife.spec.ts`.

## Standort

Sitz ist **Erlabrunn bei Würzburg**. Würzburg ist bedientes Marktgebiet und
darf als solches benannt werden – nicht als Sitz. Sichtbare Texte sagen „Raum
Würzburg“ oder „bei Würzburg“. Die strukturierte Anschrift nennt Erlabrunn,
`areaServed` nennt Würzburg, Unterfranken, Bayern und Deutschland.

## Marketingseiten

| Route                                    | Primärer Intent                    | Sekundär                                                                             | Title                                             | H1                                                                             | Schema                          |
| ---------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------- |
| `/`                                      | Webdesign & KI-Agentur Würzburg    | Digitalagentur, Webagentur, individuelle Websites, SEO/GEO, KI-Automatisierung       | Webdesign & KI-Agentur Würzburg · KERNSEITE       | Dein Unternehmen kann mehr. Deine Website sollte es zeigen.                    | ProfessionalService, WebSite    |
| `/leistungen/`                           | Leistungsübersicht                 | Websites, SEO/GEO, Google-Profil, Video, Social, KI                                  | Leistungen · KERNSEITE                            | Die Website ist der Kern. Alles Weitere dockt sinnvoll an.                     | Breadcrumb, ProfessionalService |
| `/leistungen/websites/`                  | Webdesign Agentur Würzburg         | Webseiten-Agentur, Website-Agentur, individuelle Unternehmenswebsite, Webentwicklung | Webdesign Agentur Würzburg · Websites · KERNSEITE | Websites, die nicht nur gut aussehen.                                          | Breadcrumb, Service, FAQPage    |
| `/leistungen/seo-geo/`                   | SEO & GEO Agentur Würzburg         | SEO-Agentur, GEO-Agentur, Generative Engine Optimization, lokale Sichtbarkeit        | SEO & GEO Agentur Würzburg · KERNSEITE            | Gefunden werden. Und richtig wiedergegeben.                                    | Breadcrumb, Service, FAQPage    |
| `/leistungen/ki-automatisierung/`        | KI-Agentur Würzburg                | KI-Integration, KI-Implementierung, KI-Automatisierung, Voice Agents, Chatbots       | KI-Agentur Würzburg · KI-Integration · KERNSEITE  | Automatisiere Arbeit. Nicht die Beziehung zum Kunden.                          | Breadcrumb, Service             |
| `/leistungen/google-unternehmensprofil/` | Google-Unternehmensprofil Würzburg | lokale Sichtbarkeit, Google Maps, Bewertungen                                        | Google-Unternehmensprofil Würzburg · KERNSEITE    | Gefunden werden, wenn es vor Ort zählt.                                        | Breadcrumb, Service, FAQPage    |
| `/leistungen/unternehmensvideo/`         | Unternehmensvideo Würzburg         | Imagefilm, Videoproduktion                                                           | Unternehmensvideo Würzburg · KERNSEITE            | Zeig, was Texte allein nicht vermitteln.                                       | Breadcrumb, Service             |
| `/leistungen/social-media/`              | Social-Media-Betreuung             | Markenauftritt, Content-Formate                                                      | Social Media Betreuung · KERNSEITE                | Eine Marke muss nicht jeden Tag posten.                                        | Breadcrumb, Service, FAQPage    |
| `/arbeiten/`                             | Referenzen                         | umgesetzte Kundenprojekte                                                            | Arbeiten · KERNSEITE                              | Arbeiten, die nicht nach Vorlage aussehen.                                     | Breadcrumb, ProfessionalService |
| `/arbeiten/kaya-doener-himmelstadt/`     | Referenz Gastronomie               | digitale Speisekarte, lokale Sichtbarkeit                                            | Kaya Döner Himmelstadt – Referenz · KERNSEITE     | Appetit auf den ersten Klick.                                                  | Breadcrumb                      |
| `/arbeiten/kinderkoerbchen/`             | Referenz Betreuung                 | Vertrauen, persönlicher Auftritt                                                     | Anna-Lena’s Kinderkörbchen – Referenz · KERNSEITE | Vertrauen, bevor man sich kennt.                                               | Breadcrumb                      |
| `/branchen/`                             | Branchenübersicht                  | fünf Branchen                                                                        | Branchen · KERNSEITE                              | Gute Gestaltung versteht das Geschäft dahinter.                                | Breadcrumb                      |
| `/branchen/handwerk/`                    | Webdesign für Handwerker           | Website für Handwerksbetriebe, Aufträge, Bewerber, regionale Auffindbarkeit          | Webdesign für Handwerker · KERNSEITE              | Websites für Handwerksbetriebe, die Aufträge und Bewerber bringen.             | Breadcrumb                      |
| `/branchen/zahnarztpraxen/`              | Webdesign für Zahnarztpraxen       | Praxis-Website, Zahnarzt-Website, Terminwege                                         | Webdesign für Zahnarztpraxen · KERNSEITE          | Praxis-Websites, die Vertrauen schaffen und Termine erleichtern.               | Breadcrumb                      |
| `/branchen/gastronomie-hotels/`          | Webdesign für Gastronomie & Hotels | Restaurant-Website, Hotel-Website, Reservierung, Buchung, Speisekarte                | Webdesign für Gastronomie & Hotels · KERNSEITE    | Websites für Gastronomie und Hotels, die Lust auf einen Besuch machen.         | Breadcrumb                      |
| `/branchen/lokale-dienstleister/`        | Webdesign für lokale Dienstleister | Einzugsgebiet, Kontaktaufnahme, Bewertungen                                          | Webdesign für lokale Dienstleister · KERNSEITE    | Websites für lokale Dienstleister, die Anfragen bringen.                       | Breadcrumb                      |
| `/branchen/b2b-mittelstand/`             | B2B-Webdesign für den Mittelstand  | erklärungsbedürftige Leistungen, qualifizierte Anfragen                              | B2B-Webdesign für den Mittelstand · KERNSEITE     | Websites für den B2B-Mittelstand, die komplexe Leistungen verständlich machen. | Breadcrumb                      |
| `/agentur/`                              | Digital- & Medienagentur Würzburg  | Digitalstudio, Partnernetzwerk, Ansprechpartner                                      | Digital- & Medienagentur Würzburg · KERNSEITE     | Klein im Kern. Stark im Netzwerk.                                              | Breadcrumb                      |
| `/prozess/`                              | Projektablauf                      | sieben Schritte, Zusammenarbeit                                                      | Prozess · KERNSEITE                               | Klarer Prozess. Keine Agentur-Schleifen.                                       | Breadcrumb                      |
| `/faq/`                                  | Häufige Fragen                     | Kosten, Dauer, Templates, Hosting, SEO/GEO                                           | Häufige Fragen · KERNSEITE                        | Häufige Fragen, ehrlich beantwortet.                                           | Breadcrumb, FAQPage             |
| `/kontakt/`                              | Kontaktaufnahme                    | Anfrage, Gespräch                                                                    | Kontakt · KERNSEITE                               | Erzähl kurz, was du vorhast.                                                   | Breadcrumb                      |

„Medienagentur“ steht auf `/agentur/`, weil Website, Social Media und
Unternehmensvideo tatsächlich angeboten bzw. über spezialisierte Partner
koordiniert werden – nicht, weil der Begriff gesucht wird. Die Darstellung
bleibt dabei ehrlich: klein im Kern, Spezialleistungen über Partner.

## Rechts- und Nebenseiten

| Route                    | Index                    | Anmerkung                                                         |
| ------------------------ | ------------------------ | ----------------------------------------------------------------- |
| `/impressum/`            | index                    | Pflichtangaben nach § 5 DDG                                       |
| `/datenschutz/`          | index                    | Art. 13 DSGVO, an der tatsächlichen Technik ausgerichtet          |
| `/barrierefreiheit/`     | index                    | ehrlicher Prüfstand, keine Konformitätszusage                     |
| `/agb/`                  | index                    | fachliche Freigabe offen                                          |
| `/cookie-einstellungen/` | **nicht in der Sitemap** | erklärt, dass derzeit keine zustimmungspflichtigen Dienste laufen |
| `/404`                   | **nicht in der Sitemap** | noindex                                                           |

## Interne Verlinkung nach Suchintent

| Von                  | Nach                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| Startseite           | Websites, SEO/GEO, Branchen, Arbeiten, Kontakt                                        |
| Handwerk             | Websites, Google-Unternehmensprofil, Unternehmensvideo, Kontakt (`?branche=handwerk`) |
| Zahnarztpraxen       | Websites, Google-Unternehmensprofil, KI & Automatisierung, Kontakt                    |
| Gastronomie & Hotels | Websites, Unternehmensvideo, Google-Unternehmensprofil, Kontakt                       |
| Lokale Dienstleister | Websites, Google-Unternehmensprofil, KI & Automatisierung, Kontakt                    |
| B2B-Mittelstand      | Websites, SEO/GEO, Unternehmensvideo, KI & Automatisierung, Kontakt                   |
| KI & Automatisierung | Websites, Prozess, Kontakt (`?leistung=ki`)                                           |

Die Branchenseiten verlinken ihre passenden Leistungen über
`relatedServices` in `src/config/industries.ts`. Der Abschluss-CTA jeder
Leistungs- und Branchenseite trägt den Kontext als Query-Parameter mit; das
Kontaktformular wählt daraus die passende Leistung vor (Whitelist, siehe
`src/components/ContactForm.astro`).

## GEO – wie generative Antwortsysteme bedient werden

Ohne Sonderdateien und ohne versteckte Texte. Grundlage sind kurze,
überprüfbare Aussagen im sichtbaren Inhalt:

| Frage                                        | Wo beantwortet                                               |
| -------------------------------------------- | ------------------------------------------------------------ |
| Was ist KERNSEITE?                           | Startseite, erster Absatz unter der Überschrift              |
| Was bietet KERNSEITE?                        | `/leistungen/` und die sechs Detailseiten                    |
| Wo sitzt KERNSEITE?                          | `/agentur/`, `/kontakt/`, Impressum – Erlabrunn bei Würzburg |
| Welche Unternehmen werden betreut?           | `/branchen/` mit fünf Detailseiten                           |
| Was wird selbst umgesetzt, was mit Partnern? | `/agentur/`, Abschnitt „Wer arbeitet an meinem Projekt?“     |
| Wie läuft ein Projekt ab?                    | `/prozess/`                                                  |
| Gibt es Ranking-Garantien?                   | `/faq/` und `/leistungen/seo-geo/` – ausdrücklich nein       |
| Was bedeutet SEO, was GEO?                   | `/leistungen/seo-geo/`                                       |
| Was bedeutet KI-Integration?                 | `/leistungen/ki-automatisierung/`                            |

Bewusst **nicht** umgesetzt: `llms.txt` ohne belegten Nutzen, unsichtbare
Faktenblöcke, KI-spezifische Schema-Typen, Query-Varianten-Listen. Für
generative Systeme zählt derselbe Inhalt, den Menschen lesen.

## Pflege

Bei jeder Änderung an Titeln, Beschreibungen oder Routen: `pnpm build:ci &&
pnpm qa` – `check-seo.mjs` meldet doppelte oder zu lange Angaben, fehlende
Canonicals und nicht parsebares JSON-LD. Diese Datei danach angleichen.
