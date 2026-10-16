# impl LINKS-PAGE: linktree de Instagram en /links

Figma (fileKey `flzA0qnj6JdalFCgyB2PdI`): `get_design_context` de 230:977 con screenshot. La respuesta llegó completa (los 6 bloques con todos sus hijos), así que no pedí subnodos. Las URLs de asset de `get_design_context` daban 404, así que los bajé con `download_assets` del mismo nodo: 4 imágenes y 16 SVG.

## Archivos

**Vista nueva `modules/links/`** (vista fija como `project`; un componente por bloque, props mínimos):
- `schema.ts`: tipo `Links` con `seo`, `header`, `quote`, `guide`, `explore` y `closing`, más un tipo por bloque.
- `index.ts`: la API pública (`Section` y los tipos).
- `ui-icon.ts`: helper `ImageRef → UiIcon`.
- `Section.astro`: monta los bloques en el orden del frame. Es columna `max-w-md` desde sm, con `<main>` entre la cabecera y el pie.
- `LinksHeader.astro`: bloque 230:978. Atmósfera con velo del 85 % y ruido, logo, h1 en 2 líneas, descripción, `LinkCtaBrand` "Cotizar proyecto" con `data-quote-open` y `LinksWhatsAppLink`.
- `LinksWhatsAppLink.astro`: píldora con borde translúcido y el logo como máscara.
- `LinksQuote.astro`: tarjeta 230:1006 sobre la banda ink de 230:1007. Lleva `LabelMarker`, h2, descripción, la isla y la nota.
- `LinksQuoteSelector.svelte`: isla `client:visible`. Tiene los servicios, el contador y `ButtonCtaBrand` "Continuar cotización", que es `type=submit` con `data-quote-open` y `data-quote-services`.
- `LinksServiceOption.svelte`: tarjeta-checkbox vertical (230:1020).
- `LinksGuide.astro` y `LinksGuideCover.astro`: guía 230:1047 y su portada tipográfica `aria-hidden`.
- `LinksExplore.astro`, `LinksProjectCard.astro` y `LinksServicesLink.astro`: bloque 230:1065. El h2 es el rótulo; Origen y servicios van como h3.
- `LinksClosing.astro`, `LinksContactReminder.astro` y `LinksFooterNav.astro`: bloque 230:1085, con `<footer>`, `<hr>` y el `<nav>` del pie.

**Rutas, app y contenido:**
- `src/app/links.ts`: puerta (`LinksView`, `Links`).
- `src/content/links.ts`: copy de Figma. Servicios, destinos de cotización y WhatsApp salen de `content/site.ts`; la ruta del caso, de `projectPath` (`content/projects.ts`).
- `src/pages/links.astro`: ruta estática `/links/` con `StandaloneLayout`.
- `src/pages/sitemap.xml.ts`: añade `/links/`.

**Layout:**
- `src/layout/DocumentHead.astro`: nuevo. Es el `<head>` que antes estaba dentro de `BaseLayout`, sin cambios de contenido.
- `src/layout/BaseLayout.astro`: ahora usa `DocumentHead`.
- `src/layout/StandaloneLayout.astro`: nuevo. `DocumentHead` + slot + `QuoteDialog`, sin header, barra flotante ni footer.
- `src/layout/quote/QuoteDialog.svelte`: enganche `data-quote-services` en el listener delegado.
- `src/layout/quote/quote-form.ts`: `presetServices()` nuevo; `countLabel` sale de aquí.
- `src/layout/quote/QuoteServices.svelte`: importa `countLabel` de `shared/lib`.
- `src/layout/quote/QuoteHeader.svelte`: el rótulo usa `LabelMarker` (check:arch detectó que replicaba su marcado).

