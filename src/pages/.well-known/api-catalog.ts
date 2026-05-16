import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const body = JSON.stringify(
    {
      linkset: [],
    },
    null,
    2,
  );

  return new Response(body, {
    headers: { 'Content-Type': 'application/linkset+json; charset=utf-8' },
  });
};
