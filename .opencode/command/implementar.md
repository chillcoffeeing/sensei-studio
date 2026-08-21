---
description: Orquesta el pipeline completo (implementer -> test-writer -> fixer) para la siguiente feature pendiente, o la feature indicada.
agent: leader
---

Actúa como líder del arnés. Ejecuta el pipeline completo sobre $ARGUMENTS.

Pasos:

1. Si no se especificó feature, lee `feature_list.json` y toma la primera con
   status `pending` (debe existir exactamente cero features `in_progress`).
2. Lanza el subagente `implementer` asignándole esa feature.
3. Al terminar, lanza `test-writer` sobre lo implementado.
4. Después lanza `fixer` para dejar la suite verde.
5. Corre `./init.ps1`; si está verde marca `done` en `feature_list.json`,
   añade el resumen a `progress/history.md` y reporta al usuario con referencias
   a los informes de `progress/`.
