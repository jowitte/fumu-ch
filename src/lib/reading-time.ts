/**
 * Lesedauer einer Perspektive in Minuten, aus dem Markdown-Body: 200 Wörter
 * pro Minute, gerundet, mindestens 1. Code-Blöcke, Bilder und HTML-Tags
 * zählen nicht mit. Redesign-Prototyp: Etikett am Rand neben Datum und Thema.
 */
export const readingMinutes = (body: string | undefined): number => {
  const words = (body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
