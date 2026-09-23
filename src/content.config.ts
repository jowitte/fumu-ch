import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const perspektiven = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/perspektiven' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // `date` ist der Publikationstermin, auch in der Zukunft (geplantes
    // Publizieren, src/lib/published.ts). `updated` nur bei echter
    // Überarbeitung setzen; es ändert die Sortierung nicht.
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    // Doodle-Icon (fumu-icon-Stil) für die linke Label-Spalte der Artikelseite.
    icon: z.string().optional(),
    draft: z.boolean().default(false),
    authors: z.array(z.string()).default(['jochen-witte']),
    series: z.string().optional(),
    seriesPart: z.number().int().positive().optional(),
  }),
});

export const collections = { pages, perspektiven };
