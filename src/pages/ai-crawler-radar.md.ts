// Markdown-Zwilling des AI-Crawler-Radars – rendert die Live-Daten aus dem
// Loader als Tabellen. Bewusst NICHT aus der pages-Collection gespeist
// (dort steht nur der stabile Vorspann): so können Seite und .md-Variante
// bei jedem Snapshot nicht auseinanderdriften. [slug].md.ts nimmt diese
// Seite deshalb aus.
import type { APIRoute } from 'astro';
import { tracker, intro, formatDate, formatShare } from '../data/crawler-tracker';

export const GET: APIRoute = async () => {
  const categories = [...tracker.by_category].sort((a, b) => b.block_share - a.block_share);
  const crawlers = [...tracker.by_crawler].sort((a, b) => b.block_share - a.block_share);

  const categoryRows = categories
    .map((c) => `| ${c.label} | ${formatShare(c.block_share)} | ${c.site_count} |`)
    .join('\n');

  const crawlerRows = crawlers
    .map((c) => `| ${c.label} | ${formatShare(c.block_share)} | ${c.blocked_sites} |`)
    .join('\n');

  const trendHeader = `| Snapshot | ${categories.map((c) => c.label).join(' | ')} |`;
  const trendDivider = `|---|${categories.map(() => '---|').join('')}`;
  const trendRows = tracker.trend
    .map((s) => {
      const cells = categories.map((c) => {
        const value = s.by_category[c.category];
        return value !== undefined ? formatShare(value) : '–';
      });
      return `| ${s.date} | ${cells.join(' | ')} |`;
    })
    .join('\n');

  const methodology = tracker.methodology.map((note) => `- ${note}`).join('\n');

  const body = `# AI-Crawler-Radar

Snapshot vom ${formatDate(tracker.meta.snapshot_date)} · ${tracker.meta.site_count} Sites × ${tracker.meta.crawler_count} Crawler · Erhebung alle ${tracker.meta.cadence_days} Tage

${tracker.headline}

${intro}

## Block-Anteil nach Kategorie

| Kategorie | Block-Anteil | Sites |
|---|---|---|
${categoryRows}

## Block-Anteil nach Crawler

Anteil der ${tracker.meta.site_count} Sites, die den jeweiligen Crawler per robots.txt blockieren.

| Crawler | Block-Anteil | Blockierende Sites |
|---|---|---|
${crawlerRows}

## Verlauf (Block-Anteil je Kategorie)

${trendHeader}
${trendDivider}
${trendRows}

## Methodik

${methodology}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
