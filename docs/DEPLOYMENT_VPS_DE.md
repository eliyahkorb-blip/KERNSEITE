# Deployment – Deutscher VPS (Alternative, nur Anleitung)

Diese Datei beschreibt eine **alternative** Formularlösung für einen **VPS mit Standort in
Deutschland**. Sie ist **nicht** der aktive Produktionsweg (siehe
`DEPLOYMENT_SHARED_HOSTING_DE.md`) und im Repository **nicht verdrahtet**. Nutze sie nur,
wenn du das Formular bewusst über einen kleinen Node-/Express-Dienst statt über PHP betreiben
möchtest.

> Hinweis: Der konkrete Hostinganbieter wird bewusst nicht genannt. Wähle einen VPS-Anbieter
> mit dokumentiertem deutschen Serverstandort.

## Architektur

- Die **statische Website** (`dist/`) wird von einem Webserver (nginx/Caddy/Apache)
  ausgeliefert.
- Ein **kleiner gehärteter Node-/Express-Endpunkt** nimmt `POST /api/contact` entgegen und
  versendet die Anfrage per SMTP (z. B. mit `nodemailer`).
- Zugangsdaten liegen ausschließlich in einer serverseitigen `.env` (systemd `EnvironmentFile`
  oder Secrets-Manager), **niemals** im Repository.

## Beispiel-Endpunkt (Referenz, nicht Teil des Builds)

```js
// server/contact-server.mjs  (Beispiel – müsste separat angelegt werden)
import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app = express();
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

// Same-Origin-/Origin-Referer-Prüfung (kein behaupteter Token-CSRF)
app.use('/api/contact', (req, res, next) => {
  const origin = req.get('origin');
  const referer = req.get('referer');
  if (ALLOWED_ORIGIN) {
    const ok = origin
      ? origin.replace(/\/$/, '') === ALLOWED_ORIGIN.replace(/\/$/, '')
      : referer
        ? referer.startsWith(ALLOWED_ORIGIN)
        : false;
    if (!ok) return res.status(403).json({ ok: false, message: 'Herkunft ungültig.' });
  }
  next();
});

app.use('/api/contact', rateLimit({ windowMs: 3600_000, max: 5 }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'ssl',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

app.post('/api/contact', async (req, res) => {
  const b = req.body;
  if (b.website2) return res.json({ ok: true }); // Honeypot
  if (b.rendered_at && Date.now() - Number(b.rendered_at) < 3000) {
    return res.status(429).json({ ok: false, message: 'Zu schnell.' });
  }
  if (
    !b.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '') ||
    (b.message || '').length < 10
  ) {
    return res.status(422).json({ ok: false, message: 'Bitte Eingaben prüfen.' });
  }
  try {
    await transporter.sendMail({
      from: `"KERNSEITE Website" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_TO,
      replyTo: b.email,
      subject: 'Neue Anfrage über die Website',
      text: `Name: ${b.name}\nE-Mail: ${b.email}\n\n${b.message}`,
    });
    res.json({ ok: true, message: 'Danke!' });
  } catch {
    res.status(500).json({ ok: false, message: 'Senden derzeit nicht möglich.' });
  }
});

app.listen(3000);
```

Zusätzlich nötig: `express`, `express-rate-limit`, `nodemailer` (separates `package.json` im
`server/`-Verzeichnis), ein Reverse-Proxy (nginx/Caddy) mit TLS, und die gleichen
Security-Header/CSP wie in `public/.htaccess` (auf nginx/Caddy übertragen).

## Betrieb

- Prozess dauerhaft halten (systemd-Service oder PM2).
- `.env`/Secrets nur serverseitig; kein Secret im Repository.
- Frontend: `ContactForm` postet an `/api/contact` statt `/api/contact.php` – dazu die
  `ACTION`-Konstante in `src/components/ContactForm.astro` anpassen.

## Wann welcher Weg?

- **Shared Hosting (PHP)** – Standard, kein Dauerprozess nötig → `DEPLOYMENT_SHARED_HOSTING_DE.md`.
- **VPS (Node)** – nur, wenn ohnehin ein VPS betrieben wird und ein Node-Dienst gewünscht ist.

Entscheide dich für **genau einen** Weg und dokumentiere ihn.
