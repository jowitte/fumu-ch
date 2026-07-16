import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getCollection('pages');
  // home hat eine eigene Route (index.md.ts), der AI-Crawler-Radar rendert
  // seine .md-Variante aus den Live-Daten (ai-crawler-radar.md.ts).
  return pages
    .filter((p) => p.id !== 'home' && p.id !== 'ai-crawler-radar')
    .map((p) => ({
      params: { slug: p.id },
      props: { entry: p },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'pages'>>>[number];

  const body = `# ${entry.data.title}

${entry.body ?? ''}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
