'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ShieldCheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function SecurityPage() {
    const supabase = createClient();
    const [factors, setFactors] = useState<any[]>([]);
    const [qrCode, setQrCode] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [factorId, setFactorId] = useState<string>('');
    const [verifyCode, setVerifyCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEnroll, setShowEnroll] = useState(false);

    useEffect(() => {
        fetchFactors();
    }, []);

    const fetchFactors = async () => {
        const { data: { factors }, error } = await supabase.auth.mfa.listFactors();
        if (error) {
            console.error('Error fetching factors:', error);
            setError(error.message);
        } else {
            setFactors(factors || []);
        }
    };

    const startEnrollment = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
            friendlyName: 'TrueLine Dynamics Authenticator',
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setFactorId(data.id);
        setSecret(data.totp.secret);

        try {
            const qr = await QRCode.toDataURL(data.totp.uri);
            setQrCode(qr);
            setShowEnroll(true);
        } catch (e) {
            setError('Failed to generate QR Code');
        }
        setLoading(false);
    };

    const verifyEnrollment = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase.auth.mfa.challengeAndVerify({
            factorId,
            code: verifyCode,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setShowEnroll(false);
        setVerifyCode('');
        fetchFactors();
        setLoading(false);
        alert('MFA Enabled Successfully!');
    };

    const unenroll = async (id: string) => {
        if (!confirm('Are you sure you want to remove this factor? Your account will be less secure.')) return;

        setLoading(true);
        const { error } = await supabase.auth.mfa.unenroll({ factorId: id });

        if (error) {
            setError(error.message);
        } else {
            fetchFactors();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-[#4ADE80] mr-3" />
                Security Settings
            </h1>
            <p className="text-gray-400 mb-8">Manage your two-factor authentication methods.</p>

            <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Two-Factor Authentication (MFA)</h2>
                    {!showEnroll && factors.length === 0 && (
                        <button
                            onClick={startEnrollment}
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-[#4ADE80] text-black rounded-full font-bold text-sm hover:bg-[#45c975] transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Enable MFA
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {factors.length > 0 ? (
                    <div className="space-y-4">
                        {factors.map((factor) => (
                            <div key={factor.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#27272a]">
                                <div>
                                    <p className="text-white font-medium">{factor.friendly_name || 'Authenticator App'}</p>
                                    <p className="text-xs text-gray-500">Status: {factor.status}</p>
                                </div>
                                <button
                                    onClick={() => unenroll(factor.id)}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                    title="Remove Factor"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showEnroll && <p className="text-gray-500">No MFA factors enabled. Secure your account by adding one.</p>
                )}

                {showEnroll && (
                    <div className="mt-6 p-6 bg-[#1a1a1a] rounded-xl border border-[#27272a]">
                        <h3 className="text-white font-bold mb-4">Set up Authenticator App</h3>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="bg-white p-2 rounded-lg">
                                {qrCode && <img src={qrCode} alt="Scan QR Code" width={200} height={200} />}
                            </div>
                            <div className="flex-1 space-y-4">
                                <p className="text-gray-400 text-sm">
                                    1. Install an authenticator app (Google Authenticator, Authy, etc.).
                                    <br />
                                    2. Scan the QR code.
                                    <br />
                                    3. Enter the code below.
                                </p>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Verification Code</label>
                                    <input
                                        type="text"
                                        value={verifyCode}
                                        onChange={(e) => setVerifyCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full bg-[#121212] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:border-[#4ADE80] focus:outline-none font-mono tracking-widest text-center text-xl"
                                    />
                                </div>

                                <button
                                    onClick={verifyEnrollment}
                                    disabled={loading || verifyCode.length < 6}
                                    className="w-full py-3 bg-[#4ADE80] text-black font-bold rounded-xl hover:bg-[#45c975] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Enable'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
