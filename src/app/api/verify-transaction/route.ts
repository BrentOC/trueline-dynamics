// src/app/api/verify-transaction/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Initialize Supabase Client (Anon is fine for reading public/user data)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // 1. Verify with Paystack (Optional: Double check status)
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();

        if (!data.status || data.data.status !== 'success') {
            return NextResponse.json({ verified: false, message: "Payment verification failed or pending." });
        }

        // 2. Poll Supabase: Has the WEBHOOK created the order yet?
        // In a real frontend, you might poll this endpoint every 2s until success
        const { data: existingOrder, error } = await supabase
            .from('orders')
            .select('id')
            .eq('payment_ref', reference)
            .single();

        if (existingOrder) {
            return NextResponse.json({
                verified: true,
                message: 'Order confirmed!',
                orderId: existingOrder.id
            });
        }

        // If Paystack says success, but Webhook hasn't fired yet
        return NextResponse.json({
            verified: false,
            message: 'Payment received. Waiting for order confirmation...',
            pending: true
        });

    } catch (err: any) {
        console.error("Verification Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}