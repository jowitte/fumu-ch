/**
 * Flächenfarben der Leistungs-Karten nach Position, für die Startseite und
 * /was-wir-tun/ – Farbregeln des Entwurfs
 * (docs/plans/2026-11-22-neues-design-entwurf.md):
 * - Regel 4: Coral als grosse Fläche einmal pro Seite – die Karte der
 *   ersten Leistung.
 * - Die zweite Leistung bekommt Safran, alle weiteren Rosé-hell.
 * - Regel 2: höchstens eine Safran-Fläche pro Bildschirmhöhe – Safran gibt es
 *   deshalb nur auf der zweiten Karte.
 */
export type ThemaTon = 'coral' | 'saffron' | 'blush-light';

export const leistungsToene = (anzahl: number): ThemaTon[] =>
  Array.from({ length: anzahl }, (_, i): ThemaTon => (i === 0 ? 'coral' : i === 1 ? 'saffron' : 'blush-light'));
