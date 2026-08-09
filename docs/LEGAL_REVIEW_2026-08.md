# Rechtlicher Prüfstand – Stand August 2026

Dieses Dokument hält fest, **was belegt ist**, **was noch offen ist** und
**welche Fragen eine Einzelfallentscheidung brauchen**. Es ist keine
Rechtsberatung und ersetzt keine anwaltliche Prüfung. Es dient der Freigabe
über `src/config/release.ts`: Solange dort ein Schalter `false` ist, entsteht
kein deploybarer Produktions-Build.

Wer einen Schalter auf `true` setzt, bestätigt damit den jeweiligen
Sachverhalt – nicht, dass dieses Repository ihn geprüft hätte.

---

## 1. Bestätigt

| Angabe                      | Wert / Stand                                                       |
| --------------------------- | ------------------------------------------------------------------ |
| Anbieter (§ 5 DDG)          | Eliyah Korb                                                        |
| Geschäftliche Bezeichnung   | KERNSEITE (Marke bzw. geschäftliche Bezeichnung)                   |
| Anschrift                   | Würzburger Straße 14, 97250 Erlabrunn, Deutschland                 |
| E-Mail                      | info@kernseite.de                                                  |
| Telefon                     | +49 160 92647414                                                   |
| Inhaltlich Verantwortlicher | Eliyah Korb (nur relevant, falls redaktionelles Angebot entsteht)  |
| Tracking im Standard        | keines – kein Analytics, kein Pixel, kein Tag Manager              |
| Externe Dienste im Standard | keine – keine Karten, keine Video-Einbettung, keine Social-Widgets |
| Schriften                   | lokal ausgeliefert, keine Google Fonts                             |
| Lokale Speicherung          | nur `kernseite-accessibility` (Darstellungsoptionen)               |
| Bildquellen                 | dokumentiert in `docs/ASSET_LICENSES.md`                           |

Technisch geprüft und im Build abgesichert:

- `pnpm qa` → keine externen Ressourcen, keine Secrets, keine defekten Links.
- `tests/e2e/produktionsreife.spec.ts` → keine Rankinggarantie, keine
  Eurobeträge, keine unbelegte Standortaussage, kein veralteter Boilerplate.

---

## 2. Offen – blockiert den Produktions-Build

Diese Punkte hält `src/config/release.ts` fest. Ohne Klärung kein Live-Gang.

### 2.1 Hosting und Mailversand (`privacyInfrastructureConfirmed`)

Die Datenschutzerklärung kann derzeit keinen Serverstandort nennen, weil
keiner belegt ist. Benötigt werden:

- konkretes Hostingprodukt (Tarif, nicht nur der Anbietername)
- **tatsächlicher** Rechenzentrumsstandort des gebuchten Accounts
- Vertragspartner laut Rechnung/Vertrag (die juristische Gesellschaft, nicht
  die Marke)
- Auftragsverarbeitungsvertrag vorhanden? Fassung? Datum?
- datenschutzrechtlich relevante Unterauftragnehmer
- Mailversand: Anbieter, Standort, Drittlandbezug
- Aufbewahrungsdauer der Formularanfragen (konkrete Frist oder Kriterium)

**Nicht raten.** Insbesondere gilt: Ein Anbieter, der deutsche Rechenzentren
anbietet, betreibt den konkreten Account nicht zwingend in Deutschland. Die
Zuordnung ergibt sich aus dem gebuchten Produkt, nicht aus der Werbeseite.
Details: `docs/LEGAL_TODO.md`.

### 2.2 Endgültige Domain (`canonicalDomainConfirmed`)

Aktuell ist `https://www.kernseite.de` als `SITE_URL` gesetzt. Zu bestätigen
ist, ob die Produktionsdomain **mit** oder **ohne** `www` geführt wird. Danach
müssen `SITE_URL`, `astro.config.mjs`, Canonicals, Sitemap, OG-URLs und
JSON-LD auf genau diese Variante zeigen, und auf dem Hosting muss die andere
Variante per 301 darauf weiterleiten. Siehe `docs/PRODUCTION_TODO.md`.

### 2.3 Rechtliche Freigabe (`legalReviewApproved`)

Impressum, Datenschutzerklärung und AGB sind technisch vorbereitet, aber nicht
fachlich freigegeben. Die folgenden Punkte gehören in diese Prüfung.

---

## 3. Fragen, die eine Einzelfallentscheidung brauchen

### 3.1 B2B-only oder auch Verbraucher?

**Offene Frage:** Schließt KERNSEITE Verträge ausschließlich mit Unternehmern
im Sinne des § 14 BGB oder auch mit Verbrauchern?

Die Zielgruppen (Handwerksbetriebe, Praxen, Gastronomie, Hotels, lokale
Dienstleister, B2B-Mittelstand) sprechen für ein B2B-Geschäft. Das ist aber
eine geschäftliche Entscheidung, keine technische Ableitung – und sie wurde
noch nicht getroffen. Deshalb wurden die AGB **nicht** eigenmächtig auf
B2B-only umgestellt.

Folgen der Entscheidung:

- **B2B-only:** AGB konsistent darauf ausrichten; Verbraucherhinweise können
  entfallen; §§ 36/37 VSBG greifen nicht.
- **Auch B2C:** Verbraucherschutzregeln greifen (u. a. Informationspflichten,
  Widerruf bei Fernabsatz); die Angaben zur Verbraucherschlichtung sind an
  §§ 36/37 VSBG auszurichten.

### 3.2 Verbraucherschlichtung (§§ 36, 37 VSBG)

Der Verweis auf die EU-Online-Streitbeilegungsplattform ist entfernt und bleibt
entfernt – die Plattform wurde eingestellt, ein Link darauf wäre irreführend.

