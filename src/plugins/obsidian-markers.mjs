/**
 * Vault-interne Marker (Obsidian-Kommentare, Legacy-Dialog-Callouts) gehören in
 * keinen publizierten Kanal. Pendant zu .claude/lib/publish/scripts/dialog_filter.py
 * im Akasha-Vault – Belt-and-Suspenders, falls der Pre-Build-Check im
 * /fumu-web-Skill durchrutscht.
 *
 * Zwei Ausprägungen, weil die Site zwei Kanäle bedient:
 * - `remarkStripObsidianMarkers` für den HTML-Pfad (Markdown-Pipeline).
 * - `stripObsidianMarkers` für die Markdown-Zwillinge und llms-full.txt, die
 *   den rohen Body servieren und deshalb nie durch remark laufen.
 */

const INLINE_COMMENT = /%%[\s\S]*?%%/g;
const LEGACY_DIALOG_CALLOUT = /^\s*\[!(?:dieter|jochen)\][-+]?/;
const LEGACY_DIALOG_BLOCK = /^>[ \t]*\[!(?:dieter|jochen)\][-+]?.*(?:\n>.*)*\n?/gm;

/** Roher Markdown-Text ohne Vault-Marker. */
export function stripObsidianMarkers(raw) {
  if (!raw) return raw;

  return raw
    .replace(INLINE_COMMENT, '')
    .replace(LEGACY_DIALOG_BLOCK, '')
    // Ein Marker, der einen eigenen Absatz füllte, hinterlässt sonst eine Lücke.
    .replace(/\n{3,}/g, '\n\n');
}

const isLegacyDialogBlockquote = (node) => {
  if (node.type !== 'blockquote') return false;
  const first = node.children?.[0];
  if (first?.type !== 'paragraph') return false;
  const firstText = first.children?.[0];
  return firstText?.type === 'text' && LEGACY_DIALOG_CALLOUT.test(firstText.value);
};

const isEmptyParagraph = (node) =>
  node.type === 'paragraph' &&
  node.children?.length > 0 &&
  node.children.every((child) => child.type === 'text' && child.value.trim() === '');

export default function remarkStripObsidianMarkers() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !isLegacyDialogBlockquote(child));
    for (const child of node.children) {
      if (child.type === 'text' && typeof child.value === 'string') {
        child.value = child.value.replace(INLINE_COMMENT, '');
      }
      walk(child);
    }
    // Erst nach dem Strippen sichtbar: ein Absatz, der nur den Marker trug,
    // würde sonst als leeres <p> im HTML stehen.
    node.children = node.children.filter((child) => !isEmptyParagraph(child));
  };

  return (tree) => walk(tree);
}
