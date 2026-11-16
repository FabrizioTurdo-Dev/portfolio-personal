import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/casos/**/*.{png,jpg,jpeg,webp}', { eager: true });

/** Returns the imported image for src/assets/casos/<slug>/<file>, or undefined if it does not exist yet. */
export function caseImage(slug: string, file: string | undefined): ImageMetadata | undefined {
  if (!file) return undefined;
  const key = `/src/assets/casos/${slug}/${file}`;
  return all[key]?.default;
}
