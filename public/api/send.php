<?php
/**
 * Sensei Studio · envío de formularios (MAIL-ENDPOINT).
 *
 * Único destino de todos los formularios del sitio (src/core/forms.ts → FORM_ENDPOINT). Astro lo
 * copia de public/ a dist/api/ y scripts/deploy.sh lo publica con el resto; Apache + PHP de cPanel
 * lo ejecutan. `astro dev` no ejecuta PHP.
 *
 * Entrada: POST JSON (contacto, diagnóstico) o multipart/form-data (cotización con adjunto,
 * asesoría). El campo `form` (contact | quote | advice | diagnostic) elige los campos aceptados y
 * el asunto. Los campos desconocidos se ignoran.
 *
 * Salida: JSON. 200 si mail() acepta el mensaje; 4xx si la petición no vale (405 método, 403
 * origen, 413 tamaño, 415 tipo, 400/422 datos, 429 límite por IP); 500 si mail() falla.
 * El honeypot con valor responde 200 sin enviar nada (el bot no aprende que se le descartó).
 *
 * Compatible con PHP 7.4+ (sin dependencias; usa mbstring y fileinfo si existen).
 *
 * El correo destino vive SOLO aquí: nunca en src/ ni en el HTML. From es una dirección del propio
 * dominio (SPF/DKIM) y Reply-To el correo de la persona, validado. Todo lo que entra en una
 * cabecera pasa por header_text() (sin CR/LF: sin inyección de cabeceras).
 */

declare(strict_types=1);

// Un aviso de PHP impreso en la respuesta rompería el JSON: los errores van solo al log.
ini_set('display_errors', '0');

const MAIL_TO = 'bysenseistudio@gmail.com';
const MAIL_FROM = 'no-reply@bysensei.com';
const MAIL_FROM_NAME = 'Sensei Studio · Web';
const SUBJECT_PREFIX = '[bysensei.com]';

/** Hosts permitidos en Origin/Referer (si la cabecera falta, se acepta). */
const ALLOWED_HOSTS = ['bysensei.com', 'www.bysensei.com'];

/** Campo trampa (src/core/forms.ts → HONEYPOT_FIELD). */
const HONEYPOT_FIELD = 'website';

/** Límite simple por IP: RATE_MAX envíos válidos cada RATE_WINDOW segundos. */
const RATE_MAX = 5;
const RATE_WINDOW = 600;

/** Cuerpo JSON máximo (los formularios JSON no llevan archivos). */
const JSON_MAX_BYTES = 65536;

/** Adjunto de la cotización: mismo límite y tipos que site.quote.attachment (`.pdf,image/*`, 10 MB). */
const ATTACHMENT_FIELD = 'attachment';
const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

/** Lista: hasta 20 valores de hasta 100 caracteres. Datos: estructura JSON anidada (diagnóstico). */
const LIST_MAX_ITEMS = 20;
const LIST_ITEM_MAX = 100;
const DATA_MAX_CHARS = 8000;

/**
 * Formularios aceptados. Cada campo: [etiqueta en el correo, tipo, longitud máxima, obligatorio].
 * Tipos: 'line' (una línea), 'text' (varias líneas), 'email', 'list' (varios valores), 'data'
 * (estructura anidada: objetos, listas, números o booleanos).
 */
const FORMS = [
    'contact' => [
        'subject' => 'Contacto',
        'fields' => [
            'name' => ['Nombre', 'line', 120, true],
            'company' => ['Empresa', 'line', 160, false],
            'email' => ['Email', 'email', 254, true],
            'message' => ['Mensaje', 'text', 5000, true],
        ],
    ],
    'quote' => [
        'subject' => 'Cotización',
        'attachment' => true,
        'fields' => [
            'name' => ['Nombre', 'line', 120, true],
            'email' => ['Email', 'email', 254, true],
            'whatsapp' => ['WhatsApp', 'line', 40, false],
            'services' => ['Servicios', 'list', 0, true],
            'budgetMode' => ['Tipo de presupuesto', 'line', 20, false],
            'currency' => ['Moneda', 'line', 10, false],
            'range' => ['Rango de presupuesto', 'line', 60, false],
            'max' => ['Presupuesto máximo', 'line', 40, false],
            'idea' => ['Idea', 'text', 5000, true],
            'goals' => ['Objetivos', 'list', 0, false],
        ],
    ],
    'advice' => [
        'subject' => 'Asesoría',
        'fields' => [
            'name' => ['Nombre', 'line', 120, true],
            'email' => ['Email', 'email', 254, true],
            'stage' => ['Punto de partida', 'line', 60, false],
            'message' => ['Qué quiere resolver', 'text', 5000, false],
        ],
    ],
    // /links (LINKS-DIAGNOSTIC): campos del PDF de especificación.
    'diagnostic' => [
        'subject' => 'Diagnóstico',
        'fields' => [
            'nombre' => ['Nombre', 'line', 120, true],
            'email' => ['Email', 'email', 254, true],
            'resultado' => ['Resultado', 'line', 200, false],
            'puntajes' => ['Puntajes', 'data', DATA_MAX_CHARS, false],
            'etapa' => ['Etapa', 'line', 120, false],
            'inicio' => ['Inicio', 'line', 120, false],
            'inversion' => ['Inversión', 'line', 120, false],
            'califica' => ['Califica', 'data', 20, false],
            'respuestas' => ['Respuestas', 'data', DATA_MAX_CHARS, false],
        ],
    ],
];

