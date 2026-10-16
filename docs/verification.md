# Verificación

Regla: **no se confía en lo que el agente dice, se confía en lo que ejecuta.**

## `./init.ps1` (verde = código 0)

| # | Paso | Comando | Qué garantiza |
|---|---|---|---|
| 1 | Toolchain | `node`, `pnpm` | entorno |
| 2 | Dependencias | `pnpm install` | lockfile coherente |
| 3 | Estado | `feature_list.json` | ≤1 `in_progress`, estados válidos |
| 4 | Sistema de diseño | `pnpm check:ds` | sin valores sueltos en `src/` (arbitrarios `[..]`, hex, `rgb()`, px en `style`) |
| 5 | Arquitectura | `pnpm check:arch` | fronteras de capas y módulos; sin marcado duplicado de `shared/ui` en modules/ y layout/ |
| 6 | Tipos | `pnpm check:types` | `astro check` sin errores |
| 7 | Build | `pnpm build` | salida estática |

No hay tests automatizados (decisión del 2026-10-07): la revisión del verifier es la
prueba de comportamiento. No se crean ni mantienen tests.

## Checklist del verifier (además de `init.ps1`)

| ID | Qué revisa |
|---|---|
| V1 | `init.ps1` en verde |
| V2 | Estructura respetada (orden de secciones, bloques, jerarquía, composición) y calidad visual igual o mejor. Figma es referencia, no contrato: desviaciones de medidas/colores justificadas no son hallazgo |
| V3 | Mobile (375px) y tablet (768px): sin scroll horizontal, jerarquía legible, áreas táctiles ≥44px, nada se corta |
| V4 | Assets: cada asset visible existe en `src/assets/`, se usa en su lugar y conserva la proporción. Sustitutos solo si mejoran y están justificados |
| V5 | Antipatrones: copy en componentes, `ds-allow` sin justificar, islas sin interacción, `client:load` innecesario, `any`, z-index mágico, importar entre módulos |
| V6 | Accesibilidad: un h1, h2 por sección, `alt`, foco visible, `aria-*` en patrones interactivos, `prefers-reduced-motion` |
| V7 | Alcance: solo se tocó lo que pide `acceptance` |

Para V2 y V3, si el sitio está levantado (`pnpm dev`), el verifier puede inspeccionarlo
con un navegador headless si hay uno disponible. Si no, revisa el CSS calculado
contra los tokens y deja anotado que la verificación visual queda pendiente.

## Severidad en `progress/verify_<id>.md`

- **bloqueante**: rompe V1–V4 o V6 → la feature vuelve al implementer.
- **mayor**: antipatrón (V5) o alcance (V7) → vuelve al implementer.
- **menor**: sugerencia → se anota y no bloquea.
