// Loader für den AI-Crawler-Radar (/ai-crawler-radar).
// Quell-Wahrheit ist die Vault-Pipeline (publish.py), die bei jedem Lauf
// src/data/ai-crawler-tracker.json schreibt. Hier wird nur validiert und
// typisiert konsumiert – nie gerechnet, nie umformuliert.
// Bricht die Struktur, wirft parse() und `npm run build` wird rot.

import { z } from 'astro/zod';
import raw from './ai-crawler-tracker.json';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'erwartet YYYY-MM-DD');
const share = z.number().min(0).max(1);

const trackerSchema = z.object({
  meta: z.object({
    snapshot_date: isoDate,
    site_count: z.number().int().positive(),
    crawler_count: z.number().int().positive(),
    cadence_days: z.number().int().positive(),
    generated_at: z.string().min(1),
  }),
  headline: z.string().min(1),
  by_category: z
    .array(
      z.object({
        category: z.string().min(1),
        label: z.string().min(1),
        block_share: share,
        site_count: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  by_crawler: z
    .array(
      z.object({
        crawler_id: z.string().min(1),
        label: z.string().min(1),
        block_share: share,
        blocked_sites: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  trend: z
    .array(
      z.object({
        date: isoDate,
        // Nicht jeder Snapshot kennt jede Kategorie (Plattformen kamen erst
        // mit dem zweiten Lauf dazu) – deshalb Record statt festes Objekt.
        by_category: z.record(z.string(), share),
      }),
    )
    .min(1),
  methodology: z.array(z.string().min(1)).min(1),
  // Iteration 2 (Plan 2026-07-16): additive, optionale Felder. Fehlen sie,
  // rendert die Seite die betroffenen Sections nicht – der Kern-Vertrag
  // oben bleibt hart, diese hier brechen den Build nicht.
  runs: z
    .array(
      z.object({
        date: isoDate,
        changes: z.number().int().nonnegative(),
        sites_changed: z.number().int().nonnegative(),
        summary: z.string().min(1),
        commentary: z.string().min(1).nullable(),
      }),
    )
    .optional(),
  sites: z
    .array(
      z.object({
        name: z.string().min(1),
        domain: z.string().min(1),
        category: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .optional(),
  methodology_details: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .optional(),
});

export type CrawlerTracker = z.infer<typeof trackerSchema>;
export type CategoryShare = CrawlerTracker['by_category'][number];
export type CrawlerShare = CrawlerTracker['by_crawler'][number];
export type Run = NonNullable<CrawlerTracker['runs']>[number];
export type MonitoredSite = NonNullable<CrawlerTracker['sites']>[number];

export const tracker: CrawlerTracker = trackerSchema.parse(raw);

// Vorspann der Radar-Seite. Wortlaut aus der Vault-Story «Bot Analyzer»
// (Rückkanal 2026-07-16) – hier nie umformulieren, nur aus dem Vault nachziehen.
// Wird von der HTML-Seite und der .md-Route gemeinsam konsumiert.
export const intro =
  'fumu erhebt seit April 2026 alle 14 Tage, welche AI-Crawler die robots.txt von gut 100 Sites zulassen – Publisher mit und ohne Paywall, Plattformen, Brands und E-Commerce, Schwerpunkt Schweiz. Der Radar zeigt den jüngsten Snapshot und den Verlauf; robots.txt ist dabei Deklaration, nicht Crawl-Realität.';

// Serienfarben für den Trend: Farbe folgt der Kategorie, nie dem Rang.
// Palette aus den fumu-CI-Hues abgeleitet und mit dem dataviz-Validator
// geprüft (Lightness-Band, Chroma, CVD-Separation, Kontrast – alle PASS).
export const categoryColors: Record<string, string> = {
  platform: '#C44540',
  publisher_paywall: '#2F63AC',
  publisher_open: '#B07430',
  ecommerce: '#6B5EA7',
  brand: '#1F8A67',
};

const FALLBACK_COLOR = '#666666';

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? FALLBACK_COLOR;
}

// Anteil 0..1 → Schweizer Prozent-Schreibweise («53.3 %», ohne überflüssige Null).
export function formatShare(value: number): string {
  const pct = Math.round(value * 1000) / 10;
  const text = Number.isInteger(pct) ? String(pct) : pct.toFixed(1);
  return `${text} %`;
}

// ISO-Datum → «13.07.2026» (de-CH).
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}
