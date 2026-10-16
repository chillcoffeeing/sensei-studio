# Verify ASSETS-FOLDERS — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V4] Copias idénticas por uso (p. ej. `portadas-de-proyectos/las-donas.jpg` = `servicios-homepage/las-donas-laptop.jpg` = `slider-footer/las-donas-laptop.jpg`, mismo md5; 13 grupos en total). Es la decisión documentada ("una copia por uso") y Vite deduplica por contenido, así que en `dist` se emite una sola. Por eso la rueda del footer sirve archivos llamados `las-donas.*` y `remittven.*`: es el mismo binario de antes con otro nombre. Solo se anota.
- [V3] A 375 y 768 la barra flotante tapa parte de la ficha del hero durante el scroll. Ya pasaba antes y esta feature no lo toca.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (toolchain, dependencias, estado con 1 in_progress, check:ds, check:arch, astro check, astro build).
- **Carpetas**: todas las fotos y capturas están en `src/assets/images/`: `portadas-de-proyectos/` (4), `yupa-images/`, `remittven-images/`, `las-donas-images/`, `cappi-xtremo-images/`, `slider-destacados-homepage/`, `slider-footer/`, `servicios-homepage/`, `equipo-homepage/`, `contacto-homepage/` y `cabecera-links/`. `src/assets/projects/` y `src/assets/portfolio/` ya no existen. Los logos de herramientas pasaron a `case-study/tools/` (son logos de interfaz y está justificado). Los SVG de interfaz siguen en sus carpetas de módulo (advice, quote, links, ui, team/plus.svg…). Los nombres están en kebab-case.
- **Referencias**: un script recorrió las 134 rutas de asset de `src/` (claves `images/…`, alias `@/assets/…` y relativas). No hay ninguna rota. No hay archivos huérfanos: cada archivo de `src/assets/` aparece con su clave completa en algún punto de `src/`. Los grep de `assets/projects`, `assets/portfolio`, `cover-laptop` y `HeroCover` en `src/`, `docs/` y `design/` no devuelven nada.
- **Hero del caso**: en las 4 rutas (`/proyectos/{yupa,remittven,las-donas,cappi-xtremo}/`) y a los 4 anchos medidos con CDP, la sección del h1 tiene `bg-ink` (rgb 9,9,9), `background-image: none` y ninguna foto. Solo lleva el logo del cliente (si existe) y la flecha de "Explorar". No hay scroll horizontal (`scrollWidth` = viewport). `HeroCover.astro` está borrado. Los tokens `--project-cover-focus`, `--project-cover-shade` y `--project-cover-shade-sm` no aparecen en ningún sitio. Los `--project-cover-min-h` y `--project-cover-gap` que quedan se usan en `src/modules/project-hero/Section.astro:27-28`. La píldora de estado pasó a `bg-paper/10`: sobre tinta lisa se lee bien, así que es un cambio justificado. La `og:image` de cada caso es su portada.
- **Tarjetas**: la galería de la home y `/proyectos/` sirven `yupa`, `remittven`, `las-donas` y `cappi-xtremo` desde `portadas-de-proyectos` (avif con srcset) a 375, 768, 1024 y 1440. La derivación está en `src/content/projects.ts:66-67` (`cardImage` y, si falta, conclusión o solución).
- **Docs**: `docs/content-model.md` (regla 10 y `cardImage`), `docs/architecture.md:10` y `docs/design-system.md` (`--project-cover-*`) documentan la convención.
- **V2/V3**: capturas CDP del build (`astro preview`) a 375, 768, 1024 y 1440 de los heros de Yupa y Las Doñas, `/proyectos/` y la galería de la home. Mantienen la misma estructura (identificación arriba; promesa, explorar y ficha abajo; acento lima). La jerarquía se lee bien y nada se corta.
- **V5**: no hay `client:load`, `any` ni `ds-allow` en los archivos tocados, ni imports entre módulos (check:arch en verde).
- **V7**: el alcance se ciñe a lo que pide `acceptance`.

Nota de entorno: el `astro dev` que ya estaba en :4321 (pid 26096) no respondía, así que la revisión se hizo sobre `astro preview` en :4399. Ese servidor y el Chrome headless propio se cerraron por PID al terminar. El dev server del usuario no se tocó.
