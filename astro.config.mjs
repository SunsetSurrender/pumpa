// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: replace with the real production domain before launch —
  // sitemap + canonical URLs are generated from this.
  site: 'https://pumpa.example.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it', 'es'],
    routing: {
      // EN keeps the existing unprefixed URLs (already indexed); IT/ES live under /it, /es.
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', it: 'it', es: 'es' },
      },
    }),
  ],
});
