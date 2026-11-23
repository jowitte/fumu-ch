/**
 * Gerissenes Papier als clip-path-Polygone. Die Formen entstehen beim Build
 * aus festen Startwerten, damit jede Seite und jeder Build dieselbe Kante
 * zeigt – nicht zufällig im Browser. BaseLayout legt sie als CSS-Variablen
 * `--torn-*` auf :root; die Papierflächen hinter Bildern lesen sie mit
 * `clip-path: var(--torn-N)`. Dazu kommen die `--riss-*`-Kacheln für
 * Sockelkante und Knöpfe aus src/lib/riss.ts.
 *
 * Portiert aus `torn()` in docs/plans/assets/2026-11-22-neues-design/mix4.py
 * (Entwurf «Mischung 4»), mit eigenem PRNG statt Pythons random.Random.
 */

import { FARBEN, knopfKantenSvg, knopfSeitenPolygon, mischFarbe, rissKanteSvg, svgDataUri } from './riss.ts';
import { mulberry32 } from './zufall.ts';

const uniform = (rnd: () => number, min: number, max: number) => min + (max - min) * rnd();

/** Hält Ausreisser der Wellen in einem Rahmen, der knapp über die Box hinausgeht. */
const clamp = (value: number) => Math.min(105, Math.max(-5, value));

export type TornOptions = {
  /** Anzahl Punkte auf dem Umfang. */
  points?: number;
  /** Feines Zittern des Radius (Anteil), macht aus der Welle einen Riss. */
  jitter?: number;
  /** Mittelpunkt und Halbachsen der Grundellipse, in Prozent der Box. */
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
};

/**
 * Unregelmässige Ellipse mit gerissener Kante: sieben grosse Wellen geben die
 * Form, das Zittern pro Punkt den Riss.
 */
export const tornPolygon = (seed: number, opts: TornOptions = {}): string => {
  const { points = 90, jitter = 0.035, cx = 52, cy = 52, rx = 47, ry = 44 } = opts;
  const rnd = mulberry32(seed);
  const wobble = Array.from({ length: 7 }, () => uniform(rnd, -0.08, 0.08));
  const pts: string[] = [];
  for (let i = 0; i < points; i++) {
    const t = (2 * Math.PI * i) / points;
    let r = 1 + wobble.reduce((sum, w, k) => sum + w * Math.sin((k + 2) * t + k), 0);
    r += uniform(rnd, -jitter, jitter);
    const x = clamp(cx + rx * r * Math.cos(t));
    const y = clamp(cy + ry * r * Math.sin(t));
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(${pts.join(', ')})`;
};

export type TornTokens = Record<'--torn-1' | '--torn-2' | '--torn-3', string>;

/** Die Papierformen hinter den Bildern, als CSS-Variablen für :root. */
export const tornTokens = (): TornTokens => ({
  '--torn-1': tornPolygon(7),
  '--torn-2': tornPolygon(11, { points: 70, jitter: 0.05, cx: 50, cy: 50, rx: 46, ry: 45 }),
  '--torn-3': tornPolygon(23),
});

/**
 * Der feine Papierriss (src/lib/riss.ts) für Sockelkante und Knöpfe:
 * - `--riss-kante`: Sockel-Oberkante in Pflaume mit Faserton, 1100 × 48 px,
 *   als Hintergrund über die Breite wiederholt
 * - `--riss-oben`, `--riss-unten`, `--riss-faser`: Knopf-Streifen 300 × 10 px
 *   als Masken für Fläche und Faserrand
 * - `--riss-seiten`: leicht unregelmässige Knopfseiten (clip-path)
 * - `--riss-knopf-faser`: Faserton des Knopfs (Coral mit 37 % Weiss)
 */
export const rissTokens = (): Record<string, string> => ({
  '--riss-kante': svgDataUri(
    rissKanteSvg({ farbe: FARBEN.plum, faser: mischFarbe(FARBEN.plum, FARBEN.white, 0.37) }),
  ),
  '--riss-oben': svgDataUri(knopfKantenSvg('oben')),
  '--riss-unten': svgDataUri(knopfKantenSvg('unten')),
  '--riss-faser': svgDataUri(knopfKantenSvg('faser')),
  '--riss-seiten': knopfSeitenPolygon(),
  '--riss-knopf-faser': mischFarbe(FARBEN.coral, FARBEN.white, 0.37),
});

/**
 * Die Tokens als Stylesheet. Steht erzeugt in src/styles/torn-paper.css
 * (`node scripts/torn-css.mjs`), damit Astro es ins gemeinsame, gehashte CSS
 * bündelt statt es in jede Seite zu schreiben. Ein Test hält Datei und
 * Funktion gleich.
 */
export const tornCss = (): string =>
  `/* Erzeugt von scripts/torn-css.mjs aus src/lib/torn-paper.ts – nicht von Hand ändern. */
:root {
${Object.entries({ ...tornTokens(), ...rissTokens() })
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
`;
