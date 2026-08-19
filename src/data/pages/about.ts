import type { PageContent } from './types';

const linkedin = (href: string) => ({ label: 'LinkedIn', href, external: true });

export const about: PageContent = {
  title: 'Über fumu',
  description:
    'Wer wir sind und wie wir arbeiten. Startup-Erfahrung trifft strategische Disziplin und technisches Tiefenverständnis.',
  order: 3,
  intro:
    'Startup-Erfahrung trifft strategische Disziplin. Wir denken in Zusammenhängen, nicht in Silos – und übersetzen zwischen Technik, Organisation und Business.',
  sections: [
    {
      label: 'Gründer',
      items: [
        {
          kind: 'person',
          name: 'Jochen Witte',
          tag: 'Strategie & Umsetzungsbegleitung',
          image: '/images/jochen-witte.jpg',
          anchor: 'jochen-witte',
          body: '20+ Jahre Digital – Startup-Gründer, Technologie-Chef in Medienhäusern, Strategieberater und AdTech-Experte. Systemische Ausbildung. Konzeption, Projektsteuerung, Sparring.',
          links: [linkedin('https://www.linkedin.com/in/jochenwitte/')],
        },
        {
          kind: 'quote',
          text: 'Seit OneLog im Werbemarkt tätig ist, begleitet uns Jochen – als einer der wenigen, die die Medien- und Werbebranche und die Technologie dahinter gleichermassen verstehen. Er arbeitet ausgesprochen analytisch, bringt komplexe Sachverhalte schnell auf den Punkt und treibt Themen aus eigenem Antrieb voran. In einer Allianz von vier Medienhäusern ist er der Externe, dem alle vertrauen.',
          cite: 'Silvano Oeschger, CEO OneLog AG',
        },
      ],
    },
    {
      label: 'Netzwerk',
      items: [
        {
          kind: 'person',
          name: 'Stefan Ropte',
          tag: 'Requirements & Umsetzung',
          image: '/images/stefan-ropte.png',
          anchor: 'stefan-ropte',
          body: '20+ Jahre IT/AdTech/MarTech – ADvendio MD, ProSiebenSat.1. Requirements Engineering, Vendor-Evaluation, Pilotierung. Business Requirements, Evaluationsmatrix, Prototypen.',
          links: [linkedin('https://www.linkedin.com/in/stefan-ropte-08b7044a/')],
        },
        {
          kind: 'person',
          name: 'Lukas Görög',
          tag: 'KI Akademie',
          image: '/images/lukas-goeroeg.png',
          anchor: 'lukas-goeroeg',
          body: [
            'KI-Strategie und Befähigung für Organisationen. ',
            {
              label: 'Schulungen, Workshops und Begleitung',
              href: 'https://akademie-ki.ch',
              external: true,
            },
            ' auf dem Weg zur systematischen KI-Nutzung.',
          ],
          links: [linkedin('https://www.linkedin.com/in/lukasgorog/')],
        },
        {
          kind: 'person',
          name: 'Daniel Tschudi',
          tag: 'Transformation & EdTech',
          image: '/images/daniel-tschudi.png',
          anchor: 'daniel-tschudi',
          body: [
            'Organisationsentwicklung und agile Transformation. Studiengangsleiter und Dozent an mehreren Schulen. EdTech-Initiativen für den Schweizer Bildungsmarkt – Timeline Education, ',
            { label: 'marketing-hub.online', href: 'https://marketing-hub.online', external: true },
            ' und ',
            { label: 'hfexamplanner.com', href: 'https://hfexamplanner.com', external: true },
            '.',
          ],
          links: [linkedin('https://www.linkedin.com/in/daniel-tschudi-a2954125/')],
        },
      ],
    },
    {
      label: 'Wie wir arbeiten',
      items: [
        {
          kind: 'item',
          title: 'Zuhören, bevor wir raten',
          body: 'Jede Organisation ist anders. Wir verstehen zuerst, bevor wir empfehlen.',
        },
        {
          kind: 'item',
          title: 'Herausfordern – konstruktiv',
          body: 'Wir sagen, was wir denken. Auch wenn es unbequem ist.',
        },
        {
          kind: 'item',
          title: 'Verantwortung übernehmen',
          body: 'Wir stehen zu unseren Empfehlungen und begleiten die Umsetzung.',
        },
        {
          kind: 'item',
          title: 'Transparent arbeiten',
          body: 'Keine Black Box. Unsere Arbeit ist nachvollziehbar.',
        },
        {
          kind: 'quote',
          text: 'Jochen hat uns während unseres Strategieprozesses mit klarer Struktur, proaktiver Kommunikation und fundierter Analyse unterstützt. Seine pragmatische Vorgehensweise war bestens auf unsere Bedürfnisse abgestimmt – besonders überzeugend war seine Fähigkeit, externe Beraterperspektive mit praxisnaher Begleitung zu verbinden.',
          cite: 'Bettina Schoch & Marcel Wehrle, emonitor AG',
        },
      ],
    },
    {
      label: 'Typische Formate',
      items: [
        {
          kind: 'item',
          tag: '8–16 Wochen',
          title: 'Strategische Begleitung',
          body: 'Strukturierte Analyse, Optionenbewertung und Entscheidungsvorlage – von der ersten Hypothese bis zur boardreifen Empfehlung.',
        },
        {
          kind: 'item',
          tag: '6–18 Monate',
          title: 'Interim Leadership',
          body: 'Operative Verantwortung für Transformationsprojekte übernehmen – Strukturen aufbauen, Teams befähigen, Ergebnisse liefern.',
        },
        {
          kind: 'item',
          // klein, weil der Tag im Markdown-Kanal im Satz steht; das HTML setzt ihn per CSS in Versalien
          tag: 'laufend',
          title: 'Sparring',
          body: 'Regelmässiger Austausch auf Augenhöhe für Entscheider – Ideen testen, blinde Flecken aufdecken, Prioritäten schärfen.',
        },
        {
          kind: 'item',
          tag: '1–5 Tage',
          title: 'KI-Schulungen & Workshops',
          body: 'Praxisnahe Befähigung für Teams und Führungskräfte – von der ersten KI-Orientierung bis zur strategischen Integration. In Kooperation mit der Akademie KI.',
        },
      ],
    },
  ],
};
