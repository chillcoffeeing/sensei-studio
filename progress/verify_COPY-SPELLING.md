# Verify COPY-SPELLING — vuelta 2
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
(ninguno)

## Verificado sin hallazgos
- V1: `./init.ps1` en VERDE, ejecutado por el verifier (toolchain, dependencias, estado, sistema de diseño, arquitectura,
  astro check, astro build).
- Mayor de la vuelta 1 corregido. En `src/content/data/pages/home.json:751` ahora dice `"Tengo una idea, ¿pueden ayudarme desde cero hasta el lanzamiento?"`
  y en `design/copy/faq.md:49` dice `## 10. Tengo una idea, ¿pueden…?`. Solo cambió de sitio el signo de apertura y el texto es el mismo.
- Menor de la vuelta 1 corregido. En `home.json:457` ahora dice "…crear otras más para una app" y `design/copy/testimonials.md:25` (fila 6, Elliot)
  dice lo mismo.
- Alcance de la vuelta 2: los únicos archivos de `src/`, `public/`, `scripts/` y `design/` modificados después del informe anterior son
  `home.json`, `design/copy/faq.md` y `design/copy/testimonials.md`, justo los que declara el informe (comprobado con `find -newer`).
  No se tocó ningún `.astro`/`.svelte` ni ningún asset.
- Finales de línea: los tres archivos siguen en CRLF homogéneo (857/857, 74/74 y 45/45 líneas terminan en `\r`).
- Los JSON siguen siendo válidos (el build da OK). Los title y description de SEO no cambian.
- V2–V4, V6: no aplican (solo texto).
