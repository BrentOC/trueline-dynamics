import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeftIcon, PrinterIcon } from '@heroicons/react/24/outline';

interface PageProps {
    params: {
        id: string;
    }
}

// Helper to ensure auth
// Note in Next.js 15+ params should be awaited if strictly typed, but for 14/16 standard simple access usually works 
// or define Props type properly
type Props = {
    params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch Order with Items
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id) // Security: Ensure ownership
        .single();

    if (error || !order) {
        notFound();
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen pb-20 text-white">
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Back Button */}
                <Link href="/account/orders" className="inline-flex items-center text-gray-400 hover:text-[#4ADE80] mb-8 transition-colors">
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Back to Orders
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#27272a] pb-6 mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    // onClick={() => window.print()} // Client side only, would need 'use client' or separate component. 
                    // For server component, just styling for now.
                    >
                        <PrinterIcon className="h-4 w-4" />
                        Print Invoice
                    </button>
                </div>

                {/* Order Meta Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#121212] p-5 rounded-xl border border-[#27272a]">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Shipping Address</h3>
                        <p className="text-sm text-gray-300">
                            {/* Assuming address stored in user metadata or order metadata if captured */}
                            {user.user_metadata?.full_name || user.email}<br />
                            {/* Placeholder as address might not be in 'orders' table yet without checkout address capture */}
                            123 Industrial Park<br />
                            Johannesburg, 2000<br />
                            South Africa
                        </p>
                    </div>
                    <div className="bg-[#121212] p-5 rounded-xl border border-[#27272a]">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Payment Method</h3>
                        <p className="text-sm text-gray-300">
                            Pre-paid via Paystack<br />
                            Ref: <span className="font-mono text-xs bg-black p-1 rounded text-green-500">{order.payment_ref}</span>
                        </p>
                    </div>
                    <div className="bg-[#121212] p-5 rounded-xl border border-[#27272a]">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Order Summary</h3>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Subtotal:</span>
                            <span>R {(Number(order.amount)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Shipping:</span>
                            <span>R 0.00</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t border-[#27272a] pt-2 mt-2 text-[#4ADE80]">
                            <span>Grand Total:</span>
                            <span>R {(Number(order.amount)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-[#121212] rounded-xl border border-[#27272a] overflow-hidden">
                    <div className="bg-[#1a1a1a]/50 px-6 py-3 border-b border-[#27272a]">
                        <h3 className="font-bold text-gray-200">Order Items</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-[#27272a] rounded-lg flex-shrink-0 flex items-center justify-center">
                                        {/* Placeholder */}
                                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <Link href={`/product/${item.product_id}`} className="font-bold text-white hover:text-[#4ADE80] transition-colors">
                                            {item.product_name}
                                        </Link>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Quantity: {item.quantity} &times; R {Number(item.price).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">R {(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
