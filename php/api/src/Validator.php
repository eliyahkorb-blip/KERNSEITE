<?php

declare(strict_types=1);

namespace Kernseite\Contact;

if (!defined('KERNSEITE_APP')) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Serverseitige Validierung und Bereinigung der Formulardaten.
 */
final class Validator
{
    private const MAX = [
        'name' => 120,
        'company' => 160,
        'email' => 200,
        'phone' => 60,
        'service' => 120,
        'existing_site' => 300,
        'message' => 5000,
        'scope' => 80,
        'budget' => 80,
        'branch' => 80,
        'timing' => 80,
    ];

    /**
     * @param array<string,mixed> $input
     * @return array{fields: array<string,string>, errors: string[]}
     */
    public static function validate(array $input): array
    {
        $errors = [];
        $fields = [];

        foreach (self::MAX as $key => $max) {
            $raw = is_string($input[$key] ?? null) ? $input[$key] : '';
            $clean = trim(strip_tags($raw));
            // Steuerzeichen entfernen (außer Zeilenumbruch/Tab in message)
            $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $clean) ?? $clean;
            if (mb_strlen($clean) > $max) {
                $clean = mb_substr($clean, 0, $max);
            }
            $fields[$key] = $clean;
        }

        if ($fields['name'] === '') {
            $errors[] = 'Name fehlt.';
        }

        if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'E-Mail ungültig.';
        }
        // Header-Injection-Schutz
        if (preg_match('/[\r\n]/', $fields['email'] . $fields['name'])) {
            $errors[] = 'Ungültige Zeichen.';
        }

        if (mb_strlen($fields['message']) < 10) {
            $errors[] = 'Nachricht zu kurz.';
        }

        if ($fields['existing_site'] !== '' && !preg_match('~^[a-z][a-z0-9+.-]*://~i', $fields['existing_site'])) {
            $fields['existing_site'] = 'https://' . $fields['existing_site'];
        }
        if ($fields['existing_site'] !== '' && (!filter_var($fields['existing_site'], FILTER_VALIDATE_URL)
            || !in_array(strtolower((string) parse_url($fields['existing_site'], PHP_URL_SCHEME)), ['http', 'https'], true))) {
            // Nicht blockierend – Feld ist optional; ungültige URL wird verworfen.
            $fields['existing_site'] = '';
        }

        return ['fields' => $fields, 'errors' => $errors];
    }
}
