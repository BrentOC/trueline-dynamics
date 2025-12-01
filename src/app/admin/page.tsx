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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}