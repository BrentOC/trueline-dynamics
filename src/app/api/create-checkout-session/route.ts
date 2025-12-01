// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { items, email } = await request.json();

        // 1. Calculate total amount in CENTS (ZAR 1.00 = 100 cents)
        const totalAmount = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        const amountInCents = totalAmount * 100;

        // 2. Initialize Paystack Transaction
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                // Use the SECRET key for the backend call
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                amount: amountInCents,
                currency: 'ZAR',
                callback_url: `${request.headers.get("origin")}/success`, // Redirects to our success page
                metadata: {
                    cart_items: items.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity
                    }))
                }
            }),
        });

        const data = await response.json();

        if (!data.status) {
            // This catches errors like invalid keys or invalid email format
            throw new Error(data.message || 'Paystack initialization failed.');
        }

        // 3. Return the authorization URL to the frontend
        return NextResponse.json({ url: data.data.authorization_url });

    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}