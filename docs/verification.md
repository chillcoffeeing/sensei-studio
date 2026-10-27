# Verificación

**No se confía en lo que el agente dice: se confía en lo que ejecuta.** No hay tests automatizados
(desde 2026-10-07).

## `./init.ps1` (verde = código 0)

Ejecuta, en este orden: toolchain, `pnpm install`, estado de `feature_list.json` (≤1 `in_progress`),
`check:ds` (sin valores sueltos en `src/`), `check:arch` (capas, módulos y marcado duplicado de
`shared/ui`), `astro check` y `pnpm build`.

## Checklist del verifier

| ID | Qué revisa |
|---|---|
| V1 | `init.ps1` en verde |
| V2 | Estructura respetada (orden, bloques, jerarquía) y calidad visual igual o mejor. Figma es referencia, no contrato |
| V3 | A 375 y 768px: sin scroll horizontal, nada cortado y áreas táctiles ≥ 44px |
| V4 | Assets en `src/assets/`, bien usados y con su proporción |
| V5 | Antipatrones: copy en componentes, `ds-allow` sin motivo, islas sin interacción, `client:load` innecesario, `any`, z-index mágico, imports entre módulos |
| V6 | Accesibilidad: un h1, h2 por sección, `alt`, foco visible, `aria-*` y `prefers-reduced-motion` |
| V7 | Alcance: solo lo que pide `acceptance` |

Con `pnpm dev` levantado, puede inspeccionarse en un navegador headless. Si no hay uno, la
verificación visual queda anotada como pendiente.

**Severidad** (en `progress/verify_<id>.md`):
- **bloqueante**: falla V1–V4 o V6.
- **mayor**: falla V5 o V7.

Las dos devuelven la feature al implementer. **menor**: sugerencia que no bloquea.
