-- Migration: Enforce 'customer' default role
-- This ensures that when a new user signs up, their profile (if created automatically or manually) defaults to 'customer'.

-- 1. Set default value for the column
ALTER TABLE api.profiles 
ALTER COLUMN role SET DEFAULT 'customer';

-- 2. Update existing rows that have NULL role (safety net)
UPDATE api.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- 3. Add a check constraint to ensure only valid roles (Optional but good practice)
-- ALTER TABLE api.profiles ADD CONSTRAINT valid_roles CHECK (role IN ('customer', 'admin', 'superadmin'));
