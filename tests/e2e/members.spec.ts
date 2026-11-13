import { expect, test } from '@playwright/test';

test.describe('members', () => {
  test('lists, filters and invites members', async ({ page }) => {
    await page.goto('/en/members');

    await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible();
    await expect(page.getByText('42 items')).toBeVisible();

    await page.getByRole('searchbox').fill('grace');
    await expect(page).toHaveURL(/search=grace/);
    await expect(page.getByRole('row').nth(1)).toContainText('Grace');

    await page.getByRole('button', { name: 'Invite member' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Name').fill('Playwright User');
    await dialog.getByLabel('Email').fill('playwright.user@example.com');
    await dialog.getByRole('button', { name: 'Send invite' }).click();

    await expect(page.getByText('Invitation sent')).toBeVisible();
  });

  test('keeps table state in the URL after a reload', async ({ page }) => {
    await page.goto('/en/members?role=owner');
    await expect(page.getByText('1 item')).toBeVisible();

    await page.reload();
    await expect(page.getByText('1 item')).toBeVisible();
  });
});
