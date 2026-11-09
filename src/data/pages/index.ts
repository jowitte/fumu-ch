import { getCollection } from 'astro:content';
import { about } from './about';
import { kontakt } from './kontakt';
import { wasWirTun } from './was-wir-tun';
import { assertPillarSlugsFree, pillars } from '../pillars';
import { assertPerspektivenLinks, withRelated } from './related';
import { headingOf, toMarkdown } from './to-markdown';
import type { PageContent } from './types';
import { stripObsidianMarkers } from '../../plugins/obsidian-markers.mjs';
import { isPublished } from '../../lib/published';

/**
 * Seiten, deren Inhalt aus strukturierten Daten kommt – HTML und Markdown
 * entstehen beide daraus. Für alle übrigen bleibt die Content-Collection die
 * Quelle (datenschutz und impressum rendern sie ohnehin direkt).
 * Die Pillars kommen aus ihrer Registry (src/data/pillars.ts).
 *
 * Hintergrund: docs/plans/2026-08-19-seiteninhalt-eine-quelle.md,
 * docs/plans/2026-08-21-pillar-seiten.md
 */
const fixedPages: Record<string, PageContent> = {
  about,
  'was-wir-tun': wasWirTun,
  kontakt,
};

assertPillarSlugsFree(Object.keys(fixedPages));

export const dataPages: Record<string, PageContent> = {
  ...fixedPages,
  ...Object.fromEntries(pillars.map(pillar => [pillar.slug, pillar.page])),
};

/**
 * Die Seite, wie beide Kanäle sie ausgeben: mit den verwandten Perspektiven
 * als letzter Sektion, aufgelöst gegen die publizierten Einträge der
 * Collection. HTML-Seite und Markdown-Route rufen beide diese Funktion.
 * Links auf nicht publizierte Perspektiven brechen den Build.
 */
export const loadPage = async (page: PageContent): Promise<PageContent> => {
  const posts = (await getCollection('perspektiven', isPublished)).map(post => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
  }));
  assertPerspektivenLinks(page, posts);
  return withRelated(page, posts);
};

/** Einheitliche Sicht auf eine Seite, egal aus welcher Quelle sie stammt. */
export type ResolvedPage = {
  id: string;
  title: string;
  /** Sichtbare H1 – bei Collection-Seiten gleich dem Titel. */
  heading: string;
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
  assertPillarSlugsFree(collection.map(entry => entry.id));

  const fromCollection: ResolvedPage[] = collection
    .filter(entry => !(entry.id in dataPages))
    .map(entry => ({
      id: entry.id,
      title: entry.data.title,
      heading: entry.data.title,
      description: entry.data.description,
      order: entry.data.order,
      body: stripObsidianMarkers(entry.body ?? ''),
    }));

  const fromData: ResolvedPage[] = await Promise.all(
    Object.entries(dataPages).map(async ([id, page]) => ({
      id,
      title: page.title,
      heading: headingOf(page),
      description: page.description,
      order: page.order,
      body: toMarkdown(await loadPage(page)),
    })),
  );

  return [...fromCollection, ...fromData].sort((a, b) => a.order - b.order);
};
