// src/utils/supabase/admin.ts
import { createClient } from '@/utils/supabase/auth-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function ensureAdmin() {
    console.log("?????? [Admin Check] Starting Detective Mode...");

    // 1. INSPECT COOKIES: What does the server actually see?
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log("?? [Admin Check] Total Cookies Found:", allCookies.length);

    allCookies.forEach(c => {
        // We only care about Supabase cookies (usually start with sb-)
        if (c.name.startsWith('sb-')) {
            console.log(`   -> Found Supabase Cookie: ${c.name} (Length: ${c.value.length})`);
        } else {
            console.log(`   -> Found Other Cookie: ${c.name}`);
        }
    });

    if (allCookies.length === 0) {
        console.log("?? [Admin Check] NO COOKIES FOUND. Middleware might be broken or path is wrong.");
    }

    // 2. Initialize Client
    const supabase = await createClient();

    // 3. Check User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.log("? [Admin Check] Auth Failed.");
        if (authError) console.error("   -> Error Message:", authError.message);
        redirect('/login');
    }

    console.log(`? [Admin Check] User Verified: ${user.email}`);

    // 4. Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        console.log("? [Admin Check] Role is not admin.");
        redirect('/');
    }

    return user;
}