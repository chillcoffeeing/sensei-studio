# Huecos de contenido: informe para el cliente

Estado al 2026-10-15 (HOME-REAL; equipo: TEAM-V2 y TEAM-SOCIAL-LINKS; imágenes de los casos: PRJ-MEDIA; cuarto caso: PRJ-CAPPI). El informe cubre la home, los cuatro casos de estudio y el
chrome del sitio (cabecera, pie, `/links`, SEO). Se indica qué es real, qué es provisional, qué falta
y quién debe aportarlo. El JSON no admite comentarios, así que las marcas PLACEHOLDER / PUNTO A
CONFIRMAR viven aquí. Al resolver un hueco, se borra su fila.

**Quién aporta**:
- **Estudio**: Sensei Studio (copy, fotos propias, cifras del negocio, decisiones).
- **Cliente del caso**: Yupa, Remittven, Las Doñas o Cappi Xtremo (material del proyecto, cifras, permisos).
- **Desarrollo**: el equipo técnico (endpoints, dominio, despliegue).

**Prioridad**:
- **P1**: bloquea publicar. Lo que hay es falso o no funciona (formularios, logos de clientes, cifras sin fuente, idioma).
- **P2**: resta credibilidad. Lo que hay es provisional pero honesto (huecos de equipo, avatares sin foto, textos por confirmar).
- **P3**: pulido (erratas de diseño, textos de plantilla, mejores resoluciones).

## Resumen: lo primero que hace falta

| # | Hueco | Dónde | Tipo | Quién |
|---|---|---|---|---|
| 1 | RESUELTO: dominio de producción `https://bysensei.com` (confirmado 2026-10-15); `SITE_URL` solo para otros entornos | `astro.config.mjs` / `SITE_URL` | dato | Estudio + Desarrollo |
| 2 | Destino de envío del formulario de contacto y de los modales de cotización y asesoría: hoy validan y avisan de que **no envían** | home · contacto; modales | endpoint | Desarrollo |
| 3 | Número de WhatsApp del estudio: hoy el enlace es `https://wa.me/` sin número | barra flotante, modales, `/links` | dato | Estudio |
| 4 | Logos de "Marcas que confían en nosotros": Adobe, Airbnb, Opendoor… son de la plantilla de Figma, **no son clientes** | home · clientes | imagen | Estudio (sección archivada) |
| 5 | Cifras de "Por qué elegirnos" (+250 proyectos, +9 años, 97 %, 1 punto) sin fuente | home · stats | cifra | Estudio |
| 6 | Cifras que no cuadran entre secciones: el FAQ dice "+500 clientes, +200 proyectos, +6 años por integrante"; stats dice "+250 proyectos, +9 años"; testimonios, "56+ clientes" | home · faq, stats, testimonios | cifra | Estudio |
| 7 | Términos y Política de privacidad: enlaces a `example.com` (home) y "Privacidad" sin enlace (`/links`) | home · contacto; `/links` | copy + página | Estudio |
| 8 | Contacto en inglés: título "Let's talk." y texto legal "By contacting us…" | home · contacto | copy | Estudio |
| 9 | Testimonios con nombres anonimizados ("La agencia", "El estudio Sensei"), citas cortadas con "..." y erratas | home · testimonios | copy | Estudio |
| 10 | Equipo: bios provisionales de los 6 integrantes, sin foto de Maicol Durán y Daniel Rivera; perfiles profesionales solo de Natalia (Behance), Jhoarling (Behance, LinkedIn) y Victor (LinkedIn): faltan los demás (TEAM-SOCIAL-LINKS) | home · equipo | foto + copy + URL | Estudio |
| 11 | Nota metodológica de las cifras de resultados (de dónde salen y en qué periodo) | casos · resultados | cifra | Cliente del caso |

## Home (`src/content/data/pages/home.json`)

### Hero (`inicio`)
- **Real**: titular, servicios, texto de entrada y video de fondo (`public/videos/hero-background.mp4`).
- Sin huecos de contenido.

### Clientes (`clientes`, logo-marquee) — ARCHIVADO 2026-10-15 en `_archive/logo-marquee/`; no se publica hasta tener logos reales
| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `content.logos[]` | PLACEHOLDER: 9 logos de la plantilla de Figma (Adobe, Airbnb, Opendoor, Evernote, Pipedrive, Fivetran, Afterpay, Elastic, Airwallex). No son clientes del estudio. Hacen falta los logos reales (SVG monocromo) y permiso para mostrarlos. Ya hay cuatro candidatos con caso publicado: Yupa, Remittven, Las Doñas y Cappi Xtremo | imagen + permiso | Estudio |

