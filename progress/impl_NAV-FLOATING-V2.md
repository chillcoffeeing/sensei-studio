# impl NAV-FLOATING-V2: barra flotante abajo (Cotizar proyecto + Solicitar asesoría + WhatsApp)

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, nodo 218:21. `get_design_context` con screenshot, completo:
píldora glass (blanco 50 %, blur 8, borde ink/8, sombra 0 10 24 negro/8, padding 12/16, gap 12) con
272:7924 lima "Cotizar proyecto" (176 de ancho), 218:22 blanco "Solicitar Asesoría" (181) y 218:24
círculo ink de 39 (WhatsApp, sin icono en el nodo). El icono es el `whatsapp.svg` (Simple Icons) que
ya vivía en `src/assets/floating-bar/`; no hay assets nuevos.

## Archivos

- `src/layout/FloatingBar.svelte`: reescrito. Fija abajo y centrada (`bottom-(--floating-bar-bottom)`). Ya no tiene sentinel ni anclaje al hero. Hace la entrada al hidratar y se aparta de las zonas `[data-floating-bar-avoid]` con un `IntersectionObserver` (franja inferior del 25 %). Cuando se oculta queda `inert`.
- `src/layout/FloatingActionLink.svelte`: nuevo, sustituye a `FloatingQuoteLink.svelte` (borrado). Es la píldora `tone="brand" | "paper"`, con `label` + `shortLabel` y que reenvía atributos (`data-quote-open`, `data-advice-open`).
- `src/layout/FloatingWhatsAppLink.svelte`: pasa de píldora con texto a círculo ink de 44 con el logo de 20, con `aria-label` = "WhatsApp (se abre en una pestaña nueva)", `target="_blank"` y `rel="noopener noreferrer"`.
- `src/layout/BaseLayout.astro`: pasa `advice` a la isla y cambia el comentario.
- `src/layout/Footer.astro`: `data-floating-bar-avoid`.
- `src/modules/contact/Section.astro`: `data-floating-bar-avoid` (el formulario de la landing).
- `src/modules/project-contact/Section.astro`: `data-floating-bar-avoid` (el CTA final del caso).
- `src/modules/hero/Section.astro`: quitados `data-page-hero` y su comentario.
- `src/modules/project-hero/Section.astro`: quitado `data-page-hero`. El padding del pie pasa de `pb-(--floating-bar-room) lg:py-9.5` a `pb-9.5` (el hueco ya no hace falta).
- `src/core/site.ts`: `SiteFloatingBar.advice` y el tipo `FloatingBarAction` (`Link` + `shortLabel`). Doc actualizada.
- `src/content/site.ts`: copy de `advice` y `shortLabel` de las dos acciones.
- `src/styles/tokens.css`: tokens (ver abajo).
- `src/styles/global.css`: borradas las utilidades `floating-bar-anchored` y `floating-bar-trigger`.
- `docs/architecture.md`: la sección "Enganche hero ↔ barra flotante" pasa a "Barra flotante (`data-floating-bar-avoid`, `data-advice-open`)", y se corrige la lista de quién usa `data-quote-open`.
- `docs/components.md`: filas de la barra.
- `docs/design-system.md`: tokens de la barra.
- `progress/current.md`: el plan.

## Enganche para ADV-MODAL

"Solicitar asesoría" es `<a href="/#contacto" data-advice-open>`. ADV-MODAL solo tiene que delegar en
`document` los clics en `[data-advice-open]`, igual que `QuoteDialog` con `[data-quote-open]`
(preventDefault y abrir). Sin JS, o hasta que exista el modal, lleva al formulario. Está documentado en
`docs/architecture.md › Barra flotante` y en `core/site.ts`.

## Tokens

- **Agregado** `--floating-bar-bottom: calc(var(--spacing) * 4 + env(safe-area-inset-bottom, 0px))`: separación de 16px del borde más el safe-area de iOS.
- **Borrados** (sin uso tras quitar el anclaje): `--floating-bar-top`, `--floating-bar-rise` y `--floating-bar-room`.
- `--hero-pad-bottom` vuelve a su valor previo a NAV-FLOATING: `clamp(56px, 47.549px + 2.2535vw, 80px)` (56 → 80, de 375 a 1440).
- Se mantiene `--z-index-floating-bar: 30` (sobre el header, bajo el menú mobile). También se mantiene el `has-aria-expanded:z-menu` del header.

## Desviaciones de Figma (y motivo)

- **Mobile (< sm)**: texto visible corto, "Cotizar" y "Asesoría", porque con el texto completo la barra mediría unos 380px y no cabe en 375. El nombre accesible sigue siendo el completo: el corto va `aria-hidden` y el completo `max-sm:sr-only`, así el nombre contiene lo visible (WCAG 2.5.3). Desde sm se ve el texto completo de Figma. Ancho medido: 248px a 320 y 375, y 401px desde 768.
- **Alto 44 (`h-11`/`size-11`)** en vez de 39–40, por área táctil. Padding y gap del contenedor: 6/6 en mobile y 8/8 desde sm (Figma: 12/16 y 12), para que quepa compacta.
- **Superficie**: `bg-paper/60` + `backdrop-blur-md` + `saturate-150` (Figma: /50 + blur 8). Así lee mejor sobre secciones ink e imágenes. El contraste AA no depende del fondo porque las tres acciones son opacas: ink sobre lima, ink sobre paper y paper sobre ink.
- **"Solicitar asesoría"**: `bg-paper` opaco, como el blanco de Figma. Sobre el glass se ve "sin relleno", pero garantiza el contraste.
- **WhatsApp**: icono de 20 dentro del círculo de 44. En el nodo el círculo está vacío.
- **Hover**: elevación de 2px, solo con hover real y motion-safe. **Foco**: outline ink + ring paper.

## Comportamiento y responsive

- **Posición**: fija abajo y centrada en todo el sitio (`/links` usa StandaloneLayout y no la tiene).
- **Sin CLS**: siempre `fixed`, y solo se animan `translate` y `opacity`.
- **Entrada**: con JS arranca `scripting:translate-y-full scripting:opacity-0` y sube al hidratar (rAF). Sin JS, los estados ocultos no existen y queda visible.
- **Reduced motion**: `motion-reduce:transition-none`, la entrada y la salida son instantáneas.
- **No tapa contenido crítico**: se aparta (baja + fundido, `pointer-events-none`, `inert`) cuando el formulario de contacto, el CTA final del caso o el footer entran en el 25 % inferior del viewport. Por eso no hace falta reservar hueco al pie.
- **Comprobado con CDP** (Chrome headless, perfil temporal en `mkdtemp`, solo se cierra su PID):
  - home a 375, final de página: opacity 0 e inert;
  - home a 375, scroll 2000: opacity 1;
  - `/proyectos/yupa/` a 1440, final: opacity 0 e inert;
  - `scrollWidth` igual al viewport en 320, 375, 768, 1024 y 1440;
  - bottom a 16px.
  - Capturas: `fb2/home-375.jpg` y `fb2/home-1440.jpg` en el scratchpad.
- **Safe-area**: `env()` vale 0 sin `viewport-fit=cover`. No cambio el meta viewport (afectaría a todo el sitio en landscape), así que el token ya está listo si se activa.

## Pendientes heredados

- El número de WhatsApp sigue PENDIENTE (`https://wa.me/` en `src/content/site.ts`).

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
