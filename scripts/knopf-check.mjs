#!/usr/bin/env node
// Prüft die Knöpfe nach dem Papierriss-Umbau (docs/plans/2026-11-23-riss-kante-umsetzung.md):
// Jeder .btn zeichnet seine Fläche in ::before mit Riss-Maske, wird beim
// Hover dunkler, zeigt per Tastatur einen Fokusring und hat im Windows-
// Kontrastmodus (forced-colors) einen Rahmen. Der Newsletter-Knopf ist ein
// .btn und bleibt im Zustand disabled halbtransparent.
//
//   npm run build && node scripts/knopf-check.mjs [dist-dir]
//
// Eigener Static-Server auf freiem Port; playwright-core wie in
// scripts/overflow-check.mjs (PLAYWRIGHT_CORE). Exit 0 ohne Befund, 1 mit Befund.

import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const playwrightPath =
  process.env.PLAYWRIGHT_CORE ?? '/Users/jochen.witte/Data/Akasha/.claude/lib/publish/node_modules/playwright-core';
const { chromium } = createRequire(import.meta.url)(playwrightPath);

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer((req, res) => {
  let file = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(dist) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const befunde = [];
const melde = (wo, was) => befunde.push(`${wo}: ${was}`);
const CORAL = 'rgb(196, 69, 64)';
// Summe der drei Kanäle in 0–255; versteht rgb(…) und color(srgb …) (color-mix liefert das zweite).
const summe = farbe => {
  const werte = (farbe.match(/[\d.]+/g) ?? []).map(Number);
  const kanaele = farbe.startsWith('color(srgb') ? werte.slice(0, 3).map(v => v * 255) : werte.slice(0, 3);
  return kanaele.reduce((a, b) => a + b, 0);
};

const browser = await chromium.launch();
for (const [path, width] of [['/', 1280], ['/', 400], ['/kontakt/', 1280], ['/kontakt/', 400]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base + path, { waitUntil: 'load' });
  const knoepfe = page.locator('.btn');
  const anzahl = await knoepfe.count();
  if (!anzahl) melde(`${path} ${width}`, 'kein .btn gefunden');

  for (let i = 0; i < anzahl; i++) {
    const knopf = knoepfe.nth(i);
    const name = `${path} ${width} .btn[${i}] «${(await knopf.textContent())?.trim()}»`;
    if (!(await knopf.isVisible())) continue;
    const vorher = await knopf.evaluate(el => {
      const s = getComputedStyle(el, '::before');
      return { maske: s.maskImage || s.webkitMaskImage || '', farbe: s.backgroundColor };
    });
    if (!vorher.maske.includes('data:image/svg+xml')) melde(name, 'keine Riss-Maske am ::before');
    if (vorher.farbe !== CORAL) melde(name, `Fläche ist ${vorher.farbe}, nicht Coral`);
    await knopf.hover();
    const hover = await knopf.evaluate(el => getComputedStyle(el, '::before').backgroundColor);
    if (!(summe(hover) < summe(CORAL))) melde(name, `Hover dunkelt nicht (${hover})`);
    await page.mouse.move(0, 0);
  }

  // Fokus per Tastatur: Tab bis zum ersten .btn, dann muss ein Ring stehen
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  let fokus = null;
  for (let i = 0; i < 40 && !fokus; i++) {
    await page.keyboard.press('Tab');
    fokus = await page.evaluate(() => (document.activeElement?.classList.contains('btn') ? getComputedStyle(document.activeElement).outlineStyle : null));
  }
  if (fokus !== 'solid') melde(`${path} ${width}`, `Fokusring am .btn fehlt (${fokus})`);

  if (path === '/kontakt/') {
    const nl = page.locator('form.newsletter-form button[type="submit"]');
    if (!(await nl.evaluate(el => el.classList.contains('btn')))) melde(`${path} ${width}`, 'Newsletter-Knopf trägt kein .btn');
    const deckkraft = await nl.evaluate(el => { el.disabled = true; return Number(getComputedStyle(el).opacity); });
    if (!(deckkraft < 1)) melde(`${path} ${width}`, `Newsletter-Knopf disabled nicht halbtransparent (${deckkraft})`);
  }

  await page.emulateMedia({ forcedColors: 'active' });
  const rahmen = await page.locator('.btn').first().evaluate(el => {
    const s = getComputedStyle(el);
    return `${s.borderTopStyle} ${s.borderTopWidth}`;
  });
  if (rahmen.startsWith('none') || rahmen.endsWith(' 0px')) melde(`${path} ${width}`, `kein Rahmen im Kontrastmodus (${rahmen})`);
  await page.close();
}
await browser.close();
server.close();

for (const b of befunde) console.log(b);
console.log(befunde.length ? `${befunde.length} Befunde` : 'Knöpfe in Ordnung');
process.exit(befunde.length ? 1 : 0);
