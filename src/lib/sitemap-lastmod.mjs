import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Der Sitemap-Hook in astro.config.mjs kennt nur die URL, nicht die Collection.
// Deshalb liest dieses Modul die Perspektiven-Frontmatter direkt: `updated`,
// sonst `date`, als ISO-Datum. Beide Felder sind reine YYYY-MM-DD-Werte
// (content.config.ts), ein YAML-Parser ist dafür nicht nötig.
const DIR = new URL('../content/perspektiven/', import.meta.url).pathname;
const FIELD = /^(date|updated):\s*['"]?(\d{4}-\d{2}-\d{2})/m;

function readLastmod() {
  const map = new Map();
  for (const file of readdirSync(DIR)) {
    if (!file.endsWith('.md')) continue;
    const head = readFileSync(join(DIR, file), 'utf8').split('\n---', 2)[0];
    const dates = {};
    for (const line of head.split('\n')) {
      const m = line.match(FIELD);
      if (m) dates[m[1]] = m[2];
    }
    const lastmod = dates.updated ?? dates.date;
    if (lastmod) map.set(file.replace(/\.md$/, ''), lastmod);
  }
  return map;
}

let cache;

// URL wie https://fumu.ch/perspektiven/zero-click/ → '2026-08-26' oder undefined.
export function perspektivenLastmod(url) {
  const m = url.match(/\/perspektiven\/([^/]+)\/?$/);
  if (!m || m[1] === 'themen') return undefined;
  cache ??= readLastmod();
  return cache.get(m[1]);
}
