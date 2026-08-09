<?php

declare(strict_types=1);

/**
 * Bootstrap für den Kontakt-Endpunkt: lädt den Composer-Autoloader und die .env.
 * Muss über contact.php eingebunden werden (KERNSEITE_APP definiert).
 */
if (!defined('KERNSEITE_APP')) {
    http_response_code(403);
    exit('Forbidden');
}

$autoload = __DIR__ . '/vendor/autoload.php';
if (!is_readable($autoload)) {
    http_response_code(500);
    error_log('[kernseite-contact] Composer-Autoloader fehlt. `composer install --no-dev` ausgeführt?');
    exit('Server misconfigured');
}
require $autoload;

use Kernseite\Contact\Env;

/**
 * .env-Kandidaten in Prioritätsreihenfolge.
 * Bevorzugt liegt die .env OBERHALB des Webroots und ist damit nicht öffentlich erreichbar.
 */
$candidates = array_filter([
    getenv('KERNSEITE_ENV_PATH') ?: null,
    __DIR__ . '/../../kernseite.env', // z. B. /home/USER/kernseite.env (oberhalb public_html)
    __DIR__ . '/../../.env',
    __DIR__ . '/../.env',             // oberhalb von /api (im Webroot – per .htaccess geschützt)
    __DIR__ . '/.env',                // in /api (Fallback – per .htaccess geschützt)
]);

foreach ($candidates as $path) {
    if (is_string($path) && is_readable($path)) {
        Env::load($path);
        break;
    }
}
