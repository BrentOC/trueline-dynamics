"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/auth-client";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Define strict types for better code safety
type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'refunded' | 'cancelled';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    // Add product_id if you want to link back to the product page
    product_id?: number;
}

interface Order {
    id: number;
    created_at: string;
    amount: number;
    status: OrderStatus;
    payment_ref: string;
    order_items: OrderItem[];
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'cancelled'>('all');
    const supabaseClient = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (!user) {
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

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return ['paid', 'processing', 'shipped'].includes(order.status);
        if (activeTab === 'cancelled') return ['returned', 'refunded', 'cancelled'].includes(order.status);
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'returned':
            case 'refunded':
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-[#4ADE80] rounded-full mb-4 animate-bounce"></div>
                    <p className="text-gray-500 text-sm">Loading your history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen pb-20">
            {/* Header Area */}
            <div className="bg-[#121212] border-b border-[#27272a] py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Order History</h1>
                            <p className="text-gray-400 mt-2 text-sm">Check the status of recent orders, manage returns, and download invoices.</p>
                        </div>
                        {/* Search Bar Stub (Enterprise Feature) */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search all orders"
                                className="bg-[#0a0a0a] border border-[#27272a] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#4ADE80] w-full md:w-64 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                {/* Tabs */}
                <div className="flex border-b border-[#27272a] mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-4 px-1 text-sm font-medium mr-8 transition-colors relative ${activeTab === 'all' ? 'text-[#4ADE80]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Orders
                        {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ADE80]"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-4 px-1 text-sm font-medium mr-8 transition-colors relative ${activeTab === 'active' ? 'text-[#4ADE80]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Open Orders
                        {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ADE80]"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('cancelled')}
                        className={`pb-4 px-1 text-sm font-medium transition-colors relative ${activeTab === 'cancelled' ? 'text-[#4ADE80]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Cancelled & Returns
                        {activeTab === 'cancelled' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ADE80]"></span>}
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-[#121212] rounded-xl border border-[#27272a] border-dashed">
                        <p className="text-gray-400 text-lg mb-2">No orders found in this category.</p>
                        {activeTab === 'all' && (
                            <Link href="/" className="inline-block mt-4 bg-[#4ADE80] text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#22c55e] transition-colors">
                                Start Shopping
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-[#121212] rounded-xl border border-[#27272a] overflow-hidden hover:border-gray-700 transition-colors">

                                {/* Order Header */}
                                <div className="bg-[#1a1a1a]/50 p-4 sm:p-6 flex flex-wrap justify-between items-center text-sm border-b border-[#27272a] gap-y-4">
                                    <div className="flex gap-8 sm:gap-12">
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Date Placed</span>
                                            <span className="text-gray-200 font-medium">
                                                {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Total</span>
                                            {/* Note: Ensure amount is treated as Rands if stored as Rands, or divide by 100 if cents */}
                                            <span className="text-gray-200 font-medium">R {Number(order.amount).toFixed(2)}</span>
                                        </div>
                                        <div className="hidden sm:flex flex-col">
                                            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Reference</span>
                                            <span className="text-gray-200 font-mono text-xs">{order.payment_ref || `#${order.id}`}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end">
                                        <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1 sm:text-right">Order # {order.id}</span>
                                        <div className="flex gap-3">
                                            <Link href={`/account/orders/${order.id}`} className="text-[#4ADE80] hover:underline font-medium">
                                                View Invoice
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg font-bold text-white mb-2">
                                            Status: <span className="capitalize">{order.status}</span>
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {order.order_items?.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-[#27272a] rounded-lg flex items-center justify-center text-gray-500 text-xs shrink-0 overflow-hidden relative">
                                                        {/* Placeholder for Product Image - Replace with item.image_url if available */}
                                                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <Link href={`/product/${item.product_id}`} className="font-semibold text-white hover:text-[#4ADE80] transition-colors line-clamp-1">
                                                            {item.product_name}
                                                        </Link>
                                                        <p className="text-sm text-gray-400 mt-1">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>

                                                {/* Enterprise Action: Buy Again / Return */}
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-xs bg-white text-black px-3 py-1.5 rounded font-medium hover:bg-gray-200">
                                                        Buy Again
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer (Actions) */}
                                {(order.status === 'delivered') && (
                                    <div className="bg-[#1a1a1a]/30 px-6 py-3 border-t border-[#27272a] flex justify-end">
                                        <button className="text-sm text-gray-400 hover:text-white transition-colors">
                                            Return Items
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
