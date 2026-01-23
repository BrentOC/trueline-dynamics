import { test, expect } from '@playwright/test';
import { supabaseAdmin, seedOrder, deleteTestUser, seedUser } from './utils';

test.describe('Account Management', () => {
    test('guest viewing account should redirect to login', async ({ page }) => {
        await page.goto('/account');
        await expect(page).toHaveURL(/.*login/);
    });

    test('logged in user should see order history', async ({ page }) => {
        // Increase timeout for this test as it involves multiple steps and network calls
        test.setTimeout(60000);

        const email = `test.order.${Date.now()}@example.com`;
        const password = 'Password@123';

        // 1. Seed User & Order
        const user = await seedUser(email, password);
        await seedOrder(user.id, email);

        // 2. Login
        await page.goto('/login');
        await page.fill('input[placeholder="Enter your email"]', email);
        await page.fill('input[placeholder="Enter your password"]', password);

        // Wait for button and click
        const loginBtn = page.locator('button:has-text("Log In")');
        await expect(loginBtn).toBeVisible();
        await loginBtn.click();

        // 3. Verify Login Success (Header changes)
        // AuthButton shows "Sign Out" when logged in
        await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 15000 });

        // 4. Navigate to Orders
        await page.goto('/account/orders');

        // 5. Verify Order
        await expect(page.locator('h1')).toContainText('Order History');

        // Debug: Check for empty state
        const emptyState = page.locator('text=No orders found');
        if (await emptyState.isVisible()) {
            console.error("TEST FAILURE: No orders found message is visible.");

            // Verify if order exists via Admin (bypass RLS)
            const { data: adminOrders } = await supabaseAdmin.from('orders').select('*').eq('user_id', user.id);
            console.log(`[DEBUG] Admin sees ${adminOrders?.length} orders for this user.`);
            if (adminOrders && adminOrders.length > 0) {
                console.log(`[DEBUG] Order dump:`, adminOrders[0]);
                throw new Error("Order exists in DB but not visible to user. RLS Policy issue likely.");
            } else {
                throw new Error("Order does NOT exist in DB. seedOrder/fulfill_order failed.");
            }
        }

        // Check generic order presence
        await expect(page.locator('body')).toContainText('Order #');

        // Check for product
        await expect(page.locator('body')).toContainText('E2E Test Product');

        // Flexible price check
        await expect(page.locator('body')).toContainText(/R\s*99\.99/);

        // Cleanup
        await deleteTestUser(email);
    });
});
