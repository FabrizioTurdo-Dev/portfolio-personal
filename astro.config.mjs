// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://fabrizioturdo.com';

/**
 * Para cada URL del sitemap, devuelve su versión en el otro idioma.
 * /es ↔ /en y /es/trabajos/<slug> ↔ /en/work/<slug>.
 */
/** @param {string} url */
function alternates(url) {
  const path = url.replace(SITE, '');
  let es = null;
  let en = null;
  if (path === '/es' || path === '/en') {
    es = '/es';
    en = '/en';
  } else {
    const m = path.match(/^\/(es\/trabajos|en\/work)\/([^/]+)$/);
    if (m) {
      es = `/es/trabajos/${m[2]}`;
      en = `/en/work/${m[2]}`;
    }
  }
  if (!es || !en) return undefined;
  return [
    { lang: 'es', url: `${SITE}${es}` },
    { lang: 'en', url: `${SITE}${en}` },
    { lang: 'x-default', url: `${SITE}${es}` },
  ];
}

export default defineConfig({
  site: SITE,
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
      // La raíz redirige a /es y la 404 no se indexa: fuera del sitemap.
      filter: (page) => {
        const p = page.replace(SITE, '').replace(/\/$/, '');
        return p !== '' && p !== '/404';
      },
      serialize(item) {
        const url = item.url.replace(/\/$/, '');
        return { ...item, url, links: alternates(url), lastmod: new Date().toISOString() };
      },
    }),
  ],
});
