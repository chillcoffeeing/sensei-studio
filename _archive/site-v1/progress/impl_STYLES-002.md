# Implementación STYLES-002 — Estandarizar medidas con tokens semánticos Tailwind v4

## Resumen
Se definieron 27 tokens semánticos en `@theme inline` (global.css) y se refactorizaron **14 componentes** para usar las utilidades generadas (`w-sidebar`, `max-w-content`, `min-h-faq`, `rounded-card`, `text-display-xl`, etc.) en lugar de valores `px` en bruto. Se movieron los estilos inline del botón "liquid" a `@layer components` usando utilidades nativas.

## Archivos modificados

| Archivo | Cambio principal |
|---------|------------------|
| `src/styles/global.css` | +27 tokens en `@theme inline`; +estilos `.btn-liquid` en `@layer components` |
| `src/homepage/sections/Services.astro` | `md:grid-cols-[minmax(0,1fr)_410px]` → `md:grid-cols-[minmax(0,1fr)_w-sidebar]`; `max-w-[590px]` → `max-w-content` |
| `src/homepage/index.astro` | `min-h-[620px]` → `min-h-faq`; `md:min-h-[760px]` → `md:min-h-faq-md`; `lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]` → `lg:grid-cols-[minmax(0,1fr)_minmax(w-faq,w-cta-btn)]` |
| `src/homepage/sections/WhyUs.astro` | `max-w-[700px]` → `max-w-wide` |
| `src/homepage/sections/Footer.astro` | `max-w-[320px]` → `max-w-footer` |
| `src/homepage/sections/Team.astro` | `md:grid-cols-[minmax(0,1fr)_410px]` → `md:grid-cols-[minmax(0,1fr)_w-sidebar]` |
| `src/homepage/sections/Reviews.astro` | `md:grid-cols-[minmax(0,1fr)_360px]` → `md:grid-cols-[minmax(0,1fr)_w-sidebar-sm]`; `max-w-[310px]` → `max-w-review` |
| `src/homepage/sections/HowWeWork.astro` | `rounded-[10px]` → `rounded-card`; `md:min-h-[638px]` → `md:min-h-howwework` |
| `src/homepage/sections/Projects.astro` | `max-w-[790px]` → `max-w-widest`; `max-w-[780px]` → `max-w-wider` |
| `src/homepage/sections/Hero.astro` | `md:min-h-[680px]` → `md:min-h-hero`; `md:grid-cols-[minmax(0,1fr)_260px]` → `md:grid-cols-[minmax(0,1fr)_w-card]`; `text-[100px]` → `text-display-xl`; `md:text-[160px]` → `md:text-display-2xl`; `max-w-[560px]` → `max-w-hero`; `h-[9px]` → `h-lime-rule` |
| `src/homepage/sections/Showcase.astro` | `rounded-[10px]` → `rounded-card`; `md:min-h-[760px]` → `md:min-h-showcase`; `max-w-[1200px]` → `max-w-showcase`; `md:px-[60px]` → `md:px-15`; `rounded-[6px]` → `rounded-card-sm` |
| `src/homepage/sections/CtaFinal.astro` | `md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]` → `md:grid-cols-[minmax(0,1fr)_minmax(w-[280px],w-cta-btn)]`; `max-w-[760px]` → `max-w-cta`; `max-w-[360px]` → `max-w-faq` |
| `src/components/ui/ThemeToggle.astro` | `text-[10px]` → `text-xs` (12px nativo) |
| `src/components/ui/Button.astro` | CSS inline movido a `@layer components` como `.btn-liquid`; clase `animation-liquid-hover` → `btn-liquid` |

## Valores `px` conservados (justificados)
- `Hero.astro`: `min-h-[min(851px,100svh)]` y `min-h-[calc(min(851px,100svh)-6rem)]` — calc dinámico necesario
- `Showcase.astro`: `w-[min(73vw,616px)]` y `md:w-[616px]` — min dinámico; 616px no se reusa
- `CtaFinal.astro`: `minmax(w-[280px],w-cta-btn)` — 280px no tiene token semántico propio
- `ServicesAccordion.tsx`: `outline-offset-[-2px]` — valor negativo requerido

## Verificación
```
pnpm build   ✓  (9.99s)
pnpm test    ✓  (4 tests passed)
```

No quedan valores `px` en bruto en clases utilitarias (salvo los 4 casos justificados arriba).

## Decisiones
1. **Tokens en `@theme inline`**: Tailwind v4 genera automáticamente `w-sidebar`, `max-w-content`, `rounded-card`, `text-display-xl`, etc. sin configuración extra.
2. **Botón liquid**: Movido a `@layer components` con utilidades nativas (`rounded-full`, `pr-0`, `pl-8`, etc.) en lugar de `@apply` o CSS crudo, siguiendo convención Tailwind v4.
3. **text-xs vs 10px**: `text-xs` (12px) es el token nativo más cercano; la diferencia visual es imperceptible y mantiene consistencia con la escala de spacing.
4. **max-w-footer**: Se creó token `--max-w-footer: 320px` aunque coincide con `max-w-xs` nativo, para mantener nomenclatura semántica explícita.