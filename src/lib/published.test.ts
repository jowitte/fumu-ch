import { describe, expect, it } from 'vitest';
import { isDue, isPublished, isScheduled } from './published';

/**
 * Geplantes Publizieren (2026-09-23): Ein Stück mit Datum in der Zukunft darf
 * nirgends auf der Site erscheinen, bis der tägliche Build es erreicht. Der
 * Datumsvergleich ist in isDue isoliert, weil isPublished im Dev-Modus (und
 * damit unter Vitest) immer sichtbar meldet.
 */

const now = new Date('2026-10-27T04:00:00Z');
const entry = (date: string, draft = false) =>
  ({ data: { date: new Date(date), draft } }) as Parameters<typeof isPublished>[0];

describe('isDue', () => {
  it('gestern, heute und morgen gegen einen festen Zeitpunkt', () => {
    expect(isDue(new Date('2026-10-26'), now)).toBe(true);
    expect(isDue(new Date('2026-10-27'), now)).toBe(true);
    expect(isDue(new Date('2026-10-28'), now)).toBe(false);
  });
});

describe('isScheduled', () => {
  it('nur ein Nicht-Entwurf mit künftigem Datum ist geplant', () => {
    expect(isScheduled(entry('2026-10-28'), now)).toBe(true);
    expect(isScheduled(entry('2026-10-27'), now)).toBe(false);
    expect(isScheduled(entry('2026-10-28', true), now)).toBe(false);
  });
});

describe('isPublished', () => {
  it('ein Entwurf ist nie sichtbar, auch nicht im Dev-Modus', () => {
    expect(isPublished(entry('2026-10-26', true), now)).toBe(false);
  });
});
