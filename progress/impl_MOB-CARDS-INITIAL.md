# impl MOB-CARDS-INITIAL — cards sin hover en estado inicial; TeamCard en archivo propio

## Archivos

- `src/styles/global.css`: nueva variante `can-hover` (`@media (hover: hover)`); comentario de `hover-motion` actualizado (queda solo para lo que anima JS).
- `src/shared/ui/ProjectCard.astro`: capas por `can-hover` y transiciones por `motion-safe`; sin hover: imagen + `LinkButtonPaper` (velo y pill `hidden`, glass sin fondo/borde/padding, `dl` `hidden`, cabecera con `h3` en `sr-only`).
- `src/shared/ui/TeamCard.astro` (nuevo): card de integrante extraída de `modules/team/Section.astro`; detalle `hidden can-hover:flex`.
- `src/shared/ui/TeamCardPlaceholder.astro` (nuevo): hueco decorativo (bloque ink o foto), `aria-hidden`.
- `src/shared/ui/team-card-image.ts` (nuevo): `sizes`/`widths`/recorte 688 × 846 que comparten las dos cards (antes constantes de la sección).
- `src/shared/ui/types.ts`: `TeamCardData` (`name`, `role`, `company`, `bio`, `photo: UiImage`).
- `src/modules/team/Section.astro`: solo coloca `TeamCard` / `TeamCardPlaceholder` dentro de `TeamSlider`; sin marcado de card inline.
- `src/modules/team/hover.ts`: solo comentarios (cabecera y `bindTeamCards`). `TEAM_HOVER_MEDIA` no cambia: con hover:none ya no engancha nada.
- `src/pages/componentes.astro`: muestras de `TeamCard` y `TeamCardPlaceholder`; el ejemplo de `TeamSlider` usa las cards reales (antes, otra card inline en un `.map()`). Quitado el import de `Picture` sin uso.
- `src/content/ui-catalog.ts`: entradas `TeamCard` y `TeamCardPlaceholder`, uso de `ProjectCard` actualizado; `samples.team` = `members`, `person`, `placeholderPhoto`.
- `docs/components.md`: ficha de `ProjectCard` al día, fichas nuevas `TeamCard` y `TeamCardPlaceholder`, `TeamSlider` sin la nota vieja, tabla de consumo; fuera la fila "Card del equipo" de "Fuera de la librería".
- `docs/conventions.md` § Motion: fila nueva en la tabla (can-hover / motion-safe / card-active / hover-motion) y nota en la regla 3 (reduced-motion en cards = cambio de capa instantáneo; sin hover = estado inicial).
- `feature_list.json` (`in_progress`), `progress/current.md` (plan).

## Tokens

Ninguno agregado ni borrado. Solo se añade la variante `can-hover` en `global.css`.
`docs/design-system.md` no cambia.

## Decisiones

- **Qué capa vs. si hay transición**: `can-hover:` (hover del puntero) decide la visibilidad;
  `motion-safe:` pone `transition-*`, `duration-*`, `ease-*` y `delay-*`. Resultado:
  - hover + sin reduced-motion: igual que antes (fundidos, blur/escala de la imagen; en la card del
    equipo, Motion + typewriter de `hover.ts`);
  - hover + reduced-motion: el cambio de capa en hover/foco ocurre, instantáneo (antes se veía el
    detalle fijo). En ProjectCard el blur/escala de la imagen también se aplica, sin transición;
    en TeamCard la foto no se desenfoca (lo hace `hover.ts`, que no se engancha) y la legibilidad
    la dan `--team-card-veil` y las bandas scrim;
  - sin hover (táctil): solo estado inicial; no hay animación.
- **ProjectCard sin hover**: el usuario pide "imagen + botón Ver proyecto", así que tampoco va la
  pill (es el reposo de desktop, pero repetía el título sobre el botón). El botón es el mismo
  `LinkButtonPaper` del detalle, anclado abajo con el inset de la pill. Título y categoría quedan
  en `sr-only` (el `h3` sigue en el árbol de accesibilidad); `can-hover:not-sr-only` los devuelve.
  El velo no se pinta: la foto se ve limpia.
- **TeamCard sin hover**: el detalle es `display: none` (empresa y bio no se leen en táctil; es lo
  que pide la feature: "no se muestra"). El reposo (nombre `h3` + rol) es el contenido.
- `card-active` sigue incluyendo foco visible: con teclado en un dispositivo con hover, el foco
  activa el detalle. En táctil el foco ya no cambia de capa (las variantes van bajo `can-hover`).
- `hover-motion:text-left` en los textos del typewriter se conserva (solo importa cuando escribe).
- La card de relleno tenía su propio `Picture` con `sizes`/recorte: se extrajo también
  (`TeamCardPlaceholder`) por la regla 5 de conventions.

## Responsive

Sin cambios de medidas. A 375: card de proyecto = imagen + botón a todo el ancho del inset
(319 px), sin scroll horizontal (`scrollWidth` 375).

## Verificación visual (Chrome headless por CDP, perfil temporal propio, PID cerrado al final)

Capturas en `progress/screens/MOB-CARDS-INITIAL/`.
Emulación de hover:none con `Emulation.setTouchEmulationEnabled` (con `setEmulatedMedia`
`hover: none` Chrome no cambia `(hover: hover)`); comprobado con `matchMedia`.

| Caso | ProjectCard | TeamCard | scrollWidth |
|---|---|---|---|
| 375, hover:none (`375-hovernone-*.png`) | velo y pill `display:none`; glass transparente sin borde; `dl` none; `h3` sr-only; botón visible 319×50 | detalle `display:none`; reposo visible (foto + scrim + nombre/rol) | 375 |
| 1440, hover (`1440-hover-*.png`) | reposo = pill; en hover: blur + velo + glass con métricas + botón (`1440-hover-project-active.png`) | en hover: detalle con foto desenfocada (`1440-hover-team-active.png`) | 1440 |
| 1024, hover + reduced-motion (`1024-*`) | reposo = pill; detalle en hover | en hover: detalle sin blur, instantáneo (`1024-reduce-team-active.png`) | 1024 |

Slider del equipo sin cambios (mismo `TeamSlider`, mismas diapositivas/atributos).

## Cards/items inline en otros módulos (no extraídos)

- `modules/process/Section.astro`: paso del proceso (barra de progreso + número/% + h3 + texto) inline en `steps.map()`.
- `modules/stats/Section.astro`: cifra + divisor + etiqueta inline en `items.map()`.
- `modules/services/ServicesAccordion.svelte`: fila del acordeón (botón + panel con lista e imágenes) inline en `{#each services}`.
- `modules/logo-marquee/Section.astro`: `<li><img></li>` del marquee (trivial, no merece componente).
- `modules/testimonials`, `modules/project-gallery`, `modules/faq`, `modules/showcase`: ya consumen componentes (`ReviewCard`, `ProjectCard`, `AccordionCards`, `ShowcaseCarousel`).

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 0 ds-allow · 0 error(es)            [OK]
check:arch → 121 archivos · 11 módulos · 0 error(es) [OK]
astro check → 0 errors, 0 warnings, 1 hint (previo, BaseLayout)  [OK]
astro build [OK]
VERDE: todo en orden.
```
