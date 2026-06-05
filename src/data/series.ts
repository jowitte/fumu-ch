// Serien-Registry für Perspektiven.
// Quell-Wahrheit für Name und Teaser sind die Epic-Notizen im Akasha-Vault
// (Sektion «Serienseite»). Hier nie umformulieren – nur aus dem Vault nachziehen.

export interface Series {
  name: string;
  teaser: string;
}

export const series: Record<string, Series> = {
  'ai-digitale-werbung': {
    name: 'AI in der digitalen Werbung',
    teaser:
      'Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Sechs Perspektiven zu den Verschiebungen des Jahres 2026 – vom zweiten Unbundling über Agentic Advertising bis zum Reset der Messung.',
  },
  'ki-und-arbeit': {
    name: 'KI und Arbeit',
    teaser:
      'KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Sechs Perspektiven über eine Reorganisation, die ohne Architekt läuft: vom einzelnen Arbeitstag über Team und Organisation bis zum Unternehmen, das aus der Trennung von Voraussage und Entscheidung entsteht.',
  },
};

export function getSeries(slug: string | undefined): Series | undefined {
  return slug ? series[slug] : undefined;
}
