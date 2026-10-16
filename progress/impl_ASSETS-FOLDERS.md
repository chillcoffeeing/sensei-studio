# impl ASSETS-FOLDERS: imágenes por carpeta de uso y hero del caso en negro

## Estructura nueva (`src/assets/images/`)

| Carpeta | Contenido | Origen |
|---|---|---|
| `portadas-de-proyectos/` | `yupa.jpg`, `remittven.jpg`, `las-donas.jpg`, `cappi-xtremo.jpg` | `projects/<slug>/cover-laptop.jpg`. Comprobado con `get_screenshot` de 311:28: es la misma imagen que la portada de Figma (2039×1402) |
| `yupa-images/`, `remittven-images/`, `las-donas-images/`, `cappi-xtremo-images/` | logo, `solution-*`, `conclusion-*` de cada caso (mismos nombres) | `projects/<slug>/` |
| `servicios-homepage/` | 12 piezas del acordeón de servicios (`las-donas-florist.jpg`, `qfud-app-screens.jpg`, `yupa-checkout-screens.jpg`, `cappi-xtremo-laptop.jpg`…) | `projects/*` y `portfolio/*` |
| `slider-destacados-homepage/` | 7 piezas del showcase (sección `#destacados`), **las mismas de hoy** | idem |
| `slider-footer/` | 6 piezas de la rueda del footer (`gallery.cards` + `incoming`), **las mismas de hoy** | idem |
| `contacto-homepage/` | `remittven-laptop.png` | `projects/remittven/conclusion-laptop.png` |
| `equipo-homepage/` | 3 retratos | `team/*.jpg` |
| `cabecera-links/` | `header-atmosphere.png` (/links) | `links/` |

- `src/assets/projects/` y `src/assets/portfolio/` ya no existen. Los logos de herramientas
  (`projects/tools/*`) se movieron a `src/assets/case-study/tools/`: son logos de interfaz del
  módulo de caso (sección de alcance), no fotos ni capturas.
- **Una copia por uso**: si una pieza sirve a dos secciones (p. ej. la florista de Las Doñas en el
  caso, en servicios y en el showcase), cada carpeta tiene su copia. Así IMG-SLIDERS puede vaciar
  `slider-destacados-homepage/` y `slider-footer/` sin romper servicios ni los casos. Coste: unos
  pocos MB más en el repo; en `dist` solo se emiten las variantes que usa cada slot.
- Sin huérfanas: un script comprobó que cada archivo de `images/` y `case-study/tools/` tiene al
  menos una referencia en `src/content/`, y que toda clave `images/…` del contenido existe.
- SVG de interfaz sin tocar (`advice/`, `quote/`, `links/`, `team/plus.svg`, etc.).

## Archivos modificados

- `src/content/data/projects/{yupa,remittven,las-donas,cappi-xtremo}.json`: claves nuevas; `content.cover` → `content.cardImage`; `seo.ogImage` → portada.
- `src/content/data/pages/home.json`: claves de servicios, showcase, equipo y contacto.
- `src/content/site.ts`: claves de la rueda del footer (`images/slider-footer/…`).
- `src/content/links.ts`: import de `images/cabecera-links/header-atmosphere.png`.
- `src/content/projects.ts`: la tarjeta toma `hero.content.cardImage` (luego conclusión/solución, como antes).
- `src/modules/project-hero/schema.ts`: `cover` → `cardImage` (documentado: solo tarjetas y og).
- `src/modules/project-hero/Section.astro`: sin foto; `relative isolate overflow-clip` fuera (ya no hay capas absolutas).
- `src/modules/project-hero/HeroCover.astro`: **borrado**.
- `src/modules/project-hero/HeroStatus.astro`: `bg-scrim backdrop-blur-sm` → `bg-paper/10` (sobre tinta lisa el scrim negro era invisible y el blur no tenía nada que difuminar).
- `src/shared/lib/media.ts`: ejemplo del comentario.
- `src/styles/tokens.css`: tokens borrados (abajo).
- `docs/content-model.md`: regla 10 (convención de carpetas), `cardImage` en la tabla de `project-hero` y en la derivación de tarjetas.
- `docs/architecture.md`: línea de `assets/`.
- `docs/design-system.md`: `--project-cover-*` = solo alto y separación.
- `docs/components.md`: quitado `cover` de los opcionales.
- `design/placeholders.md`: rutas nuevas.
- `progress/current.md`: plan.

## Tokens

- Agregados: ninguno.
- Borrados (sin uso tras quitar la foto del hero): `--project-cover-focus`, `--project-cover-shade`, `--project-cover-shade-sm`.
- Se conservan `--project-cover-min-h` y `--project-cover-gap` (composición del hero).

## Responsive

Sin cambios de layout: el hero conserva alto mínimo fluido, apilado en mobile y ficha a la derecha
desde lg; solo cambia el fondo (tinta lisa siempre). Revisado en capturas headless del build a 1440
(hero de Yupa y `/proyectos/`: tarjetas con las portadas nuevas, rueda del footer igual) y 375. Sin
motion nuevo.

## init.ps1

```
[OK] toolchain · dependencias · estado (1 in_progress) · sistema de diseño · arquitectura
[OK] astro check · astro build
VERDE: todo en orden.
```
og:image de `/proyectos/yupa/` = `/_astro/yupa.*.jpg` (portada); el HTML del hero no tiene `<img>` antes del h1.
