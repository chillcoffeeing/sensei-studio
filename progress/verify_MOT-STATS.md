# Verify MOT-STATS — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V5] `revealAll()` se llama sin `root` desde dos scripts (`src/modules/stats/Section.astro:60` y `src/modules/process/Section.astro:76`). Cada uno recorre todo el documento, así que el `<ol>` de proceso y el aside de stats quedan con dos observadores `inView`. No rompe nada: `setAttribute('data-inview')` y `assignStaggerIndexes` son idempotentes. Si se quiere, se puede acotar a la sección con `revealAll(section)` y `countUpAll(section)`, o tolerarlo como patrón común.
- [V6] Durante la cuenta (1,6 s más el escalonado) un lector de pantalla podría leer valores intermedios ("+0"). La cuenta solo empieza al entrar en viewport, así que el riesgo es bajo. Opcional: dejar el valor final para lectores de pantalla (`aria-label`, o el texto animado con `aria-hidden` junto a un `sr-only`).
- [Fuera de alcance, orquestador] `design/copy/process.md:8` sigue diciendo `DURACIÓN: ~4 semanas`, y el render ya no lo usa. Conviene actualizar el copy fuente.

## Verificado sin hallazgos
- **V1**: `./init.ps1` lo ejecuté yo y dio código 0, "VERDE: todo en orden" (check:ds, check:arch, astro check, vitest y build en OK).
- **V2 Figma**: `get_design_context(35:132)` devolvió el límite de llamadas del plan Starter de Figma MCP. Revisé sin Figma: la feature no cambia medidas. En stats el marcado y los tokens de layout siguen igual; solo se añaden `data-reveal`, `reveal-up`, `data-count-up` y `data-count`. En proceso el h2 de 35:132 queda solo, con las mismas utilidades (`font-heading text-lead leading-none uppercase`). La duración no figura en Figma (venía del copy). La comparación visual con `get_screenshot` queda pendiente por el límite de llamadas.
- **V3 Responsive**: revisión estática, sin navegador headless. No cambia nada del layout. Las cifras mantienen `whitespace-nowrap` y siguen centradas en su columna de ancho fijo (2 columnas en mobile, 4 desde lg), así que el ancho variable durante la cuenta no desplaza otros elementos. `reveal-up` solo anima transform y opacity: no hay CLS. Quitar la línea de puntos elimina un contenedor flex y no añade riesgo de desborde a 375px.
- **V4 Assets**: no hay assets nuevos. `stat-divider.svg` y `process-badge.svg` siguen igual.
- **V5 Antipatrones**:
  - No hay `client:load`, `any`, `ds-allow` ni clases arbitrarias nuevas.
  - El motion se importa desde `@/shared/lib/motion` (la API pública) y no hay imports entre módulos.
  - `slider/tween.ts` reexporta `cubicBezier` desde motion: la dependencia va de slider hacia motion y check:arch está en OK.
  - El copy viene del contenido (`items[].value`) y no está escrito en el componente.
  - No hay CSS nuevo: se reutiliza la utilidad `reveal-up` y se añade el token `--duration-count` (anotado con `@derived` y `@usage`).
- **V6 Accesibilidad**:
  - El h2 de stats está ligado por `aria-labelledby` y el h2 de proceso se conserva.
  - Con reduced-motion, `countUp` no toca el DOM y `reveal-up` no anima, porque la utilidad usa la guarda `prefers-reduced-motion`/`scripting`. También hay respaldo sin IntersectionObserver ni rAF.
- **Acceptance**:
  - El SSR trae el valor final: en `dist/client/index.html` aparecen `+250`, `+9`, `97%` y `1 punto`.
  - `parseCount` conserva el prefijo y el sufijo.
  - Al terminar se restaura el texto original exacto.
  - `inView` dispara una sola vez.
  - "DURACIÓN" no aparece en `dist/client/index.html` (0 coincidencias). `ProcessContent.duration` y `home.ts` están limpios y no quedan tokens `--process-*` huérfanos.
- **V7 Alcance**: solo se tocaron stats, proceso (schema, contenido y render), motion compartido, tokens, docs y tests asociados.
