# CLAUDE.md — Sensei Studio · landing

Astro 7 + **islas Svelte** + Tailwind CSS v4. Mobile first.

## Figma es referencia, no contrato (desde 2026-10-05)

Las secciones ya están construidas. De aquí en adelante los arreglos y mejoras **no buscan
exactitud de píxel con Figma**: se hace lo que quede mejor (legibilidad, ritmo, contraste,
responsive, motion, accesibilidad). Límite: **no se cambia la estructura**: mismo orden de
secciones, mismos bloques de contenido y jerarquía, misma composición general de cada sección
y la misma arquitectura (módulos, `shared/ui`, tokens). Medidas, colores, tamaños y detalles
visuales sí pueden apartarse del diseño si mejoran el resultado; se justifican en el informe.

Este archivo es el mapa del proyecto. Los detalles viven en los documentos enlazados.

## Sin tests automatizados (desde 2026-10-07)

No hay `tests/` ni vitest. Una feature queda lista con `./init.ps1` en verde (check:ds,
check:arch, tipos, build) más la revisión del `verifier`. No se escriben tests.

## No sobrescribir librerías

Tailwind se usa con su tema por defecto (`bg-black`, `p-4`, `rounded-lg`…). `tokens.css` solo
**agrega** lo propio y usado; nunca `--<ns>-*: initial` ni redefinir nombres por defecto.
Lo mismo con cualquier librería: extender, no reemplazar su comportamiento.

## Arnés: 1 orquestador + 2 subagentes, nunca en paralelo

```
sesión principal = ORQUESTADOR
  ├── implementer  (.claude/agents/implementer.md)  implementa UNA feature
  └── verifier     (.claude/agents/verifier.md)     verifica; NO corrige
```

Ciclo por feature (el comando `/implementar` lo ejecuta):

```
implementer → verifier ──verde──→ orquestador cierra (done + history)
                 └──rojo──→ implementer con progress/verify_<id>.md  (máx. 3 vueltas, luego blocked)
```

### Reglas del orquestador (sesión principal)

- **No edita** `src/` ni `public/`. Todo cambio de producto pasa por `implementer`.
- **Sí edita**: `CLAUDE.md`, `docs/`, `design/`, `scripts/`, `.claude/`,
  `feature_list.json`, `progress/` e `init.ps1`.
- Lanza un subagente a la vez y espera su línea de respuesta
  (`done -> progress/...` / `blocked -> ...`). No acepta diffs ni informes en el chat.
- Cierra una feature solo con `./init.ps1` en verde, ejecutado por él mismo.
- Preguntas de lectura pura o conceptuales: responde directamente, sin pipeline.

## Dónde está cada cosa

| Necesito… | Archivo |
|---|---|
| Qué hacer ahora | `feature_list.json`, `progress/current.md` |
| Arquitectura (monolito modular, capas, API de módulos) | `docs/architecture.md` |
| Modelo de contenido (PageDoc, `sectionType`, contrato con CMS, plantillas) | `docs/content-model.md` |
| Datos que faltan (placeholders y huecos por sección) | `design/content-gaps.md` |
| Sistema de diseño (Tailwind por defecto + `src/styles/tokens.css`) | `docs/design-system.md` |
| Convenciones de código, Tailwind v4 y Svelte | `docs/conventions.md` |
| Librería de componentes (catálogo; la API está en cada archivo) | `docs/components.md`, `src/shared/ui/` |
| Cómo se demuestra que algo funciona | `docs/verification.md` |
| SEO, metadatos, Open Graph, JSON-LD e iconos | `docs/seo.md` |
| Despliegue estático en cPanel por SSH (manual y GitHub Actions) | `docs/deploy.md`, `docs/deploy-ci.md`, `scripts/deploy.sh`, `.github/workflows/deploy.yml` |
| Verificación ejecutable | `./init.ps1` |
| Informes por feature | `progress/impl_<id>.md`, `progress/verify_<id>.md` |
| Historial | `progress/history.md` (los informes viejos, en git) |

## Documentación: el código primero (desde 2026-10-16)

El detalle (props, contratos `data-*`, comportamiento y motivos) va en el código, como comentario de
cabecera y JSDoc. `docs/` solo recoge lo transversal: reglas, arquitectura, sistema de diseño,
modelo de contenido, SEO y despliegue. Si un doc empieza a describir un archivo, ese texto pasa al
archivo.

## Figma

Archivo `nIsbYsmg2bq9JJTCX1x530` ("Agencia"): Branding `1:17`, Homepage `11:12`.
Archivo `flzA0qnj6JdalFCgyB2PdI` ("Agencia", 2026-10-08): detalle de proyecto `216:2836`,
barra flotante `218:21`, modal de cotización `220:867`. Si una feature trae `figmaFileKey`
propio, manda sobre el global. `get_metadata` muestra algunos frames vacíos que sí tienen
diseño: confirmar con `get_screenshot`.
Cada feature de sección en `feature_list.json` lista sus `figmaNodes`. El implementer
debe pedir `get_design_context` de esos nodos antes de escribir código.

## Protocolo de arranque (cualquier agente)

1. `feature_list.json`: como máximo **una** feature `in_progress`. Si hay más, el estado está corrupto: reportar y parar.
2. Leer `progress/current.md`.
3. Ejecutar `./init.ps1`. Si está rojo, se arregla antes de empezar trabajo nuevo.

## Estado en disco, no en el chat

Todo resultado relevante se escribe en `progress/`. En el chat solo circulan
referencias cortas. Así sobrevive a contextos compactados.
