# Convenciones

## General

- TypeScript estricto. Sin `any`. Los tipos se exportan junto a los datos.
- Contenido visible y documentación en español; identificadores en inglés.
- Comentarios solo para explicar un *por qué* que no sea obvio.
- **Cero copy en componentes**: todo texto o imagen visible viene de `src/content/`.
- Sin dependencias nuevas sin justificarlo en `progress/impl_<id>.md`.

## Sistema de diseño: Tailwind por defecto + tokens propios

Fuente de verdad: `src/styles/tokens.css`. Resumen legible: `docs/design-system.md`.

1. **No se sobrescribe Tailwind.** Nada de `--<ns>-*: initial`: la paleta (`black`,
   `white`, `neutral-*`…), la escala de espaciado (`p-4` = 16px), tamaños de texto,
   radios, sombras, easings y breakpoints por defecto siguen disponibles. Tampoco se
   redefine un nombre por defecto con otro valor (`leading-normal`, `tracking-tight`…):
   un valor propio lleva nombre propio. Única excepción: `--breakpoint-2xl: 1440px`.
2. **`tokens.css` solo tiene lo que se usa**: marca (`brand`, `ink`, `paper`…), roles de
   texto (`text-h2`, `text-body`…), medidas de sección y motion. Si un valor de Tailwind
   sirve, se usa el de Tailwind y no se crea token. Un token sin uso se borra.
   Comentario solo si el *por qué* no es obvio (una línea).
3. **Prohibido en `src/`, fuera de `tokens.css`** (lo comprueba `pnpm check:ds`):
   - valores arbitrarios de Tailwind con `[...]`;
   - hex, `rgb()` y `rgba()`;
   - `px` en `style=""`.

   Para referenciar un token: `bg-brand`, `p-10` o `w-(--width-card)`.
   Si hace falta una excepción, se marca en la línea con `/* ds-allow: motivo */` o
   `<!-- ds-allow: motivo -->`, y el verifier la revisa.
4. **Espaciado = escala nativa de Tailwind** (`--spacing: 0.25rem`): 20px es `p-5`,
   17px es `p-4.25`. No se declaran `--spacing-N` en px.
5. **Texto como roles**, no como tamaños: `text-h2`, `text-body`, `text-eyebrow`…
   Cada rol define tamaño, interlineado, tracking y peso, y tiene su versión mobile.

## Responsive: mobile first, desktop exacto

- Estilos base = mobile (375px de referencia). Se sube con `sm: md: lg: xl: 2xl:`.
- `2xl` = **1440px**: desde ahí el render debe coincidir con Figma.
- Entre breakpoints se usan tamaños fluidos con `clamp()` definidos como tokens,
  con mínimo en mobile y máximo en desktop.
- Nada de posiciones absolutas de Figma: se traducen a flex o grid. Solo los elementos
  decorativos (badge, regla lima, galería del footer) pueden ser `absolute`.

## Astro

- PascalCase. Props tipadas con `interface Props`.
- Accesibilidad: un solo `h1` por página, h2 por sección (`aria-labelledby`),
  `alt` en imágenes de contenido y `alt=""` en las decorativas, foco visible.
- Imágenes de contenido: el dato es un `MediaRef` (`src` cadena, docs/content-model.md) y lo pinta
  `shared/ui/Photo.astro`: clave local de `src/assets/` → `<Picture>` de `astro:assets`, recortada en
  el servidor con su encuadre (`position`). Nada de fotos de stock ni imágenes de relleno: solo piezas
  de los proyectos y del portafolio del estudio; una persona sin foto → `UserPlaceholder`.
  En `public/` solo van favicon y archivos que no se procesan.

## Svelte (islas)

- Svelte 5 con runes (`$state`, `$derived`, `$props`). Sin stores globales.
- Props tipadas (`let { items }: Props = $props()`).
- Respetar `prefers-reduced-motion` en toda animación.
- Accesibilidad de patrones: el acordeón usa `button[aria-expanded]` + `aria-controls`;
  un carrusel o marquee que se mueve solo debe poder pausarse.

## Motion

Primitivas sin dominio en `src/shared/lib/motion/` (API: `index.ts`), tokens en
`tokens.css` (`--duration-*`, `--ease-*`, `--motion-distance-*`, `--animate-reveal-up`,
`--animate-enter-from-*`) y utilidades en `global.css`.

### Qué herramienta usar

