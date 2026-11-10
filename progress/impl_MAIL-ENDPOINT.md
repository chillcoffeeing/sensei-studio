# impl MAIL-ENDPOINT: envío real de formularios (PHP en cPanel)

## Archivos

Creados
- `public/api/send.php`: un único script para todos los formularios. Acepta POST JSON o multipart; `form` (contact | quote | advice | diagnostic) define los campos y el asunto. Destinatario `bysenseistudio@gmail.com` solo aquí. From `no-reply@bysensei.com` más `-f` en el sobre (SPF). Reply-To es el email validado de la persona. Todo lo que entra en una cabecera pasa por `header_text()` (sin CR/LF) y se codifica en RFC 2047. Cuerpo en texto plano UTF-8 (base64). El adjunto va en `multipart/mixed`: ≤ 10 MB y PDF o `image/*` según finfo, igual que `accept` en `site.quote.attachment`. Protección: solo POST (405), Origin/Referer de bysensei.com o www, o ausentes (403), 415 si el tipo no vale, 413 si el tamaño se pasa, 422 por campo (obligatorio, longitud, UTF-8, email) y 429 con más de 5 envíos válidos cada 10 min por IP (archivo en el temporal del sistema, fuera del Document Root). Con el honeypot relleno responde 200 sin enviar. Respuestas JSON: 200 si `mail()` acepta, 500 si no. `display_errors=0` para no romper el JSON. Compatible con PHP 7.4 o superior.
- `public/api/.htaccess`: `Cache-Control: no-store` y `Expires` desactivado para `/api/`, sin listado de carpeta y con `.user.ini` denegado. La raíz `public/.htaccess` no se toca.
- `public/api/.user.ini`: `upload_max_filesize=11M` y `post_max_size=12M`. Muchos hostings traen 2 MB por defecto, lo que rechazaría adjuntos válidos.
- `src/core/forms.ts`: constante única `FORM_ENDPOINT = '/api/send.php'`, más `FORM_KIND_FIELD`, `FormKind` y `HONEYPOT_FIELD`.
- `src/shared/ui/InputHoneypot.svelte`: campo trampa (`sr-only`, `aria-hidden`, `tabindex=-1`, `autocomplete=off`, `bind:value`).

Modificados
- `src/content/site.ts`: `quote.endpoint` y `advice.endpoint` pasan a valer `FORM_ENDPOINT`.
- `src/core/site.ts`: `endpoint` es ahora un `string` obligatorio. JSDoc de `QuoteStatus.unavailable`: solo se ve con `?…-simulada`.
- `src/layout/dialog/dialog-form.ts`: `submitFormData(body, { endpoint, form, honeypot, simulate })` añade `form` y el honeypot. Se quita la rama «sin endpoint → unavailable».
- `src/layout/quote/quote-form.ts`: `submitQuote(…, honeypot, simulate)`. Las listas se envían como `services[]` / `goals[]` para que PHP las lea como array; con la clave repetida solo llegaba el último valor.
- `src/layout/advice/advice-form.ts`: `submitAdvice(values, endpoint, honeypot, simulate)`.
- `src/layout/quote/QuoteDialog.svelte`, `src/layout/advice/AdviceDialog.svelte`: añaden `InputHoneypot` y actualizan la cabecera.
- `src/modules/contact/form.ts`: `submitContact(values, endpoint, honeypot)` envía JSON con `form: 'contact'` y el honeypot. `SubmitResult` queda en `'sent' | 'error'`.
- `src/modules/contact/ContactForm.svelte`: añade `InputHoneypot`, `endpoint` pasa a ser obligatorio y se añade comentario de cabecera.
- `src/modules/contact/Section.astro`: pasa `FORM_ENDPOINT`.
- `src/modules/contact/schema.ts` y `src/content/data/pages/home.json`: se quitan `content.endpoint` y `status.unavailable`, que ya eran inalcanzables. El destino ya no es contenido.
- `src/content/ui-catalog.ts`, `src/pages/componentes.astro`, `docs/components.md`: alta de `InputHoneypot` en el catálogo.
- `docs/deploy.md`: comprobación de *Email Deliverability* (SPF/DKIM), prueba con `curl` y fila «el envío da error» en problemas habituales.
- `docs/architecture.md`: la línea de formularios apunta a `FORM_ENDPOINT` y `send.php`.
- `design/content-gaps.md`: el hueco n.º 2 y los endpoints de contacto, cotización y asesoría pasan a RESUELTO.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Tokens

