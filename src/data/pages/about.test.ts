import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { authors } from '../../content/authors';
import { about } from './about';
import { itemsOfKinds, sectionById, sectionsByIds, singleItem } from './types';
import type { PageContent, PersonItem, Section } from './types';

const personen = about.sections.flatMap(s => s.items).filter((i): i is PersonItem => i.kind === 'person');
const person = (anchor: string) => {
  const p = personen.find(x => x.anchor === anchor);
  if (!p) throw new Error(`Person ${anchor} fehlt`);
  return p;
};
const text = (body: PersonItem['body']) =>
  (Array.isArray(body) ? body : [body]).map(part => (typeof part === 'string' ? part : part.label)).join('');

/**
 * /about/ rendert seine Sektionen selbst (about.astro, Entwurf vom 24.11.) und
 * findet sie über die `id`. Die Personen-Anker sind das Ziel der Autorenlinks
 * (`getAuthorUrl` → /about/#<slug>).
 */
describe('about', () => {
  it('trägt die vier Sektionen mit ihren Ankern', () => {
    expect(about.sections.map(s => s.id)).toEqual(['gruender', 'netzwerk', 'arbeit', 'formate']);
  });

  it('hat für jeden Autor einen Personen-Anker', () => {
    const anker = personen.map(p => p.anchor);
    for (const slug of Object.keys(authors)) expect(anker).toContain(slug);
  });

  it('nennt bei Jochen das Startjahr', () => {
    const body = text(person('jochen-witte').body);
    expect(body).toContain('Digital seit 1998');
    expect(body).not.toContain('20+');
  });

  it('schreibt die Akademie wie ihre Domain', () => {
    expect(person('lukas-goeroeg').tag).toBe('Akademie KI');
  });

  it('zeigt Porträts, die unter public liegen und höchstens 200 KB wiegen', () => {
    for (const p of personen) {
      const pfad = join('public', p.image);
      expect(existsSync(pfad), pfad).toBe(true);
      expect(statSync(pfad).size, pfad).toBeLessThanOrEqual(200_000);
    }
  });
});

/**
 * Was der Vault dazugibt und die Seite nicht rendert, bricht den Build – sonst
 * stünde es nur im Markdown-Zwilling und fehlte auf der HTML-Seite still.
 */
describe('Wächter', () => {
  const netzwerk = sectionById(about, 'netzwerk');
  const gruender = sectionById(about, 'gruender');

  it('lässt die Item-Arten durch, die eine Sektion trägt', () => {
    expect(itemsOfKinds(about, netzwerk, 'person')).toHaveLength(3);
  });

  it('bricht ab, wenn eine Sektion eine fremde Item-Art trägt', () => {
    const mitBild: Section = { ...netzwerk, items: [...netzwerk.items, { kind: 'image', src: '/x.svg', alt: 'x' }] };
    expect(() => itemsOfKinds(about, mitBild, 'person')).toThrow('«Netzwerk» enthält ein Item «image»');
  });

  it('findet das eine Zitat einer Sektion', () => {
    expect(singleItem(about, gruender, 'quote').cite).toMatch(/^Silvano Oeschger/);
  });

  it('bricht ab, wenn eine Sektion zwei Zitate trägt', () => {
    const zitat = singleItem(about, gruender, 'quote');
    const doppelt: Section = { ...gruender, items: [...gruender.items, zitat] };
    expect(() => singleItem(about, doppelt, 'quote')).toThrow('braucht genau ein Item «quote», hat 2');
  });

  it('bricht ab, wenn eine Sektion dazukommt', () => {
    const mehr: PageContent = { ...about, sections: [...about.sections, { label: 'Häufige Fragen', items: [] }] };
    expect(() => sectionsByIds(mehr, ['gruender', 'netzwerk', 'arbeit', 'formate'])).toThrow('«Häufige Fragen»');
  });
});
