# impl TEAM-SLIDER-CONTAINER

Equipo: desde `lg` el slider de "Las personas detrás de cada proyecto" se queda dentro del container de la página. No hace falta Figma.

## Archivos

- `src/shared/ui/TeamSlider.astro`: el slider va envuelto en `<div class="lg:container-page">`. El carril (`overflow-x-auto`) pasa a `lg:px-0 lg:scroll-px-0`, así que desde lg las cards se recortan en el borde del contenido del container. Quité las reglas `2xl:*-(--team-inset)` y actualicé el comentario de cabecera. La lógica (bucle, autoplay, swipe, `bindCloneHover`) no cambia.
- `src/styles/tokens.css`: borré `--team-inset`, que se quedó sin uso.
- `src/modules/team/Section.astro`: solo el comentario (a sangre por debajo de lg, dentro del container desde lg).
- `docs/components.md`: en la ficha de TeamSlider hay una línea nueva "Ancho" y en Tokens `--team-inset` pasa a `container-page`.
- `docs/design-system.md`: sin cambios, porque no mencionaba `--team-inset`.

## Tokens

- No agregué ninguno. Quité `--team-inset`.
- Se usa la utilidad existente `container-page` (`global.css`), la misma de la cabecera de la sección. Es el "container" del proyecto: 1320 de contenido más el gutter de cada breakpoint. En el CSS compilado sale `@media (width>=64rem){.lg\:container-page{…}}` con sus gutters anidados correctos.

## Responsive

- **375 y 768 (por debajo de lg)**: se queda a sangre, con el gutter como padding del carril y `scroll-px` igual al gutter. En táctil, ver asomar la card siguiente por el borde de la pantalla invita a deslizar. Si lo recortara dentro del container quedaría un hueco blanco de 16 o 32 px a cada lado y el slider parecería un bloque fijo. La primera card sigue alineada con la cabecera.
- **lg+ (1024, 1440, 1920)**: el carril ocupa justo el área de contenido del container. Lo medí con Chrome headless sobre `dist/client`:
  - 1024: slider 40 a 984, h2 en 40.
  - 1440: slider 60 a 1380, h2 en 60.
  - 1920: slider 300 a 1620, h2 en 300.
  - En todos los anchos `scrollWidth` es igual a `innerWidth`: la página no tiene scroll horizontal.
- **overflow**: el recorte lo hace el propio carril con `overflow-x-auto`, que recorta igual que `overflow-hidden`. No lo cambié a `hidden` para no perder el scroll horizontal con trackpad ni con teclado (la región tiene `tabindex="0"`). El autoplay y el swipe mueven `scrollLeft` igual que antes.
- **Fade o máscara lateral**: el slider no tenía ninguna, así que no había nada que ajustar.
- **Hover de TeamCard en las copias**: `bindCloneHover` trabaja con la geometría de las cards respecto al carril. Como el carril sigue siendo el elemento que hace scroll, el cálculo es el mismo.

## init.ps1

VERDE: toolchain, dependencias, estado de feature_list (1 in_progress), sistema de diseño, arquitectura, `astro check` y `astro build`.
