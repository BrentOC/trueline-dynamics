<<<<<<< HEAD
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const { error } = await supabase.auth.signOut()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 })
=======
// src/app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const cookieStore = cookies();

    // Uses the specialized route handler client to access the session cookie
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 1. Check if the user is currently signed in
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign out failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Clear the session cookie and return to the homepage
    return NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
>>>>>>> ebb846f67a24ee5ffd3df94b8729b16f9f3aabdc
}