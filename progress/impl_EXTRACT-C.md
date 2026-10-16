# impl EXTRACT-C — Extracción C: bloques de diseño dentro de contenedores

Refactor sin cambio visual ni de comportamiento. El marcado, las clases, los `data-*`, los `aria-*`
y el orden del DOM se mueven tal cual. No hay tokens nuevos, ni Figma (la feature no trae
`figmaNodes`), ni dependencias nuevas.

## Archivos

Creados:
- `src/modules/hero/HeroBackgroundVideo.astro`: C1. Capa `data-background-layer` + `<video data-background-video>` + velo (prop `video`). Incluye el `<script>` de `bindBackgroundVideos()`.
- `src/modules/hero/HeroWordmark.astro`: C1. El `h1` con su texto `sr-only` y el wordmark `aria-hidden` (props `id`, `label`, `wordmark`).
- `src/modules/contact/ContactBackdrop.astro`: C2. Imagen de fondo al 30 % + velo `bg-scrim` (prop `image`).
- `src/modules/contact/ContactLegal.astro`: C2. Párrafo legal con enlaces en pestaña nueva y aviso `sr-only` (props `parts`, `lang?`, `newTabHint`).
- `src/modules/project/HeroCover.astro`: C3. `<Picture>` a sangre + sombra editorial (prop `cover`).
- `src/modules/project/HeroIdentity.astro`: C3. Volver/estado, `h1` y categoría (props `headingId`, `back`, `status`, `name`, `category`).
- `src/modules/project/SolutionStoreBrowserBar.astro`: C4. Barra del navegador con los 3 controles y la URL (prop `url`).
- `src/modules/project/SolutionStoreMenu.astro`: C4. Logo, categorías (desde md) y acciones (props `brand`, `categories`, `actions`).
- `src/modules/project/SolutionStoreBenefits.astro`: C4. Fila de beneficios (prop `benefits`).
- `src/modules/project/SolutionStoreProduct.astro`: C5. Ficha del mock móvil: nombre, detalles, color, muestras, tallas, CTA y nota (prop `product`).
- `src/modules/project/ProcessRoute.astro`: C6. Ruta con separador `aria-hidden` (props `steps`, `separator`).
- `src/layout/quote/QuoteBudgetMax.svelte`: C7. Label + `QuoteInput` + error del monto máximo (props `field`, `currency`, `value` bindable, `error`, `ref` bindable).
- `src/layout/quote/QuoteIdea.svelte`: C8. Pista, caja con textarea y ayuda, y error (props `hint`, `field`, `value` bindable, `error`, `ref` bindable).
- `src/layout/quote/QuoteGoals.svelte`: C8. Grupo de objetivos (props `goals`, `selected` bindable).
- `src/shared/ui/TeamCardRest.astro`: C9. Capa de reposo (props `name`, `role`).
- `src/shared/ui/TeamCardDetail.astro`: C9. Capa de detalle con los `data-team-type` (prop `person`).
- `src/layout/HeaderNav.astro`: C10. Nav de escritorio con `LinkNav` y `data-quote-open` (props `label`, `items`).

Modificados:
- `src/modules/hero/Section.astro`: usa `HeroBackgroundVideo` y `HeroWordmark`. `data-page-hero` sigue en la `<section>`.
- `src/modules/contact/Section.astro`: usa `ContactBackdrop` y `ContactLegal`. La card `data-reveal` y el script de `revealAll` siguen aquí.
- `src/modules/project/ProjectHero.astro`: usa `HeroCover` y `HeroIdentity`. `data-page-hero` y `aria-labelledby` siguen en la sección.
- `src/modules/project/SolutionStoreDesktop.astro`: compone barra, menú, campaña y beneficios dentro del `role="img"`/`aria-hidden`.
- `src/modules/project/SolutionStoreMobile.astro`: usa `SolutionStoreProduct`. La cabecera y la foto se quedan.
- `src/modules/project/ProcessIntro.astro`: usa `ProcessRoute`.
- `src/layout/quote/QuoteBudget.svelte`: usa `QuoteBudgetMax` y deja de importar `QuoteInput`, `QuoteFieldError` y `quote-form`.
- `src/layout/quote/QuoteProject.svelte`: título + `QuoteIdea` + `QuoteGoals`.
- `src/shared/ui/TeamCard.astro`: raíz, foto y orden de capas + `TeamCardRest` y `TeamCardDetail`.
- `src/layout/Header.astro`: usa `HeaderNav`.
- `docs/components.md`: piezas internas de `TeamCard`, consumidor `Header` (+ `HeaderNav`), filas de hero, contacto, portada/mocks/ruta de proyecto y modal de cotización.
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Decisiones

- **Ubicación**: cada pieza va en el módulo o en la carpeta de su único consumidor. Hero, contacto
  y proyecto van a su módulo; quote, a `layout/quote/`; `HeaderNav`, a `layout/`. Las capas de
  `TeamCard` van a `shared/ui/` porque su padre vive ahí y `shared` no puede importar módulos. No
  tienen entrada en `/componentes`. Siguen el precedente de EXTRACT-B: se documentan como piezas
  internas en la ficha de `TeamCard`.
