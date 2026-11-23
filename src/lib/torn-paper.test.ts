import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tornCss, tornEdge, tornPolygon, tornTokens } from './torn-paper';

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
});

describe('tornEdge', () => {
  const edge = tornEdge(3);
  const edgePoints = points(edge).slice(0, -2);

  it('beginnt links und schliesst unten über beide Ecken', () => {
    expect(edge.startsWith('polygon(0% ')).toBe(true);
    expect(edge.endsWith('100% 100%, 0% 100%)')).toBe(true);
  });

  it('hat standardmässig 20 Zacken, also 21 Punkte von 0 bis 100 %', () => {
    expect(edgePoints).toHaveLength(21);
    expect(numbers(edgePoints[0])[0]).toBe(0);
    expect(numbers(edgePoints[20])[0]).toBe(100);
  });

  it('hält die Kante zwischen 25 und 75 %', () => {
    for (const point of edgePoints) {
      const [, y] = numbers(point);
      expect(y).toBeGreaterThanOrEqual(25);
      expect(y).toBeLessThanOrEqual(75);
    }
  });

  it('ist deterministisch', () => {
    expect(tornEdge(3)).toBe(edge);
  });
});

describe('tornTokens', () => {
  it('liefert genau die vier CSS-Variablen als Polygone', () => {
    const tokens = tornTokens();
    expect(Object.keys(tokens).sort()).toEqual(['--torn-1', '--torn-2', '--torn-3', '--torn-edge']);
    for (const value of Object.values(tokens)) {
      expect(value.startsWith('polygon(')).toBe(true);
    }
  });
});

describe('tornCss', () => {
  it('legt die vier Variablen auf :root', () => {
    const css = tornCss();
    expect(css).toContain(':root {');
    for (const [name, value] of Object.entries(tornTokens())) {
      expect(css).toContain(`${name}: ${value};`);
    }
  });

  it('steht unverändert in src/styles/torn-paper.css (sonst: node scripts/torn-css.mjs)', () => {
    const file = readFileSync(new URL('../styles/torn-paper.css', import.meta.url), 'utf8');
    expect(file).toBe(tornCss());
  });
});
