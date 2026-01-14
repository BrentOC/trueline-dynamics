"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import { createClient } from "@/utils/supabase/auth-client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ productId }: { productId: number }) {
    const router = useRouter();
    const supabaseClient = createClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(true);
        try {
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;

            router.refresh();
        } catch (error: any) {
            alert('Error deleting product: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <TrashIcon className="h-5 w-5 inline" />
        </button>
    );
}
