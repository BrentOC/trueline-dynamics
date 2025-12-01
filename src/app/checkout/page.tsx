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
        <div className="bg-gray-100 min-h-screen">
            <main className="lg:flex max-w-screen-2xl mx-auto">
                {/* Left Section */}
                <div className="flex-grow m-5 shadow-sm">
                    <div className="flex flex-col p-5 space-y-10 bg-white">
                        <h1 className="text-3xl border-b pb-4">
                            {cart.length === 0 ? "Your Basket is empty." : "Shopping Basket"}
                        </h1>

                        {cart.map((item, i) => (
                            <div key={i} className="grid grid-cols-5 border-b pb-5">
                                <img
                                    src={item.image_url || "https://placehold.co/400x400"}
                                    alt={item.name}
                                    className="h-[150px] w-[150px] object-contain"
                                />
                                <div className="col-span-3 mx-5">
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-xs my-2 line-clamp-3">Quantity: {item.quantity}</p>
                                    <p className="text-xl font-bold">R {item.price * item.quantity}</p>
                                </div>
                                <div className="flex flex-col space-y-2 my-auto justify-self-end">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 text-xs mt-2"
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
                    <div className="flex flex-col bg-white p-10 shadow-md h-[200px] mt-5 mr-5">
                        <>
                            <h2 className="whitespace-nowrap">
                                Subtotal ({totalItems} items):{" "}
                                <span className="font-bold">R {total.toFixed(2)}</span>
                            </h2>

                            <button
                                role="link"
                                disabled={loading}
                                onClick={handlePaystackPayment} // <--- The click handler
                                className={`w-full rounded-md font-bold mt-2 py-2 px-4 text-sm 
                  ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
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