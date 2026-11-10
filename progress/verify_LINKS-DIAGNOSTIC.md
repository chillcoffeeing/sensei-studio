# Verify LINKS-DIAGNOSTIC — vuelta 2
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [Copy] Se mantiene sin cambios de la vuelta 1: los CTA «Empezar mi diagnóstico», «Quiero definir mi proyecto» y
  «Continuar» no llevan el glifo «→» en el texto, porque la flecha la dibuja el círculo de `ButtonCtaBrand` (↗). La
  decisión está justificada en el informe, pero falta que Natalia la confirme. Si no la acepta, el cambio es solo de
  `src/content/links.ts`.
- [UX] La barra de progreso usa `(index + 1) / total` (`LinksDiagnosticQuiz.svelte:56`), así que en la pregunta 16
  ya está llena antes de responder. Se acepta porque coincide con el contador «n / 16».
- [V3] A 320 px, que queda fuera del rango del acceptance (375–1440), la pregunta más larga ocupa 5 líneas
  (138 px, medido por el implementer), más que `min-h-28` (112 px). En esa pregunta los botones bajan una línea. A
  375 px son 110 px y caben. El implementer lo deja justificado.
- [V3] El navegador tampoco se pudo usar en esta vuelta. `astro preview` arrancó (pid 29408), pero `curl` a
  `localhost:4329` y a `127.0.0.1:4329` devolvió 000 en los dos intentos, por el sandbox. Se apagó el servidor con
  `astro preview stop` y se verificó por código y `dist/`.

## Hallazgos previos

- **[Bloqueante V2, vuelta 1] RESUELTO.** `src/modules/links/LinksDiagnosticQuiz.svelte:66` ahora es
  `class="min-h-28 font-heading text-xl/snug font-semibold text-balance outline-none"`.
  - La isla compilada (`dist/_astro/LinksDiagnostic*.js`) lleva esa misma cadena de clases.
  - Un script comparó cada clase estática de `src/modules/links/*.{svelte,astro}` con el CSS de `dist/_astro/*.css`.
    Todas las clases del diagnóstico se generan, `min-h-28` y `font-heading` incluidas, y no queda ninguna otra
    clase pegada. Solo salen falsos positivos `@container`/`@sm:*` en LinksHeader y LinksWhatsAppLink, que vienen
    de mi regex (no escapa la `@`) y no tienen relación con esta feature.
  - Con `min-h-28` (112 px) y `text-xl/snug` (20 px × 1,375 = 27,5 px por línea), 4 líneas = 110 px caben. Esto
    coincide con la nueva medición del implementer.
- Menores de la vuelta 1: se mantienen arriba, con la justificación del implementer.

## Verificado sin hallazgos

- **V1**: `./init.ps1` en VERDE (exit 0): toolchain, install, estado, check:ds, check:arch, astro check y build
  con 9 páginas.
- **Alcance de la vuelta**: desde el informe anterior solo cambió `LinksDiagnosticQuiz.svelte` (por mtime). El resto
  del módulo, `src/content/links.ts` y `public/api/send.php` no cambiaron, así que sigue valiendo lo verificado en la
  vuelta 1.
  - Esto incluye la lógica de puntaje y desempate y el caso de cero «sí».
  - También MIN_BUDGET = 400 como constante única (`src/content/links.ts:17`) y `CAL_LINK`
    (`src/content/links.ts:19`).
  - Y además el iframe `h-170` con name/email/notes, el payload compatible con `FORMS['diagnostic']`
    (`public/api/send.php:97`) y el envío que nunca bloquea.
  - Lo mismo para el paso 3 con radios accesibles y error único, y para el foco, el aria-live, motion-safe y el
    contraste.
- **Copy**: se volvieron a extraer todas las preguntas `¿…?` del PDF (`pdftotext -enc UTF-8`). Las 16 preguntas
  del quiz están literales en `src/content/links.ts`. Las tres diferencias que da la comparación no son errores:
  - El título del paso 0 está partido en texto + `mark: 'despegar?'` (`src/content/links.ts:47`).
  - «¿Qué tienes en mente?» es el bloque que el PDF dice sustituir.
  - En «¿Tienes una idea de app…» la diferencia es un doble espacio que mete el salto de línea del PDF.
- **Guía eliminada**: no hay coincidencias de `7 claves`, `guía gratuita`, `guideHref`, `LinksGuide`, `LinksQuote`,
  `download.svg` ni `guide-cover` en `src/` ni en `dist/links/index.html`. `data-quote-open` sigue en
  `dist/links/index.html`.
- **V5**: en `src/modules/links/` no hay clases arbitrarias `[…]` (las dos coincidencias son props `widths` de
  imágenes, de antes), ni hex en `.svelte`/`.astro`, ni `any`, ni `ds-allow`, ni imports entre módulos.
- **Checklist del PDF**: igual que en la vuelta 1. Lo que falta es «una reserva de prueba llega al calendario» y
  «un lead de prueba llega al correo». Las dos dependen del hosting real y de Cal.com, y se comprueban en producción.
