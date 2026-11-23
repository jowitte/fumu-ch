#!/usr/bin/env node
// Text-Vergleich zweier Build-Bäume (Redesign-Abnahme, docs/plans/2026-11-22-neues-design-umsetzung.md).
//
//   node scripts/text-diff.mjs <baseline-dir> <dist-dir>
//
// Liest jede .html-Datei beider Bäume, entfernt <script>, <style>, <svg>,
// Tags und Entities (dekodiert), nimmt Alt-Texte und aria-label mit und
// vergleicht die Wort-Multimengen je Seite. Ausgabe pro Seite «fehlt:» (nur
// in der Baseline) und «neu:» (nur im neuen Build). Exit 0 ohne
// Unterschiede, 1 mit Unterschieden, 2 bei falschem Aufruf.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const [baseDir, distDir] = process.argv.slice(2);
if (!baseDir || !distDir) {
  console.error('Aufruf: node scripts/text-diff.mjs <baseline-dir> <dist-dir>');
  process.exit(2);
}

const htmlFiles = (root) => {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (name.endsWith('.html')) out.push(relative(root, path));
    }
  };
  walk(root);
  return out.sort();
};

const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in named ? named[n.toLowerCase()] : ' '));

export const words = (html) => {
  const attrs = [];
  for (const m of html.matchAll(/\s(?:alt|aria-label)="([^"]*)"/g)) attrs.push(m[1]);
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode(`${text} ${attrs.join(' ')}`)
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
};

const count = (list) => {
  const m = new Map();
  for (const w of list) m.set(w, (m.get(w) ?? 0) + 1);
  return m;
};

const minus = (a, b) => {
  const out = [];
  for (const [w, n] of a) {
    const d = n - (b.get(w) ?? 0);
    if (d > 0) out.push(d > 1 ? `${w} (×${d})` : w);
  }
  return out;
};

const baseFiles = htmlFiles(baseDir);
const distFiles = htmlFiles(distDir);
const all = [...new Set([...baseFiles, ...distFiles])].sort();
let differences = 0;

for (const file of all) {
  const inBase = baseFiles.includes(file);
  const inDist = distFiles.includes(file);
  if (!inBase || !inDist) {
    console.log(`== ${file}: Seite ${inBase ? 'fehlt im neuen Build' : 'ist neu'}`);
    differences++;
    continue;
  }
  const a = count(words(readFileSync(join(baseDir, file), 'utf8')));
  const b = count(words(readFileSync(join(distDir, file), 'utf8')));
  const missing = minus(a, b);
  const added = minus(b, a);
  if (!missing.length && !added.length) continue;
  differences++;
  console.log(`== ${file}`);
  if (missing.length) console.log(`fehlt: ${missing.join(' · ')}`);
  if (added.length) console.log(`neu: ${added.join(' · ')}`);
}

if (!differences) console.log(`keine Unterschiede (${all.length} Seiten)`);
process.exit(differences ? 1 : 0);
