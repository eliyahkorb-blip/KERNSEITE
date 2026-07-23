#!/usr/bin/env node
/**
 * Prüft, dass der Build keine AUSFÜHRBAREN Inline-Scripts und keine Inline-Styles enthält
 * (Korrektur 9): ausführbare Scripts/Styles werden extern ausgeliefert, damit die CSP
 * ohne 'unsafe-inline' funktioniert. Nicht-ausführbares JSON-LD ist erlaubt.
 *
 * Aufruf: node scripts/check-no-inline.mjs [distDir=dist]
 */
import { readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');

const problems = [];

for (const file of walk(dist, ['.html'])) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dist, file);

  // 1. Inline <script> ohne src, deren type ausführbar ist (nicht application/ld+json)
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const body = m[2].trim();
    if (/\bsrc=/.test(attrs)) continue; // externe Datei -> ok
    if (body === '') continue;
    const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : '';
    const isData = type === 'application/ld+json';
    if (!isData) {
      problems.push(`${rel}: ausführbares Inline-<script> (type="${type || 'text/javascript'}")`);
    }
  }

  // 2. Inline <style>-Blöcke
  const styleBlocks = html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
  if (styleBlocks) problems.push(`${rel}: ${styleBlocks.length}x Inline-<style>-Block`);

  // 3. Inline style="" Attribute
  const styleAttrs = html.match(/\sstyle=["'][^"']*["']/gi);
  if (styleAttrs) problems.push(`${rel}: ${styleAttrs.length}x style=""-Attribut`);

  // 4. Inline Event-Handler (onclick, onload, ...)
  const handlers = html.match(/\son[a-z]+=["']/gi);
  if (handlers) problems.push(`${rel}: ${handlers.length}x Inline-Event-Handler`);
}

if (problems.length) {
  console.error(`✗ Inline-Script/-Style gefunden (${problems.length}):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('✓ Keine ausführbaren Inline-Scripts/-Styles (CSP-tauglich).');
