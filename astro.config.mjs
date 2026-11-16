// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fabrizioturdo.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-AR', en: 'en' } },
    }),
  ],
});
