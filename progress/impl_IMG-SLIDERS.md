# impl IMG-SLIDERS — imágenes del showcase y de la rueda del pie desde los grupos de Figma

Figma `flzA0qnj6JdalFCgyB2PdI`, contenedor 243:20, revisado con `get_metadata` (completo) y exportaciones.
No hay piezas nuevas en las filas: la del showcase (y = 5203) tiene 8 nodos y la del pie (y = 9027) tiene 6.

## Grupos confirmados (de izquierda a derecha)

- **SOLO PARA SLIDER INTERMEDIO** (334:7357): 291:1384 Qfud · 291:1412 Pictdare · 291:1439 Referi ·
  291:1451 Remittven · 291:5154 Soldee · 291:7283 Yupa compra · 329:7330 · 291:7282 Just Make It Fun.
  **329:7330 es idéntica píxel a píxel a 291:7283**: las exportaciones de Figma tienen el mismo md5.
- **SOLO PARA SLIDERS DEL FOOTER** (334:7355 / banda 334:7354): 331:7342 Truma · 331:7344 Aloa ·
  332:7348 Global Logistics · 333:7350 Marketplace artesanal · 331:7346 Aloa · 334:7351 Yupa.
  **331:7344 y 331:7346 son idénticas**: las exportaciones tienen el mismo md5.

## Decisiones sobre los duplicados (para que el orquestador o el usuario lo confirme)

- **Showcase: 7 diapositivas.** La copia 329:7330 no se publica, porque saldría la misma diapositiva dos veces
  seguidas. El carrusel no exige un número fijo y antes ya tenía 7. Queda como P3 en content-gaps.
- **Rueda del pie: 6 tarjetas, con Aloa dos veces.** `footer-wheel.ts` exige exactamente 4 tarjetas fijas y 2 que
  entran al girar. La segunda Aloa entra la última y queda en el lado opuesto del anillo a la primera. La
  composición estática (sin JS o con reduced motion) no la repite. Queda como P3 en content-gaps.

## Archivos

- `src/assets/images/slider-destacados-homepage/`: se añaden `remittven-app-screens.jpg`, `soldee-app-screens.jpg`,
  `yupa-checkout-screens.jpg` y `just-make-it-fun-web-screens.jpg`, copiados con los mismos bytes de
  `servicios-homepage/` y del antiguo `slider-footer/`. Ya eran exportaciones de esos mismos nodos.
- Borrados de `slider-destacados-homepage/` (quedaron sin uso): `las-donas-florist.jpg`,
  `remittven-beneficiaries-profile-screens.png`, `remittven-laptop.png` y `yupa-app-catalog-phones.jpg`.
- `src/assets/images/slider-footer/`: nuevos `truma-consultores-login-laptop.jpg`, `aloa-handbags-website-laptop.jpg`,
  `global-logistics-website-laptop.jpg`, `marketplace-artesanal-website-laptop.jpg` y `yupa-stickers-website-laptop.jpg`.
  Son exportaciones de Figma a escala 1 (2039 × 1359), pasadas a JPEG q85 de 1600 px de ancho (150–220 kB).
- Borrados de `slider-footer/` (quedaron sin uso): `cappi-xtremo-website.jpg`, `las-donas-laptop.jpg`,
  `remittven-app-screens.jpg` (movido al showcase), `remittven-laptop.jpg`, `soldee-app-screens.jpg` y
  `yupa-app-mockup.png`.
- `src/content/data/pages/home.json`: las `slides` del showcase siguen el orden del grupo y llevan alt nuevo en español.
- `src/content/site.ts`: en `footer.gallery`, `cards` = Truma, Aloa, Global Logistics y Marketplace; `incoming` = Yupa y Aloa.
- `design/content-gaps.md`: Destacados pasa a describir el grupo, con la fila P3 del duplicado. Chrome tiene una fila P3 nueva para la rueda.
- `design/placeholders.md`: tabla nueva con las piezas del pie y sus nodos, filas de Showcase y Pie actualizadas, y regla
  de repeticiones con las copias que comparten `servicios-homepage/` y `slider-destacados-homepage/`.

Copias idénticas en dos carpetas, documentadas en placeholders.md: `qfud`, `pictdare`, `referi`, `soldee`,
`yupa-checkout` y `just-make-it-fun` están en `servicios-homepage/` y en `slider-destacados-homepage/`, porque cada
carpeta es de un uso (convención de ASSETS-FOLDERS).

## Encuadre

Se previsualizaron los recortes centrados en cada proporción de slot: 616:658 en el showcase y 303:247 en el pie.
- Collages del showcase (≈ 0,96 y 1,06) en un slot de 0,94: el recorte es mínimo. Centrado, sin `position`.
- Portátiles del pie (1,5) en tarjetas de 1,22: el recorte quita unos 9 % por lado y los portátiles quedan
  completos o casi. Centrado. Se quitan los `position` antiguos (`left`, `top`), que eran de las piezas anteriores.

## Responsive y motion

No cambian el marcado ni los componentes. ShowcaseCarousel y FooterWheel ya son mobile first y respetan reduced motion.
El recorte lo hace `astro:assets` (Photo → `<Picture>` AVIF/WebP/JPEG). No se agregan ni se quitan tokens.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, `astro check` y `astro build` OK.
