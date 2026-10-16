# Verify SEC-HEADER — vuelta 1
Resultado: ROJO

Fuente V2: `design/figma/homepage.0.txt` (nodo `16:48` e hijos). No se llamó a Figma MCP porque tiene límite de llamadas.
V3 y V6: Chrome headless (CDP) sobre `dist/client` servido en local, a 375, 768, 1024 y 1440, con medidas de `getBoundingClientRect` y estilos calculados. El menú mobile se probó con eventos de teclado reales.

## Bloqueantes

- [V3] Las áreas táctiles mobile miden menos de 44px de alto (el criterio V3 pide ≥44px). Medidas a 375:
  - Botón "Menú": 76.8×40. Usa la clase `pill` con `h-40` (src/layout/MobileMenu.svelte:73-74, aplicada en :80-87). Esperado: ≥44 de alto.
  - Botón "Cerrar": 82.1×40 (src/layout/MobileMenu.svelte:103). Esperado: ≥44.
  - Enlaces del nav en el panel ("Studio", "Proyectos", "Cotización"): 27px de alto, porque el `<a>` es inline (src/layout/MobileMenu.svelte:115). Esperado: ≥44, por ejemplo con `block`/`flex` y alto o padding de token.
  - Enlace del logo: 99×26 en el header mobile (src/layout/Header.astro:30) y en el panel (src/layout/MobileMenu.svelte:100). Esperado: ≥44 de alto en `< lg`. El área de toque se puede ampliar sin cambiar el aspecto, por ejemplo con padding y margen negativo de token, o una caja de 44 con el logo centrado.
  - La CTA del panel (238×40) queda igual. Es la píldora de Figma 11:42; se puede ampliar solo el área de toque del `<a>` (MobileMenu.svelte:123).
  La píldora de 40px de Figma se puede mantener en desktop (`lg+`, donde no aplica este criterio). La corrección afecta solo al tamaño de toque en `< lg`.

## Mayores

(ninguno)

## Menores

- [V2] 11:35 · x de la CTA: Figma 1141–1379 · código 1142–1380 (+1px). Viene de `--container-content` 1320 frente al frame de 1319, ya documentado en impl. No requiere acción.
- [V2] 35:128 · posición de la flecha dentro del círculo: Figma x 14.7 / y 15 · código x 14.4 / y 15.5 (centrada con flex). La diferencia es de ≤0.5px y no requiere acción.
- [V2] 11:39 · centro del nav: Figma 716.5 · código 716.95. Diferencia de 0.45px, por el contenedor de 1320.
- [V2] 11:42 · border-radius: Figma 90px · código `--radius-pill` 999px. Con alto 40 el render es idéntico.
- [V3] `-ml-3` (el ajuste de −3px de 16:49 en desktop) se aplica en todos los breakpoints. A 375 el logo empieza en x=13 y el botón "Menú" termina a 16px del borde, así que los márgenes no son simétricos (src/layout/Header.astro:30, src/layout/MobileMenu.svelte:100). Valorar `lg:-ml-3`.
- [V6] `aria-controls="menu-mobile"` apunta a un id que no existe en el DOM mientras el panel está cerrado (el panel va dentro de `{#if open}`, src/layout/MobileMenu.svelte:84). Funciona, pero algunos validadores lo marcan.
- [V5] La cadena `focusRing` está duplicada en src/layout/Header.astro:20 y src/layout/MobileMenu.svelte:72, igual que el estilo de la píldora (Header.astro:53-55 y MobileMenu.svelte:73-74). Si aparece una tercera copia, conviene sacarla a una constante compartida en `layout`.

## Verificado sin hallazgos

- V1: `./init.ps1` termina VERDE (exit 0): check:ds, check:arch, astro check, vitest 6/23 y build.
- V2 a 1440 (medidas en render):
  - Header: 52 de alto (pt-12 + h-40), con superficie `bg-ink` + ruido.
  - Logo 16:47: 99×26 en (57,19), igual que Figma (60−3, 12+7).
  - Nav 11:39: Google Sans Flex 500 16px, blanco, gap 61, texto con top 22 (Figma 12+10).
  - Píldora 11:42: 193×40, padding 9/20/10/20, fondo #E4FF40, texto 14px 500 #090909, centrado.
  - Gap 5 y círculo 11:33 de 40×40.
  - Orden: logo, nav, CTA.
  Todos los valores salen de tokens (`--spacing-*`, `--text-label`, `--text-button-sm`, `--color-brand/ink/paper`, `--radius-pill`).
