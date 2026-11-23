import { describe, expect, it } from 'vitest';
import { startseitenFlaechen } from './startseite';

/**
 * Regel 2 des Entwurfs: höchstens eine Safran-Fläche pro Bildschirmhöhe.
 * Das Kopfbild trägt kein Safran-Papier (Entscheid Jochen, 2026-11-23: Es
 * lag hinter der Prozesswand mit dem Coral-Band des Startbilds); Safran gibt
 * es auf der Startseite nur als Karte der zweiten Leistung.
 */
describe('startseitenFlaechen', () => {
  it('eine Leistung: Coral-Karte, Kopfbild ohne Safran', () => {
    expect(startseitenFlaechen(1)).toEqual({ themen: ['coral'], heroSafran: false });
  });

  it('zwei Leistungen: die zweite Karte ist Safran, das Kopfbild bleibt ohne', () => {
    expect(startseitenFlaechen(2)).toEqual({ themen: ['coral', 'saffron'], heroSafran: false });
  });

  it('weitere Leistungen in Rosé-hell, Safran bleibt einmal', () => {
    const flaechen = startseitenFlaechen(4);
    expect(flaechen.themen).toEqual(['coral', 'saffron', 'blush-light', 'blush-light']);
    expect(flaechen.heroSafran).toBe(false);
  });

  it('ohne Leistung keine Karte und kein Safran', () => {
    expect(startseitenFlaechen(0)).toEqual({ themen: [], heroSafran: false });
  });
});