Der aktuelle Text sagt, dass keine Teilnahmepflicht besteht und keine Teilnahme
erfolgt. **Das ist erst nach 3.1 abschließend zu beurteilen.** Bei reinem
B2B-Geschäft ist die Angabe entbehrlich; bei Verbrauchergeschäft hängt sie
u. a. von der Mitarbeiterzahl ab.

### 3.3 Abnahmeklausel in den AGB (§ 640 BGB)

Die AGB enthalten sinngemäß: Nach zehn Werktagen ohne Rückmeldung und bei
produktiver Nutzung gilt die Leistung als abgenommen.

Die Klausel wurde **weder gelöscht noch stillschweigend beibehalten**: Sie ist
Vertragsrecht und braucht eine fachliche Beurteilung. Zu prüfen ist die
Wirksamkeit als Allgemeine Geschäftsbedingung, insbesondere im Verhältnis zur
gesetzlichen Abnahmefiktion und – falls 3.1 „auch B2C“ ergibt – zu den
zusätzlichen Anforderungen gegenüber Verbrauchern. Ergebnis der Prüfung hier
eintragen.

### 3.4 § 18 Abs. 2 MStV – inhaltlich Verantwortlicher

**Entscheidung dieser Runde:** Der Block „Redaktionell verantwortlich“ wird
nicht mehr als Pflichtangabe dargestellt (`legal.hasJournalisticContent =
false`).

Begründung: Die zusätzliche Angabe knüpft an journalistisch-redaktionell
gestaltete Angebote an. KERNSEITE betreibt derzeit keinen Blog, kein
Nachrichtenportal und kein Magazin; die Seiten beschreiben ausschließlich das
eigene Leistungsangebot. Entsteht später ein redaktioneller Bereich, wird der
Schalter auf `true` gesetzt und die Angabe erscheint wieder.

Zu bestätigen: Ist ein redaktioneller Bereich geplant?

### 3.5 § 25 TDDDG – lokale Speicherung

Gespeichert wird ausschließlich `kernseite-accessibility` mit Textgröße,
Kontrast und reduzierter Bewegung. Die Speicherung erfolgt **erst**, wenn der
Schalter bedient wird, nie beim bloßen Seitenaufruf, und die Werte verlassen
den Browser nicht.

Die Datenschutzerklärung beschreibt das sachlich (Zweck, Inhalt, keine
Profilbildung, Löschung jederzeit möglich). Es wird **nicht** behauptet,
localStorage sei „kein Cookie und deshalb rechtlich irrelevant“ – § 25 TDDDG
erfasst das Speichern von Informationen im Endgerät unabhängig von der
Technik.

**Zu bestätigen:** Ob die Speicherung als für einen vom Nutzer ausdrücklich
gewünschten Dienst unbedingt erforderlich einzuordnen ist. Die Umsetzung ist
darauf ausgelegt (Speicherung nur nach aktiver Bedienung, kein Zweck über die
Darstellung hinaus). Fällt die Beurteilung anders aus, ist eine Einwilligung
vorzuschalten; das Consent-Gerüst dafür existiert bereits
(`site.consentRequired`).

### 3.6 BFSG – Anwendbarkeit

Die Barrierefreiheitserklärung bleibt vorsichtig formuliert: WCAG 2.2 AA als
technisches Qualitätsziel, teilweise geprüft, bekannte Einschränkungen
benannt, Rückmeldeweg vorhanden. Es wird **nicht** behauptet, die Website sei
„BFSG-konform“, „rechtssicher barrierefrei“ oder „100 % WCAG-konform“.

**Zu prüfen:** Ob die konkrete Dienstleistung überhaupt in den
Anwendungsbereich fällt und ob die Kleinstunternehmen-Ausnahme greift. Diese
Einordnung gehört **nicht** automatisiert auf die Website. Unabhängig von der
gesetzlichen Pflicht bleibt technische Barrierearmut Qualitätsstandard.

### 3.7 Rechtsform und USt-IdNr.

`legalForm` ist bewusst leer – es wird keine Rechtsform behauptet. `vatId` ist
leer; der Abschnitt erscheint dann nicht. Beides eintragen, sobald geklärt.

---

## 4. Was diese Runde korrigiert hat

| Punkt                                            | Vorher                                    | Jetzt                                                   |
| ------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------- |
| Serverstandort in der Datenschutzerklärung       | „Serverstandort in Deutschland“ behauptet | nur bei belegter Angabe, sonst neutrale Formulierung    |
| Mailversand                                      | „über einen Server in Deutschland“        | Anbieter nur bei belegter Angabe                        |
| Aufbewahrungsdauer                               | pauschal                                  | konkrete Frist nur bei belegter Angabe                  |
| `kernseite-accessibility`                        | nicht erwähnt                             | Zweck, Inhalt, Löschung beschrieben                     |
| Haftungs-Boilerplate §§ 7/8–10 DDG               | vorhanden                                 | entfernt, durch zwei sachliche Absätze ersetzt          |
| „Redaktionell verantwortlich“                    | immer sichtbar                            | nur bei redaktionellem Angebot                          |
| Produktions-Build bei offenen Datenschutzfeldern | lief durch                                | bricht ab                                               |
| Produktions-Build ohne fachliche Freigabe        | lief durch                                | bricht ab                                               |
| Sitz                                             | „KERNSEITE sitzt in Würzburg“             | „Raum Würzburg“ / „bei Würzburg“, Sitz bleibt Erlabrunn |
| Budgetklassen im Formular                        | vier Eurobereiche sichtbar                | entfernt, Projektumfang ohne Beträge                    |
