# impl MOT-PROJECTS-V2: proyectos, rediseño del detalle en hover

Primera vuelta (no había `verify_MOT-PROJECTS-V2.md`). Figma: pedí `get_design_context` de 31:59 (rejilla,
con captura) y de 32:82 (cabecera). Figma solo tiene el **estado de reposo** (imagen + pill 35:302),
que no cambia. El detalle del hover no está en Figma: todo sale de la `acceptance` y lleva `@derived`.

## Archivos

- `src/shared/ui/ProjectCard.astro`: reescrito. Sin pill de industria. Capas: imagen → velo → pill (reposo, `aria-hidden`) → detalle abajo en bloque glass (h3 título + categoría, `dl` de métricas con icono, `LinkButtonPaper`). Sin `tabindex` en la raíz; `overflow-clip` en lugar de `overflow-hidden`.
- `src/shared/ui/LinkButtonPaper.astro` (nuevo): enlace con forma de botón píldora paper a todo el ancho, 18px/400, hover brand, foco paper. Props `href`, `label`.
- `src/shared/ui/types.ts`: `ProjectMetricData.icon: UiIcon`; `details` = `{ metrics, link }` (sin `industry`).
- `src/modules/project-gallery/schema.ts`: `ProjectMetric.icon: ImageMetadata`; `ProjectDetails` = `{ metrics, link: Link }` (sin `industry`).
- `src/content/pages/home.ts`: imports de iconos, `PLACEHOLDER_PROJECT_METRICS` con icono y `PLACEHOLDER_PROJECT_LINK` (`'Detalles del proyecto'`, href `/#proyectos` marcado `// PLACEHOLDER`).
- `src/assets/project-gallery/metric-{funds,growth,return,partners}.svg` (nuevos): iconos de 20×20 con trazo blanco (glifos de Lucide, licencia ISC: circle-dollar-sign, trending-up, chart-column-increasing y users). Figma no tiene iconos para las métricas.
- `src/styles/global.css`: `card-active` añade `[data-card]:has(:focus-visible) *`. El foco en el botón activa la card. Team sigue igual.
- `src/styles/tokens.css`: tokens nuevos y retirados (ver abajo).
- `src/content/ui-catalog.ts` y `src/pages/componentes.astro`: entrada y muestra de `LinkButtonPaper` (sobre ink) y nuevo uso de `ProjectCard`.
- `docs/components.md`: `ProjectCard` actualizado y `LinkButtonPaper` documentado.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `tests/project-gallery.test.ts`: contrato de contenido (sin industry, icono SVG, link) y describe V2. Cubre: variantes, orden título → métricas → botón, glass y texto blanco, 2×2 / 1×4 en lg, iconos aria-hidden, botón de 18/400, blur solo con hover-motion, velo y secuencia por tokens, pill aria-hidden.
- `progress/current.md`: plan.

## Tokens

Agregados (todos `@derived`, porque Figma no diseña el hover):
- `--color-project-veil: rgba(9, 9, 9, 0.65)`: velo ink. `@contrast` paper sobre el peor caso (amarillo DAS + velo + glass 13%) ≈ 5.2:1.
- `--project-image-blur: 4px`: desenfoque "ligero".
- `--project-image-scale: 1.04`: oculta el borde translúcido que deja el blur.
- `--text-button-lg: 18px`, con line-height normal y peso 400: el botón de la acceptance.

Modificados: `--delay-project-details-in` pasa de 650ms a 250ms (= `--duration-project-fade`), porque ya no hay desplazamiento.
Retirados (sin uso): `--project-pill-shift`, `--duration-project-shift`, `--delay-project-title-out`.
Reutilizados: `bg-glass`, `border-glass-line`, `backdrop-blur-glass`, `rounded-card`, `rounded-metric`, `text-metric`, `text-metric-label`, `text-pill`, `--duration-image`, `--duration-fast`, `ease-standard`.

## Comportamiento y responsive inferido

- **Desktop con hover** (`hover-motion` = hover:hover y sin reduced-motion). En reposo, imagen + pill (idéntico a Figma, verificado en captura a 1440). En hover o con foco visible dentro:
  - la imagen se desenfoca 4px y escala a 1.04 (600ms, `--duration-image`);
  - el velo pasa a opacidad 1;
  - la pill se funde (250ms) y después entra el detalle (retardo de 250ms).
  - La salida va en orden inverso.
- **Mobile / `hover: none`, y también reduced-motion**: el estado base ES el final (velo, glass, texto blanco, detalle visible, pill oculta), sin desenfoque y sin transición. Con reduced-motion en desktop también se ve sin blur: es el estado final estático, porque el blur solo vive dentro de `hover-motion`.
- **Métricas**: 2×2 por debajo de lg, con el icono en línea a la izquierda del valor. Desde lg, 1×4 con el icono encima del valor: en lg la card mide unos 455px y la celda no da para icono + valor en línea.
- **Alto en mobile**: el detalle no cabe en el aspecto 650/447 a 343px (236px de alto). Con `overflow-clip`, que no es scroll container, el `aspect-ratio` crece al contenido: unos 293px a 375. En lg y 2xl cabe dentro del aspecto y la card mide 650×447.
- **Contraste**: el texto de las etiquetas va en `text-paper`, no en paper-soft. Las celdas no tienen fondo glass propio, solo borde, para no aclarar el fondo por debajo de AA.
- **Accesibilidad**:
  - la pill se oculta (`aria-hidden`) porque repite título y categoría del h3;
  - el enlace "Detalles del proyecto" toma su contexto del `li` de la card (WCAG 2.4.4);
  - el foco del enlace es paper con offset.

## CSS propio

Solo una línea en `global.css`: amplía el selector del custom-variant `card-active` con `:has(:focus-visible)`. Hace falta porque Tailwind no tiene una variante de grupo para "foco visible dentro". Todo lo demás son utilidades y tokens.

## Verificación visual (Chrome headless propio, PID propio, cerrado al terminar)

Capturas en el scratchpad de la sesión: 1440 en reposo (= Figma 31:59), 1440 en hover, 1024 en hover (1×4) y 375 con touch emulado (`hover: none` = true; 2×2, sin blur).

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds  (416 tokens · 0 ds-allow · 0 errores)
[OK] check:arch (114 archivos · 11 módulos · 0 errores)
[OK] astro check (0 errors)
[OK] vitest
[OK] astro build
VERDE: todo en orden.
```
