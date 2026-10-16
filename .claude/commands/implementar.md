---
description: Ejecuta el ciclo implementer → verifier sobre la siguiente feature pendiente (o la indicada) y la cierra si queda verde.
argument-hint: "[feature-id]"
---

Actúa como orquestador del arnés (ver `CLAUDE.md`). Feature objetivo: $ARGUMENTS

1. Protocolo de arranque: debe haber ≤1 feature `in_progress`. Lee `progress/current.md`.
2. Si no se indicó feature, toma la primera `pending` cuyas `dependsOn` estén todas en `done`.
3. Lanza el subagente `implementer` con: id, nombre y la instrucción de escribir
   `progress/impl_<id>.md` y responder con una sola línea. Espera la respuesta.
4. Lanza el subagente `verifier` con el id. Espera la respuesta.
5. Si el resultado es ROJO: relanza `implementer` indicándole `progress/verify_<id>.md`.
   Después vuelve al paso 4. Como máximo 3 vueltas; luego marca `blocked` y explica el motivo.
6. Si es VERDE: ejecuta `./init.ps1` tú mismo. Si está verde, marca `done` en
   `feature_list.json`, agrega el resumen a `progress/history.md`, limpia
   `progress/current.md` y reporta al usuario con referencias a los informes.

Nunca lances los dos subagentes a la vez y nunca edites `src/` tú mismo.
