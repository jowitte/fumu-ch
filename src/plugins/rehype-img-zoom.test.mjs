import { describe, expect, it } from 'vitest';
import { toHtml } from 'hast-util-to-html';
import rehypeImgZoom, { isIllustration } from './rehype-img-zoom.mjs';

const img = (src, alt = 'Beschreibung') => ({
  type: 'element',
  tagName: 'img',
  properties: { src, alt, loading: 'lazy', decoding: 'async' },
  children: [],
});
const p = (...children) => ({ type: 'element', tagName: 'p', properties: {}, children });
const text = value => ({ type: 'text', value });
const root = (...children) => ({ type: 'root', children });

const run = tree => {
  rehypeImgZoom()(tree);
  return tree;
};

describe('isIllustration', () => {
  it('erkennt Illustrationen am Dateinamen auf -hero', () => {
    expect(isIllustration('/images/perspektiven/wer-bildet-noch-aus-hero.webp')).toBe(true);
    expect(isIllustration('/images/perspektiven/zero-click-crawl-to-refer.svg')).toBe(false);
    expect(isIllustration('/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp')).toBe(false);
  });
});

describe('rehypeImgZoom', () => {
  it('macht ein Detail-Bild im eigenen Absatz vergrösserbar', () => {
    const html = toHtml(run(root(p(img('/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp')))));
    expect(html).toBe(
      '<figure class="post-figure">' +
        '<button type="button" class="figure-zoom" popovertarget="zoom-robots-txt-vertragsklausel-heatmap">' +
        '<span class="visually-hidden">Vergrössern: </span>' +
        '<img src="/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp" alt="Beschreibung" loading="lazy" decoding="async">' +
        '<span class="zoom-hint" aria-hidden="true">⤢ Vergrössern</span>' +
        '</button>' +
        '<div id="zoom-robots-txt-vertragsklausel-heatmap" popover="" class="zoom-layer">' +
        '<img src="/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp" alt="" loading="lazy" decoding="async">' +
        '<div class="zoom-actions">' +
        '<button type="button" class="zoom-close" popovertarget="zoom-robots-txt-vertragsklausel-heatmap" popovertargetaction="hide">Schliessen</button>' +
        '<a href="/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp" class="zoom-file">In voller Grösse öffnen</a>' +
        '</div></div></figure>',
    );
  });

  it('gibt SVGs die Masse aus der viewBox mit, der Ebene auch das Seitenverhältnis', () => {
    const html = toHtml(run(root(p(img('/images/perspektiven/maschinen-werbemaschine-pipes.svg')))));
    expect(html).toContain('alt="Beschreibung" loading="lazy" decoding="async" width="960" height="798">');
    expect(html).toContain('alt="" width="960" height="798" style="--zoom-ratio: 960 / 798"');
  });

  it('lässt Illustrationen unverändert', () => {
    const tree = root(p(img('/images/perspektiven/wer-bildet-noch-aus-hero.webp')));
    const before = toHtml(tree);
    expect(toHtml(run(tree))).toBe(before);
  });

  it('lässt Bilder mitten im Text unverändert', () => {
    const tree = root(p(text('Vorher '), img('/images/perspektiven/zero-click-crawl-to-refer.svg'), text(' nachher.')));
    const before = toHtml(tree);
    expect(toHtml(run(tree))).toBe(before);
  });

  it('nimmt Leerraum um das Bild im Absatz nicht als Text', () => {
    const html = toHtml(run(root(p(text('\n'), img('/images/perspektiven/chatgpt-ads-screenshot.webp'), text('\n')))));
    expect(html).toContain('popovertarget="zoom-chatgpt-ads-screenshot"');
  });

  it('vergibt eindeutige IDs, wenn dasselbe Bild zweimal vorkommt', () => {
    const src = '/images/perspektiven/chatgpt-ads-screenshot.webp';
    const html = toHtml(run(root(p(img(src)), p(img(src)))));
    expect(html).toContain('id="zoom-chatgpt-ads-screenshot"');
    expect(html).toContain('id="zoom-chatgpt-ads-screenshot-2"');
  });

  it('findet Bilder auch in verschachtelten Elementen', () => {
    const tree = root({ type: 'element', tagName: 'section', properties: {}, children: [p(img('/images/perspektiven/chatgpt-ads-screenshot.webp'))] });
    expect(toHtml(run(tree))).toContain('class="post-figure"');
  });
});
