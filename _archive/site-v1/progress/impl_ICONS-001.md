# Implementación ICONS-001 — Añadir phosphoricons (versión light) e integrar en componentes

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `package.json` | Añadida dependencia `@phosphor-icons/react@^2.1.10` |
| `src/components/cards/ToolCard.tsx` | **Nuevo** — Componente React que recibe icono phosphoricons directamente como componente (no string) y prop `weight` para versión light |
| `src/components/cards/ProfessionalCard.astro` | Actualizado para importar iconos phosphoricons, mapear nombres a componentes y pasar a `ToolCard` con `client:load` |
| `src/data/content.ts` | Añadido array `TEAM` con datos completos (bio, image, tools) usando nombres de iconos phosphoricons; `TEAM_TILES` derivado de `TEAM` |
| `src/homepage/sections/Team.astro` | Actualizado para usar `ProfessionalCard` con datos de `TEAM` en lugar de `TeamTile` |

## Iconos phosphoricons utilizados (versión Light via prop `weight="light"`)

| Miembro | Tool | Icono phosphoricons | Razón |
|---------|------|---------------------|-------|
| Natalia | React | `Code` | Desarrollo web / código |
| Natalia | TypeScript | `Monitor` | Tipado / desarrollo frontend |
| Natalia | Astro | `Cube` | Framework / arquitectura |
| Víctor | Node.js | `Code` | Backend / runtime |
| Víctor | Python | `Cube` | Scripting / IA |
| Víctor | IA/Automation | `DeviceMobile` | Automatización / dispositivos |
| Jhoarling | Figma | `FigmaLogo` | Herramienta de diseño principal |
| Jhoarling | Design Systems | `Palette` | Sistemas de color/diseño |
| Jhoarling | Prototyping | `PenNib` | Prototipado / dibujo |
| Maicol | Branding | `PaintBrush` | Identidad visual / pintura |
| Maicol | Ilustración | `PenNib` | Ilustración / dibujo a mano |
| Maicol | Layout | `Layout` | Composición / maquetación |

## Decisiones técnicas

1. **ToolCard como componente React (.tsx)**: Astro no puede serializar componentes React pasados como props entre componentes `.astro` para hidratación client-side. Al hacer `ToolCard` un componente React, recibe el componente phosphoricons directamente como prop y funciona con `client:load` en `ProfessionalCard`.

2. **Peso de icono via prop `weight`**: phosphor-icons/react expone un solo componente por icono (ej. `Code`) y controla el estilo (thin, light, regular, bold, fill, duotone) mediante la prop `weight`. Se usa `weight="light"` consistentemente.

3. **Mapeo en ProfessionalCard**: Se importa cada icono necesario y se crea un `iconMap` para convertir el string del dato (`"Code"`) al componente React real. Esto mantiene `content.ts` como archivo de datos puros (solo strings).

4. **TEAM como fuente única de verdad**: Se creó `export const TEAM` con datos completos (bio, tools, image) y `TEAM_TILES` se deriva de él (`TEAM.map(...)`). Así `Team.astro` usa `ProfessionalCard` con datos ricos y `TeamTile` (si se usa en otro lado) sigue funcionando.

5. **No componente centralizado de iconos**: Cumple la regla estricta — los iconos se importan directamente de `@phosphor-icons/react` en `ProfessionalCard.astro` donde se usan.

## Verificación

- `pnpm install` — ✅ Dependencia instalada sin errores
- `pnpm build` — ✅ Build completa (prerendering estático OK)
- `pnpm test` — ✅ 4 tests pasan