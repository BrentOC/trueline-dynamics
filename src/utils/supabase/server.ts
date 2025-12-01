// src/utils/supabase/server.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// FIX: We are bypassing the Next.js cookies() function entirely.
// This resolves the "cookieStore.get is not a function" error caused by
// Next.js 16 treating cookies as asynchronous.
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}