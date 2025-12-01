// src/app/login/page.tsx
"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseClient } from '@/utils/supabase/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    // Redirect to the home page after successful sign-in
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session?.user && event === 'SIGNED_IN') {
            router.push('/');
        }
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-8 text-[#131921]">Sign In / Sign Up</h1>

                <Auth
                    supabaseClient={supabaseClient}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#FFC72C', // Amazon-style yellow for buttons
                                    brandAccent: '#e3b200',
                                },
                            },
                        },
                    }}
                    // We only allow email/password for basic testing
                    providers={[]}
                    redirectTo={process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000/'}
                    view="sign_in" // Default view when the page loads
                />
            </div>
        </div>
    );
}