import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Use getSession for middleware routing to avoid flaky "getUser" network calls
    // causing redirect loops. RLS will still protect the data.
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
    console.log(`[Middleware] Cookies present:`, request.cookies.getAll().map(c => c.name));
    console.log(`[Middleware] User found: ${!!user}`);
    if (error) console.log(`[Middleware] Auth Error: ${error.message}`);

    // Simple protection: Redirect to login if accessing protected routes without user
    if ((request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/account')) && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
