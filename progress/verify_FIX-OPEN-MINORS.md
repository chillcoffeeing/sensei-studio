# Verify FIX-OPEN-MINORS — vuelta 1
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [Tests] `tests/open-minors.test.ts:10`: `new RegExp(`${name}:\s*([^;]+);`)` va dentro de un template literal, así que `\s` se convierte en una `s` literal y el patrón queda `--x:s*([^;]+);`. Funciona por casualidad porque `s*` acepta cero `s`, y `.trim()` quita el espacio que captura el grupo. Debería decir `\\s*` o `String.raw`. No cambia ningún resultado.
- [Docs] `src/styles/tokens.css:791` y el informe dicen que `paper` llega a ≈ 7.1:1 en el peor caso. Con fondo 0.315 sRGB (L ≈ 0.081) el valor real es ≈ 8.0:1. La cifra anotada es conservadora y no afecta el cumplimiento. `paper-soft` ≈ 5.1:1 es correcto.

## Verificado sin hallazgos

- **V1**: ejecuté `./init.ps1` y salió VERDE en todos los pasos: toolchain, deps, estado (1 in_progress), check:ds, check:arch, astro check, vitest y build.
- **V2 Estructura**: la card de equipo mantiene las mismas capas y el mismo orden: foto, reposo y detalle con `+`, rol/empresa arriba y nombre/bio abajo. Las bandas son fondos de los dos bloques de texto que ya existían. Sus márgenes negativos (`-mx-24 -mt-24 -mb-48` / `-mx-24 -mt-48 -mb-30`) compensan exactamente el padding añadido, así que no cambia la posición del texto. La única diferencia con la referencia es que los bordes superior e inferior quedan más oscuros. Está justificada en el informe y mejora la legibilidad. La cara sigue visible en el centro de la card, en las capturas de 375 y 768.
- **Contraste AA**: lo verifiqué de forma analítica. Peor caso, píxel blanco: velo 0.3 + banda 0.55 ⇒ 0.315 sRGB, y `paper-soft` queda ≈ 5.10:1 ≥ 4.5. En el DOM calculado, el degradado sólido cubre la zona del texto, porque el fundido de 48px coincide con `pb-48` arriba y con `pt-48` abajo. En mobile no se reintroduce blur: no hay `blur-(--team-photo-blur)` en la Section, y el test lo comprueba. La anotación `@contrast` de `--color-paper-soft` ya refleja la medida real (mediana 7.1, 30% < 4.5, mínimo 2.6) y la garantía que da la banda.
- **V3 Responsive**: con Chrome headless (CDP, perfil temporal propio y cierre por PID) sobre `dist/client` servido en local. A 375, 768, 1024 y 1440 `scrollWidth === innerWidth`, sin scroll horizontal. A 375 la card mide 260×320 y los bloques 138 y 199px. Las bandas se solapan solo en sus zonas de fundido, y el texto no se solapa: 66 + 16 + 121 = 203px de 266px útiles. En las capturas de 375 y 768 (reduced-motion ⇒ el detalle es el estado base) se lee bien rol, empresa, nombre y bio. A 1024 y 1440 no conseguí forzar el estado de detalle con el foco programático, así que ahí solo comprobé el CSS calculado. La banda vive en la misma capa de detalle, con los mismos valores en todos los anchos.
- **Velocidad del showcase**: la medí en el navegador con `scrollLeft` durante 4s. Da 53.25px/s a 1440 (objetivo ≈ 53) y 25.75px/s a 375 (antes ≈ 25). El token `--duration-showcase-slide: 7350ms` está anotado `@derived` con el motivo, y el respaldo `SLIDER_TIMING.showcaseSlide.fallbackMs` es 7350.
- **Textos de pausa**: en los `aria-label` de showcase y equipo (`src/content/pages/home.ts:417`, `:493`) ya no aparecen cursor ni hover, y ahora mencionan teclado y deslizar. `ui-catalog.ts:99-100` describe la pausa real. El JSDoc de `showcase/schema.ts:12-16` también. Hice un grep en `src/` y `docs/` buscando pausa junto a hover, cursor o puntero: solo aparecen frases que dicen que el hover NO pausa.
- **V4 Assets**: no hay assets nuevos ni sustituidos.
- **V5**: no encontré `[0-9#]` arbitrario, hex, `client:load`, `any` ni `ds-allow` en los archivos tocados. No hay imports entre módulos (check:arch OK). El copy sigue en `src/content/`.
- **V6**: rol y nombre del detalle siguen `aria-hidden` (están duplicados en el reposo). Empresa y bio siguen como texto real y el foco visible de la card se mantiene.
- **V7 Alcance**: tocó tokens (team-detail-scrim, anotación de paper-soft, duración del showcase), la Section de equipo, timing.ts, ui-catalog, el schema del showcase, los labels de home.ts, docs/components.md, design-system.md regenerado y el test nuevo. Todo está dentro de la acceptance.
