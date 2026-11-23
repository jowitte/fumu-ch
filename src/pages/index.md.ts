import type { APIRoute } from 'astro';
import { loadPage } from '../data/pages';
import { home } from '../data/pages/home';
import { headingOf, toMarkdown } from '../data/pages/to-markdown';

// Markdown-Zwilling der Startseite aus derselben Quelle wie das HTML
// (src/data/pages/home.ts) und über loadPage wie llms-full.txt.
export const GET: APIRoute = async () => {
  const page = await loadPage(home);
  const body = `# ${headingOf(page)}

${toMarkdown(page)}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
