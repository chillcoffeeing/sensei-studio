# Verify FND-001 — vuelta 1
Resultado: VERDE

Verifier · 2026-10-01 · informe del implementer: `progress/impl_FND-001.md`

## Bloqueantes
_(ninguno)_

## Mayores
_(ninguno)_

## Menores
- [V7/React] `pnpm-workspace.yaml:18` todavía tiene `'@astrojs/react@6.0.4'` en `minimumReleaseAgeExclude`. Es una exclusión muerta: React ya no está en `package.json`, en el lock (0 coincidencias) ni en `node_modules`. Esperado: quitar esa línea. Es el único resto de React en la configuración. Los de `README.md:24` (texto por defecto de Astro) y `.claude/agents/implementer.md:24` son documentación y no cuentan.
- [V5] `src/app/registry.ts:15`: el segundo `satisfies Record<SectionType, SectionComponent<never>>` sobra. Lo probé con tsc 6.0.3 en un scratch: ante una clave que falta, una que sobra o componentes cruzados, el primer `satisfies SectionRegistry` ya da los errores TS1360, TS2353 o TS2322. Además, mientras `Section = never`, ninguno de los dos detecta claves sobrantes (`{ hero: X } satisfies {}` compila). Esto se resuelve solo con el primer módulo. Sugerencia: dejar un único `satisfies SectionRegistry`.
- [V5] `src/app/registry.ts:29-31`: `componentFor` devuelve `SectionComponent` aunque en runtime puede devolver `undefined` si llega un `type` sin registrar. Hoy lo cubre `tests/pages.test.ts:38`, pero en build el fallo sería críptico. Sugerencia: `throw new Error(\`Sección sin registrar: ${type}\`)`.
- [Deuda SEC-HERO] `src/shared/ui/ToneText.astro:11-14`: los tonos están fijados a la superficie clara (`muted` → `text-ink-muted`, `strong` → `text-ink`). Cumple el acceptance, pero en el hero (fondo ink) la parte atenuada es `#AFAFAF` (INVENTORY §1, l.41) y `strong` tendría que ser `paper`. Con las clases fijas, `strong` sería invisible sobre negro. Hará falta un mecanismo de contexto, por ejemplo un prop `surface` o variables CSS `--tone-muted`/`--tone-strong`, en DS-001 o SEC-HERO.
- [SEO] `astro.config.mjs`: no hay `site`, así que el HTML generado sale sin `canonical` ni `og:url` (comprobado en `dist/client/index.html`). Faltan también `og:site_name`, `twitter:card` y `og:image`. Si `seo.og.image` se pasa relativo sin `site`, se emite una URL relativa, que no es válida para OG (`BaseLayout.astro:12`). Hay que completarlo cuando exista el dominio.
- [Arquitectura] `astro.config.mjs:13`: con el adaptador node standalone el build corre en `mode: "server"` y genera `dist/client` + `dist/server`, mientras que `docs/architecture.md` dice "salida estática". Si ninguna feature va a necesitar SSR (por ejemplo, el formulario de contacto), conviene quitar el adaptador. Si alguna lo necesita, hay que documentarlo.
- [Docs] `docs/architecture.md` (árbol de capas y "Modelo Page") pone `ToneText` en `core`. En realidad se define en `src/shared/lib/tone-text.ts` y `core/page.ts` lo reexporta. Hay que actualizar el doc.
- [Copy] El h1 de `src/content/pages/home.ts:6` ("Sensei Studio: diseño, desarrollo y automatización con IA") y las `keywords` los compuso el implementer: no son literales de Figma. La `description` sí sale del lead del hero (verificado en `design/figma/homepage.0.txt`). El cliente debe validarlo.
- [Fuentes] DM Sans se pide en 300..800. El 800 solo lo usa el logo (INVENTORY l.53), que es un SVG. Se podría pedir 300..700 y bajar peso. Es opcional.
- [Fuera de alcance] `_archive/` está sin trackear y fuera de `.gitignore`. `package.json:2` sigue con `"name": "boilerplate"`. Lo decide el leader.

