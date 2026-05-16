import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('perspektiven', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'fumu – Perspektiven',
    description: 'Analysen und Einordnungen zu Technologie, Medien und digitaler Werbung. Strategieberatung für Digital Advertising, AdTech/MarTech und AI-Integration im DACH-Raum.',
    site: context.site ?? 'https://fumu.ch',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/perspektiven/${post.id}/`,
      categories: post.data.category ? [post.data.category] : undefined,
    })),
    customData: `<language>de-CH</language>`,
    stylesheet: false,
  });
}
