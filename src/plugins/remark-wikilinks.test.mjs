import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { slug } from 'github-slugger'
import remarkWikilinks from './remark-wikilinks.mjs'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'

const cases = JSON.parse(
  readFileSync(new URL('./fixtures/slug_cases.json', import.meta.url))
)

describe('slug parity', () => {
  for (const c of cases) {
    it(`slug("${c.input}") === ${c.expected}`, () => {
      expect(slug(c.input)).toBe(c.expected)
    })
  }
})

function run(md) {
  return unified()
    .use(remarkParse)
    .use(remarkWikilinks)
    .use(remarkStringify)
    .processSync(md)
    .toString()
}

describe('remark-wikilinks', () => {
  it('anchor wikilink → internal link', () => {
    expect(run('Siehe [[#Deep Learning|hier]].')).toContain('[hier](#deep-learning)')
  })
  it('note wikilink → text', () => {
    const out = run('Siehe [[Notiz|Alias]] und [[Andere]].')
    expect(out).toContain('Alias')
    expect(out).toContain('Andere')
    expect(out).not.toContain('[[')
  })
  it('external link untouched', () => {
    expect(run('[fumu](https://fumu.ch)')).toContain('[fumu](https://fumu.ch)')
  })
})