**Librería compartida:**
- `src/shared/ui/CtaBrandShape.svelte`: salida del puente sin rebote (ver abajo).
- `src/shared/ui/LabelMarker.svelte`: nuevo. Sube `modules/project/ProjectSectionLabel.astro` (borrado) a la librería; se repetía en el proyecto, el modal y /links.
- `src/shared/lib/count-label.ts`: nuevo, con `countLabel` y `CountLabels`, compartido por el modal y /links.
- `src/modules/project/*.astro` (10 archivos: `ConclusionLesson`, `ContactInvitation`, `ContextChallenge`, `ContextIntro`, `ProcessIntro`, `ProjectNext`, `ProjectResults`, `ScopeIntro`, `SolutionDecisions`, `SolutionIntro`): importan `LabelMarker`.
- `src/content/ui-catalog.ts` y `src/pages/componentes.astro`: entrada y ejemplo de `LabelMarker`.

**Assets y tokens:**
- `src/assets/links/`: 8 assets nuevos, sin modificar (ver Assets).
- `src/styles/tokens.css`: `--text-guide-cover`.

**Documentación y estado:**
- `docs/architecture.md`: sección "Módulo de vista: `links`", contrato `data-quote-services` y disparador `<button>` en "Modal de cotización". El mapa de módulos lo regenera check:arch.
- `docs/components.md`: ficha `LabelMarker`, nota de la salida de `CtaBrandShape`, consumidores (`modules/project` y `modules/links`) y fila de /links en "Fuera de la librería". Quité la fila de `ProjectSectionLabel`.
- `docs/design-system.md`: `text-guide-cover`.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Corrección de paso: salida del hover líquido (menor V2 de verify_UI-POLISH-01)

- **Qué hice**: en `CtaBrandShape`, el puente y la flecha llevan `motion-safe:ease-standard` en reposo, y `ease-cta-liquid` solo en `can-hover:group-hover/cta:` y `group-focus-visible/cta:`.
- **Por qué funciona**: la curva que manda en una transición es la del estado de destino. Así la entrada conserva el rebote y la salida no. El selector de hover tiene más especificidad, así que el orden en el CSS no importa.
- **Comprobado** en Chromium, con el `scale` del puente muestreado cada 20 ms al salir del hover:
  - baja de forma monótona: `1 → 0.94/0.93 → 0.85/0.80 → … → 0.25/0.0019 → 0.25 0`;
  - ya no hay valores negativos (antes llegaba a ≈ −0.086).
- **Reduced motion**: `transitionDuration` es `0s`.
- Afecta a todos los consumidores: header, menú mobile, envío del modal y /links.

## Decisiones

- **Header y barra flotante**: no aparecen en /links. Es una landing de bio y su cabecera ya trae logo, "Cotizar proyecto" y WhatsApp; la barra flotante repetiría esos dos CTA y el header añadiría un tercer CTA ("Agenda una reunión") en una pantalla de móvil. Tampoco va el footer global: el frame trae su pie mínimo. El modal sí está (`StandaloneLayout`).
- **Preselección (`data-quote-services`)**:
  - Es un atributo neutro en el disparador, con los valores separados por espacios.
  - Al abrir, `QuoteDialog` fija **exactamente** esos servicios; `presetServices` descarta los que no existen. Vacío = ninguno; sin atributo, no toca la selección. Así "Cotizar proyecto" de la cabecera conserva lo marcado.
  - La isla de /links solo escribe el atributo: ningún módulo importa el modal.
  - Comprobado: con UX/UI y Branding elegidos, el contador pasa a "2 seleccionados", `data-quote-services="ux-ui branding"`, el modal abre con `['branding','ux-ui']`, Esc devuelve el foco a "Continuar cotización", y el CTA de la cabecera reabre el modal con la selección intacta.
- **Sin JS**:
  - La mini cotización es un `<form method="get" action="/#contacto">` y el botón es `type=submit`. Comprobado sin JS: lleva a `/?services=ads-seo#contacto`.
  - Con JS, el listener delegado cancela el envío y abre el modal.
  - Si se pulsa antes de que hidrate el modal (`client:idle`), cae en el mismo destino válido.
- **Una sola fuente de servicios**: `quote.services = site.quote.services`, con título, contador, opciones, iconos y check del modal.
  - Figma dibuja 4 servicios provisionales (Desarrollo web, UX/UI, Branding, Automatización); se ven los 5 del modal, y el quinto ocupa la fila entera (`last:odd:col-span-2`).
  - Los iconos y el check también son los del modal, no los 19px/1.6 del frame.
