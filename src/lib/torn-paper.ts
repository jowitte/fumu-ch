/**
 * Gerissenes Papier als clip-path-Polygone. Die Formen entstehen beim Build
 * aus festen Startwerten, damit jede Seite und jeder Build dieselbe Kante
 * zeigt – nicht zufällig im Browser. BaseLayout legt sie als CSS-Variablen
 * `--torn-*` auf :root; Papierflächen hinter Bildern und die Oberkante des
 * Sockels lesen sie mit `clip-path: var(--torn-N)`.
 *
 * Portiert aus `torn()` in docs/plans/assets/2026-11-22-neues-design/mix4.py
 * (Entwurf «Mischung 4»), mit eigenem PRNG statt Pythons random.Random.
 */

/** mulberry32: kleiner, deterministischer PRNG mit Werten in [0, 1). */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

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

const percent = (value: number) => `${Number(value.toFixed(1))}%`;

/**
 * Gerissene Oberkante einer Fläche: Zacken von links nach rechts, die
 * abwechselnd über und unter der Mitte liegen, dann unten über beide Ecken
 * geschlossen. Die Box ist dafür nur wenige Pixel hoch.
 */
export const tornEdge = (seed: number, teeth = 20): string => {
  const rnd = mulberry32(seed);
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const y = 50 + side * uniform(rnd, 4, 22);
    pts.push(`${percent((i * 100) / teeth)} ${percent(y)}`);
  }
  return `polygon(${pts.join(', ')}, 100% 100%, 0% 100%)`;
};

export type TornTokens = Record<'--torn-1' | '--torn-2' | '--torn-3' | '--torn-edge', string>;

/** Die Formen der Site, als CSS-Variablen für :root. */
export const tornTokens = (): TornTokens => ({
  '--torn-1': tornPolygon(7),
  '--torn-2': tornPolygon(11, { points: 70, jitter: 0.05, cx: 50, cy: 50, rx: 46, ry: 45 }),
  '--torn-3': tornPolygon(23),
  '--torn-edge': tornEdge(3),
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
${Object.entries(tornTokens())
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
`;
