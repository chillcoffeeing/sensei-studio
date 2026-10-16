// Datos de la página interna /componentes (UI-LIB-001): catálogo visual de src/shared/ui.
// Los ejemplos salen del contenido real (home y chrome del sitio) para revisar cada componente
// con el copy y las imágenes que usará el sitio. Página noindex y fuera del sitemap.
import type { SectionOf, SectionType } from '@/app/sections';
import type { LocalImageRef, Seo } from '@/core/content';
import faqPlus from '@/assets/faq/plus.svg';
import { HOME_SLUG, pageBySlug } from './pages';
import site from './site';

const home = pageBySlug(HOME_SLUG);

function section<T extends SectionType>(type: T): SectionOf<T> {
  const found = home.sections.find((s): s is SectionOf<T> => s.sectionType === type);
  if (!found) throw new Error(`ui-catalog: la home no tiene una sección "${type}"`);
  return found;
}

const stats = section('stats');
const projects = section('project-gallery');
const projectSample = projects.content.cards?.[0];
if (!projectSample) throw new Error('ui-catalog: la galería de proyectos no tiene tarjetas');
const testimonials = section('testimonials');
const faq = section('faq');
const contact = section('contact');
const showcase = section('showcase');
const services = section('services');
const team = section('team');
const process = section('process');
// Muestras de TeamCard: un integrante con foto y, si lo hay, uno sin foto (silueta neutra).
const teamWithPhoto = team.content.members.find((m) => m.photo);
if (!teamWithPhoto?.photo) throw new Error('ui-catalog: el equipo no tiene ningún integrante con foto');
const teamWithoutPhoto = team.content.members.find((m) => !m.photo);
const teamPhoto = teamWithPhoto.photo;
const { header, footer } = site;

/** Ficha de un componente en el catálogo: cuándo usarlo, en una línea. */
export interface CatalogEntry {
  name: string;
  usage: string;
}

export interface CatalogGroup {
  title: string;
  entries: CatalogEntry[];
}

