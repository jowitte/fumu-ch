/**
 * Seiteninhalt als einzige Quelle: aus einem PageContent entstehen sowohl das
 * gerenderte Evans-Raster (EvansSection.astro) als auch der Markdown-Kanal
 * (to-markdown.ts, gelesen von /[slug].md und /llms-full.txt).
 *
 * Hintergrund: docs/plans/2026-08-19-seiteninhalt-eine-quelle.md
 */

export type Cta = {
  label: string;
  href: string;
  external?: boolean;
  /** Pfeil hinter dem Label (nur HTML, der Markdown-Kanal ignoriert ihn). */
  arrow?: boolean;
  // Ein Link ist keine Auszeichnung – verhindert { label, href, em } im Rich-Text.
  em?: never;
  strong?: never;
};

/** Auszeichnung im Fliesstext: Kursiv (Werktitel) oder Fett (Begriff). */
export type Emphasis =
  | { em: string; strong?: never; href?: never; label?: never }
  | { strong: string; em?: never; href?: never; label?: never };

/**
 * Fliesstext, der Links und Auszeichnungen enthalten darf – ohne Markdown im
 * Renderer: der einfache Fall ist ein String, sonst eine Folge aus
 * Textstücken, Links und Auszeichnungen.
 */
export type Rich = string | Array<string | Cta | Emphasis>;

/** Ein Teil eines Rich-Texts, der kein reiner String ist oder sein kann. */
export type RichPart = Exclude<Rich, string>[number];

// Type Guards statt `'em' in part`: Die `?: never`-Felder machen Link und
// Auszeichnung gegenseitig unvereinbar, `in` grenzt dann aber nicht mehr ein.
export const isLink = (part: RichPart): part is Cta => typeof part === 'object' && typeof part.href === 'string';
export const isEm = (part: RichPart): part is Extract<Emphasis, { em: string }> =>
  typeof part === 'object' && typeof part.em === 'string';
export const isStrong = (part: RichPart): part is Extract<Emphasis, { strong: string }> =>
  typeof part === 'object' && typeof part.strong === 'string';

/** Standard-Eintrag der Content-Spalte: optionaler Tag, Titel, Fliesstext, optionaler CTA. */
export type TextItem = {
  kind: 'item';
  tag?: string;
  title?: string;
  body: Rich;
  cta?: Cta;
  /**
   * Interaktive Komponente unter dem Text. Im Markdown-Kanal tritt `fallback`
   * an ihre Stelle – ein Formular hat dort keinen Sinn.
   */
  component?: { name: 'newsletter'; fallback: string };
};

/** Person mit Portrait – Gründer und Netzwerk auf /about/. */
export type PersonItem = {
  kind: 'person';
  name: string;
  tag: string;
  image: string;
  body: Rich;
  /** Erscheint im HTML als Link-Zeile unter dem Text, im Markdown als Linkliste. */
  links: Cta[];
  anchor: string;
};

/** Kundenzitat. `cite` trägt Name und Funktion, ohne Gedankenstrich-Präfix. */
export type QuoteItem = {
  kind: 'quote';
  text: string;
  cite: string;
};

/**
 * Referenz-Logos als Reihe. `note` beschreibt das Engagement – im HTML als
 * Untertitel der Reihe, im Markdown-Kanal als Liste hinter dem Namen.
 * Nur Kunden mit dokumentierter Freigabe für Namensnennung und Logo.
 */
export type LogosItem = {
  kind: 'logos';
  entries: Array<{ name: string; image: string; note: string }>;
};

/**
 * Liste aus verlinkten Titeln mit Teaser – verwandte Perspektiven einer
 * Pillar, die Pillar-Liste auf /was-wir-tun/. Im Markdown eine Linkliste.
 */
export type LinksItem = {
  kind: 'links';
  entries: Array<{ title: string; href: string; teaser: string }>;
};

export type Item = TextItem | PersonItem | QuoteItem | LogosItem | LinksItem;

export type Section = {
  /** Text der Coral-Label-Spalte, im Markdown die H2. */
  label: string;
  /**
   * Optionaler HTML-Anker, z.B. `newsletter` für /kontakt/#newsletter.
   * Zwei Werte tragen Bedeutung:
   * - `faq`: Jedes Item ist ein Frage/Antwort-Paar (Frage in `title`, Antwort
   *   in `body`). Daraus entstehen das sichtbare Markup, die H3-Paare im
   *   Markdown und das FAQPage-JSON-LD (structured-data.ts).
   * - `formate`: Items mit `title` sind Service-Formate (Dauer in `tag`) und
   *   speisen den Angebotskatalog im ProfessionalService-JSON-LD.
   */
  id?: string;
  items: Item[];
};

export type PageContent = {
  /** Title-Tag (das Layout hängt «– fumu» an) und Breadcrumb. */
  title: string;
  /** Sichtbare H1, falls sie länger ist als der Title-Tag. Sonst gilt `title`. */
  heading?: string;
  description: string;
  /** Reihenfolge in llms-full.txt – entspricht dem bisherigen Frontmatter-Feld. */
  order: number;
  /** Lead unter der H1, ein Eintrag pro Absatz. */
  intro: string[];
  sections: Section[];
  /**
   * Verwandte Perspektiven als Slugs, aufgelöst zur Build-Zeit gegen die
   * Collection (related.ts). Ein unbekannter Slug bricht den Build.
   */
  relatedPerspektiven?: { label: string; slugs: string[] };
};
