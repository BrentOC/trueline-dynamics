
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-4xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-gray-400 mb-8 max-w-md">
                We apologize for the inconvenience. Our team has been notified.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-8 py-3 bg-[#4ADE80] text-black font-bold rounded-full hover:bg-[#3ec46d] transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
