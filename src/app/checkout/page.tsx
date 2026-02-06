// src/app/checkout/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import { StarIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, ShoppingBagIcon, CreditCardIcon, PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/auth-client";
import { useEffect, useState } from "react";
import AddressForm from "@/components/AddressForm";

interface Address {
    id: number;
    label: string;
    full_address: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    lat: number;
    lng: number;
    is_default: boolean;
}

interface ShippingAddress {
    full_address: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    lat: number;
    lng: number;
}

export default function CheckoutPage() {
    const { cart, totalItems, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string>("customer@trueline.co.za");
    const [userId, setUserId] = useState<string | null>(null);
    const supabaseClient = createClient();

    // Multi-step checkout
    const [step, setStep] = useState<'address' | 'review'>('address');
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                if (user.email) setUserEmail(user.email);
                setUserId(user.id);
                fetchAddresses();
            } else {
                setLoadingAddresses(false);
            }
        };
        getUser();
    }, []);

    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        const { data, error } = await supabaseClient
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (!error && data) {
            setSavedAddresses(data);
            // Auto-select default address
            const defaultAddr = data.find(a => a.is_default);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
                setSelectedAddress({
                    full_address: defaultAddr.full_address,
                    street: defaultAddr.street,
                    city: defaultAddr.city,
                    province: defaultAddr.province,
                    postal_code: defaultAddr.postal_code,
                    lat: defaultAddr.lat,
                    lng: defaultAddr.lng,
                });
            }
        }
        setLoadingAddresses(false);
    };

    const handleAddressSelection = (addr: Address) => {
        setSelectedAddressId(addr.id);
        setSelectedAddress({
            full_address: addr.full_address,
            street: addr.street,
            city: addr.city,
            province: addr.province,
            postal_code: addr.postal_code,
            lat: addr.lat,
            lng: addr.lng,
        });
    };

    const handleNewAddressSelect = async (addressData: ShippingAddress) => {
        // Save to database
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const isFirst = savedAddresses.length === 0;
            const { error } = await supabaseClient
                .from('addresses')
                .insert({
                    user_id: user.id,
                    label: 'Delivery',
                    ...addressData,
                    is_default: isFirst,
                });

            if (!error) {
                fetchAddresses();
            }
        }

        // Use for this order
        setSelectedAddress(addressData);
        setSelectedAddressId(null); // New address, not a saved one
        setShowNewAddressForm(false);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Paystack Payment Handler
    const handlePaystackPayment = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        setLoading(true);

        try {
            // 1. Call our internal API to initialize the transaction
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    email: userEmail,
                    userId: userId,
                    shippingAddress: selectedAddress,
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

    const canProceed = selectedAddress !== null;

    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            <main className="max-w-screen-xl mx-auto p-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'address' ? 'bg-[#4ADE80] text-black' : 'bg-[#4ADE80] text-black'}`}>
                            {step === 'review' ? <CheckCircleIcon className="h-6 w-6" /> : <MapPinIcon className="h-5 w-5" />}
                        </div>
                        <span className="ml-2 text-white font-medium">Delivery</span>
                    </div>
                    <div className={`w-24 h-1 mx-4 rounded ${step === 'review' ? 'bg-[#4ADE80]' : 'bg-[#27272a]'}`}></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'review' ? 'bg-[#4ADE80] text-black' : 'bg-[#27272a] text-gray-500'}`}>
                            <CreditCardIcon className="h-5 w-5" />
                        </div>
                        <span className={`ml-2 font-medium ${step === 'review' ? 'text-white' : 'text-gray-500'}`}>Review & Pay</span>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-[#121212] rounded-2xl p-12 text-center border border-[#27272a]">
                        <ShoppingBagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Your basket is empty</h2>
                        <p className="text-gray-400">Add some items to continue</p>
                    </div>
                ) : (
                    <div className="lg:flex gap-6">
                        {/* Main Content */}
                        <div className="flex-grow">
                            {/* Step 1: Address Selection */}
                            {step === 'address' && (
                                <div className="bg-[#121212] rounded-2xl p-6 border border-[#27272a] space-y-6">
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <MapPinIcon className="h-6 w-6 text-[#4ADE80] mr-2" />
                                        Select Delivery Address
                                    </h2>

                                    {loadingAddresses ? (
                                        <div className="py-8 text-center text-gray-500">Loading addresses...</div>
                                    ) : (
                                        <>
                                            {/* Saved Addresses */}
                                            {savedAddresses.length > 0 && (
                                                <div className="space-y-3">
                                                    {savedAddresses.map((addr) => (
                                                        <label
                                                            key={addr.id}
                                                            className={`block p-4 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr.id
                                                                    ? 'border-[#4ADE80] bg-[#4ADE80]/5'
                                                                    : 'border-[#27272a] hover:border-[#4ADE80]/50'
                                                                }`}
                                                        >
                                                            <div className="flex items-start">
                                                                <input
                                                                    type="radio"
                                                                    name="address"
                                                                    checked={selectedAddressId === addr.id}
                                                                    onChange={() => handleAddressSelection(addr)}
                                                                    className="mt-1 mr-3 accent-[#4ADE80]"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-sm font-bold text-[#4ADE80]">{addr.label}</span>
                                                                        {addr.is_default && (
                                                                            <span className="px-2 py-0.5 bg-[#4ADE80]/20 text-[#4ADE80] text-xs rounded-full">
                                                                                Default
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-white">{addr.full_address}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {addr.city} • {addr.postal_code}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add New Address */}
                                            {showNewAddressForm ? (
                                                <AddressForm
                                                    onAddressSelect={handleNewAddressSelect}
                                                    onCancel={() => setShowNewAddressForm(false)}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setShowNewAddressForm(true)}
                                                    className="w-full p-4 border border-dashed border-[#27272a] rounded-xl text-gray-400 hover:border-[#4ADE80] hover:text-[#4ADE80] transition-colors flex items-center justify-center"
                                                >
                                                    <PlusIcon className="h-5 w-5 mr-2" />
                                                    Add New Address
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Continue Button */}
                                    <button
                                        onClick={() => setStep('review')}
                                        disabled={!canProceed}
                                        className={`w-full py-4 rounded-xl font-bold text-sm transition-colors ${canProceed
                                                ? 'bg-[#4ADE80] text-black hover:bg-[#45c975]'
                                                : 'bg-[#27272a] text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Continue to Review
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Review & Pay */}
                            {step === 'review' && (
                                <div className="space-y-6">
                                    {/* Selected Address Summary */}
                                    <div className="bg-[#121212] rounded-2xl p-6 border border-[#27272a]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-bold text-[#4ADE80] uppercase tracking-wider mb-2">
                                                    Delivering To
                                                </h3>
                                                <p className="text-white">{selectedAddress?.full_address}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {selectedAddress?.city} • {selectedAddress?.postal_code}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setStep('address')}
                                                className="text-sm text-[#4ADE80] hover:underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-[#121212] rounded-2xl p-6 border border-[#27272a]">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            Order Items ({totalItems})
                                        </h3>
                                        <div className="space-y-4">
                                            {cart.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-[#27272a] last:border-none last:pb-0">
                                                    <div className="bg-white/5 rounded-xl p-2 h-20 w-20 flex items-center justify-center flex-shrink-0">
                                                        <img
                                                            src={item.image_url || "https://placehold.co/100x100"}
                                                            alt={item.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-white font-bold">
                                                        R {((item.price * item.quantity) / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-[350px] mt-6 lg:mt-0">
                            <div className="bg-[#121212] p-6 rounded-2xl border border-[#27272a] sticky top-6">
                                <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>R {(total / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-[#4ADE80]">FREE</span>
                                    </div>
                                    <div className="border-t border-[#27272a] pt-3 flex justify-between text-white font-bold text-lg">
                                        <span>Total</span>
                                        <span>R {(total / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                {step === 'review' && (
                                    <button
                                        role="link"
                                        disabled={loading}
                                        onClick={handlePaystackPayment}
                                        className={`w-full rounded-xl font-bold mt-6 py-4 px-4 text-sm shadow-lg transition-colors ${loading
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                : 'bg-[#4ADE80] hover:bg-[#3ec46d] text-black shadow-[#4ADE80]/20'
                                            }`}
                                    >
                                        {loading ? "Processing..." : "Pay with Paystack"}
                                    </button>
                                )}

                                {step === 'address' && (
                                    <div className="mt-6 text-center text-xs text-gray-500">
                                        Select an address to continue
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
