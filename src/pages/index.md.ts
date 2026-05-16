import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const home = await getEntry('pages', 'home');
  if (!home) return new Response('Not found', { status: 404 });

  const body = `# ${home.data.title}

${home.body ?? ''}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
