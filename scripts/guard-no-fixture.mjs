#!/usr/bin/env node
/**
 * Deploy-Guard: verhindert das Hochladen eines CI-/Fixture-Builds.
 * Bricht mit Exit-Code 1 ab, wenn im Zielverzeichnis Fixture-Marker liegen.
 *
 * Aufruf: node scripts/guard-no-fixture.mjs [dir=dist]
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');

const markers = [
  '.ci-fixture',
  'CI_FIXTURE_DO_NOT_DEPLOY.txt',
  '.preview-build',
  'PREVIEW_DO_NOT_DEPLOY.txt',
];
const found = markers.filter((m) => existsSync(join(dir, m)));

if (found.length > 0) {
  console.error(
    `\n✗ DEPLOY BLOCKIERT: Nicht-produktiver Build-Marker in ${dir} gefunden (${found.join(', ')}).\n` +
      `  Dieses Verzeichnis stammt aus \`build:ci\` oder \`build:preview\` und darf NICHT auf das\n` +
      `  produktive Hosting deployt werden. Für ein Deployment \`pnpm build:production\`\n` +
      `  mit vollständigen Echtdaten verwenden.\n`,
  );
  process.exit(1);
}

console.log(`✓ Kein Nicht-Deploy-Marker in ${dir} – Deploy erlaubt.`);
