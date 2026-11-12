/**
 * Intrinsische Grösse eines SVG aus der viewBox seines Wurzelelements,
 * gerundet auf ganze Pixel. Dient als width/height am <img> (Figure.astro):
 * Der Browser reserviert damit den Platz, bevor das Bild geladen ist, und der
 * Text darunter springt nicht.
 *
 * Excalidraw exportiert gebrochene Masse (viewBox="0 0 1942.93… 490"), die
 * HTML-Attribute verlangen ganze Zahlen – die Rundung verschiebt das
 * Seitenverhältnis um Bruchteile eines Prozents.
 */
export function svgSize(svg: string): { width: number; height: number } {
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
  const values = root.match(/\bviewBox="([^"]*)"/)?.[1].trim().split(/[\s,]+/).map(Number) ?? [];
  const [, , width, height] = values;

  if (values.length !== 4 || !(width > 0) || !(height > 0)) {
    throw new Error(`SVG ohne brauchbare viewBox: ${root.slice(0, 120) || '(kein <svg>-Element)'}`);
  }

  return { width: Math.round(width), height: Math.round(height) };
}
