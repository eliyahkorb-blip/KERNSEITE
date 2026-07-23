<?php

declare(strict_types=1);

namespace Kernseite\Contact;

if (!defined('KERNSEITE_APP')) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Minimaler .env-Loader (nur Key=Value). Setzt Werte ausschließlich, wenn sie nicht
 * bereits über die echte Serverumgebung gesetzt sind. Es werden KEINE Zugangsdaten
 * im Repository gehalten – die .env liegt auf dem Server oberhalb des Webroots.
 */
final class Env
{
    public static function load(string $path): void
    {
        if (!is_readable($path)) {
            return;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            $parts = explode('=', $line, 2);
            if (count($parts) !== 2) {
                continue;
            }
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            // Umschließende Anführungszeichen entfernen
            $value = preg_replace('/^([\'"])(.*)\1$/', '$2', $value) ?? $value;
            if ($key !== '' && getenv($key) === false) {
                putenv($key . '=' . $value);
                $_ENV[$key] = $value;
            }
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        return $value === false ? $default : $value;
    }
}
