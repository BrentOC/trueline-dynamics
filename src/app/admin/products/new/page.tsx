"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline'; // Adjust import if needed
import Link from 'next/link';

export default function AddProductPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Controlled inputs need initial values to avoid React warnings and blocking
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'End Mills',
        image: '',
        stock_quantity: '0',
        specifications: {
            material: 'Carbide',
            coating: 'TiAlN',
            shank: 'Standard'
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // console.log("Changing:", name, value); // Debugging
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specifications: { ...prev.specifications, [name]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!formData.name || !formData.price) {
                alert("Please fill in required fields.");
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('products').insert({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price) * 100, // Convert to cents/units
                category: formData.category,
                image_url: formData.image, // Fix: Map formData.image to db column 'image_url'
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                specifications: formData.specifications
                // Note: The 'api' schema handles the table location automatically via client config
            });

            if (error) throw error;

            alert('Product added successfully!');
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error("Submission Error:", error);
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/admin/products" className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Back to Products
            </Link>

            <div className="bg-[#121212] p-8 rounded-2xl shadow-lg border border-[#27272a]">
                <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                            placeholder="e.g. 5-Flute End Mill"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                            placeholder="Product details..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Price (ZAR)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Stock Quantity</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                required
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors cursor-pointer"
                        >
                            <option value="End Mills">End Mills</option>
                            <option value="Inserts">Inserts</option>
                            <option value="Drills">Drills</option>
                            <option value="Holders">Holders</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div className="border-t border-[#27272a] pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.specifications.material}
                                    onChange={handleSpecChange}
                                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Coating</label>
                                <input
                                    type="text"
                                    name="coating"
                                    value={formData.specifications.coating}
                                    onChange={handleSpecChange}
                                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shank</label>
                                <input
                                    type="text"
                                    name="shank"
                                    value={formData.specifications.shank}
                                    onChange={handleSpecChange}
                                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#4ADE80] text-black font-bold uppercase rounded-xl hover:bg-[#45c975] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


