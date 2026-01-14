// src/app/api/verify-transaction/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Bypasses RLS to ensure we can always write the order)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // 1. Verify with Paystack
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();

        if (!data.status || data.data.status !== 'success') {
            return NextResponse.json({ verified: false, message: "Payment verification failed." });
        }

        const { amount, metadata, customer } = data.data;

        // 2. CHECK: Has this order already been saved? (Prevent duplicates on refresh)
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('payment_ref', reference)
            .single();

        if (existingOrder) {
            return NextResponse.json({ verified: true, message: 'Order already recorded.' });
        }

        // 3. SAVE ORDER to Supabase
        // We get the cart items back from the Paystack metadata we sent earlier!
        const cartItems = metadata?.cart_items || [];
<<<<<<< HEAD
        const userId = metadata?.user_id || null;
=======
>>>>>>> ebb846f67a24ee5ffd3df94b8729b16f9f3aabdc

        // A. Insert into 'orders' table
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
<<<<<<< HEAD
                user_id: userId,
=======
>>>>>>> ebb846f67a24ee5ffd3df94b8729b16f9f3aabdc
                user_email: customer.email,
                amount: amount / 100, // Convert back from cents to Rands
                payment_ref: reference,
                status: 'paid'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // B. Insert into 'order_items' table
        const itemsToInsert = cartItems.map((item: any) => ({
            order_id: orderData.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: 0 // Ideally fetch this from DB, but for MVP we assume paid price is correct
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        // 4. Success!
        return NextResponse.json({
            verified: true,
            message: 'Order placed successfully!',
            orderId: orderData.id
        });

    } catch (err: any) {
        console.error("Verification Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}