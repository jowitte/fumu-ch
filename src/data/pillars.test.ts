import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assertPillarSlugsFree, pillarPath, pillars } from './pillars';
import { wasWirTun } from './pages/was-wir-tun';
import { isLink } from './pages/types';
import type { Rich, Section } from './pages/types';

/**
 * Prüft, was der Build nicht prüft: Inline-Links im Rich-Text sind Strings,
 * ein Tippfehler im Slug landet sonst still auf einer 404.
 */

const perspektive = (slug: string) => new URL(`../content/perspektiven/${slug}.md`, import.meta.url);

const isDraft = (slug: string) => /^draft:\s*true\s*$/m.test(readFileSync(perspektive(slug), 'utf8').split('\n---', 2)[0]);

const hrefs = (sections: Section[]): string[] =>
  sections.flatMap(section =>
    section.items.flatMap(item => {
      if (item.kind !== 'item') return [];
      const body: Rich = item.body;
      return typeof body === 'string' ? [] : body.flatMap(part => (isLink(part) ? [part.href] : []));
    }),
  );

describe('Pillar-Registry', () => {
  it('führt jeden Slug nur einmal', () => {
    const slugs = pillars.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('bricht ab, wenn ein Pillar-Slug schon von einer anderen Seite belegt ist', () => {
    expect(() => assertPillarSlugsFree(['about', 'ki-transformation'])).toThrow(/ki-transformation/);
  });

  it('lässt freie Slugs durch', () => {
    expect(() => assertPillarSlugsFree(['about', 'kontakt', 'home'])).not.toThrow();
  });
});

describe.each(pillars.map(p => [p.slug, p] as const))('%s', (_slug, pillar) => {
  const { page } = pillar;

  it('steht in der Pillar-Liste auf /was-wir-tun/, mit Kurzlabel und eigenem Teaser', () => {
    const entries = wasWirTun.sections.flatMap(s => s.items).flatMap(item => (item.kind === 'links' ? item.entries : []));
    expect(entries).toContainEqual({ title: pillar.label, href: pillarPath(pillar), teaser: pillar.teaser });
  });

  it('wiederholt das Kurzlabel nicht am Anfang des Teasers', () => {
    expect(pillar.teaser).toBeTruthy();
    expect(pillar.teaser.startsWith(pillar.label)).toBe(false);
  });

  it('hat einen eigenen H1 und einen Lead', () => {
    expect(page.heading).toBeTruthy();
    expect(page.intro.length).toBeGreaterThan(0);
  });

  it('endet mit Formaten und FAQ, wie es der Bauplan verlangt', () => {
    const ids = page.sections.map(s => s.id);
    expect(ids.slice(-2)).toEqual(['formate', 'faq']);
  });

  it('trägt jede FAQ als Frage mit Antwort', () => {
    const faq = page.sections.find(s => s.id === 'faq')!;
    for (const item of faq.items) {
      expect(item.kind).toBe('item');
      if (item.kind === 'item') expect(item.title).toMatch(/\?$/);
    }
  });

  it('verweist nur auf vorhandene Perspektiven, die kein Entwurf sind (Termin prüft der Build)', () => {
    const inline = hrefs(page.sections)
      .map(href => href.match(/^\/perspektiven\/([^/]+)\/$/)?.[1])
      .filter((slug): slug is string => Boolean(slug));
    const slugs = [...inline, ...(page.relatedPerspektiven?.slugs ?? [])];

    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(existsSync(perspektive(slug)), slug).toBe(true);
      expect(isDraft(slug), slug).toBe(false);
    }
  });

  it('enthält keine Obsidian-Reste aus der Vault-Notiz', () => {
    expect(JSON.stringify(page)).not.toMatch(/%%|\[\[|\*\*H1:|\*\*Lead:|@jochen|@dieter/);
  });
});