- **WhatsApp**: href, aviso de pestaña nueva y logo salen de `site.floatingBar.whatsapp`. El destino sigue **PENDIENTE** (`https://wa.me/`).
- **Guía**: `guideHref = '/guias/7-claves-web-que-convierte.pdf'` en `content/links.ts`, marcado **PENDIENTE**.
  - El PDF no existe: hoy el enlace da 404 hasta que se suba a `public/guias/` o se cambie la constante.
  - No lleva el atributo `download`, para no lanzar una descarga rota.
- **Destinos**:
  - Origen → `/proyectos/origen/` (vía `projectPath`);
  - "Ver todos los proyectos" → `/#proyectos`;
  - servicios → `/#servicios` (el id real del home);
  - "Studio ↗" → `/`, con el signo `aria-hidden`;
  - "Privacidad" va como texto sin enlace (**PENDIENTE**: no hay página), con el mismo patrón que License/Style Guide del footer.
- **Reutilizado**:
  - `LinkCtaBrand` (sobre ink);
  - `ButtonCtaBrand` (sobre blanco, para tener el foco `outline-ink`; con `LinkCtaBrand` el anillo brand no se vería sobre la tarjeta blanca);
  - `LabelMarker` (subido de `ProjectSectionLabel`);
  - `countLabel` (subido a `shared/lib`);
  - `surface-noise`, `brand-tint`, `stone-*` y el resto de tokens existentes.
- **Semántica**:
  - un único h1 (el lema de la cabecera);
  - h2 en mini cotización, guía, "Explora el studio" (el propio rótulo) y "¿Lo conversamos?"; h3 en Origen y servicios;
  - `section[aria-labelledby]` en cada bloque;
  - canonical `https://dominio-por-confirmar.example/links/`.

## Desviaciones de Figma (y motivo)

- **Tamaños de texto**: uso la escala nativa de Tailwind en lugar de los px del frame. Figma usa 8–13px, que son pocos legibles en móvil:
  - h1: 30px (`text-3xl/tight`, Figma 28);
  - h2 de la tarjeta: 24 (Figma 25);
  - descripciones: 14 (Figma 12–13);
  - rótulos: 12 (`LabelMarker`, Figma 10);
  - nota y categoría: 12 (Figma 9–10).
  - La única excepción es la portada de la guía, que es ilustración: 8px con `--text-guide-cover`.
- **CTA en 2 piezas**: "Cotizar proyecto" y "Continuar cotización" usan el CTA del sitio (píldora de 193 + círculo de 40, hover líquido), no la píldora única de Figma. Lo pide la feature.
  - Por eso "Continuar cotización" mide 238px y va centrado, no a todo el ancho: la librería no admite `class` ni variantes de ancho.
- **WhatsApp en la cabecera**: en una fila de menos de 384px (375 → 335 útiles) no caben el CTA de 238 y la píldora de 143. Por debajo de `@sm` del contenedor queda como círculo de 40 con el logo; el texto pasa a `sr-only` y el nombre accesible es "WhatsApp (se abre en una pestaña nueva)". Desde 384px se ve la píldora con texto (en 768/1024/1440 se ve completa).
  - Lleva el logo real, no el "circle-x" placeholder (decisión de UI-POLISH-01).
- **Tarjeta Origen**: además del degradado izquierdo de Figma (ink/50), lleva una banda inferior `from-ink/70` para que el claim y la categoría blancos lean sobre la arena clara.
  - La categoría no se recorta a 215px: así cabe en una línea.
