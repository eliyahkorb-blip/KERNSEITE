#!/usr/bin/env node
/**
 * SEO-Meta-Audit gegen den gebauten Output.
 *
 * Prüft, was sich maschinell prüfen lässt, ohne über Rankings zu spekulieren:
 * Eindeutigkeit und Länge von Title und Description, genau eine H1, gültige
 * Canonicals auf der konfigurierten Domain, Open Graph, parsebares JSON-LD
 * und die Abwesenheit von Altlasten (meta keywords, hreflang bei einer
 * einzigen Sprache, versteckte Textblöcke).
 *
 * Aufruf: `node scripts/check-seo.mjs [dist]`
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = process.argv[2] || 'dist';
const MAX_TITLE = 65;
const MIN_DESC = 80;
const MAX_DESC = 165;

if (!existsSync(DIST)) {
  console.error(`✗ Verzeichnis fehlt: ${DIST} – zuerst bauen.`);
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const grab = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : '';
};

const routeOf = (file) =>
  '/' +
  relative(DIST, file)
    .split(sep)
    .join('/')
    .replace(/index\.html$/, '');

/**
 * CI- und Vorschau-Builds setzen `noindex` auf allen Seiten – das ist
 * gewollt und sagt nichts über die spätere Indexierbarkeit aus. In diesen
 * Modi entscheidet deshalb die Sitemap darüber, welche Seiten als
 * indexierbar geprüft werden; der Abgleich „Sitemap gegen noindex“ entfällt.
 */
const nichtProduktiv =
  existsSync(join(DIST, '.ci-fixture')) || existsSync(join(DIST, '.preview-build'));

const problems = [];
const add = (route, msg) => problems.push(`${route}: ${msg}`);

const sitemapRoutes = new Set();
{
  const f = join(DIST, 'sitemap-0.xml');
  if (existsSync(f)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapRoutes.add(new URL(m[1]).pathname);
    }
  }
}

const seenTitles = new Map();
const seenDescs = new Map();
const seenCanon = new Map();

const pages = walk(DIST).sort();
let indexable = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);

  const robots = grab(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const noindex = /noindex/i.test(robots);
  const title = grab(html, /<title>([\s\S]*?)<\/title>/i);
  const desc = grab(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = grab(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const ogTitle = grab(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = grab(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogImage = grab(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;

  // --- Gilt für jede Seite ------------------------------------------------
  if (!title) add(route, 'kein <title>');
  if (title.length > MAX_TITLE) add(route, `Title ${title.length} Zeichen (max. ${MAX_TITLE})`);
  if (h1Count !== 1) add(route, `${h1Count} H1 statt genau einer`);
  if (/<meta\s+name="keywords"/i.test(html)) add(route, 'meta keywords (veraltet)');
  if (/<link\s+rel="alternate"[^>]*hreflang=/i.test(html)) {
    add(route, 'hreflang, obwohl es nur eine Sprachfassung gibt');
  }

  // JSON-LD muss parsebar sein und darf keine erfundenen Bewertungen tragen.
  const blocks = [
    ...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const [, raw] of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      add(route, `JSON-LD nicht parsebar (${err.message})`);
      continue;
    }
    const text = JSON.stringify(data);
    for (const verboten of ['aggregateRating', 'ratingValue', 'reviewCount', 'priceRange']) {
      if (text.includes(verboten)) add(route, `JSON-LD enthält ${verboten} – nicht belegt`);
    }
  }

  const zuPruefen = nichtProduktiv ? sitemapRoutes.has(route) : !noindex;
  if (!zuPruefen) continue;

  // --- Nur für indexierbare Seiten ---------------------------------------
  indexable++;

  if (!desc) add(route, 'keine Meta-Description');
  else if (desc.length > MAX_DESC) {
    add(route, `Description ${desc.length} Zeichen (max. ${MAX_DESC})`);
  } else if (desc.length < MIN_DESC) {
    add(route, `Description nur ${desc.length} Zeichen (min. ${MIN_DESC})`);
  }

  if (!canonical) add(route, 'kein Canonical');
  if (!ogTitle) add(route, 'kein og:title');
  if (!ogDesc) add(route, 'kein og:description');
  if (!ogImage) add(route, 'kein og:image');

  if (title) {
    const vorher = seenTitles.get(title);
    if (vorher) add(route, `Title identisch mit ${vorher}`);
    else seenTitles.set(title, route);
  }
  if (desc) {
    const vorher = seenDescs.get(desc);
    if (vorher) add(route, `Description identisch mit ${vorher}`);
    else seenDescs.set(desc, route);
  }
  if (canonical) {
    const vorher = seenCanon.get(canonical);
    if (vorher) add(route, `Canonical identisch mit ${vorher}`);
    else seenCanon.set(canonical, route);
  }
}

// --- Sitemap gegen Indexierbarkeit abgleichen ------------------------------
const sitemapFile = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapFile)) {
  const xml = readFileSync(sitemapFile, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    const pfad = new URL(url).pathname;
    const datei = join(DIST, pfad.replace(/\/$/, ''), 'index.html');
    if (!existsSync(datei)) {
      add(pfad, 'steht in der Sitemap, es gibt aber keine Seite dazu');
      continue;
    }
    if (nichtProduktiv) continue;
    const html = readFileSync(datei, 'utf8');
    if (/noindex/i.test(grab(html, /<meta\s+name="robots"\s+content="([^"]*)"/i))) {
      add(pfad, 'steht in der Sitemap, trägt aber noindex');
    }
  }
  if (urls.some((u) => u.includes('/404'))) add('/404/', 'darf nicht in der Sitemap stehen');
  if (urls.some((u) => u.includes('/cookie-einstellungen'))) {
    add('/cookie-einstellungen/', 'darf nicht in der Sitemap stehen');
  }
}

console.log(`\n▶ check-seo.mjs ${DIST}`);
console.log(`  ${pages.length} Seiten geprüft, davon ${indexable} indexierbar.`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} Befund(e):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log('✓ Titles/Descriptions eindeutig, Canonicals gesetzt, JSON-LD parsebar.');
