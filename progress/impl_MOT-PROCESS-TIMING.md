# impl MOT-PROCESS-TIMING — Proceso: retrasar ligeramente la entrada de los pasos

Petición del usuario: "retrasa un poco las animaciones: ahora ocurren muy pronto, casi no se nota; solo un poco".

## Qué cambia en el comportamiento

| | Antes (MOT-PROCESS) | Ahora |
|---|---|---|
| Disparo | 20% de la lista visible (`amount: 0.2`). En desktop la lista mide ≈ 300px de alto, así que ≈ 60px visibles bastaban | Cuando el borde superior de la lista cruza el 80% del alto del viewport (`rootMargin` inferior `-20%`, `amount: 0`). En 1440×900 la lista lleva ≈ 180px dentro de la pantalla |
| Retardo inicial | 0 | `--delay-reveal-process` = 250ms antes del primer paso |
| Por paso / escalonado | 1s / +200ms | igual: 1s / +200ms (pasos: 250, 450, 650, 850ms) |
| Una sola vez, sin JS visible, reduced-motion = estado final | sí | sí (no se tocaron las guardas) |

## Archivos

- `src/shared/lib/motion/reveal.ts` — `revealAll()` lee `data-reveal-amount` / `data-reveal-margin` como opciones de `reveal()` (`revealOptionsFromDataset`, `parseRevealAmount`, `DEFAULT_REVEAL_AMOUNT`); sin casos especiales.
- `src/shared/lib/motion/index.ts` — exporta los helpers nuevos.
- `src/styles/global.css` — `reveal-*` suma `var(--reveal-delay, 0s)` al escalonado; nueva utilidad `@utility reveal-delay-*` (`--reveal-delay: --value(--delay-reveal-*)`).
- `src/styles/tokens.css` — token `--delay-reveal-process: 250ms`.
- `src/modules/process/Section.astro` — `<ol>` con `data-reveal-amount="0"`, `data-reveal-margin="0px 0px -20% 0px"` y la clase `reveal-delay-process`; comentario actualizado.
- `tests/motion.test.ts` — `revealAll` pasa amount/margin a `inView` (con `inView` sustituido por un doble mediante `vi.mock('motion')`), parseo/valores por defecto, y la fórmula del retardo en `reveal-*` / `reveal-delay-*`.
- `tests/process.test.ts` — atributos del `<ol>`, la clase y que el token sea `@derived` y esté entre 150 y 300ms.
- `docs/conventions.md` — en § Motion: cuándo dispara (amount/margin) y cómo se usa el retardo inicial.
- `docs/design-system.md` — regenerado (`pnpm docs:ds`, 411 tokens).
- `feature_list.json` (status → in_progress), `progress/current.md` (plan).

## Tokens

- `--delay-reveal-process: 250ms` — `@derived`: decisión del usuario (MOT-PROCESS-TIMING), "solo un poco"; está dentro del rango de ≈150–300ms que pide la feature. Se aplica con la utilidad `reveal-delay-process`. En el build sale como `--delay-reveal-process:.25s` y `.reveal-delay-process{--reveal-delay:var(--delay-reveal-process)}`. Comprobé que el candidato `reveal-*` no genera ninguna regla suelta para `reveal-delay-process`.

## Decisiones (responsive / motion)

- **Disparar con margen, no con `amount` alto.** En mobile (1 columna) la lista mide ≈ 1400px. Con `amount: 0.4` habría que ver ≈ 560px. En un móvil apaisado (alto ≈ 375px) eso nunca ocurre y los pasos quedarían ocultos para siempre. Un `rootMargin` inferior negativo con `amount: 0` retrasa el disparo igual en todos los tamaños y siempre llega a dispararse. En mobile el primer paso empieza cuando ya se ven ≈ 130px de él, en vez de quedar en blanco mientras se hace scroll.
- **Retardo en CSS, no con `setTimeout`.** El retardo es la variable `--reveal-delay`, que se suma al `animation-delay` de `reveal-*`. JS sigue poniendo solo atributos. Con reduced-motion o sin JS, `reveal-*` no anima, así que el retardo no tiene efecto.
- **Tailwind v4 first.** No hay CSS escrito a mano: es un token en `@theme`, una `@utility` funcional (`reveal-delay-*`) y un ajuste de la `@utility reveal-*` que ya existía.
- **Figma.** Esta feature solo cambia tiempos y no toca nada visual. Además, el MCP de Figma no está autenticado en esta sesión, así que no pedí `get_design_context` del nodo 35:132. El aspecto del nodo no se modifica.

## init.ps1

VERDE. Toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check: todos OK. vitest: 24 archivos y 253 tests en verde. astro build OK.
