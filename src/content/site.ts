import type { SiteChrome } from '@/core/site';
import wheelPause from '@/assets/footer/wheel-pause.svg';
import wheelPlay from '@/assets/footer/wheel-play.svg';
import arrowRight from '@/assets/header/arrow-right.svg';
import logo from '@/assets/header/logo.svg';
import logoSquare from '@/assets/brand/logo-square.png';
import adviceArrow from '@/assets/advice/arrow-up-right.svg';
import adviceArrowSm from '@/assets/advice/arrow-up-right-sm.svg';
import adviceEmail from '@/assets/advice/channel-email.svg';
import adviceWhatsapp from '@/assets/advice/channel-whatsapp.svg';
import adviceClose from '@/assets/advice/close.svg';
import adviceRadioChecked from '@/assets/advice/radio-checked.svg';
import adviceStageProject from '@/assets/advice/stage-project.svg';
import adviceStageScratch from '@/assets/advice/stage-scratch.svg';
import whatsappIcon from '@/assets/floating-bar/whatsapp.svg';
import quoteArrowLg from '@/assets/quote/arrow-up-right-lg.svg';
import quoteArrowSm from '@/assets/quote/arrow-up-right-sm.svg';
import quoteCheckBrand from '@/assets/quote/check-brand.svg';
import quoteCheckGoal from '@/assets/quote/check-goal.svg';
import quoteCheckInk from '@/assets/quote/check-ink.svg';
import quoteChevronDown from '@/assets/quote/chevron-down.svg';
import quoteClose from '@/assets/quote/close.svg';
import quotePaperclip from '@/assets/quote/paperclip.svg';
import quotePlus from '@/assets/quote/plus.svg';
import quoteServiceAds from '@/assets/quote/service-ads.svg';
import quoteServiceBranding from '@/assets/quote/service-branding.svg';
import quoteServiceDev from '@/assets/quote/service-dev.svg';
import quoteServiceEmail from '@/assets/quote/service-email.svg';
import quoteServiceUx from '@/assets/quote/service-ux.svg';
import quoteUpload from '@/assets/quote/upload.svg';
import quoteWhatsapp from '@/assets/quote/whatsapp-message.svg';

// PENDIENTE: número del estudio. Formato wa.me con prefijo internacional y sin "+":
// 'https://wa.me/34600000000'. Único sitio donde vive: lo usan la barra flotante y el modal.
const whatsappHref = 'https://wa.me/';
const newTabNotice = '(se abre en una pestaña nueva)';
// Destino sin JS de los disparadores de cotización y asesoría: el formulario de contacto de la landing.
const quoteFallbackHref = '/#contacto';
// Correo del estudio: único sitio donde vive (modal de asesoría y avisos de envío no disponible).
const studioEmail = 'hola@bysensei.com';
const adviceMailHref = `mailto:${studioEmail}?subject=${encodeURIComponent('Asesoría con Sensei Studio')}`;

// Redes del estudio: textos de Figma 174:45-174:47 (archivo flzA0qnj6JdalFCgyB2PdI). Única fuente
// de la columna "Redes sociales" del footer y de `meta.sameAs` (JSON-LD).
// PENDIENTE: URLs de los perfiles del estudio. 174:27 no lleva hiperenlaces y el archivo no tiene
// las del estudio (las de Behance/LinkedIn de 334:7408-341:7432 son del equipo). Sin `url`, el
// footer pinta el nombre como texto y sameAs lo omite.
const studioSocials: { label: string; url?: string }[] = [
  { label: 'Instagram' },
  { label: 'LinkedIn' },
  { label: 'Behance' },
];

