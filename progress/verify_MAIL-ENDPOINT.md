# Verify MAIL-ENDPOINT — vuelta 2
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- `public/api/send.php:444` + `451`: el límite por IP comprueba antes de `mail()` y anota después,
  así que dos peticiones simultáneas pueden pasar las dos el último hueco (carrera entre
  comprobación y registro). Con 5 envíos cada 10 minutos esto no tiene impacto práctico. Lo dejo
  anotado, no hace falta cambiarlo.

## Hallazgos de la vuelta 1

- [Bloqueante] Empresa obligatoria en el servidor: **RESUELTO**. `send.php:66` → `'company' =>
  ['Empresa', 'line', 160, false]`. Comprobado con `php -S`: `company: ""` llega hasta `mail()`
  (500 `mail_failed` en local porque no hay MTA) y ya no da `422 required:company`.
- [Menor] Un fallo de `mail()` gastaba intentos: **RESUELTO**. `rate_limit($ip, false)` comprueba
  antes del envío y `rate_limit($ip, true)` anota solo si el envío sale bien (`send.php:444,450-451`).
  Comprobado: 7 envíos fallidos seguidos dan 500 las 7 veces y ningún 429.
- [Menor] Faltaba `maxlength` en el cliente: **RESUELTO**. `FIELD_MAX_LENGTH` en `src/core/forms.ts`
  replica los límites de `FORMS` (name 120, company 160, email 254, whatsapp 40, max 40, text 5000)
  y se aplica en los 7 campos de contacto, cotización y asesoría.
- [Menor] El temporal no escribible pasaba sin aviso: **RESUELTO**. `error_log()` en `send.php:212`.

## Verificado sin hallazgos

- **V1** `./init.ps1`: VERDE (código 0). `php -l` sin errores.
- La acceptance se revisó entera otra vez:
  - un único script para JSON y multipart
  - el campo `form` define los campos y el asunto
  - el destinatario solo está en `public/api/send.php` (y en su copia `dist/api/send.php`), no en
    `src/`, `docs/`, `design/`, `scripts/` ni en el HTML o JS generado
  - From del propio dominio con `-f`
  - Reply-To validado
  - todas las cabeceras pasan por `header_text()` y RFC 2047
  - cuerpo UTF-8 en base64
  - adjunto `multipart/mixed` de 10 MB como máximo, PDF o `image/*` según finfo
  - solo acepta POST (405 comprobado)
  - Origin/Referer limitado a bysensei.com y www, o ausente
  - honeypot
  - límites por campo y límite por IP
  - JSON con 2xx/4xx/5xx
  - la constante única `FORM_ENDPOINT`
  - `/api/.htaccess` con `no-store`
  - `public/.htaccess` sin cambios
  - `docs/deploy.md` con SPF/DKIM y `curl`
  - sin dependencias nuevas
- **V2/V3/V4**: no aplican. El único cambio en la UI es `InputHoneypot` (invisible) más el atributo
  `maxlength`, que no altera el layout.
- **V5–V7**:
  - sin `any`, hex ni `ds-allow` nuevos
  - los `client:load` y el `ds-allow` existentes (`BaseLayout`, `Header`, `site.ts`) son anteriores a
    esta feature
  - `FIELD_MAX_LENGTH` se importa de `core`, que es la capa permitida, sin imports entre módulos
  - el honeypot queda fuera del árbol accesible y del orden de tabulación
