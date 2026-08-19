import type { PageContent } from './types';

export const wasWirTun: PageContent = {
  title: 'Was wir tun',
  description:
    'Beratung für KI-Transformation in Medien, Marketing und Werbung: Strategie, Organisation, Prozesse und Technologie – bis in die Umsetzung.',
  order: 2,
  intro:
    'Technologie allein verändert nichts. Neue Tools, Plattformen und Algorithmen entfalten erst dann Wirkung, wenn Strategie, Organisation und Prozesse mitspielen. Genau dort arbeiten wir.',
  sections: [
    {
      label: 'Unser Ansatz',
      items: [
        {
          kind: 'item',
          tag: 'Strategie',
          title: 'Klarheit schaffen',
          body: 'Optionen entwickeln, Entscheidungsgrundlagen schaffen, Prioritäten setzen. Nicht Frameworks, sondern Klarheit – was zuerst, was gar nicht, und warum.',
        },
        {
          kind: 'item',
          tag: 'Organisation',
          title: 'Strukturen anpassen',
          body: 'Strukturen, Rollen und Kompetenzen so anpassen, dass neue Strategien auch umgesetzt werden. Technologie scheitert selten an der Technik, fast immer an der Organisation.',
        },
        {
          kind: 'item',
          tag: 'Prozesse',
          title: 'Abläufe neu denken',
          body: 'Bestehende Abläufe verstehen, Brüche identifizieren, neue Verfahren einführen. Vom Audit bis zum laufenden Betrieb.',
        },
        {
          kind: 'item',
          tag: 'Technologie',
          title: 'Technik als Hebel',
          body: 'Technisches Tiefenverständnis einbringen – nicht als Selbstzweck, sondern als Hebel. Wir bewerten Architekturen, begleiten Implementierungen und übersetzen zwischen Technik und Business.',
        },
      ],
    },
    {
      label: 'Schwerpunkt',
      items: [
        {
          kind: 'item',
          tag: 'KI',
          title: 'Künstliche Intelligenz',
          body: 'Isolierte KI-Anwendungen bringen wenig. Die eigentliche Wirkung entsteht, wenn Geschäftsprozesse und Organisation mitgedacht werden. Wir begleiten den Schritt von der Point Solution zur systemischen Verankerung – in Strategie, Abläufen und Strukturen. Und wir setzen um: KI-Implementierung gehört zum Angebot, nicht nur die Beratung dazu.',
        },
        {
          kind: 'item',
          tag: 'Domäne',
          title: 'Medien, Marketing und Werbung',
          body: 'Unser Schwerpunkt liegt in Medien, Marketing und Werbung. Publisher, Agenturen, Vermarkter und Technologie-Anbieter stehen vor massiven Umbrüchen. Wir kennen die Akteure, die Technologie und die Dynamiken dieses Marktes.',
        },
      ],
    },
  ],
};
