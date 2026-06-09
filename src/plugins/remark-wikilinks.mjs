import { findAndReplace } from 'mdast-util-find-and-replace'
import { slug } from 'github-slugger'

const WIKILINK = /\[\[([^\]]+?)\]\]/g

// Spiegelt link_classify.py: Anker-Wikilink -> interner Link, Notiz-Wikilink
// -> Text, externe Links bleiben (findAndReplace fasst Code-Spans nicht an).
export default function remarkWikilinks() {
  return (tree) => {
    findAndReplace(tree, [
      [WIKILINK, (_full, inner) => {
        const [target, display] = inner.split('|')
        if (target.startsWith('#')) {
          const heading = target.slice(1)
          const text = display ?? heading
          return { type: 'link', url: '#' + slug(heading), children: [{ type: 'text', value: text }] }
        }
        const note = display ?? target.split('#')[0]
        return { type: 'text', value: note }
      }],
    ])
  }
}
