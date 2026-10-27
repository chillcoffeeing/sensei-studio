# Convenciones

## General

- TypeScript estricto y sin `any`. El contenido visible y los docs van en español; los
  identificadores, en inglés.
- **Cero copy en componentes:** todo texto o imagen visible viene de `src/content/`.
- **Documentación en el código:** cada archivo lleva un comentario de cabecera breve (qué es, cuándo
  se usa, qué contrato tiene) y JSDoc en las props no obvias. En el resto, comentarios solo para un
  *por qué*. Sin medidas de Figma ni historial de features.
- Una dependencia nueva se justifica en `progress/impl_<id>.md`. No se hace commit sin que lo pida el
  usuario.

## Sistema de diseño (Tailwind por defecto + `tokens.css`)

1. **No se sobrescribe Tailwind:** nada de `--<ns>-*: initial` ni de redefinir un nombre por defecto.
   Un valor propio lleva nombre propio. Única excepción: `--breakpoint-2xl: 1440px`.
2. **`tokens.css` solo tiene lo que se usa.** Si Tailwind ya trae el valor, no se crea token. Un
   token sin uso se borra.
3. **Prohibido en `src/`, fuera de `tokens.css`:** valores arbitrarios `[...]`, hex, `rgb()`/`rgba()`
   y `px` en `style`. Lo comprueba `check:ds`. Se usa `bg-brand`, `p-10` o `w-(--token)`. Una
   excepción se marca con `/* ds-allow: motivo */`.
4. **El espaciado usa la escala nativa** (`p-5` = 20px, `p-4.25` = 17px). No hay `--spacing-N`.
5. **El texto se escribe como roles** (`text-h2`, `text-body`…), cada uno con su versión mobile.

## Responsive

- Mobile first, con 375px de referencia; se sube con `sm:` … `2xl:` (1440px).
- Entre breakpoints, tamaños fluidos con `clamp()` como tokens.
- Las posiciones absolutas de Figma se traducen a flex o grid. Solo lo decorativo va `absolute`.

## Astro y Svelte

- **Componentes:** PascalCase y props tipadas (`interface Props` / `$props()`).
- **Svelte:** runes y sin stores globales.
- **Accesibilidad:**
  - un `h1` por página y un h2 por sección (`aria-labelledby`);
  - `alt` en el contenido y `alt=""` en lo decorativo;
  - foco visible;
  - patrones APG en acordeones y carruseles.
- **Imágenes:** el dato es un `MediaRef` y lo pinta `shared/ui/Photo.astro`. En `public/` solo van
  el favicon y los archivos que no se procesan.

## Motion

Las reglas (solo `transform`/`opacity`, reduced-motion = estado final, sin JS todo visible, una sola
vez, lo que se mueve se puede pausar, tiempos desde tokens) y la API declarativa de reveal están en
**`src/shared/lib/motion/index.ts`**. `motion` solo se importa ahí.

| Caso | Herramienta |
|---|---|
| Hover, foco, color u opacidad | Utilidades de Tailwind (`transition-*`, `motion-safe:`) |
| Card con capa de detalle | `can-hover:` + `card-active:` sobre `[data-card]` |
| Entrada al viewport (escalonada) | `reveal-up` + `data-reveal` / `revealAll(section)` |
| Acordeón | `collapsible` + `data-open` (`AccordionController`) |
| Entrada lateral en un panel | `enter-from-left/right/side` |
| Texto que se escribe / cifras que cuentan | `typewriter()` / `data-count-up` + `countUpAll()` |
| Secuencias e imágenes | `animateTo()`, `sequence()` |
| Bucles y sliders | `createAutoplay()` + primitivas de `shared/lib/slider` |

## Librería de componentes

Las reglas de API y el catálogo están en `docs/components.md`.
