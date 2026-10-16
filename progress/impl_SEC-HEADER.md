# impl SEC-HEADER — vuelta 1

## Fuente de diseño

- `get_design_context` de `16:48` **falló** por el límite de llamadas de Figma MCP (plan Starter).
- Se usó `design/figma/homepage.0.txt` (design context completo de 11:12): nodos `16:48`, `16:49`, `16:47` (logo),
  `11:39` (nav, 11:28-11:30), `11:35` (grupo CTA), `11:42`/`11:31` (píldora), `11:33` (círculo), `35:128` (flecha).
  Referencia visual: `design/figma/homepage-full.png`.
- Assets: `design/figma/assets/imgVector.svg` (16:47, logo blanco 99×26) e `imgVector1.svg` (35:128, flecha 11.1404×9), copiados sin modificar.

## Archivos

- `src/core/site.ts` (nuevo): tipos `SiteChrome` y `SiteHeader`. En `core` porque `layout` los consume y no puede importar `content`.
- `src/content/site.ts` (nuevo): datos del header (logo, navLabel, nav, CTA con icono, textos del menú).
- `src/layout/Header.astro` (nuevo): header en flujo sobre superficie ink; nav y CTA en desktop, isla en mobile.
- `src/layout/MobileMenu.svelte` (nuevo): isla del menú mobile (toggle, panel diálogo, Escape, trampa de foco, retorno de foco, bloqueo de scroll).
- `src/layout/focus-trap.ts` (nuevo): lógica pura de la trampa de foco (`wrapFocusIndex`, `FOCUSABLE`).
- `src/layout/BaseLayout.astro`: nueva prop `site: SiteChrome`; renderiza `<Header>` antes del slot.
- `src/pages/[...slug].astro`: importa `content/site` y lo pasa a `BaseLayout`.
- `src/assets/header/logo.svg` (nuevo): copia de `imgVector.svg`.
- `src/assets/header/arrow-right.svg` (nuevo): copia de `imgVector1.svg`.
- `src/styles/tokens.css`: tokens nuevos (ver abajo) y anotación ampliada de `--spacing-52`.
- `tests/site.test.ts` (nuevo): contrato de `content/site.ts` (copy de Figma, href, alt, textos accesibles).
- `tests/focus-trap.test.ts` (nuevo): lógica de la trampa de foco de la isla.
- `tests/design-tokens.test.ts`: `z-index` agregado a los namespaces que deben cerrarse con `initial`.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--spacing-3` | 3px | `@figma 16:49 left -3px`: logo y nav desplazados 3px a la izquierda del frame (`-ml-3`, `-translate-x-3`) |
| `--z-index-*: initial` + `--z-index-menu` | 50 | `@derived`: Figma no define capas; solo el panel fijo del menú mobile (`z-menu`) |
| `--spacing-52` (existente) | 52px | anotación ampliada: `16:48 top 12 + alto 40 = alto del header en flujo` |

Nota: el namespace de z-index de Tailwind v4 es `--z-index-*` (utilidad `z-<clave>`). Cerrarlo elimina los valores de tema, pero Tailwind sigue aceptando enteros sueltos (`z-50`); la convención es usar solo `z-menu`. `scripts/lib/tokens.mjs` no conoce el namespace `z-index` y en la doc generada lo muestra como `*-(--z-index-menu)`. Si se quiere `z-menu` en la doc, lo actualiza el orquestador (scripts/).

## Medidas a 1440 (medidas en un render headless)

- Header: `pt-12` + fila `h-40` (16:48 top 12, alto 40). Superficie `bg-ink surface-noise` (hero 11:13).
- Logo 99×26 en x=57 (Figma 60-3): medido 57.
- Nav: grid de 3 columnas iguales, nav centrado con `-translate-x-3`; gap 61, `text-label` (Google Sans Flex 500 16). Centro medido 716.5 = Figma (`calc(50%-3px)` del frame 1319 en x=60 → 716.5).
- CTA: píldora `w-193 h-40 px-20 pt-9 pb-10 rounded-pill bg-brand`, `text-button-sm` ink; gap 5; círculo `size-40` con la flecha centrada (en Figma está a 14.7px del borde, centrado sería 14.43: diferencia de 0.3px).
- CTA medido 1142-1379 (ancho 238) frente a Figma 1141-1378: 1px a la derecha porque `container-content` es 1320 (DS-001 normalizó el frame de 1319). Se deja así por coherencia con el resto de secciones.
- La flecha se renderiza sin `width`/`height` para respetar las dimensiones raíz del SVG (11.1404×9); Astro las redondearía a 11×9.

## Responsive inferido

- `< lg` (1024): logo + botón píldora "Menú" (mismo estilo que la CTA: `bg-brand`, `text-button-sm`, h-40). Nav y CTA ocultos.
- Panel (isla `client:load`, interactivo above-the-fold): diálogo modal `fixed inset-0 z-menu bg-ink surface-noise` que repite la fila del header (logo + botón "Cerrar"), nav apilado en `text-title` (22→28px fluido existente) con gap-24, y la CTA completa debajo (gap-40).
- Foco: al abrir va al botón "Cerrar"; Tab y Shift+Tab envuelven dentro del panel; Escape y "Cerrar" devuelven el foco al botón "Menú"; un enlace cierra sin devolver el foco (navega). Al pasar a `lg` con el panel abierto, se cierra. `html.overflow-hidden` mientras está abierto.
- Sin animaciones de entrada; la única transición es el color de hover de los enlaces (150ms), así que `prefers-reduced-motion` no necesita tratamiento aparte.
- Desde `lg`: grid de 3 columnas; a 1024 el nav (unos 345px) sobresale un poco de su columna de 314px, sigue centrado y no choca con logo ni CTA (comprobado a 1100).

## Decisiones

- Header **en flujo** (no absolute): la superficie ink con ruido del header continúa en el hero. SEC-HERO debe añadir la distancia restante hasta el wordmark (169 - 52 = 117, como dice la nota de `--spacing-169`).
- Hasta que exista SEC-HERO, debajo del header se ve el `h1` provisional sobre paper.
- SVG con `<img>` (URL y dimensiones del import), no con `<Image>`: el optimizador intentaba rasterizar el SVG y el build fallaba por `MissingSharp`. Las features con PNG/JPG necesitarán `sharp`; no se agrega ahora porque esta feature no tiene imágenes raster.
- `href` provisionales: `/#studio`, `/#proyectos`, `/#contacto` (CTA incluida). Los `id` los ponen las secciones correspondientes.
- Sin dependencias nuevas.

