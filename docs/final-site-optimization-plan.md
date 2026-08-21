# Plan final de optimización del sitio

## Objetivo

Dejar Sensei Studio listo para publicar como landing de agencia: rápido en móvil, rastreable por buscadores y usable con teclado, lectores de pantalla y preferencias de movimiento reducido.

Este plan es independiente de la pasada de copy. No cambia la dirección visual ni añade una nueva sección al homepage.

## Estado actual

- Astro 7 con salida server/static prerendered y React 19 islands.
- Tailwind CSS v4 y Motion ya instalados.
- `pnpm build` funciona y genera `/index.html`.
- Hero con MP4 decorativo, poster y reproducción condicionada por `prefers-reduced-motion`.
- Islands actuales: `AnimatedSection`, `FaqAccordion`, `ServicesAccordion`, `VideoBackground`.
- El documento no tiene todavía sitemap, canonical, Open Graph, JSON-LD ni una estrategia explícita para imágenes responsive.
- Las redes sociales están pendientes de verificación; por ahora el sitio usa anclas internas y `hola@sensei.studio`.

## 1. Rendimiento

### Prioridad alta

- Medir una línea base en móvil y desktop con Lighthouse/PageSpeed: LCP, INP, CLS, TBT y peso total.
- Generar versiones AVIF/WebP de las imágenes grandes y usar `width`, `height`, `srcset` y `sizes` para evitar descargar más píxeles de los necesarios.
- Mantener solo el poster optimizado del Hero como recurso prioritario; evitar `preload` del MP4 completo hasta comprobar que mejora LCP.
- Revisar el MP4: codec, resolución, bitrate, duración y peso. Mantenerlo como fondo decorativo, con poster visible si la red es lenta o el usuario reduce movimiento.
- Aplicar `loading="eager"` únicamente al primer proyecto/imagen realmente visible; conservar lazy loading para proyectos, equipo, reviews y collage.
- Auditar las islas React: mantener `client:load` solo para el video del Hero y usar `client:visible` para servicios, FAQ y animaciones fuera de viewport.

### Prioridad media

- Autoalojar y subdividir DM Sans si el rendimiento de la fuente externa lo justifica; si no, conservar `preconnect` y limitar pesos cargados.
- Declarar dimensiones o ratios estables para cada media para evitar CLS.
- Revisar el CSS generado y eliminar estilos de componentes sin uso cuando exista evidencia de que no se reutilizan.
- Repetir la medición después de cada grupo de cambios y registrar el peso de página junto con LCP/CLS.

## 2. SEO

### Prioridad alta

- Confirmar el dominio canónico real de Sensei Studio antes de publicar URLs absolutas.
- Añadir `link rel="canonical"` desde `Landing.astro` usando la URL de producción.
- Completar `title` y `meta description` con el posicionamiento final de agencia.
- Añadir Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` y `og:locale=es_ES`.
- Añadir `twitter:card` y reutilizar una imagen social optimizada.
- Crear JSON-LD de tipo `ProfessionalService` u `Organization` con nombre, descripción, email, área de servicio y enlaces únicamente verificados.
- Añadir `sitemap.xml` y `robots.txt` cuando el dominio de producción esté confirmado; valorar `@astrojs/sitemap` para mantenerlo integrado con Astro.

### Contenido y estructura

- Mantener un único `h1` en el Hero y una secuencia lógica de `h2` por sección.
- Usar nombres de proyectos, servicios y FAQ como texto rastreable, no como parte exclusiva de imágenes.
- Revisar claims como `+250`, `97%` y `56+` para que tengan respaldo interno antes de publicarlos.
- No indexar ni presentar como prueba de agencia las opiniones formativas actuales; mantener su contexto explícito hasta recibir testimonios de clientes.
- Reemplazar los enlaces genéricos de redes solo cuando existan perfiles oficiales confirmados.

## 3. Accesibilidad

### Prioridad alta

- Añadir un enlace “Saltar al contenido” antes de la navegación principal.
- Verificar landmarks: `header/nav/main/footer`, un solo `h1`, `aria-labelledby` correcto y labels descriptivos.
- Auditar todos los estados de foco en tema claro y oscuro, especialmente botones, anclas del footer, CTA, servicios y FAQ.
- Confirmar tamaño táctil mínimo de 44px para todos los triggers y enlaces clave.
- Revisar contraste de `muted`, `hero-muted`, bordes y texto sobre `bg-neutral-surface` en ambos temas.
- Mantener `aria-expanded`, `aria-controls` y `role="region"` en disclosures; comprobar navegación por Tab, Enter y Space.
- Mantener el video como decorativo (`aria-hidden`, sin controles) y detenerlo con reduced motion.
- Revisar alt text: describir imágenes informativas y usar alt vacío solo en visuales decorativos.

### Prioridad media

- Añadir una indicación visible de estado para la theme toggle.
- Comprobar que los carruseles/marquee no bloqueen el teclado ni creen lectura duplicada innecesaria.
- Ejecutar axe o auditoría equivalente en desktop y mobile después de los cambios.

## 4. Validación final

- `pnpm build` sin errores.
- Lighthouse/PageSpeed en móvil y desktop con registro de LCP, INP, CLS y peso total.
- Auditoría de accesibilidad y SEO sin errores críticos.
- Navegación completa solo con teclado.
- Verificación manual de tema claro/oscuro y `prefers-reduced-motion`.
- Comprobación de todas las anclas internas y del `mailto`.
- Prueba de compartir la URL cuando exista dominio de producción para validar Open Graph.

## Dependencias pendientes

No instalar paquetes hasta confirmar el dominio de producción y decidir si se integrará `@astrojs/sitemap`. El resto de la optimización puede realizarse con Astro, Vite, CSS y los componentes existentes.

## No objetivos

- No rediseñar el homepage.
- No publicar perfiles sociales no verificados.
- No inventar testimonios de clientes.
- No cambiar el MP4 por una nueva pieza audiovisual sin una medición de rendimiento que lo justifique.
