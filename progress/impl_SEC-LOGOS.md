# impl SEC-LOGOS — Marquee de logos de clientes (vuelta 1)

## Fuente de diseño
- `get_design_context` 17:553 → **falló por límite de llamadas del plan Starter** de Figma MCP.
- Fallback: `design/figma/homepage.0.txt` (línea 102, `data-node-id="17:553"`) + recorte de `design/figma/homepage-full.png` (y 870–970) para identificar las marcas.
- 17:553: `flex gap-50 items-center left-[-27px] top-[896px]`, 10 hijos de 48px de alto:
  17:503 Logo (133) · 17:512 Logo1 (128) · 17:1036 Logo2 (134) · 17:507 Logo3 (164) · 17:1038 Logo4 (162) · 17:1034 Logo5 (162) · 17:1040 Logo6 (156) · 17:1042 Logo7 (128) · 17:1026 Logo8 (168) · `CompanyLogo company="Amazon"` (110).
- Se usan los **9** grises (criterio de aceptación). Amazon se descarta: es el décimo hijo, empieza en x 1758 (fuera del frame 1440), es el único a color (#FF9900) y rompe el tratamiento monocromo. `imgCompanyAirwallex` (a color) no se usa: Logo8 es el mismo Airwallex ya en gris #B8B8B8.

## Archivos
- `src/modules/logo-marquee/schema.ts` — `LogoMarqueeContent { label; logos: ImageRef[] }`, `LogoMarqueeSection`.
- `src/modules/logo-marquee/Section.astro` — render; marquee solo CSS, sin isla.
- `src/modules/logo-marquee/index.ts` — API pública.
- `src/assets/logo-marquee/{adobe,airbnb,opendoor,evernote,pipedrive,fivetran,afterpay,elastic,airwallex}.svg` — copias sin modificar de `imgCompanyLogo`…`imgCompanyLogo8`.
- `src/app/sections.ts` — unión + `LogoMarqueeSection`.
- `src/app/registry.ts` — `'logo-marquee': LogoMarquee`.
- `src/content/pages/home.ts` — sección `clientes` (label + 9 logos con alt = marca) tras el hero.
- `src/styles/tokens.css` — tokens nuevos (abajo).
- `src/styles/global.css` — utilidad `play-paused` (`animation-play-state: paused`).
- `tests/logo-marquee.test.ts` — contrato de datos (9 logos, orden, SVG 48px) y del marquee (sin isla/script, motion-safe, pausa hover/foco, copia aria-hidden).
- `feature_list.json` (SEC-LOGOS → in_progress), `progress/current.md` (plan), `docs/design-system.md` (regenerado), `docs/architecture.md` (mapa regenerado por check:arch).

## Tokens agregados
- `--spacing-27: 27px` — @figma 17:553 left −27 (`-ml-27` de la pista, posición de reposo).
- `--logos-pad-top: clamp(24px, 16.606px + 1.9718vw, 45px)` — @figma 11:13 fin 851 → 17:553 top 896 = 45; @derived mín. 24 a 375.
- `--logos-gap: clamp(32px, 25.662px + 1.6901vw, 50px)` — @figma 17:553 gap 50; @derived mín. 32 a 375.
- Reutilizados: `--animate-marquee` / `--duration-marquee` (40s) / `@keyframes marquee` (ya existían), `outline-ink`.

## Implementación del marquee
- Sección a sangre (no `container-page`), `overflow-hidden`. Pista `flex w-max -ml-27` con **dos copias** idénticas de la `ul`; cada copia lleva `gap` y `pr` = `--logos-gap`, así −50% = una copia exacta y el bucle no salta.
- `motion-safe:animate-marquee`; pausa con `motion-safe:group-hover:play-paused` y `group-focus-within:play-paused`. La sección es enfocable (`tabindex="0"`, `aria-label`, anillo `outline-ink` inset) para poder pausarla con teclado (WCAG 2.2.2).
- Copia duplicada `aria-hidden="true"` con `alt=""`; con `prefers-reduced-motion` se oculta (`motion-reduce:hidden`) y la franja pasa a `overflow-x-auto` (scroll manual, estática en la posición de Figma).
- Logos como `<img>` con URL y dimensiones del import (mismo patrón que el logo del header); anchos 133/128/134/164/162/162/156/128/168 × 48 verificados en el HTML del build.

## Responsive inferido
- Alto de logo fijo 48px en todos los anchos (sin reescalar los SVG); en mobile la franja simplemente muestra menos logos.
- Gap y padding superior fluidos (`clamp`, 375 → 1440), exactos a 1440.
- El ritmo de 140px hasta la siguiente sección (17:553 fin 944 → 32:82 top 1084) **no** lo pone esta sección: queda para el padding superior de SEC-PROJECTS (cada sección posee su espacio superior).

## Riesgos / notas para el verifier
- Con reduced motion el `-ml-27` deja los primeros 27px de Adobe recortados (igual que en Figma); el `alt` sigue presente.
- Etiqueta accesible "Marcas que confían en nosotros" es copy propio (Figma no tiene texto en 17:553); vive en `content/pages/home.ts`.

## init.ps1
VERDE: toolchain OK · estado OK (1 in_progress) · check:ds 265 tokens, 0 errores · check:arch 2 módulos, 0 errores · astro check 0/0 · vitest OK · astro build OK.

## Vuelta 2

Corrige el bloqueante de `verify_SEC-LOGOS.md`: aparecía un hueco al final del loop en viewports de más de 1758 px. No había hallazgos mayores y los menores (V3 scrollbar con reduced motion, V6 `loading="lazy"`) no se tocan.

### Archivos
- `src/modules/logo-marquee/track.ts` (nuevo): `LOGO_SET_REPEATS = 3` y `buildTrack(items)`, que devuelve 2 mitades idénticas con la lista repetida 3 veces cada una y marca como `decorative` todo salvo la primera lista.
- `src/modules/logo-marquee/Section.astro`: renderiza `buildTrack(items)`. La 2.ª mitad lleva `aria-hidden` y `motion-reduce:hidden` en el `ul`. Cada `li` decorativo lleva `aria-hidden="true"`, `alt=""` y `motion-reduce:hidden`. Con reduced motion solo queda visible la primera lista (como antes).
- `src/styles/tokens.css`: `--duration-marquee` pasa de 40s a 120s. Es `@derived`: la mitad de la pista es 3× más larga y así se mantiene la misma velocidad (≈45 px/s).
- `tests/logo-marquee.test.ts`: contrato de `buildTrack` (2 mitades iguales, una sola lista legible) y borde derecho a −50 % (`mitad − 27`) ≥ viewport a 375, 1440, 1920, 2560 y 3840. También comprueba que una lista mide 1785 px a 1440.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).

### Por qué no hay hueco
A −50 % el borde derecho queda en `ancho_mitad − 27`. Con 3 listas por mitad: 3 × 1785 − 27 = 5328 px a ≥1440 (cubre 4K, 3840) y 3 × 1623 − 27 = 4842 px con gap 32 en mobile. El loop sigue sin salto porque −50 % es exactamente una mitad (cada lista lleva `pr = gap`). La solución no usa JS. Coste: 54 `<img>` (9 URLs únicas, en caché).

### init.ps1
VERDE: toolchain OK · estado OK · check:ds 265 tokens, 0 errores · check:arch OK · astro check OK · vitest OK · astro build OK. El build tiene 54 imgs de 48 px de alto, 9 con alt de marca.
