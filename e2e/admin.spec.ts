import { test, expect } from '@playwright/test';
import { supabaseAdmin, makeUserAdmin, deleteTestUser, seedUser } from './utils';

test.describe('Admin Security', () => {
    test('guest viewing admin should redirect to login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*login/);
    });

    test('admin user can access dashboard', async ({ page }) => {
        test.setTimeout(60000);

        const email = `test.admin.${Date.now()}@example.com`;
        const password = 'Password@123';

        // 1. Seed User & Make Admin
        const user = await seedUser(email, password);
        await makeUserAdmin(user.id);

        // 2. Login
        await page.goto('/login');
        await page.fill('input[placeholder="Enter your email"]', email);
        await page.fill('input[placeholder="Enter your password"]', password);

        // Wait for button and click
        const loginBtn = page.locator('button:has-text("Log In")');
        await expect(loginBtn).toBeVisible();
        await loginBtn.click();

        // 3. Verify Login Success
        await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 15000 });

        await page.goto('/admin');
        // Wait for dashboard content
        await expect(page.locator('text=Total Sales')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('h1')).toContainText('Dashboard');

        // Cleanup
        await deleteTestUser(email);
    });
});
