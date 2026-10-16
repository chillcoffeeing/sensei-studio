# impl PRJ-CLOSING: Detalle de proyecto, Cierre, siguiente proyecto y contacto

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`. Pedí `get_design_context` de 216:3224 (padre: conclusión 216:3225 +
siguiente 216:3233 + contacto 216:3249) y de 216:3249 por separado, los dos con screenshot. Llegaron completos,
con todos los hijos: 216:3249 sí trae estructura por `get_design_context`, así que no hizo falta `get_screenshot`.
Los assets se descargaron del nodo y se usan tal cual: foto de detalle textil, foto de Atlas y 3 flechas
`arrow-up-right` (30 ink, 18 ink, 18 blanca).

## Archivos

- `src/modules/project/schema.ts`: tipos nuevos `ProjectConclusion`, `ProjectNext`, `ProjectContactAction`, `ProjectContact` y `ProjectClosing`; se añaden `Project.closing` y `ProjectAnchors.conclusion|next|contact`.
- `src/modules/project/index.ts`: exporta los tipos nuevos.
- `src/modules/project/Section.astro`: monta Conclusión → Siguiente proyecto → Contacto después de Alcance (orden de 216:2836).
- `src/modules/project/ProjectConclusion.astro`: nuevo. Sección 216:3225: coloca la foto y el aprendizaje, más el reveal (props: `id`, `conclusion`).
- `src/modules/project/ConclusionLesson.astro`: nuevo. 216:3227: etiqueta, h2 y descripción (props: `headingId`, `label`, `title`, `description`).
- `src/modules/project/ProjectNext.astro`: nuevo. Sección 216:3233: etiqueta y tarjeta (props: `id`, `next`).
- `src/modules/project/NextProjectCard.astro`: nuevo. 216:3239: la tarjeta entera es un enlace (props: `next`).
- `src/modules/project/ProjectContact.astro`: nuevo. Sección 216:3249 sobre tinta con ruido (props: `id`, `contact`).
- `src/modules/project/ContactInvitation.astro`: nuevo. 216:3250: etiqueta, h2 y descripción (props: `headingId`, `label`, `title`, `description`).
- `src/modules/project/ContactOptions.astro`: nuevo. 216:3256: las dos acciones y la nota (props: `meeting`, `quote`, `note`).
- `src/modules/project/ContactMeetingLink.astro`: nuevo. 216:3257: píldora lima (props: `action`).
- `src/modules/project/ContactQuoteLink.astro`: nuevo. 216:3260: píldora con borde, que dispara la cotización (props: `action`).
- `src/content/projects/origen.ts`: anclas `aprendizajes`, `siguiente-proyecto` y `contacto`; bloque `closing` con el copy de Figma.
- `src/content/projects.ts`: resuelve `closing.next.href` a `/proyectos/<projectId>/` cuando ese proyecto existe. `projectPath` ahora acepta `Pick<Project, 'id'>`, que sigue siendo compatible.
- `src/assets/project/origen-tee-detail.jpg`, `atlas-cover.jpg`, `arrow-up-right-lg.svg`, `arrow-up-right-ink.svg`, `arrow-up-right-paper.svg`: assets de Figma, sin modificar.
- `src/styles/tokens.css`: 2 roles de texto (ver abajo).
- `docs/design-system.md`: se añaden los 2 roles a la lista. `docs/components.md`: fila nueva en "Fuera de la librería".
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

## Tokens agregados

- `--text-project-next`: clamp(48px → 72px), lh 1, peso 400. Viene de "Atlas." (216:3244, 72px Regular). Ningún rol existente es de 72px Regular: `text-project-name` es 600 y llega a 146px.
- `--text-project-contact`: clamp(36px → 70px), lh 1.08, peso 500. Viene del h2 del contacto (216:3254, 70px Medium). El más cercano, `text-project-mock-title`, llega a 65px con lh 1.02.

El resto es reutilizado: `ProjectSectionLabel`, `text-project-title`, `text-body-lg`, `text-caption`, `text-link`,
`text-button`, `bg-origen-bone` y `bg-origen-sand` (los colores de Figma, ya como tokens), `ink`, `paper`, `line`
(#B8B8B8), `brand`, `glass`, `surface-noise`, `rounded-panel`, `rounded-pill`, `container-page`, `reveal-up` +
`revealAll` y `--duration-image|base|fast` + `ease-standard`. Nativas: `bg-neutral-100`, `aspect-3/2`,
`aspect-video` y `scale-105`.

## Decisión: enlace al siguiente proyecto (Atlas)

Hoy no existe `content/projects/atlas.ts`. Crear su contenido mínimo obligaría a inventar un caso completo, porque
`Project` exige portada, resultados, contexto, etc. y la ruta los pinta todos. Lo que hice:

- `next` se modela en el contenido con `projectId: 'atlas'` y un `href` de respaldo, `/#proyectos` (la galería de
  la landing, la misma ruta válida que usa "Todos los proyectos" de la portada).
