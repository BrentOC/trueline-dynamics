-- FIX RLS INFINITE RECURSION
-- Problem: The 'Admins can view all...' policies check the 'profiles' table.
-- But querying 'profiles' triggers its own RLS policy, which checks 'profiles' again... loop!

-- Solution: Create a "Security Definer" function.
-- This function runs with the privileges of the CREATOR (Database Owner), ignoring RLS.

-- 1. Create the helper function
CREATE OR REPLACE FUNCTION api.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- <--- Vital: Bypasses RLS
SET search_path = public -- Good practice for security definers
AS $$
  SELECT EXISTS (
    SELECT 1 FROM api.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Update PROFILES Policies to use the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON api.profiles;
CREATE POLICY "Admins can view all profiles" 
ON api.profiles FOR SELECT 
USING ( api.is_admin() );

-- 3. Update ORDERS Policies to use the function
DROP POLICY IF EXISTS "Admins can view all orders" ON api.orders;
CREATE POLICY "Admins can view all orders" 
ON api.orders FOR SELECT 
USING ( api.is_admin() );

-- 4. Update PRODUCTS Policies to use the function (for management)
DROP POLICY IF EXISTS "Admins can manage products" ON api.products;
CREATE POLICY "Admins can manage products" 
ON api.products FOR ALL 
USING ( api.is_admin() );

-- 5. Grant execute permission to everyone (authenticated)
GRANT EXECUTE ON FUNCTION api.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION api.is_admin() TO service_role;
