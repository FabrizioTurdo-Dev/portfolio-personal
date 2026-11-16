export type Locale = 'es' | 'en';

export type ServiceId = 'web' | 'catalog' | 'system' | 'product';

export interface Shot {
  /** File name inside src/assets/casos/<slug>/ */
  file: string;
  alt: string;
  /** 'phone' renders in a narrow frame, 'desktop' in a wide one */
  kind: 'phone' | 'desktop';
}

export interface CaseStudy {
  slug: string;
  name: string;
  /** Short label for cards, e.g. "Restaurante" */
  kind: string;
  service: ServiceId;
  title: string;
  oneLiner: string;
  /** Paragraphs */
  problem: string[];
  built: string[];
  /** Paragraphs; empty array hides the block */
  result: string[];
  links: { label: string; url: string }[];
  stack: string;
  timeline: string;
  testimonial?: { quote: string; author: string };
  shots: Shot[];
  /** Cover image file name inside src/assets/casos/<slug>/ */
  cover?: string;
}

export interface SiteContent {
  locale: Locale;
  /** Path segment for case pages: "trabajos" or "work" */
  workPath: string;
  meta: { title: string; description: string; ogAlt: string };
  nav: { work: string; services: string; process: string; pricing: string; about: string; faq: string; contact: string; cta: string; langSwitch: string; skip: string; menu: string; close: string };
  hero: { eyebrow: string; title: string; titleAccent: string; sub: string; primary: string; secondary: string; proof: string[] };
  services: {
    title: string;
    intro: string;
    cards: { id: ServiceId; name: string; who: string; solves: string; includes: string; from: string; examples: string[] }[];
    whoLabel: string;
    solvesLabel: string;
    includesLabel: string;
    fromLabel: string;
    examplesLabel: string;
    /** Texto del plegado en celular */
    more: string;
    footnote: string;
  };
  work: { title: string; intro: string; readCase: string; all: string };
  process: {
    title: string;
    intro: string;
    steps: { title: string; text: string }[];
    abroad: { title: string; items: { label: string; text: string }[] };
  };
  product: { eyebrow: string; title: string; name: string; tagline: string; text: string[]; whyLabel: string; why: string; primary: string; primaryUrl: string; secondary: string };
  pricing: { title: string; intro: string; rows: { what: string; from: string }[]; notes: string[] };
  about: { title: string; paragraphs: string[]; photoAlt: string };
  testimonials: { title: string; items: { quote: string; author: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  contact: {
    title: string;
    intro: string;
    form: { name: string; email: string; message: string; messagePlaceholder: string; send: string; sending: string; sent: string; error: string };
    whatsapp: { label: string; message: string };
    calendar: { label: string; fallbackMessage: string };
    emailLabel: string;
  };
  footer: { line: string; rights: string };
  caseUi: { back: string; problem: string; built: string; shots: string; result: string; links: string; stack: string; timeline: string; testimonial: string; more: string; cta: string; ctaButton: string };
  cases: CaseStudy[];
}
