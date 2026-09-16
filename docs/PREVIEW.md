# Vorschau (vor dem Merge)

Die vollständige Website lässt sich vor dem Merge auf Smartphone und Desktop prüfen. Der
Vorschau-Build nutzt **echte Daten**, ist aber klar als Vorschau gekennzeichnet:

- `noindex` auf allen Seiten (keine Suchmaschinen-Indexierung)
- sichtbarer Hinweis **„Vorschau – nicht produktiv“**
- Kontaktformular **deaktiviert** (kein echter Mailversand)
- Marker `PREVIEW_DO_NOT_DEPLOY.txt` (der Deploy-Guard verhindert Upload aufs echte Hosting)

## Option 1 – Öffentliche Vorschau-URL (GitHub Pages, für das Smartphone)

Läuft auf dem **Repo-Unterpfad** `https://<owner>.github.io/KERNSEITE/`.

Einmalig einrichten:

1. GitHub → **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
   (Bei **privaten** Repositorys ist GitHub Pages nur mit passendem Plan verfügbar. Wenn Pages
   nicht verfügbar ist, nutze Option 2 oder 3.)
2. GitHub → **Actions → „Preview“ → „Run workflow“** (manuell starten, Branch auswählen).
3. Nach dem Lauf steht die URL im Job „pages“ (Environment „github-pages“).

Der Build wird dafür automatisch auf den Unterpfad `/KERNSEITE/` umgeschrieben
(`scripts/rebase-dist.mjs`), sodass CSS, JavaScript, Schriften und interne Links korrekt laden.

## Option 2 – Vorschau-Build als Artefakt (ohne Pages)

Bei jedem Pull-Request-Lauf erzeugt der Workflow **Preview** ein herunterladbares Artefakt:

1. GitHub → **Actions → „Preview“ → jüngster Lauf**.
2. Unter **Artifacts** `kernseite-preview` herunterladen und entpacken.
3. Lokal ausliefern (nicht per Doppelklick öffnen, sondern über einen kleinen Webserver),
   z. B.:
   ```bash
   cd kernseite-preview
   npx serve .        # oder: python3 -m http.server 4321
   ```
   Danach `http://localhost:3000` bzw. `:4321` öffnen.

## Option 3 – Lokale Vorschau (inkl. Smartphone im selben WLAN)

```bash
pnpm install
pnpm copy-fonts
pnpm build:preview      # echter-Daten-Build, noindex, Vorschau-Hinweis, Formular aus
pnpm preview:host       # bindet an alle Interfaces (0.0.0.0)
```

- Desktop: die angezeigte `http://localhost:4321/` öffnen.
- Smartphone (gleiches WLAN): die ebenfalls angezeigte Netzwerk-Adresse
  `http://<deine-lokale-IP>:4321/` am Handy öffnen.

## Hinweise

- Alle Seiten und Unterseiten sind enthalten; interne Links öffnen korrekt.
- Es werden **keine echten E-Mails** über das Formular gesendet (Vorschaumodus).
- Die Screenshots der Referenzprojekte (Kaya Döner, Kinderkörbchen) sind aktuell klar
  gekennzeichnete Platzhalter (die Live-Sites waren im Build-Environment nicht abrufbar).
