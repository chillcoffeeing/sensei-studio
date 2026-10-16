# impl FND-001 — Base: Svelte, estructura modular, modelo Page, layout y ruta genérica

Implementer · vuelta 1 · 2026-10-01 · resultado: `./init.ps1` VERDE

## Archivos

Configuración
- `package.json` / `pnpm-lock.yaml`: se quitan react, react-dom, @astrojs/react, @types/react, @types/react-dom, @phosphor-icons/react, embla-carousel-react y motion. Se agregan @astrojs/svelte 9.0.1 y svelte 5.57.1. **typescript ^7.0.2 → ^6.0.3** (ver Decisiones).
- `astro.config.mjs`: integración `svelte()` en lugar de `react()`. Se mantiene el adaptador node (las rutas son `prerender = true` y la salida es estática).
- `tsconfig.json`: sin `jsx`/`jsxImportSource` de React; alias `@/*` → `./src/*` (sin `baseUrl`); excluye `_archive`.
- `svelte.config.js` (nuevo): `vitePreprocess` para islas Svelte con TS.
- `vitest.config.ts`: usa `getViteConfig` de Astro (alias `@/*`, `import.meta.glob` y `.astro` disponibles en tests).

src/ (todo nuevo)
- `src/styles/tokens.css`: namespaces `color` (5 variables de Figma) y `font` (2 familias), ambos cerrados con `initial`.
- `src/styles/global.css`: importa tailwind + tokens; base: cuerpo en `--font-body`, títulos en `--font-heading`, color ink sobre paper.
- `src/assets/brand/sensei-logo.svg`: copia de `design/figma/assets/imgBrandingLogo.svg`.
- `src/shared/lib/tone-text.ts`: tipos `ToneText`/`TonePart` y `toneTextToString`.
- `src/shared/ui/ToneText.astro`: render de ToneText (`muted` → `text-ink-muted`, `strong` → `text-ink`, string → hereda).
- `src/core/page.ts`: `SectionBase`, `AnySection`, `PageOf<S>`, `Seo`, `ImageRef`, `Link` y reexporta `ToneText`.
- `src/app/sections.ts`: unión `Section` (hoy `never`), `SectionType`, `Page = PageOf<Section>`.
- `src/app/registry.ts`: `registry` con `satisfies SectionRegistry satisfies Record<SectionType, …>`, `registeredTypes`, `isRegisteredType`, `componentFor`.
- `src/app/SectionRenderer.astro`: recorre `sections` y renderiza el componente del registry.
- `src/layout/BaseLayout.astro`: `<html lang="es">`, head desde `Page.seo` (title, description, keywords, robots si `noindex`, canonical, og:*), favicon, preconnect + Google Fonts con `display=swap`.
- `src/content/pages/home.ts`: Page `home` (h1 + seo, `sections: []`).
- `src/content/pages.ts`: carga `content/pages/*.ts` con `import.meta.glob`, exporta `pages`, `HOME_SLUG` y `routeParam` (home → `/`).
- `src/pages/[...slug].astro`: `getStaticPaths` desde `pages`, BaseLayout + `<main>` + h1 + SectionRenderer.
- `src/modules/.gitkeep`: capa creada (sin módulos todavía).

tests/
- `tests/pages.test.ts`: cada Page tiene h1, `seo.title` ≤ 60, `seo.description` ≤ 160, ids de sección únicos y todo `type` registrado; slugs únicos; home en `/`; `isRegisteredType`.
- `tests/tone-text.test.ts`: `toneTextToString`.

Otros
- `feature_list.json`: FND-001 → `in_progress`. `progress/current.md`: plan.
- `docs/design-system.md` y el mapa de `docs/architecture.md`: regenerados por `init.ps1` (check:ds / check:arch).
- Se borraron `src/pages/index.astro` y el resto del `src/` anterior (el borrado ya venía hecho); `public/` solo tiene los favicon.

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--color-brand` | `#E4FF40` | `@figma var:principal` |
| `--color-ink` | `#090909` | `@figma var:negro` |
| `--color-paper` | `#FFFFFF` | `@figma var:blanco` |
| `--color-line` | `#B8B8B8` | `@figma var:gris` |
| `--color-ink-muted` | `#686868` | `@figma var:textos gris` |
| `--font-heading` | Google Sans Flex + fallbacks | `@figma 1:17 tipografía "titulos"` |
| `--font-body` | DM Sans + fallbacks | `@figma 1:17 tipografía "parrafos"` |

