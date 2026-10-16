# impl NAV-FLOATING: barra flotante global (Cotizar proyecto + WhatsApp)

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, nodo 218:21 (`floating-contact`). Pedí `get_design_context` (con
screenshot) y `get_screenshot`. Llegó completo: contenedor píldora (blanco al 50 %, blur 8, borde ink/8,
sombra 0 10 24 negro/8, padding 12/16, gap 12) y dos píldoras: 218:22 lima "Cotizar proyecto" y 218:24 ink
"WhatsApp" con un icono de 16 px (218:28). El asset se descargó del nodo y se usa tal cual.

## Archivos

- `src/layout/FloatingBar.svelte`: nuevo. Isla (`client:load`) con el sentinel, el `IntersectionObserver` y un `ResizeObserver`. Tiene cuatro estados (`pending`, `anchored`, `fixed`, `bottom`) y dos capas de superficie que se cruzan por opacidad.
- `src/layout/FloatingQuoteLink.svelte`: nuevo. Píldora lima `<a href data-quote-open>` (props: `href`, `label`).
- `src/layout/FloatingWhatsAppLink.svelte`: nuevo. Píldora ink con icono, enlace externo con `target="_blank"` y `rel="noopener noreferrer"`, más un aviso solo para lectores de pantalla (props: `href`, `label`, `newTab`, `icon`).
- `src/layout/BaseLayout.astro`: monta la barra entre el header y `<slot />` (orden de foco: header → barra → main). El icono se pasa como datos serializables.
- `src/core/site.ts`: tipo `SiteFloatingBar` y `SiteChrome.floatingBar`.
- `src/content/site.ts`: copy y destinos de `floatingBar`. El número de WhatsApp vive solo aquí (PENDIENTE).
- `src/assets/floating-bar/circle-x.svg`: icono 218:28 de Figma, sin modificar (16×16).
- `src/modules/hero/Section.astro`: atributo `data-page-hero` y comentario.
- `src/modules/project/ProjectHero.astro`: atributo `data-page-hero`. El padding inferior del contenedor pasa a `pb-(--floating-bar-room)` hasta lg; desde lg sigue en `py-9.5`.
- `src/styles/tokens.css`: tokens nuevos (ver abajo). `--hero-pad-bottom` pasa a valer `var(--floating-bar-room)`.
- `src/styles/global.css`: utilidades `floating-bar-anchored` y `floating-bar-trigger`.
- `docs/architecture.md`: nueva sección "Enganche hero ↔ barra flotante (`data-page-hero`)".
- `docs/components.md`: fila en "Quién consume qué" y en "Fuera de la librería".
- `docs/design-system.md`: `z-floating-bar` y los `--floating-bar-*`.
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

## Enganche con el hero (sin acoplar layout a módulos)

- El hero de cada página pone el atributo neutro `data-page-hero` en su `<section>`. La isla lo busca en el DOM y no importa ningún módulo, así que check:arch sigue en verde.
- La isla solo **mide** y escribe dos variables: `--floating-bar-anchor` (borde inferior del hero en coordenadas de documento) y `--floating-bar-h` (alto de la barra). La posición la calculan las utilidades de `global.css` con tokens.
- Un sentinel de 1px va justo donde la barra anclada toca `--floating-bar-top`. Cuando el `IntersectionObserver` lo ve salir por arriba, la barra pasa a `fixed top-(--floating-bar-top)`. No hay listeners de scroll.
- Sin CLS: la barra nunca está en flujo (alterna entre absolute y fixed), y el cambio ocurre cuando las dos posiciones coinciden. Medido a 1024: con scroll 650 → top 15, con 653 → top 12 (fija), con 700 → 12.
- **Header**: el header no es sticky. La barra se fija cuando el pie del hero llega arriba, y para entonces el header ya salió de la vista. Va con z 30: por encima del header (20) y por debajo del menú mobile (50).
- **Página sin `data-page-hero`** (p. ej. `/componentes`): la barra queda fija abajo, porque arriba tapaba el nav (comprobado en la captura).
- **Sin JS**: fija abajo y visible. Con JS, el estado `pending` la oculta (`scripting:invisible opacity-0`) hasta la primera medida, y luego aparece con un fundido de opacidad.