## init.ps1

```
[OK] toolchain · pnpm install · estado (1 in_progress)
check:ds → 253 tokens · 0 ds-allow · 0 error(es)   [warn] tokens sin uso de features futuras
[OK] check:arch · astro check (0 errores) · vitest 6 archivos / 23 tests · astro build
VERDE: todo en orden.
```

## Vuelta 2

Corrige el único bloqueante de `verify_SEC-HEADER.md` (V3, áreas táctiles < 44px en mobile). La píldora de 40 de Figma (11:42) se mantiene igual a la vista; solo crece el área de toque.

### Archivos

- `src/styles/tokens.css`: nuevo `--spacing-44`.
- `src/layout/MobileMenu.svelte`: los botones "Menú" y "Cerrar" pasan a ser cajas `h-44` (`hitArea`) que contienen la píldora `h-40`. El logo del panel lleva `h-44`. Los enlaces del nav pasan a `flex min-h-44 w-fit items-center`. El `<a>` de la CTA del panel lleva `min-h-44`.
- `src/layout/Header.astro`: el enlace del logo lleva `h-44 lg:h-auto`. En desktop queda como antes, a 26px de alto y en la misma posición que en Figma. En mobile, la caja de 44 queda centrada en la fila de 40 y sobresale 2px por arriba y 2px por abajo, sin cambiar el alto del header.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`, 254 tokens).

### Tokens

| Token | Valor | Origen |
|---|---|---|
| `--spacing-44` | 44px | `@derived`: área táctil mínima en `< lg` (criterio V3) |

### Menores diferidos

- V2 (+1px de la CTA, 0.5px de la flecha, 0.45px del nav, radio 90 frente a 999): el verifier indica que no requieren acción.
- V3 `-ml-3` en todos los breakpoints: queda diferido porque no bloquea y la vuelta se limita a bloqueantes y mayores. Se resuelve con `lg:-ml-3`.
- V6 `aria-controls` hacia un id ausente con el panel cerrado: funciona bien con lectores de pantalla. Queda diferido por alcance.
- V5 `focusRing`/`pill` duplicados en dos archivos: se extraerán a una constante compartida de `layout` si aparece una tercera copia, como sugiere el informe.

### init.ps1

```
check:ds · check:arch · astro check · vitest · astro build → [OK]
VERDE: todo en orden.
```
CSS generada: `.h-44{height:var(--spacing-44)}` y `.min-h-44{min-height:var(--spacing-44)}`.
