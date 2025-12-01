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
}