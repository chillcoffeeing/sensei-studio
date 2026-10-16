# Verify EXTRACT-B — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

Ninguno que pida cambio. Una nota sobre nombres: B9 se llama `SolutionPackagingDots` y no `PackagingSliderDots`,
como proponía `progress/audit_components.md:26`. El informe lo justifica: sigue el prefijo `Solution*` de
`modules/project`. Se acepta.

## Verificado sin hallazgos

- **V1**: `./init.ps1` da VERDE. Pasan check:ds (0 ds-allow, 0 errores), check:arch, astro check (0 errores) y build.
- **Línea base para el antes/después**: `scratchpad/dist_before/`, compilada a las 00:57:49 para EXTRACT-A.
  Ese verify demostró que EXTRACT-A no cambia la salida, salvo el chunk `ContactForm.*.js`. Ningún archivo
  de EXTRACT-B es anterior a las 01:03:42 (`find -newermt`), así que la base vale como "antes" de esta feature.
- **HTML generado** (lo comparé con el `dist/` que dejó `init.ps1`):
  - `proyectos/origen/index.html` y `componentes/index.html` son idénticos byte a byte. Eso cubre B9:
    los puntos del slider dan el mismo marcado.
  - En `index.html`, con los hashes de chunk normalizados, solo cambia la isla de servicios:
    - el `uid` de la isla;
    - 16 comentarios `<!---->` nuevos. Son los anclajes de Svelte para los componentes hijos `ServiceBullets` y
      `ServiceImage`, no se pintan y no cambian ningún elemento ni atributo.
  - El HTML de footer (B1–B3), masonry (B4), marquee (B5), ProjectCard (B6) y TrustBadge (B7) es idéntico,
    y también sus scripts inline.
- **CSS y JS**: todos los `.css` dan el mismo md5. De los JS solo cambian `ServicesAccordion.*.js` (B8, era de
  esperar) y `ContactForm.*.js` (de EXTRACT-A).
- **Navegador real**: Chrome headless con perfil temporal propio, cerrado por su PID. Corrí el mismo guion contra la
  build de antes (`:4401`) y la de después (`:4402`), a 375 (táctil) y 1440, con y sin `prefers-reduced-motion`.
  Todos los valores salen iguales, salvo los que dependen del momento exacto de la muestra (transforms de la
  rueda y de la entrada a medio camino). La trayectoria es la misma.
  - **Rueda del footer**: gira. El botón `data-wheel-pause` empieza con `aria-pressed=false` y la etiqueta "Pausar la
    galería animada". Al pulsarlo los transforms se detienen y pasa a `aria-pressed=true`. Al pulsarlo otra vez,
    la rueda sigue. Con reduced-motion no gira. Las 6 `[data-wheel-slot]` tienen el mismo slot y el mismo display.
  - **Masonry**: 7 pistas `masonry-down`, con las duraciones inline de antes (`calc(var(--duration-masonry) * 20/10/5)`).
    Con el foco en la región pasan a `paused`. Con reduced-motion, `animation-name: none` y las copias `aria-hidden`
    quedan en `display:none`.
  - **Marquee**: `marquee 120s` en `running`. Con el foco en `#clientes` pasa a `paused`. Con reduced-motion no hay
    animación y la mitad decorativa queda oculta.
  - **ProjectCard**:
    - con `(hover: hover)`, el hover cambia las capas (pill → detalle glass con las 4 métricas, imagen con blur);
      lo comprobé en captura;
    - al salir, vuelve al reposo;
    - al llegar con Tab, el estado es igual al del hover y se ve el outline de 2px.
  - **Acordeón de servicios**:
    - empieza en `true,false,false,false`;
    - al hacer clic en la fila 2, queda en `false,true,false,false`, con el panel abierto (358px) y los demás a 0;
    - los `data-enter` (descripción, viñetas e imágenes) llevan `enter-from-side`. A los 120 ms están a medio
      camino (opacidad 0.4–0.8 y translateX negativo) y terminan en opacidad 1 y `matrix(1,0,0,1,0,0)`;
    - ArrowDown mueve el foco a "Diseño UX/UI";
    - con reduced-motion, opacidad 1 y sin transform.
  - **Slider de packaging** (`/proyectos/origen/`):
    - los puntos se ven con JS (`flex`) y empiezan con `0:data-active, aria-current=true`;
    - al pulsar el punto 1, el activo pasa al 1, cada punto cambia entre su imagen activa e inactiva, y
      `scrollLeft` vale 343 (375) / 648 (1440);
    - al volver al punto 0, todo regresa a 0;
    - con reduced-motion se comporta igual.
- **V2/V3**: el DOM y el CSS no cambian, así que la estructura y la calidad visual son las mismas.
  `scrollWidth` es igual al viewport en 375 y 1440, en el home y en el proyecto. Capturas en
  `scratchpad/eb-shots/` (footer, ProjectCard en reposo/hover/foco, servicios, slider).
- **V4**: assets sin cambios. Mismas imágenes, mismos `srcset`/`sizes` y las mismas proporciones de `<Picture>`
  (303/606 × 496) en `FooterGalleryCard`.
- **Props mínimos, sin flags de estilo**: cada componente recibe solo los datos que pinta:
  - `column`, `studio`, `src` + `wheelSlot` + `class` (solo la colocación), `cards`, `logos`;
  - `title` + `category`, `metric`, `avatars` + `count`, `rating`;
  - `items` + `bullet` + `enterClass` (gancho de comportamiento reactivo, no de aspecto), `image` + `sizes`,
    `total` + `dotLabel`.

  La copia `aria-hidden` (masonry) y la mitad decorativa (marquee) se resuelven dentro de su componente.
  Ningún componente recibe booleanos `copy` ni `decorative`.
- **Ubicación**:
  - Las piezas del footer van a `layout/`: solo las usa `Footer.astro`.
  - Masonry, marquee, servicios y puntos van a su módulo dueño, con un único consumidor cada uno.
  - `ProjectCardPill`/`ProjectCardMetric` y `AvatarStack`/`RatingStars` van a `shared/ui/`, porque su único
    padre vive ahí y shared no puede importar módulos.

  Ninguna se usa en 2 o más módulos, así que con no tener entrada propia en `/componentes` basta. Están
  documentadas como piezas internas en `docs/components.md:45,403,435,598,601,604`.
- **Descartes**: no hay. Se implementaron los 9 puntos, y la decisión de no extraer el `<img>` suelto del logo
  dentro de B5 queda justificada en el informe.
- **V5**:
  - en los 12 archivos nuevos no hay arbitrarios `[..]`, hex, `client:load`, `any` ni `ds-allow`, y ningún import
    cruza módulos;
  - el copy llega por props;
  - `bg-black/50` es Tailwind por defecto;
  - no se tocó `tokens.css`.
- **V6**: se conservan `aria-hidden`, `alt=""` en lo decorativo, `role="img"` con `aria-label` en las estrellas,
  `sr-only` en el contador, `aria-current` en los puntos y `aria-expanded`/`aria-controls`/`role=region` en el
  acordeón (el DOM es idéntico).
- **V7**: el alcance se limita a B1–B9:
  - componentes nuevos;
  - sus padres;
  - el tipo `MasonryCard` en `masonry.ts`;
  - `docs/components.md`, `feature_list.json` y `progress/current.md`.
