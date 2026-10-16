# Librería de componentes

Catálogo de `src/shared/ui/`. Reglas en `docs/conventions.md` › Librería de componentes.
Revisión visual en la página interna **`/componentes`** (`src/pages/componentes.astro`,
noindex y fuera del sitemap), que pinta cada componente con datos reales de `src/content/`
(`src/content/ui-catalog.ts`). Todo componente de la carpeta debe estar documentado aquí y
aparecer en el catálogo (lo revisa el verifier).

## Reglas de API (resumen)

- **Sin variantes.** Ni `variant`, ni booleanos de aspecto (`dark`, `small`…). Si dos usos se
  ven distintos, son dos componentes (`ButtonBrand` / `ButtonInk`, `LinkNav` / `LinkMenu`).
- **Máximo 4 props de datos** (`children`/slots no cuentan). El resto se compone con slots.
- **Sin `class` desde fuera.** La colocación (márgenes, ancho, posición, visibilidad) la decide
  el contenedor del consumidor: `<div class="max-w-102.5"><SectionDescription … /></div>`.
  Excepción documentada: `SectionHeader.titleClass` (ver abajo).
- **Atributos nativos sí** en los componentes Svelte que envuelven un elemento interactivo
  (`<button>`, `<a>`, `<input>`): `onclick`, `aria-*`, `id`, `name`, `type`, `data-*`… pasan con
  `...rest`. Su `Props` hace `Omit<…, 'class'>`, así que el aspecto no se puede cambiar.
- **Estado = atributo, no prop de aspecto.** El error de `InputGlass` es `aria-invalid="true"`;
  la pausa de `ButtonPauseGlass` es `pressed` (→ `aria-pressed`).
- **Sin copy.** Todo texto visible llega por props desde `src/content/`. Las imágenes
  decorativas intrínsecas (punto del eyebrow, línea vertical) las importa el componente desde
  `src/assets/ui/`; los iconos que viajan a una isla llegan como `UiIcon` (`{ src, width, height }`).
- **Astro si es estático, Svelte si tiene estado o lo usa una isla.** Un `.svelte` sin estado
  (p. ej. `ButtonBrand`) se renderiza estático desde Astro (sin `client:*`) y además se puede
  usar dentro de una isla (menú mobile, formulario). Excepción: los **sliders** son `.astro` con
  un `<script>` (ver *Sliders*).
- **Solo tokens.** Las medidas propias de la librería viven en `tokens.css` › *Librería de
  componentes* (`--field-*`, `--form-status-gap`, `--accordion-card-*`).

Tipos compartidos de datos: `src/shared/ui/types.ts` (`UiIcon`, `UiImage`, `UiPhoto`, `UiOptionalLink`,
`AvatarTone`, `ProjectCardData`, `AccordionCardItem`, `UiCount`, `UiRating`, `UiCaption`), estructuralmente iguales a los de
`core/content` (`UiPhoto` = `LocalImageRef | MediaRef`) para que contenido y módulos pasen sus datos sin conversión.

## Quién consume qué (UI-LIB-003)

Módulos y layout usan estos componentes; no hay marcado propio que los replique (lo vigila
`check:arch`, ver `docs/architecture.md` › Consumo de la librería).

| Consumidor | Componentes |
|---|---|
| `layout/Header.astro` (+ `HeaderNav`) | `LinkLogo`, `LinkNav`, `LinkCtaBrand` (→ `CtaBrandShape`) |
| `layout/MobileMenu.svelte` (isla) | `LinkLogo`, `ButtonBrand` (abrir y cerrar), `LinkMenu`, `LinkCtaBrand` |
| `layout/Footer.astro` (+ `FooterNavColumn`, `FooterStudio`, `FooterGalleryCard`) | `HeadingOverline`, `LinkFooter`, `LegalLinks`, `Photo` |
| `layout/FooterWheel.svelte` (isla) | `ButtonPauseGlass` |
| `layout/FloatingBar.svelte` (isla) | `LinkIconInk` (WhatsApp, vía `FloatingWhatsAppLink`); `FloatingActionLink` es propio del layout |
| `layout/quote/QuoteDialog.svelte` (isla) | `ButtonCtaBrand` (envío, vía `QuoteSubmitButton`), `LabelMarker` (rótulo de `QuoteHeader`); el resto son componentes propios de `layout/quote/` (superficie clara, la librería solo trae controles sobre oscuro) |
| `modules/hero`, `modules/process` | `ToneText` |
| `modules/project-gallery` | `SectionHeader`, `LinkMore`, `ProjectCard` (→ `Photo`) |
| `modules/project-index` (vista /proyectos/) | `SectionHeader` (h1), `SectionDescription`, `ProjectCard` |
| `modules/stats`, `modules/services` | `SectionHeader`, `SectionDescription` |
| `modules/showcase` | `ToneText`, `ShowcaseCarousel` |
| `modules/testimonials` | `SectionHeader`, `TrustBadge` (→ `UserPlaceholder`), `LinkMore`, `ReviewCard` (→ `AvatarInitials`) |
| `modules/team` | `SectionHeader`, `SectionDescription`, `TeamSlider`, `TeamCard` (→ `UserPlaceholder` sin foto, `TeamCardProfiles` → `LinkIconInk`) |
| `modules/process`, `modules/project-process` | `StepperSlider` (pasos / etapas en mobile) |
| `modules/faq` | `SectionHeader`, `AccordionCards` (isla) |
| `modules/contact` (`ContactBackdrop`, `ContactForm.svelte`) | `Photo` (fondo), `ToneText`, `LabelHidden`, `InputGlass`, `TextareaGlass`, `FieldError`, `ButtonInk`, `FormStatus`, `FormStatusError` |
| `modules/project-*` (case-study) | `LabelMarker` (rótulo de cada sección), `ToneText` (títulos con `
`), `TextLines`, `Photo` (portada, medios de la solución, conclusión, tarjeta siguiente) |
| `modules/links` (vista /links) | `LinkCtaBrand` ("Cotizar proyecto"), `ButtonCtaBrand` ("Continuar cotización", en la isla `LinksQuoteSelector`), `LabelMarker` |

## Qué entra en la librería

Un patrón entra si **se repite** (dos o más sitios) o **forma parte del lenguaje visual**
(controles, enlaces, textos de cabecera, cards). Las composiciones de una sola sección con
dominio propio se quedan en su módulo (ver "Fuera de la librería" al final). Los sliders
(showcase, equipo) son **un componente por slider** (UI-LIB-002); lo que comparten vive en
`shared/lib/slider`.

---

## Texto y cabeceras

### `ToneText`

- **Cuándo**: texto con partes en dos tonos (h2 de sección, lead del hero, descripciones con la
  primera frase destacada). No decide el color: lo leen `--tone-muted` / `--tone-strong` de la
  superficie (`tone-on-ink` / `tone-on-paper`).
- **Props**: `value: ToneText` (`Array<string | { text; tone: 'muted' | 'strong' }>`).
- **Tokens**: `--color-ink`, `--color-ink-muted`, `--color-paper`, `--color-paper-muted` vía `--tone-*`.

```astro
<h2 class="font-heading text-h2"><ToneText value={section.h2} /></h2>
```

### `TextLines`

