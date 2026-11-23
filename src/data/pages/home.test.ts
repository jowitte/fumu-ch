import { describe, expect, it } from 'vitest';
import { home, pillarOfFormat } from './home';
import { about } from './about';
import { pillarPath, pillars } from '../pillars';
import { headingOf, textFragments, toMarkdown } from './to-markdown';
import type { LinksItem, QuoteItem, TextItem } from './types';

/**
 * Übergangs-Startseite (Entwurf «Neues Design», 2026-11-22): nur Texte, die
 * schon auf der Site stehen – Claim und Lead aus dem bisherigen Kopf, die
 * Leistungen aus der Pillar-Registry, die Formate der Pillars, ein Zitat
 * von /about/. HTML und /index.md entstehen beide aus diesem Modul.
 */

const wasWirTun = home.sections.find(s => s.label === 'Was wir tun');
const referenzen = home.sections.find(s => s.label === 'Referenzen');

describe('Kopf', () => {
  it('trägt den Claim als H1', () => {
    expect(home.heading).toBe('Technologie in Wirkung übersetzen.');
    expect(headingOf(home)).toBe('Technologie in Wirkung übersetzen.');
  });

  it('trägt den bisherigen Lead', () => {
    expect(home.intro).toEqual([
      'Wir verbinden Strategie, Organisation und Technologie – damit aus technologischem Potenzial echte Wirkung wird.',
    ]);
  });
});

describe('Was wir tun', () => {
  it('listet die Leistungen aus der Pillar-Registry', () => {
    const links = wasWirTun?.items.find((i): i is LinksItem => i.kind === 'links');
    expect(links?.entries).toEqual(
      pillars.map(p => ({ title: p.label, href: pillarPath(p), teaser: p.teaser })),
    );
    expect(links?.entries[0]).toMatchObject({ title: 'KI-Transformation', href: '/ki-transformation/' });
  });

  it('übernimmt die Formate der Pillars als dieselben Objekte', () => {
    const formate = wasWirTun?.items.filter((i): i is TextItem => i.kind === 'item') ?? [];
    expect(formate.map(f => f.title)).toEqual(['KI-Wertstromanalyse', 'Strategische Begleitung', 'KI-Implementierung']);
    const pillarItems = pillars.flatMap(p => p.page.sections.find(s => s.id === 'formate')?.items ?? []);
    for (const format of formate) {
      expect(pillarItems).toContain(format);
    }
  });
});

describe('pillarOfFormat', () => {
  it('findet die Pillar, aus der ein Format stammt', () => {
    const formate = wasWirTun?.items.filter((i): i is TextItem => i.kind === 'item') ?? [];
    expect(formate.map(f => pillarOfFormat(f)?.slug)).toEqual(['ki-transformation', 'ki-transformation', 'ki-transformation']);
  });

  it('gibt undefined für ein Item, das zu keiner Pillar gehört', () => {
    expect(pillarOfFormat({ kind: 'item', title: 'Fremd', body: 'x' })).toBeUndefined();
  });
});

describe('Referenzen', () => {
  it('zeigt das erste Zitat von /about/', () => {
    const quote = referenzen?.items.find((i): i is QuoteItem => i.kind === 'quote');
    const firstAboutQuote = about.sections.flatMap(s => s.items).find(i => i.kind === 'quote');
    expect(quote?.cite).toBe('Silvano Oeschger, ehem. CEO OneLog AG');
    expect(quote).toBe(firstAboutQuote);
  });
});

describe('Markdown-Zwilling', () => {
  const markdown = toMarkdown(home);

  it('enthält Lead, Leistung und Zitat', () => {
    expect(markdown).toContain(home.intro[0]);
    expect(markdown).toContain('- [KI-Transformation](/ki-transformation/): ');
    expect(markdown).toContain('— Silvano Oeschger, ehem. CEO OneLog AG');
  });

  it('enthält keine Platzhalter und keinen Update-Strom', () => {
    expect(markdown).not.toContain('Platzhalter');
    expect(markdown).not.toContain('Updates');
  });

  it('enthält jedes Klartext-Stück der Seitendaten', () => {
    const missing = textFragments(home).filter(fragment => !markdown.includes(fragment));
    expect(missing).toEqual([]);
  });
});
