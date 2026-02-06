// src/components/AuthButton.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/auth-client';
import { User } from '@supabase/supabase-js';
import {
    UserIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    ShoppingBagIcon,
    ShieldCheckIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabaseClient = createClient();

    // 1. Check current user session on load & listen for changes
    useEffect(() => {
        supabaseClient.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (_event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [router, supabaseClient]);

    // 2. Handle sign out logic
    const handleSignOut = async () => {
        const response = await fetch('/api/auth/signout', { method: 'POST' });
        if (response.ok) {
            setIsOpen(false);
            router.refresh();
        } else {
            alert('Sign out failed!');
        }
    };

    if (loading) {
        return <div className="h-8 w-24 bg-[#212121] rounded animate-pulse"></div>;
    }

    if (!user) {
        return (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent hover:border-[#27272a] hover:bg-[#121212] transition-colors group">
                <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Welcome</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#4ADE80]">Sign In / Join</p>
                </div>
            </Link>
        );
    }

    // Determine initials or name
    const emailName = user.email?.split('@')[0] || 'User';
    const fullName = user.user_metadata?.full_name || emailName;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-3 py-2 rounded-full border transition-all ${isOpen
                        ? 'bg-[#1a1a1a] border-[#4ADE80] text-white'
                        : 'border-transparent hover:bg-[#121212] hover:border-[#27272a] text-gray-300'
                    }`}
            >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#27272a] border border-[#333] flex items-center justify-center text-[#4ADE80] font-bold">
                    {fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Account</p>
                    <p className="text-sm font-bold truncate max-w-[100px]">{fullName}</p>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-[#27272a] rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                    {/* Header */}
                    <div className="p-4 border-b border-[#27272a] bg-[#121212]">
                        <p className="text-sm font-bold text-white truncate">{fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <Link
                            href="/account/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors"
                        >
                            <ShoppingBagIcon className="h-4 w-4 mr-3 text-gray-500" />
                            My Orders
                        </Link>

                        <Link
                            href="/account/security"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors"
                        >
                            <ShieldCheckIcon className="h-4 w-4 mr-3 text-gray-500" />
                            Security & MFA
                        </Link>

                        {/* Admin Link - We can conditionally show this based on profile check if we had it loaded, 
                            but linking it is harmless as the page is protected. */}
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors"
                        >
                            <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-500" />
                            Admin Dashboard
                        </Link>
                    </div>

                    {/* Footer / Sign Out */}
                    <div className="p-2 border-t border-[#27272a] bg-[#121212]">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}