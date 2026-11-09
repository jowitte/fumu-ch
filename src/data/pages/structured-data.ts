import type { PageContent, Rich, TextItem } from './types';

/**
 * JSON-LD, das aus dem Seiteninhalt folgt statt danebenzustehen: Fragen und
 * Formate werden nur im PageContent gepflegt, Markup und Markdown-Kanal lesen
 * dieselben Daten. Reine Funktionen, damit sie im Test laufen.
 */

/** Rich-Text als Klartext – Link-Labels und Auszeichnungen ohne Markup. */
export const plainText = (value: Rich): string =>
  typeof value === 'string'
    ? value
    : value
        .map(part => {
          if (typeof part === 'string') return part;
          if ('em' in part) return part.em;
          if ('strong' in part) return part.strong;
          return part.label;
        })
        .join('');

const titledItems = (page: PageContent, id: string) =>
  page.sections
    .find(section => section.id === id)
    ?.items.filter((item): item is TextItem & { title: string } => item.kind === 'item' && Boolean(item.title));

/**
 * FAQPage aus der Sektion mit `id: 'faq'`. Google zeigt dafür seit 2026-05-07
 * kein Rich Result mehr; das Markup bleibt als Mitnahme für Bing und
 * Chat-Engines (siehe Plan 2026-08-21-pillar-seiten.md).
 */
export const faqPageLd = (page: PageContent) => {
  const questions = titledItems(page, 'faq');
  if (!questions) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(item => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: { '@type': 'Answer', text: plainText(item.body) },
    })),
  };
};

/**
 * ProfessionalService einer Pillar. Der Angebotskatalog führt nur die Formate
 * dieser Seite (Sektion `id: 'formate'`) – die Gesamtliste steht auf
 * /was-wir-tun/.
 */
export const serviceLd = (page: PageContent, { url, serviceType }: { url: string; serviceType: string }) => {
  const section = page.sections.find(s => s.id === 'formate');
  const formats = titledItems(page, 'formate');
  if (!section || !formats) {
    throw new Error(`serviceLd: «${page.title}» hat keine Sektion mit id 'formate'`);
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'fumu',
    url,
    description: page.description,
    areaServed: { '@type': 'GeoShape', name: 'DACH' },
    serviceType,
    provider: { '@type': 'Organization', name: 'fumu', url: 'https://fumu.ch' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: section.label,
      itemListElement: formats.map(item => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item.tag ? `${item.title} (${item.tag})` : item.title },
      })),
    },
  };
};
