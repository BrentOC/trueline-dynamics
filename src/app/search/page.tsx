import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Force dynamic rendering for search results
export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, category } = await searchParams;
    const supabase = await createClient();

    let query = supabase.from('products').select('*');

    if (q) {
        // Simple text search on name or description
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (category) {
        // Use ILIKE for case-insensitive matching which is safer
        query = query.ilike('category', category);
    }

    const { data: products } = await query;
    const productCount = products?.length || 0;

    const categories = [
        { name: 'End Mills', href: '/search?category=End Mills' },
        { name: 'Inserts', href: '/search?category=Inserts' },
        { name: 'Drills', href: '/search?category=Drills' },
        { name: 'Holders', href: '/search?category=Holders' },
    ];

    return (
        <div className="bg-[#050505] min-h-screen">
            {/* Header / Breadcrumb Area */}
            <div className="bg-[#121212] border-b border-[#27272a] py-8">
                <div className="max-w-screen-2xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {category ? category : (q ? `Results for "${q}"` : 'Shop All Products')}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {productCount} {productCount === 1 ? 'product' : 'products'} found
                    </p>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto p-6 flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                    <div className="bg-[#121212] rounded-xl p-6 border border-[#27272a]">
                        <h3 className="font-bold text-white text-lg mb-4 border-b border-[#27272a] pb-2">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/search"
                                    className={`block py-1 hover:text-[#4ADE80] transition-colors ${!category ? 'text-[#4ADE80] font-bold' : 'text-gray-400'}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li key={c.name}>
                                    <Link
                                        href={c.href}
                                        className={`block py-1 hover:text-[#4ADE80] transition-colors ${category === c.name ? 'text-[#4ADE80] font-bold' : 'text-gray-400'}`}
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#121212] rounded-xl p-6 border border-[#27272a]">
                        <h3 className="font-bold text-white text-lg mb-4 border-b border-[#27272a] pb-2">Price Range</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {/* Placeholder filters - in real app would verify logic */}
                            <li><Link href="#" className="block py-1 hover:text-white">Under R500</Link></li>
                            <li><Link href="#" className="block py-1 hover:text-white">R500 - R1500</Link></li>
                            <li><Link href="#" className="block py-1 hover:text-white">R1500 - R3000</Link></li>
                            <li><Link href="#" className="block py-1 hover:text-white">R3000+</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Main Results */}
                <div className="flex-grow">
                    {productCount > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products?.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#121212] rounded-2xl border border-[#27272a] text-center">
                            <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                We couldn't find matches for "{q || category}". Try checking your spelling or browsing all categories.
                            </p>
                            <Link href="/search" className="px-6 py-2 bg-[#4ADE80] text-black font-bold rounded-lg hover:bg-[#3ec46d] transition-colors">
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
