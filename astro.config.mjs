// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: replace with the real production domain before launch —
  // sitemap + canonical URLs are generated from this.
  site: 'https://pumpa.example.com',
  integrations: [sitemap()],
});
