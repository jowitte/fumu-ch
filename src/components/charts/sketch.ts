// Deterministischer Pseudo-Zufall (FNV-1a) für den Hand-Look der Charts:
// kein Math.random – der Build muss bei unveränderten Daten bytegleich
// bleiben (sonst Diff-Rauschen im Repo). Gemeinsame Basis für TrendChart
// (Linien-Wobble) und BlockShareBars (Balken-Silhouette).
export const hash01 = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
};
