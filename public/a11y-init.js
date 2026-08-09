/**
 * Wendet die gespeicherten Barrierefreiheits-Einstellungen an, bevor die Seite
 * zum ersten Mal gezeichnet wird. Deshalb liegt dieses Skript als externe,
 * blockierende Datei im <head> und nicht im gebündelten Modul-Skript – ein
 * verzögertes Modul liefe erst nach dem ersten Paint und die Seite würde
 * sichtbar umspringen.
 *
 * Externe Datei statt Inline-Script: Die Content Security Policy dieser
 * Website kommt ohne 'unsafe-inline' aus.
 *
 * Gespeichert wird ausschließlich die eigene Darstellungspräferenz –
 * keine personenbezogenen Daten, kein Tracking, kein Cookie.
 */
(function () {
  try {
    var raw = localStorage.getItem('kernseite-accessibility');
    if (!raw) return;
    var s = JSON.parse(raw);
    var root = document.documentElement;
    var sizes = [1, 1.125, 1.25];
    if (sizes.indexOf(Number(s.size)) !== -1) {
      root.style.setProperty('--a11y-scale', String(Number(s.size)));
    }
    if (s.contrast === true) root.dataset.a11yContrast = 'high';
    if (s.motion === true) root.dataset.a11yMotion = 'reduced';
  } catch {
    /* Gesperrter Speicher: Standarddarstellung, keine Fehlermeldung. */
  }
})();
