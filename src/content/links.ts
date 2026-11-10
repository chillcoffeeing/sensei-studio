// Bio de Instagram en /links. El copy es palabra por palabra el de
// design/links/Linktree-Diagnostico-gratis-Sensei.pdf y su prototipo linktree-sensei.html (cualquier
// cambio se consulta con Natalia). Lo que ya existe en el sitio se toma de su única fuente: WhatsApp
// y "Cotizar proyecto" de content/site.ts, el caso destacado de content/projects.ts.
import type { Links } from '@/app/links';
import arrowUpRight from '@/assets/links/arrow-up-right.svg';
import arrowUpRightSm from '@/assets/links/arrow-up-right-sm.svg';
import compass from '@/assets/links/path-compass.svg';
import documentIcon from '@/assets/links/path-document.svg';
import atmosphere from '@/assets/images/cabecera-links/header-atmosphere.png';
import logo from '@/assets/links/sensei-studio-logo.svg';
import wordmark from '@/assets/links/sensei-wordmark.svg';
import { projectCard } from '@/content/projects';
import site from '@/content/site';

// Diagnóstico: inversión mínima (USD) para ver la agenda; quien elige menos no ve Cal.com.
const MIN_BUDGET = 400;
// Evento de Cal.com (20 minutos) embebido en el paso 4a.
const CAL_LINK = 'https://cal.com/sensei-studio-8sto43/agenda-20-minutos-con-nosotros';

const { floatingBar } = site;
// Caso destacado: nombre, claim, categoría e imagen salen del propio proyecto (sin duplicar datos).
const featured = projectCard('yupa');
// Mismo número, aviso y logo que la barra flotante (que no se muestra en /links).
const whatsapp = floatingBar.whatsapp;

