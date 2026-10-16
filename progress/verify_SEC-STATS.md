# Verify SEC-STATS — vuelta 1
Resultado: VERDE

Fuente de diseño: `design/figma/homepage.0.txt` (31:19, 31:17, 29:251, 29:238–29:247, 29:307 y métricas
29:271/29:295/29:289/29:301) + recorte de `design/figma/homepage-full.png` (y 2870–3390). No se llamó a MCP
porque está limitado; eso no cuenta como hallazgo.
Medición: Chrome headless (CDP) contra `dist/client` (el build de init.ps1), a 375, 768, 1024 y 1440, con
`getBoundingClientRect` y estilos calculados, más capturas de la sección.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2] 29:246 alto del h2: en Figma la caja de texto mide 160 (`h-[160px]`) y en el render 168 (3 líneas × 56 con leading normal).
  Por eso la fila de métricas empieza en y=3231.9 y no en 3227 (+4.9px). Viene de `shared/ui/SectionHeader.astro`,
  que es común a otras secciones y queda fuera de esta feature. Solo se anota.
- [V2] 29:307 ancho de columna: Figma 308 · código 307.5 (contenedor 1320 en lugar de 1322). Es la deriva normalizada en DS-001.
  La línea de 300 y el texto centrado no cambian.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (check:ds 0 errores, check:arch, astro check, vitest y build OK).
- **Reutiliza el primitivo de cabecera sin duplicarlo**: `src/modules/stats/Section.astro:25` usa `@/shared/ui/SectionHeader.astro`
  con la descripción en el slot `aside`. No hay marcado repetido de eyebrow ni de h2 en el módulo.
- **h2 en dos tonos**: los spans son strong `rgb(9,9,9)` y muted `rgb(104,104,104)`, como en Figma 29:246 (#0a0a0a/#686868, con #0a0a0a normalizado a ink).
  El copy es exacto y se recortó el espacio final.
- **Descripción con lead strong**: "Sin relleno, solo resultados." en ink `rgb(9,9,9)` y el resto en muted. DM Sans 16/400, w 410,
  `text-right` a 1440 (x 970–1380) y alineada abajo (items-end), igual que Figma 29:247.
- **4 métricas a 1440** (Figma → render):
  - padding superior 191 (31:46 fin 2721 → 31:17 2912): fin del grid de proyectos 2718 → eyebrow ≈2909, son 191 ✓.
  - gap cabecera → métricas 120: h2 termina en 3111.9 y la dl empieza en 3231.9 ✓.
  - fila con 4 columnas y gap 30 (x 60 / 397.5 / 735 / 1072.5) ✓.
  - cifra Google Sans Flex 45/600 #090909, centrada y sin salto de línea ✓.
  - gap 26 → línea de 300×1, centrada y dibujada 1px arriba (y 3312.9) → gap 21 → etiqueta (y 3334.9) ✓.
  - etiqueta 18/500 #686868 centrada. "Años de experiencia senior combinada" mide 209 de ancho y ocupa 2 líneas ✓.
    "De contacto — sin intermediarios, / sin fricción" corta igual que en Figma ✓.
  - orden +250, +9, 97%, 1 punto (29:271, 29:295, 29:289, 29:301) ✓.
  - la captura coincide con el recorte de Figma en cortes de línea y proporciones.
- **V3 Responsive**: no hay scroll horizontal (scrollWidth = ancho del viewport en las 4 medidas).
  - 375: cabecera apilada y descripción a la izquierda. Métricas en 2×2 (col 161.5, gap-x 20, gap-y 40), cifra 36px que cabe ("1 punto" mide 125 de 161.5),
    línea al ancho de la columna y etiquetas legibles sin cortes.
  - 768: 2×2 con columnas de 342 y la línea a 300 exactos.
  - 1024: 4 columnas de 213.5 y la línea se adapta al ancho de la columna.
  - Las métricas no son interactivas, así que no aplica el área táctil.
- **V4 Assets**: `src/assets/stats/stat-divider.svg` es idéntico a `design/figma/assets/imgLine1.svg` (300×1, negro 24%).
  Se usa en las 4 métricas. El imgLine2 de 29:304 es el mismo trazo. No hay sustitutos.
- **V5**: en `src/modules/stats/` no hay valores arbitrarios `[..]`, hex, `client:*`, `any`, `ds-allow`, z-index ni imports
  a otros módulos. El copy vive en `src/content/pages/home.ts`. Los tokens nuevos (`spacing-209`, `--stats-pad-top`, `--stats-head-gap`)
  llevan `@figma` y `@derived`.
- **V6**: hay `section[aria-labelledby]` → h2 con id. Se usa `dl` / `dt` / `dd` con orden visual vía `order`. El separador es decorativo (`alt=""`),
  no hay isla ni animación y hay un solo h2 en la sección.
- **V7**: el alcance se limita al módulo stats, al registry/sections, al contenido de la home, a 3 tokens, al test, al design-system regenerado y al estado.
