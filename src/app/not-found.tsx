
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-9xl font-bold text-[#4ADE80] opacity-20">404</h1>
            <h2 className="text-4xl font-bold text-white mt-4">Page Not Found</h2>
            <p className="text-gray-400 mt-4 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="mt-8 px-8 py-3 bg-[#4ADE80] text-black font-bold rounded-full hover:bg-[#3ec46d] transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
