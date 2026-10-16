# Arquitectura — monolito modular

Un solo deploy (Astro: páginas prerenderizadas; el adaptador node se mantiene por si el formulario de contacto necesita un endpoint), organizado en **capas** y **módulos**
con fronteras que se verifican automáticamente (`pnpm check:arch`).

## Capas

```
src/
├── assets/        astro:assets: images/<uso>/ = fotos y capturas (docs/content-model.md, regla 10); <módulo>/ = SVG de interfaz
├── styles/        tokens.css (sistema de diseño) + global.css
├── shared/        ui/ = librería de componentes (ver docs/components.md) y lib/ (media.ts, tone-text.ts, accordion.ts, motion/, slider/)
├── core/          modelo de contenido (content.ts: PageDoc, SectionDoc, Seo, Heading, MediaRef + esquemas zod base), site.ts y seo.ts
├── modules/       UN módulo por tipo de sección (hero, faq, services…)
├── layout/        chrome compartido: BaseLayout, Header, Footer, Seo head
├── app/           composición: SECTION_TYPES, unión Section y esquema de PageDoc, plantillas, registry y SectionRenderer
├── content/       datos: data/pages/*.json (un PageDoc por página) + loaders (pages.ts valida y deriva) + site.ts (chrome)
└── pages/         rutas de Astro (finas: cargan una Page y la renderizan)
```

### Qué puede importar cada capa

| Capa | Puede importar |
|---|---|
| `assets` | — |
| `styles` | — (solo CSS) |
| `shared` | `assets` |
| `core` | `shared`, `assets` |
| `modules/<x>` | su propio módulo, `core`, `shared`, `assets` |
| `layout` | `core`, `shared`, `assets` |
| `app` | `modules/<x>` (**solo vía `index.ts`**), `layout`, `core`, `shared`, `assets` |
| `content` | `app` (esquemas, plantillas y tipos), `core`, `assets` |
| `pages` | `app`, `content`, `layout`, `core`, `shared` |

Prohibido:
- que un módulo importe otro módulo;
- que `modules` y `layout` se importen entre sí;
- que cualquier capa importe una capa superior.

Dependencias npm con puerta: `motion` (y `motion-dom`/`motion-utils`) solo se importa en
`src/shared/lib/motion/`; el resto de capas usa su API (`@/shared/lib/motion`). `react`,
`react-dom`, `framer-motion` y `motion/react` están prohibidos. Se revisan también los
`<script>` de los `.astro`.

Todo esto lo revisa `scripts/check-architecture.mjs`.

### Consumo de la librería (`shared/ui`)

`modules/` y `layout/` **no** reproducen marcado de la librería: usan sus componentes
(`docs/components.md`). Un módulo solo coloca (contenedores, rejillas, anchos, `sizes`) y
traduce sus datos al contrato del componente (p. ej. FAQ: `question/answer` → `title/body`).

`check:arch` detecta los duplicados obvios: cada `class="…"` de un componente de `shared/ui`
con 4+ clases y alguna de aspecto (`bg-`, `text-`, `rounded-`, `border`, `shadow-`, `font-`)
es una firma; si una cadena de `modules/` o `layout/` (atributo `class`, `class:list` o
constante) contiene **todas** las clases de una firma, falla con
`replica el marcado de shared/ui/<Componente>`. El anillo de foco (`focus-visible:*`) no cuenta
porque se compone con constantes. Si un patrón nuevo se repite, se sube primero a la librería.

## Anatomía de un módulo

```
src/modules/<type>/
├── schema.ts        esquemas zod de headingContent y content + <type>SectionSchema = sectionSchema('<type>', …); tipos con z.infer
├── Section.astro    render (recibe la sección completa como prop `section`)
├── *.svelte         islas, SOLO si hay interacción real
└── index.ts         API pública: export { default as Section } + export type { <Type>Section }
```

Nombre del módulo = valor de `type` en kebab-case (`project-gallery`).

## Modelo de contenido

El contrato página ↔ secciones ↔ CMS vive en **`docs/content-model.md`** (manda sobre este
documento). Resumen: una página es un `PageDoc { slug, seo, sections[] }` en JSON puro
(`src/content/data/pages/*.json`); cada sección declara su `sectionType` (enum cerrado,
`SECTION_TYPES` en `app/sections.ts`), una `headingContent` (cabecera: eyebrow, title, description)
y su `content`. Cada módulo exporta el esquema zod (`astro/zod`) de su sección; `app/sections.ts`
arma la unión discriminada y el esquema de la página; `content/pages.ts` valida en build (un dato
inválido rompe el build con archivo, ruta y campo) y deriva lo que no se escribe a mano (tarjetas de
proyecto). Los medios son cadenas (`MediaRef.src`) que resuelve `shared/lib/media.ts`.

