"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, BoltIcon } from '@heroicons/react/24/solid';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    image_url: string | null;
    // Support both image and image_url for compatibility
    image?: string | null;
}

export default function ProductActions({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(false);

    // Normalize image URL
    const imageUrl = product.image_url || product.image;
    const productForCart = { ...product, image_url: imageUrl };

    const handleBuyNow = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [{ ...productForCart, quantity: 1 }],
                    email: "customer@trueline.co.za", // In real app, get from auth
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Payment initialization failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={() => addToCart(productForCart)}
                className="w-full bg-[#4ADE80] hover:bg-[#3ec46d] text-black font-bold py-3 rounded-xl shadow-lg shadow-[#4ADE80]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
            </button>

            <button
                onClick={handleBuyNow}
                disabled={loading}
                className={`w-full bg-[#1e293b] hover:bg-[#334155] border border-[#27272a] text-white font-medium py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <span>Processing...</span>
                ) : (
                    <>
                        <BoltIcon className="h-5 w-5 text-[#4ADE80]" />
                        Buy Now
                    </>
                )}
            </button>
        </div>
    );
}
