# Verify TEAM-SOCIAL-LINKS — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

- [V3] No se tomaron capturas en navegador; revisión responsive estática (ver abajo). Se cambiaron datos, no layout,
  así que el riesgo es bajo.
- [Contenido] Faltan perfiles de María, Maicol y Daniel, además del GitHub de Victor y el LinkedIn de Natalia. Figma no
  los trae bien (están copiados de otra persona o son la raíz `github.com/`). Quedan registrados en
  `design/content-gaps.md:31` y `:93`; los confirma el estudio. No bloquea.

## Verificado sin hallazgos

- **V1**: `./init.ps1` → "VERDE: todo en orden." (exit 0: check:ds, check:arch, astro check, astro build).
- **Figma (flzA0qnj6JdalFCgyB2PdI)**: contrasté con `get_metadata` los 5 nodos. Todos son secciones con texto
  solamente (etiqueta + URL), **sin iconos**. Lo que hay en cada uno coincide con la tabla del informe:
  - 334:7407 Jhoar: `behance.net/jhoarling` y `linkedin.com/in/jhoarling-reina-067288113/`. Aplicadas
    (`src/content/data/pages/home.json:613`, `:617`).
  - 341:7413 Nati: `behance.net/jhoarling` (de otra persona) y `behance.net/nataliareina` (bajo la etiqueta
    "linkedin", pero el dominio es Behance). Se aplicó Behance `nataliareina` (`home.json:589`); es correcto
    clasificar por dominio.
  - 341:7418 Victor: `https://github.com/` (raíz, se descartó) y LinkedIn `victor-miguel-veliz-castellanos-09807522a`.
    Aplicado (`home.json:653`).
  - 341:7423 Mari: es la misma plantilla que Nati, sin URLs propias. No se aplica nada (correcto).
  - 341:7428 Maicol: `github.com/` raíz y el LinkedIn de Victor. No se aplica nada (correcto).
  - No se inventó ninguna URL ni se asignó a quien no corresponde.
- **Iconos / V4**: como los nodos no tienen iconos, siguen los de `src/assets/team/{behance,linkedin,github,dribbble}.svg`,
  importados en `src/shared/ui/TeamCardProfiles.astro:3-6`. Existen y se pintan con máscara `size-5` dentro de un
  círculo `size-11`.
- **Build**: en `dist/client/index.html` hay 4 `href` reales, cada uno 2 veces (reposo + detalle), con
  `aria-label="Perfil de <nombre> en <Red> (se abre en una pestaña nueva)"`. `LinkIconInk.svelte:24-26`: `target="_blank"`,
  `rel="noopener noreferrer"`. Las URLs vacías se filtran (`src/modules/team/profiles.ts:7`).
- **V2**: la estructura no cambia. TeamCard y sus capas reposo/detalle quedan igual (TEAM-V2).
- **V3** (estático): área táctil de 44 px (`size-11`). Fila `flex flex-wrap gap-2`; como mucho hay 2 iconos (96 px) en una
  card de `--team-card-w` ≥ 260 px con `px-6` → cabe a 375/768/1024/1440. En táctil se ven en el reposo
  (`TeamCardRest.astro:17`, `can-hover:hidden`). Con hover, en el detalle (`TeamCardDetail.astro:15`, `hidden can-hover:flex`).
  Nunca hay dos copias enfocables a la vez.
- **V5**: sin cambios de código en `src/` salvo `home.json`. El copy de las etiquetas sale del JSON (`home.json` `profiles.label`
  / `networks`). No hay `client:load` nuevo, `any`, `ds-allow`, hex ni imports entre módulos (check:ds/check:arch en verde).
- **V6**: cada enlace tiene `aria-label` descriptivo e icono `aria-hidden`. El foco se ve (`focus-visible:outline` + `ring`).
- **V7**: se tocaron solo `home.json`, `design/content-gaps.md` y `progress/`, como pide `acceptance`. Tokens sin cambios.
