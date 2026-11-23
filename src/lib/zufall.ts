/**
 * mulberry32: kleiner, deterministischer PRNG mit Werten in [0, 1).
 * Gemeinsame Quelle für die Papierformen (torn-paper.ts) und den Papierriss
 * (riss.ts). Die PDF-Vorlagen im Akasha-Vault (papierriss.py) rechnen
 * dieselbe Funktion nach – aus denselben Startwerten entstehen dieselben
 * Zahlen.
 */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