- **Radios**: 24 (`rounded-3xl`) en las tarjetas grandes en lugar de 20, y 12 (`rounded-xl`) en las pequeñas.
- **Sombras**: `shadow-lg` y `shadow-md` nativas en lugar de las de Figma.
- **Divisor del pie**: `border-neutral-800` (#262626; Figma #333330).
- **Copy**: la categoría va en tipo de oración en el contenido y se pinta en mayúsculas con CSS.
- **Assets de Figma no usados**:
  - `Home atmosphere` (svg3) y `Studio signature` (svg13): son exportaciones aplanadas del nodo (rectángulo con efecto de ruido y el bloque entero con el texto como trazos). El ruido es `surface-noise` y el texto es HTML.
  - raw3 y raw4: copias de baja resolución de la atmósfera y de Origen.

## Assets

- `src/assets/links/header-atmosphere.png`: raw de 230:979, 1280×720. Decorativo, bajo `bg-black/85`.
- `src/assets/links/sensei-studio-logo.svg`: 224:364, 94×35.84. `alt="Sensei Studio"`.
- `src/assets/links/sensei-wordmark.svg`: 230:1093, 76×20.
- `src/assets/links/arrow-up-right.svg`: 18, de 230:1098 = 230:1119, idénticos. Es la flecha de los dos CTA.
- `src/assets/links/arrow-up-right-sm.svg`: 16, de 230:1125. "Ver todos".
- `src/assets/links/arrow-up-right-md.svg`: 20, de 230:1128. Servicios.
- `src/assets/links/arrow-up-right-paper.svg`: 15, blanco, de 230:1131. WhatsApp del cierre.
- `src/assets/links/download.svg`: 18, de 230:1122.
- **Reutilizados**:
  - `src/assets/project/origen-cover.jpg`: md5 idéntico al raw de 230:1071;
  - iconos de servicio y check: los del modal (`src/assets/quote/`);
  - logo de WhatsApp: `src/assets/floating-bar/whatsapp.svg`.

## Tokens

- `--text-guide-cover: 8px` (line-height 1.3, peso 400), para la portada tipográfica de la guía (230:1053). Tailwind no trae nada por debajo de `text-xs` (12px), y a 12px "SENSEI / GUÍAS" no cabe en la portada de 102px.
- No queda ningún token sin uso: `--ease-cta-liquid` y `--duration-cta-liquid` se siguen usando.

## Responsive inferido

- **375**:
  - columna a todo el ancho, sin radio;
  - cabecera centrada, con el CTA de 238 y WhatsApp como círculo;
  - servicios en 2 columnas y el quinto a fila completa;
  - guía con la portada a la izquierda;
  - cierre en una fila: el WhatsApp del cierre pasa a 12px en móvil, como en Figma, y a 14 desde sm.
- **768, 1024 y 1440**: columna de 448px centrada sobre `stone-100`, con `rounded-3xl`, `shadow-xl` y `py-10`. El diseño no se estira. WhatsApp con texto.
- **Desbordes**: ninguno; `scrollWidth` es igual al viewport a 375, 768, 1024 y 1440.
- **Motion**: solo hover y foco. Todo es `motion-safe:`, tras `can-hover:` donde hay hover, y solo con transform y colores:
  - zoom de la foto de Origen (`--duration-image`);
  - desplazamiento de las flechas;
  - bordes.
- **Islas**: solo `LinksQuoteSelector` (`client:visible`) y el modal (`client:idle`).

## Comprobación

- Usé Playwright 1.55 instalado en el scratchpad (no es dependencia del proyecto), con Chromium, contra el build servido con `node dist/server/entry.mjs` en `127.0.0.1:4417`. Al terminar paré el servidor por su id de tarea.
- **Capturas**: a 375, 768, 1024 y 1440, la mini cotización con 2 elegidos y el modal preseleccionado.
- **Consola**: sin errores.
- **Rótulos del detalle de proyecto**: siguen igual con `LabelMarker` (altura de 15px, "01 / Resultados"…).
- **Limpieza**: un `node -e` mío escribió dos capturas con una ruta MSYS mal resuelta en `C:\c\Users\…`; borré esa carpeta, que solo tenía eso.

## init.ps1

VERDE:
- toolchain e install OK;
- 1 feature in_progress;
- check:ds: 0 ds-allow, 0 errores;
- check:arch: 266 archivos, 13 módulos, 0 errores;
- astro check: 0 errores y el hint previo de `media` (ahora en `DocumentHead.astro:66`, la misma línea movida);
- astro build OK.
