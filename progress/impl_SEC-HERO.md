# impl SEC-HERO — Sección hero (vuelta 1)

## Fuente de diseño

- Figma MCP **sin cuota** (`get_design_context 16:53` y `get_screenshot 11:13` → "tool call limit on the Starter plan").
- Se usó `design/figma/homepage.0.txt` (nodos `11:13`, `16:53`→`16:50`→`11:27`, `11:41`, `11:25`, `11:24`) y
  `design/figma/homepage-full.png` (570 px, recortado y escalado a 1440×851 para medir con PIL).

## Wordmark "Sensei Studio." (16:53)

- En el design context, `16:53` es un grupo (`contents`) → `16:50` → **`11:27`, un nodo de TEXTO** (DM Sans ExtraBold,
  "Sensei " 160px + "Studio." 40px, `text-right`, caja 30→576). No contiene vectores.
- Revisé todos los SVG de `design/figma/assets/` (cabeceras + render con sharp): **ninguno es el wordmark del hero**.
  `imgBrandingLogo.svg` (392×103) e `imgVector.svg` (99×26, logo del header) son el logo "Sensei®" con "i" estilizada
  y ®, distinto del hero (que tiene "i" con punto normal, sin ®, y "Studio." debajo). Usarlo habría sido sustituir.
- Por eso se renderiza como texto con los roles ya definidos en DS-001 (`text-wordmark`, `text-wordmark-sub`, `font-body`).
  Medido contra el screenshot a 1440: "Sensei" glifos x 63→568 / y 212→330 (Figma 63→568 / 212→331);
  "Studio." x 439→575 / y 352→382 (Figma 439.6→573.5 / 351→381.5). Si el orquestador consigue un SVG exportado
  de `16:53`, el cambio queda acotado a `Section.astro` + `content/pages/home.ts`.

## Archivos

- `src/modules/hero/schema.ts` — nuevo: `HeroContent` (h1, wordmark, servicesLabel, services, lead ToneText) y `HeroSection`.
- `src/modules/hero/Section.astro` — nuevo: render del hero (ink + ruido, h1 wordmark, lista, lead, regla lima).
- `src/modules/hero/index.ts` — nuevo: API pública (`Section`, tipos).
- `src/app/sections.ts` — `Section = HeroSection`.
- `src/app/registry.ts` — registra `hero: Hero`; comentario de `componentFor` actualizado.
- `src/content/pages/home.ts` — sección `hero` (id `inicio`) con el copy de Figma; el h1 se comparte con `content.h1`.
- `src/pages/[...slug].astro` — eliminado el h1 provisional (un solo h1, dentro del hero).
- `src/styles/tokens.css` — tokens nuevos (abajo) + nota de calibración del ruido.
- `src/assets/textures/noise.svg` — alfa del ruido 0.14 → 0.07 (arrastre DS-001).
- `tests/hero.test.ts` — nuevo: un hero primero, h1 del hero = h1 de la página, wordmark, 5 servicios, lead strong+muted.
- `docs/design-system.md` — regenerado (`pnpm docs:ds` vía check:ds). `docs/architecture.md` — mapa de módulos regenerado por check:arch.
- `feature_list.json` — SEC-HERO → `in_progress`. `progress/current.md` — plan.

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--spacing-93` | 93px | @figma 11:41 top 262 − 16:53 top 169 |
| `--spacing-249` | 249px | @figma 11:41 left calc(80%−21px)=1131 → 1380 − 1131 |
| `--spacing-516` | 516px | @figma 11:27 borde derecho 576 − margen 60 (alineación a la derecha del wordmark) |
| `--spacing-799` | 799px | @figma 11:13 alto 851 − header en flujo 52 |
| `--hero-pad-top` | clamp(48px, 23.704px + 6.4789vw, 117px) | @figma 169 − 52 = 117 · @derived mín. 48 |
| `--hero-stage` | clamp(320px, 256.62px + 16.9014vw, 500px) | @figma 11:25 top 669 − 169 = 500 · @derived mín. 320 (solo lg+) |
| `--hero-pad-bottom` | clamp(56px, 47.549px + 2.2535vw, 80px) | @derived (en 2xl manda min-h-799) |
| `--wordmark-overlap` | calc(0.31 × (wordmark − wordmark-sub)) | @figma 11:27 baseline de "Studio." 52px bajo "Sensei" · @derived descender DM Sans 0.31em → 37.2px a 1440 |

Ya existentes reutilizados: `text-wordmark(-sub)`, `text-hero-list`, `text-lead`, `max-w-536`, `h-9`, `bg-brand`, `gap-40`/`mt-40`.
La regla lima usa `left-3/5` (fracción nativa = left 60% de 11:24) + `right-0`: a 1440 mide 864→1440 (Figma la declara de
608 y el frame la recorta a 576).

## Ruido (arrastre DS-001)

Luminancia media del fondo del hero en el screenshot: 16.8. Con alfa 0.14 el render daba 25.9; con **0.07 → 16.9**
(std 2.13 vs 2.09). Medición sobre una zona vacía (x 303–808, y 404–556 a escala 1440).

## Responsive inferido

- Base (mobile): todo apilado — wordmark (88/24px, "Studio." alineado a la derecha bajo "Sensei"), lista, lead; `gap-40`/`mt-40` @derived.
- `lg+`: fila wordmark | lista (`justify-between`, lista `w-249`, `mt-93`), con `min-h-(--hero-stage)` para que el lead empiece 500px bajo el wordmark en 1440.
- `2xl`: h1 `w-516 justify-end` (el wordmark se alinea a x 576 como en Figma y desborda 4px a la izquierda) y `min-h-799` (hero 851 exacto con el header).
- Regla lima: decorativa, `absolute` desde el 60% al borde derecho en todos los anchos.
- h1: texto SEO en `sr-only`; el wordmark visual va `aria-hidden`. Lista con `aria-label` desde contenido. `section aria-labelledby` → h1.

## Verificación visual (Chrome headless vía CDP, build estático)

1440: section y 52→851; h1 60,169 (516×224); lista 1131,262; lead 60,669 w 536; regla 864,842 576×9 — coincide con Figma.
Sin scroll horizontal en 375/768/1024/1280/1440/1920; `h1count` = 1 en todos.

## init.ps1

```
check:ds → 262 tokens · 0 ds-allow · 0 error(es)      [OK]
check:arch → 20 archivos · 1 módulos · 0 error(es)    [OK]
astro check → 0 errors                                 [OK]
vitest → 7 files, 28 tests passed                      [OK]
astro build                                            [OK]
VERDE: todo en orden.
```
