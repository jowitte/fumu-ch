import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('perspektiven', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const pages = (await getCollection('pages')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const pageUrl = (id: string) =>
    id === 'home' ? 'https://fumu.ch/' : `https://fumu.ch/${id}/`;

  const renderPage = (entry: (typeof pages)[number]) =>
    `## ${entry.data.title}

_${entry.data.description}_

URL: ${pageUrl(entry.id)}

${entry.body ?? ''}`;

  const renderPost = (p: (typeof posts)[number]) =>
    `## ${p.data.title}

_${p.data.description}_

URL: https://fumu.ch/perspektiven/${p.id}/
Datum: ${p.data.date.toISOString().split('T')[0]}${p.data.category ? `\nKategorie: ${p.data.category}` : ''}

${p.body ?? ''}`;

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
