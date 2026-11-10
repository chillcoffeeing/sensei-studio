# Sesión activa — estado vivo

## Estado

- **Feature en curso**: ninguna. Cola: —.
- **Despliegue** (`docs/deploy.md`): sitio publicado en `~/bysensei.com` y DNS apuntado a 184.94.213.174.
  Pendiente: redesplegar (DEPLOY-SSL-DCV + MAIL-ENDPOINT + LINKS-DIAGNOSTIC + WHATSAPP-NUMBER + LINKS-TWO-PATHS), ejecutar Run AutoSSL, revisar
  Email Deliverability (SPF/DKIM) en cPanel y probar `/api/send.php` con curl. Publicado **sin indexar**
  (`NOINDEX_FOR_DEPLOY=true` en `.env`): quitarlo para el lanzamiento.
- **Bloqueos**: ninguno. Faltan datos del estudio (`design/content-gaps.md`):
  ID de GTM/GA4, redes del estudio, páginas legales y algunos perfiles del equipo.
- **Por confirmar con Natalia**: los CTA del diagnóstico no repiten «→» en el texto (la flecha la dibuja el botón).

## Plan LINKS-TWO-PATHS (implementer)

- `ModalDialog` + `focus-trap` pasan a `shared/lib/dialog/` (los módulos no pueden importar `layout/`) y suman el modo móvil `sheet` (hoja inferior, 94 dvh) y el ancho `sm`.
- Nueva tarjeta de dos caminos (`LinksPathsCard` + `LinksPathTile`): disparadores `data-diagnostic-open` y `data-quote-open`.
- Isla `LinksDiagnosticDialog` (ModalDialog en hoja) que envuelve el wizard actual; 4b con los 3 pasos y "Cotizar por WhatsApp".
- Cabecera sin botones, sin "Conoce nuestros servicios", cierre "¿Prefieres escribirnos?".
- Medición con `core/analytics.ts` (`window.dataLayer`), `cotizacion_continuar` en el envío válido del modal de cotización.
