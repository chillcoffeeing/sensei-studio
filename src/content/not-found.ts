// Página 404 estática (DEPLOY-STATIC): Apache la sirve con `ErrorDocument 404 /404.html`.
// Sin diseño en Figma: tono y CTA del header del sitio. noindex y fuera del sitemap.
import type { LocalImageRef, Seo } from '@/core/content';
import arrowRight from '@/assets/header/arrow-right.svg';

export interface NotFound {
  seo: Seo;
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string; icon: LocalImageRef };
}

const notFound: NotFound = {
  seo: {
    title: 'Página no encontrada · Sensei Studio',
    description: 'La página que buscas no existe o cambió de dirección. Vuelve al inicio de Sensei Studio.',
    noindex: true,
  },
  eyebrow: 'Error 404',
  title: 'Esta página no existe.',
  description: 'Puede que el enlace esté roto o que la página haya cambiado de dirección. Desde el inicio llegas a todo.',
  cta: { label: 'Volver al inicio', href: '/', icon: { src: arrowRight, alt: '' } },
};

export default notFound;
