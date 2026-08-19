import { describe, expect, it } from 'vitest';
import { about } from './about';
import { kontakt } from './kontakt';
import { wasWirTun } from './was-wir-tun';
import { textFragments, toMarkdown } from './to-markdown';
import type { PageContent } from './types';

/**
 * Regressionssicherung gegen den Schattentext-Fall (2026-08-19): Eine Aussage
 * darf nicht in einem Kanal stehen und im anderen fehlen. Der Test hält fest,
 * dass jedes Klartext-Stück der Seitendaten im Markdown ankommt – die
 * HTML-Seite rendert dieselben Daten über EvansSection.astro.
 */

const pages: Array<[string, PageContent]> = [
  ['about', about],
  ['was-wir-tun', wasWirTun],
  ['kontakt', kontakt],
];

describe.each(pages)('%s', (_name, page) => {
  const markdown = toMarkdown(page);

  it('bringt jedes Textstück in den Markdown-Kanal', () => {
    const missing = textFragments(page).filter(fragment => !markdown.includes(fragment));
    expect(missing).toEqual([]);
  });

  it('führt jede Sektion als H2', () => {
    for (const section of page.sections) {
      expect(markdown).toContain(`## ${section.label}`);
    }
  });

  it('beginnt mit dem Lead-Absatz, ohne H1', () => {
    expect(markdown.startsWith(page.intro)).toBe(true);
    expect(markdown).not.toContain('\n# ');
  });
});

describe('Rich-Text', () => {
  it('serialisiert Inline-Links als Markdown-Links', () => {
    const markdown = toMarkdown({
      title: 'T',
      description: 'D',
      order: 1,
      intro: 'Intro.',
      sections: [
        {
          label: 'Test',
          items: [
            {
              kind: 'item',
              body: ['Vorher ', { label: 'Mitte', href: 'https://example.com' }, ' nachher.'],
            },
          ],
        },
      ],
    });

    expect(markdown).toContain('Vorher [Mitte](https://example.com) nachher.');
  });
});
