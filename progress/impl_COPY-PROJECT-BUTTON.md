# impl COPY-PROJECT-BUTTON — botón de ProjectCard: "Ver proyecto"

## Archivos
- `src/content/pages/home.ts`: `PLACEHOLDER_PROJECT_LINK.label` "Detalles del proyecto" → "Ver proyecto" (lo usan todos los proyectos; desktop y mobile comparten el mismo ProjectCard/LinkButtonPaper).
- `src/modules/project-gallery/schema.ts`: comentario JSDoc actualizado al texto nuevo.
- `docs/components.md`: mención al texto del botón actualizada.
- `feature_list.json`: estado → `in_progress`.

## Accesibilidad
- `LinkButtonPaper` no tiene `aria-label`; el texto accesible es el propio label, así que no hay texto viejo repetido. Hoy no identifica el proyecto (no lo hacía antes), se mantiene igual.
- `design/copy/` no cita este texto: sin cambios.
- `/componentes` toma el label de `projects[0].details.link`, así que también muestra "Ver proyecto".

## Tokens
Ninguno.

## Responsive
Sin cambios (solo copy; el texto es más corto).

## init.ps1
VERDE: todo en orden (astro build OK).
