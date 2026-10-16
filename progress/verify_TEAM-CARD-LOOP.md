# Verify TEAM-CARD-LOOP — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2] El clic reenviado desde un icono de perfil de una copia (`bindCloneHover`, onClick en src/shared/lib/slider/clone-hover.ts:79-91) no se pudo probar en ejecución: ninguna card de la home ni de /componentes tiene perfiles con URL (0 `a[href]` en las 12 cards). Por lectura del código el índice de enlace coincide entre la copia y su original (mismo DOM y mismo orden). Conviene probarlo cuando se carguen perfiles reales.
- [V6] Limitación ya documentada por el implementer: sobre un icono de una copia el cursor no pasa a "mano" y no se ve el hover propio del icono. No bloquea, pero es una pequeña inconsistencia con las originales.

## Verificado sin hallazgos
- **V1**: `./init.ps1` → VERDE (check:ds, check:arch, astro check y build OK).
- **Hover en las copias del loop (desktop), prueba principal**: Chrome headless con perfil temporal propio y el PID cerrado al terminar, sobre el build (servidor node en 127.0.0.1), con ratón real vía CDP `Input.dispatchMouseEvent`:
  - 1440, 1024 y 768: hay 6 copias creadas en el primer play. Con el puntero sobre una copia: `data-clone-hover` puesto en esa copia, `inert=true`, `aria-hidden="true"`, opacidad del detalle 1, foto con `blur(16px)` y typewriter activo (capas `stack-layers` creadas). En las capturas se ve el detalle con la foto difuminada, nombre, rol · empresa y bio.
  - Al sacar el puntero se quita el atributo y la opacidad vuelve a 0.
  - Con el puntero quieto y el carril desplazándose (+120 px por paso), el hover pasa a la copia siguiente (índices 6→7→8). Nunca hay más de un `data-clone-hover` a la vez.
  - Original a 1440: `:hover` true, detalle con opacidad 1.
- **Datos agrupados abajo**: arriba solo queda el icono +. Nombre, rol · empresa, bio y perfiles van en un único bloque sobre `--team-detail-scrim-bottom` (src/shared/ui/TeamCardDetail.astro). El reposo no cambia. La composición de la sección se mantiene.
- **Bio a 3 líneas**: altura 67,2 px = 3 × 22,4 px a 1440 (63,9 / 21,3 a 1024 y 61,9 / 20,6 a 768). `line-clamp-typed-3` recorta también las dos capas del typewriter. El texto completo (173 caracteres) sigue en el DOM de la original.
- **V3 Responsive**: no hay scroll horizontal del documento (`scrollWidth - innerWidth = 0`) a 375, 768, 1024 ni 1440. A 375 táctil (hover: none) el detalle tiene `display: none`, el autoplay avanza (scrollLeft 0→281 en 5 s) y se crean las copias.
- **Reduced motion**: no hay copias ni `data-playing` (no hay autoplay). El cambio de capa queda en `motion-safe`.
- **V4**: no se toca ningún asset. `plus.svg` sigue en su sitio.
- **V5**: en los archivos tocados no aparecen arbitrarios `[..]`, hex, `client:load`, `any`, `ds-allow` ni z-index mágicos. Tampoco hay imports entre módulos. El copy sale del contenido (`home.json`).
- **Tokens**: tokens.css no tiene `--*: initial` ni nombres por defecto redefinidos. Los tokens `--team-detail-scrim-top` y `--team-bio-max` se borraron y ya no queda ninguna referencia.
- **V6**: las copias siguen siendo `aria-hidden` + `inert` y quedan fuera del foco. El foco visible de las originales (card-active) no cambia.
- **V7**: el alcance se limita a la acceptance: slider, card de equipo, `hover.ts`, la utilidad de clamp y la documentación de componentes.
