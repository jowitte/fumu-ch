#!/usr/bin/env node
// Überlauf-Prüfung (Redesign-Abnahme, docs/plans/2026-11-22-neues-design-umsetzung.md):
// öffnet jede Seite aus dist/ bei 400 px Breite und meldet, wo die Seite
// breiter wird als der Bildschirm (scrollWidth > 400), samt der Elemente,
// die rechts hinausragen.
//
//   npm run build && node scripts/overflow-check.mjs [dist-dir] [breite]
//
// Liefert dist/ über einen eigenen kleinen Static-Server auf einem freien
// Port aus (kein npm run preview, kein fester Port). playwright-core kommt
// wie in scripts/brand-assets.mjs aus einem bestehenden Checkout
// (PLAYWRIGHT_CORE). Exit 0 ohne Befund, 1 mit Befund.

import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const width = Number(process.argv[3] ?? 400);
const playwrightPath =
  process.env.PLAYWRIGHT_CORE ?? '/Users/jochen.witte/Data/Akasha/.claude/lib/publish/node_modules/playwright-core';
const { chromium } = createRequire(import.meta.url)(playwrightPath);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(dist, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(dist) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const pages = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) pages.push('/' + relative(dist, path).replace(/index\.html$/, ''));
  }
};
walk(dist);
pages.sort();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
let findings = 0;
for (const path of pages) {
  await page.goto(base + path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(limit => {
    const scrollWidth = document.documentElement.scrollWidth;
    const offenders = [];
    if (scrollWidth > limit) {
      for (const el of document.body.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect();
        if (rect.right > limit + 0.5 && rect.width > 0) {
          const name = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '');
          offenders.push(`${name} (rechts ${Math.round(rect.right)} px)`);
        }
      }
    }
    return { scrollWidth, offenders: offenders.slice(0, 5) };
  }, width);
  if (result.scrollWidth > width) {
    findings++;
    console.log(`${path}: scrollWidth ${result.scrollWidth} > ${width}`);
    for (const o of result.offenders) console.log(`  ${o}`);
  }
}
await browser.close();
server.close();

console.log(findings ? `${findings} von ${pages.length} Seiten laufen über` : `kein Überlauf bei ${width} px (${pages.length} Seiten)`);
process.exit(findings ? 1 : 0);
