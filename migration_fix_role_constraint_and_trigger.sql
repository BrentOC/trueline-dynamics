-- COMPREHENSIVE FIX: Role Constraints & Trigger
-- Problem: DB expected 'user' or 'admin', but we are using 'customer'.

-- 1. Remove the old, strict constraint
ALTER TABLE api.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Clean up existing data (Rename 'user' -> 'customer')
-- This ensures everyone uses the same terminology
UPDATE api.profiles 
SET role = 'customer' 
WHERE role = 'user';

-- 3. Add the NEW correct constraint ('customer' or 'admin')
ALTER TABLE api.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'admin'));

-- 4. Update the Trigger Function (to use 'customer' and 'api' schema)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO api.profiles (id, role, full_name, email)
  VALUES (
    new.id, 
    'customer', 
    new.raw_user_meta_data->>'full_name', 
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Retry the Backfill (This previously failed)
INSERT INTO api.profiles (id, role, email)
SELECT 
    id, 
    'customer', 
    email
FROM auth.users 
WHERE id NOT IN (SELECT id FROM api.profiles)
ON CONFLICT (id) DO NOTHING;
