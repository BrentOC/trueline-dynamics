
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
    ShoppingBagIcon,
    ArrowLeftOnRectangleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

// We want our account pages to have the header and footer, 
// which they will inherit from root layout. 
// But if we want a specific layout for account area (sidebar etc), we can add it here.
// For now, we will just pass children through.

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#0a0a0a] min-h-screen flex">
            <aside className="w-64 bg-[#1a1a1a] p-6 border-r border-[#27272a]">
                <h2 className="text-xl font-semibold text-white mb-6">Account</h2>
                <nav className="space-y-2">
                    <Link href="/account/orders" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                        <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white transition-colors" />
                        <span className="font-medium text-sm">Orders</span>
                    </Link>
                    <Link href="/account/security" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                        <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white transition-colors" />
                        <span className="font-medium text-sm">Security</span>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
