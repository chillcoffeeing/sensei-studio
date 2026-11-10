# Verify LINKS-TWO-PATHS — vuelta 1
Resultado: VERDE

Método: `./init.ps1` + revisión de código + Chrome headless propio (CDP, `--user-data-dir` temporal,
cerrado por PID) sobre el build de producción (`dist/`, servidor estático local). Capturas en el
scratchpad de la sesión (page/full a 375, 390, 768, 1024, 1440; diálogo intro/resultado/4b/4a a 390;
intro a 1440; modal de cotización a 390).

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V5] El WhatsApp del cierre (`src/content/links.ts`, `closing.whatsapp.href`) apunta a
  `https://wa.me/584127238210` sin texto. El prototipo (`linktree-sensei.html:265`) prellena
  "Hola, vengo del linktree de Sensei Studio". El PDF no lo pide y acceptance tampoco; queda a criterio.
- [V5] El botón "Cotizar por WhatsApp" de 4b solo emite `clic_whatsapp_cotizar`, no `clic_whatsapp`
  (el PDF dice "Clic en cualquier botón de WhatsApp"). Coincide con el prototipo (`data-track` único),
  así que no se considera fallo; se anota por si GA4 debe sumar los dos.
- [V3/V5] Con el diagnóstico en la mitad (cerrar no reinicia) es una decisión justificada en el informe;
  si el negocio prefiere empezar de cero al reabrir, es un cambio de 1 línea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (toolchain con nvm v22.20.0 antepuesto, check:ds, check:arch, astro check y build).
- **Encabezado**: logo, h1 "De la idea al resultado.", descripción exacta. 0 enlaces/botones en `<header>`.
- **Tarjeta**: eyebrow con cuadrito lima "TU PROYECTO EMPIEZA AQUÍ", h2 "¿Por dónde empezamos?",
  "Elige el camino que va contigo.", pie "Lo esencial primero. El alcance lo definimos juntos.".
  2 tiles en 2 columnas: 144px cada uno a 375, 151px a 390 y 180px desde sm, misma fila (y idéntica).
- **Tiles**: los dos son `<button>`. Diagnóstico con brújula, borde ink, badge lima con texto ink
  "Gratis · 2 min". Cotizar con el ícono de documento, "Ya sé lo que necesito", y abre `quote-title`
  ("Tu próximo proyecto empieza aquí.") del modal existente. Esc devuelve el foco al tile. El diff de
  `QuoteDialog.svelte` solo agrega `track('cotizacion_continuar')` (el honeypot viene de otro cambio,
  que tocó también contact y advice).
- **Popup**:
  - a 390 es una hoja pegada abajo (bottom = 844 = vh), con alto natural y tope de 94dvh,
    `rounded-t-3xl` y scroll propio; a 1440 es un diálogo centrado de 512px;
  - al abrir, el foco va a "✕ Cerrar". Tab ×8 queda dentro del diálogo;
  - Escape, clic fuera y "✕ Cerrar" lo cierran y el foco vuelve al tile;
  - `html { overflow: hidden }` mientras está abierto;
  - reutiliza `ModalDialog` (movido a `shared/lib/dialog/`, justificado por las fronteras de módulos).
- **Flujo**:
  - en el quiz, el contador va de "1 / 16" a "16 / 16" en orden, el botón Sí queda fijo en y=655 en
    las 16 preguntas (altura estable) y Sí/No miden 169×48px en 2 columnas iguales;
  - "← Pregunta anterior" reemplaza la respuesta;
  - en un empate Branding 1/4 y Email 1/4 gana "Branding e identidad", con su fila en lima;
  - con cero "sí" se muestra "Buen punto de partida" y "Tu proyecto tiene una base sólida", y la
    invitación se mantiene;
  - si la preclasificación se envía vacía, aparece el error del PDF y el foco va al primer chip;
  - con < $400 llega a 4b con los 3 pasos de Branding en tarjetas grises y el número en un círculo lima,
    sin iframe ni ninguna mención a cal.com en el DOM. El enlace es
    `wa.me/584127238210?text=Hola, hice el diagnóstico de Sensei Studio. Mi prioridad es Branding e identidad. Quiero ver qué opciones tengo para mi presupuesto.`;
  - con ≥ $400 llega a 4a con un iframe `?embed=true&name&email&notes` (notas con el formato del PDF)
    de 680px y "Abrir la agenda en otra pestaña";
  - en cada cambio de paso `scrollTop` vuelve a 0 y el foco pasa al título del paso;
  - el fundido `animate-step-in` (opacidad, 300ms) solo actúa con `motion-safe`.
