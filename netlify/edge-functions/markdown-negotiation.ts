import type { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  if (request.headers.get('x-edge-bypass')) {
    return context.next();
  }

  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');

  if (wantsMarkdown) {
    const url = new URL(request.url);
    const mdPath =
      url.pathname === '/'
        ? '/index.md'
        : url.pathname.replace(/\/$/, '') + '.md';

    const mdResponse = await fetch(new URL(mdPath, url.origin), {
      headers: { 'x-edge-bypass': '1' },
    });

    if (mdResponse.ok) {
      const body = await mdResponse.text();
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
        },
      });
    }
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Vary', 'Accept');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config: Config = {
  path: '/*',
  excludedPath: [
    '/_astro/*',
    '/images/*',
    '/fonts/*',
    '/downloads/*',
    '/*.css',
    '/*.js',
    '/*.svg',
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.webp',
    '/*.ico',
    '/*.xml',
    '/*.txt',
    '/*.md',
  ],
};
