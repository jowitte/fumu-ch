import type { CollectionEntry } from 'astro:content';

type Perspektive = CollectionEntry<'perspektiven'>;

// Ein Stück ist sichtbar, wenn es kein Entwurf ist und sein Datum erreicht ist.
// `date` wird von z.coerce.date() als Mitternacht UTC gelesen; der tägliche
// Build (04:00 UTC, .github/workflows/scheduled-build.yml) liegt danach.
// Im Dev-Server sind geplante Stücke sichtbar, damit die Lokal-Review vor dem
// Push funktioniert.
export function isPublished(entry: Perspektive, now: Date = new Date()): boolean {
  if (entry.data.draft) return false;
  if (import.meta.env.DEV) return true;
  return isDue(entry.data.date, now);
}

// Geplant: kein Entwurf, Datum noch nicht erreicht. Nur im Dev-Server relevant.
export function isScheduled(entry: Perspektive, now: Date = new Date()): boolean {
  return !entry.data.draft && !isDue(entry.data.date, now);
}

export function isDue(date: Date, now: Date): boolean {
  return date.getTime() <= now.getTime();
}