- **Cuándo**: texto con saltos de línea fijos del diseño, dado como `string[]` (una entrada por
  línea): promesa del hero de proyecto, concepto de la lámina de marca, notas. Cada línea es un
  `<span class="block">` dentro del elemento que lo envuelve.
- **Props**: `lines: readonly string[]`.

### `Eyebrow`

- **Cuándo**: rótulo sobre un h2 de sección (punto lima + mayúsculas). Figma 16:70.
- **Props**: `text: string`.
- **Tokens**: `text-eyebrow`, `--tone-strong`, `gap-2.5`; asset `src/assets/ui/eyebrow-dot.svg`.

```astro
<Eyebrow text={section.headingContent.eyebrow} />
```

### `SectionHeader`

- **Cuándo**: cabecera común de las secciones claras (proyectos, métricas, servicios,
  testimonios, equipo, FAQ): `Eyebrow` + h2 en dos tonos + slot `aside` (descripción o enlace),
  que en lg+ va abajo a la derecha y en mobile se apila. Figma 32:82, 29:251, 31:20…
- **Props**: `headingId` (id del título para `aria-labelledby`), `level?: 'h1' | 'h2'` (por defecto
  h2; h1 solo en una página sin hero, `/proyectos/`; mismo aspecto), `eyebrow`, `title: ToneText`,
  `titleClass?`. Slot: `aside`.
- **Excepción `titleClass`**: solo para `max-w-(--<sección>-title-max)`, el ancho que reproduce
  el corte de línea de Figma de cada h2. Es la única prop de clases de la librería.
- **Entrada a viewport** (MOT-REVEAL): la columna (eyebrow + h2) y el aside llevan
  `data-head-part`, una marca neutra sin efecto propio. La sección que quiera la entrada
  escalonada pone `head-parts:reveal-up` en su contenedor `[data-reveal]` e incluye
  `[data-head-part]` en el selector de items (docs/conventions.md › Motion). Sin eso, nada cambia.
- **Tokens**: `text-h2`, `max-w-191`, `gap-3.75`, `--section-head-aside-gap`.

```astro
<SectionHeader headingId={headingId} eyebrow={section.headingContent.eyebrow} title={section.headingContent.title}>
  <div slot="aside" class="max-w-102.5"><SectionDescription value={description} /></div>
</SectionHeader>
```

### `SectionDescription`

- **Cuándo**: descripción de la cabecera de sección (primera frase en tono fuerte). Figma
  29:247, 31:30, 41:389. El ancho (410 / 401) lo pone el contenedor.
- **Props**: `value: ToneText`.
- **Tokens**: `font-body text-body`, `--tone-muted`.

```astro
<div slot="aside" class="max-w-100.25"><SectionDescription value={description} /></div>
```

### `HeadingOverline`

- **Cuándo**: título de columna del footer (h2 pequeño en mayúsculas sobre ink). Figma 174:29,
  174:36, 174:43, 174:49.
- **Props**: `text: string`. Renderiza un `<h2>`.
- **Tokens**: `text-overline`, `text-ink-muted`.

```astro
<HeadingOverline text={column.title} />
```

### `LabelMarker` (Svelte, sin estado)

- **Cuándo**: rótulo con marcador lima cuadrado de 6px + 12px SemiBold en mayúsculas. Figma 216:2881
  (secciones del detalle de proyecto), 220:868 (modal de cotización), 230:1009 (/links). No es
  `Eyebrow` (punto de 14px y 16px de texto). LINKS-PAGE lo subió desde el antiguo `modules/project`
  (`ProjectSectionLabel`) al repetirse en tres sitios.
- **Props**: `text`. El color se hereda del contenedor.
- **Elemento**: la raíz es un `<span>` en bloque (`flex`), así quien lo usa decide el elemento:
  suelto como rótulo, dentro de un `<p>` o dentro de un `<h2>` cuando el rótulo es el título del
  bloque ("Explora el studio" en /links).
- **Tokens**: `text-overline`, `size-1.5`, `bg-brand`, `gap-2`.

```astro
<h2 id={titleId}><LabelMarker text={explore.label} /></h2>
```

## Acciones y enlaces

### `LinkMore`

- **Cuándo**: enlace de texto en mayúsculas con signo final en la cabecera de una sección clara
  ("VER TODOS LOS PROYECTOS    +", "DÉJANOS UN COMENTARIO   +"). Figma 29:236, 38:321.
- **Props**: `href`, `label`, `marker` (signo decorativo, `aria-hidden`, **con la separación de
  Figma delante**: `'    +'` en proyectos, `'   +'` en testimonios).
- **Tokens**: `text-link`, `text-ink-muted` → `hover:text-ink`, `--duration-fast`,
  `ease-standard`; área táctil `min-h-11` por debajo de lg.

```astro
<LinkMore href={cta.href} label={cta.label} marker={`    ${cta.marker}`} />
```

### `LinkLogo` (Svelte, sin estado)

- **Cuándo**: logo enlazado a la home sobre ink, en el header y en la cabecera del panel del
  menú mobile (UI-LIB-003: el mismo marcado vivía duplicado en los dos). Figma 16:49 (desplazado
  3px a la izquierda). Área táctil de 44 de alto; el logo queda centrado en la fila de 40.
- **Props**: `href`, `logo: UiIcon` (SVG: URL + dimensiones), `label` (nombre accesible: alt del
  logo) + atributos nativos de `<a>` (`onclick` para cerrar el panel).
- **Tokens**: `-ml-0.75`, `h-11`, foco `outline-brand`.

```astro
<div class="justify-self-start">
  <LinkLogo href={logo.href} logo={icon(logo)} label={logo.alt} />
</div>
```

### `LinkNav`

- **Cuándo**: enlace del nav principal del header (desktop) sobre ink. Figma 11:28-11:30.
- **Props**: `href`, `label`. Atributos nativos del `<a>` (`data-*`, `aria-*`) pasan con `...rest`
  (sin `class`): el header pone `data-quote-open` en "Cotización" (QTE-MODAL).
- **Tokens**: `text-label`, `text-paper` → `hover:text-brand`, foco `outline-brand`.

```astro
<li><LinkNav href={item.href} label={item.label} /></li>
```

### `LinkMenu` (Svelte, sin estado)

- **Cuándo**: enlace grande del panel del menú mobile sobre ink (área táctil de 44). Figma no
  diseña el menú: toma el rol `text-title` de los enlaces del footer.
- **Props**: `href`, `label` + atributos nativos de `<a>` (`onclick` para cerrar el panel).
- **Tokens**: `text-title`, `text-paper` → `hover:text-brand`, `min-h-11`.

```svelte
<LinkMenu href={item.href} label={item.label} onclick={() => hide(false)} />
```

### `LinkFooter`

- **Cuándo**: enlace de columna del footer sobre ink. Sin `href` (destino aún sin definir) se
  pinta como texto con el mismo aspecto. Figma 174:30-174:47.
- **Props**: `label`, `href?`.
- **Caja**: `block w-fit` (UI-LIB-003): su alto es su interlineado aunque el `<li>` que lo
  contiene tenga otra fuente (antes la fuente iba en el `<li>`).
- **Tokens**: `text-title`, `text-paper` → `hover:text-brand`.

```astro
<li><LinkFooter label={link.label} href={link.href} /></li>
```

