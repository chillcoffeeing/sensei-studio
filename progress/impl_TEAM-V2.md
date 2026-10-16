# impl TEAM-V2: equipo con María Reina, roles al día y perfiles profesionales

Figma `flzA0qnj6JdalFCgyB2PdI` 291:131 (`get_design_context` + screenshot). Orden de Figma: Natalia,
Jhoarling, María, Victor, Maicol, Daniel.

## Archivos

Creados:
- `src/assets/images/equipo-homepage/maria-reina.jpg`: foto de María (camisa blanca) exportada del relleno de la 3.ª card de 291:131 (JPEG de 2734×4096), recortada con el encuadre de Figma y llevada a 1032×1269 (mismo aspecto 344:423 y tamaño que las otras fotos del equipo).
- `src/assets/team/{behance,dribbble,linkedin,github}.svg`: logos monocromos de Bootstrap Icons 1.11.3 (MIT; atribución en un comentario del SVG). Es un solo set para que los cuatro sean coherentes. Simple Icons ya no trae LinkedIn.
- `src/shared/ui/LinkIconInk.svelte`: enlace externo de icono (círculo ink de 44 con el logo como máscara en paper, `target=_blank`, `rel="noopener noreferrer"` y `aria-label`). Sube a la librería el marcado de `FloatingWhatsAppLink`: `check:arch` lo marcó como duplicado.
- `src/shared/ui/TeamCardProfiles.astro`: fila de `LinkIconInk` con los logos de `src/assets/team/`. Sin perfiles no pinta nada.
- `src/shared/ui/team-profiles.ts`: `TEAM_PROFILE_NETWORKS` (`behance`, `dribbble`, `linkedin`, `github`) y su tipo.
- `src/modules/team/profiles.ts`: `profileLinks()`, que traduce los perfiles de un integrante al contrato de `TeamCard`. Descarta los que no tienen URL y monta el aria-label.

Modificados:
- `src/modules/team/schema.ts`: `profiles[] { network (enum), url ('' | https URL) }` por integrante, con una sola entrada por red y `[]` por defecto. `content.profiles` añade `label` (`{name}`/`{network}`), `newTab` y `networks` (nombre visible de cada red). Exporta `TeamProfileLabels`.
- `src/modules/team/Section.astro`, `index.ts`: pasa `profiles={profileLinks(member, profiles)}` a cada card.
- `src/shared/ui/TeamCard.astro`: prop `profiles?: TeamProfileLink[]`; la silueta usa `framing="portrait"`.
- `src/shared/ui/TeamCardRest.astro`: iconos sobre el nombre con `can-hover:hidden`, así que solo se ven en táctil y desde el estado inicial. Quité `whitespace-nowrap` y añadí `pr-6`: el rol de María se parte en dos líneas en la card de 260 px en lugar de desbordarse.
- `src/shared/ui/TeamCardDetail.astro`: iconos bajo la bio, en la capa del detalle (hover o foco en desktop).
- `src/shared/ui/types.ts`: `TeamProfileLink { network, href, label }`.
- `src/shared/ui/UserPlaceholder.astro`: prop `framing?: 'avatar' | 'portrait'`. Es el menor arrastrado de verify_TEAM-REAL.
- `src/layout/FloatingWhatsAppLink.svelte`: ahora usa `LinkIconInk`; el aspecto no cambia y solo añade `draggable="false"`.
- `src/content/data/pages/home.json`: tiene los 6 integrantes en el orden de Figma. María incluye foto, rol "Marketing Data Analyst, Email Marketing" y una bio provisional. Maicol pasa a "Senior UX/UI designer" y su bio se reescribió para ese rol. Cada integrante tiene sus `profiles` con URL vacía y `content.profiles` lleva sus textos.
- `src/content/ui-catalog.ts`, `src/pages/componentes.astro`: entrada y muestra de `LinkIconInk` (WhatsApp).
- `src/styles/tokens.css`: `--team-card-scrim` es más denso (ver Tokens).
- `docs/components.md`: TeamCard (perfiles, `TeamCardProfiles`), UserPlaceholder (`framing`), nueva ficha `LinkIconInk`, tabla de consumidores, barra flotante y TeamSlider con 6 integrantes.
- `design/content-gaps.md`: sección Equipo reescrita, con una tabla de las URL que faltan por persona; también se actualizó la fila 10 del resumen.
- `progress/current.md`: plan.

## Perfiles profesionales (no se inventaron URLs)

