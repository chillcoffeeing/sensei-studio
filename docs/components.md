# Librería de componentes (`src/shared/ui/`)

Catálogo de una línea por componente. **Las props, los contratos (`data-*`, `aria-*`) y el
comportamiento están en la cabecera y el JSDoc de cada archivo.** La revisión visual se hace en
`/componentes` (noindex), con datos reales (`src/content/ui-catalog.ts`). Todo componente nuevo
entra en esta tabla y en el catálogo.

## Reglas de API

- **Sin variantes:** ni `variant` ni booleanos de aspecto. Si dos usos se ven distintos, son dos
  componentes (`ButtonBrand` / `ButtonInk`).
- **Props:** como máximo 4 de datos; el resto va por slots o children.
- **Sin `class` desde fuera:** la colocación la decide el contenedor del consumidor. La única
  excepción es `SectionHeader.titleClass`, solo para el ancho del h2.
- **Atributos nativos sí** (`aria-*`, `data-*`, `on*`) en los Svelte que envuelven un elemento
  interactivo. Pasan con `...rest`, y el tipo omite `class`.
- **Estado = atributo:** `aria-invalid`, `aria-pressed`. Nunca una prop de aspecto.
- **Sin copy ni dominio:** los textos llegan por props. Los iconos que viajan a una isla son `UiIcon`.
  Los tipos compartidos están en `types.ts`.
- **Astro si es estático; Svelte si tiene estado o lo usa una isla.** Un `.svelte` sin estado se
  renderiza estático desde Astro. Los sliders son `.astro` + `<script>`, porque pintan `<Picture>`.
- **Solo tokens:** las medidas propias van en `tokens.css`.
- **Un archivo por pieza con contexto propio:** nunca se escribe inline en un `.map()`.
- **Qué entra:** lo que se repite o forma parte del lenguaje visual. Lo que es de una sola sección se
  queda en su módulo, y sube a la librería cuando lo necesita un segundo sitio.
- **Los módulos consumen la librería:** si un módulo necesita un patrón que no existe, se agrega
  primero aquí. `check:arch` detecta el marcado duplicado.

## Catálogo

| Grupo | Componente | Para qué |
|---|---|---|
| Texto | `ToneText` | Texto en dos tonos (`--tone-strong` / `--tone-muted`) |
| | `TextLines` | `string[]` con una línea por entrada |
| | `Eyebrow` | Rótulo sobre un h2 (punto lima y mayúsculas) |
| | `SectionHeader` | Eyebrow + h2 (o h1) + slot `aside` |
| | `SectionDescription` | Descripción de cabecera, con la primera frase destacada |
| | `HeadingOverline` | Título de columna del footer |
| | `LabelMarker` | Rótulo con marcador lima (casos, modales, `/links`) |
| Enlaces | `LinkMore` | Enlace en mayúsculas con "+" en las cabeceras claras |
| | `LinkLogo` | Logo enlazado a la home (header y menú mobile) |
| | `LinkNav` / `LinkMenu` | Nav del header en desktop y en el menú mobile |
| | `LinkFooter` / `LegalLinks` | Enlaces del footer y enlaces legales |
| | `LinkIconInk` | Enlace externo con solo un logo (WhatsApp, perfiles) |
| | `LinkCtaBrand` / `ButtonCtaBrand` | CTA principal como enlace o como botón, con dibujo común `CtaBrandShape` |
| | `LinkButtonPaper` | Enlace-píldora paper sobre glass ("Ver proyecto") |
| Botones | `ButtonBrand` / `ButtonInk` | Píldora brand (menú) y píldora ink (envío) |
| | `ButtonPauseGlass` | Pausar o reanudar algo que se mueve solo |
| Formularios | `LabelHidden`, `InputGlass`, `TextareaGlass`, `FieldError` | Campos sobre glass oscuro (error = `aria-invalid`) |
| | `FormStatus` / `FormStatusError` | Estado o error del envío |
| Cards | `ProjectCard` (+ `ProjectCardPill`, `-Category`, `-Metric`) | Card de proyecto con capa de detalle (solo CSS) |
| | `TeamCard` (+ `TeamCardDetail`, `-Rest`, `-Profiles`) | Card de integrante |
| | `ReviewCard`, `AvatarInitials` | Reseña con avatar de iniciales |
| | `TrustBadge` (+ `AvatarStack`, `RatingStars`) | Prueba social de cabecera |
| | `UserPlaceholder` | Persona sin foto real |
| Medios | `Photo` | Cualquier foto: resuelve el `MediaRef` (`shared/lib/media.ts`) |
| Interacción | `AccordionCards` | Acordeón del FAQ (isla, `AccordionController`) |
| Sliders | `ShowcaseCarousel` | Bucle continuo |
| | `TeamSlider` | Bucle por pasos |
| | `StepperSlider` | Pasos numerados en mobile (proceso) |

## Sliders

**Un componente por slider**, sin un `Slider` genérico con props de configuración. Lo que comparten
son primitivas de `shared/lib/slider/` (swipe, bucle, pasos y pausa por interacción) y de
`createAutoplay()` de `shared/lib/motion`. Siguen el patrón APG de carrusel. Sin JS, el carril es
`overflow-x` con scroll-snap.

**Decisión del cliente: sin botón de pausa y sin pausa por hover.** Mitigación (WCAG 2.2.2): se paran
con foco de teclado, al tocar, con la pestaña oculta, fuera del viewport y con
`prefers-reduced-motion`.

## Fuera de la librería (en su módulo o en `layout/`)

Son composiciones de una sola sección: el hero, `StatItem`, `ProcessStep`, `ServiceRow`, el masonry
de testimonios, la card de contacto, los `modules/project-*` y los bloques de `/links`. En `layout/`
están la rueda del footer, la barra flotante y los modales (`quote/`, `advice/`, con su
infraestructura común en `dialog/`). Los modales tienen superficie clara, por eso no usan los
controles glass.
