import { createClient } from '@/utils/supabase/server';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import { MapPinIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

interface ShippingAddress {
    full_address?: string;
    street?: string;
    city?: string;
    province?: string;
    postal_code?: string;
}

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
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
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
                                orders!.map((order) => {
                                    const shippingAddress = order.shipping_address as ShippingAddress | null;

                                    return (
                                        <tr key={order.id} className="hover:bg-[#1f1f22] transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">#{order.id}</span>
                                                    <span className="text-xs text-gray-500 font-mono">{order.payment_ref?.slice(0, 12)}...</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                <span className="text-white">{order.user_email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {shippingAddress ? (
                                                    <div className="flex items-start gap-2 max-w-xs">
                                                        <MapPinIcon className="h-4 w-4 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-white text-xs leading-tight line-clamp-2">
                                                                {shippingAddress.full_address || shippingAddress.street}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {shippingAddress.city} • {shippingAddress.postal_code}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">No address</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                <div className="flex flex-col">
                                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                                                {formatCurrency(Number(order.amount))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
