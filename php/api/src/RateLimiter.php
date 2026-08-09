<?php

declare(strict_types=1);

namespace Kernseite\Contact;

if (!defined('KERNSEITE_APP')) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Einfaches dateibasiertes Rate-Limit pro IP (gleitendes Ein-Stunden-Fenster).
 * Speichert nur gehashte IPs und Zeitstempel – keine Klartext-IP, kein Profil.
 */
final class RateLimiter
{
    public function __construct(
        private string $dir,
        private int $maxPerHour,
    ) {
    }

    public function allow(string $ip): bool
    {
        if ($this->maxPerHour <= 0) {
            return true;
        }
        if (!is_dir($this->dir)) {
            @mkdir($this->dir, 0700, true);
        }
        if (!is_dir($this->dir) || !is_writable($this->dir)) {
            // Fail-open, wenn kein Schreibzugriff besteht (Verfügbarkeit vor Perfektion).
            return true;
        }

        $key = hash('sha256', $ip);
        $file = $this->dir . '/' . $key . '.log';
        $now = time();
        $windowStart = $now - 3600;

        $timestamps = [];
        $fh = @fopen($file, 'c+');
        if ($fh === false) {
            return true;
        }
        try {
            flock($fh, LOCK_EX);
            $contents = stream_get_contents($fh) ?: '';
            foreach (explode("\n", trim($contents)) as $line) {
                $ts = (int) $line;
                if ($ts >= $windowStart) {
                    $timestamps[] = $ts;
                }
            }
            if (count($timestamps) >= $this->maxPerHour) {
                return false;
            }
            $timestamps[] = $now;
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, implode("\n", $timestamps) . "\n");
            fflush($fh);
            return true;
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }
}
