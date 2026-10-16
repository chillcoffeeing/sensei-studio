# impl UI-LIB-001 — Librería de componentes (primitivos de UI sobre el sistema de diseño)

Figma MCP: no disponible en esta sesión (requiere autorización). Las medidas salen del código
ya verificado de cada sección (que cita sus nodos 11:12 / 1:17) y de `design/INVENTORY.md`.
Los componentes reproducen el marcado actual sin cambiar ningún valor.

## 1. Inventario de patrones (todos los módulos + layout)

| Patrón | Dónde aparece | Decisión |
|---|---|---|
| Texto en dos tonos | hero (lead), process (h2), showcase (h2), contact (h2), SectionHeader, stats/services/team (descripción) | `ToneText` (ya existía) |
| Eyebrow (punto lima + mayúsculas) | SectionHeader → projects, stats, services, testimonials, team, faq | `Eyebrow` (SectionHeader ya lo usa) |
| Cabecera de sección (eyebrow + h2 + aside) | projects, stats, services, testimonials, team, faq | `SectionHeader` (ya existía) |
| Descripción de sección (ToneText, body, muted) | stats (410), services (410), team (401) | `SectionDescription` (ancho lo pone el contenedor) |
| Título de columna en mayúsculas (h2 12px) | footer: 3 columnas + "By Sensei" | `HeadingOverline` |
| Enlace de texto con signo final | projects ("VER TODOS…    +"), testimonials ("DÉJANOS…   +") | `LinkMore` |
| Enlace del nav principal sobre ink | header desktop | `LinkNav` |
| Enlace grande sobre ink con área 44 | menú mobile | `LinkMenu` (Svelte) |
| Enlace de columna del footer (o texto sin href) | footer columnas | `LinkFooter` |
| Enlaces legales con separador vertical | footer (License · Style Guide) | `LegalLinks` |
| CTA píldora brand + círculo con flecha | header desktop, menú mobile | `LinkCtaBrand` (Svelte) |
| Botón píldora brand | menú mobile (Menú / Cerrar) | `ButtonBrand` (Svelte) |
| Botón píldora ink a todo el ancho | contacto (submit) | `ButtonInk` (Svelte) |
| Botón icono glass de pausa (44, aria-pressed) | showcase, footer (rueda) | `ButtonPauseGlass` (Svelte) |
| Label visualmente oculta | contacto (3 campos) | `LabelHidden` (Svelte) |
| Input sobre glass + estado de error | contacto (3 campos) | `InputGlass` (Svelte; error = `aria-invalid`) |
| Mensaje de error de campo | contacto | `FieldError` (Svelte) |
| Mensaje de estado del envío / error del envío | contacto | `FormStatus` y `FormStatusError` (dos aspectos → dos componentes) |
| Avatar de iniciales (4 tonos) | testimonials | `AvatarInitials` |
| Card de reseña | testimonials (masonry) | `ReviewCard` |
| Card de proyecto con pill + detalle de métricas | project-gallery | `ProjectCard` |
| Pill blanca (texto pill) | project-gallery (título, industria) | interna de `ProjectCard` (solo existe ahí) |
| Acordeón de cards Q&A con botón + | faq | `AccordionCards` (isla) |
| Acordeón de filas con panel de lista e imágenes | services | se queda en el módulo (único; el comportamiento ya es `AccordionController`) |
| Botón círculo ink con + (24) | team | UI-LIB-002 (card del equipo, dentro de TeamSlider) |
| Separadores: línea svg de métrica, borde de fila, línea vertical | stats, services, footer | vertical → dentro de `LegalLinks`; los otros dos, únicos de su módulo |
| Cifra + línea + etiqueta | stats | módulo (único) |
| Paso con barra de progreso, badge giratorio | process | módulo (único) |
| Wordmark, lista, regla lima | hero | módulo (único) |
| Marquee de logos | logo-marquee | módulo (único) |
| Estrellas / prueba social | testimonials | es una imagen (`social-proof.png`), no hay componente |
| Card glass de contacto + legal con enlaces | contact | módulo (único) |
| Slider showcase, carril y card del equipo | showcase, team | **UI-LIB-002** |
| Galería-rueda | footer | layout (único) |
| Anillo de foco (brand/ink/paper, offset 2/4) | todos | encapsulado en cada componente (no utilidad nueva) |