### Proyectos (`proyectos`, project-gallery)
- **Real**: las cuatro tarjetas salen de los casos (`yupa`, `remittven`, `las-donas`, `cappi-xtremo`): portada (web o app del caso en portátil, PRJ-MEDIA), nombre, categoría, las tres cifras de resultados y el enlace "Ver proyecto" → `/proyectos/<slug>/`.
- Desde lg, con un número impar de proyectos, la primera ocupa las dos columnas.
- "Ver todos los proyectos" lleva al índice `/proyectos/` (PROJECTS-INDEX).

### Por qué elegirnos (`por-que-elegirnos`, stats)
| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `content.items[].value` | PUNTO A CONFIRMAR: "+250 proyectos completados", "+9 años de experiencia senior combinada", "97 % tasa de satisfacción" y "1 punto de contacto" vienen del diseño, sin fuente. Hay que confirmarlas o sustituirlas (p. ej. "+250" frente a 4 casos publicados y "56+ clientes" en testimonios) | cifra | Estudio |

### Proceso (`proceso`)
- **Real**: los 4 pasos (`design/copy/process.md`). Sin huecos.

### Servicios (`servicios`)
- **Real**: títulos, descripciones y listas (`design/copy/services.md`). Imágenes propias por disciplina
  (SERVICES-IMAGES): Branding (Figma `flzA0qnj6JdalFCgyB2PdI` 351:28–30), Email Marketing (352:32–34) y
  UX/UI (3 láminas del estudio, `ux-ui-*.png`). Desarrollo & IA (SERVICES-DEV-IMAGES): tres
  ilustraciones vectoriales coloridas en `src/assets/images/servicios-homepage/`.

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| — | `services[3].images` | RESUELTO (SERVICES-DEV-IMAGES): ilustraciones vectoriales de desarrollo web/e-commerce/apps, dashboards/chatbots/analítica y automatización IA, exportadas a 1281 × 1913 en JPEG optimizado | imagen | Estudio |

### Destacados (`destacados`, showcase)
- **Real** (IMG-SLIDERS): las diapositivas son el grupo "SOLO PARA SLIDER INTERMEDIO" de Figma (243:20, fila
  291:1384 → 291:7282), en su orden: collages de Qfud, Pictdare, Referi, Remittven, Soldee, Yupa (compra) y
  Just Make It Fun.

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P3 | `content.slides` | PUNTO A CONFIRMAR: el grupo de Figma trae 8 piezas, pero 329:7330 es idéntica a 291:7283 (Yupa, compra): se publican 7 para no repetir la misma diapositiva seguida. Si el diseñador quería otra pieza de Yupa, falta cambiarla en Figma | imagen | Estudio |

### Testimonios (`testimonios`)
| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `content.reviews[].quote` | PUNTO A CONFIRMAR: las citas nombran al estudio como "La agencia" o "El estudio Sensei" (restos de anonimizar); ¿se cambia por "Sensei Studio"? Varias terminan en "..." (cortadas) y hay erratas: "increíblecon", "enfoque  para", "100 confiables", "nos ayudo" (`design/copy/testimonials.md`) | copy | Estudio |
| P3 | `content.trust.avatars` | 4 siluetas neutras (`UserPlaceholder`): no hay fotos de clientes con permiso (el nodo real `334:7405` tampoco las trae, 2026-10-15). Si llegan, cada avatar admite `photo` | imagen + permiso | Estudio |
| P2 | `content.trust.count` | PUNTO A CONFIRMAR: "56+ clientes" sin fuente | cifra | Estudio |
| P2 | `content.trust.caption` | El sello "Trusted by clients worldwide" está en inglés (`lang="en"`) | copy | Estudio |
| P3 | `content.cta.href` | PUNTO A CONFIRMAR: "Déjanos un comentario" lleva a `/#contacto` porque no hay formulario de reseñas (¿Google, Clutch…?) | URL | Estudio |

