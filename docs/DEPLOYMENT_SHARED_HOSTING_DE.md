# Deployment – Deutsches Shared Hosting (aktiver Weg)

Diese Anleitung beschreibt den **aktiven Produktionsweg**: die statische Website als
HTML/CSS/JS plus einen gehärteten **PHP-Kontaktendpunkt** (SMTP via PHPMailer) auf einem
**Shared-Hosting-Anbieter mit Serverstandort in Deutschland**.

> Hinweis: Der konkrete Hostinganbieter wird bewusst nicht genannt. Wähle einen Anbieter
> mit dokumentiertem deutschen Serverstandort und aktivierbarem HTTPS/SSL.

## 1. Voraussetzungen

- Webhosting mit **Apache** und `.htaccess`-Unterstützung
- **PHP ≥ 8.1** (für den Kontaktendpunkt)
- Ein **E-Mail-Postfach** beim Hoster (für SMTP-Versand)
- **HTTPS/SSL** (z. B. Let's Encrypt) aktiviert
- Möglichkeit, Dateien **oberhalb** des Webroots (`public_html`) abzulegen (für die `.env`)
- Lokal: Node ≥ 20, pnpm, Composer

## 2. Echte Pflichtangaben eintragen

Der Produktions-Build ist **bewusst gesperrt**, solange Pflichtangaben fehlen. Trage die
echten Werte ein:

- `src/config/company.ts` → `street`, `postalCode`, `city`, `email`, `phone` (Pflicht),
  optional `vatId`, `hostingProvider`, `hostingLocation`, `mailProvider`, `socialLinks`.
- `src/config/site.ts` → `url` (Produktions-Domain). Optional `showHostingClaim: true`
  **nur**, wenn der deutsche Serverstandort tatsächlich bestätigt ist.
- Details/Checkliste: `docs/LEGAL_TODO.md`.

## 3. Produktions-Build erstellen

```bash
pnpm install
pnpm copy-fonts                # falls public/fonts noch leer ist
pnpm build:production          # bricht ab, falls Pflichtangaben fehlen
```

`build:production` erzeugt `dist/` und füllt die CSP-Hashes in `dist/.htaccess`.

## 4. Upload-Bündel zusammenstellen

```bash
node scripts/assemble-deploy.mjs
```

Das erzeugt `deploy/public_html/` mit:

```
deploy/public_html/            # gesamte statische Website (Inhalt von dist/)
  .htaccess                    # HTTPS-Redirect, CSP, Security-Header, Caching
  404.html                     # Fehlerseite (ErrorDocument 404 /404.html)
  api/
    contact.php                # einziger direkt erreichbarer Endpunkt
    .htaccess                  # sperrt alles außer contact.php
    bootstrap.php, src/, vendor/   # per .htaccess/Guard gesperrt
```

## 5. Dateien hochladen

1. Inhalt von `deploy/public_html/` in den Webroot (`public_html/`) hochladen.
2. Sicherstellen, dass die **`.htaccess`-Dateien** mit übertragen wurden (versteckte Dateien
   im FTP-Client anzeigen).

## 6. Produktive `.env` anlegen (Zugangsdaten – niemals ins Repo!)

Lege die `.env` **oberhalb** des Webroots an, z. B. `/home/DEIN_USER/kernseite.env`
(nicht öffentlich erreichbar). Vorlage: `.env.example`.

```dotenv
SMTP_HOST=smtp.dein-hoster.example
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USER=postfach@deine-domain.de
SMTP_PASS=DEIN_ECHTES_PASSWORT
SMTP_FROM=postfach@deine-domain.de
SMTP_FROM_NAME=KERNSEITE Website
CONTACT_TO=anfrage@deine-domain.de
ALLOWED_ORIGIN=https://deine-domain.de
RATE_LIMIT_PER_HOUR=5
```

`bootstrap.php` sucht die `.env` in dieser Reihenfolge:
`KERNSEITE_ENV_PATH` (falls gesetzt) → `../../kernseite.env` → `../../.env` → `../.env` → `./.env`.
Empfohlen ist der Pfad **oberhalb** von `public_html`.

## 7. Composer-Abhängigkeiten (`vendor/`)

`assemble-deploy.mjs` kopiert das lokal erzeugte `vendor/` mit. Alternativ auf dem Server:

```bash
cd public_html/api
composer install --no-dev --optimize-autoloader
```

Der direkte Zugriff auf `vendor/`, `src/` und `bootstrap.php` ist per `api/.htaccess`
gesperrt (`Require all denied`); zusätzlich verweigern die PHP-Dateien den Direktaufruf
über eine Guard-Konstante.

## 8. HTTPS, www-Weiterleitung und HSTS

1. SSL/HTTPS beim Hoster aktivieren und prüfen, dass die Seite über `https://` lädt.
2. **www-Canonical:** Die Hauptdomain ist `https://www.kernseite.de`. Die Weiterleitung von
   `kernseite.de` → `www.kernseite.de` übernimmt die `.htaccess` (301). Stelle sicher, dass im
   DNS **beide** Hostnamen (`kernseite.de` und `www.kernseite.de`) auf den Server zeigen und das
   SSL-Zertifikat beide abdeckt.
3. **Erst danach** in `public_html/.htaccess` die HSTS-Zeile aktivieren (auskommentierten
   `Strict-Transport-Security`-Header freischalten).

## 9. Test-Checkliste (Live)

- [ ] Startseite und alle Unterseiten laden über HTTPS
- [ ] `https://deine-domain.de/robots.txt` und `/sitemap-index.xml` erreichbar
- [ ] 404-Seite erscheint bei unbekannter URL
- [ ] Kontaktformular sendet eine echte E-Mail (Test-Anfrage)
- [ ] Direktaufruf von `/api/bootstrap.php`, `/api/src/…`, `/api/vendor/…` → 403
- [ ] Browser-Konsole zeigt keine CSP-Verstöße
- [ ] `.env` ist **nicht** über den Browser erreichbar

## 10. Deploy-Schutz gegen Fixture-Builds

Niemals einen `build:ci`-Output deployen. Vor jedem Upload:

```bash
node scripts/guard-no-fixture.mjs dist
```

Bricht ab, wenn Fixture-Marker (`.ci-fixture`, `CI_FIXTURE_DO_NOT_DEPLOY.txt`) vorhanden sind.

## 11. Aktualisierungen

Bei Änderungen: `pnpm build:production` → `node scripts/assemble-deploy.mjs` → HTML/Assets
neu hochladen. Der PHP-Teil ändert sich nur, wenn `php/` angepasst wurde.
