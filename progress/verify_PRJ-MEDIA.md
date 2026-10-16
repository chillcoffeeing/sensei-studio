# Verify PRJ-MEDIA — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] Portada del hero borrosa en mobile (src/modules/project-hero/HeroCover.astro:17-18). `sizes="100vw"` con `widths=[640, 960, 1440]`,
  pero a 375 px el hero mide ~1000 px de alto y `object-cover` escala la portada (2039×1402) a ~1500 px CSS de ancho. Con DPR 1 el
  navegador elige la de 640 px y la estira unas 2,4 veces. El texto del portátil (p. ej. "1000 / 96.540" en Remittven) se ve muy
  suavizado. No afecta a la lectura porque va bajo la sombra, pero antes había un slot en tinta y ahora la imagen se ve blanda.
  Propuesta: `sizes` acorde al recorte (p. ej. `(min-width: 1024px) 100vw, 400vw`) o añadir 2039 a `widths`.
- [V2] A 768 la promesa de Yupa ("Tu pedido en tres pasos") cae sobre las pantallas claras del portátil. Se lee bien en la captura,
  pero es el punto con menos contraste. El implementer ya lo dejó anotado: la capa lateral `--project-cover-shade` podría aplicarse desde `md`.
- [V2] A 1440 el texto de la web de Remittven en la portada ("Envía dinero a Venezuela desde España") se ve, atenuado, detrás del h1
  "Remittven". La capa lateral basta para leerlo; solo es un detalle estético.

## Verificado sin hallazgos
- V1: `./init.ps1` en VERDE (check:ds 0, check:arch 0, astro check 0 errores, build OK), ejecutado por el verifier.
- V2 estructura: comparé `get_metadata` de Proyecto 3 (254:604) con lo que se renderiza. "Solución y experiencia" 254:726
  (lámina + 254:986) → 254:748 (slot 254:750, ocupado por 261:82) → frame extra 291:1320 (291:1329). En la página es lámina + media[0],
  después media[1] (5 pantallas) y media[2] (3 webs), en el mismo orden. Yupa: lámina + teléfono (249:16559) y bloque ancho
  con las pantallas de compra (267:1738). Las Doñas: lámina + login en portátil (267:2506), pantallas móviles (267:3248) y páginas web
  (277:8186 / 267:6142). Ningún slot de solución queda vacío en ninguno de los tres casos (capturas a 1440, 1024, 768 y 375).
  Sin componentes nuevos: los bloques extra son entradas de `media[]` que `project-solution` ya pinta a todo el ancho.
- Portadas en portátil: el hero de /proyectos/yupa, /remittven y /las-donas usa `cover-laptop.jpg` (311:28, 308:28, 304:480).
  La home (tarjeta grande Yupa + Remittven + Las Doñas) y /proyectos/ (3 tarjetas) muestran las tres portadas. Comprobado en el HTML
  construido (alt de cada portada) y en capturas. og:image = portada en los tres JSON.
- V3: capturas con Chrome headless y reduced motion (un iframe al ancho exacto para 375/768/1024). No hay scroll horizontal,
  el apilado mobile `aspect-4/3` + `contain` funciona y no se corta nada.
- V4: los 10 assets nuevos están en `src/assets/projects/<slug>/` y se sirven con astro:assets (avif/webp/jpg). Proporciones correctas,
  `fit: "contain"` sobre `bg-neutral-100`. Los alt son descriptivos y están en español. Los assets antiguos (`app-catalog-*`, `screen-confirmation`,
  `screens-beneficiaries-profile`) siguen en uso en el showcase de la home, así que no quedan huérfanos.
- V5: no hay cambios en componentes. `tokens.css` solo modifica `--project-cover-shade` (con la justificación comentada), no hay
  `initial` ni nombres de Tailwind redefinidos. Todo el copy y los alt viven en JSON.
- V6: no se tocaron encabezados ni patrones interactivos. Las imágenes tienen alt.
- V7: alcance correcto. Solo cambiaron assets, los tres JSON de proyecto, `tokens.css` y la documentación (`design/content-gaps.md`, `docs/design-system.md`).
  En content-gaps se borraron las filas resueltas y se actualizaron los "Real".
