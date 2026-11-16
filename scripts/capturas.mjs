/**
 * Saca capturas de los proyectos publicados (solo páginas públicas o prototipos
 * con datos de ejemplo) y las guarda en src/assets/casos/<slug>/.
 *
 * Uso: NODE_PATH=<ruta a node_modules con playwright> node scripts/capturas.mjs [slug]
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const OUT = path.resolve('src/assets/casos');
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/** @type {{slug:string,file:string,url:string,kind:'desktop'|'phone',wait?:number,fullPage?:boolean,click?:string,scroll?:number}[]} */
const SHOTS = [
  // Chitopo / Master Snacks
  { slug: 'chitopo', file: 'home-desktop.png', url: 'https://mastersnackchile.com/', kind: 'desktop', wait: 4000, clip: { x: 0, y: 0, width: 1440, height: 820 } },
  { slug: 'chitopo', file: 'chitopo-phone.png', url: 'https://mastersnackchile.com/chitopo/', kind: 'phone', wait: 4000, clip: { x: 0, y: 0, width: 390, height: 760 } },
  { slug: 'chitopo', file: 'catalogo-phone.png', url: 'https://mastersnackchile.com/catalogo/', kind: 'phone', wait: 5000, clip: { x: 0, y: 0, width: 390, height: 760 } },
  { slug: 'chitopo', file: 'catalogo-desktop.png', url: 'https://mastersnackchile.com/catalogo/', kind: 'desktop', wait: 5000, clip: { x: 0, y: 0, width: 1440, height: 820 } },
  // Alma Dekh
  { slug: 'alma-dekh', session: { almadekh_splash_seen: '1' }, file: 'home-desktop.png', url: 'https://almadekh.com.ar/', kind: 'desktop', wait: 9000, motion: true },
  { slug: 'alma-dekh', session: { almadekh_splash_seen: '1' }, file: 'menu-phone.png', url: 'https://almadekh.com.ar/menu', kind: 'phone', wait: 9000, motion: true },
  { slug: 'alma-dekh', session: { almadekh_splash_seen: '1' }, file: 'home-phone.png', url: 'https://almadekh.com.ar/', kind: 'phone', wait: 9000, motion: true },
  // De la Casa (sitio público + prototipo con datos de ejemplo)
  { slug: 'de-la-casa', file: 'home-desktop.png', url: 'https://delacasa.com.ar/', kind: 'desktop', wait: 5000 },
  { slug: 'de-la-casa', file: 'home-phone.png', url: 'https://delacasa.com.ar/', kind: 'phone', wait: 5000 },
  { slug: 'de-la-casa', file: 'tarjeta-phone.png', url: 'https://fabrizioturdo-dev.github.io/tarjetasFidelizacion/prototipo/tarjeta.html', kind: 'phone', wait: 2500, css: '.proto, .view { display:none !important }' },
  { slug: 'de-la-casa', file: 'panel-desktop.png', url: 'https://fabrizioturdo-dev.github.io/tarjetasFidelizacion/prototipo/panel.html', kind: 'desktop', wait: 2500, css: '.proto, .view { display:none !important }' },
  // Mantillo del Bosque
  { slug: 'mantillo-del-bosque', file: 'home-desktop.png', url: 'https://fabrizioturdo-dev.github.io/MatilloDelBosque/', kind: 'desktop', wait: 5000 },
  { slug: 'mantillo-del-bosque', file: 'tierras-phone.png', url: 'https://fabrizioturdo-dev.github.io/MatilloDelBosque/tierras.html', kind: 'phone', wait: 4000 },
  { slug: 'mantillo-del-bosque', file: 'presupuesto-phone.png', url: 'https://fabrizioturdo-dev.github.io/MatilloDelBosque/presupuesto.html', kind: 'phone', wait: 4000 },
  // VioGua
  { slug: 'viogua', file: 'home-desktop.png', url: 'https://vioguamvp.vercel.app/', kind: 'desktop', wait: 4000 },
  { slug: 'viogua', file: 'test-phone.png', url: 'https://vioguamvp.vercel.app/test/', kind: 'phone', wait: 4000 },
  { slug: 'viogua', file: 'home-phone.png', url: 'https://vioguamvp.vercel.app/', kind: 'phone', wait: 4000 },
  // Vexa
  { slug: 'vexa', file: 'home-desktop.png', url: 'https://www.productosvexa.com.ar/', kind: 'desktop', wait: 5000 },
  { slug: 'vexa', file: 'catalogo-phone.png', url: 'https://www.productosvexa.com.ar/catalogo', kind: 'phone', wait: 5000 },
  { slug: 'vexa', file: 'home-phone.png', url: 'https://www.productosvexa.com.ar/', kind: 'phone', wait: 5000 },
  // Elizabeth Orlando
  { slug: 'elizabeth-orlando', file: 'home-desktop.png', url: 'https://elizabethorlando.com/', kind: 'desktop', wait: 4000 },
  { slug: 'elizabeth-orlando', file: 'home-phone.png', url: 'https://elizabethorlando.com/', kind: 'phone', wait: 4000 },
  { slug: 'elizabeth-orlando', file: 'servicios-phone.png', url: 'https://elizabethorlando.com/', kind: 'phone', wait: 4000, scrollTo: '#servicios' },
  // Taller Estilo
  { slug: 'taller-estilo', file: 'home-desktop.png', url: 'https://tallerestilognc.netlify.app/', kind: 'desktop', wait: 4000 },
  { slug: 'taller-estilo', file: 'home-phone.png', url: 'https://tallerestilognc.netlify.app/', kind: 'phone', wait: 4000 },
  { slug: 'taller-estilo', file: 'servicios-phone.png', url: 'https://tallerestilognc.netlify.app/', kind: 'phone', wait: 4000, scrollTo: '#servicios' },
];

const only = process.argv[2];
const browser = await chromium.launch();
let ok = 0;
let failed = 0;
for (const s of SHOTS) {
  if (only && s.slug !== only) continue;
  const ctx = await browser.newContext({ ...(s.kind === 'phone' ? PHONE : DESKTOP), locale: 'es-AR', reducedMotion: s.motion ? 'no-preference' : 'reduce', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    if (s.session) await page.addInitScript((kv) => { for (const [k, v] of Object.entries(kv)) sessionStorage.setItem(k, v); }, s.session);
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => page.waitForTimeout(3000));
    await page.waitForTimeout(s.wait ?? 3000);
    // Forzar que aparezcan elementos con animación de entrada
    await page.addStyleTag({ content: `[class*="netlify"], [id*="netlify"], a[href*="netlify.com"] { display: none !important } ${s.css ?? ''}` });
    await page.evaluate((sel) => {
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
      if (sel) document.querySelector(sel)?.scrollIntoView({ block: 'start' });
      // Sacar insignias de hosting que no son parte del diseño
      for (const el of document.querySelectorAll('a, div')) {
        if (/powered by netlify/i.test(el.textContent || '') && el.children.length < 4 && el.getBoundingClientRect().width < 260) el.remove();
      }
    }, s.scrollTo ?? null);
    await page.waitForTimeout(800);
    const dir = path.join(OUT, s.slug);
    await mkdir(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, s.file), fullPage: s.fullPage ?? false, clip: s.clip });
    console.log('ok ', s.slug, s.file);
    ok++;
  } catch (err) {
    console.log('ERR', s.slug, s.file, err.message.split('\n')[0]);
    failed++;
  } finally {
    await ctx.close();
  }
}
await browser.close();
console.log(`\n${ok} capturas, ${failed} fallaron`);
