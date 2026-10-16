# Verify NAV-FLOATING — vuelta 2
Resultado: VERDE

Método: `./init.ps1` y después `dist/client` servido con `http.server` (puerto 4393, tarea de fondo propia).
Pruebas en Chrome headless por CDP con perfil temporal en el scratchpad (`v2/t.mjs`, `v2/f.mjs`); solo se cerró
el proceso lanzado. Capturas en `scratchpad/v2/`.

## Bloqueantes

(ninguno; los dos de la vuelta 1 están resueltos, ver abajo)

## Mayores

(ninguno)

## Menores

- **WhatsApp**: el `href` sigue siendo el placeholder `https://wa.me/` (`src/content/site.ts`). Está
  documentado como PENDIENTE y depende del cliente. Hay que ponerlo antes de publicar.
- **Icono de WhatsApp**: sigue el "circle-x" de Figma 218:28 (`src/assets/floating-bar/circle-x.svg`), porque es
  el asset del nodo. Conviene pedir a diseño el logo de WhatsApp.

## Bloqueantes de la vuelta 1: comprobados

- **Barra sobre el menú mobile (home)**: resuelto con `has-aria-expanded:z-menu` en `src/layout/Header.astro:38`.
  - `/` a 375, menú abierto con la barra anclada: `elementFromPoint` en 3 puntos de la barra (15/50/85 %)
    da `menu,menu,menu` y el header tiene z 50. Con el menú cerrado vuelve a z 20 y los 3 puntos dan `BAR`.
  - `/` a 375 con scroll 1500 (barra fija) y el menú abierto: `menu,menu,menu`. En la captura
    `menuhome-fixed.png`, el logo y "Cerrar" se ven completos y no hay ninguna píldora encima.
  - `/` a 768 (todavía menú mobile): `menu,menu,menu`.
  - Focus-trap: 10 Tab con el menú abierto recorren Studio → Proyectos → Cotización → Agenda → flecha →
    Cerrar y vuelven al principio. El foco nunca cae en la barra. Esc cierra y `aria-expanded` vuelve a false.
  - `/proyectos/origen/` (sin overlay): la barra fija también queda cubierta por el menú. Sin regresión.
- **Saltos de scroll**: resuelto con un sentinel que va de top 0 hasta el punto de cambio
  (`src/layout/FloatingBar.svelte:47-50`, `src/styles/global.css:273-275`). Se midió `sentTop = 0` en todos los casos.
  - Home a 1366×657:
    - inicial: absolute, top 750;
    - clic en "Cotización" del header: scrollY 8788, fixed, top 12 (`jump-home1366-contacto.png`);
    - tecla Inicio: absolute, top 750;
    - tecla Fin: fixed, top 12;
    - `scrollTo(0,0)`: absolute, top 750.
  - Carga directa de `/#contacto`: fixed, top 12. Recarga con restauración en 4000: fixed, top 12.
  - Scroll rápido con saltos de 0↔6000↔10↔3000↔9000↔200 separados por dos frames: el estado es correcto en cada uno
    (absolute 750/740/550 y fixed 12). Con una ráfaga de 50 `scrollTo` alternos dentro del mismo frame, el estado
    final también es correcto en los dos sentidos.
  - Redimensionar después del salto (1366 → 375 arriba y 375 → 1440 en 3000): el estado es correcto.
  - `/proyectos/origen/` a 375×812: inicial absolute en 945; en 2500 fixed en 12; con Inicio vuelve a absolute en
    945 (`jump-prj375-home.png`); con recarga en 3000 queda fixed en 12.
  - El retraso de 1px de la vuelta 1 desapareció: a 1440 el cambio es `a12 → f12`, en los dos sentidos.

## Verificado sin hallazgos

- **V1**: `./init.ps1` VERDE (estado, check:ds, check:arch, astro check y astro build).
- **Cambio continuo y CLS** (pasos de 4px, bajando y subiendo, en home y proyecto a 375/768/1024/1440):
  - un cambio por sentido con una diferencia de 0 a 2.7px (por ejemplo, en home 375 `a13.5 → f12`);
  - CLS atribuible a la barra = 0 en los 8 casos;
  - `scrollWidth - innerWidth` = 0.
- **Estado inicial**: la barra queda centrada sobre el pie del hero, igual que en la vuelta 1. Home: 375 → 610/686,
  768 → 643/722, 1024 → 665/745, 1440 → 768/852. Proyecto: 375 → 945/1021, 1440 → 804/888.
- **Glass**: anclada `paper/0.5 blur(8px)` y fija `paper/0.3 blur(16px) saturate(1.5)`, con fundido entre capas
  de 0.25s. Las píldoras son opacas, así que el contraste AA se mantiene.
- **Reduced-motion**: `transition-property: none` en el aside y en las dos capas, y 0s en los enlaces (hover
  `motion-safe`). Sin reduced-motion: 0.25s y 0.15s.
- **Foco**: con Tab, el enlace tiene outline sólido ink de 2px con offset 2px más un ring paper de 4px
  (box-shadow). El anillo se ve sobre cualquier fondo, así que el menor de la vuelta 1 queda atendido.
- **data-quote-open**: `<a href="/#contacto" data-quote-open>Cotizar proyecto</a>`. WhatsApp tiene
  `target="_blank" rel="noopener noreferrer"` y el aviso sr-only.
- **Montaje**: una sola `<aside>` por página desde `BaseLayout.astro:93`. En `/componentes/` la barra queda fija
  abajo (16px). Sin JS queda fija abajo y visible.
- **Fronteras de capas**: `src/layout/` no importa nada de `modules/` (grep) y check:arch está verde. El enganche
  sigue siendo el atributo neutro `data-page-hero`.
- **Componentes aislados con props mínimos**:
  - `FloatingBar` (label, quote, whatsapp);
  - `FloatingQuoteLink` (href, label);
  - `FloatingWhatsAppLink` (href, label, newTab, icon).
  
  No hay variantes ni mega componente. La vuelta 2 no añade props.
- **V5**: sin hex, sin valores arbitrarios `[..]`, sin `ds-allow`, sin `any` y sin `initial` en los archivos tocados.
  No hay tokens nuevos. Los `--floating-bar-*` y `--z-index-floating-bar` se usan.
- **Estructura (V2)**: sin cambios respecto a la vuelta 1. Sigue coincidiendo con Figma 218:21.
