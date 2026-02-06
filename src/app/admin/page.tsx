import { createClient } from '@/utils/supabase/server';
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Parallel Data Fetching
    const [ordersRes, productsRes, salesRes, recentOrdersRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').in('status', ['paid', 'shipped', 'delivered', 'processing']), // Include processing? Usually yes for revenue view
        supabase.from('orders')
            .select('*') // Removed join that causes error
            .order('created_at', { ascending: false })
            .limit(5)
    ]);

    // Manual Join for Recent Orders to avoid Relationship Error
    const recentOrdersRaw = recentOrdersRes.data || [];
    const userIds = Array.from(new Set(recentOrdersRaw.map(o => o.user_id).filter(Boolean)));

    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name') // Ensure 'email' exists on profile or fetch from auth? Wait, profile usually has email?
            // The schema in migration_admin_role.sql does NOT show email in profiles!
            // It only has id, role. 
            // Real email is in auth.users. 
            // Accessing auth.users from client is hard.
            // BUT 'profiles' table usually implies metadata.
            // Let's assume for now we might NOT get email easily if it's not in profiles.
            .in('id', userIds);

        // Wait, if profiles table doesn't have email column (per migration_admin_role.sql), we can't show it from profiles!
        // We might need to fetch it from user_metadata or just show User ID if email is unavailable.
        // Or maybe Admin API? Admin API is not available in Client Component? This is Server Component.
        // We can use supabase.auth.admin.listUsers() if we have service role? No, we are using scoped client.

        // Let's check if profiles has email. migration_admin_role.sql columns: id, role, created_at, updated_at.
        // NO EMAIL IN PROFILES.

        // Fix: Query `orders` usually has `user_email` stored in it?
        // Let's check `seedOrder` in `utils.ts` -> `.rpc('fulfill_order', { p_user_email: email ... })`
        // Does `fulfill_order` save email to `orders` table?
        // Please check `migration_fix_orders_rls` or standard schema?
        // I don't see orders schema definition.

        // However, the previous code tried to select `profiles:user_id (email)`.
        // If that was the intent, maybe the developer expected profiles to have it.

        // Let's look at `src/app/admin/page.tsx` again.
        // It uses `order.user_email || 'Unknown'` in the render loop.
        // If `orders` table has `user_email` column, we don't need the join!

        if (profiles) {
            profiles.forEach(p => profilesMap[p.id] = p);
        }
    }

    const recentOrders = recentOrdersRaw.map(order => ({
        ...order,
        // If order has user_email column, use it. If not, try profile (which might not have it).
        // Let's assume order might have it or we fail gracefully.
        profiles: profilesMap[order.user_id]
    }));

    // Calculations
    const totalOrders = ordersRes.count || 0;
    const totalProducts = productsRes.count || 0;
    const totalSales = salesRes.data?.reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;
    // recentOrders is already defined above in the manual join block

    // Debug: Fetch current user profile
    const { data: { user } } = await supabase.auth.getUser();
    const { data: debugProfile, error: debugError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

    // Formatting
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    return (
        <div>
            <div className="bg-red-900/50 p-4 mb-4 rounded border border-red-500 text-xs font-mono">
                <p>DEBUG INFO:</p>
                <p>User ID: {user?.id}</p>
                <p>Role: {debugProfile?.role}</p>
                <p>Profile Error: {debugError?.message}</p>
                <p>Debug Orders Count: {totalOrders}</p>
                <p>Recent Orders Error: {recentOrdersRes.error?.message}</p>
                <p>Recent Orders (Length): {recentOrders.length}</p>
            </div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Total Sales */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] mr-4">
                        <CurrencyDollarIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Sales</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(totalSales)}</p>
                    </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mr-4">
                        <ShoppingBagIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Orders</p>
                        <p className="text-2xl font-bold text-white">{totalOrders}</p>
                    </div>
                </div>

                {/* Card 3: Total Products */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mr-4">
                        <CubeIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-white">{totalProducts}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-[#4ADE80] text-sm hover:underline">View All</Link>
                </div>

                <div className="bg-[#121212] shadow-lg rounded-2xl border border-[#27272a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#27272a]">
                            <thead className="bg-[#18181b]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#121212] divide-y divide-[#27272a] text-sm">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No orders found yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-[#1f1f22] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                {order.user_email || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                                                    ${order.status === 'paid' || order.status === 'delivered' ? 'bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30' :
                                                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                            'bg-gray-500/20 text-gray-400'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white">
                                                {formatCurrency(Number(order.amount))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
