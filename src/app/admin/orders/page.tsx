import { createClient } from '@/utils/supabase/server';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    // Fetch orders with latest first
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading orders: {error.message}</div>;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Orders Management</h1>
                <span className="bg-[#121212] border border-[#27272a] px-4 py-2 rounded-lg text-sm text-gray-400">
                    Total: <span className="text-white font-bold">{orders?.length || 0}</span>
                </span>
            </div>

            <div className="bg-[#121212] rounded-2xl shadow-lg border border-[#27272a] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#27272a]">
                        <thead className="bg-[#18181b]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#121212] divide-y divide-[#27272a] text-sm">
                            {(orders || []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders!.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#1f1f22] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="text-white">{order.user_email}</span>
                                                <span className="text-xs text-gray-500 font-mono">{order.payment_ref}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <span className="text-xs ml-2 text-gray-600">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                                            {formatCurrency(Number(order.amount))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[#4ADE80] hover:text-[#3ec46d] hover:underline cursor-not-allowed opacity-50" title="Coming Soon">
                                                View Items
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
