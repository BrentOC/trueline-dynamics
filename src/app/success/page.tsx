// src/app/success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Assuming you'd want to clear the cart after success, 
// though we haven't implemented a 'clearCart' function yet, 
// we will just display the status for now.

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');

    const [verificationStatus, setVerificationStatus] = useState('Verifying...');
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!reference) {
            setVerificationStatus("Transaction not found. Please check your order history.");
            setLoading(false);
            return;
        }

        const verifyTransaction = async () => {
            try {
                // Call our secure backend API route
                const response = await fetch(`/api/verify-transaction?reference=${reference}`);
                const data = await response.json();

                if (data.verified) {
                    setVerificationStatus(`Payment Successful! Reference: ${reference}.`);
                    setIsVerified(true);
                    // In a real app, you would dispatch an action here to SAVE the order to Supabase.
                    // Also, clear the cart: clearCart();
                } else {
                    setVerificationStatus(data.message || "Payment verification failed.");
                    setIsVerified(false);
                }
            } catch (err) {
                setVerificationStatus("An error occurred during verification.");
                setIsVerified(false);
            } finally {
                setLoading(false);
            }
        };

        verifyTransaction();
    }, [reference]);

    return (
        <div className="bg-gray-100 min-h-screen pt-10">
            <main className="max-w-screen-lg mx-auto p-5">
                <div className="flex flex-col p-10 bg-white shadow-lg rounded-xl">
                    <div className="flex items-center space-x-2 mb-6 border-b pb-4">
                        {loading ? (
                            <span className="text-blue-500 text-xl font-bold">Processing Order...</span>
                        ) : isVerified ? (
                            <CheckCircleIcon className="text-green-500 h-10" />
                        ) : (
                            <XCircleIcon className="text-red-500 h-10" />
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold">{verificationStatus}</h1>
                    </div>

                    <p className="text-gray-600">
                        {loading ? "Checking Paystack for confirmation..." : isVerified ?
                            "Thank you for your order! Your TrueLine Dynamics CNC cutters will be processed immediately. You will receive an email confirmation shortly." :
                            "Your payment could not be verified. Please contact customer support with your reference number."
                        }
                    </p>

                    <div className="mt-8">
                        <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}