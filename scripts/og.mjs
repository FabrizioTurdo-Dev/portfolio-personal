/**
 * Genera public/og.png (1200×630) y public/apple-touch-icon.png.
 * Uso: NODE_PATH=<node_modules con playwright> node scripts/og.mjs
 */
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = (await import('sharp')).default;

const root = path.resolve('.');
const photo = await readFile(path.join(root, 'src/assets/fabrizio.png'));
const photoB64 = `data:image/png;base64,${photo.toString('base64')}`;
const font = path.join(root, 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2');
const fontB64 = `data:font/woff2;base64,${(await readFile(font)).toString('base64')}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: B; src: url(${fontB64}) format('woff2'); font-weight: 200 800; }
html,body{margin:0}
body{width:1200px;height:630px;background:#f7f3ea;font-family:B,sans-serif;color:#17150f;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(60% 60% at 90% 10%,rgba(199,70,28,.14),transparent 70%)}
.wrap{position:absolute;inset:0;display:grid;grid-template-columns:1fr 380px;gap:40px;padding:56px 72px 90px;align-items:center}
.eyebrow{font-size:22px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#9f3512;display:flex;align-items:center;gap:14px}
.eyebrow::before{content:'';width:34px;height:3px;background:#c7461c}
h1{font-size:64px;line-height:1.02;letter-spacing:-.035em;font-weight:800;margin:22px 0 0}
h1 span{color:#c7461c;display:block}
.sub{font-size:24px;color:#45412f;margin-top:22px;max-width:620px;line-height:1.35;font-family:system-ui,sans-serif}
.photo{width:380px;height:460px;border-radius:36px;overflow:hidden;transform:rotate(-2deg);box-shadow:0 30px 60px -30px rgba(23,21,15,.5);border:1px solid #d9d1bf;background:#efe9dc}
.photo img{width:100%;height:100%;object-fit:cover}
.url{position:absolute;left:72px;bottom:36px;font-size:22px;font-weight:600;color:#76705e;letter-spacing:.02em}
</style></head><body><div class="bg"></div><div class="wrap">
<div><div class="eyebrow">Software &amp; Web Studio · Buenos Aires</div>
<h1>Software a medida para que tu negocio <span>venda más y trabaje menos.</span></h1>
<div class="sub">Webs, catálogos con pedidos, turnos y sistemas a medida. Por etapas, con trato directo.</div></div>
<div class="photo"><img src="${photoB64}"></div></div>
<div class="url">fabrizioturdo.com</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(root, 'public/og.png'), type: 'png' });
await browser.close();

// Ícono para iPhone a partir del favicon
const svg = await readFile(path.join(root, 'public/favicon.svg'));
await writeFile(path.join(root, 'public/apple-touch-icon.png'), await sharp(svg, { density: 300 }).resize(180, 180).png().toBuffer());
console.log('og.png y apple-touch-icon.png listos');
