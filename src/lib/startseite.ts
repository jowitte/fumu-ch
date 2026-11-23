/**
 * Flächenfarben der Startseite nach den Farbregeln des Entwurfs
 * (docs/plans/2026-11-22-neues-design-entwurf.md):
 * - Regel 4: Coral als grosse Fläche einmal pro Seite – die Karte der
 *   ersten Leistung.
 * - Die zweite Leistung bekommt Safran, alle weiteren Rosé-hell.
 * - Regel 2: höchstens eine Safran-Fläche pro Bildschirmhöhe. Kopfbild und
 *   Themen-Karten stehen auf dem Desktop auf demselben ersten Bildschirm;
 *   gibt es eine Safran-Karte, verzichtet das Kopfbild auf sein Safran-Papier.
 */
export type ThemaTon = 'coral' | 'saffron' | 'blush-light';

export const startseitenFlaechen = (anzahlThemen: number): { themen: ThemaTon[]; heroSafran: boolean } => {
  const themen = Array.from({ length: anzahlThemen }, (_, i): ThemaTon =>
    i === 0 ? 'coral' : i === 1 ? 'saffron' : 'blush-light',
  );
  return { themen, heroSafran: !themen.includes('saffron') };
};