```ts
// app/registry.ts — si falta un sectionType, falla en compilación
export const registry = { hero: Hero, faq: Faq, … } satisfies SectionRegistry;
```

### Agregar un tipo de sección nuevo

1. Crear `src/modules/<type>/` con `schema.ts` (esquema zod), `Section.astro` e `index.ts`.
2. Agregarlo a `SECTION_TYPES` y a la unión en `app/sections.ts`, al `registry` y a la plantilla
   que corresponda (`app/templates.ts`).
3. Usarlo en `src/content/data/pages/*.json`.
4. `pnpm check:arch` actualiza el mapa de abajo.

### Casos de estudio (`/proyectos/<slug>/`)

Un proyecto es un `PageDoc` más (`src/content/data/projects/<slug>.json`, plantilla `case-study`)
y se pinta con el mismo `SectionRenderer` que la home (`pages/proyectos/[slug].astro`). Cada
sección es un módulo genérico `project-*` (hero, results, context, solution, process, scope,
conclusion, next, contact): un proyecto nuevo no crea componentes. `content/projects.ts` carga y
valida los JSON, inyecta el microcopy común (`content/case-study.ts`) y deriva las tarjetas de
"Siguiente proyecto", de `/links` y de la galería de la home (`projectCard(slug)`) a partir del
hero (y de `project-results`, para las métricas) del proyecto destino; la galería las monta en
`content/pages.ts` a partir de los slugs de su JSON.
La ruta y el sitemap salen de `projects`.
El índice `/proyectos/` es una `Page` más (`content/data/pages/proyectos.json`, módulo `project-index`,
servido por `pages/[...slug].astro`): misma derivación de tarjetas que la galería y la misma rejilla, a 2 columnas ya desde md (impar: la primera a todo el ancho).

### Módulo de vista: `links` (bio de Instagram, `/links`)

`/links` no es una `Page` de secciones sino una vista fija (frame 230:977,
diseño móvil de 406px). `modules/links/schema.ts` exporta `Links` (un campo por bloque) y su
`Section.astro` coloca los bloques en el orden del frame dentro de una columna (`max-w-md` desde
sm). `content/links.ts` arma los datos (servicios y destinos de cotización/WhatsApp salen de
`content/site.ts`; la tarjeta del caso destacado, de `projectCard()` en `content/projects.ts`) y `pages/links.astro` lo pinta vía
`app/links.ts` (`LinksView`, `Links`). Va en el sitemap como ruta propia.

Usa `layout/StandaloneLayout.astro`: mismo `<head>` que `BaseLayout` (`layout/DocumentHead.astro`)
y el modal de cotización, pero **sin** header, barra flotante ni footer del sitio. Es una landing de
bio: su cabecera ya trae logo, "Cotizar proyecto" y WhatsApp, y su pie mínimo; el chrome global
duplicaría esos CTA en una pantalla de móvil.

### Barra flotante (`data-floating-bar-avoid`, `data-advice-open`)

`layout/FloatingBar.svelte` (NAV-FLOATING-V2, montada en `BaseLayout`) va **fija abajo y centrada**
en todo el sitio (`bottom-(--floating-bar-bottom)`, que suma `env(safe-area-inset-bottom)`). No
importa ningún módulo. Contrato:

- **Zonas protegidas**: todo elemento con el atributo neutro `data-floating-bar-avoid` aparta la
  barra (baja y se desvanece, queda `inert`) mientras ocupa el 25 % inferior del viewport. Hoy lo
  llevan `modules/contact/Section.astro` (formulario de la landing),
  `modules/project-contact/Section.astro` (CTA final del caso) y `layout/Footer.astro`. Por eso no
  hace falta reservar hueco al pie de la página.
- **Acciones**: "Cotizar proyecto" lleva `data-quote-open` (modal de cotización, abajo).
  "Solicitar asesoría" lleva `data-advice-open` (modal de asesoría, abajo). Sin JS, el `href`
  lleva a `/#contacto`. WhatsApp es un
  enlace externo (`target="_blank"`, `rel="noopener noreferrer"`).
- Sin JS: visible y fija abajo (los estados ocultos solo existen con la variante `scripting:`).

### Modales (`layout/dialog/`)

