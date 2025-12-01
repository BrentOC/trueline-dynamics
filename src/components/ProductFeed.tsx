// src/components/ProductFeed.tsx
import { createClient } from '@/utils/supabase/server';
import ProductCard from './ProductCard';

export default async function ProductFeed() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true }); // Good practice to order items

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
        {/* Grid Layout: Responsive (1 col mobile, 2 col tablet, 3 col desktop, 4 col large screen) */}
        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 -mt-10 relative z-20">
            
            {/* Map through the products and render a card for each */}
            {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}

            {/* Empty State Message */}
            {products?.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                    No products found.
                </div>
            )}
        </div>
    </div>
  );
}