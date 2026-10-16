# Verify TESTIMONIALS-BRAND — vuelta 1
Resultado: VERDE

## Bloqueantes
Ninguno.

## Mayores
Ninguno.

## Menores
Ninguno.

## Verificado sin hallazgos
- [V1] `./init.ps1`: VERDE (estado, sistema de diseño, arquitectura, `astro check`, `astro build`).
- Revisé una a una las 20 citas de `src/content/data/pages/home.json` (`testimonios.content.reviews`):
  - Con mención al estudio, todas dicen "Sensei Studio": #2 "con Sensei Studio", #3 "del trabajo de Sensei Studio",
    #4 "trabajar con Sensei Studio", #7 "Trabajar con Sensei Studio…" / "Recomiendo ampliamente a Sensei Studio",
    #8 "¡Excelente Sensei Studio!", #10 "Sensei Studio es organizado", #15 "trabajar con Sensei Studio",
    #17 "Trabajar con Sensei Studio", #18 "Sensei Studio combinó", #19 "Sensei Studio nos ayudó",
    #20 "el equipo de Sensei Studio".
  - Sin mención: #1, #5, #6, #9, #11, #12, #13, #14, #16. Se mantienen igual.
  - Gramática: no hay artículos sobrantes ni contracciones mal formadas. `grep` de
    `La agencia|El estudio Sensei|[Ee]l Sensei Studio|[Ll]a Sensei Studio|del Sensei Studio|al Sensei Studio`
    en `src/` y `design/copy/` da 0 resultados.
  - Nada cambió aparte del nombre: las erratas pendientes de confirmar (#14 "100 confiables",
    #18 "increíblecon" / "enfoque  para", #20 "nos ayudo") siguen como estaban, a propósito. En #10, la mezcla de
    singular y plural ("es organizado, escuchan…") ya estaba en la cita original y es textual. No es un hallazgo.
- `design/copy/testimonials.md`: lo comparé por script con `home.json`. Las 20 filas tienen el mismo nombre, rol y cita
  (0 diferencias). La duda sobre el nombre queda marcada como resuelta.
- Menciones genéricas fuera de las citas (`links.ts:79`, `site.ts:160`, comentarios en `core/site.ts` y `Footer.astro`):
  son usos genéricos de "del estudio" y el informe las lista sin cambiarlas, como pide el criterio.
- `astro.config.mjs`: el comentario de `PRODUCTION_SITE` dice "confirmado por el usuario el 2026-10-15" y el valor es
  `https://bysensei.com`.
- V2–V7: el cambio es solo de contenido. No cambia la estructura, ni assets, tokens, clases o islas. "Sensei Studio" es
  más o menos igual de largo que lo que sustituye, en un masonry de altura libre, así que el responsive no se ve
  afectado (revisión estática; no saqué capturas).
