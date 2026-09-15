<?php

declare(strict_types=1);
define('KERNSEITE_APP', true);
require __DIR__ . '/../api/src/Validator.php';

use Kernseite\Contact\Validator;

function check(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: $message\n");
        exit(1);
    }
}

$valid = ['name' => 'Testbetrieb', 'email' => 'kontakt@example.org', 'message' => 'Wir planen eine neue Unternehmenswebsite.'];
$result = Validator::validate($valid);
check($result['errors'] === [], 'Gültige Minimalanfrage akzeptieren');
check(count(Validator::validate([])['errors']) === 3, 'Pflichtfelder serverseitig prüfen');
foreach (['javascript:alert(1)', 'data:text/html,test', 'ftp://example.org', 'https://'] as $url) {
    $result = Validator::validate($valid + ['existing_site' => $url]);
    check($result['fields']['existing_site'] === '', 'Unsichere/ungültige optionale URL verwerfen: ' . $url);
}
$result = Validator::validate($valid + ['existing_site' => 'example.org/leistungen', 'budget' => '1.500–3.600 Euro']);
check($result['fields']['existing_site'] === 'https://example.org/leistungen', 'Domain ohne Schema normalisieren');
check($result['fields']['budget'] === '1.500–3.600 Euro', 'Budget vollständig übernehmen');
foreach (['name', 'email'] as $field) {
    $input = $valid;
    $input[$field] .= "\r\nBcc: fremd@example.org";
    check(Validator::validate($input)['errors'] !== [], 'Header-Injection abweisen');
}
$input = $valid;
$input['name'] = ['unerwartet'];
check(Validator::validate($input)['errors'] !== [], 'Array statt Name abweisen');
$result = Validator::validate($valid + ['budget' => str_repeat('ä', 100)]);
check(mb_strlen($result['fields']['budget']) === 80, 'Überlange Eingabe begrenzen');
echo "OK: Formularvalidierung, optionale URLs, Budget und Header-Injection\n";