### `LegalLinks`

- **Cuándo**: enlaces secundarios (licencia, guía de estilo…) separados por una línea vertical
  de 10px, sobre ink. Figma 174:55.
- **Props**: `links: UiOptionalLink[]` (sin `href`, texto).
- **Tokens**: `text-meta`, `text-ink-muted` → `hover:text-paper`, `gap-3`, `h-2.5`; asset
  `src/assets/ui/divider-vertical.svg`.

```astro
<LegalLinks links={studio.legal} />
```

### `LinkIconInk` (Svelte, sin estado)

- **Cuándo**: enlace externo representado solo por un logo: WhatsApp de la barra flotante (Figma
  218:24, vía `layout/FloatingWhatsAppLink.svelte`) y perfiles profesionales de `TeamCard`
  (TEAM-V2). Svelte porque también lo usa una isla; desde Astro se renderiza estático.
- **Props**: `href`, `label` (nombre accesible completo, con el aviso de pestaña nueva), `icon: UiIcon`
  (SVG monocromo: se pinta como máscara sobre `bg-current`, en paper).
- **Accesible**: `target="_blank"` + `rel="noopener noreferrer"`, `aria-label`, logo `aria-hidden`;
  área táctil de 44; foco `outline-ink` + `ring-paper` (visible sobre claro y oscuro).
- **Tokens**: `size-11`, `rounded-full`, `bg-ink`, `text-paper`, `--duration-fast`, `ease-standard`.

```svelte
<LinkIconInk {href} label={`${label} ${newTab}`} {icon} />
```

### `LinkCtaBrand` (Svelte, sin estado)

- **Cuándo**: CTA principal del sitio: píldora brand de 193 × 40 + círculo brand de 40 con la
  flecha (header y menú mobile). Figma 11:31. En hover (`can-hover`) y `focus-visible` la píldora
  y el círculo se funden con un puente líquido (`CtaBrandShape`).
- **Props**: `href`, `label`, `icon: UiIcon` + atributos nativos de `<a>`. La flecha se pinta
  sin `width`/`height`: el SVG de Figma mide 11.1404 × 9 y los enteros del import lo deformarían
  (el círculo de 40 es fijo, sin salto de layout).
- **Colocación en el header**: la fila es `lg:grid-rows-1` sobre `h-10`, así el área táctil de 44
  de `LinkCtaBrand` y `LinkLogo` sobresale 2px arriba y abajo sin mover el nav.
- **Tokens**: `bg-brand`, `text-button-sm`, `rounded-pill`, `min-w-48.25`, `h-10`, `size-10`,
  `gap-1.25`, `px-5 pt-2.25 pb-2.5`; área táctil `min-h-11`; foco `outline-brand` (sobre ink).

```astro
<div class="hidden justify-self-end lg:block">
  <LinkCtaBrand href={cta.href} label={cta.label} icon={icon(cta.icon)} />
</div>
```

### `ButtonCtaBrand` (Svelte, sin estado)

- **Cuándo**: el mismo CTA como `<button>` sobre superficie clara: envío del modal de cotización
  (`QuoteSubmitButton`, Figma 220:994 con la anatomía de 11:31). Mismo dibujo y hover líquido.
- **Props**: `label`, `icon: UiIcon` + atributos nativos de `<button>` (`type`, por defecto
  `button`; `aria-disabled` → `cursor-progress` y `opacity-70` mientras se envía).
- **Tokens**: los de `LinkCtaBrand`; foco `outline-ink` (fondo claro).

```svelte
<ButtonCtaBrand type="submit" label={submit.label} icon={submit.icon} aria-disabled={sending ? 'true' : undefined} />
```

### `CtaBrandShape` (Svelte, interno)

- **Cuándo**: solo dentro de `LinkCtaBrand` y `ButtonCtaBrand`, para que los dos sean idénticos.
  El elemento interactivo que lo envuelve lleva `group/cta`.
- **Props**: `label`, `icon: UiIcon`.
- **Hover líquido**: dos capas. El fondo (píldora, círculo y un puente de 32 × 28 en el hueco)
  pasa por un filtro SVG propio de la instancia (`$props.id()`): `feGaussianBlur` σ 3 +
  `feColorMatrix` con umbral de alfa 0.45. En reposo el puente está a `scale-x-25 scale-y-0` y
  el hueco de 5px queda abierto; en hover/foco escala a 100 con `--ease-cta-liquid` (rebote) en
  `--duration-cta-liquid`, y el desenfoque lo une con curvas orgánicas. La salida usa
  `ease-standard` (sin rebote): con la misma curva, `scale-y` pasaba por debajo de 0 y dejaba un
  hilo en el hueco (LINKS-PAGE, menor V2 de UI-POLISH-01). Texto y flecha van en
  otra capa, sin filtro: siempre nítidos. Solo anima `scale`/`translate` (sin layout shift); con
  reduced-motion el cambio es instantáneo.

### `ButtonBrand` (Svelte, sin estado)

- **Cuándo**: botón píldora brand sin flecha (abrir y cerrar el menú mobile). Figma 11:31 (la
  píldora) como `<button>`.
- **Props**: `label`, `ref?` (`bind:ref`, para mover el foco) + atributos nativos de `<button>`
  (`onclick`, `aria-expanded`, `aria-controls`). `type` por defecto `button`.
- **Tokens**: `bg-brand`, `text-button-sm`, `rounded-pill`, `h-10` dentro de `h-11`.

```svelte
<ButtonBrand bind:ref={toggle} label={labels.open} aria-expanded={open} aria-controls={panelId} onclick={show} />
```

### `ButtonInk` (Svelte, sin estado)

- **Cuándo**: botón píldora ink a todo el ancho sobre la card glass (enviar el formulario).
  Figma 174:87.
- **Props**: `label` + atributos nativos de `<button>` (`type="submit"`, `disabled`, `aria-disabled`).
- **Tokens**: `bg-ink`, `text-button`, `text-paper`, `rounded-pill`, `px-6 py-3.5`, foco `outline-paper`.

```svelte
<ButtonInk type="submit" label={submitLabel} disabled={!hydrated} />
```

### `LinkButtonPaper`

- **Cuándo**: enlace con forma de botón píldora paper a todo el ancho sobre glass oscuro
  ("Ver proyecto" en `ProjectCard`, MOT-PROJECTS-V2). No está en Figma: 18px peso
  normal por la feature. Es un `<a>` (navega), no un `<button>`.
- **Props**: `href`, `label`.
- **Tokens**: `rounded-pill`, `bg-paper` → `hover:bg-brand`, `px-6`, `py-3.5`, `min-h-11`,
  `text-button-lg`, `text-ink`, `--duration-fast`, `ease-standard`; foco `outline-paper`.

```astro
<LinkButtonPaper href={project.details.link.href} label={project.details.link.label} />
```

### `ButtonPauseGlass` (Svelte, sin estado)

- **Cuándo**: pausar/reanudar algo que se mueve solo (WCAG 2.2.2) sobre fondo oscuro: la rueda
  de la galería del footer (`layout/FooterWheel.svelte`, visible solo con foco de teclado). El
  showcase ya no lo usa (UI-LIB-002: el cliente pidió quitar el botón; ver *Sliders*). Figma no
  dibuja controles (`@derived`). La visibilidad la decide el contenedor.
