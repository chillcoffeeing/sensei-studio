# Verify SEC-PROJECTS — vuelta 1
Resultado: ROJO

Fuente de diseño: no se llamó a Figma MCP (está limitado). Se usó el fallback `design/figma/homepage.0.txt` (nodos 32:82, 16:84, 16:70, 16:82, 29:236, 31:59, 31:46, 29:235, 29:166, 35:302–35:306) y `design/figma/homepage-full.png`, recortado entre y=1040 y y=1800.

V3 y V6 se midieron con Chrome headless por CDP sobre `dist/client`, servido en local a 375, 768, 1024 y 1440, con `getBoundingClientRect`, estilos calculados y log de peticiones. En los viewports de 768 en adelante la barra de scroll ocupa 15px, así que a 1440 el ancho útil es 1425 y las cards miden 642.5. Las medidas verticales no dependen de ese ancho.

## Bloqueantes

- [V3] El área táctil del CTA "VER TODOS LOS PROYECTOS +" mide menos de 44px de alto en `< lg`. A 375 mide 237.2×20 y a 768 también 237.2×20. El `<a>` es inline (`src/modules/project-gallery/Section.astro:31-38`). Esperado: ≥44 de alto en `< lg`, igual que en SEC-HEADER. Por ejemplo `flex min-h-44 items-center lg:block lg:min-h-0`, o el equivalente con `h-44`/`min-h-44` (el token ya existe, tokens.css:411). En `lg+` puede quedarse en 20px para mantener la alineación inferior de Figma.

## Mayores

- [Imágenes / acceptance "optimizadas"] El `<img>` de respaldo de `<Picture>` sale en PNG, porque `fallbackFormat` no está definido y se hereda el formato de origen. Eso genera 10 PNG que ocupan unos 5.9 MB de los 6.3 MB de `dist/client`. Dos de ellos son el original a 2400px y van en el `src` del `<img>`: `das-anthropology-laptop…_Z1RyjTV.png`, de 1.16 MB, y `vietnam-exposition-laptop…_1XR8co.png`, de 2.08 MB. Las variantes de 1300w pesan 440 KB y 880 KB.
  - Los navegadores modernos no los descargan. En la medición solo se pidieron AVIF de 5 a 48 KB.
  - Aun así, el fallback y el peso del build no cumplen "imágenes optimizadas".
  - Corrección en `src/modules/project-gallery/Section.astro:51-60`: añadir `fallbackFormat="jpg"` (o `webp`). Valorar también un `src` del fallback más pequeño. Esperado: ningún PNG de proyecto por encima de unos 150 KB en `dist/client/_astro`.

## Menores

- [V2] 29:236 · y del CTA: en Figma está en 1211 (alineado abajo con 16:84, que acaba en 1231); en el código está en 1209. Medido a 1440: el `<a>` ocupa 1209–1229 y el h2 acaba en 1231. Lo mismo pasa a 1024 (1040.5 contra 1042.5).
  - Causa: el `<a>` inline va dentro de un `div` con la fuente de body, y el strut de esa línea mide 22px (`src/shared/ui/SectionHeader.astro:39`).
  - Se corrige en el primitivo si el contenedor del `aside` es `flex` (o el enlace `block`). Con eso también se resuelve el bloqueante en `lg+`.
- [Producto] `cta.href = '/#proyectos'` enlaza a la propia sección (`src/content/pages/home.ts:79`). Ya está anotado como pendiente de decisión. Que el orquestador lo registre en `progress/current.md`.
- [SectionHeader] El `aside` lleva `shrink-0` (`src/shared/ui/SectionHeader.astro:39`). Si una sección futura pasa una descripción larga sin ancho máximo (en Figma 29:247 mide w 410), el párrafo tomará su ancho max-content y estrechará el h2 en `lg`. Conviene documentarlo en el comentario del primitivo (el consumidor fija `max-w-410`) o limitar el ancho del slot.

## Verificado sin hallazgos

