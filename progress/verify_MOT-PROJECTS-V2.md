# Verify MOT-PROJECTS-V2 — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2 proceso] El MCP de Figma devolvió el límite de llamadas del plan Starter para `get_design_context` de 31:59 y 32:82. Comparé el estado de reposo contra el volcado local `design/figma/homepage.0.txt` (29:166 / 35:302), que coincide (ver abajo). Conviene repetir la comparación con el MCP cuando vuelva a haber cuota. El hover no está en Figma, así que no se puede comparar.
- [V4/acceptance] Los iconos de las métricas se pintan con `<img src=svg>` (`src/shared/ui/ProjectCard.astro:78-85`). No son SVG inline. Siguen la convención `UiIcon` de la librería (igual que ButtonPauseGlass y LinkCtaBrand), llevan `alt=""` y `aria-hidden`, y son decorativos. Lo acepto como "icono de la librería". Si se quiere que hereden `currentColor`, habría que pasarlos a inline.
- [V3] A 375 la card crece de 236px (aspecto 650/447) a 293px para que quepa el detalle (`overflow-clip` + `aspect-ratio`). No hay diseño mobile en Figma y el comportamiento está documentado en el informe. Lo anoto como desviación del aspecto.
- [V6] Las 6 cards tienen enlaces con el mismo nombre accesible "Detalles del proyecto" y el mismo href PLACEHOLDER. Cumplen 2.4.4 por contexto (`li` + h3). Mejora opcional: `aria-describedby` al h3 de la card.
- [higiene] `card-active` mantiene `[data-card]:focus-visible *` (`src/styles/global.css:142`), pero la raíz de ProjectCard ya no es enfocable. No hace daño y puede servir a otros usos de `data-card`.

## Verificado sin hallazgos
- **V1**: `./init.ps1` ejecutado por mí y en verde: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check, vitest y build.
- **V2 (reposo, contra `design/figma/homepage.0.txt`)**: 29:166 mide 650×447 y en 2xl la card renderiza 650×447. Radio 5 = `rounded-media`. Inset lateral 22 = `--project-pill-inset` a 1440. Inferior 447−369−52 = 26 = `--project-pill-bottom`. Pill 35:302: alto 52 (`min-h-52`), padding 15 (`p-15`), radio 999 (`rounded-pill`), blanco (`bg-paper`). Texto 16/500 (`text-pill`): título ink en mayúsculas y categoría gris (`text-ink-muted`). La captura del reposo a 1440 coincide con el Figma.
- **Acceptance (comprobado en Chrome headless contra el build, `node dist/server/entry.mjs` con PID propio, cerrado al terminar)**:
  - Sin pill de industria. El detalle está abajo, en este orden: título + categoría → métricas → botón.
  - Métricas: `grid-template-columns` de 4 columnas a 1440 y 1024, 2 a 768 y 2 a 375.
  - Botón: a todo el ancho del bloque (574px a 1440), 18px/400, alto 50.
  - Hover a 1440 y 1024: detalle con opacidad 1, imagen con `blur(4px)` + escala, velo 1 y pill 0. Glass con `backdrop-filter: blur(20px)` y texto paper.
  - Foco por teclado (Tab desde el CTA de la cabecera): el enlace tiene `:focus-visible`, la card se activa (detalle 1, blur 4px) y el outline es sólido de 2px en blanco.
  - Táctil (375 y 768, `hover:hover` = false): estado final con velo y glass, imagen con `filter: none` y pill oculta.
  - Reduced-motion a 1440: estado final sin blur.
  - Transiciones con tokens: `--duration-image`, `--duration-project-fade`, `--delay-project-*` y `ease-standard`.
  - `LinkButtonPaper` es nuevo en shared/ui, está documentado en `docs/components.md` y en el catálogo `/componentes`. El href es `/#proyectos`, marcado `// PLACEHOLDER` en `src/content/pages/home.ts:46`.
- **V3**: sin scroll horizontal (`scrollWidth` = viewport a 375, 768, 1024 y 1440). Ningún elemento de la card desborda. Botón de 50px de alto (≥44). Capturas en el scratchpad de la sesión (`shots/`).
- **V4**: las imágenes de proyecto existentes se mantienen. Los 4 SVG de métricas existen en `src/assets/project-gallery/`, son de 20×20, se renderizan a `size-20` sin deformarse, con trazo blanco, y su origen está declarado (Lucide, ISC).
- **V5**: sin valores arbitrarios `[..]`, sin hex, sin `client:load`, sin `any` ni `ds-allow`, sin z-index en los archivos tocados y sin imports entre módulos. Todo el copy (métricas, botón) viene de `src/content/`. La card es CSS puro, sin isla. Tokens nuevos anotados como `@derived` y con `@contrast`.
- **V6**: h3 por card bajo el h2 de la sección. Pill duplicada con `aria-hidden`. Icono y velo con `aria-hidden`. Métricas en `dl`/`dt`/`dd`. Foco visible. `prefers-reduced-motion` respetado.
- **V7**: los cambios se limitan a ProjectCard, LinkButtonPaper, tipos y schema, contenido, tokens, una línea de global.css, catálogo, docs y tests de la feature.
