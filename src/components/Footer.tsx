"use client";

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#121212] text-gray-300 mt-20 border-t border-[#27272a]">
            {/* Back to Top */}
            <div
                className="bg-[#18181b] hover:bg-[#27272a] py-4 text-center cursor-pointer transition-colors border-b border-[#27272a]"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <span className="text-sm font-bold text-[#4ADE80] uppercase tracking-wider">Back to top</span>
            </div>

            {/* Links Section */}
            <div className="max-w-screen-xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                <div className="space-y-6">
                    <h3 className="font-bold text-white text-base">Get to Know Us</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">About TrueLine Dynamics</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Investor Relations</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-white text-base">Make Money with Us</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Sell products on TrueLine</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Sell on TrueLine Business</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Become an Affiliate</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Advertise Your Products</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-white text-base">TrueLine Payment Products</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">TrueLine Business Card</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Shop with Points</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Reload Your Balance</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-white text-base">Let Us Help You</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Your Account</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Your Orders</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Shipping Rates & Policies</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Returns & Replacements</Link></li>
                        <li><Link href="#" className="hover:text-[#4ADE80] transition-colors">Help</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#27272a] bg-[#0a0a0a] py-8 text-center">
                <div className="flex justify-center items-center gap-8 mb-4">
                    <div className="flex items-baseline">
                        <span className="text-white font-extrabold text-xl tracking-tighter">TrueLine</span>
                        <span className="text-[#4ADE80] font-extrabold text-xl ml-1 tracking-tighter italic">Dynamics</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">© 1996-2024, TrueLine Dynamics, Inc. or its affiliates</p>
            </div>
        </footer>
    );
}
