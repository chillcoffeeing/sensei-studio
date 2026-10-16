# Verify MOB-CARDS-INITIAL — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

- [copy] La acceptance habla del botón "Ver proyecto", pero el texto real es "Detalles del proyecto".
  Sale del contenido (`src/content/pages/home.ts:48`) y es el mismo `LinkButtonPaper` del
  detalle, como pide la feature. No es un hallazgo de esta feature. Si se quiere "Ver proyecto",
  se cambia en el copy.
- [entorno] Ya hay un `astro dev` registrado en :4321 (pid 11640), pero no responde (curl 000).
  No lo toqué. Verifiqué contra el build (`node dist/server/entry.mjs` en 127.0.0.1:4399).

## Verificado sin hallazgos

- **V1**: `./init.ps1` dio VERDE (exit 0): toolchain, deps, estado (1 in_progress), check:ds,
  check:arch, astro check y build.
- **Método V2/V3/V6**: Chrome headless por CDP con perfil temporal propio. Terminé solo su PID.
  `hover:none` se emuló con `Emulation.setTouchEmulationEnabled`; `matchMedia('(hover: hover)')`
  dio false. Desktop en un navegador limpio dio `hover: true`. Para reduced-motion usé
  `setEmulatedMedia`. Medí estilos computados en reposo y tras `mouseMoved` sobre la card.
- **ProjectCard sin hover (375 y 768)**: la imagen se ve. El velo y la pill tienen
  `display:none`. El glass no tiene fondo, borde, padding ni backdrop-filter. `dl` tiene
  `display:none`. El `h3` "Dass design anthopoly" está en el DOM, en sr-only (contenedor
  absolute). El botón se ve: 319×50 a 375 (≥44) y 672×50 a 768. La imagen no tiene filter. En la
  captura solo se ven la imagen y el botón paper abajo.
- **TeamCard sin hover**: la foto y la capa de reposo (scrim, nombre `h3` y rol) usan
  `display:flex`. La capa de detalle usa `display:none`. La foto no tiene filter. `hover.ts` usa
  `TEAM_HOVER_MEDIA = (hover: hover) and (prefers-reduced-motion: no-preference)`, así que no se
  engancha.
- **Desktop 1440 con hover**: en reposo se ven la pill y el velo con opacity 0, y el detalle
  tiene opacity 0. En hover, el velo y el detalle pasan a 1 y la pill a 0. La imagen queda en
  `blur(4px)` y el glass en `rgba(255,255,255,.13)` con borde de 1px, padding de 15 y
  `blur(20px)`. `dl` usa grid con 4 métricas. En TeamCard, el detalle sube a 1, el reposo baja a
  0 y la foto queda en `blur(16px)` (Motion). Las capturas coinciden con el comportamiento
  previo.
- **Desktop 1024 con hover y reduced-motion**: el cambio de capa sigue pasando en hover, sin
  transición. En TeamCard la foto no se desenfoca porque hover.ts no se engancha. El detalle se
  lee bien gracias al velo y a las bandas scrim (vista en la captura). Cumple la acceptance.
- **Accesibilidad**: el `h3` de proyecto está presente en todos los casos. El botón es un `<a>`
  visible y alcanzable. No hay elementos enfocables de tamaño 0 ni dentro de capas
  `display:none` (barrido de toda la página en 375, 768, 1024 y 1440). La capa de detalle de
  TeamCard no tiene elementos enfocables. La card conserva `role=group`, `aria-roledescription`,
  `aria-label` y `tabindex=0` con outline de foco. La pill y el rol/nombre duplicados llevan
  `aria-hidden`. El placeholder lleva `aria-hidden`.
- **Extracción y docs**: existen `src/shared/ui/TeamCard.astro` y `TeamCardPlaceholder.astro`,
  con `team-card-image.ts` y `TeamCardData` en `types.ts`. `modules/team/Section.astro` solo
  mapea a `TeamCard`/`TeamCardPlaceholder` dentro de `TeamSlider`, sin marcado de card inline.
  Están documentados en `docs/components.md` (§ TeamCard, § TeamCardPlaceholder, tabla de
  consumo y TeamSlider). Están en `src/content/ui-catalog.ts`: 96–97. `/componentes` responde 200
  y renderiza las muestras y el slider con las cards reales.
- **V3, sin scroll horizontal**: `scrollWidth` es 375 a 375 y 768 a 768. A 1024 y 1440 es menor
  que `innerWidth` porque hay barra de scroll.
- **Slider**: no hay cambios en `TeamSlider`. Las diapositivas mantienen sus atributos y en
  desktop se ve el carril a sangre.
- **V5**: no hay `ds-allow`, `any` ni arbitrarios `[0-9#]`, y no hay hex en los archivos
  tocados. No hay imports entre módulos. El único `client:load` es `src/layout/Header.astro:63`,
  ya existía y está fuera de alcance. No se añadieron tokens.
- **V7**: el alcance se ajusta a la acceptance. El informe lista los items inline de otros
  módulos (process, stats, services, logo-marquee) sin extraerlos.
- **V4**: no hay assets nuevos. `plus.svg` y las fotos se usan en su sitio, con recorte 688×846
  y el aspecto de la card.
