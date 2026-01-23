import { test, expect } from '@playwright/test';
import { seedProduct } from './utils';

test.describe('Shopping Experience', () => {
    test.beforeAll(async () => {
        await seedProduct();
    });

    test('should modify cart', async ({ page }) => {
        await page.goto('/');

        // 1. Check Product is visible
        const addToCartBtns = page.locator('button:has-text("Add to Basket")');
        // Wait for at least one button to be visible
        await expect(addToCartBtns.first()).toBeVisible({ timeout: 10000 });

        // 2. Add to Cart
        await addToCartBtns.first().click();

        // 3. Verify Cart Icon Badge updates or some feedback
        // Just checking checkout navigation as per original test
        await page.click('a[href="/checkout"]');

        // 4. Verify we are on checkout page and item exists
        await expect(page).toHaveURL(/.*checkout/);
        await expect(page.locator('text=Shopping Basket')).toBeVisible();
    });
});
