export interface Author {
  slug: string;
  name: string;
  linkedin: string;
}

export const authors: Record<string, Author> = {
  'jochen-witte': {
    slug: 'jochen-witte',
    name: 'Jochen Witte',
    linkedin: 'https://linkedin.com/in/jochenwitte',
  },
  'stefan-ropte': {
    slug: 'stefan-ropte',
    name: 'Stefan Ropte',
    linkedin: 'https://www.linkedin.com/in/stefan-ropte-08b7044a/',
  },
  'lukas-goeroeg': {
    slug: 'lukas-goeroeg',
    name: 'Lukas Görög',
    linkedin: 'https://www.linkedin.com/in/lukasgorog/',
  },
  'daniel-tschudi': {
    slug: 'daniel-tschudi',
    name: 'Daniel Tschudi',
    linkedin: 'https://www.linkedin.com/in/daniel-tschudi-a2954125/',
  },
};

export const getAuthor = (slug: string): Author | undefined => authors[slug];

export const getAuthorUrl = (slug: string) => `/about/#${slug}`;

export const resolveAuthors = (slugs: string[] | undefined): Author[] => {
  if (!slugs || slugs.length === 0) {
    const fallback = authors['jochen-witte'];
    return fallback ? [fallback] : [];
  }
  return slugs
    .map(s => authors[s])
    .filter((a): a is Author => Boolean(a));
};
