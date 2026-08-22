import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStripObsidianMarkers, { stripObsidianMarkers } from './obsidian-markers.mjs'

/**
 * Vault-interne Marker dürfen in keinem Kanal ankommen. Der HTML-Pfad läuft
 * über das remark-Plugin, die Markdown-Zwillinge (/…​.md, /llms-full.txt)
 * servieren den rohen Body und brauchen die String-Variante. Anlass
 * 2026-08-22: ein `%% @dieter … %%` stand live in llms-full.txt.
 */

describe('stripObsidianMarkers (roher Body)', () => {
  it('entfernt einen Inline-Marker und lässt den Satz stehen', () => {
    expect(stripObsidianMarkers('Ein Satz %% @dieter kürzen %% mit Marker.'))
      .toBe('Ein Satz  mit Marker.')
  })

  it('entfernt einen mehrzeiligen Marker', () => {
    expect(stripObsidianMarkers('Vorher %% @jochen\nzweite Zeile %% nachher.'))
      .toBe('Vorher  nachher.')
  })

  it('lässt einen alleinstehenden Marker-Absatz keine Lücke hinterlassen', () => {
    const raw = 'Erster Absatz.\n\n%% @dieter Kannst du hier noch einen Link einbauen   %%\n\nZweiter Absatz.'
    expect(stripObsidianMarkers(raw)).toBe('Erster Absatz.\n\nZweiter Absatz.')
  })

  it('entfernt ein Legacy-Dialog-Blockquote samt Folgezeilen', () => {
    const raw = 'Davor.\n\n> [!dieter]+ Einwand\n> Zweite Zeile des Callouts\n\nDanach.'
    expect(stripObsidianMarkers(raw)).toBe('Davor.\n\nDanach.')
  })

  it('lässt markerfreien Text unverändert', () => {
    const raw = '# Titel\n\nEin Absatz mit [Link](https://example.com).\n\n> Ein normales Zitat.\n'
    expect(stripObsidianMarkers(raw)).toBe(raw)
  })

  it('lässt ein einzelnes Prozentzeichen in Ruhe', () => {
    expect(stripObsidianMarkers('79% organisch, 3% über Meta-Ads.'))
      .toBe('79% organisch, 3% über Meta-Ads.')
  })
})

function parseAndStrip(md) {
  const tree = unified().use(remarkParse).parse(md)
  remarkStripObsidianMarkers()(tree)
  return tree
}

const isEmptyParagraph = (node) =>
  node.type === 'paragraph' &&
  node.children.every((child) => child.type === 'text' && child.value.trim() === '')

describe('remarkStripObsidianMarkers (HTML-Pfad)', () => {
  it('hinterlässt keinen leeren Absatz, wenn ein Absatz nur der Marker war', () => {
    const tree = parseAndStrip('Erster Absatz.\n\n%% @dieter Link einbauen %%\n\nZweiter Absatz.')
    expect(tree.children.filter(isEmptyParagraph)).toEqual([])
    expect(tree.children).toHaveLength(2)
  })

  it('behält den Absatz, wenn neben dem Marker noch Text steht', () => {
    const tree = parseAndStrip('Ein Satz %% @dieter kürzen %% mit Marker.')
    expect(tree.children).toHaveLength(1)
    expect(tree.children[0].children[0].value).toBe('Ein Satz  mit Marker.')
  })

  it('entfernt Legacy-Dialog-Blockquotes', () => {
    const tree = parseAndStrip('Davor.\n\n> [!dieter]+ Einwand\n> Zweite Zeile\n\nDanach.')
    expect(tree.children.filter((n) => n.type === 'blockquote')).toEqual([])
  })
})
