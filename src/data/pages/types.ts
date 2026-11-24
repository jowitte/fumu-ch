/**
 * Seiteninhalt als einzige Quelle: aus einem PageContent entstehen sowohl das
 * gerenderte HTML (Sektion.astro) als auch der Markdown-Kanal
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

/**
 * Bild mit Bildunterschrift, meist ein Diagramm (SVG unter /public/images).
 * Im HTML eine <figure>, die auf die Datei verlinkt (Figure.astro) – auf dem
 * Handy öffnet ein Tippen das Bild in voller Grösse. Im Markdown ein Bild mit
 * der Bildunterschrift als eigener Zeile darunter.
 *
 * Die Bildunterschrift ist optional: Steht die Aussage schon im Text daneben
 * (Kopf von /was-wir-tun/), fehlt sie – dann gibt es weder <figcaption> noch
 * eine Kursivzeile im Markdown.
 */
export type Figure = {
  src: string;
  alt: string;
  caption?: string;
};

/** Bild in der Content-Spalte, in Textbreite. */
export type ImageItem = { kind: 'image' } & Figure;

export type Item = TextItem | PersonItem | QuoteItem | LogosItem | LinksItem | ImageItem;

export type Section = {
  /** Titel der Sektion, im HTML und im Markdown die H2. */
  label: string;
  /**
   * Optionaler HTML-Anker, z.B. `newsletter` für /kontakt/#newsletter.
   * Zwei Werte tragen Bedeutung:
   * - `faq`: Jedes Item ist ein Frage/Antwort-Paar (Frage in `title`, Antwort
   *   in `body`). Daraus entstehen das sichtbare Markup, die H3-Paare im
   *   Markdown und das FAQPage-JSON-LD (structured-data.ts).
   * - `formate`: Items mit `title` sind Service-Formate (Dauer in `tag`) und
   *   speisen den Angebotskatalog im ProfessionalService-JSON-LD.
   * Auf /was-wir-tun/ tragen die ids die Seite (`ansatz`, `schwerpunkt`,
   * `leistungen`, `referenzen`): was-wir-tun.astro holt die Sektionen
   * darüber (sectionsByIds), nicht über das Label.
   */
  id?: string;
  items: Item[];
};

/**
 * Sektion einer Seite über ihre `id` – für Seiten, die ihre Sektionen selbst
 * anordnen (was-wir-tun.astro). Fehlt die `id`, bricht der Build mit dieser
 * Meldung, statt eine Sektion leer zu rendern.
 */
export const sectionById = (page: PageContent, id: string): Section => {
  const section = page.sections.find(s => s.id === id);
  if (!section) throw new Error(`${page.title}: Sektion mit id «${id}» fehlt`);
  return section;
};

/**
 * Genau diese Sektionen, in dieser Reihenfolge – für Seiten, die jede Sektion
 * selbst setzen. Kommt im Datenmodul eine Sektion dazu oder wechselt die
 * Reihenfolge, bricht der Build: Sonst stünde die Änderung im
 * Markdown-Zwilling, und die HTML-Seite liesse sie still weg.
 */
export const sectionsByIds = (page: PageContent, ids: string[]): Section[] => {
  const ist = page.sections.map(s => s.id ?? `«${s.label}»`);
  if (ist.join() !== ids.join()) {
    throw new Error(
      `${page.title}: Sektionen ${ist.join(', ')} – die Seite rendert genau ${ids.join(', ')} in dieser Reihenfolge`,
    );
  }
  return ids.map(id => sectionById(page, id));
};

/**
 * Die Items einer Sektion, wenn sie nur die genannten Arten trägt – für Seiten,
 * die jede Sektion selbst setzen. Kommt aus dem Vault eine andere Art dazu,
 * bricht der Build: Sonst stünde sie nur im Markdown-Zwilling und fehlte auf
 * der HTML-Seite still.
 */
export const itemsOfKinds = <K extends Item['kind']>(
  page: PageContent,
  section: Section,
  ...kinds: K[]
): Extract<Item, { kind: K }>[] => {
  const fremd = section.items.find(item => !kinds.includes(item.kind as K));
  if (fremd) {
    throw new Error(`${page.title}: «${section.label}» enthält ein Item «${fremd.kind}», das die Seite nicht rendert`);
  }
  return section.items as Extract<Item, { kind: K }>[];
};

/**
 * Das eine Item einer Art in einer Sektion – etwa das Zitat, das eine Seite an
 * eine feste Stelle setzt. Fehlt es oder sind es mehrere, bricht der Build.
 */
export const singleItem = <K extends Item['kind']>(
  page: PageContent,
  section: Section,
  kind: K,
): Extract<Item, { kind: K }> => {
  const treffer = section.items.filter(item => item.kind === kind);
  if (treffer.length !== 1) {
    throw new Error(`${page.title}: «${section.label}» braucht genau ein Item «${kind}», hat ${treffer.length}`);
  }
  return treffer[0] as Extract<Item, { kind: K }>;
};

export type PageContent = {
  /** Title-Tag (das Layout hängt «– fumu» an) und Breadcrumb. */
  title: string;
  /** Sichtbare H1, falls sie länger ist als der Title-Tag. Sonst gilt `title`. */
  heading?: string;
  /**
   * Bild direkt unter der H1, vor dem Lead: steht auf dem ersten Bildschirm
   * und darf bis zur Containerbreite gehen. Im Markdown direkt nach der H1.
   * Rendern die Pillar-Route ([pillar].astro) und /was-wir-tun/.
   */
  hero?: Figure;
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
