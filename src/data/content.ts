export type ProjectTone = 'yellow' | 'red'

export const SITE = {
  name: 'Sensei Studio',
  tagline: 'Diseño, tecnología y estrategia',
}

export const HERO = {
  headline: 'Sensei',
  subheadline: 'Studio.',
  description: 'No diseñamos pantallas bonitas. Diseñamos resultados.',
  supporting: 'Diseño, desarrollo y automatización para marcas que no quieren esperar meses para ver resultados.',
  ctaPrimary: { text: 'Agenda una llamada', href: '#cta' },
  ctaSecondary: { text: 'Ver casos de estudio', href: '#proyectos' },
  services: [
    'Branding e identidad',
    'Social Media Marketing',
    'Web Design y Desarrollo',
    'SEO y optimización',
  ],
}

export type ClientLogoKind = 'mark' | 'wordmark'

export const CLIENTS = [
  { name: 'Adobe', logo: '/assets/figma/vector-08.svg', logoKind: 'mark' as ClientLogoKind },
  { name: 'Airbnb', logo: '/assets/figma/vector-13.svg', logoKind: 'wordmark' as ClientLogoKind },
  { name: 'Opendoor', logo: '/assets/figma/vector-12.svg', logoKind: 'mark' as ClientLogoKind },
  { name: 'Evernote', logo: '/assets/figma/vector-16.svg', logoKind: 'wordmark' as ClientLogoKind },
  { name: 'Pipedrive', logo: '/assets/figma/vector-01.svg', logoKind: 'wordmark' as ClientLogoKind },
  { name: 'Fivetran', logo: '/assets/figma/vector-03.svg', logoKind: 'mark' as ClientLogoKind },
  { name: 'Afterpay', logo: '/assets/figma/vector-14.svg', logoKind: 'wordmark' as ClientLogoKind },
  { name: 'Element', logo: '/assets/figma/vector-18.svg', logoKind: 'wordmark' as ClientLogoKind },
]

export const PROJECTS_HEADING = {
  label: 'Proyectos',
  title: 'Ayudamos a marcas de distintas industrias a lograr resultados reales.',
  sub: 'Estos son algunos de nuestros proyectos recientes.',
  link: 'Ver todos los proyectos',
}

export const PROJECTS = [
  {
    title: 'DASS DESIGN ANTHROPOLOGY',
    category: 'Web Design',
    image: '/assets/figma/raw-11.png',
    tone: 'yellow' as ProjectTone,
    alt: 'Diseño web amarillo de DASS Design Anthropology School',
  },
  {
    title: 'VIETNAM EXPOSITION CENTER',
    category: 'Experiencia digital',
    image: '/assets/figma/raw-10.png',
    tone: 'red' as ProjectTone,
    alt: 'Diseño web rojo de Vietnam Exposition Center',
  },
  {
    title: 'DASS — SISTEMA VISUAL',
    category: 'Identidad y producto',
    image: '/assets/figma/raw-12.png',
    tone: 'yellow' as ProjectTone,
    alt: 'Detalle del sistema visual de DASS Design Anthropology School',
  },
]

export const WHY_US = {
  label: 'Por qué elegirnos',
  headline: 'Resultados comprobados en cada proyecto,',
  muted: 'con foco en diseño y funcionalidad.',
  sub: 'Sin relleno, solo resultados. Diseño estratégico y herramientas que hacen crecer tu negocio. Nos enfocamos en decisiones inteligentes y funcionalidad real, proyecto tras proyecto.',
}

export const STATS = [
  { value: '+250', label: 'Proyectos completados con éxito', featured: true },
  { value: '97%', label: 'Tasa de satisfacción del cliente' },
  { value: '+9', label: 'Años de experiencia senior combinada' },
  { value: '1 punto', label: 'Punto de contacto — sin intermediarios, sin fricción' },
]

export const HOW_WE_WORK = {
  label: 'Nuestro proceso 4 pasos',
}

export const STEPS = [
  {
    number: '01',
    title: 'El equipo comunica cada paso',
    description: 'Trabajamos con claridad para que siempre sepas qué estamos haciendo y por qué.',
  },
  {
    number: '02',
    title: 'Soluciones a medida',
    description: 'Diseñamos para tus necesidades, no para encajar en plantillas genéricas.',
  },
  {
    number: '03',
    title: 'Precios transparentes',
    description: 'Definimos el alcance y la inversión desde el inicio, sin costos ocultos.',
  },
  {
    number: '04',
    title: 'Resultados medibles',
    description: 'Cada entrega tiene un objetivo claro y una forma de comprobar su impacto.',
  },
]

export const SERVICES_HEADING = {
  label: 'Servicios',
  headline: 'Un equipo. Cuatro disciplinas.',
  muted: 'Cero fricción.',
  sub: 'Sin relleno, solo resultados. Diseño estratégico y herramientas que hacen crecer tu negocio. Nos enfocamos en decisiones inteligentes y funcionalidad real, proyecto tras proyecto.',
}

export const SERVICES = [
  {
    title: 'Diseño UX/UI',
    description: 'Interfaces claras y funcionales, diseñadas para guiar al usuario y aumentar la conversión.',
  },
  {
    title: 'Desarrollo web a medida',
    description: 'Sitios rápidos, responsivos y construidos para escalar — no plantillas genéricas.',
  },
  {
    title: 'Branding e identidad',
    description: 'Identidad visual sólida que hace que tu marca se reconozca y se recuerde.',
  },
  {
    title: 'Marketing digital y SEO',
    description: 'Estrategias de contenido, redes sociales y SEO enfocadas en atraer al cliente correcto, no solo tráfico.',
  },
]

