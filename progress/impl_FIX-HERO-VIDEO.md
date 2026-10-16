# impl FIX-HERO-VIDEO — Hero: restaurar el video de fondo

## Archivos
- `public/videos/hero-background.mp4` — nuevo: copia de `_archive/site-v1/public/assets/videos/homepage-hero-background.mp4` (1280×720, 8 s, 357 KB).
- `src/shared/lib/background-video.ts` — nuevo: `bindBackgroundVideo()` / `bindBackgroundVideos()` (reproducción vía `createAutoplay` + `bindAutoplay`, rebobinado en reduced motion, capa oculta si falla).
- `src/modules/hero/schema.ts` — `HeroBackgroundVideo { src, type }` y `HeroContent.background?`.
- `src/modules/hero/index.ts` — exporta `HeroBackgroundVideo`.
- `src/modules/hero/Section.astro` — capa decorativa `absolute inset-0` (video + velo), contenido `relative`, `pt-(--hero-offset-top)`, `2xl:min-h-851`, `<script>` que llama a `bindBackgroundVideos()`.
- `src/content/pages/home.ts` — `hero.content.background = { src: '/videos/hero-background.mp4', type: 'video/mp4' }`.
- `src/layout/Header.astro` — prop `overlay`: `absolute inset-x-0 top-0 z-header`, sin fondo (sin overlay, igual que antes: en flujo con `bg-ink surface-noise`).
- `src/layout/BaseLayout.astro` — prop `overlayHeader` que pasa a `Header`.
- `src/pages/[...slug].astro` — `overlayHeader` = la primera sección es un hero.
- `src/styles/tokens.css` — tokens nuevos (abajo); se elimina `--spacing-799` (ya sin uso) y se actualizan dos anotaciones.
- `tests/background-video.test.ts` — nuevo: 7 tests (lógica del controlador y contrato content/markup/token).
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `feature_list.json` / `progress/current.md` — feature en `in_progress` y plan.

## Tokens
- `--color-hero-veil: rgba(9, 9, 9, 0.75)` — `@derived`: velo ink (var:negro). Alfa medido: Chrome headless, 66 frames del video compuestos con el velo; peor píxel L 0.0549 → `paper-muted` 4.56:1 (AA), `paper` 10.01:1. Con 0.74 (valor del sitio anterior) el peor píxel queda por debajo de 4.5.
- `--hero-offset-top: calc(var(--spacing-52) + var(--hero-pad-top))` — `@figma 16:53 top 169` (= header 52 + 117); mobile 100 `@derived`.
- `--z-index-header: 20` — `@derived`: el header absolute debe pintarse sobre el hero (relative, posterior en el DOM); por debajo de `z-menu` (50).
- `--spacing-851` reutilizado (antes `2xl:min-h-799`); `--spacing-799` eliminado.

## Decisiones
- **Video detrás del header**: el header se superpone (absolute, transparente) solo cuando la página empieza con un hero; el hero suma el alto del header (52, igual en todos los anchos: `pt-12` + `h-40`) a su padding. Medido: wordmark a top 169 y hero de 851 px en 1440; header 0–52 sobre el video.
- **Archivo en `public/`**: astro:assets no procesa video; la ruta vive en content (`hero.content.background`), el componente no la conoce.
- **Fallback**: la sección conserva `bg-ink surface-noise`; el `<video>` no tiene póster, así que mientras carga se ve el fondo (con el velo). Si el video o su `<source>` disparan `error`, la capa se oculta (`hidden`) y queda el fondo exacto de Figma.
- **Reproducción** (sin isla Svelte, no hay interacción): `<script>` de Astro → `createAutoplay` con motivos de pausa iniciales (`reduced-motion`, `hidden`) y `bindAutoplay` con `visibility`, `reducedMotion` y `offscreen` (sin hover/foco: es decorativo). Con reduced motion: `pause()` + `currentTime = 0` (primer frame como póster), también si la preferencia cambia en caliente. `play()` bloqueado por el navegador se ignora.
- **Atributos**: `autoplay muted loop playsinline preload="metadata" disablepictureinpicture tabindex="-1" aria-hidden="true"`, sin `controls`, `size-full object-cover`; la capa también lleva `aria-hidden` y `pointer-events-none`. `disableremoteplayback` se descartó: los tipos de Astro no lo aceptan (astro check).
- **Sin CLS**: la capa es `absolute inset-0` dentro del hero; no reserva ni cambia alto.
- **Responsive**: el video cubre todo el hero en todos los anchos (`object-cover`); nada más cambia respecto de SEC-HERO.
- **Tailwind v4 first**: todo con utilidades y tokens; sin CSS propio.
- **Figma**: el MCP de Figma no está disponible en esta sesión (requiere autenticación), no se pudo pedir `get_design_context` de 11:13. El nodo no tiene video (es ink + ruido); la geometría se conserva respecto de SEC-HERO y se comprobó en el render (top 169, alto 851).

## Comprobado en navegador (Chrome headless, build estático)
- 1440×900: video reproduciendo (`paused:false`), header absolute transparente z 20 (0–52), hero 0–851, wordmark top 169, velo `rgba(9, 9, 9, 0.75)`.
- 375×812: sin scroll horizontal, header sobre el video, wordmark top 100.
- `prefers-reduced-motion: reduce`: `paused:true`, `currentTime:0`.

## Punto a confirmar (asset)
- El video del sitio anterior tiene una **marca de agua "clideo.com"** en la esquina inferior derecha (visible con el velo, sobre la zona de la regla lima). No se edita el asset; conviene reemplazarlo por una exportación sin marca de agua (mismo nombre en `public/videos/`).

## init.ps1
VERDE: toolchain, pnpm install, estado (1 in_progress), check:ds (0 errores; aviso preexistente de tokens sin uso), check:arch (0 errores), astro check (0 errores), vitest 24 archivos / 249 tests, astro build.