- **Props**: `label` (nombre accesible fijo), `pressed` (estado, va a `aria-pressed`; muestra
  el icono de reanudar), `pauseIcon`, `playIcon` + atributos nativos (`onclick`, `data-*`).
- **Excepción `pressed`**: es un booleano de **estado** (aria-pressed), no de aspecto.
- **Tokens**: `size-11`, `rounded-pill`, `border-glass-line`, `bg-glass` → `hover:bg-glass-field`,
  `size-4`, foco `outline-paper` con `outline-offset-4`.

```svelte
<span class="pointer-events-none absolute right-0 bottom-0 opacity-0 focus-within:pointer-events-auto focus-within:opacity-100">
  <ButtonPauseGlass label={pauseLabel} pressed={userPaused} {pauseIcon} {playIcon} data-wheel-pause onclick={() => toggleUser()} />
</span>
```

## Formularios (Svelte, sin estado: los usa la isla del formulario)

### `LabelHidden`

- **Cuándo**: etiqueta del campo solo para lectores de pantalla (Figma pinta el nombre como
  placeholder, 174:82; el placeholder no sustituye a la etiqueta).
- **Props**: `for` (id del campo), `text`.
- **Tokens**: `sr-only`.

```svelte
<LabelHidden for={ids.input} text={fields.email.label} />
```

### `InputGlass`

- **Cuándo**: campo de texto sobre la card glass. Figma 174:81. Error = `aria-invalid="true"`
  (borde danger, `@derived`).
- **Props**: `value?` (`bind:value`), `ref?` (`bind:ref`) + atributos nativos de `<input>`
  (`id`, `name`, `type`, `autocomplete`, `placeholder`, `required`, `aria-invalid`,
  `aria-describedby`…).
- **Tokens**: `rounded-field`, `border-glass-field` / `aria-invalid:border-danger`,
  `--field-pad-x`, `--field-pad-y`, `text-body-sm`, `placeholder:text-line`, foco `outline-paper`.

```svelte
<InputGlass bind:value={values.email} bind:ref={inputs.email} id={ids.input} name="email" type="email"
  placeholder={fields.email.label} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? ids.error : undefined} />
```

### `TextareaGlass`

- **Cuándo**: área de texto multilínea sobre la card glass (mensaje del formulario de contacto,
  SEC-CONTACT-MESSAGE). Figma no la diseña: mismo aspecto que `InputGlass` (`@derived`).
  Error = `aria-invalid="true"` (borde danger).
- **Props**: `value?` (`bind:value`), `ref?` (`bind:ref`) + atributos nativos de `<textarea>`
  (`id`, `name`, `rows`, `minlength`, `placeholder`, `required`, `aria-invalid`,
  `aria-describedby`…).
- **Tokens**: los de `InputGlass` (`rounded-field`, `border-glass-field` /
  `aria-invalid:border-danger`, `--field-pad-x`, `--field-pad-y`, `text-body-sm`,
  `placeholder:text-line`, foco `outline-paper`) + `--field-textarea-min-h` (4 líneas).
  Solo se redimensiona en vertical (`resize-y`): el ancho lo fija la card.

```svelte
<TextareaGlass bind:value={values.message} bind:ref={messageRef} id={ids.input} name="message" rows={4}
  minlength={fields.message.minLength} placeholder={fields.message.label} required={fields.message.required}
  aria-invalid={error ? 'true' : undefined} aria-describedby={error ? ids.error : undefined} />
```

### `FieldError`

- **Cuándo**: mensaje de error bajo un campo, enlazado con `aria-describedby`.
- **Props**: `id`, `message`.
- **Tokens**: `--field-error-gap`, `text-caption`, `text-danger`.

```svelte
{#if error}<FieldError id={ids.error} {message} />{/if}
```

### `FormStatus`

- **Cuándo**: estado del envío (enviando, enviado) sobre fondo oscuro, dentro de la región
  `role="status"` que pone la isla.
- **Props**: `message` + atributos nativos de `<p>` (`data-*`).
- **Tokens**: `--form-status-gap`, `text-body-sm`, `text-paper`.

```svelte
<div role="status" aria-live="polite">{#if text}<FormStatus message={text} />{/if}</div>
```

### `FormStatusError`

- **Cuándo**: error del envío (mismo sitio que `FormStatus`; se ve distinto, por eso es otro
  componente y no un `tone="error"`).
- **Props**: `message` + atributos nativos de `<p>`.
- **Tokens**: `--form-status-gap`, `text-body-sm`, `text-danger`.

```svelte
{#if result === 'error'}<FormStatusError message={status.error} />{/if}
```

## Cards y piezas de sección

### `AvatarInitials`

- **Cuándo**: avatar circular de 40 con iniciales (reseñas). Figma 174:194. Decorativo
  (`aria-hidden`): el nombre va al lado como texto.
- **Props**: `initials` (de `shared/lib/initials`), `tone: AvatarTone` (1-4).
- **`tone` no es una variante**: es un dato de posición que calcula quien reparte las cards
  (`avatarTone()` del masonry) para que dos contiguas no coincidan.
- **Tokens**: `size-10`, `rounded-avatar`, `text-initials`, `--color-avatar-{1..4}-bg/fg`.

```astro
<AvatarInitials initials={initials(review.name)} tone={2} />
```

### `ReviewCard`

- **Cuándo**: card de reseña (testimonios). Figma 174:192.
- **Props**: `name`, `role`, `quote`, `tone: AvatarTone` (calcula las iniciales con
  `shared/lib/initials`).
- **Tokens**: `rounded-card`, `bg-paper`, `shadow-card`, `p-6`, `gap-4`, `gap-3`, `gap-0.5`,
  `text-card-title`, `text-caption`, `text-ink-soft`, `text-quote`, `text-ink-muted`.

```astro
<li><ReviewCard name={r.name} role={r.role} quote={r.quote} tone={card.tone} /></li>
```

### `TrustBadge`

- **Cuándo**: prueba social de una cabecera (testimonios, Figma 38:319): pila de avatares que se
  solapan cerrada por un contador ink ("56+"); al lado, estrellas sobre un texto en dos tonos.
  En Figma el nodo es un raster (imgImage27): las medidas salen de su píxel.
- **Props**: `avatars: UiAvatar[]` (`{ photo?: UiPhoto }`, decorativos: con foto, vía `Photo` con `alt=""`; sin foto, `UserPlaceholder`), `count: UiCount` (`value` visible
  y `label` para lectores de pantalla), `rating: UiRating` (`stars` y `label`, p. ej.
  "Valoración: 5 de 5", que es el nombre del `role="img"` de las estrellas), `caption: UiCaption`
  (`ToneText` + `lang` opcional: `strong` en ink medium, `muted` en ink-muted).
- **Accesible**: los avatares y el "56+" visible van `aria-hidden`; se lee "Más de 56 clientes",
  "Valoración: 5 de 5" y el texto (con su `lang`).
- **Piezas internas** (archivo propio, solo las usa `TrustBadge`; sin entrada propia en
  `/componentes`, se ven en la de `TrustBadge`): `AvatarStack` (`avatars`, `count`: pila +
  contador) y `RatingStars` (`rating`: `role="img"` con las estrellas decorativas).
