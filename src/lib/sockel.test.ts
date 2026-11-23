import { describe, expect, it } from 'vitest';
import { sockelPerspektiven, type BlattPost } from './sockel';

const post = (id: string, day: number, series?: string): BlattPost => ({
  id,
  title: `Titel ${id}`,
  description: `Text ${id}`,
  date: new Date(Date.UTC(2026, 10, day)),
  series,
});

const ids = (posts: BlattPost[]) => posts.map(p => p.id);

describe('sockelPerspektiven', () => {
  it('nimmt die drei neuesten desselben Themas, ohne den Artikel selbst', () => {
    const current = post('a', 20, 'arbeit');
    const posts = [
      current,
      post('b', 1, 'arbeit'),
      post('c', 5, 'arbeit'),
      post('d', 9, 'arbeit'),
      post('e', 3, 'arbeit'),
      post('x', 19, 'medien'),
    ];
    expect(ids(sockelPerspektiven(posts, current))).toEqual(['d', 'c', 'e']);
  });

  it('nimmt bei genau einem weiteren Artikel im Thema genau diesen', () => {
    const current = post('a', 20, 'arbeit');
    const posts = [current, post('b', 1, 'arbeit'), post('x', 19, 'medien'), post('y', 18)];
    expect(ids(sockelPerspektiven(posts, current))).toEqual(['b']);
  });

  it('fällt bei einem Thema ohne weitere Artikel auf die neuesten aller Perspektiven zurück', () => {
    const current = post('a', 20, 'arbeit');
    const posts = [current, post('x', 19, 'medien'), post('y', 18), post('z', 2, 'medien'), post('w', 10)];
    expect(ids(sockelPerspektiven(posts, current))).toEqual(['x', 'y', 'w']);
  });

  it('nimmt für einen Artikel ohne Thema die neuesten aller Perspektiven', () => {
    const current = post('a', 15);
    const posts = [post('x', 19, 'medien'), current, post('y', 18), post('z', 2, 'medien'), post('w', 10)];
    expect(ids(sockelPerspektiven(posts, current))).toEqual(['x', 'y', 'w']);
  });

  it('liefert bei weniger als drei Perspektiven alle ausser dem Artikel', () => {
    const current = post('a', 15);
    expect(ids(sockelPerspektiven([current, post('b', 3)], current))).toEqual(['b']);
    expect(sockelPerspektiven([current], current)).toEqual([]);
  });

  it('nimmt eine andere Anzahl an', () => {
    const current = post('a', 20);
    const posts = [current, post('b', 1), post('c', 5), post('d', 9)];
    expect(ids(sockelPerspektiven(posts, current, 2))).toEqual(['d', 'c']);
  });
});
