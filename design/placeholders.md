# Imágenes del sitio: origen de cada pieza

> HOME-NO-STOCK (2026-10-14) sustituye a IMG-PLACEHOLDERS. Pedido del usuario: "para las imágenes de
> galerías (homepage por ejemplo) debes tomar imágenes de los proyectos; nos libramos de Unsplash y de
> cualquier imagen de relleno". Ya no hay fotos de Unsplash, ni hotlink a imgix, ni página `/creditos/`.

## Reglas

- **Solo trabajo del estudio**: piezas de los cuatro casos publicados y collages de portafolio del
  archivo de Figma, ordenados por uso en `src/assets/images/` (ASSETS-FOLDERS, convención en
  `docs/content-model.md`, regla 10). Nada de bancos de imágenes.
- **Personas sin foto real** → `shared/ui/UserPlaceholder` (silueta neutra). Nunca un retrato de relleno.
- **Encuadre**: cada slot recorta en el servidor a su proporción. Si el centro no sirve, el dato lleva
  `position` (`left`, `top`, `right`…, ver `docs/content-model.md`) para conservar lo que importa
  (logotipo de la app, primera pantalla, fila superior).
- **Repeticiones**: cada carpeta de uso guarda su propia copia de una pieza. Dentro de una sección solo
  se repite Aloa en la rueda del pie, porque Figma la duplica y la rueda necesita 6 tarjetas.

## Servicios (SERVICES-IMAGES, `images/servicios-homepage/`)

Imágenes propias por disciplina, verticales (~1281 × 1913, recorte central al 187:318 del acordeón).

| Disciplina | Archivos | Origen |
|---|---|---|
| Branding e identidad | `branding-papitos-fast-food.jpg`, `branding-my-little-cat.jpg`, `branding-tiffany-studios.jpg` | Figma 351:28, 351:29, 351:30 (export escala 1, JPEG q88) |
| Email Marketing | `email-marketing-casa-tierra-cafe.jpg`, `email-marketing-odontosalud.jpg`, `email-marketing-rutas-andinas.jpg` | Figma 352:32, 352:33, 352:34 (export escala 1, JPEG q90) |
| Diseño UX/UI | `ux-ui-investigacion.png`, `ux-ui-wireframes-prototipo.png`, `ux-ui-diseno-validacion.png` | Láminas del estudio |
| Desarrollo & IA | `desarrollo-web-ecommerce-apps.jpg`, `dashboards-chatbots-analitica.jpg`, `automatizacion-inteligencia-artificial.jpg` | Ilustraciones vectoriales propias |

## Piezas de portafolio (Figma `flzA0qnj6JdalFCgyB2PdI`, contenedor 243:20)

Collages de 8 pantallas (1808 × 1881, Referi y Remittven igual; Just Make It Fun y Yupa 1989 × 1881).
Exportados a escala 1, sin los 20 px del borde redondeado, a JPEG q85 de 1600 px de ancho.

| Archivo (en `images/slider-destacados-homepage/`) | Nodo | Proyecto | Qué es |
|---|---|---|---|
| `qfud-app-screens.jpg` | 291:1384 | Qfud | App de alimentación saludable, fondo verde |
| `pictdare-app-screens.jpg` | 291:1412 | Pictdare | Red social de retos de fotos, fondo coral |
| `referi-app-screens.jpg` | 291:1439 | Referi | App de juegos y pagos, fondo azul |
| `soldee-app-screens.jpg` | 291:5154 | Soldee | App de finanzas personales, fondo rosa |
| `just-make-it-fun-web-screens.jpg` | 291:7282 | Just Make It Fun | Tienda online (web móvil), fondo celeste |
| `remittven-app-screens.jpg` | 291:1451 | Remittven | 8 pantallas de la app sobre fondo azul |
| `yupa-checkout-screens.jpg` | 291:7283 (= 329:7330, idéntica) | Yupa | Pedido, pago y confirmación, fondo morado |

## Piezas del pie (rueda): grupo "SOLO PARA SLIDERS DEL FOOTER" (IMG-SLIDERS)

Webs en portátil (2039 × 1359, fila bajo el rótulo 334:7355). Exportadas a escala 1 y guardadas en
`images/slider-footer/` como JPEG q85 de 1600 px de ancho. Son decorativas (`alt=""`).

| Archivo | Nodo | Proyecto |
|---|---|---|
| `truma-consultores-login-laptop.jpg` | 331:7342 | Truma Consultores · acceso |
| `aloa-handbags-website-laptop.jpg` | 331:7344 (= 331:7346, idéntica) | Aloa · tienda de bolsos |
| `global-logistics-website-laptop.jpg` | 332:7348 | Global Logistics · portada |
| `marketplace-artesanal-website-laptop.jpg` | 333:7350 | Marketplace artesanal (Xamanpop) |
| `yupa-stickers-website-laptop.jpg` | 334:7351 | Yupa · web de stickers |

Qfud, Pictdare, Referi, Soldee y Just Make It Fun no son casos publicados, pero son trabajo del estudio
(collages de su portafolio): se usan como piezas de galería, sin enlace a un caso. Las portadas de
portafolio de Econergía, Truma y Lavy (291:1689, 291:2103, 291:2686) y la portada alternativa de Yupa
(291:1847) que listaba PRJ-MEDIA **ya no existen en el archivo** (2026-10-14): no se usan.

## Dónde va cada pieza

| Slot | Proporción | Piezas (encuadre) |
|---|---|---|
| Servicios · Branding | 187:318 | Florista de Las Doñas · Qfud (`left`, logotipo) · Pictdare (`left`, logotipo) |
| Servicios · Email Marketing | 187:318 | Just Make It Fun (`left`, promo) · Yupa pedido (`right`, confirmación) · Las Doñas en portátil |
| Servicios · UX/UI | 187:318 | Confirmación de Remittven · Referi (`left`) · Soldee (`left`) |
| Servicios · Desarrollo | 187:318 | Catálogo de Yupa · Backoffice de Cappi Xtremo (`left`) · Portal de Cappi en portátil |
| Showcase | 616:658 | Grupo "SLIDER INTERMEDIO", en orden: Qfud · Pictdare · Referi · Remittven · Soldee · Yupa compra · Just Make It Fun (la copia 329:7330 de Yupa no se repite) |
| Contacto (fondo, 30 %) | 3:2 | Web de Remittven en un portátil (conclusión del caso) |
| Pie · rueda | 303:247 | Grupo "SLIDERS DEL FOOTER": Truma · Aloa · Global Logistics · Marketplace artesanal (composición estática) + Yupa y Aloa (entran al girar; Aloa repetida como en Figma) |
| Testimonios · avatares | 1:1 | `UserPlaceholder` × 4 (no hay fotos de clientes con permiso) |
| Equipo · huecos | 344:423 | `UserPlaceholder` (lo retoma TEAM-REAL) |

Email Marketing no tiene piezas de email en el portafolio: se usan piezas de campaña y comunicación
(promoción de tienda, confirmación de pedido, bienvenida). Hueco anotado en `design/content-gaps.md`.
