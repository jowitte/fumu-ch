/**
 * Flächenfarben der Startseite. Die Leistungs-Karten folgen den Regeln in
 * leistungs-toene.ts (Coral, dann Safran, dann Rosé-hell).
 * - Regel 2: höchstens eine Safran-Fläche pro Bildschirmhöhe. Das Kopfbild
 *   trägt kein Safran-Papier (Entscheid Jochen, 2026-11-23: Es lag hinter der
 *   Prozesswand mit dem Coral-Band des Startbilds). Safran gibt es auf der
 *   Startseite damit nur als Karte der zweiten Leistung.
 */
import { leistungsToene, type ThemaTon } from './leistungs-toene';

export type { ThemaTon };

export const startseitenFlaechen = (anzahlThemen: number): { themen: ThemaTon[]; heroSafran: boolean } => ({
  themen: leistungsToene(anzahlThemen),
  heroSafran: false,
});
