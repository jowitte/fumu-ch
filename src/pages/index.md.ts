import type { APIRoute } from 'astro';
import { home } from '../data/pages/home';
import { headingOf, toMarkdown } from '../data/pages/to-markdown';

// Markdown-Zwilling der Startseite aus derselben Quelle wie das HTML
// (src/data/pages/home.ts).
export const GET: APIRoute = async () => {
  const body = `# ${headingOf(home)}

${toMarkdown(home)}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
