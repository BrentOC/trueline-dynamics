'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Calculate the redirect URL dynamically based on the current window location
        const resetUrl = `${window.location.origin}/auth/callback?next=/account/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetUrl,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link.'
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
            {/* Background Effects similar to Login */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-md bg-[#121212] border border-[#27272a] rounded-3xl p-8 relative z-10 shadow-2xl">
                <Link href="/login" className="flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Login
                </Link>

                <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-gray-400 mb-8">Enter your email to receive a reset link.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-500/50 text-green-200'
                            : 'bg-red-900/20 border border-red-500/50 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4ADE80] text-black font-bold uppercase rounded-xl hover:bg-[#45c975] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}
