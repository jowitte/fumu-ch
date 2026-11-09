import { describe, expect, it } from 'vitest';
import { faqPageLd, serviceLd } from './structured-data';
import type { PageContent } from './types';

const page: PageContent = {
  title: 'Thema',
  description: 'Beschreibung des Themas.',
  order: 1,
  intro: ['Intro.'],
  sections: [
    {
      label: 'Wie wir arbeiten',
      id: 'formate',
      items: [
        { kind: 'item', title: 'Analyse', tag: 'vier Wochen', body: 'Text.' },
        { kind: 'item', title: 'Begleitung', tag: '8 bis 16 Wochen', body: 'Text.' },
        { kind: 'item', body: ['Schreiben Sie uns über die ', { label: 'Kontaktseite', href: '/kontakt/' }, '.'] },
      ],
    },
    {
      label: 'Häufige Fragen',
      id: 'faq',
      items: [
        { kind: 'item', title: 'Erste Frage?', body: 'Erste Antwort.' },
        {
          kind: 'item',
          title: 'Zweite Frage?',
          body: ['Siehe die ', { label: 'Kontaktseite', href: '/kontakt/' }, ' und ', { em: 'das Buch' }, '.'],
        },
      ],
    },
  ],
};

describe('faqPageLd', () => {
  it('macht aus jedem Eintrag der FAQ-Sektion eine Frage mit Antwort', () => {
    expect(faqPageLd(page)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Erste Frage?',
          acceptedAnswer: { '@type': 'Answer', text: 'Erste Antwort.' },
        },
        {
          '@type': 'Question',
          name: 'Zweite Frage?',
          acceptedAnswer: { '@type': 'Answer', text: 'Siehe die Kontaktseite und das Buch.' },
        },
      ],
    });
  });

  it('liefert nichts für eine Seite ohne FAQ-Sektion', () => {
    expect(faqPageLd({ ...page, sections: [] })).toBeUndefined();
  });
});

describe('serviceLd', () => {
  const ld = serviceLd(page, { url: 'https://fumu.ch/thema/', serviceType: 'Thema' });

  it('beschreibt die Seite als ProfessionalService', () => {
    expect(ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'fumu',
      url: 'https://fumu.ch/thema/',
      description: 'Beschreibung des Themas.',
      serviceType: 'Thema',
    });
  });

  it('führt die Formate der Seite im Angebotskatalog, ohne Einträge ohne Titel', () => {
    expect(ld.hasOfferCatalog).toEqual({
      '@type': 'OfferCatalog',
      name: 'Wie wir arbeiten',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Analyse (vier Wochen)' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Begleitung (8 bis 16 Wochen)' } },
      ],
    });
  });

  it('bricht ab, wenn die Seite keine Formate-Sektion hat', () => {
    expect(() => serviceLd({ ...page, sections: [] }, { url: 'u', serviceType: 's' })).toThrow(/formate/);
  });
});
