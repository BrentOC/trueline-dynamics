import Link from 'next/link';
import {
    Squares2X2Icon,
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient(); // Await the promise!

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    // Check Role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    // If no profile or role is not admin, redirect to home
    if (profileError || !profile || profile.role !== 'admin') {
        // console.log('Unauthorized Admin Access Attempt:', user.id, profile?.role); 
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#4ADE80] selection:text-black">
            {/* Sidebar - Floating Card Style */}
            <aside className="w-72 p-4 hidden md:block shrink-0">
                <div className="h-full bg-[#121212] border border-[#27272a] rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
                    {/* Header */}
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-[#4ADE80] flex items-center justify-center">
                                <span className="text-black font-bold text-lg">T</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">TrueLine</h2>
                        </div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</div>

                        <nav className="space-y-1">
                            <Link href="/admin" className="flex items-center px-4 py-3 text-white bg-[#27272a]/50 border border-[#27272a] rounded-xl transition-all hover:bg-[#27272a] group">
                                <Squares2X2Icon className="h-5 w-5 mr-3 text-[#4ADE80]" />
                                <span className="font-medium text-sm">Dashboard</span>
                            </Link>
                            <Link href="/admin/products" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                                <CubeIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white transition-colors" />
                                <span className="font-medium text-sm">Products</span>
                            </Link>
                            <Link href="/admin/orders" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                                <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white transition-colors" />
                                <span className="font-medium text-sm">Orders</span>
                            </Link>
                            <Link href="/admin/customers" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                                <UsersIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white transition-colors" />
                                <span className="font-medium text-sm">Customers</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-[#27272a]">
                        <Link href="/" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#27272a]/30 rounded-xl transition-all group">
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-white" />
                            <span className="font-medium text-sm">Back to Store</span>
                        </Link>
                    </div>

                    {/* Decorative bottom gradient */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4ADE80] to-transparent opacity-20"></div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {/* Top Bar / Breadcrumbs could go here if needed */}
                <div className="h-full bg-[#121212] border border-[#27272a] rounded-3xl shadow-xl overflow-hidden p-8 relative">
                    {/* Background Pattern for Main Content */}
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'0\' y=\'0\' width=\'2\' height=\'2\' fill=\'%23ffffff\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
                            backgroundSize: '40px 40px'
                        }}>
                    </div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
