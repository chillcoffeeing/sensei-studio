# Verify LINKS-PAGE — vuelta 1
Resultado: VERDE

Método: `./init.ps1` y Playwright 1.55 con Chromium (instalado en el scratchpad, no en el
proyecto) contra el build servido con `node dist/server/entry.mjs` en `127.0.0.1:4431`. El
servidor se paró por su id de tarea. Comparé con `get_screenshot` de 230:977
(fileKey `flzA0qnj6JdalFCgyB2PdI`).

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] `src/modules/links/LinksServicesLink.astro:17-18`: el `<h3>` está dentro de un `<span>`.
  Un `<span>` solo admite contenido de frase, así que el HTML no valida, aunque el navegador
  lo pinta y lo expone bien. Esperado: un contenedor `<div>` (es válido dentro del `<a>`, porque
  `<a>` es transparente y su padre es `<section>`). Actual: `<span class="flex min-w-0 flex-1 flex-col …"><h3>`.
- [V6] Sin JS, `LinksQuoteSelector` muestra el contador "Ninguno seleccionado" fijo aunque se
  marquen casillas. Las tarjetas sí se marcan con `has-checked` y el envío funciona. Si se
  quiere, el contador puede ocultarse hasta que hidrate la isla. No bloquea: sin JS el destino
  es válido.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (check:ds, check:arch, astro check y build).
- **SEO y estructura**:
  - `/links/` responde 200;
  - title "Sensei Studio · Links", meta description propia, canonical y `og:url` `…/links/`;
  - `/links/` está en `sitemap.xml`;
  - un único h1 ("De la idea al resultado / Medible, real."), h2 por bloque y h3 en Origen y servicios;
  - landmarks `header`, `main`, `footer` y `nav[Enlaces del estudio]`.
- **V2 orden y estructura** (igual que el frame): cabecera, mini cotización, guía, explora (Origen + "Ver todos" + servicios), cierre + pie.
  - La composición coincide con Figma.
  - Desviaciones justificadas en el informe y que no empeoran:
    - escala de texto más legible;
    - CTA de 2 piezas (lo pide la feature);
    - WhatsApp como círculo por debajo de 384px;
    - 5 servicios (una sola fuente) con el quinto a ancho completo;
    - banda inferior de contraste en Origen.
- **V3 responsive**:
  - `scrollWidth` es igual al viewport a 375, 768, 1024 y 1440;
  - a 375 la página es fiel al frame;
  - en 768, 1024 y 1440 es una columna de 448px centrada (márgenes 160/160, 288/288 y 496/496) sobre stone-100, con radio y sombra, sin estirar;
  - no hay ningún objetivo táctil por debajo de 44px de alto;
  - con `reducedMotion: reduce`, 0 elementos `motion-safe` con duración distinta de 0s.
- **"Continuar cotización"**:
  - al elegir 2 servicios, `data-quote-services="email-marketing ux-ui"` y el modal se abre con exactamente esos marcados;
  - Esc devuelve el foco a "Continuar cotización";
  - "Cotizar proyecto" de la cabecera reabre el modal con la selección intacta;
  - si se desmarca todo y se continúa, el modal se abre vacío.
- **Sin JS**: el envío lleva a `/?services=branding&services=ads-seo#contacto`, y `#contacto` existe. "Cotizar proyecto" apunta a `/#contacto`.
- **Contador**: Ninguno → 1 seleccionado → 2 seleccionados → 1 seleccionado. También funciona con teclado (Space en la casilla) y tiene `aria-describedby` en el grupo.
- **Destinos**:
  - `/proyectos/origen/` 200;
  - `/#proyectos`, `/#servicios` y `/#contacto` tienen sus ids en el home;
  - "Studio" lleva a `/`;
  - WhatsApp `https://wa.me/` usa `target=_blank`, `rel=noopener noreferrer` y aviso sr-only.
- **PENDIENTE**:
  - la guía (`guideHref` en `src/content/links.ts:19-21`) está comentada como PENDIENTE y hoy da 404, como acepta la feature;
  - WhatsApp está centralizado y marcado PENDIENTE en `src/content/site.ts:30-32`;
  - Privacidad se pinta como texto, también PENDIENTE.
- **Header y barra flotante**: no aparecen en /links. La decisión está justificada en el informe, en `src/pages/links.astro` y en `StandaloneLayout.astro`: la cabecera propia ya trae los mismos CTA. El modal global sí está.
- **Rebote de salida del hover líquido** (`src/shared/ui/CtaBrandShape.svelte`):
  - en reposo la curva es `cubic-bezier(0.2, 0, 0, 1)` y en hover `cubic-bezier(0.34, 1.56, 0.64, 1)`;
  - muestreé el `scale` del puente unas 1000 veces durante 700ms al salir, en "Continuar cotización" y en "Cotizar proyecto" de /links: baja de forma monótona de `1` a `0.25 0`, con mínimo 0 y sin negativos.
- **Regresiones**:
  - home: 1 h1, sin scroll horizontal y el modal se abre desde "Cotizar proyecto" sin marcas impuestas;
  - una selección hecha en el modal se conserva al reabrirlo, así que los disparadores sin atributo no tocan la selección;
  - los rótulos de `/proyectos/origen/` siguen bien con `LabelMarker`;
  - 0 errores de consola en /links y en el home.
- **V4**:
  - no hay imágenes rotas;
  - logo, wordmark, atmósfera y flechas salen de `src/assets/links/`;
  - `origen-cover.jpg` se reutiliza (md5 idéntico, según el informe);
  - los iconos de servicio vienen del modal;
  - las proporciones son correctas en las capturas.
- **V5**:
  - no hay arbitrarios `[0-9#`, hex, `client:load`, `any` ni `ds-allow` en el código nuevo;
  - `-z-10` es una utilidad nativa dentro de `isolate`;
  - no hay imports entre módulos;
  - el copy está en `src/content/links.ts`;
  - `--text-guide-cover` se usa y es un nombre nuevo, no redefinido;
  - solo hay una isla nueva (`client:visible`) y tiene interacción.
- **Componentes**:
  - hay un componente por bloque y por pieza, cada uno con 1 a 3 props tipadas y específicas, sin componentes versátiles;
  - `LabelMarker` y `countLabel` subieron a `shared/` porque se repetían.
- **V7**: los cambios fuera de `modules/links` (`DocumentHead`, `StandaloneLayout`, el hook `data-quote-services`, `LabelMarker` en lugar de `ProjectSectionLabel` y `CtaBrandShape`) los pide la feature o los motiva check:arch.
