#!/usr/bin/env node
// Favicon, Touch-Icon und Standard-OG-Bild aus dem Schriftzug «fumu.»
// (Redesign 2026-11, Entwurf docs/plans/2026-11-22-neues-design-entwurf.md,
// Entscheid 7). Rendert HTML-Vorlagen mit der self-hosted Instrument Serif
// aus public/fonts/ in Chromium und schreibt:
//
//   public/favicon-16x16.png, public/favicon-32x32.png   Icon «f.»
//   public/apple-touch-icon.png (180 px)                 Icon «f.»
//   public/favicon.ico (16 + 32, über ImageMagick `magick`)
//   public/images/og-default.png (1200 × 630)            Schriftzug, Claim, Papierkante
//
// Aufruf: node scripts/brand-assets.mjs
//
// Abhängigkeiten bewusst nicht im Repo: playwright-core wird aus einem
// bestehenden Checkout geladen, Pfad über die Umgebungsvariable
// PLAYWRIGHT_CORE (Default: die Publish-Lib im Akasha-Vault), dazu ein
// installiertes Chromium von Playwright und `magick` (ImageMagick) im PATH.
// Node ≥ 22.18 lädt src/lib/torn-paper.ts direkt (Type Stripping).

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tornEdge } from '../src/lib/torn-paper.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const playwrightPath =
  process.env.PLAYWRIGHT_CORE ?? '/Users/jochen.witte/Data/Akasha/.claude/lib/publish/node_modules/playwright-core';
const { chromium } = createRequire(import.meta.url)(playwrightPath);

// Als Data-URL eingebettet: Eine Seite aus setContent() darf keine file://-Schriften laden.
const font = name =>
  `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', name)).toString('base64')}`;
const colors = {
  white: '#FFFFFF',
  plum: '#43233B',
  plumSoft: '#6B4A63',
  coral: '#C44540',
  blush: '#F3D9C4',
};

const fontFaces = `
  @font-face { font-family: 'Instrument Serif'; font-weight: 400; src: url('${font('instrument-serif-latin.woff2')}') format('woff2'); }
`;

/** Icon «f.»: Serif in Pflaume auf Weiss, der Punkt in Coral. */
const iconHtml = size => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  * { margin: 0; padding: 0; }
  html, body { width: ${size}px; height: ${size}px; background: ${colors.white}; overflow: hidden; }
  body { display: grid; place-items: center; }
  .mark { font: 400 ${size * 0.96}px/1 'Instrument Serif'; color: ${colors.plum}; letter-spacing: -0.04em; transform: translateY(${size * -0.02}px); }
  .mark span { color: ${colors.coral}; }
  /* Die Serif hat nur Schnitt 400: Bei Favicon-Grösse verschwinden die
     Haarlinien, eine Kontur in derselben Farbe gibt dem Zeichen Gewicht. */
  .mark { -webkit-text-stroke: ${size <= 32 ? size / 24 : 0}px ${colors.plum}; }
  .mark span { -webkit-text-stroke-color: ${colors.coral}; }
</style></head><body><div class="mark">f<span>.</span></div></body></html>`;

/** OG-Bild: Weiss, Schriftzug «fumu.», Claim, unten eine Papierkante in Rosé. */
const ogHtml = () => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; background: ${colors.white}; overflow: hidden; }
  body { position: relative; padding: 120px 96px 0; }
  .logo { font: 400 140px/1 'Instrument Serif'; color: ${colors.plum}; letter-spacing: -0.01em; }
  .logo span { color: ${colors.coral}; }
  .claim { margin-top: 28px; font: 400 52px/1.1 'Instrument Serif'; color: ${colors.plumSoft}; letter-spacing: -0.01em; }
  .papier { position: absolute; left: 0; right: 0; bottom: 0; height: 120px; background: ${colors.blush}; }
  .papier::before { content: ''; position: absolute; left: 0; right: 0; top: -22px; height: 24px; background: ${colors.blush}; clip-path: ${tornEdge(3)}; }
</style></head><body>
  <div class="logo">fumu<span>.</span></div>
  <div class="claim">Technologie in Wirkung übersetzen.</div>
  <div class="papier"></div>
</body></html>`;

const render = async (browser, html, width, height, path) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() =>
    ['Instrument Serif'].filter(f => !document.fonts.check(`16px "${f}"`)),
  );
  if (missing.length) throw new Error(`Schrift nicht geladen: ${missing.join(', ')}`);
  await page.screenshot({ path, omitBackground: false });
  await page.close();
  console.log(path);
};

const browser = await chromium.launch();
try {
  await render(browser, iconHtml(16), 16, 16, join(root, 'public/favicon-16x16.png'));
  await render(browser, iconHtml(32), 32, 32, join(root, 'public/favicon-32x32.png'));
  await render(browser, iconHtml(180), 180, 180, join(root, 'public/apple-touch-icon.png'));
  await render(browser, ogHtml(), 1200, 630, join(root, 'public/images/og-default.png'));
} finally {
  await browser.close();
}

execFileSync('magick', [
  join(root, 'public/favicon-16x16.png'),
  join(root, 'public/favicon-32x32.png'),
  join(root, 'public/favicon.ico'),
]);
console.log(join(root, 'public/favicon.ico'));
