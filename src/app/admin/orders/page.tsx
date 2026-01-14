export default function AdminOrdersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Orders</h1>
            <div className="bg-[#121212] p-8 rounded-2xl shadow-lg border border-[#27272a] text-center">
                <div className="mx-auto w-16 h-16 bg-[#27272a] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Orders Yet</h3>
                <p className="text-gray-400">Order management functionality is coming soon.</p>
            </div>
        </div>
    );
}
