'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords don't match" });
            return;
        }

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Password updated successfully! Redirecting...'
            });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <div className="w-full max-w-md bg-[#121212] border border-[#27272a] rounded-3xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
                <p className="text-gray-400 mb-8">Please enter your new password below.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-500/50 text-green-200'
                            : 'bg-red-900/20 border border-red-500/50 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4ADE80] text-black font-bold uppercase rounded-xl hover:bg-[#45c975] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Update Password' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
