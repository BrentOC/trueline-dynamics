-- Promote Specific User to Admin
-- ID provided by user: 152e8903-0b4d-4382-9cee-1f9ea9a85749

UPDATE profiles
SET role = 'admin'
WHERE id = '152e8903-0b4d-4382-9cee-1f9ea9a85749';
