/**
 * Flächenfarben der Startseite nach den Farbregeln des Entwurfs
 * (docs/plans/2026-11-22-neues-design-entwurf.md):
 * - Regel 4: Coral als grosse Fläche einmal pro Seite – die Karte der
 *   ersten Leistung.
 * - Die zweite Leistung bekommt Safran, alle weiteren Rosé-hell.
 * - Regel 2: höchstens eine Safran-Fläche pro Bildschirmhöhe. Das Kopfbild
 *   trägt kein Safran-Papier (Entscheid Jochen, 2026-11-23: Es lag hinter der
 *   Prozesswand mit dem Coral-Band des Startbilds). Safran gibt es auf der
 *   Startseite damit nur als Karte der zweiten Leistung.
 */
export type ThemaTon = 'coral' | 'saffron' | 'blush-light';

export const startseitenFlaechen = (anzahlThemen: number): { themen: ThemaTon[]; heroSafran: boolean } => {
  const themen = Array.from({ length: anzahlThemen }, (_, i): ThemaTon =>
    i === 0 ? 'coral' : i === 1 ? 'saffron' : 'blush-light',
  );
  return { themen, heroSafran: false };
};