## "Cotizar proyecto" y WhatsApp

- "Cotizar proyecto" es `<a href="/#contacto" data-quote-open>`, el mismo enganche que `ContactQuoteLink` de PRJ-CLOSING. QTE-MODAL solo tiene que delegar `[data-quote-open]`. Sin JS, el enlace lleva al formulario de la landing.
- **PENDIENTE: número de WhatsApp.** No existe en el contenido ni en el copy. Queda `href: 'https://wa.me/'` en `src/content/site.ts › floatingBar.whatsapp.href`, con un comentario del formato esperado (`https://wa.me/<prefijo+número sin +>`).
- **Icono**: Figma usa "circle-x" (un aspa dentro de un círculo) en el botón de WhatsApp. Lo mantengo porque es el asset del nodo y la regla prohíbe sustituirlo, pero parece un placeholder. Recomiendo que diseño lo cambie por el logo de WhatsApp.

## Tokens agregados

- `--z-index-floating-bar: 30` (`z-floating-bar`): capa entre el header y el menú mobile.
- `--floating-bar-top: calc(var(--spacing) * 3)`: separación arriba al fijarse (12px, la misma que el `pt-3` del header).
- `--floating-bar-rise: clamp(16px → 24px)`: altura de la barra sobre el pie del hero.
- `--floating-bar-room: calc(var(--spacing) * 15 + 2 * --floating-bar-rise)`: hueco que el hero reserva (60 = `h-11` + `p-2` × 2).
- `--hero-pad-bottom` cambia de valor, de clamp(56 → 80) a `var(--floating-bar-room)` (92 → 108). Sin esto, la barra pisaba el lead de la home a 375 y a 1024. A 1440 el hero pasa de 851 a 852px.

El resto es nativo de Tailwind o ya existía: `bg-brand`, `bg-ink`, `text-ink`, `text-paper`, `rounded-pill`, `text-button`, `bg-paper/50`, `border-ink/8`, `shadow-lg`, `backdrop-blur-sm|lg`, `backdrop-saturate-150`, `bottom-4`, `h-11`, `p-2`, `gap-2`, `--duration-base|fast` y `ease-standard`.

## Desviaciones de Figma (y motivo)

- **Píldoras**: alto de 44px (`h-11`) en vez de unos 36px, para tener área táctil AA. El texto va a 15/600 (`text-button`) en vez de 13/600, por legibilidad. Ocupan el mismo ancho con `flex-1` y tienen padding 16 (20 desde sm). El contenedor tiene padding 8 y gap 8 en vez de 12/16 y 12: así la barra mide unos 307–323px de ancho y cabe en 320.
- **Superficie**: sobre el hero, la de Figma (`bg-paper/50`, blur 8, borde `ink/8`, `shadow-lg` como equivalente nativo de la sombra). Fija arriba, un glass más transparente (`bg-paper/30`, `backdrop-blur-lg`, `saturate-150`, borde `ink/10`) que se funde por opacidad. El contraste AA está garantizado porque las píldoras son opacas (ink sobre lima, paper sobre ink).
- **Hover**: elevación de 2px (`-translate-y-0.5`), solo con hover real y motion-safe. **Foco**: anillo ink con offset, que se ve sobre la superficie clara del contenedor.
- **Semántica**: el bloque es un `<aside aria-label="Contacto rápido">`. El icono es decorativo (`alt=""`).
- **Reduced motion**: sin transición de opacidad, y el cambio de estado es instantáneo.

## Responsive inferido

- **375**:
  - home: el hero reserva 92px al pie y la barra (307×60) queda centrada sobre él, debajo del lead y sin pisarlo;
  - proyecto: el hero (961px) es más alto que la pantalla, así que la barra aparece al acercarse a su pie, bajo la ficha;
  - en los dos casos, al hacer scroll se fija a 12px del borde superior.
- **768**: igual que en mobile, con la barra de 323px.
- **1024**:
  - home: lead → barra → borde, sin solaparse;
  - proyecto: la barra queda centrada entre "Explorar resultados" y la ficha, porque ahí sigue el `lg:py-9.5` original.
