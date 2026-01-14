import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { CubeIcon, CreditCardIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

export default async function AccountPage() {
    const supabase = await createClient();
    // In a real app, you'd fetch the user's profile and orders here
    // const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="max-w-screen-xl mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-normal mb-6">Your Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Orders */}
                <Link href="/orders" className="block group">
                    <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors h-full">
                        <div className="p-2">
                            <CubeIcon className="h-10 w-10 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 group-hover:underline">Your Orders</h2>
                            <p className="text-sm text-gray-500">Track, return, or buy things again</p>
                        </div>
                    </div>
                </Link>

                {/* Login & Security */}
                <Link href="#" className="block group">
                    <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors h-full">
                        <div className="p-2">
                            <UserIcon className="h-10 w-10 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 group-hover:underline">Login & security</h2>
                            <p className="text-sm text-gray-500">Edit login, name, and mobile number</p>
                        </div>
                    </div>
                </Link>

                {/* Addresses */}
                <Link href="#" className="block group">
                    <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors h-full">
                        <div className="p-2">
                            <MapPinIcon className="h-10 w-10 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 group-hover:underline">Your Addresses</h2>
                            <p className="text-sm text-gray-500">Edit addresses for orders and gifts</p>
                        </div>
                    </div>
                </Link>

                {/* Payments */}
                <Link href="#" className="block group">
                    <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors h-full">
                        <div className="p-2">
                            <CreditCardIcon className="h-10 w-10 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 group-hover:underline">Your Payments</h2>
                            <p className="text-sm text-gray-500">Manage payment methods and settings</p>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
