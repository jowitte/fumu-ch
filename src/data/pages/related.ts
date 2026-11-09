import type { PageContent, Rich } from './types';

/** Was von einer Perspektive gebraucht wird – Auszug aus dem Collection-Eintrag. */
export type RelatedPost = { id: string; title: string; description: string };

/**
 * Löst `relatedPerspektiven` gegen die publizierten Perspektiven auf und hängt
 * sie als letzte Sektion an (Linkliste mit Titel und Teaser). HTML-Seite und
 * Markdown-Kanal lesen beide das Ergebnis, damit die Leiste nicht nur in einem
 * Kanal steht.
 *
 * Ein Slug, der nicht unter den übergebenen Perspektiven ist – umbenannt,
 * Entwurf oder noch nicht erschienen –, bricht den Build, statt still auf eine
 * 404 zu zeigen.
 */
export const withRelated = (page: PageContent, posts: RelatedPost[]): PageContent => {
  const related = page.relatedPerspektiven;
  if (!related) return page;

  const entries = related.slugs.map(slug => {
    const post = posts.find(p => p.id === slug);
    if (!post) {
      throw new Error(
        `relatedPerspektiven: «${slug}» ist keine publizierte Perspektive (src/content/perspektiven/${slug}.md)`,
      );
    }
    return { title: post.title, href: `/perspektiven/${post.id}/`, teaser: post.description };
  });

  return {
    ...page,
    sections: [...page.sections, { label: related.label, items: [{ kind: 'links', entries }] }],
  };
};

const PERSPEKTIVE = /^(?:https:\/\/fumu\.ch)?\/perspektiven\/([^/]+)\/?$/;

/** Alle Link-Ziele einer Seite: Inline-Links, CTAs, Personen-Links. */
const hrefs = (page: PageContent): string[] => {
  const fromRich = (value: Rich) =>
    typeof value === 'string' ? [] : value.flatMap(part => (typeof part === 'object' && 'href' in part ? [part.href] : []));

  return page.sections.flatMap(section =>
    section.items.flatMap(item => {
      switch (item.kind) {
        case 'item':
          return [...fromRich(item.body), ...(item.cta ? [item.cta.href] : [])];
        case 'person':
          return [...fromRich(item.body), ...item.links.map(l => l.href)];
        default:
          return [];
      }
    }),
  );
};

/**
 * Bricht ab, wenn ein Link der Seite auf eine Perspektive zeigt, die nicht
 * unter den übergebenen (publizierten) ist – umbenannt, Entwurf oder noch
 * geplant. Dieselbe Regel wie für `relatedPerspektiven`: lieber ein roter
 * Build als eine 404 auf der Live-Seite. Themenseiten und die Übersicht sind
 * keine Perspektiven und bleiben aussen vor.
 */
export const assertPerspektivenLinks = (page: PageContent, posts: RelatedPost[]): void => {
  const known = new Set(posts.map(p => p.id));
  const missing = hrefs(page)
    .map(href => href.match(PERSPEKTIVE)?.[1])
    .filter((slug): slug is string => Boolean(slug) && slug !== 'themen' && !known.has(slug!));
  if (missing.length) {
    throw new Error(
      `«${page.title}» verlinkt auf nicht publizierte Perspektiven: ${missing.join(', ')}`,
    );
  }
};
