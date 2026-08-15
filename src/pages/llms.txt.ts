import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { series as seriesRegistry } from '../data/series';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('perspektiven', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const perspektivenList = posts
    .map(p => `- [${p.data.title}](https://fumu.ch/perspektiven/${p.id}/): ${p.data.description}`)
    .join('\n');

  const serienList = Object.entries(seriesRegistry)
    .map(([slug, data]) => `- [${data.name}](https://fumu.ch/perspektiven/serien/${slug}/): ${data.teaser}`)
    .join('\n');

  const body = `# fumu

> fumu übersetzt Technologie in Wirkung – Beratung für KI-Transformation in Medien, Marketing und Werbung. Wir beraten Verlage, Vermarkter, Agenturen und Marken in der Schweiz und Europa.

## Über uns

fumu verbindet Strategie, Organisation und Technologie – damit aus technologischem Potenzial echte Wirkung wird. Gegründet von Jochen Witte, vereint fumu Startup-Erfahrung, strategische Disziplin (McKinsey) und technisches Tiefenverständnis.

## Seiten

- [Was wir tun](https://fumu.ch/was-wir-tun/): Strategieberatung, Technologie-Evaluation, Organisationsentwicklung, Interim Leadership
- [Über fumu](https://fumu.ch/about/): Wer wir sind und wie wir arbeiten
- [Perspektiven](https://fumu.ch/perspektiven/): Analysen und Einordnungen zu Technologie, Medien und digitaler Werbung
- [Kontakt & Newsletter](https://fumu.ch/kontakt/): Unverbindliches Erstgespräch vereinbaren – und Newsletter-Anmeldung (AdTech, MarTech, AI-Integration)
- [AI-Crawler-Radar](https://fumu.ch/ai-crawler-radar/): Welche AI-Crawler lassen gut 100 Sites in der robots.txt zu? Snapshot und Verlauf, alle 14 Tage erhoben – aktuelle Zahlen als Markdown unter https://fumu.ch/ai-crawler-radar.md

## Serien

${serienList}

## Perspektiven (Blog)

${perspektivenList}

## Kernthemen

- KI-Transformation in Strategie, Organisation, Prozessen und Technologie
- KI-Implementierung: umsetzen, nicht nur beraten
- Digitale Werbung, AdTech/MarTech und Programmatic Advertising
- Geschäftsmodell-Transformation für Medienunternehmen und Vermarkter
- Datenstrategie und First-Party-Data

## Kontakt

- Website: https://fumu.ch
- E-Mail: hello@fumu.ch
- Jochen Witte auf LinkedIn: https://linkedin.com/in/jochenwitte

## Optional

- [Impressum](https://fumu.ch/impressum/)
- [Datenschutz](https://fumu.ch/datenschutz/)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
