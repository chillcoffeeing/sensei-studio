# Verify SEC-HERO — vuelta 1
Resultado: VERDE

Fuente de diseño: Figma MCP sin cuota (`get_design_context 16:53` → límite del plan Starter), así que no cuenta
como hallazgo. Se comparó con `design/figma/homepage.0.txt` (nodos 11:13, 16:53→16:50→11:27, 11:41, 11:25, 11:24)
y con `design/figma/homepage-full.png` escalado a 1440×851. La verificación visual se hizo con Chrome headless (CDP,
`Emulation.setDeviceMetricsOverride`) sobre `dist/client` del build de esta vuelta.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [Alcance/acceptance] Dice "wordmark Sensei Studio (asset)", pero en Figma 11:27 es un nodo de TEXTO (DM Sans 800,
  "Sensei " 160px + "Studio." 40px). No existe un asset del wordmark del hero: `imgBrandingLogo.svg` e `imgVector.svg`
  son el logo "Sensei®" del header y del branding, y el antiguo `public/assets/figma/sensei-wordmark.svg` (git HEAD)
  es ese mismo vector de 99×26. Renderizarlo como texto es lo fiel a Figma. Sugerencia para el orquestador: corregir el
  texto del acceptance (quitar "(asset)"). No hace falta cambiar código.
- [V6] El nombre accesible del h1 ("Sensei Studio: diseño, desarrollo y automatización con IA", `sr-only`) no coincide
  con el texto visible (`aria-hidden`). Se acepta porque no es un control interactivo (WCAG 2.5.3 no aplica) y el copy
  vive en `content/pages/home.ts`. Solo queda anotado.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE, ejecutado por el verifier. check:ds, check:arch, astro check, 28/28 tests y build en OK.
- **V2 (1440)**: medidas CDP comparadas con Figma (x, y, ancho, alto):
  - section 0,52 · 1440×799, que sumado al header de 52 da el 11:13 de 851. OK.
  - Wordmark 11:27, caja Figma con borde derecho en 576 y top 169: h1 en 60,169, caja de 516 alineada a la derecha.
    "Sensei" llega a 576 y "Studio." va de 437 a 576 con top 341. El blend contra el screenshot coincide en glifos
    y baselines (desvío de 2px o menos).
  - Fuente: DM Sans 800 con opsz 14, fijado en la URL de Google Fonts, igual que en Figma (`"opsz" 14`). Tamaños de
    160 y 40px.
  - Lista 11:41: en 1131,262 (Figma calc(80%−21px)=1131, top 262). Google Sans Flex 600 18px, leading 2.23, orden
    de los 5 ítems idéntico.
  - Lead 11:25: en 60,669 con ancho 536 (Figma 60/669/536). 20px y peso 500. Tono strong en paper y muted en
    `paper-muted` #AFAFAF, igual que el fill de Figma.
  - Regla 11:24: en 864,842, 576×9, `bg-brand` #E4FF40. Figma: left 60%, top 842, h 9, ancho 608 recortado por el
    frame a 576. OK.
  - Fondo `bg-ink` #090909 + `surface-noise`. Ruido calibrado (alfa 0.07), con luminancia media 16.9 frente a 16.8.
    El blend visual no muestra diferencias de tono.
- **Posiciones absolutas traducidas a layout real**: flex col en mobile y `lg:flex-row justify-between` para
  wordmark | lista. Los offsets se expresan como tokens de flujo (`mt-93`, `min-h-(--hero-stage)`,
  `pt-(--hero-pad-top)`, `w-249`, `w-516`). El único `absolute` es la regla lima decorativa (`left-3/5 right-0
  bottom-0`), que queda justificada.
- **V3**: sin scroll horizontal (scrollWidth = viewport) en 375, 768, 1024, 1280, 1440 y 1920. En 375 y 768 todo va
  apilado y legible: wordmark de 88 y 114px dentro del contenedor, lead que se ajusta sin cortes. En 1024 y 1280 la
  fila wordmark | lista mantiene la proporción. El hero no tiene elementos interactivos, así que no aplica el área
  táctil.
- **V4**: el hero no tiene assets de imagen en Figma (el wordmark es texto, ver Menores). La textura de ruido es
  `src/assets/textures/noise.svg`, vía token. No hay sustitutos.
- **V5**: grep sin coincidencias para `client:load`, `any`, `ds-allow`, valores arbitrarios `[…]`, hex en
  `.astro`/`.svelte`, z-index mágico e imports entre módulos. Todo el copy está en `src/content/pages/home.ts`; el
  componente solo lee `section.content`. No hay islas.
- **Anatomía del módulo**: `schema.ts` tipa `HeroContent` y `HeroSection = SectionBase<'hero', …>`. `Section.astro`
  recibe `section` tipado. `index.ts` expone solo `Section` y los tipos. En `app/`, `sections.ts` tiene
  `Section = HeroSection` y `registry.ts` tiene `hero: Hero satisfies SectionRegistry` (exhaustivo en compilación);
  ambos importan desde `@/modules/hero` (index) y no desde rutas internas.
- **V6**: exactamente 1 h1 en todos los anchos (`h1count = 1`). El h1 provisional se quitó de
  `src/pages/[...slug].astro`. `section aria-labelledby` apunta al h1, la lista tiene `aria-label` desde contenido y
  la regla es `aria-hidden`.
- **V7**: los cambios coinciden con el informe (módulo hero, registro en app, home.ts, quitar el h1 provisional,
  tokens, alfa del ruido, test y docs regenerados). Todo está dentro del acceptance.