| Caso | Herramienta |
|---|---|
| Hover, foco, cambios de color/opacidad | Utilidades de Tailwind (`transition-*`, `duration-(--duration-fast)`, `motion-safe:`) |
| Card con capa de detalle en hover/foco | `can-hover:` decide QUÉ capa se ve (sin hover = solo estado inicial) y `motion-safe:` si hay transición; `card-active:` sobre `[data-card]`. `hover-motion:` solo para lo que anima JS (MOB-CARDS-INITIAL) |
| Entrada al viewport (con escalonado) | Utilidades `reveal-up` + `reveal()` / `revealAll()` |
| Expansión de un panel (acordeón) | Utilidad `collapsible` (grid-template-rows 0fr→1fr) + `data-open` declarativo en la isla (ver `AccordionController` en `@/shared/lib/accordion-controller.svelte`) |
| Entrada lateral de los elementos de un panel abierto | `enter-from-left` / `enter-from-right` (lado fijo) o `enter-from-side` + `markEntrySides()` |
| Texto que se escribe | `createTypewriter()` / `typewriter()` |
| Cifras que cuentan de 0 a su valor (métricas) | `data-count-up` + `data-count` y `countUpAll()` / `countUp()`: el HTML trae el valor final; prefijo/sufijo intactos; `--duration-count` + `ease-enter`, escalonado con `--duration-stagger`, una vez |
| Imágenes (blur/escala), secuencias orquestadas | `animateTo()`, `sequence()` (Motion) |
| Bucles: carruseles, rueda | `loop()` (Motion) o el bucle propio de la isla, siempre con `createAutoplay()` + `bindAutoplay()` |
| Sliders (swipe táctil, bucle continuo o por pasos) | Primitivas de `@/shared/lib/slider` (`bindSwipe`, `appendLoopClones`, `advanceLoop` / `nextStep` + `tweenScroll`, `createInteractionPause`) dentro del componente de cada slider (`docs/components.md` › Sliders) |

