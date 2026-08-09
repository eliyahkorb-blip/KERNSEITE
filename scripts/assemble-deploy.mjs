#!/usr/bin/env node
/**
 * Baut aus dem Produktions-Build (dist/) und der PHP-App (php/) ein Upload-Bündel
 * unter deploy/ zusammen.
 *
 * Voraussetzung: Zuvor `pnpm build:production` (echte Pflichtdaten) und
 * `node scripts/build-csp-hashes.mjs` ausführen.
 *
 * Ergebnis:
 *   deploy/public_html/         -> Inhalt von dist/ (statische Website)
 *   deploy/public_html/api/     -> php/api/ (contact.php, .htaccess, src/, vendor/)
 *
 * Die produktive .env gehört NICHT in dieses Bündel, sondern auf den Server
 * OBERHALB von public_html (siehe docs/DEPLOYMENT_SHARED_HOSTING_DE.md).
 *
 * Aufruf: node scripts/assemble-deploy.mjs
 */
import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const php = join(root, 'php');
const deploy = join(root, 'deploy');
const publicHtml = join(deploy, 'public_html');

// 1. Guard: kein Fixture-Build
execFileSync(process.execPath, [join(root, 'scripts/guard-no-fixture.mjs'), 'dist'], {
  stdio: 'inherit',
});

if (!existsSync(dist)) {
  console.error('dist/ fehlt. Zuerst `pnpm build:production` ausführen.');
  process.exit(1);
}

// 2. deploy/ neu aufbauen
rmSync(deploy, { recursive: true, force: true });
mkdirSync(publicHtml, { recursive: true });

// 3. Statische Website kopieren
cpSync(dist, publicHtml, { recursive: true });

// 4. Composer-Abhängigkeiten sicherstellen (vendor/ erzeugen)
const vendor = join(php, 'api', 'vendor');
if (!existsSync(vendor)) {
  console.log('vendor/ fehlt – führe `composer install --no-dev` aus …');
  try {
    execFileSync('composer', ['install', '--no-dev', '--optimize-autoloader', '--no-interaction'], {
      cwd: php,
      stdio: 'inherit',
    });
  } catch {
    console.error(
      'composer install fehlgeschlagen. Composer installieren oder vendor/ manuell bereitstellen.',
    );
    process.exit(1);
  }
}

// 5. PHP-App nach public_html/api kopieren (ohne composer.* – die bleiben im Repo)
const apiTarget = join(publicHtml, 'api');
cpSync(join(php, 'api'), apiTarget, { recursive: true });

console.log('\n✓ Deploy-Bündel erstellt: deploy/public_html/');
console.log('  Nächste Schritte (siehe docs/DEPLOYMENT_SHARED_HOSTING_DE.md):');
console.log('   1. Inhalt von deploy/public_html/ nach public_html/ hochladen.');
console.log('   2. Produktive .env OBERHALB von public_html anlegen (SMTP-Zugang).');
console.log('   3. vendor/ ist unter api/ per .htaccess gesperrt (Direktzugriff verweigert).');
