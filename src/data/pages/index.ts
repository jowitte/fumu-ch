import { getCollection } from 'astro:content';
import { about } from './about';
import { kontakt } from './kontakt';
import { wasWirTun } from './was-wir-tun';
import { toMarkdown } from './to-markdown';
import type { PageContent } from './types';
import { stripObsidianMarkers } from '../../plugins/obsidian-markers.mjs';

/**
 * Seiten, deren Inhalt aus strukturierten Daten kommt – HTML und Markdown
 * entstehen beide daraus. Für alle übrigen bleibt die Content-Collection die
 * Quelle (datenschutz und impressum rendern sie ohnehin direkt).
 *
 * Hintergrund: docs/plans/2026-08-19-seiteninhalt-eine-quelle.md
 */
export const dataPages: Record<string, PageContent> = {
  about,
  'was-wir-tun': wasWirTun,
  kontakt,
};

/** Einheitliche Sicht auf eine Seite, egal aus welcher Quelle sie stammt. */
export type ResolvedPage = {
  id: string;
  title: string;
  description: string;
  order: number;
  body: string;
};

/**
 * Alle Seiten für die Markdown-Kanäle, nach `order` sortiert.
 * `home` und `ai-crawler-radar` haben eigene Routen und bleiben aussen vor –
 * wer sie braucht, filtert selbst.
 */
export const resolvePages = async (): Promise<ResolvedPage[]> => {
  const collection = await getCollection('pages');

  const fromCollection: ResolvedPage[] = collection
    .filter(entry => !(entry.id in dataPages))
    .map(entry => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      order: entry.data.order,
      body: stripObsidianMarkers(entry.body ?? ''),
    }));

  const fromData: ResolvedPage[] = Object.entries(dataPages).map(([id, page]) => ({
    id,
    title: page.title,
    description: page.description,
    order: page.order,
    body: toMarkdown(page),
  }));

  return [...fromCollection, ...fromData].sort((a, b) => a.order - b.order);
};
