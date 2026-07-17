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
        // Additive Typ-Metadaten (publish.py ab 2026-07-17): Vier-Typen-
        // Taxonomie aus crawlers.yaml. Optional, damit ältere JSON-Stände
        // den Build nicht brechen.
        bot_category: z.string().min(1).optional(),
        honors_robots: z.boolean().optional(),
        provider: z.string().min(1).nullable().optional(),
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
        // null beim Erst-Snapshot (2026-04-27): kein Diff-Vorgänger vorhanden.
        changes: z.number().int().nonnegative().nullable(),
        sites_changed: z.number().int().nonnegative().nullable(),
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
// (Rückkanal 2026-07-16, revidiert am selben Tag: erklärt das Warum und
// verlinkt die Perspektiven) – hier nie umformulieren, nur aus dem Vault
// nachziehen. Absätze mit Inline-Links im Markdown-Format; HTML-Seite
// rendert via renderInlineLinks, die .md-Route nimmt sie roh.
export const intro = [
  "AI-Plattformen lesen das Web in industriellem Massstab, schicken aber kaum Besucher zurück – bei Anthropic kommen auf einen weitergeleiteten Leser rund 24'000 Crawls ([99 Prozent Zero-Click](/perspektiven/zero-click/)). Ob eine Site das mitmacht, deklariert sie in ihrer robots.txt: Dort steht, welche AI-Crawler sie zulässt – für Training, für Suche oder gar nicht.",
  'Der Radar verfolgt diese Deklarationen. fumu erhebt seit April 2026 alle 14 Tage die robots.txt von gut 100 Sites – Publisher mit und ohne Paywall, Plattformen, Brands und E-Commerce, Schwerpunkt Schweiz – und wertet sie gegen 20 dokumentierte AI-Crawler aus. robots.txt ist dabei Deklaration, nicht Crawl-Realität; das strukturelle Muster hinter der Bewegung beschreibt [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/).',
];

// Markdown-Inline-Links ([Text](url)) zu <a> auflösen – mehr Markdown können
// intro und Lauf-Summaries bewusst nicht (Vertrag mit tracker-content.yaml).
// Escaped vorher HTML-Sonderzeichen, damit set:html gefahrlos bleibt.
export function renderInlineLinks(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

// Serienfarben für den Trend: Farbe folgt der Kategorie, nie dem Rang.
// Slots 1–5 der Brand-Kategorien-Palette (Akasha-Vault:
// var/templates/marken/fumu/brand.yaml > colors.categorical), dataviz-validiert
// gegen die ivory-Fläche #F0EEE6 (Lightness-Band, Chroma, CVD-Separation,
// Kontrast ≥3:1 – alle PASS). Bei Änderung dort ändern und hier nachziehen.
export const categoryColors: Record<string, string> = {
  platform: '#C44540',
  publisher_paywall: '#29579A',
  publisher_open: '#AB7302',
  ecommerce: '#674698',
  brand: '#4D8B50',
};

const FALLBACK_COLOR = '#666666';

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? FALLBACK_COLOR;
}

// Kurz-Charakterisierung je Bot-Typ – Vier-Typen-Taxonomie aus dem
// Akasha-Vault ([[Typen von KI Bots]], gespiegelt in crawlers.yaml der
// robots-txt-Pipeline). bot_category liefert das Tracker-JSON.
export const botTypeLabels: Record<string, string> = {
  scraper: 'Trainings-Scraper',
  assistant: 'KI-Assistent',
  search: 'Such-Crawler',
  agent: 'KI-Agent',
};

// Typ-Farben: eigenes all-pairs-validiertes Quartett aus den fumu-Hues
// (sortierte Balken – jedes Typ-Paar kann benachbart sein; die 6er-Palette
// in brand.yaml ist nur für Nachbar-Reihenfolge geprüft). dataviz-Validator
// gegen ivory #F0EEE6, --pairs all: alle Checks PASS, einzig Teal↔Purpur
// deutan 7.3 im Floor-Band – legal, weil jede Zeile ihr Text-Label trägt.
export const botTypeColors: Record<string, string> = {
  scraper: '#C44540',
  assistant: '#235193',
  search: '#079696',
  agent: '#8569B4',
};

export const botTypeDescriptions: Record<string, string> = {
  scraper: 'Extrahiert Inhalte grossflächig als Trainingsmaterial für KI-Modelle.',
  assistant: 'Holt einzelne Seiten in Echtzeit, wenn ein Nutzer eine Frage stellt.',
  search: 'Indexiert Inhalte, um sie in KI-Antworten als Quelle zitieren zu können.',
  agent: 'Handelt im Auftrag des Nutzers – springt session-artig über mehrere Seiten.',
};

// «10 Veränderungen auf 2 Sites» für einen Lauf-Log-Eintrag; null beim
// Erst-Snapshot (kein Diff-Vorgänger) → null, Aufrufer lässt die Angabe weg.
// Gemeinsam für HTML-Seite und Markdown-Zwilling, damit nichts driftet.
export function describeRunChanges(run: Run): string | null {
  if (run.changes === null) return null;
  const changes = `${run.changes} ${run.changes === 1 ? 'Veränderung' : 'Veränderungen'}`;
  if (run.sites_changed === null) return changes;
  return `${changes} auf ${run.sites_changed} ${run.sites_changed === 1 ? 'Site' : 'Sites'}`;
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
