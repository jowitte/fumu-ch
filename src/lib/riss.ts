/**
 * Feiner Papierriss für Sockelkante und Knöpfe (Redesign-Nacharbeit
 * 2026-11-23, Entwurf docs/plans/2026-11-23-riss-kante-entwurf.md,
 * Variante D «echt gerissen»).
 *
 * Erzeugt beim Build nahtlos kachelbare SVG-Streifen aus periodischem
 * Wertrauschen. tornCss() (torn-paper.ts) legt sie als Data-URIs in
 * Custom Properties; der Sockel wiederholt die Kante über die Breite, die
 * Knöpfe schneiden ihre Fläche mit den Streifen als Maske zu.
 *
 * Rezeptur aus dem Mockup docs/plans/assets/2026-11-23-riss/kante-und-knopf.html
 * (Abschnitt D). Abweichung, freigegeben im Entwurf: Frequenzfaktor pro
 * Oktave genau 2 und Gitter periodisch, damit die Kachel ohne Naht
 * anschliesst.
 */
import { mulberry32 } from './zufall';

/** Grundfarben aus src/styles/global.css (ein Test hält beide gleich). */
export const FARBEN = {
  white: '#FFFFFF',
  plum: '#43233B',
  coral: '#C44540',
  blush: '#F3D9C4',
} as const;

const kanal = (hex: string, i: number) => Number.parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);

