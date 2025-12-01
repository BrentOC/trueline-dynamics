// src/components/ProductCard.tsx
"use client";

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';

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
    <div className="relative flex flex-col m-5 bg-white z-30 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-100">
      
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">{product.category}</p>

      <div className="flex justify-center mb-4">
        <img src={image} alt={product.name} className="h-40 w-40 object-contain" />
      </div>

      <h4 className="my-3 font-bold text-lg text-gray-800 leading-tight">{product.name}</h4>

      {/* Specs Grid */}
      <div className="bg-gray-50 p-2 rounded-md mb-4 text-xs text-gray-600 grid grid-cols-2 gap-y-1">
        <p><span className="font-bold">Dia:</span> {product.specifications?.cut_diameter || 'N/A'}</p>
        <p><span className="font-bold">Shank:</span> {product.specifications?.shank_diameter || 'N/A'}</p>
        <p><span className="font-bold">Flutes:</span> {product.specifications?.flutes || 'N/A'}</p>
        <p><span className="font-bold">Coat:</span> {product.specifications?.coating || 'Uncoated'}</p>
      </div>

      <p className="text-xs text-gray-500 mb-4 line-clamp-2" title={product.description}>
        {product.description}
      </p>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4">
           <p className="text-xl font-extrabold text-[#131921]">R {product.price}</p>
           {product.stock_quantity > 0 ? (
               <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">In Stock</span>
           ) : (
               <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">Out of Stock</span>
           )}
        </div>

        <button 
            onClick={() => addToCart(product)}
            className="w-full h-10 bg-yellow-400 rounded-md font-bold text-sm hover:bg-yellow-500 active:ring-2 ring-yellow-600 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="h-4 w-4" />
          Add to Basket
        </button>
      </div>
    </div>
  );
}