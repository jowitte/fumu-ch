import { describe, expect, it } from 'vitest';
import { breadcrumbTrail } from './breadcrumb';

const site = 'https://fumu.ch';

describe('breadcrumbTrail', () => {
  it('nennt die aktuelle Seite mit ihrem Titel statt mit dem Slug', () => {
    expect(breadcrumbTrail('/ki-transformation/', 'KI-Transformation', site)).toEqual([
      { name: 'Home', url: 'https://fumu.ch/' },
      { name: 'KI-Transformation', url: 'https://fumu.ch/ki-transformation/' },
    ]);
  });

  it('leitet Zwischenstufen weiter aus dem Pfad ab', () => {
    expect(breadcrumbTrail('/perspektiven/themen/ki-und-arbeit/', 'KI und Arbeit', site)).toEqual([
      { name: 'Home', url: 'https://fumu.ch/' },
      { name: 'Perspektiven', url: 'https://fumu.ch/perspektiven/' },
      { name: 'Themen', url: 'https://fumu.ch/perspektiven/themen/' },
      { name: 'KI und Arbeit', url: 'https://fumu.ch/perspektiven/themen/ki-und-arbeit/' },
    ]);
  });

  it('besteht auf der Startseite nur aus Home', () => {
    expect(breadcrumbTrail('/', 'Startseite', site)).toEqual([{ name: 'Home', url: 'https://fumu.ch/' }]);
  });
});
