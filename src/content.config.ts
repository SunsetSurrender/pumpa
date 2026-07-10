import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tips' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /* hub filter category — additive; every article gets exactly one */
    category: z.enum(['economy', 'ev', 'prices', 'commuting']).default('economy'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { tips };
