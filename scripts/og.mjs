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
const font = path.join(root, 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2');
const fontB64 = `data:font/woff2;base64,${(await readFile(font)).toString('base64')}`;
const fontI = path.join(root, 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2');
const fontIB64 = `data:font/woff2;base64,${(await readFile(fontI)).toString('base64')}`;
const fontM = path.join(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');
const fontMB64 = `data:font/woff2;base64,${(await readFile(fontM)).toString('base64')}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: N; src: url(${fontB64}) format('woff2'); font-weight: 200 800; }
@font-face { font-family: N; src: url(${fontIB64}) format('woff2'); font-weight: 200 800; font-style: italic; }
@font-face { font-family: M; src: url(${fontMB64}) format('woff2'); font-weight: 200 800; }
html,body{margin:0}
body{width:1200px;height:630px;background:#0e1522;font-family:N,Georgia,serif;color:#ecebe3;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(45% 55% at 12% 10%,rgba(232,179,90,.26),transparent 65%),radial-gradient(35% 45% at 95% 95%,rgba(111,211,193,.14),transparent 65%)}
.wrap{position:absolute;inset:0;display:grid;grid-template-columns:1fr 360px;gap:48px;padding:60px 72px 92px;align-items:center}
.eyebrow{font-family:M,sans-serif;font-size:19px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#e8b35a;display:flex;align-items:center;gap:14px}
.eyebrow::before{content:'';width:10px;height:10px;border-radius:50%;background:#e8b35a;box-shadow:0 0 16px 3px rgba(232,179,90,.5)}
h1{font-size:66px;line-height:1.04;letter-spacing:-.02em;font-weight:500;margin:22px 0 0}
h1 em{display:block;font-style:italic;font-weight:400;color:#f3cd8a;text-shadow:0 0 28px rgba(232,179,90,.45)}
.sub{font-family:M,sans-serif;font-size:23px;color:#c6cad4;margin-top:24px;max-width:600px;line-height:1.4}
.photo{width:360px;height:440px;border-radius:28px;overflow:hidden;box-shadow:0 0 0 1px rgba(232,179,90,.3),0 0 80px -20px rgba(232,179,90,.5),0 40px 70px -40px rgba(0,0,0,.9);background:#172238}
.photo img{width:100%;height:100%;object-fit:cover;filter:saturate(.9)}
.url{position:absolute;left:72px;bottom:40px;font-family:M,sans-serif;font-size:20px;font-weight:600;color:#8f98ab;letter-spacing:.02em}
</style></head><body><div class="bg"></div><div class="wrap">
<div><div class="eyebrow">Software &amp; Web Studio · Buenos Aires</div>
<h1>Software a medida para que tu negocio <em>venda más y trabaje menos.</em></h1>
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
await writeFile(path.join(root, 'public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#e8b35a"/><text x="32" y="43" text-anchor="middle" font-family="Georgia, serif" font-weight="600" font-size="30" fill="#1b1405" letter-spacing="-1">FT</text></svg>`);
console.log('og.png y apple-touch-icon.png listos');