- `content/projects.ts` cambia ese `href` por `/proyectos/atlas/` en cuanto exista `atlas.ts`. No hace falta tocar
  ni el módulo ni `origen.ts`.
- El módulo no sabe nada de rutas: recibe `next.href` ya resuelto, así que se respetan las fronteras de `check:arch`.
- Limitación: hasta que exista Atlas, la tarjeta dice "Explorar caso" y lleva a la galería.

## Contacto: no se reutiliza la sección de la landing

El contacto de la landing (`modules/contact`) es un formulario en una card glass sobre foto. Este bloque son dos
acciones y una nota, sin formulario, así que no coincide y tiene componentes propios en el módulo. Tampoco encaja
`LinkCtaBrand` (píldora de 193px + círculo de 40px) ni `ButtonBrand`.

- **Enganche para QTE-MODAL**: "Solicita una cotización" es `<a href="/#contacto" data-quote-open>`. Funciona sin
  JS (lleva al formulario de la landing) y no es un botón muerto. QTE-MODAL solo tiene que delegar los clics en
  `[data-quote-open]`: `preventDefault()`, abrir el diálogo y devolver el foco al disparador al cerrar. Está
  documentado en `schema.ts` (`ProjectContact.quote`) y en el comentario de `ContactQuoteLink.astro`.
- "Agenda una reunión" apunta a `/#contacto`, el mismo destino que el CTA del header (`site.ts`).

## Desviaciones de Figma (y motivo)

- **h2 de la conclusión**: `text-project-title` (30 → 52px) en vez de 44px. Es el mismo rol que los demás h2 de la vista. Va como una sola cadena con `text-balance` en vez de 3 líneas fijas: a 1440 quedan 4 líneas equilibradas y en mobile no se fuerzan cortes.
- **Pie de la tarjeta**: "Explorar caso" a 16px (`text-link`) en vez de 15px. La categoría usa `text-caption` (12px), como en Figma.
- **Píldoras de contacto**: las dos tienen el mismo ancho (252px desde sm; ancho completo en mobile) y un alto mínimo de 48px. En Figma la de cotización es más estrecha que la de reunión; igualarlas ordena la columna y da un área táctil cómoda.
- **Separación entre píldoras**: 12px en vez de los 18px del grupo. La nota queda a 18px.
- **Hover**: la foto de la tarjeta crece al 105% y las flechas avanzan en diagonal (solo con `motion-safe`). La píldora de cotización toma fondo `glass` en hover. Figma no diseña hover.
- **Foco**: anillo `ink` en la tarjeta, `brand` en reunión y `paper` en cotización.
- **Semántica**:
  - cada bloque es una `<section>`;
  - conclusión y contacto se nombran con su h2 (`aria-labelledby`);
  - "Siguiente proyecto" se nombra con `aria-label` = la etiqueta (copy del contenido), y el nombre del proyecto ("Atlas.") es su h2, dentro del enlace;
  - la foto de Atlas tiene `alt=""` porque el texto del enlace ya la nombra; la del detalle textil tiene alt descriptivo;
  - las flechas son decorativas.
- **Motion añadido**: foto y texto de la conclusión, la tarjeta, la invitación y las acciones entran con `reveal-up` escalonado, una vez, con el script acotado a cada sección. Con reduced motion o sin JS se ven en su estado final.

## Responsive inferido

- **375**: todo apilado.
  - Conclusión: foto 3:2 y luego el texto.
  - Tarjeta: foto 16:9 arriba e información debajo (p-6).
  - Contacto: invitación → píldoras a todo el ancho → nota. El h2 baja a 36px.
- **768 (sm+)**: las píldoras pasan a 252px; el resto igual que en mobile.
- **1024 (lg+)**:
  - conclusión en fila (foto a 2/5, gap 64; 80 desde xl);
  - tarjeta en fila (foto a 7/12, alto mínimo 340, p-9);
  - contacto todavía apilado: el h2 de unos 57px no cabe junto a una columna de 295px sin partir líneas.
- **1280 (xl+)**: contacto en fila (acciones a la derecha, 295px, gap 80), como en Figma.
- **Verificación**: Chrome headless con perfil temporal propio en el scratchpad, reduced motion forzado, iframe al ancho exacto y build servido con `http.server` en una tarea de fondo detenida por su id. Revisado a 375, 768, 1024 y 1440: sin desbordes. A 1440 coincide con la captura de Figma salvo las desviaciones anotadas.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
