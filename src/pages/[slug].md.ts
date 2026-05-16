import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getCollection('pages');
  return pages
    .filter((p) => p.id !== 'home')
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
