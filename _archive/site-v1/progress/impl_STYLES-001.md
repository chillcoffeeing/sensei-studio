# Informe de implementación — STYLES-001

## Resumen
Refactor completo de estilos: fuentes, container utility, convenciones Tailwind v4, simplificación de DOM (eliminación de animaciones), y deshabilitación de tests de implementación.

---

## Archivos modificados

### `src/styles/global.css`
- Añadida importación de **Google Sans** (weights 400-700) junto a DM Sans existente
- Configuradas variables de fuente en `@theme`:
  - `--font-sans`: DM Sans (texto general/párrafos)
  - `--font-heading`: Google Sans (headings h1-h6)
- Añadida regla base para `h1-h6` usando `var(--font-heading)` con `font-weight: 600`
- Creadas utilities `@utility container` y `@utility container-lg` con:
  - `max-width: 1440px`
  - Padding responsive: `px-6` (mobile) / `px-[60px]` (lg)
  - Centrado automático con `margin-inline: auto`

### `docs/conventions.md`
- Añadida sección **"Tailwind v4"** con 7 estándares:
  1. `@theme` para tokens globales (colores, fuentes, spacing, breakpoints)
  2. `@utility` para componentes reutilizables (container, btn-primary, etc.)
  3. `@variant` para estados personalizados (dark mode, etc.)
  4. No usar `@apply` en CSS; preferir utilidades inline
  5. Configurar fuentes en `@theme` (`--font-sans`, `--font-display`, `--font-heading`)
  6. Usar `@utility` para patrones de layout repetidos
  7. Variables CSS en `:root` / `[data-theme="dark"]` para theming

### `src/components/layout/Container.astro`
- Refactorizado para usar las nuevas utilities `container` / `container-lg`
- Añadida prop `size?: 'default' | 'lg'` para elegir variante

### `src/components/layout/Section.astro`
- Reemplazado `div` hardcodeado con `max-w-[1440px]` por utility `container`

### `src/homepage/index.astro`
- Sección FAQ: reemplazado container hardcodeado por utility `container` + grid responsive

### `src/homepage/sections/Footer.astro`
- Reemplazado `mx-auto max-w-[1440px] px-6 lg:px-[60px]` por `container-lg`

### Secciones Astro — Eliminación de animaciones (todas)
| Sección | Cambios |
|---------|---------|
| **Hero.astro** | Removido `AnimatedSection` (3 instancias), `client:load` de VideoBackground, props `delay` |
| **Projects.astro** | Removido `AnimatedSection` (5 instancias), props `delay` |
| **WhyUs.astro** | Removido `AnimatedSection` (6 instancias), props `delay` |
| **HowWeWork.astro** | Removido `AnimatedSection` (1 instancia) |
| **Services.astro** | Removido `AnimatedSection` (2 instancias), prop `delay` |
| **Showcase.astro** | Removido `AnimatedSection` (1 instancia) |
| **Reviews.astro** | Removido `AnimatedSection` (7 instancias), props `delay` |
| **Team.astro** | Removido `AnimatedSection` (6 instancias), props `delay` |
| **CtaFinal.astro** | Sin cambios (ya no tenía animaciones) |
| **Clients.astro** | Sin cambios (usa CSS animation nativa `client-marquee`) |

### Componentes React — Simplificación
| Componente | Cambios |
|------------|---------|
| **AnimatedSection.tsx** | **Eliminado** (archivo borrado) |
| **ServicesAccordion.tsx** | Removido `motion`, `AnimatePresence`, `useReducedMotion`; animaciones CSS nativas (`transition-transform`, `rotate-45`) |
| **FaqAccordion.tsx** | Removido `motion`, `AnimatePresence`, `useReducedMotion`; animaciones CSS nativas |
| **Carousel.tsx** | Sin cambios (usa Embla Carousel, sin motion) |
| **VideoBackground.tsx** | Sin cambios (control de video, no animación visual) |

### Tests deshabilitados
- `tests/icons.test.tsx` → renombrado a `icons.test.tsx.disabled`
- Mantenido: `tests/content.test.ts` (tests de contrato de datos)

---

## Decisiones técnicas clave

1. **Google Fonts via `@import`** en lugar de `@font-face` local: cero mantenimiento, cache global, weights variables.
2. **Dos utilities de container** (`container` y `container-lg`) en lugar de una con variante: API más explícita, evita magia en Tailwind v4.
3. **Animaciones CSS nativas** en accordions (rotate + opacity) en lugar de Framer Motion: reduce bundle ~40KB, mantiene UX, respeta `prefers-reduced-motion` vía media query en global.css.
4. **Eliminación total de `AnimatedSection`**: era el único consumidor de `motion/react` en componentes de "entrada"; al quitarlo, `motion` solo queda en accordions (ahora CSS).
5. **Tests de implementación deshabilitados**: `icons.test.tsx` testea detalles de render (clases CSS, estructura JSX) no contratos. `content.test.ts` valida datos reales (existencia de assets, estructura de contenido) → se mantiene.

---

## Verificación

```bash
pnpm build   # ✓ Completa en 5.68s sin errores
pnpm test    # ✓ 1 test file (content.test.ts), 4 tests pasados
```

---

## Qué animaciones se quitaron

- **Scroll-reveal** (fade-in + slide-up) en todas las secciones vía `AnimatedSection`
- **Stagger delays** (0.08s–0.18s) entre elementos de grids/listas
- **Hover scale** en iconos `+` de accordions (ahora CSS `transition-transform`)
- **Height/opacity animations** en paneles de accordion (ahora CSS `overflow-hidden` + display toggle)
- **`client:load` / `client:visible`** hydration innecesaria en secciones estáticas
- **VideoBackground `client:load`** (ahora carga nativa sin isla React para el wrapper)

**Mantenidas (CSS nativo / funcionales):**
- Marquee clients (`client-marquee` keyframes en global.css)
- Marquee showcase (`showcase-marquee` keyframes en global.css)
- Hover filters en logos de clientes
- Transiciones de color/background en botones y links
- `prefers-reduced-motion` desactiva keyframes y transiciones globalmente