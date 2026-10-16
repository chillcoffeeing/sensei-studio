# Verify IMG-SLIDERS — vuelta 1
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V2/V4] Rueda del pie: **a 1440 las dos Aloa se ven a la vez durante media vuelta.** Lo medí en Chrome headless
  tomando muestras cada 1 s durante 46 s (6 pasos de 7 s): en unas 24 de las 46 muestras están las dos Aloa en
  pantalla (captura `seq1440-34`: Aloa a la izquierda y otra vez a la derecha). A 375 nunca coinciden. Con 6
  tarjetas sobre 7 poses y unas 5 visibles en desktop, no hay forma de colocar dos piezas iguales sin que
  coincidan, así que la decisión del implementer es la menos mala que permite el acceptance ("exactamente las del
  grupo"). Pero `design/content-gaps.md:117` ("Aloa sale dos veces, en lados opuestos del anillo") y
  `progress/impl_IMG-SLIDERS.md` dan a entender que no se ven juntas. Esperado: que la fila P3 diga que en
  desktop las dos Aloa coinciden en pantalla parte del ciclo, para que el estudio decida (otra pieza en Figma o
  5 tarjetas únicas más una de otro grupo). Lo puede corregir el orquestador, porque está en `design/`.
- [V4] Showcase: los JPEG locales (copias de `servicios-homepage/`) tienen fondo de color: verde en Qfud, coral
  en Pictdare, azul en Referi, gris azulado en Remittven, rosa en Soldee, morado en Yupa y celeste en Just Make
  It Fun. El render actual de esos nodos en `flzA0qnj6JdalFCgyB2PdI` tiene fondo gris neutro: el rectángulo
  291:1358 es #B8B8B8/#D9D9D9 y no tiene relleno de imagen. Las pantallas son las mismas, en el mismo orden y con
  la misma composición (comparación lado a lado en el scratchpad, `cmp_rest.png` y `cmp_yupa_jmif.png`). El
  fondo de color se ve mejor sobre la banda negra del showcase y no cambia la estructura, así que no es
  hallazgo de V2. Pero el informe dice que son "exportaciones de esos mismos nodos" y no menciona la diferencia
  de fondo. Sugerencia: anotarlo en `design/placeholders.md` (tabla del showcase).

## Verificado sin hallazgos

- **V1** `./init.ps1`: VERDE (exit 0). Pasan toolchain, dependencias, estado, check:ds, check:arch, astro check
  y build.
- **Grupos de Figma** (`get_metadata` 243:20, hijos directos): la fila y=5203 tiene exactamente 8 nodos. De
  izquierda a derecha: 291:1384, 291:1412, 291:1439, 291:1451, 291:5154, 291:7283, 329:7330 y 291:7282. La fila
  y=9027 tiene exactamente 6: 331:7342, 331:7344, 332:7348, 333:7350, 331:7346 y 334:7351. No hay piezas nuevas.
  Los rótulos son 334:7357 (texto "SOLO PARA SLIDER INTERMEDIO") y la banda 334:7354 con el texto 334:7355.
- **Duplicados confirmados**: exporté los nodos con `download_assets`. 329:7330 y 291:7283 dan el mismo md5
  (`58fa5b24…`, 1989×1881). 331:7344 y 331:7346 también (`da388c05…`, 2039×1359). Decisiones:
  - **Showcase con 7 diapositivas (sin 329:7330): razonable.** El carrusel en bucle no exige número fijo y
    repetir Yupa seguida se vería como un error. Está registrado como P3 en `content-gaps.md:76`.
  - **Rueda con Aloa repetida: razonable** porque `footer-wheel.ts` necesita 6 tarjetas y el acceptance pide
    "exactamente" las del grupo. Ver el menor sobre lo que dice la documentación.
- **Correspondencia de cada archivo con su nodo** (diferencia perceptual a 32×32 frente al render de Figma):
  - Pie: los 5 archivos coinciden casi exacto con su nodo (diferencia de 1,3 a 1,8 sobre 255): truma → 331:7342,
    aloa → 331:7344, global → 332:7348, marketplace → 333:7350 y yupa-stickers → 334:7351.
  - Showcase: cada archivo da su mejor coincidencia con el nodo correcto: qfud → 1384, pictdare → 1412,
    referi → 1439, remittven → 1451, soldee → 5154, yupa-checkout → 7283 y jmif → 7282. La distancia que
    queda se debe solo al fondo (ver menor).
- **Orden**: `home.json:376-416` sigue el orden de Figma (Qfud, Pictdare, Referi, Remittven, Soldee, Yupa
  compra, JMIF). En `site.ts:334-345`, `cards` es Truma, Aloa, Global y Marketplace, e `incoming` es Yupa y
  Aloa. Se invierte el orden Aloa3/Yupa para separar la Aloa repetida. Está justificado.
- **Resolución**: las fuentes miden 1600 px de ancho (showcase 1600×1666 y 1600×1511; pie 1600×1066). El slot
  mayor es de 616 px en el showcase y 303 px en el pie, así que cubren 2×. Se sirven con `<Picture>`
  AVIF/WebP/JPEG y srcset. En el navegador, `naturalWidth` coincide con el ancho mostrado en cada viewport.
- **Encuadre**: se recorta con `object-cover` centrado. En las capturas de 375 y 1440, los collages del
  showcase solo pierden un borde mínimo y los portátiles del pie se ven completos o casi, sin cortes feos. Ya no
  quedan `position` antiguos en las slides ni en `footer.gallery`. Los de `home.json:259-350` son de servicios
  y no entran en el alcance.
- **Alt**: las 7 slides tienen alt descriptivo en español. Las tarjetas del pie llevan `alt=""` con `decorative`
  en `FooterGalleryCard.astro`, que es lo correcto para una galería decorativa y está documentado en
  `placeholders.md:40`.
- **Copias y huérfanas**: con la búsqueda por nombre y ruta sobre todo `src/assets`, no queda ninguna imagen
  huérfana. Los duplicados por md5 que deja esta feature son los 6 entre `servicios-homepage/` y
  `slider-destacados-homepage/`, documentados en `placeholders.md:16-18`. Los demás duplicados ya existían
  (portadas, contacto, cappi, las-donas). Ya no queda ninguna referencia a los archivos borrados.
- **V3 en navegador** (Chrome headless sobre el `dist` recién construido, a 375, 768, 1024 y 1440):
  - Sin scroll horizontal: `scrollWidth` es igual al viewport en los 4 anchos.
  - Autoplay del showcase: `data-playing` presente y `scrollLeft` sube (375: 38 → 91; 1440: 78 → 189 en 2 s).
  - Rueda del pie: el transform de las tarjetas cambia entre muestras en los 4 anchos y las que entran
    (slots -1 y -2) se ven al girar.
  - `prefers-reduced-motion: reduce`: el showcase queda quieto (sin `data-playing`, `scrollLeft` en 0) y la
    rueda no gira (`transform: none`, sin `data-wheel`). Las tarjetas que entran quedan ocultas y la
    composición estática (Truma, Aloa, Global y Marketplace) no repite ninguna pieza.
- **V5/V7**: la feature solo toca datos (`home.json`, `site.ts`), assets y documentación de `design/`. No cambia
  componentes, tokens ni islas. No hay antipatrones nuevos.
