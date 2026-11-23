import { describe, expect, it } from 'vitest';
import { leistungsToene } from './leistungs-toene';

/**
 * Regeln 2 und 4 des Design-Entwurfs vom 22.11.
 * (docs/plans/2026-11-22-neues-design-entwurf.md): Coral als grosse Fläche
 * einmal pro Seite, höchstens eine Safran-Fläche pro Bildschirmhöhe. Gilt für
 * die Leistungs-Karten auf der Startseite und auf /was-wir-tun/.
 */
describe('leistungsToene', () => {
  it('keine Leistung: keine Fläche', () => {
    expect(leistungsToene(0)).toEqual([]);
  });

  it('eine Leistung: Coral', () => {
    expect(leistungsToene(1)).toEqual(['coral']);
  });

  it('zwei Leistungen: Coral, dann Safran', () => {
    expect(leistungsToene(2)).toEqual(['coral', 'saffron']);
  });

  it('fünf Leistungen: Coral und Safran je einmal, der Rest Rosé-hell', () => {
    expect(leistungsToene(5)).toEqual(['coral', 'saffron', 'blush-light', 'blush-light', 'blush-light']);
  });
});