### Equipo (`equipo`)
- **Real** (Figma flzA0qnj6JdalFCgyB2PdI 291:131, TEAM-V2): nombres, roles y orden de los 6 integrantes (Natalia, Jhoarling, María, Victor, Maicol, Daniel); fotos de Natalia Reina, Jhoarling Reina, María Reina (exportada de su card, la de camisa blanca) y Victor Veliz.

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P2 | `members[4].photo`, `members[5].photo` | PLACEHOLDER: Maicol Durán y Daniel Rivera sin retrato; la card muestra la silueta neutra de `UserPlaceholder` (Figma reutiliza la foto de María como relleno) | foto | Estudio |
| P2 | `members[0..5].bio` | PROVISIONAL: una frase redactada por el estudio a falta de la bio de cada integrante (pedido 2026-10-14, "descripción breve de momento"). La de María y la de Maicol (ahora diseñador) se redactaron en TEAM-V2 | copy | Estudio |
| P2 | `members[].profiles[].url` | PARCIAL (TEAM-SOCIAL-LINKS, Figma flzA0qnj6JdalFCgyB2PdI 334:7407 y 341:7413-341:7428): **entregadas y aplicadas** Behance de Natalia, Behance + LinkedIn de Jhoarling y LinkedIn de Victor. Siguen vacías (sin icono) las demás. Los nodos de Natalia, María, Victor y Maicol traen además enlaces copiados de otra persona o la raíz `https://github.com/`: no se asignan (ver tabla). No se inventan URLs. Formato: `https://…` del perfil público | URL | Estudio |
| P3 | `members[0..5].company` | PLACEHOLDER: "en Sensei Studio" para todos | copy | Estudio |

**Perfiles profesionales por persona** (redes elegidas por rol; si alguien no tiene
una, se borra su entrada; si tiene otra admitida, se añade `{ "network": "…", "url": "…" }`.
Redes admitidas: `behance`, `dribbble`, `linkedin`, `github`). La red se decide por el dominio
de la URL, no por la etiqueta del nodo de Figma (en 341:7413 la etiqueta "linkedin" lleva una URL de Behance):

| Integrante | Rol | Aplicada (nodo Figma) | URL que falta | Descartado en Figma |
|---|---|---|---|---|
| Natalia Reina | Senior UX/UI designer | Behance `behance.net/nataliareina` (341:7417) | Dribbble, LinkedIn | 341:7416 `behance.net/jhoarling` (es de Jhoarling) |
| Jhoarling Reina | Product Head UX/UI designer | Behance `behance.net/jhoarling` (334:7408), LinkedIn `linkedin.com/in/jhoarling-reina-067288113` (334:7411) | — | — |
| María Reina | Marketing Data Analyst, Email Marketing | — | LinkedIn | 341:7426 y 341:7427: Behance de Jhoarling y de Natalia (plantilla copiada) |
| Victor Veliz | Full Stack Development Lead | LinkedIn `linkedin.com/in/victor-miguel-veliz-castellanos-09807522a` (341:7422) | GitHub | 341:7421 `https://github.com/` (raíz, sin usuario) |
| Maicol Durán | Senior UX/UI designer | — | Behance, Dribbble, LinkedIn | 341:7431 `https://github.com/` (raíz) y 341:7432 LinkedIn de Victor (copiado) |
| Daniel Rivera | Full Stack Development Lead | — (sin nodo) | GitHub, LinkedIn | — |

### FAQ (`faq`)
- **Real** (COPY-FINAL): las 18 preguntas y respuestas de Figma `328:7312` (`design/copy/faq.md`).

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `content.items[2].answer` | PUNTO A CONFIRMAR: "Más de 500 clientes… más de 200 proyectos… más de 6 años" choca con stats ("+250 proyectos", "+9 años de experiencia senior combinada") y testimonios ("56+ clientes"). Hay que unificar las cifras | cifra | Estudio |
| P3 | `content.items[14].answer` | PUNTO A CONFIRMAR: "Wetransfer" figura como método de pago, pero WeTransfer es un servicio de envío de archivos (¿Wise?). "EEUU" corregido a "EE. UU." (COPY-SPELLING) | copy | Estudio |