- **Colocación**: la decide el consumidor. El módulo de testimonios lo envuelve, desde lg, en
  la caja de Figma (426 × 91, contenido en x 18 / y 27).
- **Responsive**: el avatar pasa de 40 (375) a 50 (1440) con el solape proporcional
  (`--avatar-stack-size`, `--avatar-stack-overlap`); si no cabe, el texto baja de línea.
- **Tokens**: `--avatar-stack-size`, `--avatar-stack-overlap`, `rounded-avatar-stack`,
  `border-3`, `--color-avatar-ring`, `bg-ink`, `text-initials`, `text-paper`, `--trust-badge-gap`,
  `--rating-star-size` (asset `src/assets/ui/star.svg`), `--trust-badge-rating-gap`, `text-body`, `text-ink`,
  `text-ink-muted`, `font-medium`.

```astro
<TrustBadge avatars={trust.avatars} count={trust.count} rating={trust.rating} caption={trust.caption} />
```

### `ProjectCard`

- **Cuándo**: card de proyecto (MOT-PROJECTS-V2, solo CSS). Figma 29:166, 35:302 (reposo); el
  detalle no está en Figma. Reposo: imagen + pill (título + categoría, `aria-hidden`). Detalle,
  todo abajo en un bloque glass con texto blanco: título + categoría (`h3`; `headingLevel="h2"` bajo el h1 de `/proyectos/`, mismo aspecto), métricas del caso
  (`dl`, 1–4 en una fila de columnas iguales) y `LinkButtonPaper` a todo el ancho. La categoría
  puede ir en dos líneas y solo se parte entre segmentos "×" (nunca desborda la pill).
  - Con hover (`can-hover`): en hover o con foco visible dentro (`card-active`) la imagen se
    desenfoca (`--project-image-blur`, `--project-image-scale`) y se oscurece
    (`bg-project-veil`); la pill se va y entra el detalle. Las transiciones van con
    `motion-safe:`: con reduced-motion el cambio es instantáneo.
  - Sin hover (táctil, MOB-CARDS-INITIAL): solo el estado inicial, imagen + `LinkButtonPaper`
    anclado abajo. Sin velo, pill, glass ni métricas; título y categoría siguen en el DOM
    (`h3` en `sr-only`).
  - Card estrecha: la raíz es `@container`; por debajo de `@md` (448 px de card: media columna
    en tablet, mobile con puntero) el detalle se compacta (título sobre categoría, menos relleno)
    y muestra solo las dos primeras métricas, para caber en la proporción sin estirar la card.
  - La raíz lleva `data-card` (sin `tabindex`: el foco va al botón y activa la card vía
    `:has(:focus-visible)`) y `overflow-clip`. Quien la usa la coloca (p. ej. en un `<li>` de la
    rejilla).
- **Piezas internas** (archivo propio, solo las usa `ProjectCard`; sin entrada propia en
  `/componentes`, se ven en la de `ProjectCard`): `ProjectCardPill` (`title`, `category`: la pill
  de reposo; la capa que la oculta y anima sigue en `ProjectCard`), `ProjectCardMetric`
  (`metric: ProjectMetricData`, `class?`: `dt`/`dd`, dentro del `dl` de la card) y `ProjectCardCategory`
  (`category`: segmentos separados por " × ", cada uno sin cortes internos).
- **Props**: `project: ProjectCardData` (`image: UiPhoto`, vía `Photo`, `title`, `category`,
  `details: { metrics[1–4] (value, label), link: { label, href } }`), `sizes`. En la home los
  datos se derivan de cada caso (`content/pages.ts`).
- **Tokens**: `--project-aspect`, `rounded-media`, `--project-pill-inset`,
  `--project-pill-bottom`, `min-h-13`, `rounded-pill`, `text-pill`, `bg-project-veil`,
  `rounded-card`, `bg-glass`, `border-glass-line`, `backdrop-blur-glass`, `rounded-metric`,
  `text-metric`, `text-metric-label`, `--duration-image`,
  `--duration-project-fade`, `--delay-project-details-in`, `--delay-project-return`;
  variantes `can-hover`, `motion-safe` y `card-active`.

```astro
<li><ProjectCard project={project} sizes={sizes} /></li>
```

Destacada a dos columnas (la coloca el módulo): `<li class="lg:col-span-2 lg:project-card-wide">`
cambia `--project-aspect` por `--project-aspect-wide` (2:1) y pasa unos `sizes` a todo el ancho.

### `TeamCard`

- **Cuándo**: card de integrante del equipo (MOB-CARDS-INITIAL; antes inline en
  `modules/team`). Figma 41:399 (reposo); detalle MOT-TEAM (`design/references/team-hover-final.png`).
  Es una diapositiva de `TeamSlider`: raíz `role="group"` + `aria-roledescription` +
  `aria-label`, `tabindex="0"` y `data-card`. Capas en la misma celda:
  - reposo: foto (sin foto, `UserPlaceholder tone="dark" framing="portrait"`, también `data-team-photo`) + degradado `--team-card-scrim` + nombre (`h3`, `text-name`) y rol (`text-role`, puede partirse en dos líneas);
  - detalle: velo `--team-card-veil`, círculo ink de 24 con + arriba y, en un único bloque anclado
    abajo (TEAM-CARD-LOOP), nombre grande, rol · empresa, bio a 3 líneas (`line-clamp-typed-3`,
    recorta también las capas del typewriter) y perfiles, sobre la banda `--team-detail-scrim-bottom` (AA).
  - Con hover (`can-hover`): el detalle entra en hover o con foco visible (`card-active`), con
    fundido `motion-safe:`. `modules/team/hover.ts` engancha `data-team-card`, `data-team-photo` y
    `data-team-type` para el blur/escala de la foto y el typewriter (solo hover sin reduced-motion).
  - Sin hover (táctil): solo el reposo; el detalle es `hidden` (ni se ve ni se anima).
  - Perfiles profesionales (TEAM-V2): fila de `LinkIconInk` (Behance, Dribbble, LinkedIn, GitHub)
    sobre el nombre en el reposo **solo sin hover** (`can-hover:hidden`) y bajo la bio en el detalle
    con hover. Nunca hay dos copias enfocables: la otra está en `display: none`. Enfocar un icono
    activa la card (`card-active` incluye `:has(:focus-visible)`). Sin perfiles no se pinta nada.
- **Piezas internas** (archivo propio, solo las usa `TeamCard`; sin entrada propia en
  `/componentes`, se ven en la de `TeamCard`): `TeamCardRest` (`name`, `role`: capa de reposo) y
  `TeamCardDetail` (`person`: capa de detalle con los `data-team-type` del typewriter) y
  `TeamCardProfiles` (`profiles`: lista de `LinkIconInk` con los logos de `src/assets/team/`;
  redes admitidas en `team-profiles.ts`, `TEAM_PROFILE_NETWORKS`). La raíz,
  la foto (`data-team-photo`) y el orden de las capas siguen en `TeamCard`.
- **Props**: `person: TeamCardData` (`name`, `role`, `company`, `bio`, `photo?: UiPhoto`; sin foto, silueta neutra),
  `roleDescription`, `label` (lo calcula quien la coloca con `slideLabel`), `profiles?: TeamProfileLink[]`
  (`network`, `href`, `label` = aria-label completo; ya filtrados: solo los que tienen URL. En
  `modules/team` los traduce `profiles.ts`).