Las fuentes no se anotan como `var:` porque en `design/figma-tokens.json` están en `fonts`, no en `variables` (check:ds las rechazaría). Aviso de check:ds: `--color-brand` y `--color-line` todavía no se usan (llegan con las secciones).

## Decisiones

- **TypeScript 6 en vez de 7.** `astro check` (@astrojs/language-server) aborta con TS 7.0.2: el compilador nativo no expone la API programática. Además, @astrojs/check y @astrojs/svelte declaran peer `^5 || ^6`. Con 6.0.3, `pnpm peers check` queda limpio. `minimumReleaseAge` no rechazó ningún paquete (svelte 5.57.1, @astrojs/svelte 9.0.1 y typescript 6.0.3 se instalaron sin excepciones nuevas).
- **Fuentes con ejes fijados en la URL**: `Google+Sans+Flex:wdth,wght,GRAD,ROND@100,400..700,0,0` y `DM+Sans:opsz,wght@14,300..800`. Así se aplican exactamente los valores de Figma (GRAD 0, ROND 0, wdth 100, opsz 14) sin `font-variation-settings` y el archivo pesa menos. Las dos URLs se comprobaron con curl (HTTP 200). Pesos según INVENTORY (400–700 en títulos, 300–800 en párrafos).
- **Unión `Section` vacía = `never`.** Sobre `never` no se puede leer `.type` ni `.id`. Por eso `componentFor` y los tests leen las secciones como `AnySection`, y el registry se indexa como `Record<string, SectionComponent>` (esta aserción es necesaria aunque la unión no esté vacía, porque cada clave tipa su propia sección). Probé el patrón con un módulo temporal (`zz-probe`, ya eliminado): con la clave registrada, astro check queda en 0 errores; si falta la clave, da error TS1360 en ambos `satisfies`.
- **`ImageRef = { src: ImageMetadata; alt }`** (el borrador usaba `src: string` + width/height): las imágenes de contenido se importan desde `src/assets/` y astro:assets aporta las dimensiones.
- **`ToneText` vive en `shared/lib`** y `core/page.ts` lo reexporta: `shared/ui/ToneText.astro` lo necesita, y `shared` no puede importar `core`.
- **h1 provisional** en `pages/[...slug].astro` (sin estilos) mientras no exista el hero. En SEC-HERO pasa al módulo hero. Para el copy del h1 y la description se usó el lead del hero de Figma. Las keywords son propuesta mía y conviene revisarlas.
- **canonical / og:url** solo se emiten si `seo.canonical` existe o si `site` está configurado en Astro (todavía no hay dominio). `og:image` es opcional.
- Responsive: no aplica en esta feature, porque todavía no hay UI visual.
- **Figma 1:17**: no se consultó. Los colores y las fuentes salen de `design/figma-tokens.json` (instantánea de `get_variable_defs(11:12, 1:17)`) y el logo, de `design/figma/assets/`.

## Notas sobre scripts (no modificados)

- `check-design-system.mjs`: solo admite `var:` para claves de `variables`. Si en el futuro se quiere validar fuentes contra `fonts`, hará falta una forma de anotación. No es un bug.
- No encontré bugs en `check-architecture.mjs`.

## Salida de `./init.ps1` (resumida)

```
[OK] node v22.20.0 · pnpm v11.1.3 · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[warn] 2 token(s) sin uso aparente: --color-brand, --color-line
check:ds → 7 tokens · 0 ds-allow · 0 error(es)            [OK]
check:arch → 12 archivos · 0 módulos · 0 error(es)         [OK]
astro check → 21 files · 0 errors · 0 warnings            [OK]
vitest → 2 files · 8 tests passed                          [OK]
astro build → prerender /index.html                        [OK]
VERDE: todo en orden.
```
