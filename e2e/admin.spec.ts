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
    test('admin user can see real data (orders, customers)', async ({ page }) => {
        test.setTimeout(90000);

        const adminEmail = `test.admin.data.${Date.now()}@example.com`;
        const customerEmail = `test.cust.data.${Date.now()}@example.com`;
        const password = 'Password@123';

        // 1. Setup Data
        // Create Admin
        const adminUser = await seedUser(adminEmail, password);
        await makeUserAdmin(adminUser.id);

        // Create Customer & Order
        const customerUser = await seedUser(customerEmail, password);
        const orderData = await seedOrder(customerUser.id, customerEmail);
        const orderId = orderData.order_id; // From RPC return

        // 2. Login as Admin
        await page.goto('/login');
        await page.fill('input[placeholder="Enter your email"]', adminEmail);
        await page.fill('input[placeholder="Enter your password"]', password);
        await page.locator('button:has-text("Log In")').click();
        await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 15000 });

        // 3. Verify Dashboard
        await page.goto('/admin');
        await expect(page.locator('h1')).toContainText('Dashboard');
        // Total Orders should be visible and numeric
        await expect(page.locator('text=Total Orders')).toBeVisible();

        // Check Recent Orders table for the specific order ID
        // Note: ID displayed as #123
        await expect(page.locator('body')).toContainText(`#${orderId}`);
        await expect(page.locator('body')).toContainText(customerEmail);

        // 4. Verify Orders List
        await page.goto('/admin/orders');
        await expect(page.locator('h1')).toContainText('Orders Management');
        // Check row
        const orderRow = page.locator('tr', { hasText: `#${orderId}` });
        await expect(orderRow).toBeVisible();
        await expect(orderRow).toContainText(customerEmail);
        // Verify Status Select exists
        await expect(orderRow.locator('select')).toHaveValue('paid'); // Default from fulfill_order

        // 5. Verify Customers List
        await page.goto('/admin/customers');
        await expect(page.locator('h1')).toContainText('Customers');
        const custRow = page.locator('tr', { hasText: customerEmail });
        await expect(custRow).toBeVisible();
        await expect(custRow).toContainText('User'); // Role defaults to User

        // Cleanup
        await deleteTestUser(adminEmail);
        await deleteTestUser(customerEmail);
    });
});
