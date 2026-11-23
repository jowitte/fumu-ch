import { about } from './about';
import { pillarPath, pillars } from '../pillars';
import type { Item, PageContent, QuoteItem, TextItem } from './types';

/**
 * Übergangs-Startseite (Entwurf «Neues Design», docs/plans/2026-11-22-neues-design-entwurf.md):
 * Bis die Startseiten-Texte aus dem Vault kommen (Story «Startseite führt
 * direkt zu den Leistungen»), steht hier nur, was schon auf der Site steht –
 * kein neuer Satz, keine Platzhalter, keine Leistung ohne Seite.
 *
 * - Kopf: Claim und Lead aus dem bisherigen Kopf der Startseite
 * - Was wir tun: die Leistungen aus der Pillar-Registry mit ihrem Teaser,
 *   dazu die Formate (Items mit Titel aus der Sektion `formate`) jeder Pillar
 * - Referenzen: das erste Zitat von /about/
 *
 * HTML (src/pages/index.astro), /index.md und der Startseiten-Abschnitt in
 * /llms-full.txt entstehen alle aus diesem Modul, auch Title und Description.
 */

const isFormat = (item: Item): item is TextItem => item.kind === 'item' && Boolean(item.title);

const formate = pillars.flatMap(
  pillar => pillar.page.sections.find(section => section.id === 'formate')?.items.filter(isFormat) ?? [],
);

const zitat = about.sections.flatMap(section => section.items).find((item): item is QuoteItem => item.kind === 'quote');
if (!zitat) throw new Error('home.ts: /about/ hat kein Zitat (src/data/pages/about.ts)');

export const home: PageContent = {
  title: 'Beratung für KI-Transformation in Medien, Marketing und Werbung',
  heading: 'Technologie in Wirkung übersetzen.',
  description:
    'Beratung für KI-Transformation in Medien, Marketing und Werbung. Für Verlage, Vermarkter, Agenturen und Marken in der Schweiz und Europa.',
  order: 1,
  intro: [
    'Wir verbinden Strategie, Organisation und Technologie – damit aus technologischem Potenzial echte Wirkung wird.',
  ],
  sections: [
    {
      label: 'Was wir tun',
      items: [
        {
          kind: 'links',
          entries: pillars.map(pillar => ({
            title: pillar.label,
            href: pillarPath(pillar),
            teaser: pillar.teaser,
          })),
        },
        ...formate,
      ],
    },
    {
      label: 'Referenzen',
      items: [zitat],
    },
  ],
};

/** Pillar, aus der ein Format stammt – Ziel der Format-Karte auf der Startseite. */
export const pillarOfFormat = (format: TextItem) =>
  pillars.find(pillar =>
    pillar.page.sections.some(section => section.id === 'formate' && section.items.includes(format)),
  );
