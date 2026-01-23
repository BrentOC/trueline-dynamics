"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setLoading(true);
        setStatus(newStatus);

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                alert('Failed to update status');
                setStatus(currentStatus); // Revert
                console.error(error);
            }
        } catch (err) {
            console.error(err);
            setStatus(currentStatus);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'paid': return 'text-green-500 font-bold';
            case 'delivered': return 'text-green-500 font-bold';
            case 'processing': return 'text-yellow-500 font-bold';
            case 'shipped': return 'text-purple-500 font-bold';
            case 'cancelled':
            case 'returned': return 'text-red-500 font-bold';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="relative">
            <select
                value={status}
                onChange={handleChange}
                disabled={loading}
                className={`bg-transparent text-sm border-none focus:ring-0 cursor-pointer ${getStatusColor(status)} disabled:opacity-50`}
            >
                <option value="processing" className="text-black">Processing</option>
                <option value="paid" className="text-black">Paid</option>
                <option value="shipped" className="text-black">Shipped</option>
                <option value="delivered" className="text-black">Delivered</option>
                <option value="cancelled" className="text-black">Cancelled</option>
                <option value="returned" className="text-black">Returned</option>
            </select>
            {loading && <span className="absolute -right-4 top-0 text-xs text-gray-500">...</span>}
        </div>
    );
}
