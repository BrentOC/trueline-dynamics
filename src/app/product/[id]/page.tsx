import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/solid';
import ProductActions from '@/components/ProductActions';

// Force dynamic rendering so we always get fresh data (or use revalidate)
export const dynamic = 'force-dynamic';

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    // Parse specifications if they exist (assuming JSONB or simple text)
    // For now, we'll display them if they are in the description or a specific field
    // In a real app, you'd have a 'specifications' column.

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white text-sm">
            {/* Breadcrumb / Top Bar (Optional, simpler for now) */}
            <div className="border-b border-[#27272a] bg-[#121212] py-3 px-6 mb-6">
                <span className="text-gray-500">Products</span> <span className="text-gray-600 mx-2">/</span> <span className="text-[#4ADE80]">{product.category || 'Tools'}</span>
            </div>

            <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-9 gap-10">

                {/* Left Column: Images */}
                <div className="lg:col-span-4">
                    <div className="relative w-full h-96 lg:h-[500px] border border-[#27272a] rounded-2xl bg-[#121212] flex items-center justify-center p-8 overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-[#4ADE80]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <Image
                            src={product.image_url || 'https://via.placeholder.com/500'}
                            alt={product.name}
                            fill
                            className="object-contain p-4 z-10 drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Middle Column: Details */}
                <div className="lg:col-span-3 space-y-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight leading-snug">{product.name}</h1>
                    <div className="text-sm text-gray-400">Category: <span className="text-[#4ADE80] font-medium">{product.category || 'Industrial Tools'}</span></div>

                    <div className="border-t border-[#27272a] py-6 my-6">
                        <p className="text-gray-300 leading-relaxed text-base">{product.description}</p>
                    </div>

                    {/* Specifications Section */}
                    <div className="bg-[#121212] rounded-xl p-5 border border-[#27272a]">
                        <h3 className="font-bold text-white mb-4 flex items-center">
                            <span className="w-1 h-5 bg-[#4ADE80] rounded-full mr-3"></span>
                            Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Placeholder specs - in real app, map through product.specs */}
                            <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Material</span> <span className="font-medium text-gray-200">Carbide</span></div>
                            <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Coating</span> <span className="font-medium text-gray-200">TiAlN</span></div>
                            <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Shank</span> <span className="font-medium text-gray-200">Standard</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Buy Box */}
                <div className="lg:col-span-2">
                    <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-6 shadow-2xl sticky top-24">
                        <div className="text-3xl font-bold text-white mb-2">
                            R {(product.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mb-6 font-medium">
                            + Free Shipping on orders over R1000
                        </div>

                        <div className="text-[#4ADE80] font-bold text-sm mb-6 flex items-center bg-[#4ADE80]/10 py-2 px-3 rounded-lg border border-[#4ADE80]/20 w-fit">
                            <CheckIcon className="h-4 w-4 mr-2" /> In Stock
                        </div>

                        <ProductActions product={product} />

                        <div className="text-xs text-gray-500 mt-6 space-y-2 border-t border-[#27272a] pt-4">
                            <div className="flex justify-between"><span>Ships from</span> <span className="text-white">TrueLine</span></div>
                            <div className="flex justify-between"><span>Sold by</span> <span className="text-white">TrueLine Dynamics</span></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
