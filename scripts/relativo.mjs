/**
 * Copia dist/ a una carpeta y la deja lista para servirse desde cualquier
 * subcarpeta o visor (por ejemplo, la copia privada de Claude):
 * - URLs absolutas (/es, /_astro/…) → relativas
 * - carpeta _astro → astro y archivos _slug_.* → * (los nombres con "_" están reservados)
 * - index.html pasa a ser la portada en español
 * Al final imprime la lista de archivos en JSON (files.json junto a la carpeta).
 *
 * Uso: node scripts/relativo.mjs <carpeta destino>
 */
import { cp, readdir, readFile, writeFile, rename, rm, stat } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('dist');
const out = path.resolve(process.argv[2] || 'dist-relativo');
await rm(out, { recursive: true, force: true });
await cp(src, out, { recursive: true, force: true });

// 1. Renombrar lo que empieza con "_"
await rename(path.join(out, '_astro'), path.join(out, 'astro'));
for (const f of await readdir(path.join(out, 'astro'))) {
  if (f.startsWith('_slug_.')) await rename(path.join(out, 'astro', f), path.join(out, 'astro', f.slice('_slug_.'.length)));
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const pages = new Set();
for await (const f of walk(out)) if (f.endsWith('.html')) pages.add(path.relative(out, f).split(path.sep).join('/'));

let count = 0;
for await (const f of walk(out)) {
  const rel = path.relative(out, f).split(path.sep).join('/');
  if (f.endsWith('.css')) {
    let css = await readFile(f, 'utf8');
    css = css.replace(/url\(\/_astro\//g, 'url(./');
    await writeFile(f, css);
    continue;
  }
  if (!f.endsWith('.html')) continue;
  const depth = rel.split('/').length - 1;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  let html = await readFile(f, 'utf8');
  html = html.replace(/_astro\/_slug_\./g, '_astro/').replace(/\/_astro\//g, '/astro/');
  html = html.replace(/(href|src|content|action)="(\/[^"]*)"/g, (m, attr, url) => {
    if (url.startsWith('//')) return m;
    const [pathPart, hash] = url.split('#');
    let target = pathPart;
    if (target === '/') target = '/es.html';
    else if (!/\.[a-z0-9]+$/i.test(target) && pages.has(target.slice(1) + '.html')) target = target + '.html';
    count++;
    return `${attr}="${prefix}${target.slice(1)}${hash ? '#' + hash : ''}"`;
  });
  html = html.replace(/srcset="([^"]*)"/g, (m, list) => {
    const fixed = list
      .split(',')
      .map((part) => part.trim().replace(/^\/(?!\/)/, prefix))
      .join(', ');
    return `srcset="${fixed}"`;
  });
  await writeFile(f, html);
}

// 2. La portada en español como página principal
await cp(path.join(out, 'es.html'), path.join(out, 'index.html'), { force: true });

// 3. Lista de archivos
const list = [];
for await (const f of walk(out)) list.push({ as: path.relative(out, f).split(path.sep).join('/'), path: f.split(path.sep).join('/') });
const total = list.reduce((a, x) => a + fs.statSync(x.path).size, 0);
await writeFile(path.join(out, '..', 'files.json'), JSON.stringify(list));
console.log(`listo: ${pages.size} páginas, ${count} enlaces, ${list.length} archivos (${Math.round(total / 1024)} kB) → ${out}`);