// --- Respuesta ----------------------------------------------------------------------------

function respond(int $status, array $body)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $error)
{
    respond($status, ['ok' => false, 'error' => $error]);
}

// --- Texto --------------------------------------------------------------------------------

function str_len(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : (int) preg_match_all('/./us', $value);
}

function str_cut(string $value, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : (string) preg_replace('/^(.{0,' . $max . '}).*$/us', '$1', $value);
}

/** Texto limpio: UTF-8 válido, sin caracteres de control; `$multiline` conserva saltos (\n). */
function clean_text(string $value, bool $multiline): ?string
{
    if (preg_match('//u', $value) !== 1) return null;
    $value = str_replace(["\r\n", "\r", "\t"], ["\n", "\n", ' '], $value);
    $value = $multiline
        ? (string) preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $value)
        : (string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return trim($value);
}

function starts_with(string $value, string $prefix): bool
{
    return strncmp($value, $prefix, strlen($prefix)) === 0;
}

function is_list_array(array $value): bool
{
    return $value === [] || array_keys($value) === range(0, count($value) - 1);
}

/** Valor apto para una cabecera: una línea, sin CR/LF ni controles. */
function header_text(string $value, int $max = 160): string
{
    $value = (string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return trim(str_cut($value, $max));
}

/** Codificación RFC 2047 para texto no ASCII en cabeceras. */
function encode_header(string $value): string
{
    return preg_match('/^[\x20-\x7E]*$/', $value) === 1 ? $value : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/** Nombre visible en From/Reply-To: entre comillas si es ASCII; si no, codificado. */
function display_name(string $name): string
{
    $name = header_text($name, 80);
    if (preg_match('/^[\x20-\x7E]*$/', $name) === 1) return '"' . addcslashes($name, '"\\') . '"';
    return encode_header($name);
}

// --- Petición -----------------------------------------------------------------------------

function host_allowed(string $url): bool
{
    $host = parse_url($url, PHP_URL_HOST);
    return is_string($host) && in_array(strtolower($host), ALLOWED_HOSTS, true);
}

function client_ip(): string
{
    // REMOTE_ADDR: las cabeceras X-Forwarded-For las escribe el cliente y no son de fiar aquí.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

/**
 * Límite por IP con un archivo por IP (hash) en el temporal del sistema, fuera del Document Root.
 * Con $record = false solo comprueba (antes de enviar); con true anota un envío (tras `mail()` OK),
 * así un fallo del MTA no gasta intentos. Devuelve false si se superó. Si el temporal no es
 * escribible (p. ej. `open_basedir`), no bloquea y lo registra en el log de errores.
 */
function rate_limit(string $ip, bool $record): bool
{
    $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sensei-send-rate';
    $handle = false;
    if (is_dir($dir) || @mkdir($dir, 0700, true) || is_dir($dir)) {
        $handle = @fopen($dir . DIRECTORY_SEPARATOR . hash('sha256', $ip), 'c+');
    }
    if ($handle === false) {
        error_log('send.php: límite por IP desactivado, no se puede escribir en ' . $dir);
        return true;
    }
    flock($handle, LOCK_EX);
    $now = time();
    $stamps = json_decode((string) stream_get_contents($handle), true);
    $stamps = array_values(array_filter(is_array($stamps) ? $stamps : [], fn ($t) => is_int($t) && $t > $now - RATE_WINDOW));
    $ok = count($stamps) < RATE_MAX;
    if ($ok && $record) $stamps[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($stamps));
    flock($handle, LOCK_UN);
    fclose($handle);
    return $ok;
}

/** Cuerpo de la petición como array (JSON o multipart / urlencoded). */
function read_input(): array
{
    $type = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);

    if (starts_with($type, 'application/json')) {
        if ($length > JSON_MAX_BYTES) fail(413, 'too_large');
        $raw = (string) file_get_contents('php://input', false, null, 0, JSON_MAX_BYTES + 1);
        if (strlen($raw) > JSON_MAX_BYTES) fail(413, 'too_large');
        $data = json_decode($raw, true, 8);
        if (!is_array($data)) fail(400, 'invalid_json');
        return $data;
    }

    if (starts_with($type, 'multipart/form-data') || starts_with($type, 'application/x-www-form-urlencoded')) {
        // Por encima de post_max_size PHP descarta $_POST y $_FILES sin avisar.
        if ($length > 0 && $_POST === [] && $_FILES === []) fail(413, 'too_large');
        return $_POST;
    }

    fail(415, 'unsupported_type');
    return [];
}

// --- Campos -------------------------------------------------------------------------------

/**
 * Una estructura anidada (diagnóstico) como líneas legibles "clave: valor".
 * @param mixed $value Estructura decodificada del JSON.
 */
function format_data($value, string $indent = ''): ?string
{
    if (is_bool($value)) return $value ? 'Sí' : 'No';
    if (is_int($value) || is_float($value)) return (string) $value;
    if (is_string($value)) return clean_text($value, false);
    if ($value === null) return '';
    if (!is_array($value)) return null;
    $lines = [];
    $isList = is_list_array($value);
    foreach ($value as $key => $item) {
        $text = format_data($item, $indent . '  ');
        if ($text === null) return null;
        $label = $isList ? '-' : (clean_text((string) $key, false) ?? '') . ':';
        $lines[] = is_array($item) && $item !== [] ? $indent . $label . "\n" . $text : $indent . $label . ' ' . $text;
    }
    return implode("\n", $lines);
}

/**
 * Valida y normaliza los campos de un formulario. Devuelve [valores, error]: valores es
 * campo => texto listo para el correo (vacío si no llegó).
 */
function collect_fields(array $input, array $fields): array
{
    $values = [];
    foreach ($fields as $name => [$label, $type, $max, $required]) {
        $raw = $input[$name] ?? null;

        if ($type === 'list') {
            $items = is_array($raw) ? $raw : ($raw === null || $raw === '' ? [] : [$raw]);
            if (count($items) > LIST_MAX_ITEMS) return [null, "too_long:$name"];
            $clean = [];
            foreach ($items as $item) {
                if (!is_string($item)) return [null, "invalid:$name"];
                $text = clean_text($item, false);
                if ($text === null) return [null, "invalid:$name"];
                if (str_len($text) > LIST_ITEM_MAX) return [null, "too_long:$name"];
                if ($text !== '') $clean[] = $text;
            }
            $value = implode(', ', $clean);
        } elseif ($type === 'data') {
            $value = $raw === null ? '' : format_data($raw);
            if ($value === null) return [null, "invalid:$name"];
            if (str_len($value) > $max) return [null, "too_long:$name"];
        } else {
            if ($raw !== null && !is_string($raw) && !is_int($raw) && !is_float($raw)) return [null, "invalid:$name"];
            $value = clean_text((string) ($raw ?? ''), $type === 'text');
            if ($value === null) return [null, "invalid:$name"];
            if (str_len($value) > $max) return [null, "too_long:$name"];
            if ($type === 'email' && $value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) === false) return [null, "invalid:$name"];
        }

        if ($required && $value === '') return [null, "required:$name"];
        $values[$name] = $value;
    }
    return [$values, null];
}

/**
 * Adjunto opcional de la cotización. Devuelve [adjunto|null, error|null]; adjunto =
 * ['name' => …, 'type' => …, 'data' => …].
 */
function collect_attachment(): array
{
    $file = $_FILES[ATTACHMENT_FIELD] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return [null, null];
    if (is_array($file['error'])) return [null, 'invalid:attachment'];
    if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) return [null, 'too_large:attachment'];
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) return [null, 'invalid:attachment'];
    if ($file['size'] > ATTACHMENT_MAX_BYTES) return [null, 'too_large:attachment'];

    // Tipo real del contenido (no el que declara el navegador): PDF o imagen, como `accept`.
    $type = 'application/octet-stream';
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = (string) finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
    } elseif (function_exists('mime_content_type')) {
        $type = (string) mime_content_type($file['tmp_name']);
    }
    if ($type !== 'application/pdf' && !starts_with($type, 'image/')) return [null, 'type:attachment'];

    $raw = basename(str_replace('\\', '/', (string) $file['name']));
    // Nombre en otra codificación que UTF-8: se conserva su parte ASCII (y la extensión).
    $name = clean_text($raw, false) ?? (string) preg_replace('/[^\x20-\x7E]/', '_', $raw);
    $name = header_text(str_replace(['"', '\\', '/'], '', $name), 120);
    if ($name === '') $name = 'adjunto';

    $data = file_get_contents($file['tmp_name']);
    if ($data === false) return [null, 'invalid:attachment'];
    return [['name' => $name, 'type' => $type, 'data' => $data], null];
}

