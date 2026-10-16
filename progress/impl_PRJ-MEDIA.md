# impl PRJ-MEDIA: imágenes de solución superpuestas y portadas en portátil

Figma `flzA0qnj6JdalFCgyB2PdI`, contenedor `243:20`. Método: `get_metadata` de 243:20 (235 kB) y cruce
de las coordenadas absolutas de los hijos directos sueltos con el rango de cada frame de caso
(x = 232 / 1849 / 3466 / 5083, y = 369, ancho 1440) y con el slot gris de cada bloque "Solución y experiencia".
`get_screenshot` de un frame **no** incluye los nodos sueltos (salen los slots grises vacíos). Por eso se
exportaron los nodos sueltos uno a uno.

## Mapa de nodos sueltos del contenedor 243:20 (para PRJ-CAPPI y HOME-NO-STOCK)

| Nodo | Nombre en Figma | Proyecto | Dónde cae / qué es | Uso |
|---|---|---|---|---|
| 249:16559 | Group 39 (Ficha de producto · móvil) | **Yupa** | Sobre el slot 243:166 (junto a la lámina, 243:146) | `yupa/solution-product-phone.png` = media[0] |
| 267:1738 | pantallas yupa 1 | **Yupa** | Sobre 243:319 (bloque ancho 243:255) | `yupa/solution-checkout-screens.png` = media[1] |
| 311:28 | Yupa · Pantallas originales en laptop | **Yupa** | Portada (fuera de los frames, fila superior) | `yupa/cover-laptop.jpg` |
| 261:82 | Group 44 (5 pantallas) | **Remittven** | Sobre 254:750 (bloque ancho 254:748) | `remittven/solution-app-screens.png` = media[1] |
| 291:1320 (frame, no suelto) | Solución y experiencia (3 webs) | **Remittven** | Bloque extra, con sus pantallas dentro (291:1329) | `remittven/solution-web-pages.png` = media[2] |
| 254:984 | Group 40 (login, beneficiario, perfil, confirmación) | **Remittven** | Fuera de los frames (y 26033) | Es el mismo collage que ya estaba como `remittven/solution-screens.png` (254:986, media[0]) |
| 291:1451 | Group 1000003287 (8 pantallas sobre fondo azul) | **Remittven** | Collage de portafolio (fila y 2383) | Sin uso; candidato para HOME-NO-STOCK |
| 291:1292 | Mask group "1-Home (5) 1" | **Remittven** (por nombre: es la misma pantalla que 291:1342) | Fila y 2097 | **Ya no existe en el archivo** (borrado durante la sesión) |
| 308:28 | Remittven · Home original en laptop | **Remittven** | Portada | `remittven/cover-laptop.jpg` |
| 267:2506 | Diseño sin título 1 (login en portátil) | **Las Doñas** | Sobre 267:1891 (junto a la lámina, 267:1869) | `las-donas/solution-login-laptop.png` = media[0] |
| 267:3248 | pantallas las doñas 1 | **Las Doñas** | Sobre 267:1897 (bloque ancho 267:1893) | `las-donas/solution-mobile-screens.png` = media[1] |
| 277:8186 | Group 1000003279 ("pantalla final 1") | **Las Doñas** | Sobre 267:6146 (frame extra 267:6142) | `las-donas/solution-web-pages.png` = media[2] |
| 304:480 | Las Doñas · Login original en laptop | **Las Doñas** | Portada | `las-donas/cover-laptop.jpg` |
| 268:7397 | image 29 (web "Conectando sonrisas") | **Cappi Xtremo** | Dentro del rango de Proyecto 5 (267:2146), sobre su slot junto a la lámina | Para PRJ-CAPPI |
| 268:7400, 268:7402, 268:7403, 268:7404 | image 30–33 | **Cappi Xtremo** | Rejilla 2×2 sobre el bloque ancho de Proyecto 5 (y 3642–4199) | Para PRJ-CAPPI |
| 320:576 | Cappi Xtremo · Pantalla original en laptop | **Cappi Xtremo** | Portada (dashboard "Inicio" con el logo de Cappi) | Para PRJ-CAPPI |
| 291:1384 | Group 1000003283 | **Qfud** (app de alimentación, fondo verde) | Collage de portafolio | No es un caso publicado |
| 291:1412 | Group 1000003284 | **Pictdare** (red social de fotos, fondo coral) | Collage de portafolio | No es un caso publicado |
| 291:1439 | Group 1000003285 | **Referi** (app de juego/pagos, fondo azul) | Collage de portafolio | No es un caso publicado |
| 291:2800 | Group 1000003288 | ? | Collage de portafolio | **Ya no existe en el archivo**: no se pudo identificar |
| 291:1354 | image 37 (2279×1257) | ? | Fila y 3203 | **Ya no existe en el archivo**: no se pudo identificar |
| 291:5127 + 291:5128…5149 | Rectangle 9591 + 8 Mask group | **Soldee** (app de finanzas, rosa sobre negro) | Collage de 8 teléfonos | No es un caso publicado |
| 291:1847 | YUPA · Portada de portafolio (1600×900) | **Yupa** | Portada alternativa de portafolio | Sin uso (se prefirió la de portátil, que pide la feature) |
| 291:1689 / 291:2103 / 291:2686, 291:2921, 291:2812 | Econergía / Truma / Lavy · Portada de portafolio | Otros clientes | Portadas de portafolio | No son casos publicados |

