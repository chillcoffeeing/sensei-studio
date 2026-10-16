# impl TEAM-SOCIAL-LINKS — Equipo: iconos de redes profesionales con URLs reales

## Lectura de Figma (flzA0qnj6JdalFCgyB2PdI)

`get_design_context` de 334:7407 y 341:7413 devuelve metadatos escasos: los cinco nodos son secciones
**solo de texto** (etiqueta de red + URL en texto plano, sin iconos; `get_screenshot` de 341:7423 lo
confirma). Se leyeron con `use_figma` en solo lectura (`characters`, `hyperlink`,
`getStyledTextSegments(['hyperlink'])`): **ningún texto tiene hiperenlace**; las URLs son el propio texto.

| Nodo | Integrante | Etiqueta → texto | Decisión |
|---|---|---|---|
| 334:7407 | Jhoarling | Behance → `behance.net/jhoarling`; linkedin → `linkedin.com/in/jhoarling-reina-067288113/` | ambas aplicadas |
| 341:7413 | Natalia | Behance → `behance.net/jhoarling`; linkedin → `behance.net/nataliareina` | Behance `nataliareina` aplicada; la de `jhoarling` es de otra persona (descartada) |
| 341:7418 | Victor | Behance → `https://github.com/`; linkedin → `linkedin.com/in/victor-miguel-veliz-castellanos-09807522a/` | LinkedIn aplicada; `github.com/` es la raíz sin usuario (descartada) |
| 341:7423 | María | Behance → `behance.net/jhoarling`; linkedin → `behance.net/nataliareina` | nada: ambas son de otras personas (plantilla copiada) |
| 341:7428 | Maicol | github → `https://github.com/`; linkedin → LinkedIn de Victor | nada: raíz y perfil de Victor (copiado) |

Criterio: la red se decide por el **dominio** de la URL, no por la etiqueta; solo se aplica una URL si
es un perfil concreto y su handle corresponde a esa persona. No se inventa ni se reasigna ninguna.
Daniel Rivera no tiene nodo. **Conviene que el estudio confirme** los perfiles de María, Maicol, Daniel,
el GitHub de Victor y el LinkedIn de Natalia (ver content-gaps).

## Archivos

- `src/content/data/pages/home.json`: 4 URLs reales en `team.content.members[].profiles` (Natalia Behance, Jhoarling Behance + LinkedIn, Victor LinkedIn); el resto sigue `""` (no se pinta).
- `design/content-gaps.md`: resumen n.º 10, fila `members[].profiles[].url` (PARCIAL) y tabla por persona con aplicadas / faltan / descartadas en Figma.
- `progress/current.md`: plan.

Sin cambios de código: la vía ya existía (TEAM-V2). `profiles.ts` filtra las vacías; `TeamCardProfiles`
pinta `LinkIconInk`: `target="_blank"`, `rel="noopener noreferrer"`, `aria-label` "Perfil de <nombre> en
<Red> (se abre en una pestaña nueva)", círculo `size-11` (44 px). Visible en el reposo sin hover (táctil,
`can-hover:hidden`) y en el detalle con hover/foco en desktop; nunca dos copias enfocables a la vez.
Comprobado en `dist/client/index.html`: cada enlace aparece 2 veces (reposo + detalle), con esos atributos.

## Iconos

Los nodos no traen iconos (solo texto): se mantienen los de `src/assets/team/` (behance, linkedin…).

## Tokens

Ninguno agregado ni quitado.

## Responsive

Sin cambios de layout. La fila de iconos es `flex flex-wrap gap-2`; el máximo real hoy son 2 iconos
(96 px), que caben en la card más estrecha (`--team-card-w` a 375). Igual a 768/1024/1440: en desktop
los iconos aparecen en el detalle con hover/foco. No se hizo captura en navegador; revisión visual a cargo del verifier.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check y astro build OK.
