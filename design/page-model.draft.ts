// Borrador del modelo Page, deducido del Figma "Agencia" (ver design/INVENTORY.md).
// Cuando el arnés esté listo se mueve a src/core/page.ts y cada `content`
// a modules/<type>/schema.ts.

/** Texto con partes en distinto tono: "Resultados comprobados, [con foco en diseño.]" */
export type ToneText = Array<string | { text: string; tone: 'muted' | 'strong' }>;

export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Link {
  label: string;
  href: string;
}

interface SectionBase<T extends string, C> {
  id: string;
  type: T;
  headingEyebrow?: string;
  h2?: ToneText;
  headingDescriptions?: ToneText[];
  content: C;
}

export type HeroSection = SectionBase<'hero', {
  services: string[];
  lead: ToneText;
}>;

export type LogoMarqueeSection = SectionBase<'logo-marquee', {
  logos: ImageRef[];
}>;

export type ProjectGallerySection = SectionBase<'project-gallery', {
  cta?: Link;
  projects: Array<{ title: string; category: string; image: ImageRef; href?: string }>;
}>;

export type StatsSection = SectionBase<'stats', {
  items: Array<{ value: string; label: string }>;
}>;

export type ProcessSection = SectionBase<'process', {
  badge: string[];               // palabras del badge circular giratorio
  steps: Array<{ title: string; description: string }>; // pendiente de diseño
}>;

export type ServicesSection = SectionBase<'services', {
  items: Array<{ title: string; description?: string }>;
}>;

export type ShowcaseSection = SectionBase<'showcase', {
  title: string;
  slides: ImageRef[];
}>;

export type TestimonialsSection = SectionBase<'testimonials', {
  cta?: Link;
  proof: { avatars: ImageRef[]; count: string; rating: number; caption: string };
  reviews: Array<{ name: string; role: string; quote: string; initials: string; tone: 1 | 2 | 3 | 4 }>;
}>;

export type TeamSection = SectionBase<'team', {
  members: Array<{ name?: string; role?: string; photo?: ImageRef }>;
}>;

export type FaqSection = SectionBase<'faq', {
  items: Array<{ question: string; answer: string }>;
}>;

export type ContactSection = SectionBase<'contact', {
  background: ImageRef;
  fields: Array<{ name: string; label: string; type: 'text' | 'email'; half?: boolean }>;
  submitLabel: string;
  legal: { text: string; links: Link[] };
}>;

export type Section =
  | HeroSection
  | LogoMarqueeSection
  | ProjectGallerySection
  | StatsSection
  | ProcessSection
  | ServicesSection
  | ShowcaseSection
  | TestimonialsSection
  | TeamSection
  | FaqSection
  | ContactSection;

export type SectionType = Section['type'];

export interface Seo {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  og?: { image: string; type?: 'website' | 'article' };
  noindex?: boolean;
}

export interface Page {
  slug: string;
  content: {
    h1: string;
    h2?: string;
    sections: Section[];
  };
  seo: Seo;
}

// Header y footer no son secciones: son chrome del layout, compartidos por
// todas las páginas. Viven en src/content/site.ts.
export interface SiteChrome {
  nav: Link[];
  cta: Link;
  footer: {
    columns: Array<{ title: string; links: Link[] }>;
    tagline: string;
    gallery: ImageRef[];
  };
}
