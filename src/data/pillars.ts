// Pillar-Registry: die Themenseiten unter «Was wir tun», je eine pro Suchraum.
// Quelle für die Route /[pillar]/, die Pillar-Liste auf /was-wir-tun/, die
// Geschwister-Leiste am Fuss jeder Pillar und die Markdown-Kanäle.
// Eine neue Pillar = ein Modul unter src/data/pages/ plus ein Eintrag hier.
//
// Hintergrund: docs/plans/2026-08-21-pillar-seiten.md; Schnitt und Bauplan
// in der Vault-Referenz «Pillar-Architektur fumu.ch».

import type { PageContent } from './pages/types';
import { kiTransformation } from './pages/ki-transformation';

export interface Pillar {
  /** URL-Segment: /<slug>/ und /<slug>.md */
  slug: string;
  /** Kurzlabel für Pillar-Liste und Geschwister-Leiste. */
  label: string;
  /**
   * Teaser unter dem Link in der Pillar-Liste auf /was-wir-tun/. Eigener Text
   * statt der Meta-Description, die mit dem Begriff-Anker beginnt und unter
   * dem Kurzlabel doppelt stünde. Quelle: Seitenrahmen der Vault-Notiz.
   */
  teaser: string;
  /** `serviceType` im ProfessionalService-JSON-LD der Seite. */
  serviceType: string;
  page: PageContent;
}

/** Reihenfolge = Reihenfolge in Liste und Leiste. */
export const pillars: Pillar[] = [
  {
    slug: 'ki-transformation',
    label: 'KI-Transformation',
    teaser:
      'Pilotprojekte laufen, in der Erfolgsrechnung taucht davon wenig auf. Woran das liegt und welche drei Fragen zusammen zu klären sind.',
    serviceType: 'KI-Transformation',
    page: kiTransformation,
  },
];

export const pillarPath = (pillar: Pillar) => `/${pillar.slug}/`;

/**
 * Bricht ab, wenn ein Pillar-Slug schon von einer anderen Seite belegt ist
 * (Daten-Seite oder Collection-Eintrag). Sonst überschreibt die Pillar still
 * deren /<slug>.md und llms-full-Abschnitt, während /<slug>/ die alte Seite
 * zeigt. Läuft im Build (src/data/pages/index.ts), weil Netlify keine Tests
 * ausführt.
 */
export const assertPillarSlugsFree = (reserved: Iterable<string>): void => {
  const taken = new Set(reserved);
  const conflicts = pillars.map(p => p.slug).filter(slug => taken.has(slug));
  if (conflicts.length) {
    throw new Error(`Pillar-Slug bereits vergeben: ${conflicts.join(', ')} (src/data/pillars.ts)`);
  }
};