Ninguno. `InputHoneypot` solo usa `sr-only`.

## Responsive

No aplica: el campo trampa no es visible. Va con posición absoluta, así que no cuenta como elemento del flex y no altera el `gap` de los formularios.

## Decisiones y desviaciones

- `site.quote.endpoint` y `site.advice.endpoint` se mantienen, como pide la acceptance, y valen `FORM_ENDPOINT`. El contacto de la home lo recibe por prop desde `Section.astro`: deja de ser un dato del JSON del CMS.
- El estado `'unavailable'` sigue existiendo en los modales solo para `?cotizacion-simulada` / `?asesoria-simulada`. En producción no se puede alcanzar.
- `diagnostic` ya está configurado en `send.php` con los campos del PDF (`nombre`, `email`, `resultado`, `puntajes`, `etapa`, `inicio`, `inversion`, `califica`, `respuestas`). Las estructuras anidadas se muestran como líneas «clave: valor». Si LINKS-DIAGNOSTIC cambia de nombres, se ajusta `FORMS['diagnostic']`.
- El correo muestra los valores de opción tal cual (`branding`, `1000-3000`, `proyecto-en-marcha`). Son legibles, y enviar las etiquetas exigiría duplicar el contenido en PHP.
- Origin/Referer: solo se aceptan bysensei.com y www. Una vista previa en un subdominio temporal de cPanel recibiría 403.

## Prueba local de send.php (`php -S`, PHP 8.4)

- GET → 405. Origin ajeno → 403. `form` desconocido → 400. Content-Type text/plain → 415.
- Honeypot relleno → 200 sin envío. Email inválido → 422. CR/LF en el nombre → se convierte en espacio (sin inyección). CR/LF en el email → 422.
- Adjunto .txt → 422 `type:attachment`. 11 MB → 413.
- El límite por IP da 429 al 4.º intento tras los 3 envíos válidos previos del mismo minuto (5 cada 10 min).
- Con `mail()` simulado: los tres correos (contacto, cotización con PDF adjunto y nombre UTF-8 en `filename*`, diagnóstico) salen con From, Reply-To, asunto y cuerpo correctos.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, `astro check` y `astro build` en OK. `dist/api/` contiene `send.php`, `.htaccess` y `.user.ini`. `bysenseistudio@gmail.com` solo aparece en `public/api/send.php` y `dist/api/send.php`, nunca en `src/` ni en el HTML.

## Vuelta 2 (correcciones de verify_MAIL-ENDPOINT.md)

Bloqueante
- `public/api/send.php`: `contact.company` pasa a ser opcional (`false`), igual que `home.json`. Los obligatorios de quote y advice ya coincidían con el cliente. Prueba con `php -S`: `company: ""` ya no da `422 required:company` y llega hasta `mail()` (500 en local porque no hay MTA).

Menores
- `public/api/send.php`: `rate_limit_ok()` pasa a ser `rate_limit($ip, $record)`. Antes de enviar solo comprueba; el envío se anota después de que `mail()` devuelva true. Un `mail_failed` ya no gasta intentos: 7 envíos fallidos seguidos dan 500, nunca 429. Si el temporal no se puede escribir (`open_basedir`), lo registra con `error_log()`.
- `src/core/forms.ts`: nuevo `FIELD_MAX_LENGTH` (name 120, company 160, email 254, whatsapp 40, max 40, text 5000), que replica `FORMS` de send.php.
- `maxlength` nativo en `src/modules/contact/ContactInputField.svelte`, `ContactMessageField.svelte`, `src/layout/quote/QuoteContactField.svelte`, `QuoteIdea.svelte`, `QuoteBudgetMax.svelte`, `src/layout/advice/AdviceContactField.svelte` y `AdviceMessage.svelte`.

Tokens: ninguno. Responsive: sin cambios visuales.

init.ps1 (vuelta 2): VERDE. Pasan toolchain, dependencias, estado, sistema de diseño, arquitectura, `astro check` y `astro build` (código 0). `php -l send.php` no da errores.
