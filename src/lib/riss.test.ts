import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  FARBEN,
  fbmPeriodisch,
  knopfKantenSvg,
  knopfSeitenPolygon,
  mischFarbe,
  rissKanteSvg,
  svgDataUri,
} from './riss';

/** Punkte eines Pfads mit der Klasse `cls` (Kante zuerst, dann zwei Ecken, dann Z). */
const kante = (svg: string, cls = 'flaeche') => {
  const d = svg.match(new RegExp(`<path class="${cls}" d="([^"]+)"`))?.[1] ?? '';
  const punkte = [...d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m => [Number(m[1]), Number(m[2])]);
  return punkte.slice(0, -2);
};

describe('mischFarbe', () => {
  it('mischt Pflaume und Coral mit 37 % Weiss zum Faserton der PDF-Vorlagen', () => {
    expect(mischFarbe(FARBEN.plum, FARBEN.white, 0.37)).toBe('#897484');
    expect(mischFarbe(FARBEN.coral, FARBEN.white, 0.37)).toBe('#DA8A87');
  });
});

describe('FARBEN', () => {
  it('stimmt mit den Tokens in global.css überein', () => {
    const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');
    for (const [name, hex] of Object.entries(FARBEN)) {
      expect(css).toContain(`--color-${name}: ${hex};`);
    }
  });
});

describe('fbmPeriodisch', () => {
  const f = fbmPeriodisch(21, 8, 0.56, 5);

  it('ist deterministisch', () => {
    const g = fbmPeriodisch(21, 8, 0.56, 5);
    for (let x = 0; x < 5; x += 0.37) expect(g(x)).toBe(f(x));
  });

  it('wiederholt sich nach einer Periode', () => {
    for (let x = 0; x < 5; x += 0.37) expect(Math.abs(f(x) - f(x + 5))).toBeLessThan(1e-9);
  });

  it('bleibt zwischen −1 und 1', () => {
    for (let x = 0; x < 5; x += 0.013) {
      expect(f(x)).toBeGreaterThanOrEqual(-1);
      expect(f(x)).toBeLessThanOrEqual(1);
    }
  });
});

describe('rissKanteSvg', () => {
  const svg = rissKanteSvg({ farbe: FARBEN.plum, faser: '#897484' });

  it('ist eine Kachel von 1100 × 48 px in Pflaume mit Faserton', () => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('width="1100"');
    expect(svg).toContain('height="48"');
    expect(svg).toContain(FARBEN.plum);
    expect(svg).toContain('#897484');
  });

  it('schliesst ohne Naht an die nächste Kachel an', () => {
    const punkte = kante(svg);
    expect(punkte[0][0]).toBe(0);
    expect(punkte.at(-1)?.[0]).toBe(1100);
    expect(punkte.at(-1)?.[1]).toBe(punkte[0][1]);
  });

  it('bleibt mit der Kante in der Kachel', () => {
    for (const [, y] of kante(svg)) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(48);
    }
  });

  it('ist deterministisch', () => {
    expect(rissKanteSvg({ farbe: FARBEN.plum, faser: '#897484' })).toBe(svg);
  });
});

describe('knopfKantenSvg', () => {
  const arten = ['oben', 'unten', 'faser'] as const;

  it('liefert Kacheln von 300 × 10 px', () => {
    for (const art of arten) {
      const svg = knopfKantenSvg(art);
      expect(svg).toContain('width="300"');
      expect(svg).toContain('height="10"');
    }
  });

  it('schliessen ohne Naht und bleiben in der Kachel', () => {
    for (const art of arten) {
      const punkte = kante(knopfKantenSvg(art));
      expect(punkte[0][0]).toBe(0);
      expect(punkte.at(-1)?.[0]).toBe(300);
      expect(punkte.at(-1)?.[1]).toBe(punkte[0][1]);
      for (const [, y] of punkte) {
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(10);
      }
    }
  });

  it('reisst oben und unten verschieden', () => {
    expect(knopfKantenSvg('oben')).not.toBe(knopfKantenSvg('unten'));
  });
});

describe('knopfSeitenPolygon', () => {
  const polygon = knopfSeitenPolygon();

  it('schneidet nur die Seiten, oben und unten reicht es über den Rand', () => {
    expect(polygon.startsWith('polygon(')).toBe(true);
    expect(polygon).toContain('-20%');
    expect(polygon).toContain('120%');
  });

  it('versetzt die Seiten um höchstens 1.5 px', () => {
    const versatz = [...polygon.matchAll(/calc\((?:0|100)% [+-] ([\d.]+)px\)/g)].map(m => Number(m[1]));
    expect(versatz.length).toBeGreaterThan(4);
    for (const v of versatz) expect(v).toBeLessThanOrEqual(1.5);
  });
});

describe('svgDataUri', () => {
  it('kodiert das SVG für url() in CSS', () => {
    const uri = svgDataUri('<svg fill="#43233B"/>');
    expect(uri.startsWith('url("data:image/svg+xml,')).toBe(true);
    const nutzteil = uri.slice('url("data:image/svg+xml,'.length, -2);
    expect(nutzteil).not.toMatch(/[#<>"]/);
  });
});
