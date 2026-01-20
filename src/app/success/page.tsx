// src/app/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/utils/supabase/client';

// The content component that uses useSearchParams
function SuccessContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');

    const [verificationStatus, setVerificationStatus] = useState('Verifying Payment...');
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!reference) {
            setVerificationStatus("Transaction not found. Please check your order history.");
            setLoading(false);
            return;
        }

        // 1. Initial Check (API)
        // We still check once in case it already finished
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/verify-transaction?reference=${reference}`);
                const data = await response.json();
                if (data.verified) {
                    setVerificationStatus(`Payment Successful! Order Ref: ${reference}`);
                    setIsVerified(true);
                    setLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        };

        checkStatus();

        // 2. Realtime Subscription (The Enterprise Way)
        const channel = supabase
            .channel('realtime-orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: `payment_ref=eq.${reference}`
                },
                (payload) => {
                    console.log('Realtime Order Confirmed!', payload);
                    setVerificationStatus(`Payment Successful! Order Ref: ${reference}`);
                    setIsVerified(true);
                    setLoading(false);
                }
            )
            .subscribe();

        // Cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    }, [reference, supabase]);

    return (
        <div className="flex flex-col p-10 bg-white shadow-lg rounded-xl">
            <div className="flex items-center space-x-2 mb-6 border-b pb-4">
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <span className="animate-spin h-6 w-6 border-4 border-blue-500 rounded-full border-t-transparent"></span>
                        <span className="text-blue-500 text-xl font-bold">Confirming Order...</span>
                    </div>
                ) : isVerified ? (
                    <CheckCircleIcon className="text-green-500 h-10" />
                ) : (
                    <XCircleIcon className="text-red-500 h-10" /> // Only show if explicit fail or timeout
                )}
                {/* Status Text (Only show if not loading or verified) */}
                {!loading && (
                    <h1 className="text-2xl md:text-3xl font-bold">{verificationStatus}</h1>
                )}
            </div>

            <p className="text-gray-600">
                {loading ? "Waiting for secure confirmation from payment gateway..." : isVerified ?
                    "Thank you for your order! Your TrueLine Dynamics CNC cutters will be processed immediately." :
                    "If this takes too long, please check your email for confirmation."
                }
            </p>

            <div className="mt-8">
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                    Return to Homepage
                </a>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="bg-gray-100 min-h-screen pt-10">
            <main className="max-w-screen-lg mx-auto p-5">
                <Suspense fallback={<div className="p-10 text-center">Loading transaction details...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
        </div>
    );
}