- **Nombres**: en `modules/project` se mantiene el prefijo por bloque que ya usa el módulo.
  `StoreBrowserBar`, `StoreMenu`, `StoreBenefits` y `StoreMobileProduct` pasan a ser
  `SolutionStoreBrowserBar`, `SolutionStoreMenu`, `SolutionStoreBenefits` y `SolutionStoreProduct`.
  `SolutionStoreProduct` sigue el tipo `ProjectStoreProduct`. `HeroCover`, `HeroIdentity` y
  `ProcessRoute` ya llevaban el prefijo correcto. En el hero del home, los componentes se llaman
  como los tipos del schema (`HeroWordmark`, `HeroBackgroundVideo`). No hay colisión, porque
  `Section.astro` no importa esos tipos y cada componente importa el suyo.
- **Ganchos conservados**:
  - `data-page-hero` sigue en las dos `<section>` (home y proyecto). La barra flotante busca el mismo elemento.
  - `data-background-layer` y `data-background-video` se mueven tal cual. El `<script>` de
    `bindBackgroundVideos()` pasa de `hero/Section.astro` a `HeroBackgroundVideo.astro` (va con su
    video). En el HTML es el mismo módulo (mismo hash, `BEgijcn4.js`), cargado solo cuando hay
    video. Antes se cargaba siempre y, sin video, no hacía nada.
  - `data-reveal-item` + `reveal-up` del párrafo legal: los lleva `ContactLegal` en su `<p>`.
    `revealAll` los busca con `querySelectorAll` dentro de la card, y el DOM queda idéntico.
  - `data-team-card`, `data-team-photo` y `data-card` siguen en `TeamCard`. `data-team-type`
    está en `TeamCardDetail`. `hover.ts` busca con `querySelector(All)` dentro de la card, y el
    orden (reposo, detalle) no cambia, así que `stack-layers` apila igual.
  - `data-quote-open` del nav sigue en `LinkNav` dentro de `HeaderNav`.
  - Refs del modal para enfocar errores. La cadena de bindings es
    `QuoteDialog bind:ideaRef` → `QuoteProject ideaRef $bindable` → `QuoteIdea bind:ref` → `bind:this`.
    El monto máximo pasa por `maxRef` → `QuoteBudgetMax bind:ref` → `QuoteInput bind:ref`. Los
    valores (`idea`, `goals`, `max`) siguen con `$bindable`.
  - Ids aria: `quoteIds('idea')`, `quote-idea-helper`, `quote-goals-title` y `quoteIds('max')` se
    calculan dentro de cada componente con el mismo valor. `quote-idea-title` sigue en
    `QuoteProject` junto al título.
- **Sin envoltorios nuevos**: `QuoteIdea` tiene tres nodos raíz (pista, caja y error) para que
  sigan siendo hijos del `flex-col gap-2.5` de `QuoteProject`. `HeroCover` tiene dos raíces
  (foto y sombra) dentro del contenedor `relative isolate`.
- **Props mínimos, sin flags ni variantes de estilo.**
- **Descartes**: ninguno. Los diez puntos se implementaron. El único caso dudoso fue
  `SolutionStoreBenefits`, que es un solo `div` con un `.map`. Se extrajo igual porque así el mock
  de escritorio se lee como sus cuatro bloques de Figma (barra, menú, campaña, beneficios) y el
  padre solo compone.
- **Comprobación del HTML generado**: se compiló antes y después y se compararon
  `index.html`, `proyectos/origen/index.html` y `componentes/index.html`, con los hashes de
  `/_astro/*.js` y los `uid` de islas normalizados. Solo hay dos diferencias:
  1. La etiqueta `<script>` del video de fondo cambia de posición en el `<body>`: antes iba justo después de la sección del hero y ahora va dentro, tras `[data-background-layer]`. Es el mismo archivo, `type="module"`, sin efecto visual (corregido por el orquestador según verify_EXTRACT-C).
  2. Hay marcadores de hidratación de Svelte (`<!---->`) en el SSR del modal, por los nuevos
     límites de componente. No cambia ningún elemento, clase ni atributo.
- **Responsive inferido**: no aplica. No cambia ninguna clase ni ningún breakpoint.

## Tokens

No se agregó ni se quitó ninguno.

## init.ps1

```
[OK] node v22.20.0 / pnpm v11.1.3 / pnpm install / estado (1 in_progress)
check:ds   → 0 ds-allow · 0 error(es)                 [OK]
check:arch → 241 archivos · 12 módulos · 0 error(es)  [OK]
astro check → 0 errors · 0 warnings · 1 hint (preexistente, BaseLayout.astro:87 'media')  [OK]
astro build [OK]
VERDE: todo en orden.
```
