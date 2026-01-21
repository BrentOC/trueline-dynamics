// src/components/Header.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthButton from './AuthButton';

export default function Header() {
    const { totalItems } = useCart();
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#27272a]">
            {/* Top Nav */}
            <div className="flex items-center p-3 flex-grow max-w-[1400px] mx-auto w-full">

                {/* Logo */}
                <div className="flex items-center flex-grow sm:flex-grow-0 mr-8 h-full">
                    <Link href="/" className="flex items-center h-full">
                        <div className="flex items-baseline cursor-pointer select-none group">
                            <span className="text-white font-extrabold text-2xl tracking-tighter group-hover:text-gray-200 transition-colors">TrueLine</span>
                            <span className="text-[#4ADE80] font-extrabold text-2xl ml-1 tracking-tighter italic group-hover:text-[#3ec46d] transition-colors">Dynamics</span>
                        </div>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden sm:flex items-center h-11 rounded-full flex-grow cursor-pointer bg-[#121212] border border-[#27272a] hover:border-[#4ADE80] transition-colors overflow-hidden mx-4 max-w-2xl">
                    <form onSubmit={handleSearch} className="flex flex-grow h-full items-center">
                        <select className="h-full px-4 bg-transparent text-xs text-gray-400 focus:outline-none border-r border-[#27272a] hover:text-white cursor-pointer">
                            <option>All</option>
                            <option>End Mills</option>
                            <option>Inserts</option>
                        </select>
                        <input
                            className="p-2 h-full flex-grow flex-shrink focus:outline-none px-4 bg-transparent text-white placeholder-gray-500 text-sm"
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="h-9 w-9 mr-1 rounded-full bg-[#4ADE80] flex items-center justify-center text-black hover:bg-[#3ec46d] transition-colors">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>

                {/* Right Side Icons */}
                <div className="text-white flex items-center text-sm space-x-6 ml-auto whitespace-nowrap">

                    {/* Auth Button */}
                    <AuthButton />

                    <Link href="/account/orders" className="link hidden md:block text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <p className="text-xs">Returns</p>
                        <p className="font-bold">& Orders</p>
                    </Link>

                    <Link href="/checkout" className="relative link flex items-center group">
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#4ADE80] text-center rounded-full text-black text-xs font-bold flex items-center justify-center">
                            {totalItems}
                        </span>
                        <ShoppingCartIcon className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors" />
                        <p className="hidden md:inline font-bold ml-2 text-gray-400 group-hover:text-white transition-colors">Cart</p>
                    </Link>
                </div>
            </div>

            {/* Bottom Nav (Optional - keeping simplified) */}
            <div className="flex items-center space-x-6 px-4 py-2 bg-[#121212] border-b border-[#27272a] text-sm max-w-[1400px] mx-auto w-full">
                <p className="flex items-center text-white font-bold cursor-pointer hover:text-[#4ADE80] transition-colors">
                    <Bars3Icon className="h-6 w-6 mr-2" />
                    All Categories
                </p>
                <Link href="/search?category=End Mills" className="text-gray-400 hover:text-[#4ADE80] transition-colors">End Mills</Link>
                <Link href="/search?category=Inserts" className="text-gray-400 hover:text-[#4ADE80] transition-colors">Inserts</Link>
                <Link href="#" className="text-gray-400 hover:text-[#4ADE80] transition-colors">New Arrivals</Link>
                <Link href="#" className="text-gray-400 hover:text-[#4ADE80] transition-colors">Deals</Link>
            </div>
        </header>
    );
}