const links: Links = {
  seo: {
    title: 'Links · Sensei Studio',
    description:
      'Haz tu diagnóstico gratis o cotiza tu proyecto con Sensei Studio: diseño, desarrollo y automatización para marcas que quieren crecer.',
  },
  header: {
    logo: { src: logo, alt: 'Sensei Studio' },
    atmosphere: { src: atmosphere, alt: '' },
    title: ['De la idea al resultado.'],
    description: 'Diseño, desarrollo y automatización para marcas que quieren crecer.',
  },
  paths: {
    label: 'Tu proyecto empieza aquí',
    title: '¿Por dónde empezamos?',
    text: 'Elige el camino que va contigo.',
    diagnostic: {
      title: 'Diagnóstico gratuito',
      text: 'No tengo claro qué necesito',
      badge: 'Gratis · 2 min',
      icon: { src: compass, alt: '' },
    },
    // Mismo texto que "Cotizar proyecto" de la barra flotante.
    quote: { title: floatingBar.quote.label, text: 'Ya sé lo que necesito', icon: { src: documentIcon, alt: '' } },
    footer: 'Lo esencial primero. El alcance lo definimos juntos.',
  },
  // Los CTA lima dibujan la flecha en su círculo: el "→" del PDF no se repite en el texto.
  diagnostic: {
    label: 'Diagnóstico gratis',
    close: { label: 'Cerrar', marker: '✕' },
    footer: { text: 'Sin promesas vacías.', strong: 'Solo resultados.' },
    intro: {
      title: { text: '¿Qué necesita tu proyecto para', mark: 'despegar?' },
      text: 'Responde 16 preguntas rápidas de sí o no. En dos minutos sabrás por dónde empezar para que tu proyecto funcione como lo imaginas.',
      start: 'Empezar mi diagnóstico',
      meta: 'Gratis · 2 minutos · Resultado al instante',
    },
    quiz: {
      counter: '{n} / {total}',
      progress: 'Progreso del diagnóstico',
      yes: 'Sí',
      no: 'No',
      back: '← Pregunta anterior',
    },
    questions: [
      { area: 'branding', text: '¿Tu marca no tiene una identidad clara, o cambia según quién la haya diseñado?' },
      { area: 'branding', text: '¿Sientes que tu marca no se diferencia de la competencia?' },
      { area: 'branding', text: '¿Todavía no tienes ninguna identidad de marca definida?' },
      { area: 'branding', text: '¿Tienes una identidad de marca, pero ya no representa en qué se convirtió tu negocio?' },
      { area: 'ux', text: '¿Tu sitio o app se ve bien, pero no logra que la gente avance (compre, se registre, escriba)?' },
      { area: 'ux', text: '¿La gente se pierde o abandona a mitad de un proceso (formulario, compra, registro)?' },
      { area: 'ux', text: '¿Todavía no tienes ningún sitio o producto diseñado pensado en el usuario?' },
      { area: 'ux', text: '¿Tienes actualmente un diseño de web o app que ya no representa tu marca o proyecto?' },
      { area: 'dev', text: '¿Tienes una idea de app, web o producto digital que todavía no arranca?' },
      { area: 'dev', text: '¿Tu equipo pierde tiempo en tareas repetitivas que ya deberían estar automatizadas?' },
      { area: 'dev', text: '¿No tienes ningún sistema de automatización funcionando hoy?' },
      { area: 'dev', text: '¿Tienes un sitio o sistema ya construido, pero quedó obsoleto o no escala con tu operación actual?' },
      { area: 'email', text: '¿Tus correos no generan ventas ni respuestas?' },
      { area: 'email', text: '¿No tienes un seguimiento automático para los leads que no responden de inmediato?' },
      { area: 'email', text: '¿Todavía no tienes ninguna estrategia de email marketing?' },
      { area: 'email', text: '¿Tienes campañas de correo activas, pero ya no sabes si realmente están funcionando?' },
    ],
    // Orden = desempate: Branding, UX/UI, Desarrollo, Email.
    areas: [
      {
        key: 'branding',
        name: 'Branding e identidad',
        short: 'Branding',
        title: 'Tu proyecto está listo para una identidad que se recuerde',
        text: 'Con una marca clara, todo lo demás habla el mismo idioma: tu sitio, tus redes, tus correos y tu producto. La gente te reconoce a primera vista y entiende qué te hace distinto.',
        steps: [
          'Define en una frase qué te hace distinto.',
          'Elige 2 colores y 1 tipografía, y úsalos siempre.',
          'Revisa que tu logo se lea bien en tamaño pequeño.',
        ],
      },
      {
        key: 'ux',
        name: 'Diseño UX/UI',
        short: 'UX/UI',
        title: 'Tu proyecto puede guiar a cada persona hasta el final',
        text: 'Con una experiencia pensada para quien la usa, cada visita tiene un camino claro hacia la compra, el registro o el contacto. Menos dudas, más personas que avanzan.',
        steps: [
          'Deja un solo botón principal por pantalla.',
          'Recorta tu formulario a los campos indispensables.',
          'Recorre tu sitio desde el celular, como si fueras cliente.',
        ],
      },
      {
        key: 'dev',
        name: 'Desarrollo y automatización',
        short: 'Desarrollo',
        title: 'Tu idea está lista para convertirse en un producto real',
        text: 'Con el desarrollo y la automatización correctos, tu operación avanza sola: procesos que se resuelven sin intervención y un sistema que crece al mismo ritmo que tu negocio.',
        steps: [
          'Anota las 3 tareas que más repites cada semana.',
          'Elige una y automatízala primero.',
          'Haz una lista de lo que tu sitio debería hacer y hoy no hace.',
        ],
      },
      {
        key: 'email',
        name: 'Email marketing',
        short: 'Email',
        title: 'Tus correos pueden trabajar por ti',
        text: 'Con una estrategia y flujos automáticos, cada contacto recibe el mensaje correcto en el momento justo. Cada correo tiene una razón para abrirse y un siguiente paso claro.',
        steps: [
          'Arma un correo de bienvenida para cada contacto nuevo.',
          'Escribe asuntos que digan qué gana quien abre el correo.',
          'Agrega un seguimiento a los 3 días para quien no responde.',
        ],
      },
    ],
    none: {
      tag: 'Buen punto de partida',
      title: 'Tu proyecto tiene una base sólida',
      text: 'No marcaste señales claras en ninguna área. Es el mejor momento para afinar detalles y llevar lo que ya funciona a un siguiente nivel.',
      steps: [
        'Revisa qué canal te trae más clientes hoy.',
        'Pide a 3 clientes que te digan qué mejorarían.',
        'Elige una sola mejora y mide su resultado durante un mes.',
      ],
    },
    result: {
      priority: 'Tu prioridad: {area}',
      scores: { title: 'Tu diagnóstico', value: '{score}/{max}' },
      invite: {
        title: { text: 'Definámoslo', mark: 'juntos' },
        text: 'En 20 minutos revisamos tu diagnóstico contigo y definimos el siguiente paso. Antes, cuéntanos un poco de tu proyecto.',
        cta: 'Quiero definir mi proyecto',
      },
    },
    qualify: {
      title: { text: 'Cuéntanos de', mark: 'tu proyecto' },
      text: 'Tres respuestas rápidas para preparar una conversación a tu medida.',
      stage: {
        legend: '¿En qué etapa está tu proyecto?',
        options: [
          { value: 'idea', label: 'Solo es una idea' },
          { value: 'listo', label: 'Listo para empezar' },
          { value: 'existe', label: 'Ya existe y quiero mejorarlo' },
        ],
      },
      start: {
        legend: '¿Cuándo te gustaría empezar?',
        options: [
          { value: 'este-mes', label: 'Este mes' },
          { value: '1-3-meses', label: 'En 1 a 3 meses' },
          { value: 'mas-adelante', label: 'Más adelante' },
        ],
      },
      budget: {
        legend: '¿Qué inversión tienes contemplada?',
        hint: '(USD)',
        options: [
          { value: 'menos-400', label: 'Menos de $400', min: 0 },
          { value: '400-1500', label: '$400 – $1.500', min: 400 },
          { value: '1500-5000', label: '$1.500 – $5.000', min: 1500 },
          { value: 'mas-5000', label: 'Más de $5.000', min: 5000 },
        ],
      },
      fields: { name: 'Tu nombre', email: 'Tu correo' },
      error: 'Completa las tres preguntas, tu nombre y un correo válido.',
      submit: 'Continuar',
      sending: 'Enviando…',
    },
    minBudget: MIN_BUDGET,
    booking: {
      title: { text: 'Elige tu', mark: 'horario' },
      text: '{name}, reserva tus 20 minutos. Ya tenemos tu diagnóstico, así que vamos directo a lo importante.',
      calLink: CAL_LINK,
      notes: 'Diagnóstico: {area} · {stage} · Inicio: {start} · Inversión: {budget}',
      frameTitle: 'Agenda con Sensei Studio',
      open: 'Abrir la agenda en otra pestaña',
      newTab: whatsapp.newTab,
    },
    later: {
      title: { text: 'Gracias, {name}. Tu proyecto tiene', mark: 'por dónde empezar.' },
      text: 'Estos son tus primeros 3 pasos para avanzar desde hoy:',
      invite: {
        title: '¿Quieres que te ayudemos?',
        text: 'Cuéntanos tu proyecto por WhatsApp y te decimos qué opciones tienes para tu presupuesto.',
      },
      whatsapp: {
        label: 'Cotizar por WhatsApp',
        href: whatsapp.href,
        newTab: whatsapp.newTab,
        message: 'Hola, hice el diagnóstico de Sensei Studio. Mi prioridad es {area}. Quiero ver qué opciones tengo para mi presupuesto.',
      },
    },
    icons: { cta: { src: arrowUpRight, alt: '' }, open: { src: arrowUpRightSm, alt: '' }, whatsapp: whatsapp.icon },
  },
  explore: {
    label: 'Un proyecto reciente',
    project: {
      href: featured.href,
      image: featured.image,
      title: featured.name,
      claim: featured.claim,
      category: featured.category,
      all: { label: 'Ver todos los proyectos', href: '/proyectos/', icon: { src: arrowUpRightSm, alt: '' } },
    },
  },
  closing: {
    title: '¿Prefieres escribirnos?',
    // El único WhatsApp de la página (más el "Cotizar por WhatsApp" del paso 4b).
    whatsapp: { label: whatsapp.label, href: whatsapp.href, newTab: whatsapp.newTab, icon: whatsapp.icon },
    site: { label: 'Visitar bysensei.com', href: '/' },
    claim: { text: 'Sin promesas vacías.', strong: 'Solo resultados.' },
    wordmark: { src: wordmark, alt: 'Sensei Studio' },
    navLabel: 'Enlaces del estudio',
    // PENDIENTE: no hay página de privacidad todavía; se pinta como texto.
    links: [{ label: 'Privacidad' }],
  },
};

export default links;
