# Convenciones de código

Aplican a cualquier agente que escriba líneas en este repo.

## General

- TypeScript estricto de facto: sin `any` innecesarios, exporta tipos junto a
  los datos (`export type X = ...`).
- Comentarios solo cuando explican un "por qué" no evidente. Nada de comentarios
  narrativos ("// aqui renderizamos la lista").
- Español para contenido visible y documentación; inglés para identificadores
  de código (`title`, `onClick`, no `titulo`).

## Astro

- Componentes en PascalCase (`Hero.astro`, `ServiceCard.astro`).
- Props tipadas con `interface Props` en el frontmatter.
- Accesibilidad mínima: `alt` descriptivo en imágenes, headings jerárquicos
  (un solo `h1`), landmarks (`section` con `aria-labelledby` cuando aplique).

## React

- Componentes funcionales + hooks; sin clases.
- Estado local mínimo; librerías permitidas ya instaladas: `motion`,
  `embla-carousel-react`. NO añadir dependencias nuevas sin justificación
  escrita en el informe del subagente.
- Event handlers con prefijo `handle*`; callbacks hacia arriba con `on*`.

## Tailwind

- Utilitarias inline; si un patrón se repite 3+ veces, extraer a componente,
  no a `@apply`.

## Tailwind v4

- Usar `@theme` para tokens globales (colores, fuentes, spacing, breakpoints).
- Usar `@utility` para componentes reutilizables (ej. `container`, `btn-primary`).
- Usar `@variant` para estados personalizados (ej. `@variant dark (&:where([data-theme="dark"] *))`).
- No usar `@apply` en CSS; preferir utilidades inline en componentes.
- Configurar fuentes en `@theme` (`--font-sans`, `--font-display`, `--font-heading`).
- Usar `@utility` para patrones de layout repetidos (container, grid, flex).
- Variables CSS personalizadas en `:root` / `[data-theme="dark"]` para theming.

## Tests

- Ubicación: `tests/`, nombre `<modulo>.test.ts` (o `.test.tsx`).
- Framework: vitest. Correr con `pnpm test` (modo CI) — nunca dejar watchers
  abiertos en subagentes.
- Cada test: `describe('<módulo>')` + `it('comportamiento observable')`.
- Los tests validan contratos y comportamiento, no detalles de implementación.

## Git

- No commitear sin que el usuario lo pida. Mensajes cortos en imperativo.
