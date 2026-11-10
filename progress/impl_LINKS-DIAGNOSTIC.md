# impl LINKS-DIAGNOSTIC: diagnóstico gratis en /links (sin guía ni selector de servicios)

## Archivos

Creados (`src/modules/links/`)
- `diagnostic.ts`: lógica pura. Incluye `scoreAreas`, `winningArea` (desempate por el orden de `areas` y `undefined` con cero «sí»), `qualifies` (solo el presupuesto: `min >= minBudget`), `calUrl`, `buildLead` (campos de `FORMS['diagnostic']`), `bookingNotes`, `sendLead` (POST JSON a `FORM_ENDPOINT` con `form` y el honeypot, timeout de 8 s y nunca lanza), `fill`, `firstName` e `isEmail`.
- `LinksDiagnosticCard.astro`: la tarjeta blanca que reemplaza a LinksQuote. Lleva `LabelMarker` «DIAGNÓSTICO GRATIS» (nombra la sección), la isla `client:load` y el pie fijo «Sin promesas vacías. **Solo resultados.**».
- `LinksDiagnostic.svelte`: la isla y su máquina de pasos (intro → quiz → result → qualify → booking | later). Hace el fundido con `motion-safe:animate-step-in` desde el segundo paso, el scroll a `[data-diagnostic-card]` (sin smooth si hay reduced-motion) y pasa el foco a `[data-step-title]`.
- `LinksDiagnosticIntro.svelte`: paso 0.
- `LinksDiagnosticQuiz.svelte`: paso 1. Barra de progreso (`role=progressbar`, lima sobre pista ink), «n / 16» con el área, Sí/No en `grid-cols-2` con `min-h-12`, «← Pregunta anterior» `invisible` en la primera pregunta y región `aria-live` para la pregunta nueva.
- `LinksDiagnosticResult.svelte` y `LinksDiagnosticScore.svelte`: paso 2 con el mini gráfico y la invitación.
- `LinksDiagnosticQualify.svelte`, `LinksDiagnosticChoices.svelte`, `LinksDiagnosticChip.svelte` y `LinksDiagnosticField.svelte`: paso 3. Radios nativos con aspecto de chip; nombre y correo; error único con `role=alert`; foco al primer dato que falta; honeypot; botón aria-disabled con «Enviando…».
- `LinksDiagnosticBooking.svelte`: 4a. iframe de Cal.com `?embed=true` con name/email/notes, `h-170` (680 px), y enlace a la agenda en otra pestaña.
- `LinksDiagnosticLater.svelte`: 4b, «Gracias, [nombre]» y WhatsApp.
- `LinksDiagnosticHeading.svelte`: título con el tramo realzado (tinta sobre marcador lima en degradado de corte duro, nunca texto lima).
- `LinksDiagnosticLink.svelte`: enlace secundario de borde tinta que abre en pestaña nueva.

Modificados
- `src/content/links.ts`: bloque `diagnostic` con todo el copy del PDF y las constantes únicas `MIN_BUDGET = 400` y `CAL_LINK`. Se quitan `quote`, `guide` y `guideHref`. La descripción SEO deja de mencionar la guía. WhatsApp de 4b = `floatingBar.whatsapp.href`, el mismo de la cabecera.
- `src/modules/links/schema.ts`: tipos `LinksDiagnostic`, `Diagnostic*` y `Links.diagnostic`. Se quitan `LinksQuote`, `LinksGuide`, `LinksGuideCover` y la importación de `QuoteServices`.
- `src/modules/links/index.ts`: exporta los tipos nuevos y deja de exportar los eliminados.
- `src/modules/links/Section.astro`: `LinksDiagnosticCard` en lugar de LinksQuote + LinksGuide.
- `src/shared/lib/count-label.ts`: el comentario ya no menciona /links.
- `src/styles/tokens.css`: tokens nuevos (ver abajo) y se borra `--text-guide-cover`.
- `docs/design-system.md`: se quita `text-guide-cover` y se añade `animate-step-in` / `--duration-step`.
- `docs/architecture.md`: mapa de módulos regenerado por `check:arch`.
- `design/content-gaps.md`: la guía pasa a RESUELTO (se eliminó); el hueco del WhatsApp cita el paso 4b.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

Eliminados: `LinksQuote.astro`, `LinksQuoteSelector.svelte`, `LinksServiceOption.svelte`, `LinksGuide.astro`, `LinksGuideCover.astro` y `src/assets/links/download.svg`. El header y su «Cotizar proyecto» (`data-quote-open`) no cambian.

`public/api/send.php` no cambia: los nombres coinciden con `FORMS['diagnostic']`. `respuestas` viaja como lista de strings («Sí — ¿…?»), así send.php pinta una línea por pregunta; un string con `\n` se aplanaría en `clean_text`.

## Tokens

- `--duration-step: 300ms`: el fundido de ~0,3 s entre pasos que pide el PDF.
- `--animate-step-in` + `@keyframes step-in`: solo opacidad y siempre con `motion-safe:`.
- Se borra `--text-guide-cover`, que quedó sin uso.