Los dos modales del sitio comparten la misma infraestructura: `layout/dialog/ModalDialog.svelte`
pone el `<dialog>` nativo, un solo listener delegado en `document` para su atributo disparador
(`trigger="data-quote-open"` / `"data-advice-open"`; respeta los clics con modificadores), el ciclo
del Tab, el cierre (botón, Esc y backdrop) y la vuelta del foco al disparador (o al botón del menú
mobile si el disparador estaba en el panel). El contenido llega por snippet, que recibe `close`.
Desde `sm` el diálogo es una tarjeta centrada con el alto de su contenido (`h-fit`, tope
`--dialog-max-h` y scroll interno). En mobile, prop `mobile`: `full` (predeterminada, asesoría a
pantalla completa) o `card` (cotización: tarjeta centrada con alto natural y tope `--dialog-max-h-compact`).
`dialog/dialog-form.ts` tiene el envío común (`submitFormData`: sin endpoint responde
`'unavailable'` sin tocar la red) y la simulación por URL; `dialog/dialog-data.ts` serializa los
iconos para la isla. Cada modal tiene su lógica (`quote-form.ts`, `advice-form.ts`) y sus bloques.

### Modal de asesoría (`data-advice-open`)

`layout/advice/AdviceDialog.svelte` (ADV-MODAL, Figma 272:8117) es **una** isla montada en
`BaseLayout` (`client:idle`). Lo abre cualquier enlace con `data-advice-open`; su `href` es el
destino sin JS (`/#contacto`). Hoy lo llevan "Solicitar asesoría" de la barra flotante, "Agenda una
reunión" del header (`opensAdvice` en `content/site.ts`, también en el menú mobile) y
`modules/project-contact/ContactMeetingLink.astro` ("Agenda una reunión" del cierre de cada caso).
Ningún módulo importa el modal. `/links` (`StandaloneLayout`) no lo monta: no tiene disparadores.
El envío pasa por `submitAdvice` (`layout/advice/advice-form.ts`): destino `site.advice.endpoint`
(PENDIENTE), POST multipart `stage`, `message`, `name`, `email`; simulación con
`?asesoria-simulada=sent|error|unavailable`.

### Modal de cotización (`data-quote-open`)

`layout/quote/QuoteDialog.svelte` (QTE-MODAL) es **una** isla montada en `BaseLayout` y `StandaloneLayout` (`client:idle`)
con un `<dialog>` nativo. Contrato, igual que el del hero: cualquier enlace con el atributo neutro
`data-quote-open` lo abre (un solo listener delegado en `document`), y su `href` es el destino sin JS
(`/#contacto`). El disparador puede ser también un `<button type="submit">` de un formulario cuyo
`action` es ese destino (la mini cotización de `/links`): el listener cancela el envío al abrir.

Hoy lo llevan "Cotizar proyecto" de la barra flotante, el "Cotización" del nav (`opensQuote` en
`content/site.ts`, también en el menú mobile), `modules/project-contact/ContactQuoteLink.astro` y, en
`/links`, "Cotizar proyecto" (`LinksHeader`) y "Continuar cotización" (`LinksQuoteSelector`). Ningún
módulo importa el modal. `showModal()` lo pone en la capa superior del navegador: queda sobre header,
barra flotante y menú sin z-index, y el resto de la página queda inerte. Al cerrar, el foco vuelve
al disparador. El bloqueo de scroll es CSS (`html:has(dialog:modal)` en `global.css`). El envío pasa
por una sola función, `submitQuote` (`layout/quote/quote-form.ts`): su destino es
`site.quote.endpoint` (PENDIENTE) y se puede simular con `?cotizacion-simulada=sent|error|unavailable`.

**Preselección (`data-quote-services`)**: si el disparador lleva `data-quote-services="branding ux-ui"`
(valores de `site.quote.services.options` separados por espacios), el modal abre con **exactamente**
esos servicios marcados (`presetServices` en `layout/quote/quote-form.ts` descarta los que no
existen). Con el atributo vacío abre sin ninguno; sin el atributo no toca la selección. Lo usa
`modules/links/LinksQuoteSelector.svelte`, que solo escribe el atributo: ningún módulo importa el
modal.

## Islas Svelte

- Svelte 5 (runes). Hidratación `client:visible` por defecto y `client:load` solo si
  está above-the-fold y es interactivo desde el inicio.
- Una isla recibe datos **serializables** (nada de componentes Astro ni funciones).
- Lo que se pueda resolver con CSS (marquee, hover) se hace sin isla.
- Una isla de módulo compone componentes de `shared/ui` (p. ej. `ContactForm.svelte` usa
  `InputGlass`, `FieldError`, `ButtonInk`…): pone el estado, no el aspecto. Si la isla entera
  es un componente de la librería (`AccordionCards`), el módulo la hidrata directamente.

