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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
