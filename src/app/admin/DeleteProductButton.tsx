// src/app/admin/DeleteProductButton.tsx
"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import { supabaseClient } from '@/utils/supabase/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ id }: { id: number }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this product? This cannot be undone.");
        if (!confirm) return;

        setIsDeleting(true);

        // 1. Delete from Supabase
        const { error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error deleting product: " + error.message);
            setIsDeleting(false);
        } else {
            // 2. Refresh the page to show updated list
            router.refresh();
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:text-gray-400"
        >
            {isDeleting ? "..." : <TrashIcon className="h-5 w-5" />}
        </button>
    );
}