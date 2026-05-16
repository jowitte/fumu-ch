import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Markdown-Bilder mit /public-Pfaden bekommen kein automatisches loading="lazy"
// (nur astro:assets-Pipeline tut das). Dieses kleine rehype-Plugin setzt
// loading="lazy" und decoding="async" auf alle <img>-Tags im Markdown-Output,
// sofern noch nicht gesetzt.
function rehypeImgLazy() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        if (node.properties.loading === undefined) node.properties.loading = 'lazy';
        if (node.properties.decoding === undefined) node.properties.decoding = 'async';
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://fumu.ch',
  output: 'static',
  markdown: {
    rehypePlugins: [rehypeImgLazy],
  },
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    mdx(),
  ],
});