- **1440**: la barra queda centrada entre el lead y la regla lima en la home, y entre las columnas en el proyecto.
- **Sin desborde horizontal** en ningún ancho (`scrollWidth` igual al viewport).
- **Cómo lo verifiqué**: Chrome headless por CDP con perfil temporal propio en el scratchpad (solo se cierra ese proceso). Build servido con `http.server` en una tarea de fondo, detenida por su id. Probé también sin JS y con reduced motion.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds (0 errores), check:arch (186 archivos, 0 errores), astro check (0 errores) y astro build OK.

## Vuelta 2 (correcciones de progress/verify_NAV-FLOATING.md)

### Bloqueantes

- **Barra encima del menú mobile en páginas con `overlayHeader`.** Arreglado en `src/layout/Header.astro`. Con overlay, el header ahora lleva `z-header has-aria-expanded:z-menu`: mientras el toggle del menú tiene `aria-expanded="true"`, el header sube a 50 y su contexto de apilamiento queda por encima de la barra (30). Se usa la variante nativa de Tailwind (`:has([aria-expanded=true])`) y no hacen falta JS, tokens ni acoplar la barra al menú. Lo comprobé con CDP a 375 en `/`. Con el menú abierto en el top, `elementFromPoint` en el centro de la barra cae en el diálogo. Con la barra fija (scroll 1500) y el menú abierto, también cae en el diálogo. El z del header es 50 con el menú abierto y 20 cerrado.
- **Saltos de scroll que cruzan el punto de cambio.** Arreglado en `src/layout/FloatingBar.svelte` y en `src/styles/global.css`. El sentinel ya no mide 1px: va de `top-0` del documento hasta el punto de cambio (la utilidad `floating-bar-trigger` ahora fija `height: max(1px, …)` en vez de `top`). Ahora `mode = isIntersecting ? 'anchored' : 'fixed'`, así que el estado depende solo de la posición y cualquier salto cambia la intersección. Sigue sin listeners de scroll. Lo comprobé con CDP:
  - home a 1366×657: inicial absolute en top 750. Con clic en "Cotización" (`/#contacto`) pasa a `scrollY 8773`, fixed en top 12. Con `scrollTo(0,0)` vuelve a absolute en top 750;
  - `/proyectos/origen/` a 375×812: inicial absolute en 945. En 2500 queda fixed en 12. Al volver a 0 queda absolute en 945;
  - home a 375 con scroll continuo cada 25px: 575 da absolute en top 35 y 600 da fixed en 12, sin salto;
  - `/componentes/` sin hero: fixed abajo, sin cambios.

### Menores atendidos

- **Retraso de 1px a 1440**: queda resuelto con el nuevo sentinel. El cambio ocurre cuando el punto de cambio llega a 0 y no a -1.
- **Foco sobre fondo oscuro**: los dos enlaces (`FloatingQuoteLink.svelte`, `FloatingWhatsAppLink.svelte`) suman `focus-visible:ring-4 focus-visible:ring-paper` al `outline-ink` con offset 2. El ring de 4px rellena de paper el hueco del offset y el outline ink queda encima. Así el anillo es paper e ink sobre cualquier fondo, y el outline se mantiene para forced-colors.

### Menores no atendidos (dependen de terceros)

- El número de WhatsApp sigue PENDIENTE (`src/content/site.ts`).
- El icono "circle-x" se mantiene, porque es el asset del nodo. Hay que pedir a diseño el logo de WhatsApp.

### Archivos de la vuelta 2

- `src/layout/Header.astro`: `has-aria-expanded:z-menu` con overlay, más un comentario.
- `src/layout/FloatingBar.svelte`: sentinel `top-0` con alto hasta el punto de cambio y `mode` según `isIntersecting`.
- `src/styles/global.css`: `floating-bar-trigger` pasa a usar `height` y cambia su comentario.
- `src/layout/FloatingQuoteLink.svelte` y `src/layout/FloatingWhatsAppLink.svelte`: ring paper en el foco.

No hay tokens nuevos ni eliminados.

### init.ps1 (vuelta 2)

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
Verificación hecha con Chrome headless por CDP, con un perfil temporal en el scratchpad (`chrome.kill()` solo sobre el proceso lanzado) y `dist/client` servido con `http.server` en una tarea de fondo detenida por su id.