const uiCatalog = {
  seo: {
    title: 'Librería de componentes · Sensei Studio',
    description: 'Catálogo interno de los componentes de interfaz de Sensei Studio para revisión visual.',
    noindex: true,
  } satisfies Seo,
  h1: 'Librería de componentes',
  intro:
    'Catálogo interno de src/shared/ui. Cada componente se pinta con datos reales del sitio. Documentación: docs/components.md.',
  groups: {
    text: {
      title: 'Texto y cabeceras',
      entries: [
        { name: 'ToneText', usage: 'Texto en dos tonos (h2, descripciones): el tono lo da la superficie.' },
        { name: 'Eyebrow', usage: 'Punto lima + texto en mayúsculas sobre un h2 de sección.' },
        { name: 'LabelMarker', usage: 'Rótulo con marcador lima cuadrado de 6px + 12px en mayúsculas (detalle de proyecto, modal de cotización, /links).' },
        { name: 'SectionHeader', usage: 'Cabecera común: eyebrow + h2 en dos tonos + slot aside (descripción o enlace).' },
        { name: 'SectionDescription', usage: 'Descripción de sección con la primera frase destacada.' },
        { name: 'HeadingOverline', usage: 'Título de columna del footer (h2 pequeño en mayúsculas).' },
      ],
    },
    actions: {
      title: 'Acciones y enlaces',
      entries: [
        { name: 'LinkMore', usage: 'Enlace de texto con signo final, en la cabecera de una sección clara.' },
        { name: 'LinkLogo', usage: 'Logo enlazado a la home sobre ink (header y menú mobile, área táctil de 44).' },
        { name: 'LinkNav', usage: 'Enlace del nav principal sobre ink.' },
        { name: 'LinkMenu', usage: 'Enlace grande del menú mobile sobre ink (área táctil de 44).' },
        { name: 'LinkFooter', usage: 'Enlace de columna del footer; sin destino, texto con el mismo aspecto.' },
        { name: 'LegalLinks', usage: 'Enlaces secundarios separados por una línea vertical.' },
        { name: 'LinkIconInk', usage: 'Enlace externo de icono: círculo ink de 44 con el logo en paper (WhatsApp de la barra flotante, perfiles del equipo).' },
        { name: 'LinkCtaBrand', usage: 'CTA principal: píldora brand + círculo con flecha; en hover/foco se funden (hover líquido).' },
        { name: 'CtaBrandShape', usage: 'Interior compartido de LinkCtaBrand y ButtonCtaBrand (fondo con filtro gooey + texto y flecha nítidos). No se usa suelto: aquí, en reposo.' },
        { name: 'ButtonCtaBrand', usage: 'LinkCtaBrand como botón sobre superficie clara (envío del modal de cotización), mismo hover líquido.' },
        { name: 'ButtonBrand', usage: 'Botón píldora brand sin flecha (abrir/cerrar menú).' },
        { name: 'ButtonInk', usage: 'Botón píldora ink a todo el ancho (enviar formulario sobre glass).' },
        { name: 'LinkButtonPaper', usage: 'Enlace con forma de botón paper a todo el ancho, sobre glass oscuro (detalle de ProjectCard).' },
        { name: 'ButtonPauseGlass', usage: 'Pausa/reanuda lo que se mueve solo (WCAG 2.2.2), sobre fondo oscuro.' },
      ],
    },
    forms: {
      title: 'Formularios',
      entries: [
        { name: 'LabelHidden', usage: 'Etiqueta solo para lectores de pantalla (el placeholder no la sustituye).' },
        { name: 'InputGlass', usage: 'Campo de texto sobre glass; error con aria-invalid.' },
        { name: 'TextareaGlass', usage: 'Área de texto sobre glass (mismo aspecto que InputGlass); error con aria-invalid.' },
        { name: 'FieldError', usage: 'Mensaje de error bajo un campo (aria-describedby).' },
        { name: 'FormStatus', usage: 'Estado del envío (enviando, enviado).' },
        { name: 'FormStatusError', usage: 'Error del envío.' },
      ],
    },
    cards: {
      title: 'Cards y piezas de sección',
      entries: [
        { name: 'AvatarInitials', usage: 'Avatar de iniciales en uno de los 4 tonos.' },
        { name: 'ReviewCard', usage: 'Card de reseña: avatar, nombre, rol y cita.' },
        { name: 'TrustBadge', usage: 'Prueba social: pila de avatares con contador, estrellas y texto en dos tonos.' },
        { name: 'ProjectCard', usage: 'Card de proyecto: pill en reposo; detalle glass abajo (título, métricas del caso, botón) en hover/foco. Sin hover (táctil): solo imagen + botón.' },
        { name: 'TeamCard', usage: 'Card de integrante: foto (o silueta neutra si aún no la hay) + nombre y rol; detalle (rol, empresa, bio) en hover/foco. Sin hover (táctil): solo el reposo.' },
        { name: 'UserPlaceholder', usage: 'Persona sin foto: silueta neutra que llena la caja de quien la coloca (avatar, card del equipo).' },
        { name: 'Photo', usage: 'Foto de un slot: local (Picture de astro:assets, recorte con su encuadre `position`) o URL simple, con width/height fijos.' },
        { name: 'AccordionCards', usage: 'Acordeón de cards de pregunta y respuesta (isla).' },
      ],
    },
    sliders: {
      title: 'Sliders (un componente por slider)',
      entries: [
        { name: 'ShowcaseCarousel', usage: 'Carrusel de imágenes del showcase: autoplay continuo, pausa con foco de teclado, swipe, pestaña oculta o reduced-motion.' },
        { name: 'TeamSlider', usage: 'Slider de cards del equipo: autoplay por pasos, pausa con foco de teclado, swipe (con snap), pestaña oculta o reduced-motion.' },
        { name: 'StepperSlider', usage: 'Pasos numerados: por debajo de md, un paso por vista con indicador de segmentos y autoplay; desde md, la rejilla del módulo sin cambios.' },
      ],
    },
  } satisfies Record<string, CatalogGroup>,
  samples: {
    eyebrow: stats.headingContent.eyebrow,
    title: stats.headingContent.title,
    description: stats.headingContent.description,
    overline: footer.columns[0]!.title,
    labelMarker: site.quote.header.eyebrow,
    linkMore: {
      href: projects.content.cta.href,
      label: projects.content.cta.label,
      // Figma 29:236: el signo va separado del texto por 4 espacios.
      marker: `    ${projects.content.cta.marker}`,
    },
    logo: header.logo,
    nav: header.nav,
    footerLinks: [footer.columns[0]!.links[0]!, footer.columns[2]!.links[0]!],
    legal: footer.studio.legal,
    cta: header.cta,
    quoteSubmit: site.quote.footer.submit,
    menuOpen: header.menu.open,
    submitLabel: contact.content.submitLabel,
    iconLink: site.floatingBar.whatsapp,
    pause: {
      label: footer.gallery.pauseLabel,
      pauseIcon: footer.gallery.pauseIcon,
      playIcon: footer.gallery.playIcon,
    },
    field: {
      label: contact.content.fields.email.label,
      error: contact.content.validation.emailInvalid,
    },
    message: {
      label: contact.content.fields.message.label,
      error: contact.content.validation.required.message,
    },
    status: { sent: contact.content.status.sent, error: contact.content.status.error },
    reviews: testimonials.content.reviews.slice(0, 2),
    trust: testimonials.content.trust,
    project: projectSample,
    projectLink: projectSample.details.link,
    showcase: {
      labels: showcase.content.carousel,
      slides: showcase.content.slides.map((slide) => slide.image),
    },
    team: {
      labels: team.content.slider,
      // Muestras de TeamCard (con y sin foto) y del slider con las cards reales.
      members: team.content.members,
      cards: teamWithoutPhoto ? [teamWithPhoto, teamWithoutPhoto] : [teamWithPhoto],
    },
    stepper: {
      labels: process.content.stepper,
      steps: process.content.steps,
    },
    // El retrato real del equipo y una imagen de servicios recortada a su hueco.
    photos: [teamPhoto, services.content.services[0]!.images[1]!],
    faq: {
      lang: faq.content.lang,
      items: faq.content.items.map((item) => ({ title: item.question, body: item.answer })),
      icon: { src: faqPlus, alt: '' } satisfies LocalImageRef,
    },
  },
};

export default uiCatalog;