## Evaluación de decisiones del implementer
- **TypeScript 6.0.3**: correcta. Tanto `@astrojs/check` (peer `^5 || ^6`) como `@astrojs/svelte` (peer `^5.3.3 || ^6`) excluyen TS 7, que confirmé en `node_modules`. Deuda baja: volver a evaluar cuando `@astrojs/check` admita TS 7.
- **`ImageRef = { src: ImageMetadata; alt }`**: correcta y mejor que el borrador. Las dimensiones vienen de astro:assets, encaja con la convención "imágenes desde `src/assets/`", y los SVG importados también son compatibles. Única limitación: no admite imágenes remotas. Por eso `og.image` sigue como string, lo cual está bien.
- **`ToneText` en `shared/lib`**: correcta y forzada por las capas, porque `shared` no puede importar `core` y `ToneText.astro` lo necesita. El reexport desde `core/page.ts` cumple el acceptance. Solo falta el ajuste del doc (ver Menores).
- **h1 provisional en `pages/[...slug].astro`**: aceptable para esta feature (un solo h1, `<main>`). Riesgo: si SEC-HERO no lo saca de la ruta, quedarían dos h1. El acceptance de SEC-HERO ya lo dice ("El h1 de la página vive aquí").

## Verificado sin hallazgos
- **V1**: `powershell -NoProfile -ExecutionPolicy Bypass -File ./init.ps1` → VERDE (check:ds 7 tokens / 0 errores, con aviso de que `--color-brand` y `--color-line` aún no se usan; check:arch 0 errores; astro check 21 archivos sin errores; vitest 8/8; build con `/index.html` prerenderizado).
- **V2 (tokens)**: hice `get_variable_defs` en 1:17 y en 11:12 y salen 5 colores idénticos a `tokens.css` (`principal #E4FF40`, `negro #090909`, `blanco #FFFFFF`, `gris #B8B8B8`, `textos gris #686868`), igual que en `design/figma-tokens.json`. Los namespaces `color` y `font` están cerrados con `initial` y no se declaró ningún otro namespace (correcto para FND-001).
- **V2 (fuentes)**: la URL de Google Fonts responde con `Google Sans Flex` en `font-stretch: 100%` y pesos 400–700, y con `DM Sans` en pesos 300–800, todo con `font-display: swap`. Los ejes se fijan en la URL: `GRAD 0`, `ROND 0` y `wdth 100` para Google Sans Flex, `opsz 14` para DM Sans. El orden de los ejes (minúsculas primero) es correcto. Hay preconnect a googleapis y a gstatic (con crossorigin). Pesos coherentes con INVENTORY §2.
- **V3 Responsive**: N/A, no hay UI visual.
- **V4 Assets**: `src/assets/brand/sensei-logo.svg` es idéntico a `design/figma/assets/imgBrandingLogo.svg` (mismo md5). `public/` solo tiene los favicon.
- **V5**: grep sin `any`, sin `client:*`, sin `ds-allow`, sin valores arbitrarios ni hex fuera de `tokens.css`. No hay copy en componentes: el h1 y el SEO viven en `content/`.
- **V6**: `<html lang="es">`, un solo `h1`, `<main>`.
- **Capas**: imports revisados a mano y conformes con la tabla de `docs/architecture.md`: `core → shared`, `content → app` (tipos), `pages → app/content/layout`, `layout → core`, `app → core`. check:arch también en verde.
- **Registry/satisfies**: se probó en un scratch con una unión de 2 tipos. Si falta una clave falla con TS1360, si sobra una con TS2353 y si los componentes están cruzados con TS2322. El patrón cumple su función.
- **`core/page.ts` frente a `design/page-model.draft.ts`**: `SectionBase`, `PageOf<S>`, `Seo`, `Link` y `ToneText`/`TonePart` son equivalentes al borrador o mejores (`og.image` opcional, JSDoc con los límites de SEO, `AnySection`). `SiteChrome` queda pendiente para SEC-HEADER, que es lo correcto.
- **Restos de React**: no queda nada en `package.json`, lock, `node_modules`, `tsconfig.json` (sin `jsx`/`jsxImportSource`), `astro.config.mjs` ni `src/`. La única excepción es `pnpm-workspace.yaml` (ver Menores).
- **Tests**: `tests/pages.test.ts` cubre h1, title ≤ 60, description ≤ 160, ids únicos, types registrados, slugs únicos y home en `/`. El HTML generado tiene title de 58 caracteres y description de 136.
