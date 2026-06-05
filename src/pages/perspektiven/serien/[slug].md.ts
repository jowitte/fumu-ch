import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { series as seriesRegistry } from '../../../data/series';

export const getStaticPaths: GetStaticPaths = async () => {
  return Object.keys(seriesRegistry).map((slug) => ({
    params: { slug },
    props: { slug },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const slug = props.slug as string;
  const data = seriesRegistry[slug];

  const parts = (await getCollection('perspektiven', ({ data }) => !data.draft && data.series === slug))
    .sort((a, b) => (a.data.seriesPart ?? 0) - (b.data.seriesPart ?? 0));

  const partsList = parts
    .map(p => `- Teil ${p.data.seriesPart}: [${p.data.title}](https://fumu.ch/perspektiven/${p.id}/): ${p.data.description}`)
    .join('\n');

  const body = `# ${data.name}

_${data.teaser}_

## Teile

${partsList}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
