# Arquitectura: monolito modular

- **Despliegue:** un solo deploy **100 % estático**, con Astro `output: 'static'` y sin adapter. `pnpm build` deja
  `dist/` listo para Apache: las reglas están en `public/.htaccess` y la 404 en `pages/404.astro`.
- **Formularios:** envían a un `endpoint` externo configurable en `content/site.ts`.
- **Fronteras:** las capas y los módulos se verifican con `pnpm check:arch` (`scripts/check-architecture.mjs`).

## Capas

```
src/
├── assets/    imágenes (astro:assets): images/<uso>/ = fotos; <módulo>/ = SVG de interfaz
├── styles/    tokens.css (sistema de diseño) + global.css (utilidades)
├── shared/    ui/ = librería (docs/components.md) · lib/ = media, motion/, slider/, accordion…
├── core/      modelo de contenido (content.ts), site.ts y seo.ts
├── modules/   un módulo por tipo de sección
├── layout/    chrome: layouts, header, footer, barra flotante, modales (dialog/, quote/, advice/)
├── app/       composición: SECTION_TYPES, esquema de PageDoc, plantillas, registry, SectionRenderer
├── content/   datos JSON (data/) + loaders que validan y derivan + site.ts
└── pages/     rutas finas: cargan una Page y la renderizan
```

| Capa | Puede importar |
|---|---|
| `assets`, `styles` | — |
| `shared` | `assets` |
| `core` | `shared`, `assets` |
| `modules/<x>` | sí mismo, `core`, `shared`, `assets` |
| `layout` | `core`, `shared`, `assets` |
| `app` | `modules/<x>` (**solo vía `index.ts`**), `layout`, `core`, `shared`, `assets` |
| `content` | `app`, `core`, `assets` |
| `pages` | `app`, `content`, `layout`, `core`, `shared` |

Prohibido:
- que un módulo importe otro;
- que `modules` y `layout` se importen entre sí;
- importar una capa superior.

`motion` solo se importa en `shared/lib/motion/`, y `react`, `framer-motion` y `motion/react` están
prohibidos. `check:arch` revisa también los `<script>` de los `.astro`, y que `modules/` y `layout/`
no repliquen el marcado de `shared/ui`: si contienen todas las clases de aspecto de un componente,
falla.

## Anatomía de un módulo

```
src/modules/<type>/          (nombre = sectionType en kebab-case)
├── schema.ts      zod de headingContent y content + <type>SectionSchema; tipos con z.infer
├── Section.astro  render (prop `section`)
├── *.svelte       islas, SOLO si hay interacción real
└── index.ts       API pública: Section + tipos
```

**Agregar un tipo de sección:**
1. Crear el módulo.
2. Añadirlo a `SECTION_TYPES` y a la unión en `app/sections.ts`, al `registry` (es exhaustivo: si
   falta, no compila) y a su plantilla en `app/templates.ts`.
3. Usarlo en el JSON.

El contrato de contenido está en `docs/content-model.md`.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` y `/proyectos/` | `PageDoc` de `content/data/pages/`, servidos por `pages/[...slug].astro` |
| `/proyectos/<slug>/` | `PageDoc` de `content/data/projects/` (plantilla `case-study`), con el mismo `SectionRenderer`. Las tarjetas de proyecto se derivan con `projectCard()` |
| `/links` | Vista fija (bio de Instagram). Usa `modules/links` y `StandaloneLayout`: mismo `<head>` y modal de cotización, sin header, barra ni footer |
| `/componentes` | Catálogo interno de la librería (noindex) |

## Chrome global (contratos por atributo)

Los módulos **no importan** el chrome: lo activan con atributos neutros. El detalle de cada contrato
está en la cabecera del archivo.

| Atributo | Efecto | Dónde |
|---|---|---|
| `data-quote-open` (+ `data-quote-services`) | Abre el modal de cotización, opcionalmente con servicios preseleccionados | `layout/quote/QuoteDialog.svelte` |
| `data-advice-open` | Abre el modal de asesoría | `layout/advice/AdviceDialog.svelte` |
| `data-floating-bar-avoid` | Aparta la barra flotante mientras ocupa el 25 % inferior del viewport | `layout/FloatingBar.svelte` |

- **Base de los modales:** comparten `layout/dialog/ModalDialog.svelte` (`<dialog>` nativo).
- **Sin JS:** el `href` de cada disparador lleva a `/#contacto`.

## Islas Svelte

- Svelte 5 con runes.
- Se hidratan con `client:visible` por defecto. `client:load` solo si la isla es above-the-fold e
  interactiva desde el inicio.
- Reciben datos serializables.
- Lo que se resuelve con CSS se hace sin isla.
- Una isla pone el estado; el aspecto lo ponen los componentes de `shared/ui`.

## Mapa de módulos (generado por `check:arch`, no editar)

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
