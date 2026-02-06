-- Migration: Secure API Schema with RLS (Role Separation)

-- 1. Enable RLS on all sensitive tables in 'api' schema
ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.order_items ENABLE ROW LEVEL SECURITY;
-- Products are usually public read, but restricted write
ALTER TABLE api.products ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- PROFILES POLICIES
-- ========================================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON api.profiles;
CREATE POLICY "Users can view own profile" 
ON api.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON api.profiles;
CREATE POLICY "Users can update own profile" 
ON api.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view ALL profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON api.profiles;
CREATE POLICY "Admins can view all profiles" 
ON api.profiles FOR SELECT 
USING (
  EXISTS (
    -- Recursion Check: We verify if the current user has the 'admin' role.
    -- This relies on the table lookup being efficient and not triggering infinite recursion
    -- because we are checking a specific user ID.
    SELECT 1 FROM api.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================================
-- ORDERS POLICIES
-- ========================================================

-- Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON api.orders;
CREATE POLICY "Users can view own orders" 
ON api.orders FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view ALL orders
DROP POLICY IF EXISTS "Admins can view all orders" ON api.orders;
CREATE POLICY "Admins can view all orders" 
ON api.orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM api.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================================
-- PRODUCTS POLICIES
-- ========================================================

-- Everyone can view products (Public Read)
DROP POLICY IF EXISTS "Public read products" ON api.products;
CREATE POLICY "Public read products" 
ON api.products FOR SELECT 
TO anon, authenticated
USING (true);

-- Only Admins can insert/update/delete products
DROP POLICY IF EXISTS "Admins can manage products" ON api.products;
CREATE POLICY "Admins can manage products" 
ON api.products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM api.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
