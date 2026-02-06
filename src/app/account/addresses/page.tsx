'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { MapPinIcon, PlusIcon, TrashIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import AddressForm from '@/components/AddressForm';

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
    created_at: string;
}

export default function AddressesPage() {
    const supabase = createClient();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [label, setLabel] = useState('Home');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAddresses(data);
        }
        setLoading(false);
    };

    const handleAddressSelect = async (addressData: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('Please log in to save addresses');
            return;
        }

        if (editingAddress) {
            // Update existing
            const { error } = await supabase
                .from('addresses')
                .update({
                    label,
                    ...addressData,
                })
                .eq('id', editingAddress.id);

            if (error) {
                alert('Failed to update address: ' + error.message);
                return;
            }
        } else {
            // Insert new
            const isFirst = addresses.length === 0;
            const { error } = await supabase
                .from('addresses')
                .insert({
                    user_id: user.id,
                    label,
                    ...addressData,
                    is_default: isFirst, // First address is default
                });

            if (error) {
                alert('Failed to save address: ' + error.message);
                return;
            }
        }

        setShowForm(false);
        setEditingAddress(null);
        setLabel('Home');
        fetchAddresses();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Failed to delete address: ' + error.message);
            return;
        }

        fetchAddresses();
    };

    const handleSetDefault = async (id: number) => {
        const { error } = await supabase.rpc('set_default_address', { p_address_id: id });

        if (error) {
            alert('Failed to set default: ' + error.message);
            return;
        }

        fetchAddresses();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <MapPinIcon className="h-8 w-8 text-[#4ADE80] mr-3" />
                        Your Addresses
                    </h1>
                    <p className="text-gray-400 mt-1">Manage your delivery addresses</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center px-4 py-2 bg-[#4ADE80] text-black rounded-full font-bold text-sm hover:bg-[#45c975] transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Address
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="mb-6 space-y-4">
                    <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-4">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block">
                            Address Label
                        </label>
                        <div className="flex gap-2">
                            {['Home', 'Work', 'Office', 'Other'].map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLabel(l)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${label === l
                                            ? 'bg-[#4ADE80] text-black'
                                            : 'bg-[#27272a] text-white hover:bg-[#3f3f46]'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                    <AddressForm
                        onAddressSelect={handleAddressSelect}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingAddress(null);
                        }}
                        initialAddress={editingAddress}
                    />
                </div>
            )}

            {/* Address List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-12 text-center">
                    <MapPinIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No saved addresses yet</p>
                    <p className="text-gray-500 text-sm mt-1">Add an address to speed up checkout</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`bg-[#121212] border rounded-2xl p-5 transition-colors ${addr.is_default ? 'border-[#4ADE80]/50' : 'border-[#27272a]'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-[#4ADE80]">{addr.label}</span>
                                        {addr.is_default && (
                                            <span className="px-2 py-0.5 bg-[#4ADE80]/20 text-[#4ADE80] text-xs rounded-full font-medium">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white font-medium">{addr.full_address}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                        <span>City: {addr.city}</span>
                                        <span>Postal: {addr.postal_code}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="p-2 text-gray-400 hover:text-[#4ADE80] hover:bg-[#4ADE80]/10 rounded-lg transition-all"
                                            title="Set as Default"
                                        >
                                            <StarIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    {addr.is_default && (
                                        <div className="p-2 text-[#4ADE80]" title="Default Address">
                                            <StarSolidIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete Address"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
