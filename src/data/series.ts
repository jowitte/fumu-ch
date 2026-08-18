// Themen-Registry für Perspektiven (offene Themenbereiche, seit 2026-08 keine
// abgeschlossenen Serien mehr). «series» bleibt als interner Bezeichner
// (Frontmatter-Feld, Dateiname) erhalten – sichtbar heisst es «Thema».
// Quell-Wahrheit für Name und Teaser sind die Bereichs-Notizen im Akasha-Vault
// (Sektion «Serienseite»). Hier nie umformulieren – nur aus dem Vault nachziehen.

export interface Series {
  name: string;
  teaser: string;
  // Kurzfassung für die Karten auf /perspektiven/ – alle Themen ähnlich lang
  // (~2 Zeilen). Die Themenseite zeigt weiter den vollen teaser.
  cardTeaser: string;
  // Karten-Pastell aus der warmen Flächen-Palette (brand.yaml).
  color: 'sage' | 'lavender' | 'sand';
  // Doodle-Icon der Karte (fumu-icon-Bildstil), Pfad unter /public.
  icon?: string;
  // Optionale Hinweis-Box unter dem Teaser der Themenseite.
  // text trägt Markdown-Inline-Links, gerendert via renderInlineLinks.
  callout?: { label: string; text: string };
}

export const series: Record<string, Series> = {
  'ai-digitale-werbung': {
    name: 'AI in der digitalen Werbung',
    teaser:
      'Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Perspektiven zum laufenden Umbau – vom zweiten Unbundling über Agentic Advertising bis zum Reset der Messung.',
    cardTeaser:
      'Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Perspektiven zum laufenden Umbau.',
    color: 'sage',
    icon: '/images/serien/icon-serie-ai-werbung.webp',
    callout: {
      label: 'Live-Daten',
      text: 'Der [AI-Crawler-Radar](/ai-crawler-radar/) misst alle 14 Tage, wer welche AI-Crawler zulässt – Schwerpunkt Schweiz.',
    },
  },
  'ki-und-arbeit': {
    name: 'KI und Arbeit',
    teaser:
      'KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Perspektiven über eine Reorganisation, die ohne Architekt läuft: vom einzelnen Arbeitstag über Team und Organisation bis zum Unternehmen, das aus der Trennung von Voraussage und Entscheidung entsteht.',
    cardTeaser:
      'KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Perspektiven über eine Reorganisation, die ohne Architekt läuft.',
    color: 'lavender',
    icon: '/images/serien/icon-serie-ki-arbeit.webp',
  },
  'ai-medien': {
    name: 'AI in den Medien',
    teaser:
      'Was passiert mit Medien, wenn Maschinen ihre Inhalte lesen, verwerten und neu zusammensetzen? Perspektiven zwischen Reichweite und Kontrolle.',
    cardTeaser:
      'Was passiert mit den Medien, wenn Maschinen ihre Inhalte lesen, verwerten und neu zusammensetzen?',
    color: 'sand',
    icon: '/images/serien/icon-serie-ai-medien.webp',
  },
};

export function getSeries(slug: string | undefined): Series | undefined {
  return slug ? series[slug] : undefined;
}
