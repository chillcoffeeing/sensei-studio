# impl MOT-ACCORDIONS — Acordeones de servicios y FAQ: expansión y entrada lateral

Continuación de la sesión previa: la infraestructura compartida ya existía
(`accordion-controller.svelte.ts`, `motion/expand.ts`, utilidades `collapsible` /
`enter-from-side`, tokens de duración/ease). Faltaba conectar las islas, limpiar el
mecanismo anterior (`hidden` / `data-collapsed` / `animate-panel-in`) y los tests.

Figma: el MCP de Figma no está disponible en esta sesión (requiere autenticación). La
feature es solo de motion; el layout de 31:60 / 33:78 / 41:406 / 174:157 no cambia
(ya implementado en SEC-SERVICES / SEC-FAQ).

## Archivos

- `src/modules/services/ServicesAccordion.svelte` — usa `AccordionController`; panel `collapsible` + `data-open`, wrapper intermedio (el padding va en el nieto); `data-enter` + `enter-from-side` en descripción, ítems de lista e imágenes. Fuera `hydrated`/`hidden`/`data-collapsed`/`animate-panel-in`.
- `src/modules/faq/FaqAccordion.svelte` — igual: controlador compartido, `collapsible` + wrapper, respuesta con `data-enter`.
- `src/modules/services/Section.astro`, `src/modules/faq/Section.astro` — comentarios actualizados al nuevo mecanismo.
- `src/styles/tokens.css` — eliminado `--animate-panel-in` y `@keyframes panel-in` (sin uso).
- `src/content/pages/home.ts` — marcas `PLACEHOLDER` en imágenes de servicios y respuestas provisionales del FAQ.
- `tests/accordion-controller.test.ts` (nuevo) — toggle, entrada lateral solo tras interacción, medición de lado + escalonado al abrir (no al cerrar), teclado APG.
- `tests/services.test.ts`, `tests/faq.test.ts` — contratos del nuevo marcado (collapsible, data-open, controlador compartido, data-enter; sin `hidden`).
- `docs/design-system.md` — regenerado con `pnpm docs:ds`.

Sin cambios en esta vuelta (ya existían): `src/shared/lib/accordion-controller.svelte.ts`,
`src/shared/lib/accordion.ts`, `src/shared/lib/motion/expand.ts`, `src/styles/global.css`.

## Tokens

- Agregados: ninguno nuevo en esta vuelta (`--duration-expand`, `--duration-enter`,
  `--duration-stagger-tight`, `--ease-expand`, `--animate-enter-from-*` ya estaban, todos `@derived`).
- Eliminados: `--animate-panel-in` (sustituido por `collapsible` + entrada lateral).

## Comportamiento / responsive inferido

- Expansión: `grid-template-rows 0fr→1fr` (`--duration-expand` 450ms, `--ease-expand`); al cerrar, `visibility` espera al colapso → sale del árbol a11y y del tab order.
- Entrada lateral: el lado se mide al abrir según el centro de cada elemento respecto del panel (`markEntrySides`), así se adapta a cada breakpoint: en xl la columna de texto entra desde la izquierda y las imágenes desde la derecha; en mobile (grid de 3 imágenes) la imagen de la derecha entra por la derecha y el resto por la izquierda. Escalonado `--duration-stagger-tight` (70ms).
- Solo se anima tras la primera interacción: el panel abierto en el SSR no anima al cargar.
- El wrapper con `overflow: hidden` recorta el desplazamiento lateral (40px) en el borde del panel: efecto de máscara intencionado.
- Sin JS: todos los paneles abiertos. Con JS: el SSR ya trae `data-open` en la fila inicial y los cerrados colapsan por `@media (scripting: enabled)` → sin salto al hidratar.
- `prefers-reduced-motion: reduce`: sin transición ni animación; estado final visible.
- CSS propio: solo las `@utility` `collapsible` y `enter-from-side` en `global.css` (necesarias: transición de `grid-template-rows` + `visibility` diferida y selección por ancestro `[data-open]` / `data-side`, no expresables con utilidades sueltas).
- Accesibilidad: se mantienen `button[aria-expanded]`, `aria-controls`, `role="region"` + `aria-labelledby`, flechas/Home/End.

## init.ps1

VERDE: toolchain, dependencias, estado, check:ds, check:arch, check:types, vitest, astro build OK.
Build: primer panel de services y FAQ con `data-open`, resto `collapsible` cerrado; CSS
compilado contiene `.collapsible` y `.enter-from-side` (ambas variantes de lado).

## Vuelta 2 — corrección (nota del orquestador: timeout en services.test.ts)

- Causa: `expect(buffer).toEqual(buffer)` sobre `service-placeholder.png` (1,2 MB) hace la
  igualdad profunda de Vitest byte a byte → ~5,7 s, por encima del límite de 5000 ms.
- `tests/services.test.ts`: el test "assets de Figma sin modificar" compara ahora con
  `Buffer#equals` (comparación nativa byte a byte) más un chequeo de tamaño con mensaje.
  Lo que se comprueba no cambia (igualdad exacta de bytes de los 3 assets). Sin timeout
  explícito: no hace falta; el test tarda ~8 ms.
- `tests/faq.test.ts` usa `toEqual` sobre un SVG pequeño (sin riesgo); no se toca.
- `./init.ps1`: VERDE (toolchain, dependencias, estado, DS, arquitectura, astro check,
  vitest, astro build).
