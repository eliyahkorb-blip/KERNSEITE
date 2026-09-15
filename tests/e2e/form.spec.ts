import { test, expect } from '@playwright/test';

test.describe('Kontaktformular', () => {
  test('leeres Absenden zeigt Validierungsfehler und blockiert', async ({ page }) => {
    await page.goto('/kontakt/');
    await page.locator('[data-submit]').click();

    // Name wird als ungültig markiert und fokussiert
    const name = page.locator('#cf-name');
    await expect(name).toHaveAttribute('aria-invalid', 'true');

    // Statusmeldung erscheint (Live-Region)
    await expect(page.locator('[data-status]')).toContainText('Bitte prüfe');
  });

  test('ungültige E-Mail wird beanstandet', async ({ page }) => {
    await page.goto('/kontakt/');
    await page.locator('#cf-name').fill('Test Person');
    await page.locator('#cf-email').fill('keine-email');
    await page.locator('#cf-message').fill('Dies ist eine ausreichend lange Nachricht.');
    await page.locator('[data-submit]').click();
    await expect(page.locator('#cf-email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Honeypot-Feld liegt außerhalb des sichtbaren Bereichs', async ({ page }) => {
    await page.goto('/kontakt/');
    // Off-screen-Honeypot: nicht im Viewport und für AT als aria-hidden markiert.
    await expect(page.locator('#cf-website2')).not.toBeInViewport();
    await expect(page.locator('.cform__hp')).toHaveAttribute('aria-hidden', 'true');
  });
});

for (const scenario of [
  {
    name: 'HTML mit Status 200',
    contentType: 'text/html',
    body: '<html>Serverfehler</html>',
    ok: false,
  },
  { name: 'leeres JSON', contentType: 'application/json', body: '{}', ok: false },
  { name: 'bestätigter Versand', contentType: 'application/json', body: '{"ok":true}', ok: true },
]) {
  test(`Formular behandelt ${scenario.name} korrekt`, async ({ page }) => {
    await page.route('**/api/contact.php', (route) =>
      route.fulfill({ status: 200, contentType: scenario.contentType, body: scenario.body }),
    );
    await page.goto('/kontakt/');
    await page.locator('#cf-name').fill('Prüfung');
    await page.locator('#cf-email').fill('test@example.org');
    await page
      .locator('#cf-message')
      .fill('Dies ist eine lokale Formularprüfung ohne echten Versand.');
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-status]')).toHaveAttribute(
      'data-state',
      scenario.ok ? 'ok' : 'error',
    );
    if (!scenario.ok) await expect(page.locator('#cf-message')).not.toHaveValue('');
    await expect(page.locator('[data-submit]')).toBeEnabled();
  });
}
