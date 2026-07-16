// Serien-Registry für Perspektiven.
// Quell-Wahrheit für Name und Teaser sind die Epic-Notizen im Akasha-Vault
// (Sektion «Serienseite»). Hier nie umformulieren – nur aus dem Vault nachziehen.

export interface Series {
  name: string;
  teaser: string;
  // Kurzfassung für die Karten auf /perspektiven/ – beide Serien gleich lang
  // (~2 Zeilen). Die Serienseite zeigt weiter den vollen teaser.
  cardTeaser: string;
  // Karten-Pastell aus der warmen Flächen-Palette (brand.yaml).
  color: 'sage' | 'lavender';
  // Doodle-Icon der Karte (fumu-icon-Bildstil), Pfad unter /public.
  icon?: string;
  // Optionale Hinweis-Box unter dem Teaser der Serienseite.
  // text trägt Markdown-Inline-Links, gerendert via renderInlineLinks.
  callout?: { label: string; text: string };
}

export const series: Record<string, Series> = {
  'ai-digitale-werbung': {
    name: 'AI in der digitalen Werbung',
    teaser:
      'Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Sechs Perspektiven zu den Verschiebungen des Jahres 2026 – vom zweiten Unbundling über Agentic Advertising bis zum Reset der Messung.',
    cardTeaser:
      'Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Sechs Perspektiven zu den Verschiebungen des Jahres 2026.',
    color: 'sage',
    icon: '/images/serien/icon-serie-ai-werbung.webp',
    callout: {
      label: 'Live-Daten',
      text: 'Der [AI-Crawler-Radar](/ai-crawler-radar/) misst alle 14 Tage, welche AI-Crawler gut 100 Sites in der robots.txt zulassen. Mit Schwerpunkt Schweiz.',
    },
  },
  'ki-und-arbeit': {
    name: 'KI und Arbeit',
    teaser:
      'KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Sieben Perspektiven über eine Reorganisation, die ohne Architekt läuft: vom einzelnen Arbeitstag über Team und Organisation bis zum Unternehmen, das aus der Trennung von Voraussage und Entscheidung entsteht.',
    cardTeaser:
      'KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Sieben Perspektiven über eine Reorganisation, die ohne Architekt läuft.',
    color: 'lavender',
    icon: '/images/serien/icon-serie-ki-arbeit.webp',
  },
};

export function getSeries(slug: string | undefined): Series | undefined {
  return slug ? series[slug] : undefined;
}
