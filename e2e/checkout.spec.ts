import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TrueLine/);
});

test('can navigate to product', async ({ page }) => {
    await page.goto('/');
    // Assuming there's a visible product link or we go directly
    // This is a placeholder smoke test
    await expect(page.locator('header')).toBeVisible();
});
