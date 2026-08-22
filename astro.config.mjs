import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';
// Marker-Stripping für den HTML-Pfad. Die String-Variante daneben bedient die
// Markdown-Zwillinge, die den rohen Body servieren – siehe das Modul.
import remarkStripObsidianMarkers from './src/plugins/obsidian-markers.mjs';

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
  // Astro 7 rendert Markdown per Default mit Sätteri, das keine remark/rehype-
  // Plugins kennt. Die drei Plugins oben sind hier tragend (Wikilink-Auflösung,
  // Marker-Stripping, Lazy-Images), deshalb bleibt die Pipeline auf unified.
  markdown: {
    processor: unified({
      remarkPlugins: [remarkWikilinks, remarkStripObsidianMarkers],
      rehypePlugins: [rehypeImgLazy],
    }),
  },
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
});
