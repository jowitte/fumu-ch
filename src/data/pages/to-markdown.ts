import type { Cta, Item, PageContent, Rich, Section } from './types';

/**
 * Serialisiert PageContent zu Markdown für /[slug].md und /llms-full.txt.
 * Reine Funktion ohne Astro-Abhängigkeit, damit sie im Test läuft.
 *
 * Die H1 setzen die aufrufenden Routen aus `title` – hier entsteht nur der Body.
 */

const link = (cta: Cta) => `[${cta.label}](${cta.href})`;

const rich = (value: Rich): string =>
  typeof value === 'string'
    ? value
    : value.map(part => (typeof part === 'string' ? part : link(part))).join('');

const itemToMarkdown = (item: Item): string => {
  switch (item.kind) {
    case 'item': {
      const head = [item.title && `**${item.title}**`, item.tag && `(${item.tag})`]
        .filter(Boolean)
        .join(' ');
      const parts = [head ? `${head} – ${rich(item.body)}` : rich(item.body)];
      if (item.cta) parts.push(link(item.cta));
      if (item.component) parts.push(item.component.fallback);
      return parts.join(' ');
    }

    case 'person': {
      const text = `**${item.name}** – ${item.tag}. ${rich(item.body)}`;
      return item.links.length ? `${text} ${item.links.map(link).join(' · ')}` : text;
    }

    case 'quote':
      return `«${item.text}»\n\n— ${item.cite}`;
  }
};

const sectionToMarkdown = (section: Section): string =>
  [`## ${section.label}`, ...section.items.map(itemToMarkdown)].join('\n\n');

export const toMarkdown = (page: PageContent): string =>
  [page.intro, ...page.sections.map(sectionToMarkdown)].join('\n\n');

/**
 * Jedes Klartext-Stück einer Seite – Grundlage der Regressionssicherung:
 * Was hier drinsteht, muss im erzeugten Markdown vorkommen. Verhindert, dass
 * eine Aussage nur in einem der beiden Kanäle landet.
 */
export const textFragments = (page: PageContent): string[] => {
  const fragments: string[] = [page.intro];

  const pushRich = (value: Rich) => {
    if (typeof value === 'string') {
      fragments.push(value);
      return;
    }
    for (const part of value) {
      fragments.push(typeof part === 'string' ? part : part.href);
    }
  };

  for (const section of page.sections) {
    fragments.push(section.label);

    for (const item of section.items) {
      switch (item.kind) {
        case 'item':
          pushRich(item.body);
          if (item.title) fragments.push(item.title);
          if (item.tag) fragments.push(item.tag);
          if (item.cta) fragments.push(item.cta.href);
          if (item.component) fragments.push(item.component.fallback);
          break;
        case 'person':
          fragments.push(item.name, item.tag);
          pushRich(item.body);
          for (const l of item.links) fragments.push(l.href);
          break;
        case 'quote':
          fragments.push(item.text, item.cite);
          break;
      }
    }
  }

  return fragments.map(f => f.trim()).filter(Boolean);
};
