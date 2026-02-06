-- FIX RLS RECURSION in API Schema
-- Problem: Policies checking 'api.profiles' for 'admin' role trigger the 'api.profiles' policy again... loop!
-- Solution: Use a SECURITY DEFINER function to check role without triggering RLS.

-- 1. Create the Secure Check Function
CREATE OR REPLACE FUNCTION api.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Explicitly set path for safety (though we query api.profiles)
AS $$
  SELECT EXISTS (
    SELECT 1 FROM api.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Update PROFILES Policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON api.profiles;
CREATE POLICY "Admins can view all profiles" 
ON api.profiles FOR SELECT 
USING ( api.is_admin() );

-- 3. Update ORDERS Policy
DROP POLICY IF EXISTS "Admins can view all orders" ON api.orders;
CREATE POLICY "Admins can view all orders" 
ON api.orders FOR SELECT 
USING ( api.is_admin() );

-- 4. Update PRODUCTS Policy (The one failing your Insert)
DROP POLICY IF EXISTS "Admins can manage products" ON api.products;
CREATE POLICY "Admins can manage products" 
ON api.products FOR ALL -- Select, Insert, Update, Delete
USING ( api.is_admin() );

-- 5. Grant Permissions (Just in case)
GRANT EXECUTE ON FUNCTION api.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION api.is_admin TO anon;
