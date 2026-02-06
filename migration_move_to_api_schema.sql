-- Migration: Move tables to 'api' schema (Database Hardening)

-- 1. Create the new schema
CREATE SCHEMA IF NOT EXISTS api;

-- 2. Move tables from public to api
-- Note: Foreign keys should be preserved automatically by Postgres
ALTER TABLE public.profiles SET SCHEMA api;
ALTER TABLE public.products SET SCHEMA api;
ALTER TABLE public.orders SET SCHEMA api;
ALTER TABLE public.order_items SET SCHEMA api;
ALTER TABLE public.cart_items SET SCHEMA api;

-- 3. Grant usage on the new schema
GRANT USAGE ON SCHEMA api TO postgres, anon, authenticated, service_role;

-- 4. Grant privileges on tables in the new schema
-- Re-applying permissions that were likely on public tables
GRANT ALL ON ALL TABLES IN SCHEMA api TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA api TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api TO anon; 

-- Note: RLS policies move with the table, so they are still enforcing security.
-- We just need to ensure the roles can "reach" the tables in the new schema.

-- 5. Expose the new schema to the API
-- You must also update your Supabase settings in the dashboard:
-- Go to Settings -> API -> Data API -> Exposed schemas
-- Add 'api' to the list. You can remove 'public' if you want to be extra secure, 
-- but ensuring 'api' is the default for your client is key.
