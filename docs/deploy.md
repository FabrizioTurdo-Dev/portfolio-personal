# Cómo publicar y qué configurar

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/es
npm run build    # chequeo de tipos + build en dist/
```

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Textos en español / inglés, casos de estudio | `src/data/es.ts`, `src/data/en.ts` |
| WhatsApp, mail, link de agenda, formulario, Analytics | `src/data/config.ts` |
| Capturas de los casos | `src/assets/casos/<slug>/` (se regeneran con `scripts/capturas.mjs`) |
| Imagen para compartir e ícono | `scripts/og.mjs` → `public/og.png`, `public/og/<slug>.png`, `public/apple-touch-icon.png` |
| Colores y tipografía | `src/styles/global.css` |

Para correr los scripts hace falta Playwright. Está instalado en `restaurante-almadekh/almadekh-pwa`:

```bash
NODE_PATH=../../restaurante-almadekh/almadekh-pwa/node_modules node scripts/capturas.mjs
```

## Pendientes de configuración (una sola vez)

1. **Formulario de contacto (FormSubmit).** El primer envío real dispara un mail de activación a devfabri@gmail.com: hay que abrirlo y confirmar. Después, en formsubmit.co se puede pedir un alias para no exponer el mail en el HTML y reemplazar `formEndpoint` en `config.ts`.
2. **Agendar una llamada.** Google Calendar → Crear → *Agenda de citas* → 20 minutos → Compartir → copiar el link y pegarlo en `CONTACT.calendarUrl`. Hasta entonces el botón abre WhatsApp con un mensaje para coordinar.
3. **Google Analytics.** Crear una propiedad GA4 y pegar el ID (`G-XXXX`) en `GA_ID`. Vacío = no se carga nada.
4. **Testimonios.** Cuando lleguen, cargarlos en `testimonials.items` y en el `testimonial` de cada caso, en los dos idiomas.
5. **Links que faltan.** VioGua está en `https://vioguamvp.vercel.app` y Mantillo en `https://fabrizioturdo-dev.github.io/MatilloDelBosque/` (por ahora no se muestran en el sitio; agregarlos en `links` de cada caso cuando tengan dominio o se decida mostrarlos así).

## Vercel

- La rama `rediseno-2026` genera un *preview* automático al pushearla (el proyecto ya está conectado al repo).
- Producción: merge a `main` cuando Fabrizio lo apruebe. `vercel.json` redirige `/` a `/es` y pone cabeceras de seguridad y caché.
- Después de publicar: dar de alta `https://fabrizioturdo.com/sitemap-index.xml` en Google Search Console.
