import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { wasWirTun } from './was-wir-tun';
import { sectionById, sectionsByIds } from './types';
import type { PageContent } from './types';

/**
 * /was-wir-tun/ rendert seine Sektionen selbst (was-wir-tun.astro) und findet
 * sie über die `id`, nicht über das Label: Benennt der Vault eine Sektion um,
 * bleibt die Seite stehen; fehlt eine `id`, bricht der Build mit klarer
 * Meldung, statt eine Sektion leer zu rendern.
 */
describe('wasWirTun', () => {
  it('trägt die vier Sektionen mit ihren Ankern', () => {
    expect(wasWirTun.sections.map(s => s.id)).toEqual(['ansatz', 'schwerpunkt', 'leistungen', 'referenzen']);
  });

  it('findet eine Sektion über ihre id', () => {
    expect(sectionById(wasWirTun, 'leistungen').label).toBe('Leistungen');
  });

  it('bricht ab, wenn eine id fehlt', () => {
    expect(() => sectionById(wasWirTun, 'gibt-es-nicht')).toThrow('Sektion mit id «gibt-es-nicht» fehlt');
  });

  it('zeigt im Kopf ein Diagramm, das unter public liegt', () => {
    expect(wasWirTun.hero?.src).toMatch(/\.svg$/);
    expect(existsSync(join('public', wasWirTun.hero!.src))).toBe(true);
  });

  const ids = ['ansatz', 'schwerpunkt', 'leistungen', 'referenzen'];

  it('gibt genau die erwarteten Sektionen in ihrer Reihenfolge zurück', () => {
    expect(sectionsByIds(wasWirTun, ids).map(s => s.label)).toEqual(['Unser Ansatz', 'Schwerpunkt', 'Leistungen', 'Referenzen']);
  });

  it('bricht ab, wenn eine Sektion dazukommt, die die Seite nicht rendert', () => {
    const mehr: PageContent = { ...wasWirTun, sections: [...wasWirTun.sections, { label: 'Häufige Fragen', items: [] }] };
    expect(() => sectionsByIds(mehr, ids)).toThrow('«Häufige Fragen»');
  });

  it('bricht ab, wenn die Reihenfolge wechselt', () => {
    const umgestellt: PageContent = { ...wasWirTun, sections: [...wasWirTun.sections].reverse() };
    expect(() => sectionsByIds(umgestellt, ids)).toThrow('in dieser Reihenfolge');
  });
});
