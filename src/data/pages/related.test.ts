import { describe, expect, it } from 'vitest';
import { assertPerspektivenLinks, withRelated } from './related';
import type { PageContent } from './types';

const posts = [
  { id: 'eins', title: 'Eins', description: 'Teaser eins.' },
  { id: 'zwei', title: 'Zwei', description: 'Teaser zwei.' },
  { id: 'drei', title: 'Drei', description: 'Teaser drei.' },
];

const base: PageContent = {
  title: 'T',
  description: 'D',
  order: 1,
  intro: ['Intro.'],
  sections: [{ label: 'Erste', items: [{ kind: 'item', body: 'Text.' }] }],
};

describe('withRelated', () => {
  it('hängt die verwandten Perspektiven als letzte Sektion an, in der Reihenfolge der Slugs', () => {
    const page = withRelated({ ...base, relatedPerspektiven: { label: 'Weiterlesen', slugs: ['drei', 'eins'] } }, posts);

    expect(page.sections.map(s => s.label)).toEqual(['Erste', 'Weiterlesen']);
    expect(page.sections[1].items).toEqual([
      {
        kind: 'links',
        entries: [
          { title: 'Drei', href: '/perspektiven/drei/', teaser: 'Teaser drei.' },
          { title: 'Eins', href: '/perspektiven/eins/', teaser: 'Teaser eins.' },
        ],
      },
    ]);
  });

  it('bricht bei einem unbekannten oder nicht publizierten Slug ab', () => {
    expect(() =>
      withRelated({ ...base, relatedPerspektiven: { label: 'Weiterlesen', slugs: ['eins', 'gibt-es-nicht'] } }, posts),
    ).toThrow(/gibt-es-nicht/);
  });

  it('lässt Seiten ohne verwandte Perspektiven unverändert', () => {
    expect(withRelated(base, posts)).toBe(base);
  });
});

describe('assertPerspektivenLinks', () => {
  const withLinks = (...hrefs: string[]): PageContent => ({
    ...base,
    sections: [
      {
        label: 'Text',
        items: hrefs.map(href => ({ kind: 'item' as const, body: ['Siehe ', { label: 'hier', href }, '.'] })),
      },
    ],
  });

  it('bricht ab, wenn ein Inline-Link auf eine nicht publizierte Perspektive zeigt', () => {
    expect(() => assertPerspektivenLinks(withLinks('/perspektiven/eins/', '/perspektiven/geplant/'), posts)).toThrow(
      /geplant/,
    );
  });

  it('erkennt auch absolute Links auf fumu.ch und Links in CTAs', () => {
    expect(() => assertPerspektivenLinks(withLinks('https://fumu.ch/perspektiven/weg/'), posts)).toThrow(/weg/);
    const cta: PageContent = {
      ...base,
      sections: [{ label: 'X', items: [{ kind: 'item', body: 'Text.', cta: { label: 'Mehr', href: '/perspektiven/fehlt/' } }] }],
    };
    expect(() => assertPerspektivenLinks(cta, posts)).toThrow(/fehlt/);
  });

  it('lässt publizierte Perspektiven, Themenseiten und die Übersicht durch', () => {
    expect(() =>
      assertPerspektivenLinks(
        withLinks('/perspektiven/eins/', '/perspektiven/themen/ki-und-arbeit/', '/perspektiven/', '/kontakt/'),
        posts,
      ),
    ).not.toThrow();
  });
});