## Responsive

- Diseñado a 390 px dentro de la columna existente (`max-w-md`). Desde `sm` es la misma tarjeta centrada.
- Pregunta con `min-h-28`: la más larga ocupa 108 px (4 líneas) a 375 px, medido con el navegador. Así los botones no saltan.
- Chips con `flex-wrap`; los rangos de inversión caben de dos en dos a 375.
- Mini gráfico en dos filas por área (nombre + x/4 y la barra debajo) en lugar de 3 columnas. «Desarrollo y automatización» no cabe en una columna fija a 375.
- iframe de 680 px de alto en todas las anchuras (mínimo 650).
- Sin scroll horizontal (scrollWidth = innerWidth) a 375, 768, 1024 y 1440, en la entrada y en el quiz.

## Desviaciones y decisiones

- **«→» de los CTA**: «Empezar mi diagnóstico», «Quiero definir mi proyecto» y «Continuar» usan `ButtonCtaBrand`, el mismo CTA lima de «Cotizar proyecto» como pide el PDF, cuyo círculo ya dibuja la flecha. El glifo «→» no se repite en el texto. «← Pregunta anterior» sí lo conserva. Si Natalia quiere el glifo literal, basta con añadirlo en `content/links.ts`.
- **Realces lima de la referencia**: «despegar?», «juntos», «tu proyecto», «horario» y el nombre van en tinta sobre un marcador lima en el 40 % inferior.
- **Contraste de la barra de progreso**: lima sobre pista ink (lima sobre blanco no llega a 3:1). La ganadora del gráfico va sobre una franja lima con la barra en tinta; las demás, en ink-muted.
- **Etiquetas de los campos**: «Tu nombre» y «Tu correo» son etiquetas visibles, no placeholders.
- **Rótulo fijo**: el rótulo DIAGNÓSTICO GRATIS se queda en todos los pasos. Da a la sección un nombre accesible estable. «Tu prioridad: …» es una píldora lima con texto tinta.
- **Fallo del envío**: un fallo o un timeout (8 s) del lead no muestra nada y pasa al paso que corresponde.
- **Sin JS**: la entrada se ve, pero el botón no hace nada. El selector anterior tenía un respaldo GET; el diagnóstico es interactivo por naturaleza.

## Comprobación en navegador (Chromium headless, build estático, `/api/send.php` y cal.com interceptados)

- **Calificado** (pide agenda): la UX/UI empata con Desarrollo a 3/4 y gana UX/UI. Volver a la pregunta 4 y cambiar la respuesta reemplaza la anterior. Con $1.500–$5.000 → «Elige tu horario». El iframe lleva name/email/notes: «Diagnóstico: Diseño UX/UI · Listo para empezar · Inicio: En 1 a 3 meses · Inversión: $1.500 – $5.000».
- **Cero «sí»**: «Buen punto de partida» con la invitación. «Menos de $400» → «Gracias, Ana», sin iframe; el lead se envía igual con `califica: "No"`.
- **Empate 1/1 Branding–UX/UI**: gana Branding.
- **Validación del paso 3**: «Continuar» vacío muestra el error y lleva el foco al primer grupo de radios.
- **Foco**: al empezar, el foco va al h2 de la pregunta.
- **Lead**: el payload trae los 9 campos más `form: "diagnostic"` y `website: ""`.
- **Consola**: sin errores.

## init.ps1

VERDE: pasan toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, `astro check` y `astro build`.

## Vuelta 2 (corrección de progress/verify_LINKS-DIAGNOSTIC.md)

- **Bloqueante corregido**: `src/modules/links/LinksDiagnosticQuiz.svelte:66`: `min-h-28font-heading` → `min-h-28 font-heading`. Se confirma en `dist/`: `.min-h-28{min-height:calc(var(--spacing) * 28)}` existe y la isla compilada lleva las dos clases. Se revisaron los demás `class=` de `src/modules/links/` y no hay otras clases pegadas.
- **Medición nueva** con Chromium headless, Google Sans Flex 600 a 20/1.375 y `text-wrap: balance`, sobre la pregunta más larga («¿Tienes un sitio o sistema ya construido…»). A 375 px (ancho útil de 299 px) ocupa 110 px, 4 líneas, por debajo del mínimo de 112 px, así que los botones no saltan. A 320 px ocupa 138 px, 5 líneas, y solo en esa pregunta habría un salto de una línea. Se acepta porque subir a `min-h-36` dejaría 34 px vacíos a 375. La medición de 108 px de la vuelta 1 se tomó sin `font-heading`.
- **Menores, sin cambio**:
  - «→» de los CTA: queda pendiente de que lo confirme Natalia. Si lo quiere literal, el cambio va solo en `src/content/links.ts`.
  - Barra de progreso `(index + 1) / total`: se mantiene porque coincide con el contador «n / 16».
- **init.ps1**: VERDE (toolchain, install, estado, check:ds, check:arch, astro check y build con 9 páginas).
