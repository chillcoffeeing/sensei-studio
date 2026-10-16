// Bio de Instagram en /links (LINKS-PAGE). Copy de Figma 230:977 (archivo flzA0qnj6JdalFCgyB2PdI)
// salvo donde se indica. Lo que ya existe en el sitio se toma de su única fuente: servicios y
// destinos de cotización y WhatsApp de content/site.ts, ruta del caso de content/projects.ts.
import type { Links } from '@/app/links';
import arrowUpRight from '@/assets/links/arrow-up-right.svg';
import arrowUpRightMd from '@/assets/links/arrow-up-right-md.svg';
import arrowUpRightPaper from '@/assets/links/arrow-up-right-paper.svg';
import arrowUpRightSm from '@/assets/links/arrow-up-right-sm.svg';
import download from '@/assets/links/download.svg';
import atmosphere from '@/assets/images/cabecera-links/header-atmosphere.png';
import logo from '@/assets/links/sensei-studio-logo.svg';
import wordmark from '@/assets/links/sensei-wordmark.svg';
import { projectCard } from '@/content/projects';
import site from '@/content/site';

// PENDIENTE: la guía aún no existe (decisión del usuario 2026-10-09). Único destino: cuando el
// PDF esté listo, se sube a public/guias/ con este nombre o se cambia aquí.
const guideHref = '/guias/7-claves-web-que-convierte.pdf';

const { floatingBar, quote } = site;
// Caso destacado: nombre, claim, categoría e imagen salen del propio proyecto (sin duplicar datos).
const featured = projectCard('yupa');
// Mismo destino (PENDIENTE: número del estudio en content/site.ts), aviso y logo que la barra flotante.
const whatsapp = floatingBar.whatsapp;

const links: Links = {
  seo: {
    title: 'Links · Sensei Studio',
    description:
      'Cotiza tu proyecto, descarga la guía gratuita y conoce los proyectos y servicios de Sensei Studio: diseño, desarrollo, email marketing y automatización con IA.',
  },
  header: {
    logo: { src: logo, alt: 'Sensei Studio' },
    atmosphere: { src: atmosphere, alt: '' },
    title: ['De la idea al resultado', 'Medible, real.'],
    description: 'Diseño, desarrollo, email marketing y automatización con IA, con foco en lo que tu marca necesita.',
    // Mismo texto y destino sin JS que "Cotizar proyecto" de la barra flotante.
    quote: { label: floatingBar.quote.label, href: floatingBar.quote.href, icon: { src: arrowUpRight, alt: '' } },
    whatsapp: { label: whatsapp.label, href: whatsapp.href, newTab: whatsapp.newTab, icon: whatsapp.icon },
  },
  quote: {
    label: 'Tu proyecto empieza aquí',
    title: '¿Qué tienes en mente?',
    description: 'Elige uno o varios servicios para empezar.',
    // Los del modal (5): Figma dibuja 4 provisionales; una sola fuente manda.
    services: quote.services,
    cta: { label: 'Continuar cotización', href: floatingBar.quote.href, icon: { src: arrowUpRight, alt: '' } },
    note: 'Lo esencial primero. El alcance lo definimos juntos.',
  },
  guide: {
    label: 'Una idea para tu próxima web',
    cover: { kicker: 'SENSEI / GUÍAS', figure: '7', tagline: ['CLARIDAD. DISEÑO.', 'CONVERSIÓN.'] },
    kicker: 'Guía gratuita',
    title: '7 claves para una web que convierte',
    description: 'Mensaje, confianza y menos fricción. Un punto de partida.',
    download: { label: 'Descargar guía gratis', href: guideHref, icon: { src: download, alt: '' } },
  },
  explore: {
    label: 'Explora el studio',
    project: {
      href: featured.href,
      image: featured.image,
      title: featured.name,
      claim: featured.claim,
      category: featured.category,
      all: { label: 'Ver todos los proyectos', href: '/proyectos/', icon: { src: arrowUpRightSm, alt: '' } },
    },
    services: {
      label: 'Conoce nuestros servicios',
      href: '/#servicios',
      items: ['Branding', 'Email marketing', 'UX/UI', 'Desarrollo web', 'Automatización e IA'],
      icon: { src: arrowUpRightMd, alt: '' },
    },
  },
  closing: {
    title: '¿Lo conversamos?',
    whatsapp: { label: 'Escribir por WhatsApp', href: whatsapp.href, newTab: whatsapp.newTab, icon: { src: arrowUpRightPaper, alt: '' } },
    wordmark: { src: wordmark, alt: 'Sensei Studio' },
    navLabel: 'Enlaces del estudio',
    links: [
      { label: 'Studio', href: '/', marker: '↗' },
      // PENDIENTE: no hay página de privacidad todavía; se pinta como texto.
      { label: 'Privacidad' },
    ],
  },
};

export default links;
