// src/components/AuthButton.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/utils/supabase/auth-client';
import { User } from '@supabase/supabase-js';

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Check current user session on load
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabaseClient.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };
        getUser();
    }, []);

    // 2. Handle sign out logic (DIRECT CLIENT SIDE)
    const handleSignOut = async () => {
        // We call signOut directly on the client. 
        // This clears the browser cookies immediately.
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Sign out error:", error);
            alert('Sign out failed! Check console.');
        } else {
            // Force the page to reload so the UI updates to "Sign In"
            router.refresh();
            setUser(null); // Clear local state immediately
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