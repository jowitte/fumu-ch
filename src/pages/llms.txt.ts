import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('perspektiven', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const perspektivenList = posts
    .map(p => `- [${p.data.title}](https://fumu.ch/perspektiven/${p.id}/): ${p.data.description}`)
    .join('\n');

  const body = `# fumu

> fumu ist eine Strategieberatung für Digital Advertising, AdTech/MarTech und AI-Integration. Wir beraten Verlage, Medienunternehmen, Werbevermarkter und Brands im DACH-Raum.

## Über uns

fumu verbindet Strategie, Organisation und Technologie – damit aus technologischem Potenzial echte Wirkung wird. Gegründet von Jochen Witte, vereint fumu Startup-Erfahrung, strategische Disziplin (McKinsey) und technisches Tiefenverständnis.

## Seiten

- [Was wir tun](https://fumu.ch/was-wir-tun/): Strategieberatung, Technologie-Evaluation, Organisationsentwicklung, Interim Leadership
- [Über fumu](https://fumu.ch/about/): Wer wir sind und wie wir arbeiten
- [Perspektiven](https://fumu.ch/perspektiven/): Analysen und Einordnungen zu Technologie, Medien und digitaler Werbung
- [Kontakt](https://fumu.ch/kontakt/): Unverbindliches Erstgespräch vereinbaren

## Perspektiven (Blog)

${perspektivenList}

## Kernthemen

- Digitale Werbung und Programmatic Advertising
- AdTech/MarTech-Ökosystem und Konsolidierung
- AI-Integration in Marketing und Werbung
- Geschäftsmodell-Transformation für Medienunternehmen
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
