import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { portraetPolygon, tornCss, tornPolygon, tornTokens } from './torn-paper';

const points = (polygon: string) => polygon.replace(/^polygon\(/, '').replace(/\)$/, '').split(', ');
const numbers = (point: string) => point.split(' ').map(v => Number.parseFloat(v));

describe('tornPolygon', () => {
  it('ist deterministisch: gleicher Startwert, gleiche Form', () => {
    expect(tornPolygon(7)).toBe(tornPolygon(7));
  });

  it('liefert für einen anderen Startwert eine andere Form', () => {
    expect(tornPolygon(7)).not.toBe(tornPolygon(11));
  });

  it('ist ein clip-path-Polygon mit 90 Punkten', () => {
    const polygon = tornPolygon(7);
    expect(polygon.startsWith('polygon(')).toBe(true);
    expect(polygon.endsWith(')')).toBe(true);
    expect(polygon.split(',').length - 1).toBe(89);
    expect(points(polygon)).toHaveLength(90);
  });

  it('schreibt jeden Punkt in Prozent mit einer Nachkommastelle', () => {
    for (const point of points(tornPolygon(7))) {
      expect(point).toMatch(/^-?\d+\.\d% -?\d+\.\d%$/);
    }
  });

  it('bleibt mit allen Werten zwischen −5 und 105', () => {
    for (const seed of [7, 11, 23, 1, 2, 3, 99]) {
      for (const point of points(tornPolygon(seed))) {
        for (const value of numbers(point)) {
          expect(value).toBeGreaterThanOrEqual(-5);
          expect(value).toBeLessThanOrEqual(105);
        }
      }
    }
  });

  it('nimmt eine andere Punktzahl an', () => {
    expect(points(tornPolygon(7, { points: 40 }))).toHaveLength(40);
  });

  it('nimmt Anzahl und Stärke der Wellen an', () => {
    expect(tornPolygon(7, { wellen: 5, welle: 0.03 })).not.toBe(tornPolygon(7));
  });
});

describe('portraetPolygon', () => {
  it('ist deterministisch und hat 140 Punkte', () => {
    expect(portraetPolygon(3)).toBe(portraetPolygon(3));
    expect(portraetPolygon(3)).not.toBe(portraetPolygon(17));
    expect(points(portraetPolygon(3))).toHaveLength(140);
  });

  it('bleibt fast rund', () => {
    for (const seed of [3, 17, 29, 41]) {
      for (const point of points(portraetPolygon(seed))) {
        const [x, y] = numbers(point);
        const abstand = Math.hypot(x - 50, y - 50);
        expect(abstand).toBeGreaterThanOrEqual(40);
        expect(abstand).toBeLessThanOrEqual(56);
      }
    }
  });
});

describe('tornTokens', () => {
  it('liefert genau die drei Papierformen als Polygone', () => {
    const tokens = tornTokens();
    expect(Object.keys(tokens).sort()).toEqual(['--torn-1', '--torn-2', '--torn-3']);
    for (const value of Object.values(tokens)) {
      expect(value.startsWith('polygon(')).toBe(true);
    }
  });
});

describe('tornCss', () => {
  it('legt die Papierformen auf :root', () => {
    const css = tornCss();
    expect(css).toContain(':root {');
    for (const [name, value] of Object.entries(tornTokens())) {
      expect(css).toContain(`${name}: ${value};`);
    }
  });

  it('legt den Papierriss für Sockelkante und Knöpfe dazu, die alte Zackenkante nicht mehr', () => {
    const css = tornCss();
    expect(css).toContain('--riss-kante: url("data:image/svg+xml,');
    expect(css).toContain('--riss-oben: url("data:image/svg+xml,');
    expect(css).toContain('--riss-unten: url("data:image/svg+xml,');
    expect(css).toContain('--riss-faser: url("data:image/svg+xml,');
    expect(css).toContain('--riss-seiten: polygon(');
    expect(css).toContain('--riss-knopf-faser: #DA8A87;');
    expect(css).not.toContain('--torn-edge');
  });

  it('steht unverändert in src/styles/torn-paper.css (sonst: node scripts/torn-css.mjs)', () => {
    const file = readFileSync(new URL('../styles/torn-paper.css', import.meta.url), 'utf8');
    expect(file).toBe(tornCss());
  });
});
