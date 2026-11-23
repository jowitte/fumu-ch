import { describe, expect, it } from 'vitest';
import { startseitenFlaechen } from './startseite';

/**
 * Regel 2 des Entwurfs: höchstens eine Safran-Fläche pro Bildschirmhöhe.
 * Kopfbild (Safran-Papier) und Themen-Karten stehen auf dem Desktop auf
 * demselben ersten Bildschirm.
 */
describe('startseitenFlaechen', () => {
  it('eine Leistung: Coral-Karte, Safran-Papier im Kopfbild', () => {
    expect(startseitenFlaechen(1)).toEqual({ themen: ['coral'], heroSafran: true });
  });

  it('zwei Leistungen: die zweite Karte ist Safran, das Kopfbild verzichtet auf Safran', () => {
    expect(startseitenFlaechen(2)).toEqual({ themen: ['coral', 'saffron'], heroSafran: false });
  });

  it('weitere Leistungen in Rosé-hell, Safran bleibt einmal', () => {
    const flaechen = startseitenFlaechen(4);
    expect(flaechen.themen).toEqual(['coral', 'saffron', 'blush-light', 'blush-light']);
    expect(flaechen.heroSafran).toBe(false);
  });

  it('ohne Leistung keine Karte, Safran im Kopfbild', () => {
    expect(startseitenFlaechen(0)).toEqual({ themen: [], heroSafran: true });
  });
});
