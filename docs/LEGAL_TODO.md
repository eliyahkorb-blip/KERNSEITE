# LEGAL TODO – vor Live-Gang zu erledigen

Diese Liste bündelt alle noch offenen Pflichtangaben und rechtlichen Entscheidungen.
**Der Produktions-Build (`pnpm build:production`) bricht bewusst ab, solange die
Pflichtfelder fehlen.** Erst nach vollständiger und fachlich geprüfter Pflege ist ein
deploybarer Build möglich.

> Grundsatz: Keine Angabe erfinden. Alles hier Gelistete muss mit echten, bestätigten
> Daten gefüllt und rechtlich geprüft werden.

## 1. Pflichtangaben (BLOCKIEREN den Produktions-Build)

In `src/config/company.ts` eintragen:

- [ ] `street` – Straße und Hausnummer
- [ ] `postalCode` – PLZ
- [ ] `city` – Ort
- [ ] `email` – geschäftliche E-Mail
- [ ] `phone` – Telefonnummer

(Geprüft durch `REQUIRED_LEGAL_FIELDS` in `src/config/company.ts`.)

## 2. Optionale, aber empfohlene Angaben

- [ ] `vatId` – USt-IdNr. (falls vorhanden; sonst Feld auf `''` setzen, dann wird der
      Abschnitt im Impressum ausgeblendet)
- [ ] `supervisoryAuthority` – nur falls tatsächlich erforderlich
- [ ] `socialLinks` – echte Profile (leer lassen, wenn keine)

## 3. Domain

- [ ] Produktions-Domain bestätigen und via `SITE_URL` / `src/config/site.ts` setzen
      (aktueller Default: `https://kernseite.de`). Beeinflusst Canonicals, Sitemap, OG-URLs,
      robots.

## 4. Hosting-Hinweis „Diese Website wird auf Servern in Deutschland gehostet.“

- [ ] Erst aktivieren, wenn der deutsche Serverstandort tatsächlich eingerichtet und
      dokumentiert ist. Dann in `src/config/site.ts`: `showHostingClaim: true` **und**
      `hostingLocation` in `company.ts` auf „Deutschland“ setzen.
- Standard: **aus**. Der konkrete Hostinganbieter wird öffentlich nicht genannt.

## 5. Datenschutzerklärung (`/datenschutz/`)

Entwurf vorhanden, aber vor Veröffentlichung fachlich prüfen und ergänzen:

- [ ] Konkreten **Auftragsverarbeiter Hosting** und **Mailversand** rechtlich sauber
      benennen bzw. AV-Verträge referenzieren. Hinweis: Der Entwurf beschreibt Hosting/
      Mailversand aktuell **generisch** („Serverstandort Deutschland“) ohne Anbieternamen
      (auf Kundenwunsch). Prüfen, ob das den rechtlichen Anforderungen genügt oder der
      Anbieter genannt werden muss.
- [ ] Konkrete **Aufbewahrungsfrist** der Formularanfragen festlegen (statt generischer
      Formulierung) – `formRetentionPeriod` pflegen.
- [ ] Zuständige **Aufsichtsbehörde** ergänzen (Beschwerderecht).

## 6. Impressum (`/impressum/`)

- [ ] Vollständigkeit nach § 5 DDG / § 18 MStV prüfen (Adresse, Kontakt, Verantwortlicher).
- [ ] EU-Streitschlichtungstext fachlich bestätigen.

## 7. Barrierefreiheitserklärung (`/barrierefreiheit/`)

- [ ] Tatsächlichen Vereinbarkeitsstatus (z. B. nach BFSG/EN 301 549) prüfen und ergänzen.
- [ ] Bekannte Einschränkungen konkret auflisten.

## 8. Kontaktformular / SMTP

- [ ] Produktive `.env` mit echten SMTP-Zugangsdaten **oberhalb des Webroots** anlegen
      (siehe `docs/DEPLOYMENT_SHARED_HOSTING_DE.md`). Niemals ins Repo.
- [ ] `ALLOWED_ORIGIN` auf die echte Live-Domain setzen.

## 9. Preise (optional, Standard: aus)

- [ ] Erst veröffentlichen, wenn vollständig und bestätigt (`src/config/pricing.ts`,
      `site.showPricing`). Keine Laufzeiten/Preise erfinden.

## 10. Referenzen & Partner

- [ ] Echte Kundenprojekte ersetzen die Konzeptstudien erst nach ausdrücklicher Freigabe
      (Daten, Bilder, ggf. Kundenstimmen). Bis dahin bleibt das Badge
      „Konzeptstudie – kein Kundenprojekt“.
- [ ] Partnerprofile (Name/Bild/Text) nur mit Freigabe veröffentlichen; sonst neutrale
      Rollendarstellung (siehe `/agentur/`).
