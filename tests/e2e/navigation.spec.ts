import { expect, test } from '@playwright/test';

test('redirects to the default locale and navigates with the sidebar', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);

  await page.getByRole('link', { name: 'Open the app' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Members' }).first().click();
  await expect(page).toHaveURL(/\/en\/members/);
});

// The suite runs with mocks enabled, where the app renders in the browser after the mock worker
// starts, so the HTTP status is 200 here. Without mocks the same path returns 404.
test('shows the localized not-found page for unknown paths', async ({ page }) => {
  await page.goto('/en/this-page-does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