### Contacto (`contacto`)
| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `content.endpoint` | PENDIENTE: no hay backend. Sin endpoint, el formulario valida y avisa de que no envía. Al definirlo: POST JSON `{ name, company, email, message }` | endpoint | Desarrollo |
| P1 | `content.legal[]` | PUNTO A CONFIRMAR: Terms y Privacy Policy apuntan a `example.com` (Figma 174:89); el texto está en inglés | copy + página | Estudio |
| P1 | `headingContent.title` | "Let's talk." en inglés (Figma) | copy | Estudio |

## Chrome del sitio y SEO (`src/content/site.ts`, `astro.config.mjs`, `/links`)

| Prioridad | Dónde | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P1 | `astro.config.mjs` · `site` | RESUELTO: dominio `https://bysensei.com` confirmado (2026-10-15) | dato | Estudio + Desarrollo |
| P2 | `site.ts` · `studioSocials` | PENDIENTE (FOOTER-LINKS-REAL): URLs de Instagram, LinkedIn y Behance del estudio. Los textos son los de Figma 174:45-174:47, pero 174:27 no lleva hiperenlaces y el archivo solo tiene perfiles del equipo. Al añadir `url`, el footer las enlaza (pestaña nueva, `rel="noopener noreferrer"`) y alimentan `meta.sameAs` del JSON-LD | dato | Estudio |
| P3 | `site.ts` · `meta.areaServed` | PUNTO A CONFIRMAR: "Latinoamérica" y "Países de habla inglesa", deducido de la FAQ | dato | Estudio |
| P3 | `site.ts` · `meta.logo` | RESUELTO (SEO-OG-FAVICON): PNG cuadrado 512 px sobre negro (`src/assets/brand/logo-square.png`) | imagen | Diseño |
| P1 | `site.ts` · `whatsappHref` | PENDIENTE: número del estudio (formato `https://wa.me/34600000000`) | dato | Estudio |
| P1 | `site.ts` · `quote.endpoint` | PENDIENTE: destino del modal de cotización (POST multipart con adjunto) | endpoint | Desarrollo |
| P1 | `site.ts` · `advice.endpoint` | PENDIENTE: destino del modal de asesoría (POST multipart `stage`, `message`, `name`, `email`) | endpoint | Desarrollo |
| — | `site.ts` · `studioEmail` | RESUELTO (CONTACT-EMAIL-IMAGE): `hola@bysensei.com`; destinatario del `mailto:` del modal de asesoría y de los avisos de envío no disponible (contacto, cotización, asesoría) | dato | Estudio |
| P3 | `site.ts` · `footer.gallery` | PUNTO A CONFIRMAR: la rueda usa el grupo "SOLO PARA SLIDERS DEL FOOTER" (331:7342 → 334:7351), pero 331:7344 y 331:7346 (Aloa) son idénticas. La rueda necesita 6 tarjetas: Aloa sale dos veces, en lados opuestos del anillo. Si había otra pieza prevista, falta en Figma | imagen | Estudio |
| P2 | `site.ts` · `footer.studio.legal` | PENDIENTE: "Términos y condiciones" y "Políticas de Privacidad" (Figma 174:56, 174:58) no tienen página; se pintan como texto. Copy del footer resuelto con 174:27 (FOOTER-LINKS-REAL): descripción en español y "Trabajos" con los cuatro casos reales enlazados a su página | página | Estudio |
| P2 | `/links` · guía | PENDIENTE: el PDF "7 claves para una web que convierte" no existe (`public/guias/7-claves-web-que-convierte.pdf`) | documento | Estudio |
| P2 | `/links` · "Privacidad" | PENDIENTE: no hay página de privacidad; se pinta como texto | página | Estudio |
| P3 | `public/og-image.jpg` | RESUELTO (SEO-OG-FAVICON): pieza 41:464 exportada a 1200×630 (18 KB). Pendiente: favicon vectorial cuando Diseño entregue la "S" en vector (224:316 es bitmap) | imagen | Diseño |

## Proyectos: Yupa (`src/content/data/projects/yupa.json`, Figma flzA0qnj6JdalFCgyB2PdI 243:21)

