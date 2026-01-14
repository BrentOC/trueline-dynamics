<<<<<<< HEAD
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    CubeIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Total Sales */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] mr-4">
                        <CurrencyDollarIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Sales</p>
                        <p className="text-2xl font-bold text-white">$12,450.00</p>
                    </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mr-4">
                        <ShoppingBagIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Orders</p>
                        <p className="text-2xl font-bold text-white">156</p>
                    </div>
                </div>

                {/* Card 3: Total Products */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-[#27272a] flex items-center">
                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mr-4">
                        <CubeIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-white">48</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
                <div className="bg-[#121212] shadow-lg rounded-2xl border border-[#27272a] overflow-hidden">
                    <table className="min-w-full divide-y divide-[#27272a]">
                        <thead className="bg-[#18181b]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#121212] divide-y divide-[#27272a] text-sm">
                            {/* Mock Data */}
                            <tr className="hover:bg-[#1f1f22] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">#ORD-001</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">John Doe</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">Oct 24, 2024</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30">Completed</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">$120.50</td>
                            </tr>
                            <tr className="hover:bg-[#1f1f22] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">#ORD-002</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">Jane Smith</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">Oct 23, 2024</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Processing</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">$45.00</td>
                            </tr>
=======
// src/app/admin/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import DeleteProductButton from './DeleteProductButton';

export default async function AdminDashboard() {
    // The AdminLayout (Step 4) handles the security check here.

    const supabase = await createClient();

    // Fetch all products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#131921]">Admin Dashboard</h1>
                    <Link href="/admin/add-product">
                        <button className="flex items-center bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add New Product
                        </button>
                    </Link>
                </div>

                {/* Inventory Management Table */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={product.image_url || 'https://placehold.co/400'} className="h-10 w-10 object-contain rounded border" />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.stock_quantity > 0 ? (
                                            <span className="text-green-600 font-bold">{product.stock_quantity} units</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">R {product.price}</td>
                                    <td className="px-6 py-4 text-right flex justify-end space-x-4">
                                        {/* Edit Button (Placeholder) */}
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>

                                        {/* Delete Component */}
                                        <DeleteProductButton id={product.id} />
                                    </td>
                                </tr>
                            ))}
>>>>>>> ebb846f67a24ee5ffd3df94b8729b16f9f3aabdc
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> ebb846f67a24ee5ffd3df94b8729b16f9f3aabdc