- **Tokens**: `--team-card-w`, `--team-card-aspect`, `--team-card-scrim`, `--team-card-veil`,
  `--team-detail-scrim-bottom`, `text-name`,
  `text-role`, `text-team-name`, `text-team-bio`, `text-paper-soft`, `rounded-pill`,
  `--duration-base`, `ease-standard`; variantes `can-hover`, `hover-motion`, `motion-safe`,
  `card-active`. Imagen: `team-card-image.ts` (`sizes`, `widths`, recorte 688 × 846).

```astro
<TeamCard person={member} roleDescription={slider.slideRoleDescription}
  label={slideLabel(slider.slidePosition, n, total)} />
```

### `UserPlaceholder`

- **Cuándo**: una persona sin foto real (HOME-NO-STOCK): avatares de la pila de `TrustBadge` e
  integrantes del equipo con nombre pero sin retrato (`TeamCard`, TEAM-REAL). Sustituye a cualquier retrato de stock.
- **Props**: `tone?: 'light' | 'dark'` (`light` por defecto; `dark` = `bg-neutral-500`, para la
  `TeamCard`, cuyo texto blanco necesita fondo oscuro para AA) y `framing?: 'avatar' | 'portrait'`
  (`avatar` por defecto: silueta a 3/4 del ancho con tope `max-w-48`; `portrait`: a todo el ancho,
  la cabeza queda hacia la mitad de una card alta, como en un retrato, y no bajo el texto del pie;
  lo usa `TeamCard`, TEAM-V2). Llena la caja de quien la coloca (`size-full`): fondo `bg-neutral-200`
  y silueta neutra (asset `src/assets/ui/user-placeholder.svg`, gris neutral-400) apoyada abajo.
- **Accesible**: decorativa (`aria-hidden`, `alt=""`): el nombre, si lo hay, va como texto al lado.
- **Tokens**: solo utilidades de Tailwind (`bg-neutral-200`, `bg-neutral-500`, `w-3/4`, `max-w-48`, `w-full`).

```astro
<span class="size-12 overflow-hidden rounded-full"><UserPlaceholder /></span>
```

### `Photo`

- **Cuándo**: cualquier slot de foto (IMG-PLACEHOLDERS, CM-CORE). Recibe un `MediaRef` (`src`
  cadena) o una imagen ya importada (`UiImage`, modelo anterior) y lo resuelve con
  `shared/lib/media.ts` (`resolvePhoto`): clave local de `src/assets` → `<Picture>` de astro:assets
  (avif, webp, jpg, recorte `fit="cover"` en el servidor con el encuadre `position` del dato, que
  también se aplica como `object-*`); otra URL → `<img>` simple. Sin fotos de stock (HOME-NO-STOCK).
- **Props**: `image: UiPhoto`, `width`/`height` (respaldo a 2×; fijan la proporción y van en el
  `<img>`, así que no hay CLS), `widths`, `sizes`, `decorative?` (fuerza `alt=""`),
  `loading?` (`lazy`), `draggable?`, `class?`.
- **Lógica**: `src/shared/lib/media.ts` (`resolveMedia`, `resolvePhoto`, `mediaIcon`, `CROP_POSITIONS`,
  `objectPositionClass`).
- **Lo usan**: `ShowcaseCarousel`, `AvatarStack`, `FooterGalleryCard`,
  `ContactBackdrop` y los `project-*`. El panel de servicios es una isla: `modules/services`
  resuelve las imágenes en el servidor con `getImage` (mismo recorte y `position`).

```astro
<Photo image={slide} width={740} height={790} widths={[168, 370, 740]} sizes="370px" class="block size-full object-cover" />
```

### `AccordionCards` (Svelte, isla)

- **Cuándo**: acordeón de cards de pregunta y respuesta (FAQ). Figma 174:157 / 174:158. La
  primera card empieza abierta. Estado, teclado APG y entrada lateral: `AccordionController`
  (`shared/lib`). El idioma (`lang`) lo pone el contenedor.
- **Props**: `baseId` (prefijo de ids, único en la página), `items: AccordionCardItem[]`
  (`title`, `body`), `icon: UiIcon` (el "+").
- **Tokens**: `rounded-card`, `bg-paper`, `shadow-card-sm`, `--accordion-card-pad-x`,
  `--accordion-card-pad-y`, `--accordion-card-icon-gap`, `--accordion-card-answer-gap`,
  `text-title-sm`, `text-answer`, `size-8`, `size-3`, `--duration-base`; utilidad `collapsible`.

```astro
<div lang={lang}><AccordionCards client:visible baseId={section.id} items={items} icon={icon(plus)} /></div>
```

## Sliders (un componente por slider)

Regla: **un componente por slider**, sin un `Slider` genérico con props de configuración
(`autoplay`, `speed`, `mode`…). Cada uno decide su ritmo con sus tokens y su script. Lo común
son primitivas sin dominio de **`src/shared/lib/slider/`** (API en `index.ts`):

| Primitiva | Qué hace |
|---|---|
| `bindSwipe(scroller, { track, onPress, onRelease })` | Swipe con el dedo y arrastre con ratón/lápiz (pointer events). Marca `data-drag` (el componente pone `touch-pan-y touch-pinch-zoom`: el scroll vertical de la página sigue siendo del navegador) y `data-dragging` mientras arrastra; al soltar encaja con `swipeTarget`. |
| `swipeTarget`, `nearestSnap`, `isDrag`, `isHorizontal`, `dragScrollLeft` | Lógica pura del gesto: umbral de arrastre (`DRAG_THRESHOLD`, 5px), umbral de swipe (`SWIPE_THRESHOLD`, 40px: con menos recorrido vuelve a la card de partida; con más, pasa a la siguiente aunque no llegue a la mitad) y card más cercana. |
| `appendLoopClones`, `cloneCount`, `wrapPosition`, `strideOf` | Bucle infinito: clones de la serie al final del carril (`aria-hidden` + `inert` + `data-slider-clone`), creados al primer play. |
| `advanceLoop`, `loopSpeed` | Bucle **continuo** (rAF sobre `scrollLeft`). |
| `nearestIndex` | Índice de la diapositiva más cercana a `scrollLeft` (paso activo del stepper). |
| `nextStep`, `tweenScroll`, `cubicBezier` | Bucle **por pasos**: de la card actual a la siguiente con duración y curva de token. |
| `createInteractionPause(controller, ms)` | Motivo de pausa `interaction` del swipe; reanuda `--delay-slider-resume` después de soltar. |
| `SLIDER_TIMING`, `readTimingMs` | Tokens de tiempo de los sliders (respaldos comprobados contra `tokens.css`). |
| `slideLabel(plantilla, n, total)` | Etiqueta "n de total" de cada diapositiva. |

La pausa se apoya en `createAutoplay()` + `bindAutoplay()` de `shared/lib/motion`: foco de
teclado dentro (`:focus-visible`; el foco por clic o arrastre no pausa), pestaña oculta, fuera de viewport, `prefers-reduced-motion` (sin
autoplay; el swipe y el scroll manual siguen) e `interaction` (swipe). El hover **no** pausa
(MOT-SLIDERS-SHOWCASE, pedido del cliente). Sin JS, el carril es un
`overflow-x` con scroll-snap nativo.

