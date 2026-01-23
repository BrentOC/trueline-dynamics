// src/components/AuthButton.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/auth-client';
import { User } from '@supabase/supabase-js';

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabaseClient = createClient();

    // 1. Check current user session on load
    // 1. Check current user session on load & listen for changes
    useEffect(() => {
        // Initial fetch
        supabaseClient.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        // Real-time listener
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (_event === 'SIGNED_OUT') {
                router.refresh(); // Clear server caches
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabaseClient]);

    // 2. Handle sign out logic
    const handleSignOut = async () => {
        const response = await fetch('/api/auth/signout', { method: 'POST' });
        if (response.ok) {
            // Force the page to reload and clear the state
            router.refresh();
        } else {
            alert('Sign out failed!');
        }
    };

    if (loading) {
        return <div className="link md:text-sm text-gray-400">Loading...</div>;
    }

    return (
        <div className="link cursor-pointer">
            {user ? (
                <div className="text-xs text-white group" onClick={handleSignOut}>
                    <p>Hello, <span className="font-extrabold md:text-sm group-hover:underline">
                        {user.email?.split('@')[0]}
                    </span></p>
                    <p className="font-extrabold md:text-sm">Sign Out</p>
                </div>
            ) : (
                <Link href="/login" className="text-xs text-white hover:underline">
                    <p>Hello, Sign In</p>
                    <p className="font-extrabold md:text-sm">Account & Lists</p>
                </Link>
            )}
        </div>
    );
}