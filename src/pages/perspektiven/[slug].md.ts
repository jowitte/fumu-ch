import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('perspektiven', ({ data }) => !data.draft);
  return posts.map((p) => ({
    params: { slug: p.id },
    props: { entry: p },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'perspektiven'>>>[number];
  const { title, description, date, category } = entry.data;

  const dateStr = date.toISOString().split('T')[0];
  const meta = [`Datum: ${dateStr}`];
  if (category) meta.push(`Kategorie: ${category}`);

  const body = `# ${title}

_${description}_

${meta.join('\n')}

${entry.body ?? ''}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
