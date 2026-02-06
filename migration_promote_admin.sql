-- Utility: Promote a user to Admin
-- Usage: Replace 'target_email@example.com' with the actual user's email.

-- 1. Find the user ID from auth.users (if possible) or just update api.profiles directly if we know the ID.
-- Since we might not have easy access to auth.users ID joining here without permissions, 
-- the easiest way in Supabase Dashboard SQL Editor is to look up the ID or use a subquery if allowed.

-- This query assumes you know the email and want to update the profile.
-- Note: 'auth.users' is a system table. We usually join on it to find the ID.

UPDATE api.profiles
SET role = 'admin'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'target_email@example.com' -- <--- REPLACE THIS EMAIL
);

-- Verification
-- SELECT * FROM api.profiles WHERE role = 'admin';