## 2. Archivos

Creados:
- `src/shared/ui/types.ts` — tipos de datos de la librería (UiIcon, UiImage, UiOptionalLink, AvatarTone, ProjectCardData, AccordionCardItem).
- `src/shared/ui/Eyebrow.astro`
- `src/shared/ui/SectionDescription.astro`
- `src/shared/ui/HeadingOverline.astro`
- `src/shared/ui/LinkMore.astro`
- `src/shared/ui/LinkNav.astro`
- `src/shared/ui/LinkFooter.astro`
- `src/shared/ui/LegalLinks.astro`
- `src/shared/ui/AvatarInitials.astro`
- `src/shared/ui/ReviewCard.astro`
- `src/shared/ui/ProjectCard.astro`
- `src/shared/ui/LinkCtaBrand.svelte`
- `src/shared/ui/LinkMenu.svelte`
- `src/shared/ui/ButtonBrand.svelte`
- `src/shared/ui/ButtonInk.svelte`
- `src/shared/ui/ButtonPauseGlass.svelte`
- `src/shared/ui/InputGlass.svelte`
- `src/shared/ui/LabelHidden.svelte`
- `src/shared/ui/FieldError.svelte`
- `src/shared/ui/FormStatus.svelte`
- `src/shared/ui/FormStatusError.svelte`
- `src/shared/ui/AccordionCards.svelte` — isla (única con estado).
- `src/shared/lib/initials.ts` — `initials()` movida desde el masonry (la usa ReviewCard).
- `src/assets/ui/divider-vertical.svg` — copia exacta de `src/assets/footer/meta-divider.svg` (asset intrínseco de LegalLinks).
- `src/content/ui-catalog.ts` — datos del catálogo (textos + muestras tomadas de home y site).
- `src/pages/componentes.astro` — página interna `/componentes` (noindex; fuera del sitemap porque el sitemap solo lista `content/pages`).
- `tests/ui-library.test.ts` — 133 tests (ver §5).
- `docs/components.md` — catálogo de la librería.

Modificados:
- `src/shared/ui/SectionHeader.astro` — usa `Eyebrow` (mismo marcado); doc de `titleClass` como excepción.
- `src/modules/testimonials/masonry.ts` — `initials` se reexporta desde `shared/lib/initials` (misma API).
- `src/styles/tokens.css` — grupo nuevo "Librería de componentes" y alias en FAQ/contacto.
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `docs/architecture.md` — solo el mapa generado por `check:arch` (sin cambios de contenido).
- `feature_list.json` (`in_progress`), `progress/current.md` (plan).

Migración de módulos: **no** (es UI-LIB-003; muchos tests leen el fuente de los módulos y la
migración pide capturas antes/después). Lo único "migrado" es interno de la librería
(SectionHeader → Eyebrow) y `initials` (reexport, sin cambio de comportamiento).

## 3. Reglas de API aplicadas

- Ningún `variant`, ningún booleano de aspecto; dos aspectos = dos componentes
  (`ButtonBrand`/`ButtonInk`, `LinkNav`/`LinkMenu`/`LinkFooter`, `FormStatus`/`FormStatusError`).
- Máximo de props declaradas: 4 (`SectionHeader`, `ButtonPauseGlass`, `ReviewCard`).
- Ningún componente acepta `class`: la colocación la hace el contenedor. Excepción documentada:
  `SectionHeader.titleClass` (solo `max-w-(--*-title-max)`, ya existía).
- Svelte con `...rest` de atributos nativos donde envuelven un control (`<a>`, `<button>`,
  `<input>`, `<p>` de estado), siempre con `Omit<…, 'class'>`.
- Estado por atributo: error de `InputGlass` = `aria-invalid` (`aria-invalid:border-danger`,
  verificado en el CSS compilado); `ButtonPauseGlass.pressed` → `aria-pressed` (booleano de
  estado, excepción documentada). `AvatarInitials.tone` documentado como dato, no variante.
- Svelte sin estado (`ButtonBrand`, `LinkCtaBrand`, `LinkMenu`, controles de formulario):
  Svelte porque los usan islas (menú mobile, formulario); desde Astro se renderizan estáticos.
