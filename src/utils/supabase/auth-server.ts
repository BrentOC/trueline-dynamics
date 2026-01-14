// src/utils/supabase/auth-server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a client that can read user session cookies securely.
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Ignore in Server Components
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
                    } catch {
                        // Ignore in Server Components
                    }
                },
            },
        }
    );
}