import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

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

// Vault-interne Marker (Obsidian-Kommentare und Legacy-Dialog-Callouts)
// gehören nirgends in den publizierten HTML-Output. Pendant zu
// .claude/lib/publish/scripts/dialog_filter.py im Akasha-Vault – Belt-and-Suspenders
// falls der Pre-Build-Check im /fumu-web-Skill durchrutscht.
function remarkStripObsidianMarkers() {
  const INLINE_COMMENT = /%%[\s\S]*?%%/g;
  const LEGACY_DIALOG_CALLOUT = /^\s*\[!(?:dieter|jochen)\][-+]?/;

  const isLegacyDialogBlockquote = (node) => {
    if (node.type !== 'blockquote') return false;
    const first = node.children?.[0];
    if (first?.type !== 'paragraph') return false;
    const firstText = first.children?.[0];
    return firstText?.type === 'text' && LEGACY_DIALOG_CALLOUT.test(firstText.value);
  };

  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !isLegacyDialogBlockquote(child));
    for (const child of node.children) {
      if (child.type === 'text' && typeof child.value === 'string') {
        child.value = child.value.replace(INLINE_COMMENT, '');
      }
      walk(child);
    }
  };

  return (tree) => walk(tree);
}

export default defineConfig({
  site: 'https://fumu.ch',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkWikilinks, remarkStripObsidianMarkers],
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