- Tailwind v4: solo utilidades sobre tokens; **ningún CSS propio** ni `@utility` nuevo.

## 4. Tokens agregados (grupo "Librería de componentes")

| Token | Valor | Origen |
|---|---|---|
| `--field-pad-x` | `calc(var(--spacing-16) - var(--spacing-px))` | @figma 174:81 padding-x 16 − borde interior |
| `--field-pad-y` | `calc(var(--spacing-12) - var(--spacing-px))` | @figma 174:81 padding-y 12 − borde interior |
| `--field-error-gap` | `var(--spacing-5)` | @derived (Figma no diseña errores) |
| `--form-status-gap` | `var(--spacing-12)` | @derived (gap de campos 174:79) |
| `--accordion-card-pad-x` | `clamp(20px, 12.9577px + 1.8779vw, 40px)` | @figma 174:158 padding-x 40 · @derived mínimo 20 |
| `--accordion-card-pad-y` | `clamp(20px, 15.7746px + 1.1268vw, 32px)` | @figma 174:158 padding-y 32 · @derived mínimo 20 |
| `--accordion-card-answer-gap` | `var(--spacing-24)` | @figma 174:158 gap 24 |
| `--accordion-card-icon-gap` | `var(--spacing-16)` | @derived (mobile, 2 líneas) |

Los tokens equivalentes de módulo (`--faq-card-pad-x/y`, `--faq-answer-gap`, `--faq-icon-gap`,
`--contact-field-pad-x/y`, `--contact-error-gap`, `--contact-status-gap`) pasan a **alias**
(`var(--<token de librería>)`, `@derived alias … hasta UI-LIB-003`): un solo valor, mismo render.

## 5. Responsive inferido

Ningún valor nuevo de layout: los componentes conservan el comportamiento fluido de su sección
de origen (clamps de FAQ/contacto ya `@derived`, `min-h-44` de LinkMore por debajo de lg).
`LinkCtaBrand` incorpora `min-h-44` también en el header desktop: la píldora de 40 queda centrada
en la fila de 40 sin cambiar el alto (es el área táctil que ya tenía el menú mobile).
`ButtonBrand` añade `cursor-pointer` (antes no lo tenía el botón del menú).

Página `/componentes`: una columna en `container-page`; ejemplos claros con borde divider,
oscuros sobre `bg-ink surface-noise tone-on-ink`. Revisada con Chrome headless a 1440 y 375
(perfil temporal propio): sin desbordes; formulario, botones, cards y acordeón con el aspecto
de sus secciones.

## 6. Tests (`tests/ui-library.test.ts`)

- cada `.astro`/`.svelte` de `shared/ui` tiene su `### \`Nombre\`` en `docs/components.md`, y no hay fichas huérfanas;
- `interface Props` en todos; ≤ 4 props de datos (umbral `MAX_PROPS`);
- sin props de aspecto (`variant`, `size`, `dark`, `class`…) ni de tipo `boolean`, salvo las excepciones documentadas (`SectionHeader.titleClass`, `ButtonPauseGlass.pressed`);
- los Svelte que reenvían atributos nativos excluyen `class`;
- sin copy en el marcado estático de los componentes;
- `/componentes` importa y pinta cada componente, el catálogo no lista inexistentes, es `noindex`, fuera de `content/pages` (sitemap) y solo hidrata `AccordionCards`;
- `initials()` de `shared/lib`.

## 7. Pendiente para el orquestador

- **Enlazar `docs/components.md` desde `CLAUDE.md`** (criterio de aceptación): `CLAUDE.md` es
  del orquestador, no lo edité. Fila propuesta para la tabla "Dónde está cada cosa":
  `| Librería de componentes (catálogo y API) | docs/components.md, página /componentes |`.
- `docs/architecture.md` › Capas menciona `shared/ui/ (Button, Eyebrow, ToneText…)`: conviene
  ajustar a los nombres reales (orquestador).

## 8. `./init.ps1`

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds  → 419 tokens · 0 ds-allow · 0 error(es)
[OK] check:arch → 106 archivos · 11 módulos · 0 error(es)
[OK] astro check → 0 errors · 0 warnings
[OK] vitest (incluye 133 tests de ui-library)
[OK] astro build (dist/client/componentes/index.html; sitemap solo con /)
VERDE: todo en orden.
```
