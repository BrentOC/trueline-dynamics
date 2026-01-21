-- Admin Profile Fix Script
-- This script safely handling existing tables and bad data

-- 1. Temporarily drop the strict check so we can fix data
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Ensure the 'role' column exists (safe if table already existed)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN 
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user'; 
    END IF; 
END $$;

-- 3. SANITIZE DATA: Fix any NULL or invalid roles
-- This ensures 'user' is the default for anyone broken
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL OR role NOT IN ('user', 'admin');

-- 4. Re-Apply the Constraint strictly
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- 5. Ensure the Trigger uses safe conflict handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (id) DO NOTHING; -- Safe: don't overwrite if exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Backfill again (Safe)
INSERT INTO public.profiles (id, role)
SELECT id, 'user' 
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
