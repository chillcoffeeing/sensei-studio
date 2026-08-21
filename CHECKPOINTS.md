# CHECKPOINTS.md — Criterios de "trabajo terminado"

Un trabajo se considera terminado SOLO cuando todos los checkpoints aplicables
están en verde. El `leader` los recorre antes de marcar una feature `done`.

## Checkpoints globales (siempre)

- [ ] **C1 — Suite verde**: `./init.ps1` termina sin errores (install + test + build).
- [ ] **C2 — Estado coherente**: `feature_list.json` tiene como máximo UNA
      feature `in_progress`; ninguna feature `done` tiene informes faltantes.
- [ ] **C3 — Tests de funcionalidad crítica**: toda función/componente principal
      nuevo o modificado tiene al menos 1 test de camino feliz y 1 caso borde,
      escritos por `test-writer`.
- [ ] **C4 — Convenciones**: el código respeta `docs/conventions.md`.
- [ ] **C5 — Arquitectura**: el código respeta `docs/architecture.md`
      (contenido en `src/data/content.ts`, secciones Astro, islas React solo
      donde hay interactividad).
- [ ] **C6 — Traza en disco**: existen `progress/impl_<id>.md`,
      `progress/test_<id>.md` y `progress/fix_<id>.md` para la feature cerrada.
- [ ] **C7 — Sin sorpresas**: no hay dependencias nuevas, archivos generados
      commiteados ni secretos expuestos.

## Checklist de cierre del líder

```text
1. ¿init.ps1 verde?                          → si no, volver a fixer
2. ¿informes impl/test/fix presentes?        → si no, pedirlos
3. ¿CHECKPOINTS C1..C7 en verde?             → si no, anotar por qué falla
4. Marcar done en feature_list.json          → solo si todo lo anterior pasa
5. Append resumen en progress/history.md     → siempre
```

## Anti-regresión

Si un checkpoint que ya estaba verde vuelve a romperse en una feature posterior,
es un bug de regresión: prioridad alta, se arregla antes de continuar con
features nuevas.
