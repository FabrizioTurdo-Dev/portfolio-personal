import type { Locale, SiteContent, CaseStudy } from './types';
import { es } from './es';
import { en } from './en';

export const content: Record<Locale, SiteContent> = { es, en };
export const locales: Locale[] = ['es', 'en'];

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export function homePath(locale: Locale): string {
  return `/${locale}`;
}

export function casePath(locale: Locale, slug: string): string {
  return `/${locale}/${content[locale].workPath}/${slug}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export function findCase(locale: Locale, slug: string): CaseStudy | undefined {
  return content[locale].cases.find((c) => c.slug === slug);
}
