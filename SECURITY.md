# Security Maintenance Guide

This document outlines the security measures implemented for TrueLine Dynamics and the procedures for maintaining them.

## 1. Schema Hardening (Database)
We have moved core tables from the default `public` schema to a custom `api` schema to protect against automated scanning tools.

### Migration Instructions (One-Time Setup)
If you haven't run the migration yet, the application will not load data until you do.
1.  Go to your Supabase Dashboard -> SQL Editor.
2.  Open or copy the contents of [migration_move_to_api_schema.sql](file:///c:/Users/pc/Desktop/Webdesign/Dev2/trueline-dynamics/migration_move_to_api_schema.sql).
3.  Run the script.
4.  **Important:** Go to **Settings -> API -> Data API**.
5.  In the "Exposed schemas" section, add `api`.
6.  (Optional) Remove `public` from exposed schemas if you want to be extra secure, but ensure you don't have other dependencies on it.

## 2. JWT Secret Rotation
Rotate your JWT secret periodically (e.g., every 6 months) or if you suspect a breach. This invalidates all current user sessions.

### Procedure
1.  Go to **Supabase Dashboard -> Project Settings -> API**.
2.  Find "JWT Settings" -> "JWT Secret".
3.  Click "Generate a new secret".
4.  **Update Environment Variables:**
    - You must update the `SUPABASE_JWT_SECRET` in your `.env.local` (if you use it explicitly, though usually standard clients use the Anon API key which is derived from it? No, Anon key is signed BY it).
    - **CRITICAL:** When you rotate the JWT secret, your **Anon Key** and **Service Role Key** will Change!
    - You MUST copy the *new* keys from the dashboard and update:
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        - `SUPABASE_SERVICE_ROLE_KEY`
      in your `.env.local` file and any deployment environments (e.g., Vercel).
5.  Restart your application.

## 3. Multi-Factor Authentication (MFA)
MFA is now available for users.

- **Enrollment:** Users can enroll at `/account/security`.
- **Enforcement:** The system checks for "AAL2" (Authenticator Assurance Level 2) requirements during login and prompts for a code if the user has enrolled factors.
- **Support:** If a user loses their authenticator, an Admin can reset their factors via the Supabase Dashboard (Auth -> Users -> Select User -> Factors).

## 4. Admin Security
- Admin pages are protected by Row Level Security (RLS) policies (`Admins can view all orders`).
- Ensure the `admin` role is managed carefully in the `profiles` table.

## 5. Role Management & Default Permissions
- **Admin Access:** The `/admin` routes are protected by a server-side check. Only users with `role = 'admin'` can access them.
- **Default Role:** New users are automatically assigned the `customer` role.

## 6. Database Isolation (RLS)
We use Row Level Security (RLS) to enforce strict data separation at the database engine level.
- **Customers:** Can ONLY `SELECT` their own rows in `orders` and `profiles`. attempting to read other data will return empty results.
- **Admins:** Can `SELECT` all rows.
- **Action Required:** Run `migration_secure_api_schema_rls.sql` to apply these strict policies to the new `api` schema.

## 7. How to Manage Admins
Since new users are `customer` by default, you must manually promote trusted users to `admin`.

### Promoting a User
1.  Ask the user to sign up normally on the website.
2.  Go to Supabase Dashboard -> SQL Editor.
3.  Run the following query (replace with their email):
    ```sql
    UPDATE api.profiles
    SET role = 'admin'
    WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
    ```
    *(See `migration_promote_admin.sql` for a ready-to-use script)*

## 8. Verifying Security (Testing)
To ensure your site is secure, perform these tests:

### Test A: The "Hacker" / Customer Test
1.  Open an **Incognito Window**.
2.  Sign up as a new user (e.g., `hacker@test.com`).
3.  **Try to access Admin:** Navigate manually to `/admin`.
    - **Result:** You should be redirected immediately to the home page or login.
4.  **Try to "Steal" Data (Advanced):**
    - If you know how to use browser console to fetch data:
    - Run `await supabase.from('orders').select('*')`
    - **Result:** You should get an empty list `[]` (or only your own orders), NOT all orders.

### Test B: The Admin Test
1.  Promote your main account to admin using the SQL script above.
2.  Log in as that user.
3.  Navigate to `/admin`.
    - **Result:** You should see the dashboard and full list of recent orders.