// --- Correo -------------------------------------------------------------------------------

function mail_body(string $title, array $fields, array $values, ?array $attachment): string
{
    $lines = [$title, str_repeat('=', str_len($title)), ''];
    foreach ($fields as $name => [$label]) {
        $value = $values[$name] ?? '';
        if ($value === '') continue;
        $lines[] = strpos($value, "\n") !== false ?"$label:\n$value\n" : "$label: $value";
    }
    if ($attachment) $lines[] = 'Adjunto: ' . $attachment['name'];
    $lines[] = '';
    $lines[] = '--';
    $lines[] = 'Enviado desde ' . header_text((string) ($_SERVER['HTTP_REFERER'] ?? 'bysensei.com'), 200);
    $lines[] = gmdate('Y-m-d H:i') . ' UTC · IP ' . header_text(client_ip(), 64);
    return implode("\r\n", str_replace("\n", "\r\n", $lines));
}

/** Envía el correo con mail(). Devuelve true si el MTA lo acepta. */
function send_mail(string $subject, string $body, string $replyEmail, string $replyName, ?array $attachment): bool
{
    $headers = [
        'From: ' . display_name(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>',
        'Reply-To: ' . ($replyName !== '' ? display_name($replyName) . ' ' : '') . '<' . header_text($replyEmail, 254) . '>',
        'MIME-Version: 1.0',
        'X-Mailer: bysensei.com',
    ];
    $text = chunk_split(base64_encode($body), 76, "\r\n");

    if ($attachment === null) {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $message = $text;
    } else {
        $boundary = 'sensei-' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
        $filename = $attachment['name'];
        $asciiName = (string) preg_replace('/[^\x20-\x7E]/u', '_', $filename);
        $message = implode("\r\n", [
            "--$boundary",
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            $text,
            "--$boundary",
            'Content-Type: ' . header_text($attachment['type'], 100) . '; name="' . $asciiName . '"',
            'Content-Transfer-Encoding: base64',
            'Content-Disposition: attachment; filename="' . $asciiName . '"; filename*=UTF-8\'\'' . rawurlencode($filename),
            '',
            chunk_split(base64_encode($attachment['data']), 76, "\r\n"),
            "--$boundary--",
            '',
        ]);
    }

    // -f: remitente del sobre en el propio dominio (SPF alineado con From).
    return mail(MAIL_TO, encode_header($subject), $message, implode("\r\n", $headers), '-f' . MAIL_FROM);
}

// --- Flujo --------------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'method_not_allowed');
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
$referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
if (($origin !== '' && !host_allowed($origin)) || ($origin === '' && $referer !== '' && !host_allowed($referer))) {
    fail(403, 'forbidden_origin');
}

$input = read_input();

$kind = $input['form'] ?? null;
if (!is_string($kind) || !isset(FORMS[$kind])) fail(400, 'unknown_form');
$form = FORMS[$kind];

$trap = $input[HONEYPOT_FIELD] ?? '';
if (!is_string($trap) || trim($trap) !== '') respond(200, ['ok' => true]);

[$values, $error] = collect_fields($input, $form['fields']);
if ($error !== null) fail(422, $error);

$attachment = null;
if (!empty($form['attachment'])) {
    [$attachment, $error] = collect_attachment();
    if ($error !== null) fail(starts_with($error, 'too_large') ? 413 : 422, $error);
}

$ip = client_ip();
if (!rate_limit($ip, false)) fail(429, 'rate_limited');

$name = $values['name'] ?? $values['nombre'] ?? '';
$subject = SUBJECT_PREFIX . ' ' . $form['subject'] . ($name !== '' ? ' · ' . header_text($name, 80) : '');
$body = mail_body($form['subject'] . ' desde la web', $form['fields'], $values, $attachment);

if (!send_mail(header_text($subject, 200), $body, $values['email'], $name, $attachment)) fail(500, 'mail_failed');
rate_limit($ip, true);

respond(200, ['ok' => true]);
