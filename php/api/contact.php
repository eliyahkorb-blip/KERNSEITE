<?php

declare(strict_types=1);

/**
 * KERNSEITE – Kontakt-Endpunkt.
 *
 * Schutz (Defense-in-Depth, kein behaupteter Token-CSRF):
 * - POST-only
 * - Same-Origin-/Origin-Referer-Prüfung gegen ALLOWED_ORIGIN
 * - Honeypot-Feld
 * - Mindest-Ausfüllzeit
 * - Rate-Limit pro IP
 * - vollständige serverseitige Validierung
 * - sichere Fehlerausgaben, keine PII in Debug-Logs
 */

define('KERNSEITE_APP', true);
require __DIR__ . '/bootstrap.php';

use Kernseite\Contact\Env;
use Kernseite\Contact\Validator;
use Kernseite\Contact\RateLimiter;
use Kernseite\Contact\Mailer;

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

/** @return never */
function respond(bool $ok, string $message, int $code, bool $json): void
{
    http_response_code($code);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        $title = $ok ? 'Danke' : 'Hinweis';
        $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo '<!doctype html><html lang="de"><meta charset="utf-8">'
            . '<meta name="viewport" content="width=device-width, initial-scale=1">'
            . '<title>' . $title . ' – KERNSEITE</title>'
            . '<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1.5rem;color:#111318">'
            . '<h1>' . $title . '</h1><p>' . $safe . '</p>'
            . '<p><a href="/">Zurück zur Startseite</a></p></body></html>';
    }
    exit;
}

// 1. Nur POST
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 'Methode nicht erlaubt.', 405, $wantsJson);
}

// 2. Same-Origin-/Origin-Referer-Prüfung
$allowedOrigin = rtrim((string) Env::get('ALLOWED_ORIGIN', ''), '/');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$originOk = true;
if ($allowedOrigin !== '') {
    if ($origin !== '') {
        $originOk = rtrim($origin, '/') === $allowedOrigin;
    } elseif ($referer !== '') {
        $originOk = str_starts_with($referer, $allowedOrigin);
    } else {
        // Weder Origin noch Referer vorhanden -> abweisen, wenn Origin konfiguriert ist.
        $originOk = false;
    }
}
if (!$originOk) {
    respond(false, 'Die Anfrage konnte nicht bestätigt werden (Herkunft).', 403, $wantsJson);
}

// 3. Honeypot: Bots, die das versteckte Feld ausfüllen, werden still akzeptiert.
if (trim((string) ($_POST['website2'] ?? '')) !== '') {
    respond(true, 'Danke! Deine Anfrage ist eingegangen.', 200, $wantsJson);
}

// 4. Mindest-Ausfüllzeit (Client-Zeitstempel als schwaches Anti-Spam-Signal)
$renderedAt = (int) ($_POST['rendered_at'] ?? 0);
if ($renderedAt > 0) {
    $elapsedMs = (int) round(microtime(true) * 1000) - $renderedAt;
    if ($elapsedMs >= 0 && $elapsedMs < 3000) {
        respond(false, 'Bitte nimm dir einen kurzen Moment mehr Zeit und sende erneut.', 429, $wantsJson);
    }
}

// 5. Rate-Limit pro IP
$rateLimiter = new RateLimiter(
    sys_get_temp_dir() . '/kernseite_ratelimit',
    (int) Env::get('RATE_LIMIT_PER_HOUR', '5'),
);
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!$rateLimiter->allow($ip)) {
    respond(false, 'Zu viele Anfragen. Bitte versuche es etwas später erneut.', 429, $wantsJson);
}

// 6. Serverseitige Validierung
$result = Validator::validate($_POST);
if (!empty($result['errors'])) {
    respond(false, 'Bitte prüfe deine Eingaben und versuche es erneut.', 422, $wantsJson);
}

// 7. Versand
try {
    (new Mailer())->sendContact($result['fields']);
} catch (\Throwable $e) {
    // Keine PII loggen – nur eine technische Meldung.
    error_log('[kernseite-contact] Versand fehlgeschlagen: ' . $e->getMessage());
    respond(
        false,
        'Das Senden ist derzeit nicht möglich. Bitte versuche es später erneut oder schreib uns direkt per E-Mail.',
        500,
        $wantsJson,
    );
}

respond(true, 'Danke! Deine Anfrage ist eingegangen. Wir melden uns so bald wie möglich.', 200, $wantsJson);
