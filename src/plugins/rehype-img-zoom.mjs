import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { svgSize } from '../lib/svg-size.ts';

/**
 * Detail-Bilder im Markdown (Diagramme, Charts, Screenshots) lassen sich per
 * Klick vergrössern – dasselbe Markup wie Figure.astro auf den Pillar-Seiten,
 * die Stile stehen in global.css («Diagramme vergrössern»). Wer das Markup
 * hier ändert, ändert es dort mit.
 *
 * Illustrationen bleiben, wie sie sind: erkannt am Dateinamen auf «-hero»
 * (Konvention des /fumu-web-Skills, Entscheid Jochen 2026-11-12). Erfasst
 * werden nur Bilder, die allein in einem Absatz stehen – so landet
 * ![alt](src) auf eigener Zeile. Der Absatz wird zur <figure>, weil die
 * Ebene ein Block ist und in <p> nicht stehen darf.
 *
 * SVGs bekommen width/height aus der viewBox: Der Platz steht vor dem Laden,
 * und die Ebene kennt das Seitenverhältnis. Fehlt die Datei unter public/,
 * bricht der Build.
 */
export const isIllustration = src => /-hero\.[a-z0-9]+$/i.test(src);

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });

const isBlank = node => node.type === 'text' && !node.value.trim();

/** Das <img>, wenn der Knoten ein Absatz mit nichts als diesem Bild ist. */
const loneImage = node => {
  if (node.type !== 'element' || node.tagName !== 'p') return null;
  const content = node.children.filter(child => !isBlank(child));
  const [only] = content;
  return content.length === 1 && only.type === 'element' && only.tagName === 'img' ? only : null;
};

export default function rehypeImgZoom() {
  return tree => {
    const seen = new Map();

    const uniqueId = src => {
      const base = `zoom-${src.split('/').pop().replace(/\.[^.]+$/, '')}`;
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      return count === 1 ? base : `${base}-${count}`;
    };

    const zoomFigure = (img, src) => {
      const id = uniqueId(src);
      const size = src.endsWith('.svg')
        ? svgSize(readFileSync(join(process.cwd(), 'public', src), 'utf8'))
        : undefined;
      const dims = size ? { width: size.width, height: size.height } : {};

      return el('figure', { className: ['post-figure'] }, [
        el('button', { type: 'button', className: ['figure-zoom'], popovertarget: id }, [
          el('span', { className: ['visually-hidden'] }, [text('Vergrössern: ')]),
          { ...img, properties: { ...img.properties, ...dims } },
          el('span', { className: ['zoom-hint'], ariaHidden: 'true' }, [text('⤢ Vergrössern')]),
        ]),
        el('div', { id, popover: '', className: ['zoom-layer'] }, [
          el('img', {
            src,
            alt: '',
            ...dims,
            ...(size ? { style: `--zoom-ratio: ${size.width} / ${size.height}` } : {}),
            loading: 'lazy',
            decoding: 'async',
          }),
          el('div', { className: ['zoom-actions'] }, [
            el('button', { type: 'button', className: ['zoom-close'], popovertarget: id, popovertargetaction: 'hide' }, [
              text('Schliessen'),
            ]),
            el('a', { href: src, className: ['zoom-file'] }, [text('In voller Grösse öffnen')]),
          ]),
        ]),
      ]);
    };

    const visit = node => {
      if (!node.children) return;
      node.children = node.children.map(child => {
        const img = loneImage(child);
        const src = img ? String(img.properties?.src ?? '') : '';
        if (img && src.startsWith('/') && !isIllustration(src)) return zoomFigure(img, src);
        visit(child);
        return child;
      });
    };

    visit(tree);
  };
}