- **Motion** ([motion.dev](https://motion.dev), paquete `motion`, API vanilla `animate`/`inView`/`scroll`)
  solo se importa dentro de `src/shared/lib/motion/` (lo hace cumplir `check:arch`).
  `framer-motion`, `motion/react` y `react` están prohibidos en `src/`. El `animate` que
  usamos es el de `motion/mini` (WAAPI): pesa poco y no carga el motor de springs.
- Las primitivas tienen forma de *attachment* de Svelte 5: `(node) => cleanup`.
  En una isla: `{@attach reveal({ items: 'li' })}`. En una sección sin isla, un `<script>`
  de Astro: `import { revealAll } from '@/shared/lib/motion'; revealAll();`.
- La lógica solo pone **atributos** (`data-inview`, `data-open`, `data-side`) y
  `--motion-index`; el estado visual lo deciden las utilidades. Nada de estilos inline animados
  salvo los que escribe Motion.

### Reglas

1. **Solo `transform` y `opacity`** (y `filter` en transiciones de imagen). Excepción
   documentada: `collapsible` anima `grid-template-rows` (cambio de alto pedido por el usuario).
2. **Sin CLS**: los desplazamientos son `transform`; el typewriter reserva el sitio con el texto
   completo transparente.
3. **`prefers-reduced-motion: reduce` = estado final visible**: las utilidades no animan ni
   ocultan; `reveal()` marca `data-inview` al instante; `typewriter` no toca el DOM;
   `animateTo()` dura 0; `loop()` devuelve `null`; `sequence()` salta al final;
   `bindAutoplay()` pausa. Las cards con capa de hover no saltan a su detalle: con reduced-motion
   el cambio de capa en hover/foco es instantáneo, y sin hover (táctil) se quedan en su estado inicial.
4. **Progressive enhancement**: el estado oculto inicial solo existe con
   `@media (scripting: enabled)`. Sin JS, todo visible; `collapsible`, abierto.
5. **Una sola vez** para las entradas al viewport (no se vuelven a ocultar al salir).
6. **Lo que se mueve solo se puede pausar** (WCAG 2.2.2): `createAutoplay()` combina motivos de
   pausa (foco de teclado, pestaña oculta, fuera de viewport, reduced motion, gestos y el botón
   del usuario, que no se reanuda al perder el foco). El botón de pausa usa
   `aria-pressed={controller.userPaused}`. **El hover no pausa** ningún slider ni bucle
   (MOT-SLIDERS-SHOWCASE): ni `bindAutoplay()` ni `group-hover:play-paused` en los CSS. Única
   excepción: el motivo `pointer` de TeamSlider, solo sobre una card con enlaces (perfiles).
7. **Tiempos y curvas desde tokens**: en CSS con `var(--duration-*)`; en JS con
   `durationMs('reveal')` / `ease('enter')`. Una sección que necesite otro tiempo (p. ej. la vuelta
   de la rueda) declara su token.

### Patrón: entrada escalonada (1s por elemento, +200ms cada uno)

```astro
<ol data-reveal="[data-reveal-item]">
  {steps.map((s) => <li data-reveal-item class="reveal-up">…</li>)}
</ol>
<script>
  import { revealAll } from '@/shared/lib/motion';
  revealAll();
</script>
```

El índice también puede fijarse en el marcado: `style={staggerStyle(i)}`.

**Cuándo dispara y retardo inicial** (MOT-PROCESS-TIMING). Son parámetros de la primitiva,
no casos especiales:

- `data-reveal-amount="0.3"` → opción `amount` de `reveal()` (fracción visible, 0–1; por defecto 0.2).
- `data-reveal-margin="0px 0px -20% 0px"` → opción `margin` (rootMargin). Para "disparar más
  tarde" se prefiere un margen inferior negativo: no depende del alto del contenedor (con
  `amount` alto, una lista más alta que el viewport puede no dispararse nunca).
- Retardo inicial antes del primer elemento: utilidad `reveal-delay-<nombre>` en el contenedor,
  sobre un token `--delay-reveal-<nombre>`. Se suma al escalonado:
  `--reveal-delay + --motion-index × --duration-stagger`.

```astro
<ol data-reveal="[data-reveal-item]" data-reveal-amount="0" data-reveal-margin="0px 0px -20% 0px"
    class="reveal-delay-process">…</ol>
```

**Sección completa con cabecera** (MOT-REVEAL: testimonios, FAQ, contacto). El `<script>`
siempre acotado a la sección (`for (const s of document.querySelectorAll('[data-<mod>-section]')) revealAll(s)`),
nunca `revealAll()` sobre todo el documento. Las dos partes de `SectionHeader` (eyebrow + h2 y
aside) llevan la marca neutra `data-head-part`; la sección las anima desde su contenedor con
la variante `head-parts:` y las incluye en el selector de items, así el escalonado sigue el
orden del documento (cabecera → aside → contenido) sin añadir props a la librería:

```astro
<div data-reveal="[data-head-part], [data-reveal-item]" data-reveal-amount="0"
     data-reveal-margin="0px 0px -15% 0px" class="container-page head-parts:reveal-up">
  <SectionHeader … />
  <div data-reveal-item class="reveal-up">…contenido…</div>
</div>
```

No anidar `reveal-*` (un item dentro de otro compone transform y opacidad).

### Patrón: acordeón con expansión y entrada lateral

```svelte
<button aria-expanded={open} aria-controls={ids.panel} onclick={toggle}>…</button>
<div id={ids.panel} class="collapsible" data-open={open || undefined}>
  <div>
    <img class="enter-from-left" style={staggerStyle(0)} … />
    <p class="enter-from-right" style={staggerStyle(1)}>…</p>
  </div>
</div>
```

## Git

- No commitear sin que el usuario lo pida.

## Librería de componentes

La librería vive en `src/shared/ui/` y se construye **sobre** el sistema de diseño
(`tokens.css`): un componente nunca introduce valores propios. Catálogo: `docs/components.md`
y la página interna `/componentes`.

1. **Mismo rigor a todos los niveles**: un `Input` o un `FieldError` se diseñan, documentan
   y verifican igual que un `SectionHeader` o un slider.
2. **Pocas props, sin variantes.** Nada de `variant="primary|ghost|dark"`, ni booleanos que
   cambien el aspecto (`dark`, `small`, `outlined`…). Si dos usos se ven distintos, son
   **dos componentes con nombre propio** (`ButtonPrimary`, `ButtonOnInk`). Máximo ~4 props
   de datos; lo demás se compone con slots/children.
3. **Un componente por slider.** `ShowcaseCarousel` y `TeamSlider` son componentes
   distintos; lo que comparten (swipe, autoplay, pausa) son primitivas de `shared/lib`,
   no props de configuración.
4. **Sin copy y sin dominio**: reciben datos ya resueltos desde `src/content/`.
5. **Un componente con contexto propio vive en su propio archivo** (cards, items de lista,
   slides…): nunca se escribe inline dentro del `.map()` de una sección. La sección solo
   coloca y pasa datos.
6. **Los módulos consumen la librería**: si un módulo necesita un patrón que no existe, se
   agrega primero a la librería (con su entrada en `docs/components.md`) y luego se usa.
