-- FIX TRIGGER: Point to 'api.profiles' instead of 'public.profiles'

-- 1. Update the Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into the correct schema (api)
  INSERT INTO api.profiles (id, role, full_name, email)
  VALUES (
    new.id, 
    'customer', -- Default role
    new.raw_user_meta_data->>'full_name', -- Capture name if available
    new.email -- Capture email if available
  )
  ON CONFLICT (id) DO NOTHING; -- Safe: don't overwrite if exists
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Backfill Missing Profiles (Fix for your current user)
-- This finds users in auth.users who don't have a row in api.profiles and creates one.
INSERT INTO api.profiles (id, role, email)
SELECT 
    id, 
    'customer', 
    email
FROM auth.users 
WHERE id NOT IN (SELECT id FROM api.profiles)
ON CONFLICT (id) DO NOTHING;

-- 3. Verify Trigger is still attached (It should be, but just in case)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
