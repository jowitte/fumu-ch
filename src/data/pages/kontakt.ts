import type { PageContent } from './types';

export const kontakt: PageContent = {
  title: 'Kontakt & Newsletter',
  description:
    'Lass uns sprechen – oder abonniere den fumu-Newsletter: Perspektiven darauf, wie aus Technologie Wirkung wird, gelegentlich per E-Mail.',
  order: 6,
  intro:
    'Du stehst vor einer strategischen oder technologischen Veränderung und suchst einen Sparringspartner, der Strategie, Organisation und Technologie zusammendenkt? Lass uns reden.',
  sections: [
    {
      label: 'Termin',
      items: [
        {
          kind: 'item',
          title: '25 Minuten Kennenlernen',
          body: 'Kein Pitch, kein Verkaufsgespräch – wir schauen gemeinsam, ob und wie wir helfen können.',
          cta: {
            label: 'Termin vereinbaren',
            href: 'https://fantastical.app/jowitte/25min-video',
            external: true,
            arrow: true,
          },
        },
      ],
    },
    {
      label: 'E-Mail',
      items: [
        {
          kind: 'item',
          body: 'Konkrete Anfrage? Schreib uns direkt – wir antworten innerhalb von 24 Stunden.',
          cta: { label: 'hello@fumu.ch', href: 'mailto:hello@fumu.ch' },
        },
      ],
    },
    {
      label: 'Newsletter',
      id: 'newsletter',
      items: [
        {
          kind: 'item',
          body: 'Perspektiven darauf, wie aus Technologie Wirkung wird – gelegentlich, ohne Lärm, direkt in dein Postfach.',
          component: {
            name: 'newsletter',
            fallback:
              'Zur Anmeldung trägst du deine E-Mail-Adresse auf https://fumu.ch/kontakt/#newsletter ein. Anschliessend erhältst du eine Bestätigungsmail; erst mit dem Klick auf den Bestätigungslink wird die Anmeldung aktiv. Versand über MailerLite (EU-Hosting), Abmeldung jederzeit über den Link in jeder Mail.',
          },
        },
      ],
    },
  ],
};
