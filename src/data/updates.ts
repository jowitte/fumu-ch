// Nicht-Perspektiven-Einträge für den Update-Stream der Homepage.
// Perspektiven kommen aus der Content-Collection; hier stehen Releases
// (Launches wie der AI-Crawler-Radar). Datum = Release-Tag, bestimmt die
// Position im Stream.

export interface ReleaseUpdate {
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  href: string;
  // Doodle-Icon (fumu-icon-Stil), Pfad unter /public.
  icon?: string;
}

export const releases: ReleaseUpdate[] = [
  {
    date: '2026-07-16',
    title: 'AI-Crawler-Radar',
    description:
      'Welche AI-Crawler lassen gut 100 Sites in der robots.txt zu? Snapshot und Verlauf der fumu-Erhebung, Schwerpunkt Schweiz.',
    href: '/ai-crawler-radar/',
    icon: '/images/icons/ai-crawler-radar.webp',
  },
];
