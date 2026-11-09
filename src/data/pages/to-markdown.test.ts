import { describe, expect, it } from 'vitest';
import { about } from './about';
import { kontakt } from './kontakt';
import { wasWirTun } from './was-wir-tun';
import { pillars } from '../pillars';
import { withRelated } from './related';
import { headingOf, textFragments, toMarkdown } from './to-markdown';
import type { PageContent, Rich } from './types';

/**
 * Regressionssicherung gegen den Schattentext-Fall (2026-08-19): Eine Aussage
 * darf nicht in einem Kanal stehen und im anderen fehlen. Der Test hält fest,
 * dass jedes Klartext-Stück der Seitendaten im Markdown ankommt – die
 * HTML-Seite rendert dieselben Daten über EvansSection.astro.
 */

/** Stellvertreter für die Perspektiven-Collection, die im Test nicht verfügbar ist. */
const fakePosts = (page: PageContent) =>
  (page.relatedPerspektiven?.slugs ?? []).map(id => ({
    id,
    title: `Titel ${id}`,
    description: `Teaser ${id}`,
  }));

const pages: Array<[string, PageContent]> = [
  ['about', about],
  ['was-wir-tun', wasWirTun],
  ['kontakt', kontakt],
  ...pillars.map(({ slug, page }): [string, PageContent] => [slug, withRelated(page, fakePosts(page))]),
];

const page = (overrides: Partial<PageContent>): PageContent => ({
  title: 'T',
  description: 'D',
  order: 1,
  intro: ['Intro.'],
  sections: [],
  ...overrides,
});

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

  it('beginnt mit dem Lead, ohne H1', () => {
    expect(markdown.startsWith(page.intro.join('\n\n'))).toBe(true);
    expect(markdown).not.toContain('\n# ');
  });
});

describe('Lead', () => {
  it('trennt mehrere Lead-Absätze durch Leerzeilen', () => {
    const markdown = toMarkdown(page({ intro: ['Erster.', 'Zweiter.', 'Dritter.'] }));
    expect(markdown).toBe('Erster.\n\nZweiter.\n\nDritter.');
  });
});

describe('H1', () => {
  it('nimmt das eigene H1-Feld, wenn es gesetzt ist', () => {
    expect(headingOf(page({ title: 'Kurz', heading: 'Lange Überschrift' }))).toBe('Lange Überschrift');
  });

  it('fällt sonst auf den Titel zurück', () => {
    expect(headingOf(page({ title: 'Kurz' }))).toBe('Kurz');
  });
});

describe('Rich-Text', () => {
  it('serialisiert Inline-Links als Markdown-Links', () => {
    const markdown = toMarkdown(
      page({
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
      }),
    );

    expect(markdown).toContain('Vorher [Mitte](https://example.com) nachher.');
  });

  it('serialisiert Kursiv und Fett als Markdown-Auszeichnung', () => {
    const subject = page({
      sections: [
        {
          label: 'Test',
          items: [
            {
              kind: 'item',
              body: ['In ', { em: 'Power and Prediction' }, ' heisst das ', { strong: 'Punktlösung' }, '.'],
            },
          ],
        },
      ],
    });

    expect(toMarkdown(subject)).toContain('In *Power and Prediction* heisst das **Punktlösung**.');
    expect(textFragments(subject)).toEqual(expect.arrayContaining(['Power and Prediction', 'Punktlösung']));
  });
});

describe('FAQ', () => {
  const subject = page({
    sections: [
      {
        label: 'Häufige Fragen',
        id: 'faq',
        items: [
          { kind: 'item', title: 'Erste Frage?', body: 'Erste Antwort.' },
          { kind: 'item', title: 'Zweite Frage?', body: 'Zweite Antwort.' },
        ],
      },
    ],
  });

  it('serialisiert Frage und Antwort als H3 mit Absatz', () => {
    expect(toMarkdown(subject)).toContain(
      '## Häufige Fragen\n\n### Erste Frage?\n\nErste Antwort.\n\n### Zweite Frage?\n\nZweite Antwort.',
    );
  });

  it('setzt die Frage nicht als fetten Titel vor die Antwort', () => {
    expect(toMarkdown(subject)).not.toContain('**Erste Frage?**');
  });

  it('verliert Tag, CTA und Fallback einer Frage nicht', () => {
    const markdown = toMarkdown(
      page({
        sections: [
          {
            label: 'Häufige Fragen',
            id: 'faq',
            items: [
              {
                kind: 'item',
                title: 'Was kostet das?',
                tag: 'Preis',
                body: 'Kommt drauf an.',
                cta: { label: 'Anfragen', href: '/kontakt/' },
                component: { name: 'newsletter', fallback: 'Anmeldung auf der Kontaktseite.' },
              },
            ],
          },
        ],
      }),
    );
    expect(markdown).toContain(
      '### Was kostet das? (Preis)\n\nKommt drauf an. [Anfragen](/kontakt/) Anmeldung auf der Kontaktseite.',
    );
  });
});

describe('Rich-Typ', () => {
  it('lässt Link und Auszeichnung nicht im selben Teil zu', () => {
    // Prüft tsc, nicht vitest: ohne Typfehler meldet tsc die Direktive als unbenutzt.
    // @ts-expect-error – ein Teil ist entweder Link oder Auszeichnung
    const part: Exclude<Rich, string>[number] = { label: 'x', href: '/x/', em: 'y' };
    expect(part).toBeDefined();
  });
});

describe('Linkliste', () => {
  const subject = page({
    sections: [
      {
        label: 'Weiterlesen',
        items: [
          {
            kind: 'links',
            entries: [
              { title: 'Eins', href: '/eins/', teaser: 'Erster Teaser.' },
              { title: 'Zwei', href: '/zwei/', teaser: 'Zweiter Teaser.' },
            ],
          },
        ],
      },
    ],
  });

  it('serialisiert Einträge als Markdown-Liste mit Teaser', () => {
    expect(toMarkdown(subject)).toContain(
      '## Weiterlesen\n\n- [Eins](/eins/): Erster Teaser.\n- [Zwei](/zwei/): Zweiter Teaser.',
    );
  });

  it('führt Titel, Ziel und Teaser als Textstücke', () => {
    expect(textFragments(subject)).toEqual(
      expect.arrayContaining(['Eins', '/eins/', 'Erster Teaser.', 'Zwei', '/zwei/', 'Zweiter Teaser.']),
    );
  });
});
