# Verify IMG-RELEVANCE — vuelta 6
Resultado: VERDE

## Bloqueantes

## Mayores

## Menores

## Verificado sin hallazgos
- [V1] `./init.ps1` ejecutado: exit 0, "VERDE: todo en orden" (check:ds, check:arch, astro check y astro build en OK).
- [V4] `services-email-envelopes-seal` → `Qsh64pRu6CE` (Egor Komarov), `src/content/unsplash-photos.json:249`. Revisada la imagen completa: tableta con interfaz oscura de controles, diales y forma de onda turquesa. No se ven logos ni marcas en el bisel, solo etiquetas genéricas de la interfaz ("WAVEFORM"). El alt es preciso. Resuelve el bloqueante de la vuelta 5 (marca GIGABYTE).
- [V4] `services-ux-swatches` → `7VbXK7T6k8w` (Shawn Rain), `src/content/unsplash-photos.json:288`. Revisada la imagen completa: manos dibujando un boceto en una tableta con lápiz amarillo, barra de herramientas y panel de color. El lápiz no lleva inscripción, el estuche de auriculares no muestra logo y los textos son etiquetas de UI, no copy comercial. El alt es preciso. Resuelve el bloqueante de la vuelta 5 ("Pencil Pro").
- [V4, V6] Manifiesto y créditos coherentes: 37 slots, 37 IDs únicos y 37 filas en `design/placeholders.md`, todas con UTM `utm_source=sensei_studio&utm_medium=referral`. En todos los slots coinciden id, alt y autor; no hay alts vacíos, `?` ni U+FFFD, y el lado mínimo de cada original es ≥ 2000 px (8272×6200 y 6000×4000 en los nuevos). Las IDs antiguas `lPiNaX2vs_U` y `KgpwQ2FM2Go` ya no aparecen en `src/` ni en `design/`.
- [V2, V3, V5, V7] La corrección solo toca los dos registros del manifiesto y sus créditos: no cambia código, layout, CSS ni composición. Se mantienen el `srcset`/`sizes` y las proporciones de `src/shared/ui/Photo.astro`. Revisión responsive estática, sin capturas headless. No aplica Figma porque `figmaNodes` está vacío.