- **Real**: todo el copy, la paleta, las cifras de resultados, el proceso, el alcance, la imagen de cierre (app de Yupa), la portada (web en portátil, Figma 311:28) y las dos piezas de la solución (teléfono 249:16559 y pantallas de compra 267:1738, nodos sueltos del lienzo superpuestos en Figma).

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P2 | `project-results.content.note` | HUECO: falta la nota metodológica (origen y periodo de +29 %, −20 % y −85 %) | cifra | Cliente del caso |
| P3 | `project-solution.content.identity.overline` | PUNTO A CONFIRMAR: Figma dice "ORIGEN / SISTEMA DE MARCA" (plantilla); se usa "Yupa / Sistema de marca" | copy | Estudio |
| P3 | `project-results.headingContent.title` | PUNTO A CONFIRMAR: 243:73 trae una 3.ª línea oculta ("Un negocio mejor conectado."); se omite | copy | Estudio |
| P3 | `project-results.headingContent.description` | PUNTO A CONFIRMAR: "…convertir mejor y liberar conversiones en compras" parece incompleta | copy | Estudio |
| — | correcciones hechas | "-85%" → "−85%"; "SEMANAS 1" → "Semana 1"; se quitó el marco redondeado horneado en la imagen de cierre | — | — |

## Proyectos: Remittven (`src/content/data/projects/remittven.json`, Figma flzA0qnj6JdalFCgyB2PdI 254:604)

- **Real**: copy, logo, paleta, cifras, web en portátil (portada, Figma 308:28, y cierre) y tres bloques de solución: pantallas de la app (254:986), cinco pantallas del envío (261:82, superpuesto en Figma) y tres páginas de la web (291:1320).

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P2 | `project-results.content.note` | HUECO: falta la nota metodológica de −43 %, −45 % y −35 % | cifra | Cliente del caso |
| P2 | `project-process.content.stages[].deliverable` | HUECO: Figma (254:775) no trae entregable por etapa; se omite | copy | Estudio |
| P3 | `project-hero.content.logo` | PUNTO A CONFIRMAR: el logo solo existe como PNG de 191×38 px (suave en retina); conviene SVG o PNG @2x/@3x | imagen | Cliente del caso |
| P3 | `project-hero.content.claim[1]` | RESUELTO (COPY-SPELLING): "Seguro y rápido." lleva punto final como la línea anterior | copy | Estudio |
| P3 | `project-results.headingContent.title` | PUNTO A CONFIRMAR: 3.ª línea oculta de plantilla en 254:656; se omite | copy | Estudio |
| P3 | `project-solution.content.identity.overline` | PUNTO A CONFIRMAR: "ORIGEN / SISTEMA DE MARCA" en Figma; se usa "Remittven / Sistema de marca" | copy | Estudio |
| P3 | `project-solution.content.identity.concept` | PUNTO A CONFIRMAR: "Un sistema visual juguetón, legible y modular." es texto de plantilla y contradice "Un sistema visual sobrio…" | copy | Estudio |
| P3 | `project-process.content.stages[2]` | PUNTO A CONFIRMAR: la etapa "Construir" describe pruebas de usabilidad (254:801) | copy | Estudio |
| P3 | `project-process.content.flow.overline` | PUNTO A CONFIRMAR: "Flujo de recompensas" viene de la plantilla de Yupa; el flujo es de seguimiento del envío | copy | Estudio |
| P3 | `project-scope.content.tools.items[2].description` | PUNTO A CONFIRMAR: bajo Maze Figma solo dice "Maze" (254:888); falta el uso | copy | Estudio |
| — | correcciones hechas | "SEMANAS 1" → "Semana 1"; "tiempo rea" → "tiempo real" | — | — |

## Proyectos: Las Doñas (`src/content/data/projects/las-donas.json`, Figma flzA0qnj6JdalFCgyB2PdI 267:1745)