- **V1:** `./init.ps1` termina VERDE (exit 0): toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check, vitest y build. El build genera AVIF y WebP.
- **V2 a 1440**, medido contra Figma:
  - Eyebrow en y=1084 (32:82 top 1084), con punto de 14px y gap de 10. Es 16px/500/normal, en mayúsculas, color #090909.
  - h2 en y=1119 (1084 + 20 + 15), 764×112 (16:84 w 764, 16:82 h 112), 45px/500.
  - Grid en y=1301 (31:46). Gap entre filas de 38 (29:235) y entre columnas de 20.
  - Pill de 52 de alto, padding 15, radio 999 y fondo blanco, con inset de 22 a los lados y 26 abajo (447 − 369 − 52). Radio de la card: 5px.
  - Título y categoría a 16px/500. El título va en mayúsculas en ink y la categoría en `ink-muted` (#686868).
  - El CTA es 16px/400 en `ink-muted` y alineado a la derecha.
  - La captura coincide con el recorte de Figma en encuadre (object-cover), orden y tonos.
  - Copy idéntico a Figma: "Proyectos", el h2, "VER TODOS LOS PROYECTOS    +", y "Dass design anthopoly" / "Web Design" ×6.
- **V3:** sin scroll horizontal en 375, 768, 1024 ni 1440.
  - A 375: una columna de 343×235.9 con aspecto 650/447 y pill de 319×52. Título y categoría caben en una línea (14px).
  - A 768: 689×473.8.
  - A 1024: dos columnas de 454.5 y cabecera en fila sin solaparse.
  - El texto se lee bien en todos los anchos (ver capturas).
- **V4:** `das-anthropology-laptop.png` es idéntico byte a byte a `imgFrame14.png`, `vietnam-exposition-laptop.png` a `imgFrame15.png` y `eyebrow-dot.svg` a `imgEllipse1.svg` (`cmp`). Alternan por columna como en 28:101/29:186/29:205. No hay sustitutos.
- **Imágenes (servidas):**
  - AVIF/WebP en 400/650/900/1300w.
  - El `sizes` coincide con el layout: a 1440 (con 1320 de contenido) da 650; en `lg`, 50vw−50 (gutter 40 + gap 20); en `md`, 100vw−64; en mobile, 100vw−32.
  - Selección real a DPR1: 400w a 375 y 900w a 768.
  - `loading="lazy"` y `decoding="async"` son correctos: la sección empieza por debajo del primer pantallazo (grid en y=1022 a 375×812, y=1082 a 768×1024, y=1301 a 1440×900).
- **SectionHeader (`shared/ui`):** está desacoplado de proyectos.
  - Props: `headingId`, `eyebrow`, `title: ToneText` y el slot opcional `aside`.
  - Los colores salen de `--tone-strong`, así que también sirve en superficies `tone-on-ink`.
  - `max-w-764` corresponde a 16:84 y 29:238.
  - Cubre las variantes de INVENTORY §2: la 3 con CTA, las 4/6/9 con descripción a la derecha (29:251 usa el mismo `justify-between items-end`), la 8 con aside propio y la 10 sin aside.
  - Solo importa `@/assets/ui`, `@/shared/lib` y `./ToneText`.
- **`sharp`:** está justificada. Es el servicio de imágenes por defecto de `astro:assets`, y sin ella `astro build` falla (MissingSharp) al transformar PNG. `pnpm-workspace.yaml` ya la tenía en `allowBuilds`. Va bien en `dependencies` porque el adaptador node standalone la usa en runtime para `/_image`.
- **V5:**
  - No hay valores arbitrarios `[..]`, hex, `client:*`, `any`, `ds-allow`, z-index ni imports entre módulos. El módulo solo importa `@/core/page`, `@/shared/ui` y `astro:assets`.
  - El copy y los `alt` viven en `src/content/pages/home.ts`.
  - No hay isla.
  - Los tokens nuevos llevan anotaciones @figma/@derived.
- **V6:**
  - La sección tiene `aria-labelledby` que apunta al h2, y los títulos de card son `h3`.
  - Los `alt` describen los mockups y el punto del eyebrow lleva `alt=""`.
  - El "+" va `aria-hidden` y el CTA tiene `focus-visible:outline`.
  - No hay animación nueva, salvo la transición de color.
- **V7:** los cambios se limitan a la sección: módulo, registro, contenido, tokens, docs regenerados, test y `sharp`.

# Vuelta 2
Resultado: VERDE

Fuentes: `design/figma/homepage.0.txt` (Figma MCP limitado) y las medidas de la vuelta 1. V3 se midió con Chrome headless por CDP sobre `dist/client` recién generado a 375, 768, 1024 y 1440. En la vuelta 2 solo cambió `src/modules/project-gallery/Section.astro`; el resto de archivos del módulo, `SectionHeader`, `home.ts`, `tokens.css` y el test no se modificaron desde la vuelta 1.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [Producto] `cta.href = '/#proyectos'` (`src/content/pages/home.ts:79`) sigue pendiente de decisión. Lo registra el orquestador en `progress/current.md`; no bloquea.
- [SectionHeader] `shrink-0` en el aside (`src/shared/ui/SectionHeader.astro:39`) queda diferido, con la justificación de impl. Cuando la primera sección pase una descripción (29:247), debe fijar `max-w-410`.

## Resueltos de la vuelta 1
- **[Bloqueante V3] Área táctil del CTA: RESUELTO.** El `<a>` ahora es `flex min-h-44 w-fit items-center … lg:min-h-0` (Section.astro:34).
  - Medido: 237.2×44 a 375 y a 768, 237.2×20 a 1024 y a 1440. `display: flex`.
  - Color `ink-muted` (rgb 104,104,104) y 16px, sin cambios.
- **[Mayor] Imágenes optimizadas: RESUELTO.** `fallbackFormat="jpg"` y `width={1300}` (Section.astro:48-49).
  - El `<img>` de respaldo es `…_ZFiWRJ.jpg` con 1300×683 y srcset JPG 400/650/900/1300w. Las `<source>` AVIF y WebP siguen igual, con el mismo `sizes`, `loading="lazy"` y `decoding="async"`.
  - `dist/client/_astro` no tiene ningún PNG. El JPG más pesado ocupa 119.6 KB (vietnam 1300w), por debajo de 150 KB. `dist/client` pesa 1.1 MB (antes 6.3 MB).
- **[Menor V2] y del CTA (29:236): RESUELTO** como efecto del `<a>` de bloque.
  - A 1440 el CTA ocupa 1211–1231, igual que Figma (y 1211, alineado con el final de 16:84 en 1231). El h2 ocupa 1119–1231.
  - A 1024 el CTA ocupa 1022.5–1042.5 y el h2 acaba en 1042.5: alineados abajo.

## Verificado sin hallazgos (regresiones)
- **V1:** `init.ps1` VERDE (check:ds, check:arch, astro check, vitest y build con avif/webp/jpg).
- **V2 a 1440**, sin cambios respecto a la vuelta 1:
  - Eyebrow en y=1084, h2 en 1119 con 764×112, grid en 1301.
  - Pill de 52 con inset 22 (x 82 − 60).
  - Card de 642.5 de ancho por la barra de scroll de 15px, como en la vuelta 1.
- **V3:** sin scroll horizontal en ningún ancho (scrollWidth = ancho útil).
  - Cards de 343×235.9 a 375, 689×473.8 a 768 y 454.5×312.5 a 1024.
  - Con el CTA de 44 de alto, la separación cabecera→grid en < lg queda en 40 (a 375: CTA hasta 1002.5, grid en 1042.5). Es coherente con `--section-head-gap`.
- **V5:** sin valores arbitrarios en clases, sin hex, sin `client:*`, sin `any` ni `ds-allow` en el módulo. El único resultado de `\[[0-9#]` es el array JS `widths` (línea 17), que es un falso positivo. `min-h-44` y `lg:min-h-0` usan tokens.
- **V4, V6 y V7:** sin cambios. El foco visible sigue en el CTA y el "+" sigue con `aria-hidden`. El diff se limita al módulo.
