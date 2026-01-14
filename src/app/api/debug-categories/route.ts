
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const { data: products, error } = await supabase.from('products').select('category, name');

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    const categories = [...new Set(products?.map(p => p.category))];
    return NextResponse.json({
        count: products?.length,
        categories,
        products: products?.slice(0, 5) // Show first 5 products
    });
}
