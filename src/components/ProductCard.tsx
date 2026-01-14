// src/components/ProductCard.tsx
"use client";

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string | null;
  specifications: any;
  stock_quantity: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const image = product.image_url || "https://placehold.co/400x400?text=TrueLine+Tool";

  return (
    <div className="relative flex flex-col m-5 bg-[#121212] z-30 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-[#4ADE80]/50 transition-all duration-300 border border-[#27272a] group">

      <p className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-1 rounded-full border border-[#4ADE80]/20">{product.category}</p>

      <Link href={`/product/${product.id}`} className="block">
        <div className="flex justify-center mb-6 mt-2 relative cursor-pointer">
          {/* Glow effect back */}
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-75 group-hover:bg-white/10 transition-all"></div>
          <img src={image} alt={product.name} className="h-44 w-44 object-contain relative z-10 drop-shadow-lg" />
        </div>

        <h4 className="my-2 font-bold text-lg text-white leading-tight hover:text-[#4ADE80] transition-colors">{product.name}</h4>
      </Link>

      {/* Specs Grid */}
      <div className="bg-[#18181b] p-3 rounded-xl mb-6 text-xs text-gray-400 grid grid-cols-2 gap-y-2 gap-x-2 border border-[#27272a]">
        <p><span className="font-bold text-gray-300">Dia:</span> {product.specifications?.cut_diameter || 'N/A'}</p>
        <p><span className="font-bold text-gray-300">Shank:</span> {product.specifications?.shank_diameter || 'N/A'}</p>
        <p><span className="font-bold text-gray-300">Flutes:</span> {product.specifications?.flutes || 'N/A'}</p>
        <p><span className="font-bold text-gray-300">Coat:</span> {product.specifications?.coating || 'Uncoated'}</p>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-extrabold text-white">R {product.price}</p>
          {product.stock_quantity > 0 ? (
            <span className="text-[10px] text-[#4ADE80] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span> In Stock
            </span>
          ) : (
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking add to cart
            addToCart(product);
          }}
          className="w-full h-11 bg-[#4ADE80] text-black rounded-xl font-bold text-sm hover:bg-[#45c975] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Basket
        </button>
      </div>
    </div>
  );
}