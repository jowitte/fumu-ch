import { isEm, isStrong } from './types';
import type { Cta, Item, PageContent, Rich, RichPart, Section } from './types';

/**
 * Serialisiert PageContent zu Markdown für /[slug].md und /llms-full.txt.
 * Reine Funktion ohne Astro-Abhängigkeit, damit sie im Test läuft.
 *
 * Die H1 setzen die aufrufenden Routen aus `headingOf(page)` – hier entsteht
 * nur der Body.
 */

/** Sichtbare H1: eigenes Feld, wenn der H1 länger ist als der Title-Tag. */
export const headingOf = (page: PageContent): string => page.heading ?? page.title;

const link = (cta: Cta) => `[${cta.label}](${cta.href})`;

const partToMarkdown = (part: RichPart): string => {
  if (typeof part === 'string') return part;
  if (isEm(part)) return `*${part.em}*`;
  if (isStrong(part)) return `**${part.strong}**`;
  return link(part);
};

const rich = (value: Rich): string =>
  typeof value === 'string' ? value : value.map(partToMarkdown).join('');

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

    case 'logos':
      return item.entries.map(e => `- **${e.name}** – ${e.note}`).join('\n');

    case 'links':
      return item.entries.map(e => `- [${e.title}](${e.href}): ${e.teaser}`).join('\n');
  }
};

/**
 * FAQ-Sektion (`id: 'faq'`): jede Frage als H3, die Antwort als Absatz
 * darunter. Tag, CTA und Fallback kommen mit, wie bei gewöhnlichen Items.
 */
const faqItemToMarkdown = (item: Item): string => {
  if (item.kind !== 'item' || !item.title) return itemToMarkdown(item);
  const heading = item.tag ? `### ${item.title} (${item.tag})` : `### ${item.title}`;
  const answer = [rich(item.body)];
  if (item.cta) answer.push(link(item.cta));
  if (item.component) answer.push(item.component.fallback);
  return `${heading}\n\n${answer.join(' ')}`;
};

const sectionToMarkdown = (section: Section): string =>
  [
    `## ${section.label}`,
    ...section.items.map(section.id === 'faq' ? faqItemToMarkdown : itemToMarkdown),
  ].join('\n\n');

export const toMarkdown = (page: PageContent): string =>
  [...page.intro, ...page.sections.map(sectionToMarkdown)].join('\n\n');

/**
 * Jedes Klartext-Stück einer Seite – Grundlage der Regressionssicherung:
 * Was hier drinsteht, muss im erzeugten Markdown vorkommen. Verhindert, dass
 * eine Aussage nur in einem der beiden Kanäle landet.
 */
export const textFragments = (page: PageContent): string[] => {
  const fragments: string[] = [...page.intro];

  const pushRich = (value: Rich) => {
    if (typeof value === 'string') {
      fragments.push(value);
      return;
    }
    for (const part of value) {
      if (typeof part === 'string') fragments.push(part);
      else if (isEm(part)) fragments.push(part.em);
      else if (isStrong(part)) fragments.push(part.strong);
      else fragments.push(part.label, part.href);
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
        case 'logos':
          for (const e of item.entries) fragments.push(e.name, e.note);
          break;
        case 'links':
          for (const e of item.entries) fragments.push(e.title, e.href, e.teaser);
          break;
      }
    }
  }

  return fragments.map(f => f.trim()).filter(Boolean);
};
