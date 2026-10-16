# Verify COPY-PROJECT-BUTTON — vuelta 1
Resultado: VERDE

Revisión acotada (cambio de copy), como se pidió: init.ps1, texto visible y accesible, restos del texto viejo, copy hardcodeado y alcance.

## Bloqueantes
Ninguno.

## Mayores
Ninguno.

## Menores
Ninguno.

## Verificado sin hallazgos
- [V1] `./init.ps1`: VERDE (estado, sistema de diseño, arquitectura, astro check y astro build OK). Hay 1 feature in_progress.
- Texto visible: `src/content/pages/home.ts:48` `PLACEHOLDER_PROJECT_LINK.label = 'Ver proyecto'`. Los dos proyectos (`dasProject` :57 y `vecProject` :63) usan ese link, y los 6 items de `projects` (:253) salen de ellos, así que todos los proyectos muestran "Ver proyecto".
- Desktop y mobile: `src/shared/ui/ProjectCard.astro:94` es el único render, con `<LinkButtonPaper href={project.details.link.href} label={project.details.link.label} />`. No hay una variante mobile aparte.
- Texto accesible: `LinkButtonPaper.astro` no tiene `aria-label`. El nombre accesible es el propio `{label}` (:19), así que no repite el texto viejo. Antes tampoco identificaba el proyecto, de modo que el criterio "mantener si hoy lo hace" no aplica.
- Restos: `grep -i "detalles del proyecto"` sale vacío en `src/`, `docs/`, `design/`, `public/` y `scripts/`, y también en el build `dist/`. "Ver proyecto" aparece en `dist/client/index.html` y `dist/client/componentes/index.html`.
- Copy hardcodeado: no aparece "Ver proyecto" ni "Detalles" literal en `.astro`/`.svelte` de `src/shared/ui` ni de `src/modules`. El texto solo vive en `src/content/`.
- `design/copy/`: no cita el texto, así que no requiere cambios.
- Alcance: los cambios se limitan a `home.ts` (label), el comentario JSDoc de `src/modules/project-gallery/schema.ts:16`, `docs/components.md:254` y el estado en `feature_list.json`. No hay cambios de estilo, tokens ni estructura.
- V2/V3/V4: no aplican (solo copy; el texto nuevo es más corto que el anterior, sin riesgo de desbordar).
