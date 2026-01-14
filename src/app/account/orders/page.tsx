
"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/auth-client";

export default function OrderHistory() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabaseClient = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (!user) {
                // If not logged in, redirect handled by middleware usually, 
                // but good to safety check or show empty state.
                setLoading(false);
                return;
            }

            const { data, error } = await supabaseClient
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            if (error) console.error("Error fetching orders:", error);

            setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen pt-10 px-4">
            <main className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-[#27272a] pb-4">
                    Your Order History
                </h1>

                {orders.length === 0 ? (
                    <div className="text-gray-400 text-center py-20 bg-[#121212] rounded-xl border border-[#27272a]">
                        <p className="text-lg">You haven't placed any orders yet.</p>
                        <a href="/" className="mt-4 inline-block text-[#4ADE80] hover:underline">Start Shopping</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-[#121212] rounded-xl border border-[#27272a] overflow-hidden">
                                <div className="bg-[#1a1a1a] p-4 flex justify-between items-center text-sm text-gray-400 border-b border-[#27272a]">
                                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                                        <div>
                                            <span className="block text-xs uppercase text-gray-500">Date Placed</span>
                                            <span className="text-white">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-gray-500">Order ID</span>
                                            <span className="text-white font-mono">{order.payment_ref || order.id.slice(0, 8)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-gray-500">Total Amount</span>
                                            <span className="text-white font-bold">R {Number(order.amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                            ${order.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                                    {/* Ideally show product image here */}
                                                    Img
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{item.product_name}</p>
                                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            {/* Price per item if stored, or just quantity */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
