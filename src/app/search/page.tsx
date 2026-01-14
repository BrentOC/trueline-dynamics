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
        query = query.eq('category', category);
    }

    const { data: products } = await query;

    return (
        <div className="max-w-screen-2xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Categories</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li><Link href="/search?category=End Mills" className="hover:text-blue-600">End Mills</Link></li>
                            <li><Link href="/search?category=Inserts" className="hover:text-blue-600">Inserts</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">Price</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li><Link href="#" className="hover:text-blue-600">Under $25</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">$25 to $50</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">$50 to $100</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">$100 & Above</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Main Results */}
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold mb-4">
                        {q ? `Results for "${q}"` : 'All Products'}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products?.length === 0 && (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-semibold text-gray-600">No results found.</h2>
                            <p className="text-gray-500">Try checking your spelling or use different keywords.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