export const SHOWCASE_TITLE = 'Creatividad, tecnología y estrategia'

export const SHOWCASE_PROJECTS = [
  {
    title: 'DASS Design Anthropology School',
    image: '/assets/figma/raw-11.png',
  },
  {
    title: 'Vietnam Exposition Center',
    image: '/assets/figma/raw-10.png',
  },
  {
    title: 'Vietnam Exposition Center — detalle',
    image: '/assets/figma/raw-12.png',
  },
]

export const REVIEWS = {
  label: 'Experiencias formativas',
  headline: 'Lo que dicen',
  muted: 'quienes aprendieron con nosotros',
  note: 'Estas opiniones corresponden a experiencias formativas y no sustituyen testimonios de proyectos de agencia.',
  proofEyebrow: 'Prueba social',
  proofTitle: 'Testimonios de agencia, próximamente.',
  proofDescription: 'Estamos recopilando opiniones de clientes de proyectos reales para compartirlas con contexto y permiso.',
  wallImage: '/assets/figma/reviews-wall.png',
}

export const REVIEWS_LIST = [
  {
    quote: 'El curso es excelente. Si quieres comenzar con buen pie, sin duda es la mejor manera.',
    name: 'Adrián Casas',
    role: 'UX Writing',
  },
  {
    quote: 'Ha sido un curso excelente. Todo muy bien explicado, con claros ejemplos y muy ameno.',
    name: 'Toni Fernández Leal',
    role: 'Diseño UI',
  },
  {
    quote: 'Soy desarrollador web y móvil. Me ayudó bastante a potenciar lo que ya sabía del lado del desarrollo.',
    name: 'José Luis Martínez',
    role: 'Diseño UX/UI',
  },
  {
    quote: 'Es un curso muy interesante, siempre he querido aprender sobre diseño UI/UX.',
    name: 'Julia Cerezo Martínez',
    role: 'Diseño UI',
  },
]

export const TEAM_HEADING = {
  label: '+ Sobre nosotros',
  headline: 'Los rostros',
  muted: 'detrás de los proyectos.',
  sub: 'Creemos que el buen trabajo nace de la colaboración. Por eso trabajamos codo a codo entre nosotros, para asegurar que cada proyecto cumpla tus objetivos y supere tus expectativas.',
  ctaText: 'Trabajemos juntos',
  ctaDescription: 'Si estás listo para crear y colaborar, nos encantaría saber de ti.',
}

export const TEAM_TILES = [
  {
    kind: 'member' as const,
    name: 'Natalia',
    role: 'Team Lead & Desarrollo Web',
    image: '/assets/figma/team-natalia.jpg',
  },
  {
    kind: 'placeholder' as const,
    name: 'Víctor',
    role: 'Full-Stack Developer & IA',
  },
  {
    kind: 'placeholder' as const,
    name: 'Jhoarling',
    role: 'Senior UX/UI Designer',
  },
  {
    kind: 'placeholder' as const,
    name: 'Maicol',
    role: 'Diseño Gráfico & Branding',
  },
]

export const FAQ_HEADING = {
  headline: '¿Tienes preguntas?',
  sub: 'Tenemos respuestas.',
  description: 'Aquí tienes lo que necesitas saber sobre trabajar con nosotros.',
}

export const FAQ = [
  {
    question: '¿Cuánto tarda un sitio web o una campaña?',
    answer: 'Depende del alcance. Definimos un cronograma claro en la primera etapa y lo revisamos contigo durante todo el proceso.',
  },
  {
    question: '¿Trabajan a medida o con plantillas?',
    answer: 'Siempre a medida. Diseñamos soluciones para tus necesidades, no plantillas genéricas.',
  },
  {
    question: '¿Qué servicios puedo contratar?',
    answer: 'Combinamos UX/UI, desarrollo web, branding, marketing digital y SEO para resolver el reto completo.',
  },
  {
    question: '¿Cómo empezamos?',
    answer: 'Agenda una llamada de diagnóstico. En una conversación breve evaluamos si encajamos y definimos los siguientes pasos.',
  },
]

export const FOOTER = {
  pages: [
    { label: 'Inicio', href: '#hero' },
    { label: 'Studio', href: '#por-que-elegirnos' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#cta' },
  ],
  recentWork: [
    { label: 'DASS Design', href: '#proyectos' },
    { label: 'Vietnam Exposition Center', href: '#proyectos' },
    { label: 'Sistema visual', href: '#proyectos' },
  ],
  socials: [],
  email: { label: 'hola@sensei.studio', href: 'mailto:hola@sensei.studio' },
  description: 'Un estudio independiente que mezcla diseño, código y estrategia para crear productos que llegan a producción.',
  credits: ['Sensei Studio · Diseño, desarrollo y estrategia'],
  collage: '/assets/figma/footer-collage.png',
}

export const CTA_FINAL = {
  headline: '¿Tienes un reto?',
  sub: 'Hablemos.',
  description: 'Si estás listo para crear y colaborar, nos encantaría saber de ti.',
  cta: { text: 'Agenda una llamada', href: 'mailto:hola@sensei.studio' },
}
