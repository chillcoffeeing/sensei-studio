# Verify TEAM-V2 — vuelta 2
Resultado: VERDE

Método: `./init.ps1`, revisión del diff de la vuelta 2 (`src/modules/team/hover.ts`,
`src/shared/ui/TeamSlider.astro`, `src/shared/lib/motion/autoplay.ts` y docs) y prueba en
navegador con Chrome headless por CDP (perfil temporal propio en el scratchpad; cerré solo ese
navegador y mi servidor estático por PID). Para tener iconos, metí URLs de prueba
`https://example.com/test-*` en todos los perfiles de Natalia y Maicol, hice el build y copié
`dist/client` al scratchpad. Después restauré `home.json` (SHA1 `f8f00a14…`, el original) y volví
a hacer el build: hay 0 `example.com/test` en `home.json` y en `dist/client/index.html`, y 0
"Perfil de" en el HTML.

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V3] (informativo, no es regresión) A 768, un swipe de 150 px vuelve a la misma card: el
  desplazamiento queda más cerca del snap de origen (stride 312). Con un swipe de 220 px avanza una
  card (312 → 624). En la vuelta 1 avanzaba con el mismo criterio. No requiere cambio.
- Los menores de la vuelta 1 que no se tocaron (dos líneas en el rol de María, aria-label con el
  aviso de pestaña nueva) siguen siendo aceptables, como ya se indicó.

## Verificado sin hallazgos

- **V1**: `./init.ps1` en VERDE (check:ds, check:arch, astro check y build).
- **Bloqueante anterior resuelto (1024 y 1440, `hover: hover`)**: hover.ts:123-139 usa ahora
  `focusin`/`focusout` y no desactiva si `relatedTarget` sigue dentro de la card. Resultado de la
  secuencia de Tab desde la región del slider:
  - Card de Natalia ("1 de 6"), luego Behance, Dribbble y LinkedIn: en los 4 pasos el detalle tiene
    opacity 1, y rol, empresa, nombre y bio se ven escritos completos ("Senior UX/UI designer",
    "en Sensei Studio", "Natalia Reina", bio). Captura `d1440-tab2.png`: foco en Behance con el
    detalle completo.
  - Tab rápido card → icono (80 ms) y espera de 2,5 s: el texto se escribe entero (21/16/13/101
    caracteres). Volver con Shift+Tab del icono a la card no reinicia nada.
  - Al salir hacia "2 de 6", los textos de Natalia se resetean a 0 caracteres. Si se entra de
    nuevo con Shift+Tab en su icono de LinkedIn, se vuelven a escribir completos. Al hacer blur
    fuera de la card, vuelven a resetearse a 0.
  - Las cards sin enlaces (Jhoarling, María, Victor) y Maicol con su icono también muestran el
    detalle escrito con el foco.
- **Hover con ratón (1024 y 1440)**: se escriben rol, empresa, nombre y bio de la card bajo el
  puntero (María a 1024 y Victor a 1440).
- **Menor V3 de la vuelta 1 (pausa con puntero)**: con el puntero sobre la card de Natalia (con
  enlaces), `data-playing` se quita y `scrollLeft` sigue en 0 durante 9 s. Sobre una card sin
  enlaces, el autoplay sigue (0 → 375 a 1024 y 0 → 392 a 1440). Fuera del slider se reanuda. El
  hover general no pausa, como pide MOT-SLIDERS-SHOWCASE. `pointer` es un `PauseReason`
  documentado en `autoplay.ts`, `docs/components.md:691` y `docs/conventions.md:116`. Los
  eventos táctiles se ignoran.
- **Mobile/táctil (375 y 768, `hover: none`, touch)**: hay 6 iconos visibles en reposo, de 44×44.
  Autoplay 0 → 281 y 0 → 312. Swipe 281 → 562 (375) y 312 → 624 (768, gesto de 220 px). Sin
  scroll horizontal (`docOverflow` 0). Captura `m375-rest.png` sin cambios respecto a la vuelta 1.
- **Desktop**: sin overflow horizontal a 1024 ni a 1440 (el −15 es la barra de scroll).
- **V5**: en los archivos tocados no hay valores arbitrarios, hex, `client:load`, `any` ni
  `ds-allow`. El único resultado del grep es `originals[0]!` en TeamSlider.astro:66, un falso
  positivo previo de TypeScript. No hay imports entre módulos.
- **V2/V4/V7**: estructura, assets y alcance siguen igual que en la vuelta 1. El cambio se limita
  al bloqueante y al menor de pausa.