/** Lineare sRGB-Mischung: `anteil` von `mit` in `hex`, gerundet. */
export const mischFarbe = (hex: string, mit: string, anteil: number): string =>
  `#${[0, 1, 2]
    .map(i => Math.round(kanal(hex, i) * (1 - anteil) + kanal(mit, i) * anteil).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

const STUETZEN = 4096;

/**
 * Fraktales Wertrauschen, das sich nach `periode` (in Gittereinheiten der
 * Grundoktave, ganzzahlig) wiederholt: In Oktave o läuft das Gitter mit
 * Frequenz 2^o und wiederholt sich nach periode · 2^o Stützwerten.
 */
export const fbmPeriodisch = (seed: number, oktaven: number, gain: number, periode: number) => {
  if (!Number.isInteger(periode) || periode * 2 ** (oktaven - 1) > STUETZEN) {
    throw new Error(`fbmPeriodisch: Periode ${periode} muss ganzzahlig sein und mit ${oktaven} Oktaven in ${STUETZEN} Stützwerte passen`);
  }
  const rnd = mulberry32(seed);
  const stuetzen = Array.from({ length: STUETZEN }, () => rnd() * 2 - 1);
  const wert = (i: number, p: number) => stuetzen[((i % p) + p) % p];
  return (x: number): number => {
    let a = 1;
    let summe = 0;
    let norm = 0;
    for (let o = 0; o < oktaven; o++) {
      const frequenz = 2 ** o;
      const p = periode * frequenz;
      const xs = x * frequenz + o * 37.1;
      const i = Math.floor(xs);
      const t = xs - i;
      const s = t * t * (3 - 2 * t);
      summe += a * (wert(i, p) * (1 - s) + wert(i + 1, p) * s);
      norm += a;
      a *= gain;
    }
    return summe / norm;
  };
};

const f1 = (n: number) => n.toFixed(1);
const begrenzt = (y: number, hoehe: number) => Math.min(hoehe, Math.max(0, y));

/** x-Werte von 0 bis breite (genau), Abstand möglichst `schritt`. */
const stellen = (breite: number, schritt: number) => {
  const n = Math.round(breite / schritt);
  return Array.from({ length: n + 1 }, (_, i) => (i * breite) / n);
};

/** Kante als Polylinie, dann zwei Ecken, dann zu: «Fläche jenseits der Kante». */
const flaeche = (kante: Array<[number, number]>, ecken: [[number, number], [number, number]]) =>
  `M${kante.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' L')} L${ecken[0].join(',')} L${ecken[1].join(',')} Z`;

export type RissKanteOptionen = {
  /** Farbe der Fläche unterhalb der Kante. */
  farbe: string;
  /** Faserrand und Fasern, heller als die Fläche. */
  faser: string;
  breite?: number;
  hoehe?: number;
  /** Mittlere Höhe der Kante über der Oberkante der Kachel. */
  basis?: number;
};

/**
 * Sockelkante: feiner Riss (9 px · fbm(x / 220), 8 Oktaven, Gain 0.56),
 * dahinter ein stellenweise sichtbarer Faserrand (max(0, 2.6 · fbm₂(x / 55)
 * + 0.4) px), davor 55 kurze Fasern. Unterhalb der Kante ist die Kachel
 * voll gefüllt.
 */
export const rissKanteSvg = ({ farbe, faser, breite = 1100, hoehe = 48, basis = 22 }: RissKanteOptionen): string => {
  const riss = fbmPeriodisch(21, 8, 0.56, breite / 220);
  const rand = fbmPeriodisch(33, 6, 0.6, breite / 55);
  const rnd = mulberry32(5);
  const kante = (x: number) => basis + 9 * riss(x / 220);
  const xs = stellen(breite, 1.5);

  const haupt = xs.map((x): [number, number] => [x, begrenzt(kante(x), hoehe)]);
  const rand_ = xs.map((x): [number, number] => [x, begrenzt(kante(x) - Math.max(0, 2.6 * rand(x / 55) + 0.4), hoehe)]);
  const unten: [[number, number], [number, number]] = [[breite, hoehe], [0, hoehe]];

  let fasern = '';
  for (let i = 0; i < 55; i++) {
    const x = 4 + rnd() * (breite - 8);
    const y = kante(x) - 0.8;
    const laenge = 1 + rnd() * 2.6;
    const winkel = -Math.PI / 2 + (rnd() - 0.5) * 2.2;
    const dx = laenge * Math.cos(winkel);
    const dy = laenge * Math.sin(winkel);
    fasern += `<path d="M${f1(x)},${f1(y)} q${f1(dx / 2 + (rnd() - 0.5))},${f1(dy / 2)} ${f1(dx)},${f1(dy)}" stroke-width="${(0.3 + rnd() * 0.3).toFixed(2)}" opacity="${(0.25 + rnd() * 0.35).toFixed(2)}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}">`
    + `<g class="fasern" stroke="${faser}" fill="none" stroke-linecap="round">${fasern}</g>`
    + `<path class="faser" d="${flaeche(rand_, unten)}" fill="${faser}"/>`
    + `<path class="flaeche" d="${flaeche(haupt, unten)}" fill="${farbe}"/>`
    + '</svg>';
};

/**
 * Streifen für die Knopf-Maske, 300 × 10 px, schwarz auf transparent:
 * - `oben`: Riss um y = 5 (3 px · fbm(x / 60), 7 Oktaven, Gain 0.55), Fläche darunter
 * - `unten`: eigener Riss, Fläche darüber
 * - `faser`: Kante von `oben`, um max(0, 1.8 · fbm(x / 25) + 0.3) px nach oben
 *   versetzt, Fläche darunter – Maske für den hellen Faserrand
 */
export const knopfKantenSvg = (art: 'oben' | 'unten' | 'faser'): string => {
  const breite = 300;
  const hoehe = 10;
  const riss = fbmPeriodisch(art === 'unten' ? 43 : 41, 7, 0.55, breite / 60);
  const rand = fbmPeriodisch(45, 6, 0.6, breite / 25);
  const xs = stellen(breite, 1);
  const kante = xs.map((x): [number, number] => {
    const y = 5 + 3 * riss(x / 60) - (art === 'faser' ? Math.max(0, 1.8 * rand(x / 25) + 0.3) : 0);
    return [x, begrenzt(y, hoehe)];
  });
  const ecken: [[number, number], [number, number]] = art === 'unten' ? [[breite, 0], [0, 0]] : [[breite, hoehe], [0, hoehe]];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}">`
    + `<path class="flaeche" d="${flaeche(kante, ecken)}" fill="#000"/></svg>`;
};

/**
 * Leicht unregelmässige Seiten des Knopfs als clip-path: links und rechts
 * je fünf Punkte, um höchstens 1.5 px nach innen versetzt; oben und unten
 * reicht das Polygon über den Rand, damit der Riss der Maske bleibt.
 */
export const knopfSeitenPolygon = (): string => {
  const rnd = mulberry32(51);
  const v = () => (rnd() * 1.5).toFixed(1);
  const hoehen = ['-20%', '30%', '55%', '80%', '120%'];
  const rechts = hoehen.map(h => `calc(100% - ${v()}px) ${h}`);
  const links = hoehen.map(h => `calc(0% + ${v()}px) ${h}`).reverse();
  return `polygon(${[...rechts, ...links].join(', ')})`;
};

/** SVG als `url("data:…")` für CSS, ohne Zeichen, die dort stören. */
export const svgDataUri = (svg: string): string =>
  `url("data:image/svg+xml,${svg
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/"/g, "'")}")`;
