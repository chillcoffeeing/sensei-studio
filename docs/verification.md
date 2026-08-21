# Verificación — cómo demostrar que algo funciona

La regla del arnés: **no se confía en lo que el agente dice, se confía en lo
que ejecuta**. La verificación canónica es un solo comando:

```powershell
./init.ps1
```

## Qué hace init.ps1

1. Comprueba toolchain (node >= 22, pnpm).
2. Instala dependencias si faltan (`pnpm install`).
3. Valida el estado de `feature_list.json` (máximo una `in_progress`, estados válidos).
4. Corre los tests: `pnpm test` (vitest run, modo CI).
5. Corre el build real: `pnpm build` (astro build).

Salida: resumen paso a paso con `[OK]` / `[FAIL]`. Código de salida 0 = verde.

## Verificación por tipo de cambio

| Cambio                          | Demostración mínima                        |
| ------------------------------- | ------------------------------------------ |
| Contenido (`content.ts`)        | tests de contratos + build                 |
| Componente `.astro`            | build + inspección visual manual           |
| Isla React                      | tests de comportamiento + build            |
| Infra/config                    | `./init.ps1` completo                      |

## Definición de "verde"

- Cero fallos en vitest.
- Cero errores en `astro build`.
- Estado de `feature_list.json` coherente.

Si algo está rojo, el pipeline vuelve al `fixer`. Nadie marca `done` en rojo.
