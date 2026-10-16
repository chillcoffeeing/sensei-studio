# AGENTS.md — Mapa del arnés

> Punto de entrada para cualquier agente IA que trabaje en este repo
> (landing de ventas "Sensei Studio", Astro 7 + React + Tailwind 4).
> Divulgación progresiva: este archivo es el mapa; los detalles viven en
> los documentos referenciados.

## Regla número uno

Este repositorio funciona con un **arnés multi-agente**:

```
leader (tú, si eres sesión principal)
  ├── implementer   → implementa UNA feature a la vez
  ├── test-writer   → escribe tests de la funcionalidad crítica implementada
  └── fixer         → ejecuta pruebas, detecta y corrige errores hasta verde
```

Si eres una **sesión principal**, actúas como orquestador: no editas `src/`,
`tests/` ni `public/`; lanzas subagentes con la herramienta `task` y verificas.

Si eres un **subagente**, haz exactamente lo que dice tu definición en
`.opencode/agent/<tu-nombre>.md` y nada más.

## Dónde buscar cada cosa

| Necesito...                          | Archivo                                    |
| ------------------------------------ | ------------------------------------------ |
| Saber qué hacer ahora                | `feature_list.json` + `progress/current.md`|
| Entender la arquitectura             | `docs/architecture.md`                     |
| Estilo y convenciones de código      | `docs/conventions.md`                      |
| Cómo demostrar que algo funciona     | `docs/verification.md`                     |
| Criterios de "trabajo terminado"     | `CHECKPOINTS.md`                           |
| Verificación ejecutable              | `./init.ps1`                               |
| Informes de subagentes               | `progress/impl_\*.md`, `test_\*.md`, `fix_\*.md` |
| Historial de sesiones                | `progress/history.md`                      |

## Protocolo de arranque (cualquier agente)

1. Lee `feature_list.json` → ¿hay alguna feature `in_progress`? Debe haber
   **cero**. Si hay más de una, el estado está corrupto: repórtalo y para.
2. Lee `progress/current.md`.
3. Ejecuta `./init.ps1`. Si no está verde, arréglalo antes de añadir trabajo.

## Estado en disco, no en chat

Todo resultado relevante se escribe en `progress/`. En chat solo circulan
referencias cortas (`done -> progress/impl_F-002.md`). Esto sobrevive a
contextos reventados y deja traza auditable.

## Una feature a la vez

`init.ps1` valida que `feature_list.json` tenga como máximo una feature
`in_progress`. Nunca abras una segunda sin cerrar la primera.
