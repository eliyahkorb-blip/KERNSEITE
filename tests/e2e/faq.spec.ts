import { test, expect } from '@playwright/test';

test('FAQ-Accordion öffnet und schließt', async ({ page }) => {
  await page.goto('/faq/');
  const items = page.locator('.faq__item');
  await expect(items.first()).toBeVisible();

  // Ein geschlossenes Element finden und öffnen
  const second = items.nth(1);
  await expect(second).not.toHaveAttribute('open', /.*/);
  await second.locator('summary').click();
  await expect(second).toHaveAttribute('open', '');

  // Wieder schließen
  await second.locator('summary').click();
  await expect(second).not.toHaveAttribute('open', /.*/);
});