// Copy del header: Figma 16:48 (11:28-11:30 nav, 11:31 CTA).
// Copy del footer: Figma 174:27 (columnas 174:28-174:58; archivo flzA0qnj6JdalFCgyB2PdI) y galería 174:72 (174:67-174:70).
const site: SiteChrome = {
  // Fuente del <head> y del JSON-LD de todas las páginas (docs/seo.md).
  meta: {
    name: 'Sensei Studio',
    locale: 'es_ES',
    language: 'es',
    titleTemplate: '{title} · Sensei Studio',
    email: studioEmail,
    // Organization.logo: PNG cuadrado de 512 px sobre fondo sólido (icono 224:316); el SVG del header es claro sobre transparente.
    logo: logoSquare,
    // <meta name="theme-color"> (= --color-ink; mismo valor que public/site.webmanifest).
    themeColor: '#090909', // ds-allow: el meta y el manifest necesitan el color literal
    sameAs: studioSocials.flatMap((social) => (social.url ? [social.url] : [])),
    // De la FAQ de la home: remoto con México, Chile y el resto de Latinoamérica, y con países de habla inglesa.
    areaServed: ['Latinoamérica', 'Países de habla inglesa'],
    // public/og-image.jpg: pieza para compartir de Figma 41:464 (flzA0qnj6JdalFCgyB2PdI) a 1200×630.
    shareImage: {
      path: '/og-image.jpg',
      alt: 'Logotipo de Sensei Studio sobre fondo negro: agencia para marcas que convierten',
      width: 1200,
      height: 630,
    },
  },
  header: {
    logo: { src: logo, alt: 'Sensei Studio', href: '/' },
    navLabel: 'Principal',
    nav: [
      // No hay sección "studio" en la home (QA-001): "Studio" lleva a quiénes somos, el equipo.
      { label: 'Studio', href: '/#equipo' },
      { label: 'Proyectos', href: '/#proyectos' },
      // QTE-MODAL: con JS abre el modal de cotización; sin JS lleva al formulario.
      { label: 'Cotización', href: quoteFallbackHref, opensQuote: true },
    ],
    // ADV-MODAL: con JS abre el modal de asesoría; sin JS lleva al formulario.
    cta: { label: 'Agenda una reunión', href: quoteFallbackHref, icon: { src: arrowRight, alt: '' }, opensAdvice: true },
    menu: { open: 'Menú', close: 'Cerrar' },
  },
  // Figma 218:21 (archivo flzA0qnj6JdalFCgyB2PdI): 272:7925, 218:23 y 218:24. `shortLabel` (no está
  // en Figma): texto visible por debajo de sm, donde las tres acciones no caben con el texto completo.
  floatingBar: {
    label: 'Contacto rápido',
    // Sin JS lleva al formulario de la landing; QTE-MODAL lo intercepta por `data-quote-open`.
    quote: { label: 'Cotizar proyecto', shortLabel: 'Cotizar', href: quoteFallbackHref },
    // Sin JS lleva al formulario de la landing; ADV-MODAL lo intercepta por `data-advice-open`.
    advice: { label: 'Solicitar asesoría', shortLabel: 'Asesoría', href: quoteFallbackHref },
    whatsapp: {
      label: 'WhatsApp',
      href: whatsappHref,
      newTab: newTabNotice,
      // Logo de WhatsApp de Simple Icons (CC0): sustituye al "circle-x" provisional de Figma 218:28.
      icon: { src: whatsappIcon, alt: '' },
    },
  },
  // Figma 220:867 (archivo flzA0qnj6JdalFCgyB2PdI). Copy de Figma salvo donde se indica.
  quote: {
    requiredLabel: 'obligatorio',
    header: {
      eyebrow: 'Sensei Studio / Cotización',
      title: 'Tu próximo proyecto empieza aquí.',
      lead: 'Cuéntanos lo esencial. Nosotros conectamos las piezas.',
      // Nombre accesible del botón (no está en Figma).
      close: { label: 'Cerrar la solicitud de cotización', icon: { src: quoteClose, alt: '' } },
    },
    services: {
      title: '¿En qué te ayudamos?',
      hint: 'Elige uno o varios servicios.',
      count: { none: 'Ninguno seleccionado', one: '1 seleccionado', many: '{n} seleccionados' },
      options: [
        { value: 'branding', label: 'Branding e identidad', icon: { src: quoteServiceBranding, alt: '' } },
        { value: 'email-marketing', label: 'Email Marketing', icon: { src: quoteServiceEmail, alt: '' } },
        { value: 'ux-ui', label: 'Diseño UX/UI', icon: { src: quoteServiceUx, alt: '' } },
        { value: 'ads-seo', label: 'Ads & SEO', icon: { src: quoteServiceAds, alt: '' } },
        { value: 'web-ia', label: 'Desarrollo de productos & automatización IA', icon: { src: quoteServiceDev, alt: '' } },
      ],
      checkIcon: { src: quoteCheckInk, alt: '' },
    },
    budget: {
      title: 'Tu presupuesto',
      optional: 'Opcional',
      modes: { label: 'Tipo de presupuesto', range: 'Rango aproximado', max: 'Monto máximo fijo' },
      currency: {
        label: 'Moneda',
        defaultCode: 'USD',
        options: [
          { value: 'USD', label: 'USD' },
          { value: 'EUR', label: 'EUR' },
          { value: 'MXN', label: 'MXN' },
          { value: 'CRYPTO', label: 'Cripto' },
        ],
        icon: { src: quoteChevronDown, alt: '' },
      },
      ranges: {
        label: 'Rangos sugeridos',
        options: [
          { value: '100-400', label: '100 – 400' },
          { value: '0-1000', label: 'Menos de 1.000' },
          { value: '1000-3000', label: '1.000 – 3.000' },
          { value: '3000-5000', label: '3.000 – 5.000' },
          { value: '5000+', label: 'Más de 5.000' },
        ],
        checkIcon: { src: quoteCheckBrand, alt: '' },
      },
      // Modo "Monto máximo fijo": Figma no lo dibuja abierto.
      max: { label: 'Monto máximo', placeholder: 'Ej. 2.500' },
      note: 'Moneda editable · Tu estimación, no una tarifa del estudio.',
    },
    project: {
      title: 'Cuéntanos tu idea',
      hint: 'Qué haces, qué necesitas y en qué punto estás.',
      idea: {
        label: 'Tu idea',
        // Figma muestra un ejemplo ya escrito (220:947): aquí es el placeholder.
        placeholder:
          'Ej.: Estamos lanzando una marca de bienestar. Necesitamos una identidad propia y una web para vender online.',
        helper: 'Con 2–3 líneas basta.',
        minLength: 20,
      },
      goals: {
        title: '¿Qué quieres lograr?',
        optional: 'Opcional',
        options: [
          { value: 'lanzar-marca', label: 'Lanzar mi marca' },
          { value: 'vender-mas', label: 'Vender más' },
          { value: 'renovar-web', label: 'Renovar mi web' },
          { value: 'ahorrar-tiempo', label: 'Ahorrar tiempo' },
          { value: 'otro', label: 'Otro objetivo' },
        ],
        checkIcon: { src: quoteCheckGoal, alt: '' },
        addIcon: { src: quotePlus, alt: '' },
      },
    },
    attachment: {
      title: 'Añadir una referencia',
      hint: 'Opcional · Arrastra tu brief, PDF o imágenes.',
      accept: '.pdf,image/*',
      maxSizeMb: 10,
      remove: 'Quitar archivo',
      icon: { src: quotePaperclip, alt: '' },
      uploadIcon: { src: quoteUpload, alt: '' },
    },
    contact: {
      title: '¿Dónde te respondemos?',
      fields: {
        name: { label: 'Tu nombre', placeholder: 'Alex García', required: true },
        email: { label: 'Email', placeholder: 'alex@ejemplo.com', required: true },
        // Figma repite el email como ejemplo (215:196): aquí, un teléfono.
        whatsapp: { label: 'WhatsApp (opcional)', placeholder: '+34 600 000 000', required: false },
      },
      note: 'Te escribiremos para definir el alcance y el siguiente paso.',
    },
    footer: {
      alternative: '¿Prefieres conversarlo?',
      whatsapp: {
        label: 'Hablemos por WhatsApp',
        href: whatsappHref,
        newTab: newTabNotice,
        icon: { src: quoteWhatsapp, alt: '' },
        arrowIcon: { src: quoteArrowSm, alt: '' },
      },
      submit: { label: 'Solicitar cotización', icon: { src: quoteArrowLg, alt: '' } },
    },
    // Mensajes no diseñados en Figma.
    validation: {
      services: 'Elige al menos un servicio.',
      idea: 'Cuéntanos brevemente tu idea.',
      ideaShort: 'Cuéntanos un poco más: al menos {min} caracteres.',
      name: 'Escribe tu nombre.',
      email: 'Escribe tu email.',
      emailInvalid: 'Revisa el email: debe tener la forma nombre@dominio.com.',
      whatsappInvalid: 'Revisa el número: usa dígitos, espacios y el prefijo con +.',
      maxInvalid: 'Escribe el monto solo con números.',
      fileTooLarge: 'El archivo pesa más de {max} MB. Prueba con uno más ligero.',
      summary: 'Revisa los campos marcados para enviar la solicitud.',
    },
    status: {
      sending: 'Enviando…',
      sent: '¡Gracias! Recibimos tu solicitud y te escribiremos pronto.',
      error: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.',
      unavailable: `El envío de cotizaciones aún no está disponible: tu solicitud no se ha enviado. Escríbenos a ${studioEmail}.`,
    },
    // PENDIENTE: destino real del envío (no hay backend; el contacto de la home tampoco lo tiene).
    // Al definirlo, layout/quote/quote-form.ts hace POST multipart (con el adjunto) a esta URL.
    endpoint: undefined,
  },
  // Figma 272:8117 (archivo flzA0qnj6JdalFCgyB2PdI). Copy de Figma salvo donde se indica.
  advice: {
    requiredLabel: 'obligatorio',
    header: {
      eyebrow: 'Sensei Studio / Asesoría',
      title: '¿No sabes por dónde empezar?',
      lead: 'No necesitas tenerlo todo claro. Cuéntanos dónde estás y te ayudamos a orientar el siguiente paso.',
      // Nombre accesible del botón (no está en Figma).
      close: { label: 'Cerrar la solicitud de asesoría', icon: { src: adviceClose, alt: '' } },
    },
    stage: {
      title: '¿En qué punto estás?',
      hint: 'Elige una opción',
      options: [
        {
          value: 'desde-cero',
          label: 'Empiezo de cero',
          description: 'Tengo una idea, ¿y ahora qué?',
          icon: { src: adviceStageScratch, alt: '' },
        },
        {
          value: 'proyecto-en-marcha',
          label: 'Ya tengo un proyecto',
          description: 'Negocio, web o marca por mejorar',
          icon: { src: adviceStageProject, alt: '' },
        },
      ],
      checkedIcon: { src: adviceRadioChecked, alt: '' },
    },
    message: {
      title: '¿Qué te gustaría resolver?',
      optional: 'Opcional',
      // Nombre accesible del campo (Figma solo muestra el placeholder).
      label: 'Qué te gustaría resolver',
      placeholder: 'Cuéntanos qué te genera dudas o qué quisieras mejorar.',
      helper: 'Con una o dos líneas basta.',
    },
    contact: {
      fields: {
        name: { label: 'Tu nombre', placeholder: '¿Cómo te llamas?', required: true },
        email: { label: 'Correo electrónico', placeholder: 'Tu correo de contacto', required: true },
      },
      note: '* Campos obligatorios. Sin elegir servicios ni presupuesto.',
    },
    submit: { label: 'Solicitar asesoría', icon: { src: adviceArrow, alt: '' } },
    channels: {
      title: '¿Prefieres conversarlo?',
      aside: 'Sin completar el formulario',
      arrowIcon: { src: adviceArrowSm, alt: '' },
      items: [
        { label: 'WhatsApp', href: whatsappHref, newTab: newTabNotice, icon: { src: adviceWhatsapp, alt: '' } },
        { label: 'Escribir por correo', href: adviceMailHref, icon: { src: adviceEmail, alt: '' } },
      ],
    },
    // Mensajes no diseñados en Figma.
    validation: {
      name: 'Escribe tu nombre.',
      email: 'Escribe tu correo.',
      emailInvalid: 'Revisa el correo: debe tener la forma nombre@dominio.com.',
      summary: 'Revisa los campos marcados para enviar la solicitud.',
    },
    status: {
      sending: 'Enviando…',
      sent: '¡Gracias! Recibimos tu solicitud y te escribiremos pronto.',
      error: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.',
      unavailable: `El envío de solicitudes de asesoría aún no está disponible: tu solicitud no se ha enviado. Escríbenos a ${studioEmail}.`,
    },
    // PENDIENTE: destino real del envío (mismo hueco que la cotización). Al definirlo,
    // layout/advice/advice-form.ts hace POST multipart a esta URL.
    endpoint: undefined,
  },
  footer: {
    navLabel: 'Pie de página',
    columns: [
      {
        // 174:29-174:34. Solo hay una página: cada enlace apunta a una sección de la home.
        title: 'Páginas',
        links: [
          { label: 'Inicio', href: '/#inicio' },
          { label: 'Nosotros', href: '/#equipo' },
          { label: 'Proyectos', href: '/#proyectos' },
          { label: 'Contacto', href: '/#contacto' },
        ],
      },
      {
        // 174:36-174:41: los cuatro casos publicados, cada uno a su página (forma de projectPath, sin
        // importarla: projects.ts ya importa este archivo).
        title: 'Trabajos',
        links: [
          { label: 'Yupa', href: '/proyectos/yupa/' },
          { label: 'Cappi Xtremo', href: '/proyectos/cappi-xtremo/' },
          { label: 'Remittven', href: '/proyectos/remittven/' },
          { label: 'Las Doñas', href: '/proyectos/las-donas/' },
        ],
      },
      {
        // 174:43-174:47. Externos: pestaña nueva con aviso para lectores de pantalla.
        title: 'Redes sociales',
        links: studioSocials.map(({ label, url }) =>
          url ? { label, href: url, newTab: newTabNotice } : { label },
        ),
      },
    ],
    studio: {
      // 174:48-174:58.
      title: 'By Sensei',
      description: 'No vendemos horas.',
      descriptionAside: 'Construimos productos que convierten.',
      credits: [
        { prefix: 'Copyright', name: 'By Sensei Studio' },
        { prefix: 'Powered by', name: 'By Sensei Studio' },
      ],
      // PENDIENTE: no hay páginas de términos ni de privacidad; se pintan como texto sin enlace.
      legal: [{ label: 'Términos y condiciones' }, { label: 'Políticas de privacidad' }],
    },
    gallery: {
      // Grupo "SOLO PARA SLIDERS DEL FOOTER" de Figma (fila 331:7342 → 334:7351), en su orden; decorativas.
      cards: [
        { image: { src: 'images/slider-footer/truma-consultores-login-laptop.jpg', alt: '' } },
        { image: { src: 'images/slider-footer/aloa-handbags-website-laptop.jpg', alt: '' } },
        { image: { src: 'images/slider-footer/global-logistics-website-laptop.jpg', alt: '' } },
        { image: { src: 'images/slider-footer/marketplace-artesanal-website-laptop.jpg', alt: '' } },
      ],
      // Figma repite la pieza de Aloa (331:7344 y 331:7346 son idénticas): la rueda necesita 6
      // tarjetas, así que entra al final, en el lado opuesto del anillo a la primera.
      incoming: [
        { image: { src: 'images/slider-footer/yupa-stickers-website-laptop.jpg', alt: '' } },
        { image: { src: 'images/slider-footer/aloa-handbags-website-laptop.jpg', alt: '' } },
      ],
      pauseLabel: 'Pausar la galería animada',
      pauseIcon: { src: wheelPause, alt: '' },
      playIcon: { src: wheelPlay, alt: '' },
    },
  },
};

export default site;
