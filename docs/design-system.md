# Sistema de diseño

Tailwind v4 con su **tema por defecto intacto** (`bg-black`, `p-4`, `rounded-lg`, `shadow-md`,
`ease-in-out`, `sm`…`xl`…) más lo que agrega `src/styles/tokens.css`. Aquí solo se resume lo
propio; la fuente de verdad es el archivo. Reglas en `docs/conventions.md` › Sistema de diseño.

## Qué agrega tokens.css

| Grupo | Tokens | Uso |
|---|---|---|
| Colores de marca | `brand` (lima), `ink`, `paper` | `bg-ink`, `text-paper`, `outline-brand`… |
| Tonos de texto | `ink-muted`, `ink-soft`, `paper-muted`, `paper-ghost`, `paper-soft`, `line` | texto secundario sobre paper o ink (`ToneText` usa `--tone-*`) |
| Superficies | `glass`, `glass-line`, `glass-field`, `divider`, `scrim`, `hero-veil`, `project-veil`, `progress-track`, `danger` | card de contacto, separadores, velos sobre foto/video, errores |
| Modales (cotización y asesoría) | `brand-tint` (tarjeta elegida), `--dialog-w-lg` (cotización, hasta 1024px), `--dialog-w-md` (asesoría, hasta 640px), `--dialog-max-h` (tarjeta centrada desde sm), `--dialog-w-compact` / `--dialog-max-h-compact` (cotización en mobile: tarjeta con 16px alrededor) | `layout/dialog/ModalDialog.svelte`, `layout/quote/`, `layout/advice/`; el resto es nativo (`stone-100/300/400`, `red-700`, `rounded-xl`, `shadow-2xl`) |
| Avatares | `avatar-{1..4}-bg/-fg`, `avatar-ring` | `AvatarInitials`, `TrustBadge` |
| Fuentes | `font-heading` (Google Sans Flex), `font-body` (DM Sans) | `font-mono` es el default de Tailwind |
| Roles de texto | `text-wordmark`, `text-project-name`, `text-project-claim`, `text-project-title`, `text-project-subtitle`, `text-project-lead`, `text-project-wordmark`, `text-project-metric`, `text-project-metric-label`, `text-project-next`, `text-project-contact`, `text-guide-cover` (8px de la portada tipográfica de la guía en /links), `text-display`, `text-h2`, `text-title-*`, `text-lead`, `text-body*`, `text-eyebrow`, `text-label*`, `text-button*`, `text-meta`, `text-caption`, `text-legal`… | cada rol fija tamaño (fluido con `clamp()` donde hace falta), interlineado, peso y, si aplica, tracking |
| Interlineado | `leading-service-row`, `leading-service-open` | filas del acordeón de servicios |
| Radios | `rounded-media`, `-field`, `-panel`, `-card`, `-avatar`, `-avatar-stack`, `-glass`, `-pill`, `-metric` | por tipo de pieza |
| Sombras y blur | `shadow-card`, `shadow-card-sm`, `backdrop-blur-glass`, `backdrop-blur-masonry` | cards de review/FAQ, glass, masonry |
| Layout | `2xl` = 1440px (único cambio sobre el default), `--container-content` (1320, ancho de contenido), `max-w-page` (1440), `--gutter-*`, `z-menu`, `z-floating-bar`, `z-header` | `container-page` en `global.css` |
| Medidas de sección | `--hero-*`, `--projects-*`, `--project-aspect` / `--project-aspect-wide` (card de proyecto y su versión destacada 2:1, utilidad `project-card-wide` en `global.css`), `--stats-*`, `--process-*`, `--services-*`, `--showcase-*`, `--testimonials-*`, `--masonry-*`, `--team-*`, `--faq-*`, `--contact-*`, `--footer-*`, `--project-cover-*` (hero del detalle de proyecto, siempre en tinta: alto mínimo y separación), `--floating-bar-bottom` (barra flotante global: separación del borde inferior + `safe-area-inset-bottom`) | fluidas (`clamp()` lineal 375 → 1440); se usan como `pt-(--stats-pad-top)` |
| Componentes | `--field-*`, `--accordion-card-*`, `--avatar-stack-*`, `--trust-badge-*`, `--rating-star-size`, `--form-status-gap`, `--stepper-slide` (ancho de un paso del StepperSlider en mobile) | `shared/ui` |
| Motion | `--duration-*` (incl. `--duration-cta-liquid`), `--delay-*`, `ease-standard`, `ease-enter`, `ease-expand`, `ease-cta-liquid` (rebote del hover líquido del CTA), `--motion-distance-*`, `animate-masonry`, `animate-stepper-fill` (segmento activo del StepperSlider; tiempos `--duration-stepper-interval` / `-step`), `--animate-reveal-up`, `--animate-enter-from-*` + keyframes | utilidades `reveal-*`, `enter-from-*`, `collapsible` en `global.css`; algunos los lee JS con `getComputedStyle` |
| Textura | `--noise-texture` | utilidad `surface-noise` |

## Espaciado

Escala nativa de Tailwind (`--spacing: 0.25rem`): `p-5` = 20px, `w-90.25` = 361px. No hay
`--spacing-N`. En CSS, `calc(var(--spacing) * N)`.

## Cuándo crear un token

Solo si el valor se repite o tiene significado propio (color de marca, rol de texto, medida
fluida de sección, tiempo de motion) y Tailwind no lo trae. Un token sin uso se borra.
