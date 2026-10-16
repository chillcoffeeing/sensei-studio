# Verify TEAM-SLIDER-CONTAINER — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
(ninguno)

## Verificado sin hallazgos
- [V1] `./init.ps1` VERDE: toolchain, dependencias, feature_list (1 in_progress), sistema de diseño, arquitectura, `astro check` y `astro build`.
- [V2] Estructura intacta. La sección sigue con la cabecera (eyebrow, h2 en dos tonos y descripción a la derecha) y debajo la fila de cards. Solo cambia el ancho del carril desde lg (`src/shared/ui/TeamSlider.astro:22`, wrapper `lg:container-page`). Se usa la utilidad de container del proyecto (`container-page`, la misma de la cabecera), así que la alineación es exacta.
- [V3] Medido con Chrome headless (perfil temporal propio, solo se cerró ese proceso) sobre `dist/client`:
  - 375: carril de 0 a 375, primera card en 16 = h2 16, scrollWidth 375.
  - 768: carril de 0 a 768, primera card en 32 = h2 32, scrollWidth 768.
  - 1024: carril de 40 a 984, h2 en 40, scrollWidth 1024.
  - 1440: carril de 60 a 1380, h2 en 60, la cuarta card queda recortada en 1380 (borde del container), scrollWidth 1440.
  - 1920: carril de 300 a 1620, h2 en 300, scrollWidth 1920.
  En ningún ancho hay scroll horizontal de página. La decisión de dejarlo a sangre por debajo de lg está justificada (la card siguiente asoma e invita al swipe) y se ve bien en la captura de 375.
- El criterio dice "overflow-hidden", pero el recorte lo hace `overflow-x-auto` en el propio carril. Visualmente es igual y conserva el scroll con trackpad y teclado (`tabindex="0"`). La justificación es válida y no cuenta como hallazgo.
- Bucle, autoplay, swipe y `bindCloneHover` no cambian. El elemento que hace scroll sigue siendo el mismo, así que la geometría de las copias es coherente.
- No había fade ni máscara lateral, así que no hay nada que ajustar.
- [V4] Sin cambios de assets.
- [V5–V7] En los archivos tocados no hay valores arbitrarios `[..]`, hex, `client:load` ni `ds-allow`. `--team-inset` está eliminado y no queda ninguna referencia en `src/` ni en `docs/`. No se agregaron tokens. La ficha de `TeamSlider` en `docs/components.md` (líneas 700 y 703) está actualizada.
