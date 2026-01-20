import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        // 1. Verify Paystack Signature (Security)
        const secret = process.env.PAYSTACK_SECRET_KEY as string;
        const signature = request.headers.get('x-paystack-signature');

        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.error("PAYSTACK_SECRET_KEY is not defined");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const bodyArrayBuffer = await request.arrayBuffer();
        const bodyBuffer = Buffer.from(bodyArrayBuffer);
        const bodyString = bodyBuffer.toString();

        const hash = crypto.createHmac('sha512', secret)
            .update(bodyBuffer)
            .digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
        }

        const event = JSON.parse(bodyString);

        if (event.event === 'charge.success') {
            const { data } = event;
            const { reference, metadata, customer, amount } = data;

            // Validate metadata
            const cartItems = metadata?.cart_items || [];
            const userId = metadata?.user_id || null;

            if (cartItems.length === 0) {
                return NextResponse.json({ received: true, message: 'No items in metadata' });
            }

            // Initialize Secure Client
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // 2. Atomic Order Fulfillment (RPC)
            // This replaces the complex manual queries with one safe transaction
            const { data: rpcResult, error } = await supabase.rpc('fulfill_order', {
                p_payment_ref: reference,
                p_user_id: userId,
                p_user_email: customer.email,
                p_amount: amount / 100, // ZAR
                p_items: cartItems
            });

            if (error) {
                console.error("RPC Error:", error);
                throw error;
            }

            // 3. Handle Results
            const status = rpcResult.status;

            if (status === 'SUCCESS') {
                return NextResponse.json({ received: true });
            } else if (status === 'ALREADY_EXISTS') {
                return NextResponse.json({ received: true, message: 'Order already processed' });
            } else if (status === 'OVERSOLD') {
                console.error("CRITICAL: Order OVERSOLD", reference);
                // Here you would trigger an alert or save to a 'manual_review' table
                // For now, we return 200 so Paystack stops retrying, but we log loud.
                return NextResponse.json({ received: true, warning: 'Oversold inventory' });
            } else {
                throw new Error(`Unknown RPC Status: ${status}`);
            }
        }

        return NextResponse.json({ received: true, message: 'Event ignored' });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