| Integrante | Redes (URL vacía) |
|---|---|
| Natalia Reina | behance, dribbble, linkedin |
| Jhoarling Reina | behance, linkedin |
| María Reina | linkedin |
| Victor Veliz | github, linkedin |
| Maicol Durán | behance, dribbble, linkedin |
| Daniel Rivera | github, linkedin |

Hoy no se pinta ningún icono (en `dist/client/index.html` hay 0 apariciones de "Perfil de"). El
aria-label es "Perfil de {nombre} en {Red} (se abre en una pestaña nueva)". Se aparta un poco de la
acceptance porque añade el aviso de pestaña nueva, igual que hace el WhatsApp del sitio. Para
probarlo, hice un build temporal con URLs de prueba y restauré el JSON después. Capturas con Chrome
headless (CDP, perfil temporal propio): a 375 px los iconos se ven en el reposo; a 1440 px aparecen
en el detalle con hover, bajo la bio, y no tapan el typewriter.

## Tokens

- No hay tokens nuevos.
- Cambia el valor de `--team-card-scrim`: Figma pone 0.4 de negro a partir del 28 %; ahora es 0.65 al pie → 0.5 al 28 % → 0 al 50 %. Con la camisa blanca de María, el blanco del nombre y del rol no llegaba a AA con 0.4. No cambia el nombre ni hay que tocar `docs/design-system.md`.
- `LinkIconInk` solo usa utilidades y tokens que ya existían (`size-11`, `bg-ink`, `text-paper`, `--duration-fast`, `ease-standard`).

## Desviaciones de Figma

- La silueta del placeholder se pinta a todo el ancho de la card (`framing="portrait"`), con la cabeza hacia el 48 % de la altura y no bajo el texto. Así se resuelve el menor arrastrado de TEAM-REAL. Figma usa una foto de relleno, que no se reproduce.
- El degradado del pie es más denso (ver Tokens).
- Los iconos de perfil no aparecen en Figma. Son círculos ink de 44 con el logo en paper, el mismo lenguaje que el WhatsApp de la barra flotante.

## Responsive inferido

- 375–1023 (sin hover): los iconos están sobre el nombre en el reposo (`mb-4`) y son táctiles (44 px). El rol largo se parte en dos líneas.
- ≥ 1024 con hover: los iconos están en el detalle, bajo la bio. Al enfocar un icono con el teclado la card se activa (`card-active` incluye `:has(:focus-visible)`). Los clones del slider son `inert`, así que sus enlaces no entran en el orden del Tab. `swipe.ts` ya cancela el clic tras un arrastre.
- La capa en `display: none` evita copias duplicadas en el orden del Tab.
- Motion: el desplazamiento de hover de los iconos va con `motion-safe:`. El fundido del detalle es el que ya existía (motion-safe) y el typewriter no cambia.

## init.ps1

```
[OK] pnpm install · [OK] feature_list (1 in_progress) · check:ds 0 errores · check:arch 294 archivos, 0 errores
astro check 0 errors · [OK] astro build
VERDE: todo en orden.
```

## Vuelta 2

Corrige verify_TEAM-V2 (vuelta 1).

Archivos:
- `src/modules/team/hover.ts`: **bloqueante**. `focus`/`blur` pasan a `focusin`/`focusout`, que sí burbujean. El estado JS sigue a `card-active`: con `focusin` se activa si hay foco visible en la card o dentro de ella (función nueva `isFocusVisibleWithin`). Con `focusout` no se desactiva si `relatedTarget` sigue dentro de la card, así que no hay `reset()` de los typewriters al pasar de la card a un icono. Rol, empresa, nombre y bio se escriben, o se quedan escritos, mientras el foco esté en un icono de perfil.
- `src/shared/lib/motion/autoplay.ts`: nuevo `PauseReason` llamado `pointer`, documentado en el comentario.
- `src/shared/ui/TeamSlider.astro`: menor V3. Con `pointerover` (sin táctil), el autoplay se pausa (`pointer`) si la card bajo el puntero tiene enlaces (`a[href]`, perfiles) y se reanuda al salir de ella o del slider. El hover general sigue sin pausar (MOT-SLIDERS-SHOWCASE). Hoy no tiene efecto porque no hay URLs.
- `docs/components.md` y `docs/conventions.md`: anotan la excepción `pointer`.

Menores que no se tocan:
- V2 (el rol de María en dos líneas sube su nombre unos 18 px): el verifier lo considera aceptable. Reservar dos líneas de rol en todas las cards dejaría un hueco vacío en las otras cinco.
- V5 (aria-label con el aviso de pestaña nueva): no requiere cambio.

init.ps1: check:ds, check:arch, astro check y build en VERDE.
