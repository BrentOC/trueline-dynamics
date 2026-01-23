// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        agreeToTerms: false
    });
    const supabaseClient = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                if (!formData.agreeToTerms) {
                    throw new Error("You must agree to the terms of service.");
                }
                const { error } = await supabaseClient.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: { full_name: formData.fullName }
                    }
                });
                if (error) throw error;
                // For this demo, we might generally auto-login or ask to check email. 
                // Supabase default is confirm email. 
                // We'll show a message or redirect if session exists (auto-confirm enabled).
                alert("Sign up successful! Please check your email if confirmation is required.");
            } else {
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                });
                if (error) throw error;
                router.refresh(); // Force Middleware to re-run and see the new cookie
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="w-[95vw] h-[90vh] bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex relative z-10">

                {/* Toggle Button (Absolute Top Right) */}
                <div className="absolute top-8 right-8 z-10">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                        className="px-6 py-3 rounded-full bg-[#1e1e1e] text-white text-base font-medium hover:bg-[#2a2a2a] transition-colors border border-gray-800"
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>

                {/* Left Side - Geometric Pattern */}
                <div className="hidden md:block w-4/12 bg-black/50 relative border-r border-white/5">
                    <div className="absolute inset-0 opacity-100"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'0\' y=\'0\' width=\'4\' height=\'4\' fill=\'%234ADE80\' fill-opacity=\'0.8\'/%3E%3C/svg%3E")',
                            backgroundSize: '40px 40px'
                        }}>
                    </div>
                    {/* Optional: Add some glowing effects or shapes if needed to match "exact" aesthetics */}
                    <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-8/12 p-12 md:p-20 flex flex-col justify-center text-white relative">

                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-4xl font-bold mb-10 text-center md:text-left">
                            {isSignUp ? 'Sign Up' : 'Welcome Back'}
                        </h2>

                        {error && (
                            <div className="mb-6 text-red-500 text-sm bg-red-500/10 p-3 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-8">
                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600 text-base"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600 text-base"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600 text-base"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {isSignUp && (
                                <div className="flex items-center gap-3 pt-2">
                                    <div
                                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${formData.agreeToTerms ? 'bg-[#4ADE80] border-[#4ADE80]' : 'border-gray-600'}`}
                                        onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                                    >
                                        {formData.agreeToTerms && (
                                            <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">I agree to all statements in terms of service</span>
                                </div>
                            )}

                            <div className="pt-8 flex items-center justify-between">
                                {isSignUp ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(false)}
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        I'm already a member
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => router.push('/forgot-password')} // Assuming this exists or just a placeholder
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-[#4ADE80] text-black text-sm font-bold uppercase rounded-full hover:bg-[#45c975] transition-colors transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                                    {/* Note: In the design image, the button says "SIGN IN" even on Sign Up form, probably a typo in mockup or context. 
                                        I'll stick to logical labels: Sign Up -> Sign Up, Sign In -> Log In */}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}