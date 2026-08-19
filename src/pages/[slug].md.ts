import type { APIRoute, GetStaticPaths } from 'astro';
import { resolvePages } from '../data/pages';
import type { ResolvedPage } from '../data/pages';

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await resolvePages();
  // home hat eine eigene Route (index.md.ts), der AI-Crawler-Radar rendert
  // seine .md-Variante aus den Live-Daten (ai-crawler-radar.md.ts).
  return pages
    .filter((p) => p.id !== 'home' && p.id !== 'ai-crawler-radar')
    .map((p) => ({
      params: { slug: p.id },
      props: { page: p },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const page = props.page as ResolvedPage;

  const body = `# ${page.title}

${page.body}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
