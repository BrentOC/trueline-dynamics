// src/components/Header.tsx
"use client";

import { ShoppingCartIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import AuthButton from './AuthButton'; // <--- Import the new button

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header className="sticky top-0 z-50">
            <div className="flex items-center bg-[#131921] p-1 flex-grow py-2">

                <div className="mt-2 flex items-center flex-grow sm:flex-grow-0 mx-4">
                    <Link href="/" className="text-white font-bold text-2xl cursor-pointer">
                        TrueLine
                    </Link>
                </div>

                <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500 ml-4 max-w-3xl">
                    <input
                        className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
                        type="text"
                        placeholder="Search for end mills, inserts, drills..."
                    />
                    <MagnifyingGlassIcon className="h-12 p-4" />
                </div>

                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    {/* Auth Button Placed Here */}
                    <AuthButton />

                    <Link href="/checkout">
                        <div className="relative link flex items-center cursor-pointer hover:underline">
                            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
                                {totalItems}
                            </span>
                            <ShoppingCartIcon className="h-10" />
                            <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4 p-2 pl-6 bg-[#232f3e] text-white text-sm font-semibold overflow-x-scroll scrollbar-hide">
                <p className="link flex items-center cursor-pointer hover:underline">
                    <Bars3Icon className="h-6 mr-1" /> All
                </p>
                <p className="cursor-pointer hover:underline">Milling</p>
                <p className="cursor-pointer hover:underline">Turning</p>
                <p className="cursor-pointer hover:underline">Drilling</p>
                <p className="cursor-pointer hover:underline">Specials</p>
            </div>
        </header>
    )
}