// src/utils/supabase/auth-client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// This function is used by client components for sign-in/sign-out actions.
export const supabaseClient = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});