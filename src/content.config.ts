import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /* hub filter category — additive; every article gets exactly one */
    category: z.enum(['economy', 'ev', 'prices', 'commuting']).default('economy'),
    /* optional inline visual rendered by GuidesArticlePage */
    chart: z.enum(['ev-cost']).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