**Accesibilidad (APG carrusel)**: región `role="region"` con `aria-roledescription` y
`aria-label`, enfocable (`tabindex="0"`, flechas del teclado; el foco pausa); cada diapositiva
`role="group"` con `aria-roledescription` y "n de total"; los clones quedan fuera del árbol de
accesibilidad y del foco. Los textos llegan en `UiSliderLabels` (`label`, `roleDescription`,
`slideRoleDescription`, `slidePosition` con `{index}` y `{total}`).

**Sin botón de pausa (WCAG 2.2.2)**: el cliente pidió quitar el botón pausa/reanudar. Mitigación:
el movimiento se detiene con foco de teclado (la región y las cards son enfocables),
al tocar/deslizar, con la pestaña oculta y fuera de viewport, y no existe con
`prefers-reduced-motion`. Riesgo residual: en táctil, la pausa dura mientras se toca y 3s
después; con ratón ya no hay pausa por hover (MOT-SLIDERS-SHOWCASE), así que quien necesite
detenerlo de forma permanente debe activar "reducir movimiento".

**Por qué `.astro` + `<script>` y no isla Svelte**: las diapositivas son `<Picture>` de
`astro:assets` (recorte y formatos en el servidor), que una isla Svelte no puede renderizar; el
comportamiento es DOM puro sobre las primitivas (como `revealAll()` o el hover del equipo).

### `ShowcaseCarousel`

- **Cuándo**: carrusel de imágenes del showcase ("Creatividad, tecnología y estrategia"). Figma
  33:98. Autoplay **continuo** en bucle (una card cada `--duration-showcase-slide`, 7.35s ≈ 53px/s
  en 1440: FIX-OPEN-MINORS), swipe con
  encaje a la card al soltar.
- **Props**: `labels: UiSliderLabels`, `slides: UiPhoto[]`. Renderiza las cards con `Photo`
  (recorte con la proporción 616 × 658 en el servidor, con el encuadre `position` de cada pieza). Cards un 40% más pequeñas que en Figma
  (MOT-SLIDERS-SHOWCASE): 369.6 × 394.8 en 1440, 168 de ancho en 375.
- **Colocación**: el h2 va fuera, encima; el margen superior y el cuelgue bajo el panel los pone
  el contenedor (`mt-(--showcase-head-gap) -mb-(--showcase-overhang)`).
- **Tokens**: `--showcase-card-w`, `--showcase-card-aspect`, `rounded-media`, `gap-5`,
  `--showcase-inset`, `--gutter-*`, `--duration-showcase-slide`, `--delay-slider-resume`, foco
  `outline-paper`.

```astro
<div class="mt-(--showcase-head-gap) -mb-(--showcase-overhang)">
  <ShowcaseCarousel labels={carousel} slides={slides.map((slide) => slide.image)} />
</div>
```

### `TeamSlider`

- **Cuándo**: slider de cards del equipo ("Las personas detrás de cada proyecto"). Figma 40:388.
  Autoplay **por pasos** en bucle: espera `--duration-team-step-interval`, desplaza UNA card en
  `--duration-team-step` (`ease-standard`) y vuelve a esperar; si se detiene a mitad de paso,
  encaja en la card más cercana. El swipe encaja en el paso más cercano (snap).
  Corre en todos los breakpoints (también táctil); el hover no lo pausa (MOT-SLIDERS-SHOWCASE),
  salvo con el puntero sobre una card con enlaces de perfil (motivo `pointer`, TEAM-V2).
  Sus diapositivas son `TeamCard` (6 integrantes, TEAM-V2).
  Las copias del bucle son `aria-hidden` + `inert` (sin puntero): `bindCloneHover`
  (`@/shared/lib/slider`) marca `data-clone-hover` en la copia bajo el puntero (lo lee `card-active`),
  le envía `pointerenter`/`pointerleave` sintéticos (los oye `modules/team/hover.ts`) y reenvía el
  clic sobre un icono de perfil al enlace de la card original (TEAM-CARD-LOOP).
- **Props**: `labels: UiSliderLabels`. Slot: las cards. Cada hijo directo es una diapositiva
  (`role="group"` + `aria-roledescription` + `aria-label={slideLabel(…)}`, o `aria-hidden` si es
  decorativa); el componente les pone `shrink-0 snap-start`. Las imágenes con `draggable="false"`.
- **Ancho**: por debajo de `lg` el carril va a sangre con el gutter como padding; desde `lg`
  vive dentro de `container-page` (alineado con la cabecera) y recorta las cards en sus bordes
  (TEAM-SLIDER-CONTAINER).
- **Tokens**: `gap-5.25`, `container-page`, `--gutter-*`, `--duration-team-step-interval`,
  `--duration-team-step`, `--ease-standard`, `--delay-slider-resume`, foco `outline-ink`.

```astro
<div class="mt-(--team-head-gap)">
  <TeamSlider labels={slider}>
    {members.map((member, i) => (
      <TeamCard person={member} roleDescription={slider.slideRoleDescription}
        label={slideLabel(slider.slidePosition, i + 1, members.length)} />
    ))}
  </TeamSlider>
</div>
```

### `StepperSlider`

- **Cuándo**: secciones con PASOS numerados ("El proceso" de la home, etapas de "El proceso" de
  cada caso). PROCESS-STEPPER. **Por debajo de md** (y solo con JS, variante `scripting:`) la
  lista se ve de un paso en uno: carril con scroll-snap, swipe (`bindSwipe`) y autoplay por pasos
  (`--duration-stepper-interval` de lectura, desplazamiento en `--duration-stepper-step` con
  `ease-standard`; tras el último vuelve al primero, sin clones). Debajo, el indicador: un botón por
  paso (número + segmento); los recorridos van llenos y el activo se llena durante la espera
  (`animate-stepper-fill`, solo con autoplay y `motion-safe`). Tocar un paso salta a él.
  **Desde md** no hace nada: la rejilla del módulo se ve igual que antes y el indicador no existe.
  Sin JS, en mobile, la lista apilada de siempre.
- **Pausa**: foco de teclado (carril o indicador), tocar/deslizar o pulsar un paso (reanuda tras
  `--delay-slider-resume`), pestaña oculta, fuera de viewport, reduced motion (sin autoplay) y el
  motivo `layout` (desde md).