- V3: no hay scroll horizontal a 375, 768, 1024 ni 1440 (`scrollWidth == innerWidth`). A 1024 el nav (324px) no choca con el logo ni con la CTA. Por debajo de `lg` solo se ven el logo y "Menú".
- Menú mobile (375):
  - `aria-expanded` cambia de false a true y vuelve a false.
  - El panel tiene `role="dialog"`, `aria-modal="true"` y `aria-label="Principal"`; ocupa 375×812 con `z-index` 50 (`z-menu`).
  - Al abrir, el foco va a "Cerrar".
  - Tab recorre Studio, Proyectos, Cotización, CTA, logo, Cerrar y vuelve a Studio (envuelve). Shift+Tab también envuelve.
  - Escape cierra y devuelve el foco a "Menú". "Cerrar" hace lo mismo.
  - Un enlace cierra el panel sin devolver el foco.
  - Al redimensionar a 1280 con el panel abierto, se cierra.
  - `html.overflow-hidden` se aplica (overflow calculado: hidden) mientras está abierto y se quita al cerrar.
- V4: `src/assets/header/logo.svg` y `arrow-right.svg` son idénticos byte a byte a `design/figma/assets/imgVector.svg` e `imgVector1.svg`. Se renderizan a 99×26 y 11.1×9 (proporción conservada) y no hay sustitutos.
- V5:
  - Sin hex, sin clases arbitrarias `[..]`, sin `any`, sin `ds-allow` y sin `z-<n>` sueltos en `src/layout`, `src/content/site.ts` ni `src/core/site.ts`.
  - El copy está en `content/site.ts`. `layout` solo importa de `@/core`.
  - `client:load` está justificado: es una isla interactiva above-the-fold.
  - `--z-index-*: initial` + `--z-index-menu` cierra el namespace (criterio de arrastre de DS-001), y la CSS generada contiene `.z-menu{z-index:var(--z-index-menu)}`.
- V6:
  - Un solo `h1`.
  - El logo tiene `alt="Sensei Studio"` y la flecha es decorativa (`alt=""` dentro de `aria-hidden`).
  - El foco visible es un outline sólido de 2px en #E4FF40 con offset 2, comprobado con Tab en desktop.
  - El `nav` tiene `aria-label`.
  - La única transición es de color, así que no hace falta tratar `prefers-reduced-motion` aparte.
- V7: el alcance se ajusta a los criterios. Se tocaron header, layout, site (content/core), la página, tokens, tests y la doc regenerada.

# Vuelta 2
Resultado: VERDE

Método: `init.ps1`, revisión del diff de `src/layout/Header.astro` y `src/layout/MobileMenu.svelte` y Chrome headless (CDP) sobre `dist/client` a 375, 768, 1024 y 1440, midiendo con `getBoundingClientRect` y usando eventos de teclado reales. Fuente V2: `design/figma/homepage.0.txt`. No se usó Figma MCP.

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Bloqueante de la vuelta 1, resuelto

- [V3] Áreas táctiles en `< lg`, medidas a 375:
  - Botón "Menú": 76.8×44. La píldora interior sigue en 76.8×40.
  - Logo del header: 99×44. La imagen sigue en 99×26.
  - En el panel, logo 99×44 y "Cerrar" 82.1×44, con la píldora a 40.
  - Enlaces Studio, Proyectos y Cotización: 44 de alto cada uno.
  - CTA: 238×44, con la píldora a 193×40 y el círculo a 40×40.
  - A 768 los valores son los mismos (Menú 76.8×44, logo 99×44).

## Sin regresiones

- V1: `init.ps1` VERDE (check:ds, check:arch, astro check, vitest, build).
- Desktop: medidas idénticas a la vuelta 1.
  - A 1440 el logo mide 99×26 en (57,19); `lg:h-auto` funciona.
  - Nav con top 22.
  - CTA en 1142–1380: píldora 193×40, círculo 40×40 y flecha 11.1×9.
  - A 1024 no hay choques.
- Alto del header: 52 en los 4 breakpoints. Las cajas de 44 sobresalen 2px por arriba y por abajo de la fila de 40 (y=10) sin cambiar el flujo.
- No hay scroll horizontal (`scrollWidth == innerWidth`) en 375, 768, 1024 ni 1440.
- Menú mobile:
  - Al abrir, el foco va a "Cerrar".
  - Tab recorre Studio, Proyectos, Cotización, CTA, logo, Cerrar y vuelve a Studio.
  - Escape cierra, devuelve el foco a "Menú", pone `aria-expanded=false` y quita `overflow-hidden`.
- V5:
  - `--spacing-44` está anotado `@derived` con `@usage` y aparece en `docs/design-system.md`.
  - Sin hex, sin clases `[..]`, sin `ds-allow`, sin `any` y sin `z-<n>` en `src/layout`, `content/site.ts` ni `core/site.ts`.

## Menores (siguen abiertos, no bloquean)

- Los de V2, V3 (`-ml-3` en mobile), V6 (`aria-controls`) y V5 (duplicación de `focusRing`/`pill`) de la vuelta 1 siguen igual. El implementer los dejó diferidos a propósito.
- [V3] Nuevo y solo informativo. En el panel, `min-h-44` hace que el ritmo del nav pase de 51 a 68px por ítem (44 + gap-24), es decir, de y=92 a 160 y a 228. Es responsive inferido sin referencia en Figma y se ve bien. Si se quisiera el ritmo anterior, habría que bajar el gap (src/layout/MobileMenu.svelte:112).
