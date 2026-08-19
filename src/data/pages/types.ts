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
};

/**
 * Fliesstext, der Links enthalten darf – ohne Markdown im Renderer: der
 * einfache Fall ist ein String, sonst eine Folge aus Textstücken und Links.
 */
export type Rich = string | Array<string | Cta>;

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

export type Item = TextItem | PersonItem | QuoteItem;

export type Section = {
  /** Text der Coral-Label-Spalte, im Markdown die H2. */
  label: string;
  /** Optionaler HTML-Anker, z.B. `newsletter` für /kontakt/#newsletter. */
  id?: string;
  items: Item[];
};

export type PageContent = {
  title: string;
  description: string;
  /** Reihenfolge in llms-full.txt – entspricht dem bisherigen Frontmatter-Feld. */
  order: number;
  /** Lead-Absatz unter der H1. */
  intro: string;
  sections: Section[];
};
