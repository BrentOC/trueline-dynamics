-- DATA CLEANUP SCRIPT
-- WARNING: This will delete ALL orders, cart items, and registered users.
-- Use this to "Reset" the application data.

-- 1. Clean up "App Data" first (Orders, Carts)
-- We delete these to avoid foreign key conflicts when deleting users.
DELETE FROM api.order_items;
DELETE FROM api.orders;
DELETE FROM api.cart_items;

-- 2. Delete Users (which will cascade to profiles usually, but we can be explicit)
-- CRITICAL: Exclude your own admin email so you don't delete yourself!
-- Replace 'my_admin_email@example.com' with your actual email.

DELETE FROM auth.users 
WHERE email NOT IN (
    'my_admin_email@example.com', 
    'another_safe_email@example.com'
);

-- Note: api.products are NOT deleted by this script, so your catalog remains safe.