- **Accesibilidad**: solo mientras es slider, el carril es `role="region"` +
  `aria-roledescription` + `aria-label`, enfocable, con `aria-live` `off` al rotar y `polite`
  detenido; cada paso `role="group"` + "Paso n de N". Botones del indicador con nombre ("01 Paso 1
  de 4") y `aria-current="step"` en el activo; alto mínimo 44px.
- **Props**: `labels: UiSliderLabels`, `markers: string[]` (lo visible en cada botón, uno por
  paso). Slot: **una** lista (`<ol>`) con `grid`, cuyos hijos son los pasos; su rejilla desde md
  la pone el módulo. En mobile el componente le añade `grid-flow-col` + `auto-cols-(--stepper-slide)`
  (un paso por columna implícita; el `gap-x` del módulo separa los pasos).
- **Colores**: tonos `--tone-strong` / `--tone-muted` (el consumidor pone la superficie, p. ej.
  `tone-on-ink`), pista `bg-current/25` y relleno `bg-brand`.
- **Tokens**: `--stepper-slide`, `--duration-stepper-interval`, `--duration-stepper-step`,
  `--animate-stepper-fill`, `--ease-standard`, `--delay-slider-resume`.

```astro
<div class="mt-(--process-head-gap)">
  <StepperSlider labels={stepper} markers={steps.map((step) => step.number)}>
    <ol class="grid gap-x-7.5 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step) => <ProcessStep step={step} />)}
    </ol>
  </StepperSlider>
</div>
```

---

## Fuera de la librería (se quedan en su módulo)

Composiciones de una sola sección, con dominio propio o lógica específica. Si un segundo sitio
las necesita, se suben a la librería con su ficha aquí.

| Patrón | Dónde | Por qué no entra |
|---|---|---|
| Wordmark "Sensei Studio." (`HeroWordmark`, el h1) + video de fondo con velo (`HeroBackgroundVideo`) + lista de servicios + regla lima | `modules/hero` | Composición única del hero |
| Cifra + línea + etiqueta (`modules/stats/StatItem.astro`) | `modules/stats` | Única; tipada con el dominio (`StatItem` de `schema.ts`; `narrowLabel` es un dato de contenido). Archivo propio por la regla 5 de conventions |
| Paso con barra de progreso (`modules/process/ProcessStep.astro`) | `modules/process` | Única; pasos inferidos y tipados con el dominio (`ProcessStep` de `schema.ts`). Archivo propio por la regla 5 de conventions |
| Fila de acordeón con panel de lista e imágenes (`modules/services/ServiceRow.svelte`, con `ServiceBullets.svelte` y `ServiceImage.svelte`) | `modules/services` | Única; tipada con el dominio (`AccordionService`) y el comportamiento ya es compartido (`AccordionController`: lo crea `ServicesAccordion` y lo recibe cada fila). Archivo propio por la regla 5 de conventions |
| Panel ink con título en mayúsculas (proceso con ruido / showcase sin ruido) | `modules/process`, `modules/showcase` | Se ven distintos (ruido, radio y contenido propios); cada uno es la composición de su sección |
| Rótulo de duración del proceso (12px sin punto) | `modules/process` | No es `Eyebrow` (sin punto lima, en la fila del título) |
| Masonry de testimonios (columnas en bucle; pista de cada columna: `MasonryColumn.astro`) | `modules/testimonials` | Única; consume `ReviewCard` |
| Secciones de caso de estudio: un módulo por `sectionType` (`project-hero`, `project-results`, `project-context`, `project-solution`, `project-process`, `project-scope`, `project-conclusion`, `project-next`, `project-contact`), cada uno con sus piezas (`Hero*`, `Results*`, `Context*`, `Solution*`, `Process*`, `Scope*`, `ConclusionLesson`, `NextProjectCard`, `Contact*`) | `modules/project-*` | Genéricas: las comparten todos los proyectos (Yupa, Remittven, Las Doñas); los datos opcionales (`logo`, `media[]`, `note`, `exclusions`) se omiten sin dejar hueco. Proceso no es la sección `process` del home; el contacto no es el de la landing (dos píldoras de 48px; `ContactQuoteLink` lleva `data-quote-open`) |
| Bio de Instagram /links (Figma 230:977): `Section` (columna de 448 desde sm) + un componente por bloque: `LinksHeader` (→ `LinksWhatsAppLink`), `LinksQuote` (→ isla `LinksQuoteSelector` → `LinksServiceOption`), `LinksGuide` (→ `LinksGuideCover`), `LinksExplore` (→ `LinksProjectCard`, `LinksServicesLink`), `LinksClosing` (→ `LinksContactReminder`, `LinksFooterNav`) | `modules/links` | Única (vista fija). La tarjeta de servicio es vertical (icono y casilla arriba), no la fila del modal (`QuoteServiceOption`); WhatsApp con borde translúcido sobre ink, no el de la barra flotante. Enganche de preselección: `docs/architecture.md` › Modal de cotización |
| Card glass de contacto + rótulo 14px + texto legal con enlaces (`ContactLegal`) sobre fondo con velo (`ContactBackdrop`) | `modules/contact` | Única; consume los controles de formulario |
| Galería-rueda del footer | `layout/FooterWheel.svelte` | Única; ya consume `ButtonPauseGlass` (UI-LIB-002) |
| Modal de cotización (Figma 220:867): `QuoteDialog` (diálogo, estado y envío) + un componente por bloque: `QuoteHeader`, `QuoteServices` (→ `QuoteServiceOption`), `QuoteBudget` (→ `QuoteBudgetMode`, `QuoteCurrency`, `QuoteBudgetRange`, `QuoteBudgetMax`), `QuoteProject` (→ `QuoteIdea`, `QuoteGoals` → `QuoteGoalOption`), `QuoteAttachment`, `QuoteContact` (→ `QuoteContactField`), `QuoteFooter` (→ `QuoteWhatsAppLink`, `QuoteSubmitButton`, `DialogStatus`) | `layout/quote/` | Única (una instancia global). Superficie clara: `InputGlass`, `FieldError`, `FormStatus*` y `ButtonInk` son para fondo oscuro. Contrato de apertura: `docs/architecture.md` › Modales |
| Modal de asesoría (Figma 272:8117): `AdviceDialog` (estado y envío) + un componente por bloque: `AdviceHeader`, `AdviceStage` (→ `AdviceStageOption`, tarjeta-radio), `AdviceMessage`, `AdviceContact` (→ `AdviceContactField`), `AdviceSubmitButton`, `AdviceChannels` (→ `AdviceChannelLink`) | `layout/advice/` | Única (una instancia global, `BaseLayout`). Contrato de apertura: `docs/architecture.md` › Modales |
| Infraestructura común de los modales: `ModalDialog` (`<dialog>` nativo, disparadores delegados por atributo, foco atrapado, Esc/backdrop, vuelta del foco; contenido por snippet), `DialogSectionTitle`, `DialogInput`, `DialogFieldError`, `DialogStatus`, `DialogIcon`; `dialog-form.ts` (`submitFormData`, `simulatedResult`, `isEmail`, `describedBy`) y `dialog-data.ts` (`toSerial`) | `layout/dialog/` | La usan `QuoteDialog` y `AdviceDialog`. Superficie clara |
| Barra flotante global, fija abajo: contenedor glass + "Cotizar proyecto" (lima, `data-quote-open`) + "Solicitar asesoría" (paper, `data-advice-open`) (`FloatingActionLink`, `tone` + `shortLabel` visible bajo sm) + WhatsApp (`LinkIconInk` de la librería: círculo ink de 44 con el logo de Simple Icons como máscara, externo, `aria-label`) (`layout/FloatingBar.svelte`, `FloatingActionLink.svelte`, `FloatingWhatsAppLink.svelte`) | `layout/` | Única (Figma 218:21). No es `LinkCtaBrand` ni `ButtonBrand`/`ButtonInk`: enlaces de 44px a 15/600. Zonas protegidas y enganche de ADV-MODAL: `docs/architecture.md` › Barra flotante |
