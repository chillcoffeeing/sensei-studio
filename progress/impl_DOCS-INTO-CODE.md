# impl DOCS-INTO-CODE — la documentación de detalle pasa al código

Solo comentarios y JSDoc: ni marcado, ni clases, ni tipos, ni lógica. Comprobado con
`git diff -U0 -- src`: todas las líneas cambiadas son de comentario (`//`, `/** */`, `{/* */}`, `<!-- -->`).
Fuente: docs/components.md, docs/architecture.md (barra flotante y modales) y docs/conventions.md › Motion.
No se ha leído design/INVENTORY.md, design/figma/ ni design/copy/.

## Archivos modificados

### Primitivas
- `src/shared/lib/motion/index.ts`: cabecera JSDoc con las reglas de motion (solo transform/opacity, con la excepción de collapsible; reduced-motion = estado final, primitiva por primitiva; `scripting: enabled`; una sola vez; lo que se mueve se pausa y el hover no pausa; tiempos desde tokens), la forma de attachment y la API declarativa de reveal (`data-reveal`, `data-reveal-amount`, `data-reveal-margin`, `reveal-delay-*`, `head-parts:` + `data-head-part`, no anidar).
- `src/shared/lib/slider/index.ts`: cabecera con swipe (umbrales, data-drag/data-dragging, touch-pan-y), bucle continuo y por pasos, clones inertes, motivos de pausa (incluido `interaction` y `--delay-slider-resume`), bindCloneHover, tiempos y comportamiento sin JS.

### shared/ui (46 .astro/.svelte)
Todos llevan cabecera breve (qué es y cuándo usarlo); se quitaron las medidas de Figma y los ids de features de los comentarios existentes y se conservaron los *por qué*.
- `AvatarInitials.astro`: cabecera; JSDoc de `tone` (dato de posición: avatarTone del masonry).
- `AvatarStack.astro`, `RatingStars.astro`: cabecera de pieza interna de TrustBadge (lectura accesible).
- `Eyebrow.astro`, `HeadingOverline.astro`, `LegalLinks.astro`, `LinkFooter.astro`, `LinkButtonPaper.astro`, `TextLines.astro`, `ToneText.astro`, `SectionDescription.astro`, `ReviewCard.astro`, `UserPlaceholder.astro`: cabecera; comentario de cuerpo con medidas eliminado o integrado.
- `LinkMore.astro`: cabecera; JSDoc de `marker` sin nodos de Figma.
- `LinkNav.astro`: cabecera con el contrato `data-quote-open`.
- `Photo.astro`: cabecera ampliada (MediaRef, resolvePhoto, sin stock); JSDoc de `class`.
- `ProjectCard.astro` (+ `ProjectCardPill`, `ProjectCardMetric`, `ProjectCardCategory`): cabecera (colocación, `lg:project-card-wide`, piezas internas); comentario de capas condensado (can-hover, card-active, @container, data-card); JSDoc de `ProjectCardMetric.class`.
- `SectionHeader.astro`: cabecera; JSDoc de la excepción `titleClass`; contrato `data-head-part` / `head-parts:` (quitada la referencia a INVENTORY).
- `TrustBadge.astro`: cabecera con accesibilidad y colocación; bloque de medidas eliminado.
- `TeamCard.astro` (+ `TeamCardRest`, `TeamCardDetail`, `TeamCardProfiles`): cabecera (diapositiva, AA sin foto, piezas internas); capas, perfiles y ganchos `data-team-*` sin medidas ni ids de features (quitada la referencia a design/references); JSDoc de `TeamCardProfiles.class`.
- `ShowcaseCarousel.astro`, `TeamSlider.astro`, `StepperSlider.astro`: cabecera con bucle continuo / por pasos, swipe, autoplay, motivos de pausa (y que el hover no pausa; motivo `pointer` de TeamSlider), APG, riesgo residual WCAG 2.2.2 y por qué `.astro` + `<script>`.
- Svelte (`AccordionCards`, `ButtonBrand`, `ButtonCtaBrand`, `ButtonInk`, `ButtonPauseGlass`, `CtaBrandShape`, `FieldError`, `FormStatus`, `FormStatusError`, `InputGlass`, `LabelHidden`, `LabelMarker`, `LinkCtaBrand`, `LinkIconInk`, `LinkLogo`, `LinkMenu`, `TextareaGlass`): cabecera de script con uso y contrato (atributos nativos con ...rest, estado = atributo, `pressed`, `aria-disabled`); comentarios de plantilla con medidas de Figma sustituidos por el *por qué* restante. `CtaBrandShape`: reglas del hover líquido (curvas de entrada y salida, reduced-motion).

### layout
- `layout/FloatingBar.svelte`: cabecera con el contrato (acciones `data-quote-open` / `data-advice-open`, destino sin JS `/#contacto`, `data-floating-bar-avoid` y el 25 % inferior, `inert`, sin JS visible).
- `layout/dialog/ModalDialog.svelte`: cabecera (showModal, listener delegado, modificadores, disparador enlace o submit, Tab, cierre, vuelta del foco, snippet con `close`, tamaños); JSDoc de `trigger` y `mobile`.
- `layout/quote/QuoteDialog.svelte`: cabecera (dónde se monta, disparadores, destino sin JS, `data-quote-services`, endpoint pendiente, `?cotizacion-simulada`, superficie clara).
- `layout/quote/quote-form.ts`: cabecera (submitQuote único, endpoint pendiente, multipart, simulación, presetServices).
- `layout/advice/AdviceDialog.svelte`: cabecera (montaje en BaseLayout y no en /links, disparadores `data-advice-open`, destino sin JS, endpoint pendiente, `?asesoria-simulada`).
- `layout/advice/advice-form.ts`: cabecera (submitAdvice único, campos multipart, simulación).

### Referencias a lo que se borra
- `src/modules/process/Section.astro`: fuera `_archive/process-badge/`.
- `src/modules/testimonials/schema.ts`: fuera `design/copy/testimonials.md`.
- `src/shared/lib/accordion-controller.svelte.ts` y `src/styles/global.css`: apuntan a `shared/lib/motion/index.ts` en vez de a docs/conventions.md › Motion (que se va a recortar).
- `grep -rnE "_archive|INVENTORY|design/figma|design/copy|design/placeholders" src` → sin resultados.
  Quedan referencias a `docs/components.md` (catálogo, que se conserva): `content/ui-catalog.ts` (es copy de /componentes: no se toca), `pages/componentes.astro`, `layout/Header.astro`, `layout/MobileMenu.svelte`, `shared/ui/types.ts`.

## Tokens
Ninguno agregado ni eliminado.

## Responsive inferido
No aplica (sin cambios de comportamiento).

## init.ps1
VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check y astro build (9 páginas).