## Archivos

Creados (`src/assets/projects/`):
- `yupa/cover-laptop.jpg`: 311:28, raw 2039×1402 a JPEG q88.
- `yupa/solution-product-phone.png`: export ×3 de 249:16559, fondo #D9D9D9 quitado (transparente).
- `yupa/solution-checkout-screens.png`: imagen original de 267:1738 (1298 px, con alfa), recortada arriba con la proporción del nodo (1036:563), igual que en Figma.
- `remittven/cover-laptop.jpg`: 308:28.
- `remittven/solution-app-screens.png`: export ×2 de 261:82, sin fondo.
- `remittven/solution-web-pages.png`: export ×2 de 291:1329 (contenido de 291:1320), sin fondo.
- `las-donas/cover-laptop.jpg`: 304:480.
- `las-donas/solution-login-laptop.png`: imagen original de 267:2506 (4000 px, alfa) reducida a 1600.
- `las-donas/solution-mobile-screens.png`: imagen original de 267:3248 (1744×863, alfa), entera: Figma la recortaba un 11 % por abajo.
- `las-donas/solution-web-pages.png`: imagen original de 277:8186 (4096 px, alfa), recortada arriba a 1252:577 como en Figma y reducida a 2640.

Modificados:
- `src/content/data/projects/yupa.json`: `project-hero.content.cover`, `project-solution.content.media` (2), `seo.ogImage` → portada.
- `src/content/data/projects/remittven.json`: `cover`, `media` pasa de 1 a 3 y `ogImage`.
- `src/content/data/projects/las-donas.json`: `cover`, `media` (3) y `ogImage`. (Los tres JSON se reescribieron con `JSON.stringify(…, 2)`: los arrays cortos ahora van en varias líneas.)
- `src/styles/tokens.css`: `--project-cover-shade` (lg) suma una capa lateral.
- `docs/design-system.md`: una línea sobre la sombra lateral.
- `design/content-gaps.md`: se borraron las filas resueltas (resumen n.º 11 de portadas, tarjeta de la home, `cover` y `media[]` de los tres casos, recorte de la imagen de cierre de Yupa) y se actualizaron los "Real".
- `progress/current.md`: plan.

Sin componentes nuevos ni cambios de esquema. Los bloques extra (Remittven 291:1320, Las Doñas 267:6142)
son entradas más de `media[]`: `project-solution` ya pinta `media[1..]` a todo el ancho. Todas las piezas
llevan `fit: "contain"` sobre el panel `bg-neutral-100` (el slot gris #F4F4F4 de Figma). La tarjeta de la
home, `/proyectos/`, `/links` y "Siguiente proyecto" ya derivan la imagen de `cover`, así que pasan solas
a la portada en portátil (comprobado en el HTML: `/`, `/proyectos/`, `/links`). og:image de cada caso = portada.

## Tokens

- Modificado `--project-cover-shade` (solo lg): se antepone `linear-gradient(to right, rgba(9,9,9,.9), rgba(9,9,9,.65) 45%, transparent 75%)`.
  Motivo (desviación de Figma): la portada es un portátil con su propia web, y su texto ("YUPA", "Envía dinero
  a Venezuela…", "Bienvenido a las Doñas") chocaba con el h1 y la promesa, que van a la izquierda. Con la capa
  lateral el texto se lee y el portátil queda visible a la derecha. No se agregaron ni se borraron tokens.

## Responsive

- Hero: el mecanismo de `cover` ya existente (foto a sangre, `object-cover`, encuadre mobile `--project-cover-focus: 68% center`
  y sombra vertical `-sm`). En mobile/tablet el portátil queda recortado hacia la derecha y la sombra vertical basta. A 768 la promesa
  cae sobre las pantallas claras del portátil de Yupa; se lee, pero es el punto más justo (posible ajuste futuro: capa lateral desde md).
- Solución: sin cambios de layout. Mobile apilado `aspect-4/3` con `contain` + `p-4`; desde sm los bloques anchos son `aspect-44/21`.
- Las capturas de "375" con Chrome headless se pintan a ~500 px CSS (ancho mínimo de ventana), así que la revisión a 375 exacto queda para el verifier.
- Revisado en headless (reduced motion): 1440 (los tres casos, hero y solución), 1024 y 768 (hero de Yupa), home a 1440.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds → 0 ds-allow · 0 error(es)
[OK] check:arch → 280 archivos · 23 módulos · 0 error(es)
[OK] astro check → 0 errors
[OK] astro build
VERDE: todo en orden.
```