- **Copy**: cotejado palabra por palabra con el PDF (cabecera, tarjeta, tiles, pasos 0–4b, las 16
  preguntas, los 5 resultados con sus 3 pasos, error, notas y mensaje de WhatsApp). La "→" la dibuja
  el CTA como ícono, justificado. `MIN_BUDGET = 400` es la única constante.
- **Lead**: `sendLead` nunca lanza, tiene timeout de 8s, se envía califique o no y `lead_enviado`
  lleva `califica` Sí/No.
- **dataLayer**: en headless se vieron `clic_diagnostico`, `clic_cotizar`, `diagnostico_iniciado`,
  `diagnostico_completado {resultado}`, `lead_enviado {califica}` y `clic_whatsapp_cotizar`.
  `clic_whatsapp` y `clic_proyectos` están en `data-track` sobre elementos reales, y
  `cotizacion_continuar` en el envío válido del modal (justificado). El helper es tipado
  (`src/core/analytics.ts`) y no depende de GTM.
- **Página**:
  - solo HEADER, SECTION "¿Por dónde empezamos?", SECTION "Un proyecto reciente" (Yupa con
    "Ver todos los proyectos" → `/proyectos/`) y FOOTER "¿Prefieres escribirnos?" (WhatsApp,
    "Visitar bysensei.com", claim y pie mínimo);
  - sin barra flotante: `StandaloneLayout` no la monta, justificado;
  - fuera de los diálogos hay un solo `a[href*="wa.me"]` y apunta al número correcto. El del modal de
    cotización es parte del modal "tal cual";
  - eliminados: guía, "Conoce nuestros servicios", el selector y los assets sin uso. No quedan
    referencias ni archivos huérfanos en `src/modules/links`.
- **V3**: `scrollWidth ≤ innerWidth` a 375, 390, 768, 1024 y 1440. Áreas táctiles ≥ 44px (chips
  `min-h-11`, Cerrar `min-h-11`, Sí/No 48px, CTA WhatsApp `min-h-12`).
- **V4**: `path-compass.svg` y `path-document.svg` (28×28) están en `src/assets/links/` y se ven en su
  lugar. Iconos y logo con proporción correcta.
- **V6**:
  - un h1, un h2 por sección y h2 por paso en el diálogo, que tiene nombre accesible (`aria-labelledby`);
  - foco visible (`outline-ink` sobre claro, `outline-brand` sobre ink);
  - progressbar con aria y región viva en el quiz;
  - contraste: ink-muted #686868 sobre blanco da 5,7:1 y sobre stone-100 ≈5,3:1;
  - el lima nunca aparece como color de texto (0 elementos con `color` #E4FF40); siempre es fondo con
    texto ink.
- **V5**:
  - sin valores arbitrarios, hex, `any` ni `ds-allow` nuevos en `src/modules/links`, `shared/lib/dialog`
    ni `core/analytics.ts`;
  - `client:load` de `LinksDiagnosticDialog` justificado (primer pantallazo);
  - tokens nuevos (`--dialog-w-sm`, `--dialog-max-h-sheet`, `--dialog-sheet-pad-b`) usados y sin
    redefinir nombres de Tailwind.
- **content-gaps**: P1 con el ID de GTM/GA4 pendiente y la lista de eventos (`design/content-gaps.md:141`).
