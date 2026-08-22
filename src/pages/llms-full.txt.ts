import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { series as seriesRegistry } from '../data/series';
import { resolvePages } from '../data/pages';
import { stripObsidianMarkers } from '../plugins/obsidian-markers.mjs';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('perspektiven', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const pages = await resolvePages();

  const pageUrl = (id: string) =>
    id === 'home' ? 'https://fumu.ch/' : `https://fumu.ch/${id}/`;

  const renderPage = (page: (typeof pages)[number]) =>
    `## ${page.title}

_${page.description}_

URL: ${pageUrl(page.id)}

${page.body}`;

  const renderPost = (p: (typeof posts)[number]) =>
    `## ${p.data.title}

_${p.data.description}_

URL: https://fumu.ch/perspektiven/${p.id}/
Datum: ${p.data.date.toISOString().split('T')[0]}${p.data.category ? `\nKategorie: ${p.data.category}` : ''}${p.data.series && seriesRegistry[p.data.series] ? `\nThema: ${seriesRegistry[p.data.series].name}${p.data.seriesPart ? ` (Teil ${p.data.seriesPart})` : ''} – https://fumu.ch/perspektiven/themen/${p.data.series}/` : ''}

${stripObsidianMarkers(p.body ?? '')}`;

  const body = `# fumu – Voll-Inhalt für AI-Agents

> Vollinhalts-Variante von /llms.txt. Komplette Texte der Pages und Perspektiven, ohne Link-Traversal. Für Agents mit grossem Context-Window.

# Pages

${pages.map(renderPage).join('\n\n---\n\n')}

# Perspektiven

${posts.map(renderPost).join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
