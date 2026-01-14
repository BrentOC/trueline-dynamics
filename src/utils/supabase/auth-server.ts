// src/utils/supabase/auth-server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a client that can read user session cookies securely.
export async function createClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    // Uses the standard Next.js method for reading cookies
                    return cookieStore.get(name)?.value;
                },
                // We need set and remove defined for the server client to function correctly
                set(name: string, value: string, options: any) {
                    cookieStore.set(name, value, options);
                },
                remove(name: string, options: any) {
                    cookieStore.delete(name, options);
                },
            },
        }
    );
}