- **Real**: copy, sello, paleta, cifras, proceso, alcance, foto de cierre (florista con el delantal de la marca), portada (inicio de sesión en portátil, Figma 304:480) y tres bloques de solución: login en portátil (267:2506), pantallas móviles (267:3248) y páginas de la web (277:8186 sobre 267:6142), todos superpuestos en Figma.

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P2 | `project-results.content.metrics[0..1].description` | PUNTO A CONFIRMAR: las descripciones de "Abandono en el carrito" y "Tiempo para elegir un arreglo" son textos de Remittven (267:1808, 267:1814) y no describen esas cifras | copy | Estudio |
| P2 | `project-results.content.note` | HUECO: falta la nota metodológica de −30 %, −50 % y +18 % | cifra | Cliente del caso |
| P2 | `project-results.headingContent.title` | PUNTO A CONFIRMAR: la 2.ª línea queda incompleta ("Más regalos que llegan a") | copy | Estudio |
| P3 | `project-solution.content.identity.overline` | PUNTO A CONFIRMAR: "ORIGEN / SISTEMA DE MARCA" en Figma; se usa "Las Doñas / Sistema de marca" | copy | Estudio |
| P3 | `project-solution.content.identity.year` | PUNTO A CONFIRMAR: la lámina dice "2025" y el proyecto es de 2026 | dato | Estudio |
| P3 | `project-process.content.stages[3].weeks` | PUNTO A CONFIRMAR: "Semana 8" con una duración de 7 semanas y sin semana 7 | dato | Estudio |
| P3 | `project-scope.content.tools.items[1..2].description` | PUNTO A CONFIRMAR: bajo Hotjar y Analytics Figma solo repite el nombre; falta el uso | copy | Estudio |
| — | correcciones hechas | "Las doñas" → "Las Doñas"; semanas normalizadas ("Semanas 1–2", "Semanas 3–5", "Semana 6"); puntos finales en 267:1918 y 267:1930; "instante.." → "."; se recortó el texto horneado ("EJEMPLOS TERRITOR…") de la foto de cierre | — | — |

## Proyectos: Cappi Xtremo (`src/content/data/projects/cappi-xtremo.json`, Figma flzA0qnj6JdalFCgyB2PdI 267:2146)

- **Real**: copy del hero, resultados, contexto, solución, proceso y alcance; logo, paleta, cifras, portada (portal de familias en portátil, Figma 320:576) y cuatro piezas de la solución, todas nodos sueltos superpuestos en Figma: web de venta (268:7397) junto a la lámina, y portal (inicio 268:7400, pagos 268:7402) y backoffice (268:7403) a todo el ancho.

| Prioridad | Campo | Estado / qué falta | Tipo | Quién |
|---|---|---|---|---|
| P2 | `project-conclusion` (título, descripción) | PLACEHOLDER: en Figma (267:2463) el bloque es el de Remittven ("En fintech, el diseño no adorna…", "Remittven confirmó…"). Se escribió un aprendizaje provisional con el copy del propio caso; hay que validarlo | copy | Estudio |
| P2 | `project-conclusion.content.image` | PLACEHOLDER: Figma trae la foto de Remittven (portátil). Se usa un recorte 3:2 de la portada de la web de Cappi (268:7397, 1177 px: algo suave en retina). Falta una foto real del campamento | imagen | Cliente del caso |
| P2 | `project-results.content.note` | HUECO: falta la nota metodológica de −80 %, −90 % y 95 % | cifra | Cliente del caso |
| P3 | `project-context.content.description` | PUNTO A CONFIRMAR: el 2.º párrafo de Figma (267:2267) repite el 1.º palabra por palabra; se omite | copy | Estudio |
| P3 | `project-solution.content.media` | PUNTO A CONFIRMAR: la rejilla 2×2 de Figma repite la pantalla de pagos (268:7402 = 268:7404). Se publican las tres piezas distintas, una por bloque, para que se lean en mobile | imagen | Estudio |
| P3 | `project-hero.content.logo` | PUNTO A CONFIRMAR: el logo solo existe como PNG de 142×67 px (suave en retina); conviene SVG o PNG @3x | imagen | Cliente del caso |
| P3 | `project-solution.content.identity.overline` | PUNTO A CONFIRMAR: "ORIGEN / SISTEMA DE MARCA" en Figma; se usa "Cappi / Sistema de marca" | copy | Estudio |
| P3 | `project-solution.content.identity.year` | PUNTO A CONFIRMAR: la lámina dice "2025" y el proyecto es de 2026 | dato | Estudio |
| P3 | `project-process.content.flow.overline` | PUNTO A CONFIRMAR: "Flujo de recompensas" viene de la plantilla de Yupa; el flujo es de verificación de pagos | copy | Estudio |
| P3 | `project-scope.content.tools.items[2..3].description` | PUNTO A CONFIRMAR: bajo Claude y GitHub Figma solo repite el nombre; falta el uso | copy | Estudio |
| — | correcciones hechas | "SEMANAS 1" → "Semana 1"; espacios iniciales en 267:2246, 267:2350, 267:2356, 267:2368, 267:2433 y " Laravel + PHP"; bordes redondeados horneados (gris) recortados de la portada | — | — |
