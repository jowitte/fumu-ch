import type { PageContent } from './types';
import { pillarPath, pillars } from '../pillars';

export const wasWirTun: PageContent = {
  title: 'Was wir tun',
  // Diagramm im Kopf rechts neben dem Lead. Quelle im Vault:
  // «Aufwände/fumu Marketing/fumu.ch/assets/diagram-technologie-allein.excalidraw.md»,
  // abgenommen 2026-11-23, Alt-Text von dort. Ohne Bildunterschrift: Der Lead
  // daneben macht die Aussage.
  hero: {
    src: '/images/was-wir-tun/technologie-allein.svg',
    alt: 'Oben, überschrieben mit ‹Technologie allein›, ein Kästchen Technologie; ein gestrichelter Pfeil reisst ab, bevor er das blasse Kästchen Wirkung erreicht. Unten, überschrieben mit ‹mit Strategie, Organisation und Prozessen›, stehen Strategie, Organisation und Prozesse auf einem breiten Kästchen Technologie; eine Klammer fasst alle vier zusammen, von ihr führt ein Pfeil zur Wirkung.',
  },
  description:
    'Beratung für KI-Transformation in Medien, Marketing und Werbung: Strategie, Organisation, Prozesse und Technologie – bis in die Umsetzung.',
  order: 2,
  intro: [
    'Technologie allein verändert nichts. Neue Tools, Plattformen und Algorithmen entfalten erst dann Wirkung, wenn Strategie, Organisation und Prozesse mitspielen. Genau dort arbeiten wir.',
  ],
  sections: [
    {
      // Die ids tragen die Seite: was-wir-tun.astro findet die Sektionen
      // darüber (sectionById), nicht über das Label.
      id: 'ansatz',
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
      id: 'schwerpunkt',
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
    {
      // Pillar-Liste aus der Registry (src/data/pillars.ts). Label gesetzt in
      // der Vault-Session 2026-11-08 («Vertiefung» war die Rückfalloption).
      id: 'leistungen',
      label: 'Leistungen',
      items: [
        {
          kind: 'links',
          entries: pillars.map(pillar => ({
            title: pillar.label,
            href: pillarPath(pillar),
            teaser: pillar.teaser,
          })),
        },
      ],
    },
    {
      id: 'referenzen',
      label: 'Referenzen',
      items: [
        {
          kind: 'logos',
          // Nur Kunden mit dokumentierter Freigabe für Namensnennung und Logo.
          // Weitere Freigaben laufen über die Vault-Story «Kunden-Einwilligungen
          // für Logos und Zitate einholen».
          entries: [
            {
              name: 'OneLog',
              image: '/images/kundenlogos/onelog.webp',
              note: 'Aufbau und strategische Begleitung des Joint Ventures der führenden Schweizer Medienhäuser für digitale Werbeinfrastruktur.',
            },
            {
              name: 'mediatonic',
              image: '/images/kundenlogos/mediatonic.webp',
              note: 'Prozesse und Technologie-Setup einer unabhängigen Mediaagentur, Bestandsaufnahme und Roadmap.',
            },
            {
              name: 'IAB Switzerland',
              image: '/images/kundenlogos/iab.webp',
              note: 'Leitung der Arbeitsgruppe Data & AI, branchenweites KI-Maturity-Assessment.',
            },
            {
              name: 'emonitor',
              image: '/images/kundenlogos/emonitor.webp',
              note: 'Strategieprozess für ein PropTech-Scale-up.',
            },
            {
              name: 'HWZ',
              image: '/images/kundenlogos/hwz.webp',
              note: 'Dozent für Agile Leadership und digitale Transformation.',
            },
          ],
        },
        {
          kind: 'quote',
          text: 'Jochen kennt Medien und Werbung aus der Praxis und versteht, wie eine Agentur organisatorisch tickt. Er hat uns gezeigt, wo unsere Prozesse klemmen, und spricht dabei dieselbe Sprache wie wir. Er analysiert gründlich und packt danach mit an: Die Massnahmen sind mit dem Team in den Workshops entstanden, nicht in einem Bericht. Sie waren sehr zufrieden, und ich bin es auch.',
          cite: 'Christian-Kumar Meier, CEO und Partner bei mediatonic',
        },
      ],
    },
  ],
};