## Mapa de módulos (generado — no editar a mano)

<!-- arch:map:start -->
| Módulo | Archivos | Islas Svelte | API pública |
|---|---|---|---|
| `contact` | 9 | `ContactForm.svelte`, `ContactInputField.svelte`, `ContactMessageField.svelte` | `Section`, `contactSectionSchema`, `ContactContent`, `ContactField`, `ContactFieldName`, `ContactLegalPart`, `ContactSection`, `ContactStatusMessages`, `ContactValidationMessages` |
| `faq` | 3 | — | `Section`, `faqSectionSchema`, `FaqContent`, `FaqItem`, `FaqSection` |
| `hero` | 5 | — | `Section`, `heroSectionSchema`, `HeroContent`, `HeroSection`, `HeroWordmark` |
| `links` | 17 | `LinksQuoteSelector.svelte`, `LinksServiceOption.svelte` | `Section`, `Links`, `LinksClosing`, `LinksExplore`, `LinksFooterLink`, `LinksGuide`, `LinksGuideCover`, `LinksHeader`, `LinksIconLink`, `LinksProject`, `LinksQuote`, `LinksServicesAccess`, `LinksWhatsApp` |
| `process` | 4 | — | `Section`, `processSectionSchema`, `ProcessContent`, `ProcessSection`, `ProcessStep` |
| `project-conclusion` | 4 | — | `Section`, `projectConclusionSectionSchema`, `ProjectConclusionContent`, `ProjectConclusionSection` |
| `project-contact` | 7 | — | `Section`, `projectContactSectionSchema`, `ProjectContactContent`, `ProjectContactSection`, `ProjectContactUi` |
| `project-context` | 9 | — | `Section`, `projectContextSectionSchema`, `ProjectContextContent`, `ProjectContextField`, `ProjectContextSection`, `ProjectContextUi` |
| `project-gallery` | 3 | — | `Section`, `projectGallerySectionSchema`, `ProjectGalleryContent`, `ProjectGallerySection` |
| `project-hero` | 10 | — | `Section`, `projectHeroSectionSchema`, `ProjectHeroContent`, `ProjectHeroFact`, `ProjectHeroSection`, `ProjectHeroUi` |
| `project-index` | 3 | — | `Section`, `projectIndexSectionSchema`, `ProjectIndexContent`, `ProjectIndexSection` |
| `project-next` | 4 | — | `Section`, `projectNextSectionSchema`, `ProjectNextCard`, `ProjectNextContent`, `ProjectNextSection`, `ProjectNextUi` |
| `project-process` | 8 | — | `Section`, `projectProcessSectionSchema`, `ProjectProcessContent`, `ProjectProcessFlow`, `ProjectProcessFlowStep`, `ProjectProcessSection`, `ProjectProcessStage`, `ProjectProcessUi` |
| `project-results` | 6 | — | `Section`, `projectResultsSectionSchema`, `ProjectResultsContent`, `ProjectResultsMetric`, `ProjectResultsSection`, `ProjectResultsUi` |
| `project-scope` | 9 | — | `Section`, `projectScopeSectionSchema`, `ProjectScopeContent`, `ProjectScopeDeliverable`, `ProjectScopeSection`, `ProjectScopeTool` |
| `project-solution` | 7 | — | `Section`, `projectSolutionSectionSchema`, `ProjectSolutionCaption`, `ProjectSolutionContent`, `ProjectSolutionIdentity`, `ProjectSolutionSection` |
| `services` | 8 | `ServiceBullets.svelte`, `ServiceImage.svelte`, `ServiceRow.svelte`, `ServicesAccordion.svelte` | `Section`, `servicesSectionSchema`, `ServiceItem`, `ServicesContent`, `ServicesSection` |
| `showcase` | 3 | — | `Section`, `showcaseSectionSchema`, `ShowcaseContent`, `ShowcaseSection`, `ShowcaseSlide` |
| `stats` | 4 | — | `Section`, `statsSectionSchema`, `StatItem`, `StatsContent`, `StatsSection` |
| `team` | 5 | — | `Section`, `teamSectionSchema`, `TeamContent`, `TeamMember`, `TeamProfileLabels`, `TeamSection` |
| `testimonials` | 5 | — | `Section`, `testimonialsSectionSchema`, `Testimonial`, `TestimonialsContent`, `TestimonialsSection`, `TestimonialsTrust` |
<!-- arch:map:end -->
