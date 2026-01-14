// src/app/checkout/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function CheckoutPage() {
    const { cart, totalItems, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Paystack Payment Handler
    const handlePaystackPayment = async () => {
        setLoading(true);

        try {
            // 1. Call our internal API to initialize the transaction
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    email: "customer@trueline.co.za", // Static email for testing
                }),
            });

            const data = await response.json();

            if (data.url) {
                // 2. Redirect user to the Paystack Secure Payment Page
                window.location.href = data.url;
            } else {
                alert(data.error || "Payment initialization failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            <main className="lg:flex max-w-screen-2xl mx-auto p-6">
                {/* Left Section */}
                <div className="flex-grow m-5">
                    <div className="flex flex-col p-8 space-y-10 bg-[#121212] rounded-2xl shadow-xl border border-[#27272a]">
                        <h1 className="text-3xl border-b border-[#27272a] pb-4 text-white font-bold">
                            {cart.length === 0 ? "Your Basket is empty." : "Shopping Basket"}
                        </h1>

                        {cart.map((item, i) => (
                            <div key={i} className="grid grid-cols-5 border-b border-[#27272a] pb-5 last:border-none">
                                <div className="bg-white/5 rounded-xl p-2 h-[150px] w-[150px] flex items-center justify-center">
                                    <img
                                        src={item.image_url || "https://placehold.co/400x400"}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                <div className="col-span-3 mx-5 space-y-2">
                                    <p className="font-bold text-white text-lg">{item.name}</p>
                                    <p className="text-xs text-gray-400 line-clamp-3">Category: <span className="text-[#4ADE80]">{item.category}</span></p>
                                    <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                                    <p className="text-xl font-bold text-white">R {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col space-y-2 my-auto justify-self-end">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="bg-[#27272a] text-white hover:text-[#4ADE80] font-bold py-2 px-4 rounded-lg border border-[#3f3f46] hover:border-[#4ADE80] text-xs mt-2 transition-all"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                {cart.length > 0 && (
                    <div className="flex flex-col bg-[#121212] p-10 shadow-xl rounded-2xl border border-[#27272a] h-fit mt-5 mr-5 w-full lg:w-[350px]">
                        <>
                            <h2 className="whitespace-nowrap text-white text-lg mb-4">
                                Subtotal ({totalItems} items): <br />
                                <span className="font-bold text-2xl text-white">R {total.toFixed(2)}</span>
                            </h2>

                            <button
                                role="link"
                                disabled={loading}
                                onClick={handlePaystackPayment} // <--- The click handler
                                className={`w-full rounded-xl font-bold mt-2 py-4 px-4 text-sm shadow-lg
                  ${loading ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-[#4ADE80] hover:bg-[#3ec46d] text-black shadow-[#4ADE80]/20'}`}
                            >
                                {loading ? "Processing..." : "Pay with Paystack"}
                            </button>
                        </>
                    </div>
                )}
            </main>
        </div>
    );
}
