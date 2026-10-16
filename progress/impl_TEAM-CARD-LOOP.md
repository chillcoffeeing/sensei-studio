# impl TEAM-CARD-LOOP — Equipo: hover en las copias del bucle, datos abajo, bio a 3 líneas

## Causa

Las copias del bucle (`appendLoopClones`) son `inert`. Un nodo inert no participa en el hit-testing,
así que no recibe `:hover` ni `pointerenter`. Además, `modules/team/hover.ts` enganchaba solo las
cards que existían al cargar, y las copias se crean en el primer play del autoplay.

## Archivos

- `src/shared/lib/slider/clone-hover.ts` (nuevo): `bindCloneHover(scroller, { track, originals, onChange })`. Por geometría (pointermove + scroll del carril, con rAF) busca la copia bajo el puntero, le pone `data-clone-hover` y le envía `pointerenter`/`pointerleave` sintéticos. El clic sobre un icono de perfil de una copia se reenvía al enlace equivalente de la original. Con touch no hace nada.
- `src/shared/lib/slider/index.ts`: exporta `bindCloneHover`, `CLONE_HOVER_ATTR` y `CloneHoverOptions`.
- `src/styles/global.css`: `card-active` incluye `[data-card][data-clone-hover] *`. Nueva utilidad `line-clamp-typed-*`, un line-clamp que también recorta las dos capas `stack-layers` del typewriter.
- `src/shared/ui/TeamSlider.astro`: usa `bindCloneHover`. La pausa `pointer` sobre una card con enlaces vale ahora también para las copias; al salir de una copia se reevalúa con la original en `:hover`.
- `src/modules/team/hover.ts`: un MutationObserver engancha las cards añadidas después (las copias). `bindTeamCard` primero limpia el DOM que trae una copia: devuelve a texto plano lo que ya envolvió el typewriter (`restoreTyped`) y quita el filter/transform inline de la foto.
- `src/modules/team/Section.astro`: `data-team-section`; `bindTeamCards` queda acotado a la sección (el observer no vigila todo el documento).
- `src/shared/ui/TeamCardDetail.astro`: arriba queda solo el icono +. Nombre, rol · empresa, bio (`line-clamp-typed-3`) y perfiles van en un único bloque anclado abajo, sobre `--team-detail-scrim-bottom`.
- `src/shared/ui/TeamCard.astro`: comentario actualizado.
- `src/styles/tokens.css`: se borran `--team-detail-scrim-top` y `--team-bio-max`, que quedaron sin uso.
- `docs/components.md`: entradas de TeamCard (detalle, tokens) y TeamSlider (copias y `bindCloneHover`).
- `feature_list.json` (`in_progress`), `progress/current.md` (plan).

## Tokens

- Agregados: ninguno. Nueva utilidad `line-clamp-typed-*` en `global.css`.
- Borrados: `--team-detail-scrim-top`, porque ya no hay texto arriba (el + va sobre su círculo ink), y `--team-bio-max`.
- `docs/design-system.md` no cambia: solo cita `--team-*` de forma genérica.

## Desviaciones de Figma / decisiones

- **Datos agrupados abajo** (lo pide la acceptance). Rol y empresa salen de la esquina superior derecha y van bajo el nombre en una sola línea, con wrap: rol en `text-role` paper y empresa en paper-soft. En el reposo ya estaban todos abajo y no cambia.
- **Bio a todo el ancho de la card**: se quita el `max-w 14em`. Con el tope de 3 líneas, el ancho completo deja leer más texto antes de cortar.
- **Los clones siguen `aria-hidden` + `inert`**: ni foco ni lectores de pantalla. El hover se emula. Limitación: el cursor sobre un icono de una copia no cambia a "mano" y el hover propio del icono (LinkIconInk) no se ve, pero el clic sí funciona porque se reenvía a la original.
- **Accesibilidad de la bio**: line-clamp solo recorta en lo visual. El texto completo sigue en el DOM de la card original (copia fantasma del typewriter).

## Responsive

- Mobile y táctil sin cambios: el detalle sigue en `display: none` (`can-hover`), `bindCloneHover` ignora `pointerType: touch` y hover.ts no se engancha.
- Con reduced motion no hay autoplay y, por tanto, no hay copias. El cambio de capa es instantáneo (`motion-safe`).

## Comprobación en navegador

Chrome headless con perfil temporal propio (cerrado por su PID) sobre `astro preview`:
- 1440, puntero sobre una copia: `data-clone-hover` puesto, `inert=true`, `aria-hidden=true`, opacidad del detalle 1, foto con `blur(16px)`, typewriter activo y bio de 67 px (3 × 22,4 px).
- Con el carril moviéndose bajo un puntero quieto, el hover pasa a la card que queda debajo.
- 1440, original: detalle visible y datos abajo (captura revisada).
- 375 táctil: detalle en `display: none`, autoplay avanzando (scrollLeft 281 a los 5 s) y copias creadas.
- 768 y 1024: sin captura. Solo cambia el ancho de la card por su `clamp`; la lógica es la misma.

## init.ps1

check:ds 0 errores · check:arch 290 archivos, 0 errores · astro check 0 errors · astro build OK → **VERDE**.
